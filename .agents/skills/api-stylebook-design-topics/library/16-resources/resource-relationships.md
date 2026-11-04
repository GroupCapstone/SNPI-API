# Design Topic: Relationships (`resource-relationships`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-relationships](https://apistylebook.com/design/topics/resource-relationships)

---

## 1. Original Topic Definition

> "How to define and use relations between resources"

---

## 2. In-Depth Architectural Knowledge Learned

Modeling associations between entities. Use sub-resource collections for direct ownership (max 2 levels).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-relationships` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-relationships` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/schools/SCH-1/branches/BR-1/classrooms
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 8 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Foreign Key Relations](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Relationships](https://github.com/cloudfoundry/cc-api-v3-style-guide#relationships)
  * **Section**: [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [None](http://deliveroo.engineering/guidelines/api-design/#listing-relations)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [How to Handle Resource Relationships and Composition](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#how-to-handle-resource-relationships-and-composition)
  * **Section**: [Relationships and Sub-Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Nest foreign key relations](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Relationships](http://restful-api-design.readthedocs.io/en/latest/relationships.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use a well-defined subset of HAL](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal)
  * **Section**: [Use Custom Link Relations](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations)
  * **Section**: [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | GET /schools/:schoolId/branches/:branchId/classrooms; use query filters for deeper relationships. | Deeply nesting URIs beyond 2 levels (/schools/:id/branches/:id/buildings/:id/floors/:id/rooms/:id). |
| **Contract Stability** | Version and document `resource-relationships` formally in `@snp/shared` | Breaking `resource-relationships` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-relationships`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Relationships` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
