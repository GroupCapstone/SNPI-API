# Design Topic: Null data (`data-format-null`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-format-null](https://apistylebook.com/design/topics/data-format-null)

---

## 1. Original Topic Definition

> "How to deal with null data"

---

## 2. Architectural Principles Learned

This design topic governs **Null data** within the domain of **Data**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `data-format-null` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `data-format-null` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `data-format-null` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [JSON Attributes](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#json-attributes)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Property values](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values)
  * **Section**: [Null values should have their fields removed](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-null-values-should-have-their-fields-removed)
  * **Section**: [Boolean property values must not be null](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-boolean-property-values-must-not-be-null)
  * **Section**: [Empty array values should not be null](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-empty-array-values-should-not-be-null)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `data-format-null` formally | Changing `data-format-null` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-format-null`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Null data` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
