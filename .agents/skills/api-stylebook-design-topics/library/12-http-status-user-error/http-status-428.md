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

## 2. Architectural Principles Learned

This design topic governs **428 Precondition Required** within the domain of **HTTP Status User Error**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-status-428` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-status-428` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-status-428` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-status-428` formally | Changing `http-status-428` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-428`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `428 Precondition Required` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
