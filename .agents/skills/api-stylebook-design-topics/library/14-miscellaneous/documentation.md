# Design Topic: Documentation (`documentation`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/documentation](https://apistylebook.com/design/topics/documentation)

---

## 1. Original Topic Definition

> "How to produce and/or propose API documentation"

---

## 2. Architectural Principles Learned

This design topic governs **Documentation** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `documentation` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `documentation` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `documentation` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [OpenAPI Specification](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html)
  * **Section**: [API Design Platform - Apiary](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Discoverability](https://apiguide.readthedocs.io/en/latest/principles/discoverability.html)
  * **Section**: [Document your API](https://apiguide.readthedocs.io/en/latest/build_and_publish/documentation.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.9 Status Codes](https://github.com/CiscoDevNet/api-design-guide#39-status-codes)
    > Verbatim Quote: "3.9.4 Documentation of response payloads MUST NOT reveal internal implementation details of the server."
  * **Section**: [API Documentation](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#api-documentation)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Documenting APIs](http://deliveroo.engineering/guidelines/api-design/#documenting-apis)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax)
    > Verbatim Quote: "To provide a consistent developer experience across APIs and reduce learning curve, API designers must use the ISO 14977 Extended Backus-Naur Form (EBNF) syntax to define such grammars"
  * **Section**: [Output Fields](https://cloud.google.com/apis/design/design_patterns#output_fields)
    > Verbatim Quote: "For fields that are output only, the field attribute shall be documented."
  * **Section**: [Documentation](https://cloud.google.com/apis/design/documentation)
    > Verbatim Quote: "This section provides guidelines for adding inline documentation to your API. Most APIs will also have overviews, tutorials, and higher-level reference documentation, which are outside the scope of this Design Guide."
  * **Section**: [Checklist for all descriptions](https://cloud.google.com/apis/design/documentation#checklist_for_all_descriptions)
    > Verbatim Quote: "In most cases, there's more to say than just restating the obvious"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Every API MUST be described using a formal API description language](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#every-api-must-be-described-using-a-formal-api-description-language)
  * **Section**: [Documentation](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Provide machine-readable JSON schema](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-machine-readable-json-schema.html)
  * **Section**: [Provide human-readable docs](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-human-readable-docs.html)
  * **Section**: [Provide executable examples](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-executable-examples.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest)
    > Verbatim Quote: "For these reasons the ModI imposes the use of OpenAPI v3. An OpenAPI file allows you to describe the entire interface (available endpoints and operations on each endpoint, input and output parameters for each operation, authentication methods, contact information, license, terms of use, etc.)."

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers)
    > Verbatim Quote: "In addition, services SHOULD include a Link header (see RFC 5988) to point to documentation for the resource"

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Forms](http://restful-api-design.readthedocs.io/en/latest/forms.html)
    > Verbatim Quote: "... without referring to external documentation, an API user does not know what data to provide to operations that take input."

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Provide External Documentation](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#should-provide-external-documentation)
  * **Section**: [Reflect Deprecation in API Definition](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#must-reflect-deprecation-in-api-definition)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `documentation` formally | Changing `documentation` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `documentation`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Documentation` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
