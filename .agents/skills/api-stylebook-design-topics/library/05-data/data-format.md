# Design Topic: Data format (`data-format`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-format](https://apistylebook.com/design/topics/data-format)

---

## 1. Original Topic Definition

> "which data format use"

---

## 2. Architectural Principles Learned

This design topic governs **Data format** within the domain of **Data**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `data-format` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `data-format` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `data-format` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Corporate Data Model](https://adidas-group.gitbooks.io/api-guidelines/content/application/harmonize-data.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Representations (Content Types) of Entities"
  * **Section**: [Appendix B: Basic Data Types](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixB:BasicDataTypes)

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Compatibility policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy)
  * **Section**: [Structured representations (application/json)](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json))
  * **Section**: [Forward compatibility](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Forwardcompatibility)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)
    > Verbatim Quote: "... prefer the native JSON boolean type ..."

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax)
  * **Section**: [Integer Types](https://cloud.google.com/apis/design/design_patterns#integer_types)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Hypermedia Response Format](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md)
  * **Section**: [Type Formatting](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md)
  * **Section**: [Message Schema and Postel's Law](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Accept serialized JSON in request bodies](https://geemus.gitbooks.io/http-api-design/content/en/requests/accept-serialized-json-in-request-bodies.html)
  * **Section**: [Provide standard timestamps](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html)
  * **Section**: [Nest foreign key relations](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html)
  * **Section**: [Keep JSON minified in all responses](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Data uniformity](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#uniformita-dei-dati)
  * **Section**: [Data format (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#formato-dei-dati)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Response Formats](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#710-response-formats)
  * **Section**: [JSON standardizations](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#11-json-standardizations)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Resource Data](http://restful-api-design.readthedocs.io/en/latest/resources.html#resource-data)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Property Values](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values)
  * **Section**: [Date property values should conform to RFC 3399](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399)
  * **Section**: [Time durations and intervals could conform to ISO 8601](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601)
  * **Section**: [Data Formats](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html)
  * **Section**: [Common Data Objects](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `data-format` formally | Changing `data-format` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-format`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Data format` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
