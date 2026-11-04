# Design Topic: API counts (`api-counts`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [API Design](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/api-counts](https://apistylebook.com/design/topics/api-counts)

---

## 1. Original Topic Definition

> "How many endpoints/resources in an API?"

---

## 2. In-Depth Architectural Knowledge Learned

Governs API boundary sizing and resource surface count. Zalando explicitly benchmarks that a typical well-designed API contains between 4 and 8 resources to ensure cohesive domain boundaries. Deliveroo and Adidas enforce fine-grained, minimal API surfaces to avoid monolithic endpoints and bloated cognitive load.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `api-counts` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `api-counts` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students
GET /api/v1/classes
GET /api/v1/enrollments
```

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
| **Architectural Execution** | Limit top-level resources per service to 4-8 cohesive entities; keep surface minimal and domain-focused. | Monolithic kitchen-sink APIs exposing 30+ disparate entities or premature micro-endpoint proliferation. |
| **Contract Stability** | Version and document `api-counts` formally in `@snp/shared` | Breaking `api-counts` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `api-counts`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `API counts` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
