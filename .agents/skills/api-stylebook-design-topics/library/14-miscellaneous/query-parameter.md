# Design Topic: Query parameters (`query-parameter`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/query-parameter](https://apistylebook.com/design/topics/query-parameter)

---

## 1. Original Topic Definition

> "How to use query parameters"

---

## 2. Architectural Principles Learned

This design topic governs **Query parameters** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `query-parameter` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `query-parameter` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `query-parameter` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Query Parameters](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Parameters](http://deliveroo.engineering/guidelines/api-design/#parameters)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Filtering](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#filtering)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Query parameters must be snake_case (never camelCase)](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-query-parameters-must-be-snakecase-never-camelcase)
  * **Section**: [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `query-parameter` formally | Changing `query-parameter` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `query-parameter`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Query parameters` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
