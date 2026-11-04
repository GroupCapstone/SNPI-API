# Backend Kubernetes Deployment

These manifests deploy only the SNP-SMS Express API. The Next.js frontend is maintained and deployed from the separate `snp-sms-frontend` repository.

## Resources

- `namespace.yaml`: Dedicated `snp-sms` namespace.
- `configmap.yaml`: Non-secret backend environment parameters.
- `secrets.yaml.example`: Example keys for credentials managed as Kubernetes Secrets.
- `backend-deployment.yaml`: Express API deployment with health probes.
- `ingress.yaml`: HTTPS ingress for the backend API hostname.
- `hpa.yaml`: Backend horizontal pod autoscaler.
- `kustomization.yaml`: Kustomize resources for this backend deployment.

## Deploy

1. Create the namespace and configure real values in your secret manager or a private Kubernetes Secret. Never commit a populated secrets file.
2. Apply the backend resources with `kubectl apply -k infrastructure/k8s/`.
3. Verify `snp-sms-backend` rollout and API health. Frontend rollout and DNS are managed independently from the frontend repository.
