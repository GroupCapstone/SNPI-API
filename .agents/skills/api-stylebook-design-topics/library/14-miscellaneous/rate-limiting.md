# Design Topic: Rate limiting (`rate-limiting`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/rate-limiting](https://apistylebook.com/design/topics/rate-limiting)

---

## 1. Original Topic Definition

> "How to provide information about how many calls a consumer can do"

---

## 2. Architectural Principles Learned

This design topic governs **Rate limiting** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `rate-limiting` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `rate-limiting` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `rate-limiting` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Rate Limiting](https://adidas-group.gitbooks.io/api-guidelines/content/execution/rate-limiting.html)

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Resource/rate limits and paging](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities)
    > Verbatim Quote: "429 Too Many Requests if the service throttles requests from an aggressive client"

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Show rate limit status](https://geemus.gitbooks.io/http-api-design/content/en/responses/show-rate-limit-status.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `rate-limiting` formally | Changing `rate-limiting` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `rate-limiting`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Rate limiting` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
