# Design Topic: Debug and diagnose (`debug-diagnose`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/debug-diagnose](https://apistylebook.com/design/topics/debug-diagnose)

---

## 1. Original Topic Definition

> "How to provide informations to debug and diagnose"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Debug and diagnose within the domain of Miscellaneous. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to provide informations to debug and diagnose.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `debug-diagnose` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `debug-diagnose` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Miscellaneous specifications for Debug and diagnose.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 1 organization guidelines explicitly specify standards for this topic:

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Provide Request-Ids for Introspection](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Debug and diagnose; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Debug and diagnose. |
| **Contract Stability** | Version and document `debug-diagnose` formally in `@snp/shared` | Breaking `debug-diagnose` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `debug-diagnose`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Debug and diagnose` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
