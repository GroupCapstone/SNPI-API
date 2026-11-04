# Design Topic: 203 Non-Authoritative Information (`http-status-203`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Success](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-203](https://apistylebook.com/design/topics/http-status-203)

---

## 1. Original Topic Definition

> "The 203 (Non-Authoritative Information) status code indicates that the request was successful but the enclosed payload has been modified from that of the origin server’s 200 (OK) response by a transforming proxy. 
"

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 203.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-203` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-203` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 203
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 1 organization guidelines explicitly specify standards for this topic:

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Caching](http://deliveroo.engineering/guidelines/api-design/#caching)
    > Verbatim Quote: "Responses with the following status codes should specify a Cache-Control header"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 203 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 203 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-203` formally in `@snp/shared` | Breaking `http-status-203` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-203`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `203 Non-Authoritative Information` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
