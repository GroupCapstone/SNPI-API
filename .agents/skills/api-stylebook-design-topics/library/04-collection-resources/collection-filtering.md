# Design Topic: Filtering (`collection-filtering`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Collection Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/collection-filtering](https://apistylebook.com/design/topics/collection-filtering)

---

## 1. Original Topic Definition

> "How to select some resources in a collection"

---

## 2. In-Depth Architectural Knowledge Learned

Enables consumers to restrict collection results. Industry standards encompass: attribute equality query params (?status=ACTIVE), Google filter expressions (filter="age > 18"), Microsoft OData ($filter=status eq 'ACTIVE'), Zalando conventional q parameter for text search, and PayPal complex search via POST when queries exceed URI limits.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `collection-filtering` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `collection-filtering` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students?status=ACTIVE&grade=10&q=somaly
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 9 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Search Requests](https://adidas-group.gitbooks.io/api-guidelines/content/execution/search-requests.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Filtering](https://github.com/cloudfoundry/cc-api-v3-style-guide#filtering)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [List filter field](https://cloud.google.com/apis/design/naming_convention#list_filter_field)
  * **Section**: [Common Custom Methods](https://cloud.google.com/apis/design/custom_methods#common_custom_methods)
    > Verbatim Quote: "(:search) Alternative to List for fetching data that does not adhere to List semantics."
  * **Section**: [List Sub-Collections](https://cloud.google.com/apis/design/design_patterns#list_sub-collections)
    > Verbatim Quote: "Sometimes, an API needs to let a client List/Search across sub- collections."
  * **Section**: [Get Unique Resource From Sub-Collection](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection)
    > Verbatim Quote: "it may be useful to allow a Get to retrieve that resource without knowing which parent collection contains it"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Filtering](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#filtering)
  * **Section**: [Time selection](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#time-selection)
  * **Section**: [Search](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Filtering](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#97-filtering)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Time Selection](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#time-selection)
  * **Section**: [Complex Operation - Search](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---search)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [Record Limits](https://github.com/WhiteHouse/api-standards/blob/master/README.md#record-limits)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings)
    > Verbatim Quote: "q — default query parameter"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Use query parameters for exact matching (?status=ACTIVE); use q for free-text search; support POST /search for large queries. | Embedding filter clauses directly in URI path segments (/students/active) or unbounded unindexed queries. |
| **Contract Stability** | Version and document `collection-filtering` formally in `@snp/shared` | Breaking `collection-filtering` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `collection-filtering`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Filtering` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
