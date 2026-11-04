# Design Topic: Notifying API consumers (`notifications-server-events`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Asynchronicity](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/notifications-server-events](https://apistylebook.com/design/topics/notifications-server-events)

---

## 1. Original Topic Definition

> "How to send events or notifications to API consumers"

---

## 2. Architectural Principles Learned

This design topic governs **Notifying API consumers** within the domain of **Asynchronicity**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `notifications-server-events` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `notifications-server-events` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `notifications-server-events` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `notifications-server-events` formally | Changing `notifications-server-events` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `notifications-server-events`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Notifying API consumers` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
