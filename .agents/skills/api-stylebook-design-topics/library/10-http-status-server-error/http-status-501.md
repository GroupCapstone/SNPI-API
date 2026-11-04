# Design Topic: 501 Not Implemented (`http-status-501`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Server Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-501](https://apistylebook.com/design/topics/http-status-501)

---

## 1. Original Topic Definition

> "The server either does not recognize the request method, or it lacks the ability to fulfill the request. Usually this implies future availability (e.g., a new feature of a web-service API)."

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 501.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-501` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-501` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 501
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Server Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 501 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 501 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-501` formally in `@snp/shared` | Breaking `http-status-501` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-501`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `501 Not Implemented` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
