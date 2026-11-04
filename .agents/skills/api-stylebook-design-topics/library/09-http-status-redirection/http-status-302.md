# Design Topic: 302 Found (`http-status-302`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Redirection](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-302](https://apistylebook.com/design/topics/http-status-302)

---

## 1. Original Topic Definition

> "Common way of performing URL redirection. An HTTP response with this status code will additionally provide a URL in the location header field. The user agent (e.g. a web browser) is invited by a response with this code to make a second, otherwise identical, request to the new URL specified in the location field. 
"

---

## 2. Architectural Principles Learned

This design topic governs **302 Found** within the domain of **HTTP Status Redirection**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-status-302` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-status-302` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-status-302` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Redirections](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Caching](http://deliveroo.engineering/guidelines/api-design/#caching)
    > Verbatim Quote: "Responses with the following status codes should specify a Cache-Control header"

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [HTTP Status 302](http://zalando.github.io/restful-api-guidelines/)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-status-302` formally | Changing `http-status-302` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-302`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `302 Found` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
