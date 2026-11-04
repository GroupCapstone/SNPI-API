# Design Topic: Governance (`governance`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [API Lifecycle](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/governance](https://apistylebook.com/design/topics/governance)

---

## 1. Original Topic Definition

> "How to ensure API governance (advertise, consistency, ...)"

---

## 2. Architectural Principles Learned

This design topic governs **Governance** within the domain of **API Lifecycle**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `governance` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `governance` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `governance` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 8 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Version Control System](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/version-control-system.html)
  * **Section**: [OpenAPI Specification](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html)
  * **Section**: [API Design Platform - Apiary](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html)
  * **Section**: [Testing](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/testing.html)
  * **Section**: [Rules For Extending](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Using these Guidelines](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-UsingtheseGuidelines)
    > Verbatim Quote: "We strongly recommend that someone who is familiar with these guidelines should review your REST API code"
  * **Section**: [Version Control for APIs](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs)
    > Verbatim Quote: "When to Change the Version"

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Compatibility policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy)
  * **Section**: [Deprecation policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Register your API](https://apiguide.readthedocs.io/en/latest/build_and_publish/advertise.html)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [API Modelling and Design Process](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#api-modelling-and-design-process)
  * **Section**: [API Design Review Process](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-review-process/api-design-review-process.md)
  * **Section**: [Message Schema and Postel's Law](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Catalog of API/Services](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#catalogo-delle-api-servizi)
  * **Section**: [Model governance](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#governance-del-modello)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Interpreting The Guidelines](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#4-interpreting-the-guidelines)
  * **Section**: [When to version](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#122-when-to-version)
  * **Section**: [Definition of a breaking change](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#123-definition-of-a-breaking-change)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [API First](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-api-first-define-apis-using-openapi)
  * **Section**: [Deprecation](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html)
  * **Section**: [API Discovery](http://zalando.github.io/restful-api-guidelines/api-discovery/ApiDiscovery.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `governance` formally | Changing `governance` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `governance`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Governance` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
