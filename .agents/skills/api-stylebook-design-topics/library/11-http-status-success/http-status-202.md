# Design Topic: 202 Accepted (`http-status-202`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Success](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-202](https://apistylebook.com/design/topics/http-status-202)

---

## 1. Original Topic Definition

> "The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs.
"

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 202.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-202` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-202` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 202
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Successful Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)
    > Verbatim Quote: "POST and PATCH should never result in a 200 (generally 201, occasionally 202)."

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Success Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 202 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 202 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-202` formally in `@snp/shared` | Breaking `http-status-202` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-202`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `202 Accepted` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
