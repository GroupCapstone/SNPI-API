# Design Topic: Resource ID (`resource-id`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-id](https://apistylebook.com/design/topics/resource-id)

---

## 1. Original Topic Definition

> "What is a resource ID and/or how it's built"

---

## 2. In-Depth Architectural Knowledge Learned

Identity standards. Identifiers must be URL-safe, opaque strings. Standardize on UUID v4, ULID, or standardized business codes.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-id` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-id` operations.

### Concrete HTTP Syntax / Representation:
```http
/api/v1/students/550e8400-e29b-41d4-a716-446655440000
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 7 organization guidelines explicitly specify standards for this topic:

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Single-resource representation](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation)
    > Verbatim Quote: "A single resource representation should have a numeric id field"

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Resource ID](https://cloud.google.com/apis/design/resource_names#resource_id)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Composite Keys](https://github.com/Haufe-Lexware/api-style-guide/blob/master/faq/faq.md#composite-keys)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Support non-id dereferencing for convenience](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html)
  * **Section**: [Provide resource (UU)IDs](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-resource-uuids.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Canonical identifier](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [REST Metadata](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Treat IDs as opaque URL-safe strings; use URL encoding if identifiers contain special characters. | Exposing guessable auto-increment integer IDs in public APIs. |
| **Contract Stability** | Version and document `resource-id` formally in `@snp/shared` | Breaking `resource-id` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-id`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Resource ID` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
