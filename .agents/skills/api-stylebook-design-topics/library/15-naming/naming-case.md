# Design Topic: Case (`naming-case`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Naming](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/naming-case](https://apistylebook.com/design/topics/naming-case)

---

## 1. Original Topic Definition

> "Which case (lowercase, camelCase, ...) to use and when"

---

## 2. In-Depth Architectural Knowledge Learned

Industry consensus on casing: URIs use lowercase kebab-case (hyphen-separated). JSON request and response keys use camelCase. Query parameters use camelCase. Constants and enum values use UPPER_SNAKE_CASE. HTTP headers use kebab-case (Title-Case/kebab).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `naming-case` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `naming-case` operations.

### Concrete HTTP Syntax / Representation:
```http
URI: /fee-invoices | JSON: {"invoiceNumber": "INV-1", "status": "PENDING_PAYMENT"}
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 7 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Naming Conventions](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html)
  * **Section**: [JSON](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/json.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)
  * **Section**: [URL Paths](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Query Parameters](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters)
  * **Section**: [Field Names](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id)
    > Verbatim Quote: "Must be in plural form with lowerCamel case"
  * **Section**: [Camel Case](https://cloud.google.com/apis/design/naming_convention#camel_case)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Downcase paths and attributes](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [The properties of JSON objects must have a consistent naming](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-proprieta-degli-oggetti-json-devono-avere-un-naming-consistente)
    > Verbatim Quote: "snake_case camelCase"

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Property names must be snake_case](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-property-names-must-be-snakecase-and-never-camelcase)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | URIs: kebab-case | JSON properties: camelCase | Enums: UPPER_SNAKE_CASE. | Mixing snake_case and camelCase in JSON bodies; using camelCase or underscores in URI paths. |
| **Contract Stability** | Version and document `naming-case` formally in `@snp/shared` | Breaking `naming-case` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `naming-case`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Case` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
