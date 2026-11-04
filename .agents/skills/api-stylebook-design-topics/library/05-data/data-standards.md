# Design Topic: Standards data (`data-standards`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-standards](https://apistylebook.com/design/topics/data-standards)

---

## 1. Original Topic Definition

> "Which standard use for values like languages, countries, currencies, ..."

---

## 2. In-Depth Architectural Knowledge Learned

Adoption of established global data standards: ISO 3166-1 alpha-2 for countries (KH, US), ISO 4217 for currencies (USD, KHR), IANA timezone database (Asia/Phnom_Penh), and E.164 for international phone numbers.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `data-standards` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `data-standards` operations.

### Concrete HTTP Syntax / Representation:
```http
{"country": "KH", "currency": "USD", "phone": "+85512345678"}
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Common Data Types](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html)
    > Verbatim Quote: "data, time, interval, duration, timestamps, language, country code, currency"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Currency](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#currency)
    > Verbatim Quote: "3-character ISO-4217"
  * **Section**: [Country](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#country)
    > Verbatim Quote: "ISO 3166-1-alpha-2"

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Use the properties according to standard nomenclatures](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#utilizzare-le-properties-secondo-nomenclature-standard)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Standards could be used for Language, Country and Currency](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-standards-could-be-used-for-language-country-and-currency)
  * **Section**: [Use Standards for Country, Language and Currency Codes](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-standards-for-country-language-and-currency-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Enforce ISO country codes, ISO currency codes, and E.164 phone formats across all schemas. | Inventing proprietary currency symbols, custom country abbreviations, or unformatted phone numbers. |
| **Contract Stability** | Version and document `data-standards` formally in `@snp/shared` | Breaking `data-standards` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-standards`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Standards data` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
