# Design Topic: Naming (`naming`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Naming](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/naming](https://apistylebook.com/design/topics/naming)

---

## 1. Original Topic Definition

> "How to name things"

---

## 2. In-Depth Architectural Knowledge Learned

Universal naming standard across all API endpoints. Use clear, intuitive, domain-aligned nouns. Resource collections must be pluralized.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `naming` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `naming` operations.

### Concrete HTTP Syntax / Representation:
```http
/api/v1/academic-years (Valid) vs /getAcademicYear (Invalid)
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Naming Conventions](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html)
  * **Section**: [Reserved Identifiers](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/reserved-identifiers.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)
    > Verbatim Quote: "3.3.11 With regard to JSON representation property names, and URL query parameters, services SHOULD..."

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Query Parameters](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters)
  * **Section**: [Field Names](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names)
  * **Section**: [URL Structure](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Naming](http://deliveroo.engineering/guidelines/api-design/#naming)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id)
    > Verbatim Quote: "Must be in plural form"
  * **Section**: [Standard Fields](https://cloud.google.com/apis/design/standard_fields)
    > Verbatim Quote: "This section describes a set of standard message field definitions that should be used when similar concepts are needed. This will ensure the same concept has the same name and semantics across different APIs."
  * **Section**: [Naming Conventions](https://cloud.google.com/apis/design/naming_convention)
  * **Section**: [Representing Ranges](https://cloud.google.com/apis/design/design_patterns#representing_ranges)
  * **Section**: [List Paginations](https://cloud.google.com/apis/design/design_patterns#list_pagination)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Building Your Resource Taxonomy](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy)
  * **Section**: [Resource naming](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#resource-naming)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Resource names](https://geemus.gitbooks.io/http-api-design/content/en/requests/resource-names.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Uniformity and naming (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#uniformita-e-naming)
  * **Section**: [Uniformity and naming (SOAP)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#uniformita-e-naming)
  * **Section**: [Resource collections can use plural names](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)
    > Verbatim Quote: "Collection resource names should be plural nouns"

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Property naming](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-naming)
  * **Section**: [API Naming](http://zalando.github.io/restful-api-guidelines/naming/Naming.html)
  * **Section**: [Use Domain-Specific Resource Names](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-use-domainspecific-resource-names)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Use plural business nouns (/courses, /students, /teachers); maintain ubiquitous domain language. | Using verbs in URIs (/getAllStudents, /deleteUser); mixing abbreviations with full words. |
| **Contract Stability** | Version and document `naming` formally in `@snp/shared` | Breaking `naming` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `naming`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Naming` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
