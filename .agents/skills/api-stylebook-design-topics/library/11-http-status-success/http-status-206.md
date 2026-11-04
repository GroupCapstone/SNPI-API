# Design Topic: 206 Partial Content (`http-status-206`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Success](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-206](https://apistylebook.com/design/topics/http-status-206)

---

## 1. Original Topic Definition

> "The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.
"

---

## 2. Architectural Principles Learned

This design topic governs **206 Partial Content** within the domain of **HTTP Status Success**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-status-206` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-status-206` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-status-206` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Caching](http://deliveroo.engineering/guidelines/api-design/#caching)
    > Verbatim Quote: "Responses with the following status codes should specify a Cache-Control header"

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-status-206` formally | Changing `http-status-206` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-206`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `206 Partial Content` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
