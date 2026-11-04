# Design Topic: 300 Multiple Choices (`http-status-300`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Redirection](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-300](https://apistylebook.com/design/topics/http-status-300)

---

## 1. Original Topic Definition

> "The 300 (Multiple Choices) status code indicates that the target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers. In other words, the server desires that the user agent engage in reactive negotiation to select the most appropriate representation(s) for its needs.
"

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 300.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-300` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-300` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 300
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
| **Architectural Execution** | Return status code 300 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 300 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-300` formally in `@snp/shared` | Breaking `http-status-300` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-300`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `300 Multiple Choices` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
