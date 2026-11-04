# OWASP ASVS 4.0: Educational Platform Security Verification Standard

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Standard**: [OWASP Application Security Verification Standard (ASVS) 4.0](https://owasp.org/www-project-application-security-verification-standard/)
> **Target Levels**: **Level 2 (Standard Enterprise Applications)** and **Level 3 (Sensitive Infrastructure)**
> **Context**: SNP-SMS / School Management Systems (Minor student privacy, academic integrity, financial transactions).

---

## 1. ASVS Levels & Educational Data Sensitivity Classification

The OWASP ASVS defines three verification levels:
* **Level 1**: Automated penetration test baseline (opportunistic attacks).
* **Level 2 (Target)**: Defends against motivated attackers targeting commercial and educational applications.
* **Level 3 (Target for Core Data)**: Defends against advanced threats targeting critical assets (financial records, grading systems, minors' PII).

### Educational Data Classification Matrix:

| Classification | Assets | Applicable ASVS Controls | Retention & Encryption Rule |
| :--- | :--- | :--- | :--- |
| **High (Tier 1 - Confidential)** | Student PII, National IDs, Minor Birth Certificates, Passwords, Banking/KHQR details | Level 3: V2, V3, V8 | Encrypted at rest (AES-256), TLS 1.3 in transit, strict audit logging. |
| **Medium (Tier 2 - Sensitive)** | Exam Scores, Term Results, Disciplinary Records, Attendance | Level 2: V4, V5, V13 | Scoped to assigned teachers/parents; immutable audit log on modification. |
| **Low (Tier 3 - Internal)** | Curriculum outlines, Subject lists, Class timetables, School calendars | Level 1 / Level 2 | Authenticated read access; cacheable. |

---

## 2. Core ASVS Verification Chapters & Concrete Implementations

### V1: Architecture, Design and Threat Modeling
* **1.1.2**: All application components must have documented roles, trust boundaries, and data flows.
* **1.4.1**: Multi-tenant architectures must enforce tenant boundaries on all queries (`schoolId` + `branchId`) so data never crosses isolation perimeters.
* **1.14.1**: Build pipeline must verify dependencies against known vulnerabilities via automated Dependabot and npm audit checks.

---

### V2: Authentication Verification Requirements
* **2.1.1**: User passwords must be verified against a minimum length of 12 characters.
* **2.1.2**: Password truncation is strictly prohibited (support passwords up to 128 characters).
* **2.1.7**: Passwords must be hashed using modern adaptive functions: **Argon2id** (recommended) or **bcrypt** with a minimum work factor of 12.
* **2.2.1**: Multi-Factor Authentication (MFA / TOTP) must be enforced for administrative and financial roles (Super Admin, School Admin, Finance Officer).
* **2.8.1**: Account recovery tokens must be cryptographically random (minimum 128 bits of entropy) with a maximum lifetime of 15 minutes.

---

### V3: Session Management Verification Requirements
* **3.1.1**: Never expose session tokens in URL query strings (only in Authorization headers or HTTP cookies).
* **3.2.1**: Session IDs must be generated using cryptographically secure pseudorandom number generators (CSPRNG).
* **3.3.1**: Inactivity timeout of **30 minutes** for web portal sessions; maximum session lifetime of **12 hours**.
* **3.4.1**: Invalidate server-side sessions and revoke refresh tokens immediately upon user logout or password reset.

---

### V4: Access Control Verification Requirements
* **4.1.1**: The principle of least privilege must be applied: users are granted only the minimum scopes required for their active role.
* **4.1.2**: Access control decisions must be enforced **server-side exclusively**; client-side route guards are for UX convenience only.
* **4.1.3**: The server must verify that the requesting user owns or has delegated authority over every referenced resource identifier (mitigating BOLA/IDOR).
* **4.2.1**: Direct object references (e.g. `studentId`) must be validated against the user's active branch and tenant scope before returning records.

---

### V5: Malicious Input Handling & Validation Requirements
* **5.1.1**: All input parameters (body, query, headers, path) must be validated against a positive specification (whitelist validation) using Zod.
* **5.1.2**: Numerical bounds must be enforced on all limit and offset parameters to prevent buffer exhaustion.
* **5.2.1**: Mongoose queries must run with `strictQuery: true`, rejecting raw MongoDB operators (`$where`, `$gt`, `$ne`) from untrusted inputs.
* **5.3.1**: Output encoding must be applied in the frontend rendering pipeline to neutralize Cross-Site Scripting (XSS).

---

### V8: Data Protection & Cryptography Verification
* **8.1.1**: Sensitive data at rest (passwords, tokens, identity documents) must be encrypted using AES-256 or ChaCha20-Poly1305.
* **8.2.1**: Cryptographic keys must never be committed to source code or git repositories. They must be injected via verified environment variables.
* **8.3.1**: Sensitive information (passwords, payment cards, national IDs) must be purged from server logs, URL paths, and telemetry streams.

---

### V13: API & Web Service Verification Requirements
* **13.1.1**: API endpoints must verify that `Content-Type` matches `application/json` before parsing request bodies.
* **13.2.1**: REST APIs must return appropriate HTTP status codes (`400`, `401`, `403`, `404`, `422`, `429`, `500`) with standardized error envelopes.
* **13.3.1**: Rate limiting must be implemented across all public and authenticated endpoints to prevent Denial of Service and scraping attacks.

---

## 3. ASVS Verification Audit Checklist

Before releasing any new API endpoint or UI feature, verify against the following 10 checkpoints:

1. [ ] **Authentication Check**: Is `authenticate` middleware active on protected routes?
2. [ ] **Authorization Scope**: Does route check explicit RBAC permissions (`authorize(...)`)?
3. [ ] **Tenant Scoping**: Does database query enforce `schoolId` and `branchId`?
4. [ ] **Input Whitelisting**: Does route validate inputs against a strict Zod schema?
5. [ ] **Pagination Upper Bound**: Is `limit` capped at $\le 100$?
6. [ ] **PII Redaction**: Are password and identity fields omitted from JSON response DTOs?
7. [ ] **CSRF & Cookie Protection**: Are cookies marked `HttpOnly; Secure; SameSite=Strict`?
8. [ ] **Cryptographic Hygiene**: Are secrets checked using `crypto.timingSafeEqual`?
9. [ ] **Audit Dispatch**: Does state-changing mutation emit an `AuditLog` record?
10. [ ] **Error Safety**: Does error handler return RFC 7807 JSON without stack traces?
