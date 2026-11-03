---
name: actions-private-networking
description: Authoritative enterprise operational guide and architectural specification for accessing private networks from GitHub Actions runners. Covers static IP larger runners, API Gateway with OIDC, Azure Private Networking (VNet injection), GitHub.Network/networkSettings subnet delegation, NSG vs. Azure Firewall FQDN filtering, and subnet capacity sizing (+20% buffer).
---

# GitHub Actions Private Networking & VNet Injection Standard

Authoritative enterprise operational guide and infrastructure specification for connecting GitHub Actions runners to private networks and on-premises infrastructure.

---

## 1. Solution Architecture Matrix

Organizations running GitHub Actions frequently require connectivity to private infrastructure (internal package registries, databases, Kubernetes clusters, on-premises datacenters) without exposing services to the public internet.

| Capability / Factor | Option 1: Static IP Larger Runners | Option 2: API Gateway with OIDC | Option 3: Azure Private Networking (VNet Injection) |
| :--- | :--- | :--- | :--- |
| **Connectivity Model** | Public internet via static CIDR | Public internet edge to API Gateway | Direct private VNet injection (No public ingress) |
| **Target Workload Type** | Any endpoint accepting public IPs | HTTP/REST/gRPC APIs with token validation | Any network protocol (TCP/UDP, DB, SSH, SMB, K8s) |
| **Runner Infrastructure** | GitHub-hosted larger runners | Standard or larger hosted runners | GitHub-hosted larger runners |
| **Inbound Firewall Holes** | Requires allowing static GitHub IP ranges | Requires edge gateway open to public IP ranges | **Zero inbound firewall exposure** |
| **On-Premises Reachability**| Complex NAT / VPN edge routing | Gateway proxy only | **Direct via ExpressRoute / VPN Gateway** |
| **Cloud Dependency** | None (Any cloud / on-prem firewall) | Edge Gateway provider | Microsoft Azure subscription required |
| **Configuration Complexity**| Low | Medium | High (Infrastructure as Code: Bicep / Terraform) |

---

## 2. Azure Private Networking Architecture (VNet Injection)

Azure Private Networking utilizes the **VNet Injection** pattern:
* **Separation of Planes**:
  * **Compute Plane**: Runner Virtual Machines remain hosted and managed in GitHub-owned multi-tenant secure infrastructure.
  * **Network Plane**: Runner Network Interface Cards (NICs) are dynamically injected into a customer-owned Azure VNet subnet.
* **Customer Control**:
  * All outbound network traffic originating from the runner traverses customer-controlled route tables, Network Security Groups (NSGs), Azure Firewalls, or ExpressRoute tunnels.
  * GitHub possesses zero visibility into customer internal network traffic.
* **Cost Allocation**:
  * GitHub owns and provisions the NIC resources at zero additional charge.
  * Customer is responsible for standard Azure VNet egress, VNet peering, ExpressRoute, VPN Gateway, and Azure Firewall inspection fees.

```
+-------------------------------------------------------------------------------+
| GitHub Hosted Infrastructure                                                  |
|   +-----------------------+                                                   |
|   |  Runner VM (Linux/Win)|                                                   |
|   +-----------+-----------+                                                   |
+---------------|---------------------------------------------------------------+
                | VNet Injection
+---------------v---------------------------------------------------------------+
| Customer Azure Virtual Network                                                |
|   +-----------------------------------------------------------------------+   |
|   | Delegated Subnet: GitHub.Network/networkSettings                      |   |
|   |   +-------------------+       +-------------------+                   |   |
|   |   |   Runner NIC #1   |  ...  |   Runner NIC #N   |                   |   |
|   |   +---------+---------+       +---------+---------+                   |   |
|   +-------------|---------------------------|-----------------------------+   |
|                 v                           v                                 |
|   +-----------------------------------------------------------------------+   |
|   | Network Access Control: Azure Firewall (FQDN) or NSG (IP Filter)      |   |
|   +--------------------+----------------------------------+---------------+   |
+------------------------|----------------------------------|-------------------+
                         v                                  v
              [On-Prem via ExpressRoute]        [GitHub & Public APIs]
              [Private DBs, Registries]         [github.com, *.blob]
```

---

## 3. Subnet Sizing Mathematical Formulation

GitHub Actions employs predictive scaling and warm-runner pooling. Runner NICs persist after workflow completion to serve subsequent jobs with near-zero cold-start latency. Additionally, runner replacement bursts can temporarily allocate excess NICs.

### Mathematical Invariant

$$\text{Usable Subnet IPs} \ge \text{Maximum Concurrency} \times 1.20$$

* **Azure Subnet Reservation**: Azure reserves $5$ IP addresses per subnet ($x.x.x.0$, $x.x.x.1$, $x.x.x.2$, $x.x.x.3$, $x.x.x.255$).
* **Usable Host Capacity**:

$$\text{Usable IPs} = 2^{(32 - \text{Prefix Length})} - 5$$

### Sizing Reference Table

| Runner Max Concurrency | Required Capacity (+20%) | Recommended Subnet CIDR | Total IPs | Usable IPs (Total - 5) | Safety Margin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10** | 12 | `/27` | 32 | 27 | +15 IPs |
| **25** | 30 | `/26` | 64 | 59 | +29 IPs |
| **50** | 60 | `/25` | 128 | 123 | +63 IPs |
| **100** | 120 | `/24` | 256 | 251 | +131 IPs |
| **200** | 240 | `/23` | 512 | 507 | +267 IPs |

---

## 4. 5-Step Deployment Lifecycle

1. **Register Resource Provider**:
   Register `GitHub.Network` in the target Azure Subscription:
   ```bash
   az provider register --namespace GitHub.Network
   ```
   *Creates two Enterprise Applications in Microsoft Entra ID: `GitHub CPS Network Service` and `GitHub Actions API`.*
2. **Create Delegated Subnet**:
   Configure subnet with delegation to `GitHub.Network/networkSettings`:
   ```bicep
   delegations: [
     {
       name: 'GitHubNetworkDelegation'
       properties: {
         serviceName: 'GitHub.Network/networkSettings'
       }
     }
   ]
   ```
3. **Retrieve GitHub Business ID**:
   Execute GraphQL query against GitHub API to fetch Enterprise/Organization Database ID:
   ```graphql
   query {
     enterprise(slug: "my-enterprise") {
       id
       databaseId
     }
   }
   ```
4. **Provision Network Settings Resource**:
   Deploy `GitHub.Network/networkSettings` linking the delegated subnet resource ID with GitHub business ID:
   ```bash
   az resource create \
     --resource-type "GitHub.Network/networkSettings" \
     --name "gh-actions-network-settings" \
     --resource-group "$RG_NAME" \
     --properties "{\"location\":\"$LOCATION\",\"properties\":{\"businessId\":\"$BUSINESS_ID\",\"subnetId\":\"$SUBNET_ID\"}}" \
     --is-full-object
   ```
5. **Configure GitHub Hosted Compute Networking**:
   In GitHub Enterprise / Organization settings:
   * Navigate to `Settings -> Actions -> Runner groups`.
   * Create or update Hosted Compute Networking configuration pointing to the Azure network settings resource.
   * Assign larger runners to the designated runner group.

---

## 5. Egress Security Filtering: NSG vs. Azure Firewall

### Comparison

| Metric | Azure Network Security Group (NSG) | Azure Firewall Application Rules |
| :--- | :--- | :--- |
| **Rule Definition** | Raw IP CIDR ranges | Fully Qualified Domain Names (FQDNs) |
| **Maintenance Burden** | High (GitHub IPs rotate frequently; requires dynamic `api.github.com/meta` syncing) | Low (Wildcard FQDNs match all rotating endpoints) |
| **Inspection Depth** | Layer 4 (Transport / IP / Port) | Layer 7 (TLS SNI inspection, URL filtering) |
| **Cost** | Free (Included with Azure VNet) | Hourly instance charge + data processing fees |

### Mandatory GitHub Actions Egress FQDN Whitelist

When configuring Azure Firewall or Layer 7 proxy filters, the following outbound FQDNs are mandatory:

```hcl
# Essential Runner Operation & Workflow Telemetry
"github.com",
"*.github.com",
"*.githubusercontent.com",
"*.blob.core.windows.net",

# Container Registries & Package Caching
"ghcr.io",
"*.ghcr.io",
"*.githubassets.com",

# Git Large File Storage (LFS)
"github-cloud.s3.amazonaws.com"
```

---

## 6. Runtime Scaling, Predictive Warming & Multi-AZ Resilience

* **Predictive Pre-Warming**: GitHub Actions orchestrator analyzes job submission queues and provisions runner NICs before workflows start.
* **Warm Pool Retention**: Runner NICs remain bound in the customer subnet after workflow completion to eliminate NIC initialization overhead on successive jobs.
* **Multi-Availability Zone Resilience**:
  * Runner VMs are distributed across all available AZs in the target Azure region.
  * In the event of a regional AZ failure, in-flight jobs in that specific AZ will fail, but new jobs will automatically route to surviving AZs.
  * Ensure the customer VNet subnet is provisioned across all regional AZs or zoned appropriately.

---

## 7. Limitations & Security Guardrails

1. **OS Support Limitation**: Azure Private Networking is supported **strictly on Linux and Windows runners**. macOS runners are **NOT supported**.
2. **Regional Constraints**: Feature availability is restricted to specific Azure regions. Verify region pairing if operating under GitHub Enterprise Cloud with Data Residency (GHE).
3. **Subnet Delegation Isolation**:
   * Azure Enterprise Applications (`GitHub CPS Network Service` and `GitHub Actions API`) hold subscription-level permissions strictly to facilitate delegation.
   * **Azure Fabric Boundary Guarantee**: GitHub services can **ONLY** interact with subnets explicitly delegated to `GitHub.Network/networkSettings`. GitHub cannot access, inspect, or modify any other virtual networks, subnets, or Azure resources.
4. **No Spot / Preemptible Instances**: GitHub hosted larger runners do not support preemption.

---

## 8. Enterprise 12-Point Verification Checklist

1. [ ] **Subnet Sizing**: Subnet usable IP count is $\ge \text{Max Concurrency} \times 1.20$.
2. [ ] **Subnet Delegation**: Subnet has explicit delegation to `GitHub.Network/networkSettings`.
3. [ ] **Resource Provider**: `GitHub.Network` registered in Azure subscription.
4. [ ] **Enterprise Apps**: `GitHub CPS Network Service` verified in Entra ID.
5. [ ] **OS Restriction**: Workflows target Linux or Windows larger runner tags (No macOS).
6. [ ] **Essential FQDNs**: `github.com`, `*.github.com`, `*.githubusercontent.com`, `*.blob.core.windows.net` permitted.
7. [ ] **Package Registry FQDNs**: `ghcr.io`, `*.ghcr.io`, `*.githubassets.com` permitted.
8. [ ] **Git LFS FQDN**: `github-cloud.s3.amazonaws.com` permitted on HTTPS 443.
9. [ ] **Route Table / NAT**: Egress to internet/firewall validated with valid default route (`0.0.0.0/0`).
10. [ ] **ExpressRoute / Peering**: Internal routes to on-premise private subnets advertised and routable.
11. [ ] **Business ID Mapping**: Verified `businessId` matches GitHub Organization database ID via GraphQL.
12. [ ] **Automated CI Validation**: Configuration verified via `npm run verify:private-network`.
