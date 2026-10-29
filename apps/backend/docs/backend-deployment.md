# Backend Deployment Guide

This guide covers deployment procedures for the SNP-SMS Backend REST API (Node.js + Express 5 + Mongoose 9).

---

## 1. Overview and Architecture

The backend operates as an independently maintainable and deployable REST service:

- Runtime: Node.js 22 (Alpine Linux)
- Framework: Express 5 with ESM/TypeScript compilation via `tsc`
- Persistence: MongoDB 8.0 with Replica Set (`rs0`) for multi-document ACID transactions
- Port: `4000` (configurable via `PORT`)
- Health Check Endpoints:
  - `GET /health` (lightweight liveness probe for load balancers and Kubernetes)
  - `GET /api/v1/health` (detailed liveness probe)
  - `GET /api/v1/health/readiness` (database connectivity probe)

---

## 2. Docker Container Deployment

The backend utilizes the multi-stage `Dockerfile` at the project root.

### Build Image

```bash
docker build -t snp-sms-backend:latest .
```

### Run Container

```bash
docker run --env-file /secure/path/snp-sms-backend.env -p 4000:4000 snp-sms-backend
```

Create the env file outside the repository and restrict it to the service account. Production requires distinct random authentication and cookie secrets, a unique administrator password, HTTPS frontend origins, and a MongoDB TLS connection. Store the env file in a secret manager when the platform supports one.

## 3. Kubernetes Deployment

Production manifests are managed under `infrastructure/k8s/`:

- `infrastructure/k8s/namespace.yaml`: Creates `snp-sms` namespace.
- `infrastructure/k8s/backend-deployment.yaml`: Configures replicas, CPU/memory limits, security context (non-root), and probes.
- `infrastructure/k8s/hpa.yaml`: Horizontal Pod Autoscaler targeting 70% CPU saturation.

### Applying Manifests

```bash
kubectl apply -f infrastructure/k8s/namespace.yaml
kubectl apply -f infrastructure/k8s/configmap.yaml
kubectl apply -f infrastructure/k8s/secrets.yaml
kubectl apply -f infrastructure/k8s/backend-deployment.yaml
kubectl rollout status deployment/snp-sms-backend -n snp-sms
```

---

## 4. Production Environment Configuration

All production parameters must be provided via secure secrets:

| Variable               | Description             | Required | Validation / Constraint                                          |
| :--------------------- | :---------------------- | :------- | :--------------------------------------------------------------- |
| `NODE_ENV`             | Environment mode        | Yes      | Must be `production`                                             |
| `PORT`                 | Listening port          | Yes      | Default `4000`                                                   |
| `MONGODB_URI`          | MongoDB Connection URI  | Yes      | Must include replicaSet                                          |
| `FRONTEND_URL`         | Allowed CORS origin(s)  | Yes      | Comma-separated HTTPS origins                                    |
| `JWT_ACCESS_SECRET`    | Access token signature  | Yes      | At least 32 random characters; never a source-code default       |
| `JWT_REFRESH_SECRET`   | Refresh token signature | Yes      | At least 32 random characters, distinct from access              |
| `COOKIE_SECRET`        | Cookie signing secret   | Yes      | At least 32 random characters; never a source-code default       |
| `SUPER_ADMIN_PASSWORD` | Initial admin password  | Yes      | At least 16 characters; supplied only through the secret manager |
| `LOG_LEVEL`            | Pino logging level      | No       | Default `info`                                                   |

---

## 5. Security & Isolation Safeguards

- Non-Root Execution: The production container drops privileges to user `node` (UID 1000).
- Network Isolation: The database port (`27017`) is never exposed publicly; only internal container network communication is permitted.
- Credential Sanitization: Pino structured logger redacts authorization headers, cookies, and secret keys.
- Rate Limiting: IP-based sliding window rate limiting is enforced on all `/api/v1` routes.
