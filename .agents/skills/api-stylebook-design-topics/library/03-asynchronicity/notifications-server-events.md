# Design Topic: Notifying API consumers (`notifications-server-events`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Asynchronicity](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/notifications-server-events](https://apistylebook.com/design/topics/notifications-server-events)

---

## 1. Original Topic Definition

> "How to send events or notifications to API consumers"

---

## 2. In-Depth Architectural Knowledge Learned

Informs API consumers of external state changes without wasteful polling. Red Hat, Microsoft, and Zalando define standards for signed Webhooks (HMAC SHA-256), Server-Sent Events (SSE) for unidirectional streaming, and event replay tokens.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `notifications-server-events` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `notifications-server-events` operations.

### Concrete HTTP Syntax / Representation:
```http
POST /webhook-endpoint
X-Signature-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
X-Event-Id: evt-12345
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [The typical flow, push notifications](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications)
  * **Section**: [Push notifications via webhooks](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#14-push-notifications-via-webhooks)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Notifications](http://restful-api-design.readthedocs.io/en/latest/methods.html#notifications)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Events](http://zalando.github.io/restful-api-guidelines/events/events.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Use cryptographically signed webhooks with idempotency keys and retry backoff policies. | Requiring clients to poll aggressive 1-second loops for rare asynchronous state transitions. |
| **Contract Stability** | Version and document `notifications-server-events` formally in `@snp/shared` | Breaking `notifications-server-events` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `notifications-server-events`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Notifying API consumers` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
