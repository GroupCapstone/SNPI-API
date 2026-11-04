# Design Topic: API chaining (`api-chaining`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/api-chaining](https://apistylebook.com/design/topics/api-chaining)

---

## 1. Original Topic Definition

> "How to chain API call in internal systems"

---

## 2. Architectural Principles Learned

This design topic governs **API chaining** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `api-chaining` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `api-chaining` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `api-chaining` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 1 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.5.2 TrackingID Header](https://github.com/CiscoDevNet/api-design-guide#352-trackingid-header)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `api-chaining` formally | Changing `api-chaining` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `api-chaining`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `API chaining` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
