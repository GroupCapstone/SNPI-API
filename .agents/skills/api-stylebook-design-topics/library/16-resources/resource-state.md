# Design Topic: Resource's state (`resource-state`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-state](https://apistylebook.com/design/topics/resource-state)

---

## 1. Original Topic Definition

> "How to change a resource's state/status (like processed/sent/paid/...)"

---

## 2. Architectural Principles Learned

This design topic governs **Resource's state** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-state` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-state` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-state` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Use Cases](https://cloud.google.com/apis/design/custom_methods#use_cases)
    > Verbatim Quote: "Promote an employee (corpeng) If implemented as a standard update, the client would have to replicate the corporate policies governing the promotion process to ensure the promotion happens to the correct level, within the same career ladder etc."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Resource's state](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Complex Operation - Transient](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---transient)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-state` formally | Changing `resource-state` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-state`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Resource's state` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
