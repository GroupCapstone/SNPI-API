# Deploying Actions Runner Controller (ARC)

> Authoritative reference article and enterprise operational guide for deploying, tuning, and scaling self-hosted GitHub Actions runners on Kubernetes using Actions Runner Controller (ARC).

---

## Scenario Overview

When making the decision to deploy self-hosted runners for GitHub Actions, organizations must consider how to best manage and scale those runners. The Actions Runner Controller (ARC) is an open-source project that provides a Kubernetes-based solution for deploying and managing self-hosted runners. This article outlines recommendations for deploying ARC in a scalable and maintainable manner.

> [!WARNING]
> Users are responsible for the security of their clusters and the workloads running on them. Securing a Kubernetes cluster, the underlying nodes, and the network resources is a complex task that requires expert-level knowledge. Ensure appropriate network segmentation and monitoring are in place, and follow zero-trust principles when granting access to resources. ARC does not provide any additional built-in security features beyond those provided by Kubernetes and the underlying infrastructure. Users are also responsible for any network ingress or egress costs associated with their self-hosted runners.

---

## Assumptions and Preconditions

* **Scaling Decisions Focus**: ARC follows Linux best practices, so it is optimized for a primary task: providing scaling decisions. All of the other functionality relies on Kubernetes. This includes orchestration/queuing, scheduling, scaling, and reliability. As a result, most issues users encounter with ARC are actually Kubernetes configuration or management issues.
* **CKA Expertise Required**: When considering ARC, it is essential to have someone on the team who has expert-level experience with administrating, tuning, scaling, and troubleshooting Kubernetes clusters. Preferably, this individual should be a Certified Kubernetes Administrator (CKA) and have hands-on experience optimizing and scaling stateful, job-based workloads.
* **No Preemption / No Spot Instances**: ARC does not support preemption or spot instances, and it assumes that once a runner is assigned a job, that job will complete without interruption. Running out of resources or having a node terminated can lead to failed jobs or "stuck" jobs which must wait for a timeout to recover.

---

## Key Implementation Strategies

### 1. Maintainability

* **Use Infrastructure as Code (IaC)**: Deploy ARC and your Kubernetes cluster using IaC tools (Helmfile, Terraform, ARM/Bicep, CloudFormation). This ensures consistency across environments, maintains multiple instances, and eliminates the need for backup solutions as entire configurations are stored in code.
* **Consider Multiple Clusters**: A single large node often costs more than starting a new cluster. Clusters have limits on supported resources and service requests, and are constrained by Kubernetes API server coordination. Multiple smaller clusters optimized for specific workloads are more efficient, cost-effective, and establish separate security boundaries. Multiple clusters are required to achieve high availability.
* **Use a Local Container Registry**: To reduce egress costs and improve performance, deploy a local container registry to cache frequently used images. Be aware that while GitHub-hosted runners have unlimited access to Docker Hub, self-hosted runners are subject to Docker Hub rate limits.
* **Avoid Spot Instances**: Spot instances can be terminated at any time, leading to job failure, partial execution, stuck runners, and scaling issues. ARC is not designed to handle interruptions or preemption, cannot suspend/resume jobs, and cannot drain runners gracefully on pending shutdown. Use on-demand or reserved instances.
* **ARC Should Be the Only Cluster Workload**: ARC is intended to run on dedicated clusters. Co-locating other workloads causes resource contention, performance degradation, and security vulnerabilities.
* **Automate Updates**: Regularly update ARC, Kubernetes, and the node OS with automated tools.
* **Use a Single Label**: Having a single label (such as the scaleset name) on your scale set makes it easier to reason about job assignment, analyze performance, and troubleshoot issues.

### 2. Create a Custom Image for Runners

While the default runner image is suitable for testing, custom images are essential for production workloads to minimize startup/execution times, reduce rate limiting, and ensure pre-baked dependencies:
* **Review Core Requirements**: Meet all documented self-hosted runner requirements.
* **Create an Actions Archive Cache**: Pre-cache the most frequently used Actions to speed up execution and avoid repeated downloads.
* **Create a Tool Cache**: Pre-populate platform tools and binaries locally on the runner image to eliminate runtime tool setup downloads.
* **Keep Runner Version Up-to-Date**: In GitHub Enterprise Cloud, self-hosted runners cannot be more than 30 days behind the latest version.

### 3. Configure Kubernetes for ARC

* **Start with a Vanilla Cluster**: Begin with a basic cluster with only vendor-provided logging. Tune Kubernetes to handle builds before adding admissions controllers or security scanning tools.
* **Avoid Ingress to the Cluster**: Runners must never be exposed to incoming traffic from the internet or other networks.
* **Prefer an Isolated Cluster**: Prefer network isolation over direct connection to internal or production resources. Use just-in-time (JIT) or zero-trust access.
* **Avoid Automatic Credentials**: Avoid pod- or cluster-managed identities when accessing production or development resources to prevent supply chain privilege escalation. Prefer OpenID Connect (OIDC) for temporary, scoped tokens.
* **Plan for Availability**: Deploy at least two clusters across different availability zones or regions for HA and disaster recovery. Note that the Actions control plane does not load-balance across clusters.
* **Allocate Sufficient IP Addresses**: Running out of pod IPs causes runners to fail or become unresponsive.
* **Size NAT Gateway Appropriately**: Runners egress to GitHub and external registries through NAT gateways; large workloads may require multiple NAT gateway instances.
* **Prefer Larger Nodes**: Larger nodes reduce scaling event frequency and Kubernetes API server traffic.
* **Pre-Scale with CronJobs**: Use CronJobs to pre-scale node pools before predictable business-hour peaks.

### 4. Enable Logging and Monitoring

* **Prefer Vendor Logging and Metrics**: Use cloud-native solutions (AWS CloudWatch/Container Insights, Azure Monitor/Container Insights/Managed Prometheus, GCP Cloud Logging/Cloud Monitoring).
* **Avoid High-Cardinality Metrics**: Do not incorporate dynamic job names or unique run identifiers into metric labels, as this degrades monitoring system performance.
* **Establish Baselines**: Identify healthy state baselines for logs and metrics to detect anomalies and configure alerts.
* **Configure Retention Policies**: Use shorter retention policies once stable to control costs.
* **Monitor Kubernetes Events and API Server**: Monitor scheduling events, node resource allocation, and API server audit logs.

### 5. Configure Actions Runner Controller

* **Prefer Helm for Installation**: Tools like Flux and ArgoCD are not supported or recommended for ARC installation and upgrades. Follow official Helm procedures.
* **Use the Latest Version of ARC**: Keep ARC up to date following documented upgrade paths.
* **Avoid Non-Linux Runners**: ARC is optimized exclusively for Linux. Windows and macOS runners are not supported by GitHub with ARC.
* **Tune Scale Sets**: Tune `runnerMaxConcurrentReconciles`, `k8sClientRateLimiterQPS`, and `k8sClientRateLimiterBurst` based on workload and cluster size.
* **T-Shirt Sizing for Scale Sets**: Deploy multiple scale sets with distinct CPU/memory resource allocations (e.g., small, medium, large) matching job requirements.
* **Resource Requests Equal Limits**: Set container resource `requests` equal to `limits`. Overcommitting memory leads to OOMKills, stuck runners, and failed jobs since ARC does not support preemption.
* **Configure 3 Controller Replicas**: Deploy 3 replicas of the controller manager for rapid failover during node disruptions.
* **Use Taints and Tolerations**: Taint controller nodes to prevent runner pods from scheduling on them.
* **Group Scale Sets by Trust Level**: The Kubernetes trust boundary is the cluster, not namespaces or pods. Workloads with different trust requirements must run on separate dedicated clusters.

---

## Container Mode & Sidecar Considerations

### Custom `template.spec` vs `containerMode`

> [!WARNING]
> ARC scales by requesting pods according to the provided `template.spec` or `containerMode` template. Using `containerMode` applies rigid, non-customizable templates that prevent setting fine-grained resource limits, security contexts, or custom runner images. It is only recommended for testing/PoC.

* **Production Recommendation**: Comment out `containerMode` and explicitly declare the runner specifications under `template.spec`.
* **Review Template Updates**: When upgrading ARC, review upstream container mode templates and backport improvements into your custom `template.spec`.

### Docker-in-Docker (DinD) Considerations

* DinD runs a privileged native sidecar container as root to host the Docker daemon.
* **Privileged vs Unprivileged**: DinD sidecar must run privileged; the runner container itself should remain unprivileged.
* **Prefer DinD over Kubernetes Mode**: DinD is simpler to operate, more reliable, and avoids the complexities of Kubernetes API container hooks.
* **Avoid Shared DinD**: Never share a Docker daemon between multiple runner pods.
* **Production Spec**: Comment out `containerMode: dind` and define both the runner container and `dind` sidecar explicitly in `template.spec`.

### Kubernetes Mode Considerations

* Kubernetes mode uses container hooks to create sibling worker pods using the Kubernetes API.
* **Elevated Privileges**: Runner pods require RBAC permissions to create pods, secrets, and PVCs in the cluster.
* **Storage Requirements**: Requires Persistent Volume Claims (PVC) or `kubernetes-novolume` (which requires running as root and degrades performance).
* **Docker Limitation**: Kubernetes mode does not support Docker CLI or Dockerfile actions directly; requires Kaniko for container image builds.
* **Always Require Job Container**: Never set `ACTIONS_RUNNER_REQUIRE_JOB_CONTAINER` to `false`. Allowing jobs to run directly on the elevated runner pod enables immediate cluster compromise.
