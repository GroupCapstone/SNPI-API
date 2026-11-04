# Design Topic: Retrieve resource partially (`resource-retrieve-partial`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-retrieve-partial](https://apistylebook.com/design/topics/resource-retrieve-partial)

---

## 1. Original Topic Definition

> "How to retrieve partially a resource"

---

## 2. In-Depth Architectural Knowledge Learned

Sparse fieldsets. Allows client to request specific fields to conserve mobile bandwidth via ?fields=id,name.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-retrieve-partial` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-retrieve-partial` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students?fields=studentId,firstName,lastName,avatarUrl
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 9 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Choosing Fields & Embedded Resources](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.3.6 Services MAY support partial retrieval of resource state](https://github.com/CiscoDevNet/api-design-guide#363-get)
    > Verbatim Quote: "RFC-3986"

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Requesting Partiel Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#requesting-partial-resources)
  * **Section**: [Nested Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#nested-resources)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints)
    > Verbatim Quote: "Partial responses (e.g. with field query param) should not be returned."

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Partial Response](https://cloud.google.com/apis/design/design_patterns#partial_response)
    > Verbatim Quote: "Sometimes an API client only needs a specific subset of data in the response message."
  * **Section**: [Resource View](https://cloud.google.com/apis/design/design_patterns#resource_view)
    > Verbatim Quote: "To reduce network traffic, it is sometimes useful to allow the client to limit which parts of the resource the server should return in its responses, returning a view of the resource instead of the full resource representation."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Field selection](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#field-selection)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Optimize bandwidth usage and improve responsiveness](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita)
    > Verbatim Quote: "GET /resources/123?fields=(name,partner(name))"

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers)
    > Verbatim Quote: "Prefer return=minimal, return=representation"
  * **Section**: [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers)
    > Verbatim Quote: "Preference-Applied"

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings)
    > Verbatim Quote: "fields — to retrieve a subset of fields"
  * **Section**: [Define useful resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources)
  * **Section**: [Support Filtering of Resource Fields](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#should-support-filtering-of-resource-fields)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Support fields parameter for projection (?fields=studentId,firstName,lastName). | Ignoring fields parameter and sending 100+ unrequested attributes. |
| **Contract Stability** | Version and document `resource-retrieve-partial` formally in `@snp/shared` | Breaking `resource-retrieve-partial` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-retrieve-partial`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Retrieve resource partially` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
