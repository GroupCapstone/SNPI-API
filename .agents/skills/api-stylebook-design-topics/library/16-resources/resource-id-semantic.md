# Design Topic: ID with semantic (`resource-id-semantic`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-id-semantic](https://apistylebook.com/design/topics/resource-id-semantic)

---

## 1. Original Topic Definition

> "Using meaningful ids (like `me`)"

---

## 2. In-Depth Architectural Knowledge Learned

Human-readable semantic keys (e.g. branch codes BR-001, academic terms 2026-T1, course codes CS-101).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-id-semantic` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-id-semantic` operations.

### Concrete HTTP Syntax / Representation:
```http
/api/v1/branches/BR-MAIN or /api/v1/courses/MATH-101
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.4.2 User Scoped Endpoints](https://github.com/CiscoDevNet/api-design-guide#342-user-scoped-endpoints)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Support non-id dereferencing for convenience](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Canonical identifier](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Support semantic keys when uniquely distinguishing entities in human workflows. | Using mutable attributes (like student name) as semantic IDs. |
| **Contract Stability** | Version and document `resource-id-semantic` formally in `@snp/shared` | Breaking `resource-id-semantic` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-id-semantic`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `ID with semantic` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
