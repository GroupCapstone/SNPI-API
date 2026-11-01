# Security Policy

## 1. Supported Versions

Security updates and critical patches are actively provided for the following releases:

| Version   | Status            | Supported Until  |
| :-------- | :---------------- | :--------------- |
| `0.1.x`   | Active Support    | Current Baseline |
| `< 0.1.0` | End of Life (EOL) | Not Supported    |

Production deployments must remain on the latest tagged release checkpoint.

---

## 2. Reporting a Vulnerability

We take the security of student records, faculty identities, and campus financial data with the highest priority.

### 2.1 Private Disclosure Channel

- **DO NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.**
- Use **GitHub Private Vulnerability Reporting** via the repository's `Security` tab (`Advisories -> Report a vulnerability`).
- Alternatively, report directly to repository maintainers via private channels.

### 2.2 Report Contents

Please include the following information in your report:

- A descriptive summary of the potential vulnerability and its impact.
- Affected modules, endpoint paths, or component filenames.
- Step-by-step reproduction instructions or a minimal proof of concept (PoC).
- Any suggested remediations or mitigations.
- **Do not include real student names, credentials, passwords, or production database dumps.**

### 2.3 Response Timelines

- **Initial Acknowledgement**: Within 24 hours of report receipt.
- **Triage & Impact Assessment**: Within 72 hours.
- **Remediation & Patch Deployment**: Timelines coordinated based on CVSS severity (critical within 7 days).
- **Public Disclosure**: Coordinated disclosure after patches have been verified and deployed.

---

## 3. DevSecOps & Security Architecture

SNP-SMS embeds automated security controls directly into the software development lifecycle:

```text
+-------------------------------------------------------------------------+
|                    DevSecOps Pipeline Architecture                      |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      Application Security (AppSec)                      |
|       Static Analysis, Secret Detection, Dependency Auditing, RBAC       |
+-------------------+--------------------+--------------------+-----------+
                    |                    |                    |
                    v                    v                    v
          +-------------------+ +------------------+ +------------------+
          |       SAST        | | Secret Detection | | Dependency Audit |
          | CodeQL / ESLint   | | Gitleaks / Hooks | | npm audit / CVE  |
          +-------------------+ +------------------+ +------------------+
```

---

## 4. Core Security Controls Matrix

### 4.1 Authentication & Token Lifecycle

- **Short-Lived Access Tokens**: Signed JWTs expiring after 15 minutes, passed strictly via `Authorization: Bearer <token>`. Never stored in persistent browser `localStorage`.
- **HttpOnly Refresh Cookies**: Refresh tokens are stored in `HttpOnly`, `SameSite=Strict` cookies with `Secure` enabled in production.
- **Session Rotation & Revocation**: Refresh tokens use session rotation; compromised refresh tokens invalidate the entire active session hierarchy.
- **Password Hashing**: Passwords hashed with `bcryptjs` using 12 or more salt rounds.

### 4.2 Multi-Tenant Campus Isolation & RBAC

- **Deny-by-Default Authorization**: Access is forbidden unless an explicit permission is verified server-side.
- **Hierarchical Permission Catalog**: Granular permissions in `module.action.scope` format (e.g. `student.view.own_branch`, `finance.create.all_branches`).
- **Campus Branch Scoping**: Queries enforce branch boundaries using `getAuthorizedBranchFilter()`. The client-supplied `X-Branch-Id` header is strictly validated against the user's authorized branch list.

### 4.3 Input Validation & Injection Defense

- **Zod Schema Validation**: Every API route validates request parameters, query strings, and payloads before invoking service layers.
- **Parameterized Mongoose Queries**: Strict query construction prevents NoSQL operator injection (`$gt`, `$ne`, `$where`).

### 4.4 Rate Limiting & DoS Protection

- **Global Rate Limiting**: Enforced on public endpoints (`2,000 requests / 15 minutes`).
- **Strict Authentication Limiting**: Brute-force protection on `/api/v1/auth/login` (`5 failed attempts / 15 minutes` per IP and account).
- **Standard Rate Limit Headers**: RFC draft-8 headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).

### 4.5 Immutable Audit Logging

- High-risk operations (grade modifications, fee collections, user role assignments, refunds) record immutable audit trail entries containing actor ID, campus branch, IP address, timestamp, and pre/post mutation snapshots.

---

## 5. Security Checkpoint Policy

Prior to publishing any release checkpoint:

1. Run `npm run format:check` to ensure code integrity.
2. Run `npm run typecheck` to assert zero TypeScript errors.
3. Run `npm run smoke` and `npm run test:api` to verify RBAC enforcement across all 47 domain modules.
4. Verify zero credentials, test secrets, or private keys are staged in git.

---

## 6. Security Audit & Remediation History

Historical security audit findings, vulnerability resolutions, and patch certifications are maintained under `docs/security/`:

| Date       | Scope              | Advisory / Topic                      | Status                | Audit Report                                                                                                                        |
| :--------- | :----------------- | :------------------------------------ | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-01 | Full Monorepo      | 77-Point Audit & 42 Security Tests    | Verified (42/42 Pass) | [Security Audit & Automated Test Results](file:///Users/Apple16/Desktop/SNP-SMS/docs/security/security-audit-remediation-report.md) |
| 2026-11-01 | Monorepo Lockfiles | GHSA-g3hv-75wg-m249 (`minimatch` DoS) | Tracked (Dev Only)    | [Security Audit & Remediation Report](file:///Users/Apple16/Desktop/SNP-SMS/docs/security/security-audit-remediation-report.md)     |
