# Design Topic: Debug and diagnose (`debug-diagnose`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/debug-diagnose](https://apistylebook.com/design/topics/debug-diagnose)

---

## 1. Original Topic Definition

> "How to provide informations to debug and diagnose"

---

## 2. Architectural Principles Learned

This design topic governs **Debug and diagnose** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `debug-diagnose` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `debug-diagnose` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `debug-diagnose` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `debug-diagnose` formally | Changing `debug-diagnose` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `debug-diagnose`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Debug and diagnose` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
