# Design Topic: API counts (`api-counts`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [API Design](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/api-counts](https://apistylebook.com/design/topics/api-counts)

---

## 1. Original Topic Definition

> "How many endpoints/resources in an API?"

---

## 2. Architectural Principles Learned

This design topic governs **API counts** within the domain of **API Design**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `api-counts` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `api-counts` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `api-counts` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Minimal API surface](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/minimal-api-surface.html)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Fine-grained](http://deliveroo.engineering/guidelines/api-design/#fine-grained)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Limit of Resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-resources)
    > Verbatim Quote: "a typical range of resources for a well-designed API is between 4 and 8"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `api-counts` formally | Changing `api-counts` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `api-counts`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `API counts` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
