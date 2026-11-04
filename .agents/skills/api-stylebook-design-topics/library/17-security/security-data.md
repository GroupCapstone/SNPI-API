# Design Topic: Data privacy (`security-data`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Security](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/security-data](https://apistylebook.com/design/topics/security-data)

---

## 1. Original Topic Definition

> "Data privacy concerns"

---

## 2. Architectural Principles Learned

This design topic governs **Data privacy** within the domain of **Security**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `security-data` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `security-data` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `security-data` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `security-data` formally | Changing `security-data` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `security-data`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Data privacy` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
