---
name: actions-runner-controller
description: Authoritative enterprise operational guide and infrastructure specification for deploying, scaling, and hardening Actions Runner Controller (ARC) on Kubernetes. Covers Helm deployment standards, custom runner images, tool caching, requests==limits QoS, DinD vs Kubernetes mode, zero spot instances, and multi-cluster HA.
---

# Actions Runner Controller (ARC) Enterprise Architecture & Deployment Standard

> Authoritative enterprise engineering specification for deploying, operating, and autoscaling self-hosted GitHub Actions runners on Kubernetes clusters using Actions Runner Controller (ARC).

---

## 1. Architectural Invariants & Production Gates

```
               [ GitHub Actions Cloud Control Plane ]
                                |
               (HTTPS Egress Polling / No Ingress)
                                v
               [ ARC Controller Manager (3 Replicas) ]
            (Dedicated Tainted Infra Nodes / No Runners)
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
  [ Scale Set: standard ]               [ Scale Set: dind ]
   (Requests == Limits)               (Privileged Sidecar Only)
  (Dedicated On-Demand)                 (Dedicated On-Demand)
```

1. **Zero Spot Instances Policy**: ARC does not support preemption or job interruption. Pod termination or node eviction produces stuck runners and corrupted build states. **All runner scale sets must strictly target on-demand or reserved node pools.**
2. **Explicit `template.spec` Mandate**: In production environments, `containerMode` must be commented out. Always define an explicit `template.spec` to control security contexts, resource requests, limits, and custom runner images.
3. **Guaranteed QoS (Requests Equal Limits)**: Container resource `requests` must equal `limits` (`requests.cpu == limits.cpu`, `requests.memory == limits.memory`). Overcommitting memory leads to non-recoverable OOMKills during parallel compile steps.
4. **Single Label Routing**: Each runner scale set must expose exactly one label (the `runnerScaleSetName`). Do not apply polymorphic labels to scale sets.
5. **Controller Isolation & Taints**: Deploy 3 replicas of the ARC controller manager on dedicated infrastructure nodes tainted to prevent runner pods from scheduling alongside the controller.
6. **Zero Ingress Architecture**: Runners poll GitHub's control plane over HTTPS. The Kubernetes cluster hosting ARC must have **zero public ingress ports**.
7. **Privilege Separation (DinD)**: When Docker is required, the DinD sidecar must run in an isolated privileged container while the runner container itself remains unprivileged (`runAsNonRoot: true`, `privileged: false`). Never share Docker daemons across runner pods.
8. **Ephemeral Runners**: Runners must terminate immediately after completing a single job (`minRunners: 0`, auto-reconcile) to prevent state leaks between builds.

---

## 2. Ten-Point Production Readiness Checklist

| # | Domain | Policy Requirement | Verification Check |
| :- | :--- | :--- | :--- |
| **01** | **Node Selection** | 100% On-Demand / Reserved nodes (no spot/preemptible) | Node affinity excludes `spot` |
| **02** | **Container Mode** | Explicit `template.spec` with `containerMode` commented out | Manifest validator Gate 1 |
| **03** | **QoS Class** | Resource `requests == limits` for CPU and memory | Manifest validator Gate 4 |
| **04** | **Job Routing** | Single `runnerScaleSetName` label per scale set | Unique scale set name |
| **05** | **Controller HA** | Controller deployment configured with 3 replicas | `replicaCount: 3` |
| **06** | **Taints/Tolerations**| Controller isolated from high-churn runner pods | Infra node taints applied |
| **07** | **Network Ingress** | Zero external ingress listeners into the cluster | Ingress controllers disabled |
| **08** | **Egress Sizing** | NAT gateways sized for peak concurrency image pulls | NAT gateway capacity check |
| **09** | **Credentials** | OIDC token authentication for cloud resources (no static keys) | OIDC role bindings |
| **10** | **Telemetry** | High-cardinality metrics disabled | Prometheus scrape config |

---

## 3. Scale Set T-Shirt Sizing Matrix

To optimize cluster utilization and avoid memory starvation, deploy multiple autoscaling runner sets sized to fit specific workload profiles:

| Profile | Scale Set Label | CPU Request / Limit | Memory Request / Limit | Target Workload |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | `snp-sms-runner-small` | `1000m` / `1000m` | `2048Mi` / `2048Mi` | Linting, typechecking, unit tests |
| **Standard** | `snp-sms-runner-standard` | `2000m` / `2000m` | `4096Mi` / `4096Mi` | Full test suite, Next.js builds |
| **Large** | `snp-sms-runner-large` | `4000m` / `4000m` | `8192Mi` / `8192Mi` | Docker image builds, multi-stage compilation |
| **DinD** | `snp-sms-runner-dind` | `2000m` + `1000m` (dind) | `4096Mi` + `2048Mi` (dind) | Containerized end-to-end testing |

---

## 4. Helm Deployment Standards

Install and upgrade ARC exclusively via official Helm charts. **Do not use GitOps engines (Flux/ArgoCD) for ARC controller upgrades**, as they can bypass critical CRD lifecycle sequencing.

```bash
# 1. Install Actions Runner Controller Operator
helm install arc \
  --namespace arc-systems \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller \
  --values templates/arc-controller-values.yaml

# 2. Deploy Autoscaling Runner Scale Set
helm install snp-sms-runners \
  --namespace arc-runners \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  --values templates/arc-runner-scaleset-values.yaml
```

---

## 5. Primary References & Templates

* **Authoritative Article Archive**: [`references/actions-runner-controller-article.md`](file:///Users/Apple16/.gemini/config/skills/actions-runner-controller/references/actions-runner-controller-article.md)
* **Controller Helm Values**: [`templates/arc-controller-values.yaml`](file:///Users/Apple16/.gemini/config/skills/actions-runner-controller/templates/arc-controller-values.yaml)
* **Runner Scale Set Values**: [`templates/arc-runner-scaleset-values.yaml`](file:///Users/Apple16/.gemini/config/skills/actions-runner-controller/templates/arc-runner-scaleset-values.yaml)
* **Hardened Runner Dockerfile**: [`templates/runner-dockerfile`](file:///Users/Apple16/.gemini/config/skills/actions-runner-controller/templates/runner-dockerfile)
* **Verification Script**: [`scripts/verify-arc-config.ts`](file:///Users/Apple16/.gemini/config/skills/actions-runner-controller/scripts/verify-arc-config.ts)
