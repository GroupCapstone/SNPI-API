# Design Topic: Forbidden methods alternatives (`http-methods-alternative`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods-alternative](https://apistylebook.com/design/topics/http-methods-alternative)

---

## 1. Original Topic Definition

> "What to do when only possible HTTP methods are POST and GET"

---

## 2. Architectural Principles Learned

This design topic governs **Forbidden methods alternatives** within the domain of **HTTP Methods**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-methods-alternative` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-methods-alternative` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-methods-alternative` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Query Requests with Large Inputs](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.7 Alternative Forms](https://github.com/CiscoDevNet/api-design-guide#37-alternative-forms)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-methods-alternative` formally | Changing `http-methods-alternative` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods-alternative`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Forbidden methods alternatives` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
