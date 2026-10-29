# SNP Integrated Multi-Branch School Management System (SNP-SMS)

## Production Go-Live Verification Checklist

**Document Version:** 1.0.0  
**Target Environment:** Staging & Production Deployment  
**Quality Gate Requirement:** 100% of P0 & P1 must be PASS.

---

## 1. Security & Environment Configuration

| Check Item | Target Requirement                                 | Status           | Verification Evidence                                                                                                         |
| :--------- | :------------------------------------------------- | :--------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **SEC-01** | `NODE_ENV` set to `production`                     | `PASS`           | Set in production config; disables development stack traces.                                                                  |
| **SEC-02** | Production Seeder Block                            | `PASS`           | `src/scripts/seed.ts` always blocks production fixture seeding.                                                               |
| **SEC-03** | Test Credentials Removed / Rotated                 | `VERIFY IN HOST` | Source defaults were removed; rotate any previously deployed demo or administrator credentials in the hosting secret manager. |
| **SEC-04** | Single Super Admin Enforcement                     | `PASS`           | Backend prevents creating 2nd Super Admin or deleting primary Super Admin.                                                    |
| **SEC-05** | Protected System Roles                             | `PASS`           | System roles cannot be deleted or deactivated.                                                                                |
| **SEC-06** | JWT Token Secrets Isolation                        | `VERIFY IN HOST` | Startup requires distinct 32-character-or-longer signing secrets; confirm the deployed values are unique and private.         |
| **SEC-07** | Cookie Security (`HttpOnly`, `Secure`, `SameSite`) | `PASS`           | Refresh cookie is `HttpOnly`, `Secure` in production, and `SameSite=Strict`.                                                  |
| **SEC-08** | CORS Allowed Origins Whitelist                     | `PASS`           | Strict origin matching against `FRONTEND_URL`; no `origin: *` with credentials.                                               |
| **SEC-09** | Rate Limiting                                      | `PASS`           | 300 requests / 15 minutes window enforced via `express-rate-limit`.                                                           |
| **SEC-10** | Password Hash Exposure Prevention                  | `PASS`           | User models use `.select('+passwordHash')`; never returned in API payloads.                                                   |
| **SEC-11** | Security Headers (Helmet)                          | `PASS`           | CSP, XSS filter, frameguard, and HSTS enabled via `helmet()`.                                                                 |

---

## 2. Access Control & Multi-Branch Isolation

| Check Item | Target Requirement                     | Status | Verification Evidence                                                  |
| :--------- | :------------------------------------- | :----- | :--------------------------------------------------------------------- |
| **ISO-01** | Unauthenticated Access Rejection (401) | `PASS` | `/api/v1/auth/me`, `/students`, `/users` return `401 Unauthorized`.    |
| **ISO-02** | Cross-Branch Query Block (403)         | `PASS` | Branch Manager cannot query or modify another branch's records.        |
| **ISO-03** | Record-Level Branch Scope Enforcement  | `PASS` | Services validate entity's `branchId` against `user.branchAccess`.     |
| **ISO-04** | Role-Based Access Control (RBAC)       | `PASS` | Strict permission checking for 13 core roles and multi-branch scoping. |

---

## 3. Core Academic & Financial Workflows

| Check Item | Target Requirement                     | Status | Verification Evidence                                                                            |
| :--------- | :------------------------------------- | :----- | :----------------------------------------------------------------------------------------------- |
| **WRK-01** | Student ID Uniqueness (`STU-XXXXXX`)   | `PASS` | Atomic sequence generator creates unique IDs across all branches.                                |
| **WRK-02** | Admissions Lifecycle Flow              | `PASS` | Registration $\rightarrow$ Placement Test $\rightarrow$ Student Master $\rightarrow$ Enrollment. |
| **WRK-03** | Class Capacity Enforcement             | `PASS` | Enrollment rejected if class capacity reached via atomic reservation in transactions.            |
| **WRK-04** | Teacher Assignment Validation          | `PASS` | Validates employee branch and active status.                                                     |
| **WRK-05** | Daily Attendance Tracking              | `PASS` | Upsert daily class roster with P/A/L/E/PM status codes.                                          |
| **WRK-06** | Assessment & Score Matrix              | `PASS` | Batch score entry computes percentage and letter grade (A–F).                                    |
| **WRK-07** | Score Over Maximum Validation          | `PASS` | Rejects score entries exceeding assessment `maxScore`.                                           |
| **WRK-08** | Mandatory Finance Multi-Payment Ledger | `PASS` | $250 fee: $100 paid $\rightarrow$ $150 bal (partial), $150 paid $\rightarrow$ $0 bal (paid).     |
| **WRK-09** | Payment Receipt History Preservation   | `PASS` | Consecutive receipts preserved without overwriting historical records.                           |
| **WRK-10** | Inter-Branch Student Transfer          | `PASS` | Preserves student ID, updates `branchId`, transfers old enrollments.                             |

---

## 4. Database & Operational Reliability

| Check Item | Target Requirement                    | Status   | Verification Evidence                                                         |
| :--------- | :------------------------------------ | :------- | :---------------------------------------------------------------------------- |
| **DB-01**  | Database Integrity & Foreign Key Scan | `VERIFY` | Run `migrate:historical:check`; retain a summary with zero unresolved errors. |
| **DB-02**  | Soft Delete Protection                | `PASS`   | Entities block deletion if active dependencies exist; preserve audit logs.    |
| **DB-03**  | Partial Unique Indexes                | `PASS`   | Unique indexes on sequence codes with `{ isDeleted: false }`.                 |
| **DB-04**  | Full Audit Trail Logging              | `PASS`   | All create, update, delete, and auth events logged to `AuditLog`.             |
| **DB-05**  | Live Backup & Restore Verification    | `VERIFY` | Record the tested backup identifier, restore target, operator, and timestamp. |
| **DB-06**  | Automated Build & Test Suites         | `VERIFY` | Attach current format, lint, typecheck, test, and production build output.    |

`VERIFY` items are release blockers until environment-specific evidence is attached. Repository implementation alone is not proof that production data or backups are healthy.
