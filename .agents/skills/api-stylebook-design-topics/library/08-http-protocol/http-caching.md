# Design Topic: Caching (`http-caching`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Protocol](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-caching](https://apistylebook.com/design/topics/http-caching)

---

## 1. Original Topic Definition

> "How to use and provide relevant caching informations"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Caching within the domain of HTTP Protocol. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to use and provide relevant caching informations.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-caching` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-caching` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to HTTP Protocol specifications for Caching.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Caching](https://adidas-group.gitbooks.io/api-guidelines/content/execution/caching.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Version Control for Entities"
  * **Section**: [Caching](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.5.1 Standard Headers](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers)
    > Verbatim Quote: "ETag, If-Match, If-None-Match"

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Resource lifecycle](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle)
  * **Section**: [Caching](http://deliveroo.engineering/guidelines/api-design/#caching)
  * **Section**: [Mutable resources](http://deliveroo.engineering/guidelines/api-design/#mutable-resources)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [ETags](https://cloud.google.com/apis/design/design_patterns#etags)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Caching](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Support ETags for Caching](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo)
    > Verbatim Quote: "Where necessary, especially for caching and concurrent access to resources, ETag (of unique version identifiers of resources) should be leveraged"
  * **Section**: [By default, http caching must be disabled](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#di-default-il-caching-http-deve-essere-disabilitato)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers)
    > Verbatim Quote: "If-Match, If-None-Match, If-Range"
  * **Section**: [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers)
    > Verbatim Quote: "ETag"
  * **Section**: [Retention policy for operation results](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#133-retention-policy-for-operation-results)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Read-only resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-only-resources)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Support the ETag Header](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#could-support-the-etag-header)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Caching; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Caching. |
| **Contract Stability** | Version and document `http-caching` formally in `@snp/shared` | Breaking `http-caching` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-caching`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Caching` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
