---
name: fullstack-security-masterclass
description: Authoritative enterprise full-stack security standard covering OWASP API Security Top 10 (2023), RFC 8725 JWT Best Current Practices, OWASP ASVS 4.0 Level 2/3 Verification, NIST SP 800-63B Digital Identity, and MongoDB Replica Set Hardening. Dual-stack protection for Express 5 Backend and Next.js 16 Web.
---

# Full-Stack Security Masterclass: Dual-Stack Defense Specification

> Authoritative enterprise operational standard for full-stack web and API security across **Express 5 Backend API** (`apps/backend` / `snp-sms-api`) and **Next.js 16 Web Frontend** (`apps/frontend` / `snp-sms-web`).

---

## 1. Five Foundational Security Pillars

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
|                                5 Foundational Security Pillars                              |
+----+-----------------------------------------+----------------------------------------------+
| 01 | OWASP API Security Top 10 (2023)        | API1 (BOLA), API2 (Auth), API3 (BOPLA), SSRF |
| 02 | RFC 8725 JWT Best Current Practices     | Algorithm confusion, 'none' defense, RTR    |
| 03 | OWASP ASVS 4.0 (Level 2 & Level 3)     | Architecture, session, access control, crypto|
| 04 | NIST SP 800-63B Digital Identity        | AAL1-AAL3, password entropy, rate limiting   |
| 05 | MongoDB Enterprise Hardening Checklist  | Replica set keyfile, TLS 1.3, strictQuery    |
+----+-----------------------------------------+----------------------------------------------+
```

---

## 2. Directory Architecture & Knowledge Map

All comprehensive guides, threat models, and code defenses are cataloged in this directory:

* [`01-owasp-api-security-top-10.md`](./01-owasp-api-security-top-10.md): Complete analysis of all 10 OWASP API (2023) threats with dual-stack Express & Next.js defenses.
* [`02-rfc-8725-jwt-best-practices.md`](./02-rfc-8725-jwt-best-practices.md): Token signing, algorithm whitelisting, rotation lifecycle, and reuse detection.
* [`03-owasp-asvs-4-school-data.md`](./03-owasp-asvs-4-school-data.md): Level 2 & Level 3 verification controls tailored for school records, minors' privacy, and grading integrity.
* [`04-nist-sp-800-63b-identity.md`](./04-nist-sp-800-63b-identity.md): Modern password policies (zero arbitrary rotation, $\ge 12$ chars), credential stuffing defense, and session timeouts.
* [`05-mongodb-security-hardening.md`](./05-mongodb-security-hardening.md): Replica set (`rs0`) keyfile, TLS 1.3 in transit, WiredTiger encryption at rest, and NoSQL injection mitigation.
* [`06-frontend-security-hardening.md`](./06-frontend-security-hardening.md): Next.js 16 Content Security Policy (CSP), HSTS, clickjacking prevention, and client state hygiene.

---

## 3. The 15-Point Full-Stack Security Quality Gate

Before approving or deploying any API endpoint, database schema, or UI feature, verify against this 15-point gate:

| # | Domain | Policy Requirement | Verification Check |
| :- | :--- | :--- | :--- |
| **01** | **BOLA / IDOR** | Enforce multi-tenant `schoolId` and `branchId` server-side on every query | Automated integration test with cross-tenant ID |
| **02** | **BFLA / RBAC** | Verify declarative permission codes via `authorize(...)` middleware | Route unit tests with unauthorized roles |
| **03** | **Mass Assignment** | Validate and strip untrusted fields via Zod `.strict()` | Schema validation rejects arbitrary injected keys |
| **04** | **JWT Hygiene** | Enforce explicit `algorithms: ['HS256']`, validate `iss` and `aud` | Token test passing `alg: "none"` rejected with 401 |
| **05** | **Constant-Time Crypto** | Compare signatures, tokens, and webhook hashes via `timingSafeEqual` | Source code audit for `crypto.timingSafeEqual` |
| **06** | **Credential Storage** | Store passwords hashed using Argon2id or bcrypt (work factor $\ge 12$) | Model hook inspection before database save |
| **07** | **Brute-Force Defense** | Rate-limit login and password reset routes (max 5 attempts / 15 min) | Rate limiter middleware active on auth router |
| **08** | **Session Lifetime** | Inactivity timeout $\le 30$ mins; absolute maximum session $\le 12$ hours | Token `exp` verification and refresh rotation |
| **09** | **Cookie Security** | Set `HttpOnly; Secure; SameSite=Strict` on all authentication cookies | Inspect `Set-Cookie` response headers |
| **10** | **NoSQL Injection** | Enable Mongoose `strictQuery: true`; parse all filters with typed Zod | Mongoose config check and schema typing |
| **11** | **Error Sanitization** | Return RFC 7807 problem details with zero internal stack traces | Production error response inspection |
| **12** | **Resource Bounds** | Cap collection pagination at `limit <= 100`; body parser $\le 1\text{MB}$ | Request with `limit=1000` capped to 100 |
| **13** | **Browser CSP** | Configure strict Content Security Policy and HSTS in `next.config.ts` | Browser header inspection on `/` route |
| **14** | **Audit Logging** | State-changing operations dispatch an immutable `AuditLog` event | Database inspection for audit record on write |
| **15** | **Database Least-Privilege** | Application connects via dedicated `readWrite` user (never `root`) | Mongo connection URI verification |

---

## 4. Skill Activation & Routing

* **Registered Aliases**:
  * `apply skill fullstack-sec`
  * `apply skill api-security`
* **Trigger Situations**:
  * Implementing authentication, password hashing, or token rotation.
  * Adding new REST API endpoints requiring RBAC and tenant boundaries.
  * Auditing backend or frontend for OWASP vulnerabilities.
  * Hardening MongoDB database connections and queries.
  * Configuring browser security headers, CSP, and cookie flags.

---

## 5. Standby Operating Protocol

* **Standby Mode**: All security matrices and rules are recorded for architectural reference.
* **Zero Premature Modification**: Do not modify existing production routes or database configurations until the user explicitly requests an audit or security implementation turn.
