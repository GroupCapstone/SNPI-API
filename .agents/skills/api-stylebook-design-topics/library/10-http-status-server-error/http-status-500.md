# Design Topic: 500 Internal Server Error (`http-status-500`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status Server Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-500](https://apistylebook.com/design/topics/http-status-500)

---

## 1. Original Topic Definition

> "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable."

---

## 2. Architectural Principles Learned

This design topic governs **500 Internal Server Error** within the domain of **HTTP Status Server Error**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-status-500` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-status-500` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-status-500` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Server Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Server Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-status-500` formally | Changing `http-status-500` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-500`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `500 Internal Server Error` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
