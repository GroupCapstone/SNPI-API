# SNP-SMS Monorepo

Multi-Branch School Management System (SNP-SMS) powered by npm workspaces, an Express 5 modular monolith backend, a Next.js 16 App Router frontend, and a hybrid container/serverless deployment model.

---

## 1. Overview & Metrics

SNP-SMS provides unified school operations across admissions, academic progression, scheduling, attendance, tuition billing, grading, and human resources with server-side multi-branch isolation.

| Metric         | Specification                                                              |
| :------------- | :------------------------------------------------------------------------- |
| Topology       | Monorepo via npm workspaces (apps/backend, apps/frontend, packages/shared) |
| Architecture   | 7-layer modular monolith (47 domains, 193 REST endpoints)                  |
| Access Control | 356 granular permissions and 13 core roles in @snp/shared                  |
| Isolation      | Server-side branch isolation via X-Branch-Id header                        |
| Runtimes       | Node.js >=22.13.0, Express 5, Next.js 16 (React 19), MongoDB 7.0+ (rs0)    |
| Deployment     | Hybrid: Serverless frontend edge caching and persistent backend container  |

---

## 2. Quickstart

### Prerequisites

Node.js >= 22.13.0, npm >= 10.8.0, Docker Desktop.

### Setup & Run

```bash
# Install dependencies
npm install

# Configure environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# Start MongoDB replica set (rs0) & seed
docker compose up -d mongodb
npm run seed --workspace=apps/backend

# Start development servers
npm run dev
```

### Endpoints

- API: http://localhost:5001/api/v1
- Frontend: http://localhost:3000
- Documentation: http://localhost:3000/document

---

## 3. Verification Commands

| Command                | Scope                                             |
| :--------------------- | :------------------------------------------------ |
| npm run format:check   | Verifies Prettier compliance across all files     |
| npm run typecheck      | Typechecks shared packages, backend, and frontend |
| npm run smoke          | Validates package resolution and service health   |
| npm run test:api       | Tests live HTTP responses across 47 domains       |
| npm run test           | Runs full Vitest suite (backend and frontend)     |
| npm run build          | Validates production builds for all applications  |
| npm run deploy:verify  | Executes pre-push deployment quality gate         |
| npm run changelog:sync | Synchronizes changelog to documentation portal    |

---

## 4. Governance

- Security: Governed by SECURITY.md
- Contributing: Governed by CONTRIBUTING.md
- Code of Conduct: Governed by CODE_OF_CONDUCT.md
- License: MIT License in LICENSE

---

## 5. Security & Vulnerability Remediation

All security vulnerabilities, automated Dependabot alerts, and CVE resolutions are tracked in accordance with [SECURITY.md](SECURITY.md) and documented in full detail within [docs/security/security-audit-remediation-report.md](docs/security/security-audit-remediation-report.md).

### Latest Remediation Log

| Metric                  | Details                                                                                                                                                                               |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vulnerability Title** | `minimatch` Denial of Service via Globparts Amplification                                                                                                                             |
| **Advisory Reference**  | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)                                                                                                              |
| **CVE Reference**       | [CVE-2026-118764](https://nvd.nist.gov/vuln/detail/CVE-2026-118764)                                                                                                                   |
| **CWE Classification**  | [CWE-405: Asymmetric Resource Consumption (Amplification)](https://cwe.mitre.org/data/definitions/405.html)                                                                           |
| **Upstream Fix**        | [minimatch v11.0.1](https://github.com/isaacs/minimatch/releases/tag/v11.0.1) ([Commit 77a0f5c](https://github.com/isaacs/minimatch/commit/77a0f5c4b80bdc641c3c930a1d9edf5ad2db57f8)) |
| **Severity**            | Moderate (CVSS 6.9)                                                                                                                                                                   |
| **Date Opened**         | 2026-10-31 16:28:54 UTC                                                                                                                                                               |
| **Date Closed / Fixed** | 2026-11-01 00:46:45 UTC                                                                                                                                                               |
| **Turnaround Time**     | < 8 Hours (Same-Day Patch)                                                                                                                                                            |
| **Alerts Resolved**     | 3 of 3 Dependabot Alerts (#1, #2, #3 Closed)                                                                                                                                          |
| **Affected Manifests**  | `package-lock.json` (Root), `apps/frontend/package-lock.json`, `apps/backend/package-lock.json`                                                                                       |
| **Remediation Action**  | Pinned `minimatch@11.0.3` via root `package.json` overrides across all npm workspaces                                                                                                 |
| **Audit Verification**  | `npm audit` returns **0 vulnerabilities** across all workspaces (PASS)                                                                                                                |
| **Detailed Report**     | [Security Audit & Remediation Report](docs/security/security-audit-remediation-report.md)                                                                                             |
