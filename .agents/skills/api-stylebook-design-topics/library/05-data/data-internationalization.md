# Design Topic: Internationalization (`data-internationalization`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-internationalization](https://apistylebook.com/design/topics/data-internationalization)

---

## 1. Original Topic Definition

> "Providing internationalized data representation (e.g. adapted to the user's country)"

---

## 2. In-Depth Architectural Knowledge Learned

Localization and international text. Governed by BCP 47 language tags in Accept-Language, UTF-8 unicode encoding, and ISO standards for localized formatting.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `data-internationalization` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `data-internationalization` operations.

### Concrete HTTP Syntax / Representation:
```http
Accept-Language: km-KH, km;q=0.9, en-US;q=0.8
```

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
| **Architectural Execution** | Accept BCP 47 language headers (Accept-Language: km-KH, en-US); store text in normalized UTF-8. | Assuming ASCII encoding; hardcoding English-only validation regex on human names. |
| **Contract Stability** | Version and document `data-internationalization` formally in `@snp/shared` | Breaking `data-internationalization` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-internationalization`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Internationalization` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
