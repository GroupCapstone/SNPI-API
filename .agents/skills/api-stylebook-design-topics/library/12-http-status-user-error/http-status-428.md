# Design Topic: 428 Precondition Required (`http-status-428`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status User Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-428](https://apistylebook.com/design/topics/http-status-428)

---

## 1. Original Topic Definition

> "The origin server requires the request to be conditional. 
Intended to prevent the *lost update* problem, where a client GETs a resource's state, modifies it, 
and PUTs it back to the server, when meanwhile a third party has modified the state on the server, 
leading to a conflict.
"

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 428.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-428` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-428` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 428
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities)
    > Verbatim Quote: "428 Precondition Required, when the request lack a If-* header."

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 428 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 428 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-428` formally in `@snp/shared` | Breaking `http-status-428` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-428`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `428 Precondition Required` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
