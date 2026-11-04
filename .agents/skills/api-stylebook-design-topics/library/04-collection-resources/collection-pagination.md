# Design Topic: Pagination (`collection-pagination`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Collection Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/collection-pagination](https://apistylebook.com/design/topics/collection-pagination)

---

## 1. Original Topic Definition

> "How to retrieve a range of resources in a collection"

---

## 2. In-Depth Architectural Knowledge Learned

Prevents memory exhaustion and unmanageable payloads. Zalando, Google, and Microsoft mandate pagination for all collections. Best practice prioritizes cursor-based pagination (page_token / after) for immutable real-time feeds, and limit/page offset pagination for administrative reporting tables. Maximum limit must be enforced (e.g. 100).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `collection-pagination` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `collection-pagination` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students?limit=20&after=cursor-xyz -> { "items": [...], "nextCursor": "cursor-next" }
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 14 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Pagination](https://adidas-group.gitbooks.io/api-guidelines/content/execution/pagination.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Standard Query Parameters in URIs (start-index, max-results)"

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Resource/rate limits and paging](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Batching results](https://apiguide.readthedocs.io/en/latest/build_and_publish/batching_results.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Pagination](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination)
  * **Section**: [Pagination of Related Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination-of-related-resources)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)
  * **Section**: [Query parameters](http://deliveroo.engineering/guidelines/api-design/#query-parameters)
    > Verbatim Quote: "Those should accept the page and per_page parameters"

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [List Pagination](https://cloud.google.com/apis/design/design_patterns#list_pagination)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Paging](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#paging)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Divide Large Responses Across Requests with Ranges](https://geemus.gitbooks.io/http-api-design/content/en/)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Big collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections)
  * **Section**: [Pagination](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#98-pagination)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Paging](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging)
  * **Section**: [Paging (Complex Operation - Search)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging-1)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Ranges Pagination](http://restful-api-design.readthedocs.io/en/latest/methods.html#ranges-pagination)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings)
    > Verbatim Quote: "limit, cursor, offset"
  * **Section**: [Pagination](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Enforce pagination with default limit (20) and max limit (100); return nextCursor or totalPages metadata. | Unbounded collection queries returning thousands of database records in a single payload. |
| **Contract Stability** | Version and document `collection-pagination` formally in `@snp/shared` | Breaking `collection-pagination` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `collection-pagination`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Pagination` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
