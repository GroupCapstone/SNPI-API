# Design Topic: Data privacy (`security-data`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Security](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/security-data](https://apistylebook.com/design/topics/security-data)

---

## 1. Original Topic Definition

> "Data privacy concerns"

---

## 2. In-Depth Architectural Knowledge Learned

Protecting sensitive customer and financial data in API payloads and logs. Masking PII, redacting passwords/secrets from logs, tokenizing credit cards.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `security-data` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `security-data` operations.

### Concrete HTTP Syntax / Representation:
```http
{"cardNumber": "••••••••••••4242", "taxId": "••••••982"}
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Privacy and security](https://apiguide.readthedocs.io/en/latest/principles/security.html)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Security and Authentication](https://github.com/Haufe-Lexware/api-style-guide/blob/master/security-and-authentication/security-and-authentication.md)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [PII parameters](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#79-pii-parameters)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Redact credentials and PII in application telemetry; hash tokens using SHA-256. | Logging plaintext passwords, credit card numbers, or authorization tokens in console logs. |
| **Contract Stability** | Version and document `security-data` formally in `@snp/shared` | Breaking `security-data` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `security-data`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Data privacy` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
