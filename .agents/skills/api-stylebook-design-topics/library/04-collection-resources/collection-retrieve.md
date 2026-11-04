# Design Topic: Retrieve a collection (`collection-retrieve`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Collection Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/collection-retrieve](https://apistylebook.com/design/topics/collection-retrieve)

---

## 1. Original Topic Definition

> "How to get a collection or resources"

---

## 2. In-Depth Architectural Knowledge Learned

Rules for fetching collection sets via HTTP GET. Deliveroo, Cisco, and Google require safe, idempotent retrieval with default sorting, pagination envelopes, and HTTP 200 OK responses.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `collection-retrieve` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `collection-retrieve` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/teachers -> HTTP/1.1 200 OK
{ "items": [], "total": 0 }
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 7 organization guidelines explicitly specify standards for this topic:

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [GET](https://github.com/cloudfoundry/cc-api-v3-style-guide#get)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Standard Methods](https://cloud.google.com/apis/design/standard_methods)
  * **Section**: [List](https://cloud.google.com/apis/design/standard_methods#list)
    > Verbatim Quote: "The List method takes a collection name and zero or more parameters as input, and returns a list of resources that match the input"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Get List of resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [GET](http://zalando.github.io/restful-api-guidelines/http/Http.html#get)
    > Verbatim Quote: "reads a resource or set of resource instances"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Always use HTTP GET; return 200 OK with items array and pagination metadata. | Modifying server state during a collection GET request or returning 404 for an empty collection (return []). |
| **Contract Stability** | Version and document `collection-retrieve` formally in `@snp/shared` | Breaking `collection-retrieve` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `collection-retrieve`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Retrieve a collection` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
