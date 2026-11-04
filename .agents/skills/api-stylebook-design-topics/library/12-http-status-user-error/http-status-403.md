# Design Topic: 403 Forbidden (`http-status-403`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status User Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-403](https://apistylebook.com/design/topics/http-status-403)

---

## 1. Original Topic Definition

> "The request was a valid request, but the server is refusing to respond to it. The user might be logged in but does not have the necessary permissions for the resource."

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 403.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-403` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-403` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 403
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Require Secure Connections](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html)
  * **Section**: [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 403 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 403 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-403` formally in `@snp/shared` | Breaking `http-status-403` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-403`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `403 Forbidden` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
