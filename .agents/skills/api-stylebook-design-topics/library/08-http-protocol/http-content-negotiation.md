# Design Topic: Content negociation and media types (`http-content-negotiation`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Protocol](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-content-negotiation](https://apistylebook.com/design/topics/http-content-negotiation)

---

## 1. Original Topic Definition

> "How to describe your API data format and/or propose different formats (like json, yaml, xml atom, ...)"

---

## 2. Architectural Principles Learned

This design topic governs **Content negociation and media types** within the domain of **HTTP Protocol**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-content-negotiation` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-content-negotiation` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-content-negotiation` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 10 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Content Negociation](https://adidas-group.gitbooks.io/api-guidelines/content/message/content-negotiation.html)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Formats](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#formats)
  * **Section**: [API Payload format encoding](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#api-payload-format-encoding)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)
  * **Section**: [3.5.1 Standard Headers](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers)
    > Verbatim Quote: "Accept header, Content-Type header"

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Content type negotiation](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation)
  * **Section**: [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Protocol Buffers v3](https://cloud.google.com/apis/design/proto3)
    > Verbatim Quote: "It supports both binary and text wire formats, and works with many different wire protocols on different platforms."

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento)
  * **Section**: [Avoid custom Content-Types](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#evitare-content-type-personalizzati)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers)
    > Verbatim Quote: "Accept Content Type"
  * **Section**: [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers)
    > Verbatim Quote: "Content Type"
  * **Section**: [Clients-specified response format](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7101-clients-specified-response-format)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Representations](http://restful-api-design.readthedocs.io/en/latest/resources.html#representations)
  * **Section**: [Content-Types](http://restful-api-design.readthedocs.io/en/latest/resources.html#content-types)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls)
    > Verbatim Quote: "Formats should be in the form of api/v2/resource/{id}.json"

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Media Type Versioning](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning)
  * **Section**: [Modify the Content-Type for Embedded Resources](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources)
  * **Section**: [Use Application-Specific Content Types](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-applicationspecific-content-types)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-content-negotiation` formally | Changing `http-content-negotiation` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-content-negotiation`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Content negociation and media types` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
