# Design Topic: 412 Precondition Failed (`http-status-412`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status User Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-412](https://apistylebook.com/design/topics/http-status-412)

---

## 1. Original Topic Definition

> "The server does not meet one of the preconditions that the requester put on the request."

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 412.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-412` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-412` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 412
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Concurrency](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency)
  * **Section**: [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities)
    > Verbatim Quote: "412 Precondition Failed if e.g. the resource wouldn’t statisfy some uniqueness criterion"
  * **Section**: [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities)
    > Verbatim Quote: "412 Precondition failed, when failing to honour If-Match or If-Unmodified-Since headers."
  * **Section**: [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities)
    > Verbatim Quote: "412 Precondition Failed"
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)
    > Verbatim Quote: "412 Precondition failed: resource versioning issues."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 412 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 412 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-412` formally in `@snp/shared` | Breaking `http-status-412` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-412`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `412 Precondition Failed` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
