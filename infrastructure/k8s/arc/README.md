# Actions Runner Controller (ARC) Deployment for SNP-SMS

This directory contains the production-ready Helm value definitions and configuration manifests for deploying Actions Runner Controller on Kubernetes.

---

## Architecture Standards

1. **Dedicated On-Demand Nodes**: Zero spot/preemptible instances.
2. **Explicit `template.spec`**: `containerMode` is commented out to guarantee fine-grained security and resource limits.
3. **QoS Guaranteed**: Container resource `requests` strictly equal `limits`.
4. **HA Controller**: 3 controller replicas isolated on tainted infrastructure nodes.
5. **Deterministic Routing**: Distinct scale sets per workload:
   - `snp-sms-runner-standard`: 2 CPU / 4GB RAM for typecheck, lint, and Next.js builds.
   - `snp-sms-runner-dind`: 2 CPU + 1 CPU DinD / 6GB RAM for containerized E2E tests.

---

## Deployment Commands

```bash
# 1. Add Actions Runner Controller Chart Repository
helm repo add actions-runner-controller https://actions-runner-controller.github.io/actions-runner-controller
helm repo update

# 2. Deploy Controller Manager (Operator)
helm upgrade --install arc-controller \
  --namespace arc-systems \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller \
  --values arc-controller-values.yaml

# 3. Deploy Standard Runner Scale Set
helm upgrade --install snp-sms-runners-standard \
  --namespace arc-runners \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  --values arc-runner-scaleset-standard.yaml

# 4. Deploy DinD Runner Scale Set
helm upgrade --install snp-sms-runners-dind \
  --namespace arc-runners \
  --create-namespace \
  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set \
  --values arc-runner-scaleset-dind.yaml
```
