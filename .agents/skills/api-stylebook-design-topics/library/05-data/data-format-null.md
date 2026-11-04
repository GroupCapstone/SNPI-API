# Design Topic: Null data (`data-format-null`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-format-null](https://apistylebook.com/design/topics/data-format-null)

---

## 1. Original Topic Definition

> "How to deal with null data"

---

## 2. In-Depth Architectural Knowledge Learned

Handling missing, absent, and empty values. Guidelines recommend: omit optional fields if unpopulated, or use explicit null only when a consumer intentionally clears a value. Never serialize empty strings ("") for missing numbers or dates. Empty collections must be empty arrays ([]), not null.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `data-format-null` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `data-format-null` operations.

### Concrete HTTP Syntax / Representation:
```http
{"middleName": null, "enrolledClasses": []}
```

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
| **Architectural Execution** | Use explicit null to represent deliberate value erasure; return empty arrays [] for empty sets. | Sending empty strings "" or sentinel values (-1, 9999-99-99) for missing or null data. |
| **Contract Stability** | Version and document `data-format-null` formally in `@snp/shared` | Breaking `data-format-null` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-format-null`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Null data` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
