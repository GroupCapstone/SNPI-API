# Design Topic: Internationalization (`data-internationalization`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-internationalization](https://apistylebook.com/design/topics/data-internationalization)

---

## 1. Original Topic Definition

> "Providing internationalized data representation (e.g. adapted to the user's country)"

---

## 2. Architectural Principles Learned

This design topic governs **Internationalization** within the domain of **Data**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `data-internationalization` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `data-internationalization` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `data-internationalization` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Common Data Types](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html)
    > Verbatim Quote: "language, country code, currency"
  * **Section**: [Localization](https://adidas-group.gitbooks.io/api-guidelines/content/execution/localization.html)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Internationalisation (i18n)](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `data-internationalization` formally | Changing `data-internationalization` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-internationalization`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Internationalization` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
