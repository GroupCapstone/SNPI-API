# Design Topic: HTTP Statuses (`http-status`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Protocol](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status](https://apistylebook.com/design/topics/http-status)

---

## 1. Original Topic Definition

> "General information about HTTP statuses usage"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for HTTP Statuses within the domain of HTTP Protocol. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to General information about HTTP statuses usage.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to HTTP Protocol specifications for HTTP Statuses.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Status Codes](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-status-codes.html)
  * **Section**: [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.9 Status Codes](https://github.com/CiscoDevNet/api-design-guide#39-status-codes)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Responses Codes](https://github.com/cloudfoundry/cc-api-v3-style-guide#response-codes)
  * **Section**: [GET responses (Resource)](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-resource)
  * **Section**: [GET responses (Collection)](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-collection)
  * **Section**: [POST responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses)
  * **Section**: [PUT responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-1)
  * **Section**: [PATCH responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-2)
  * **Section**: [DELETE responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-3)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Mapping Response Codes For Success and Failure](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#mapping-response-codes-for-success-and-failure)
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Errors](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors)
  * **Section**: [Faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults)
  * **Section**: [HTTP Status Codes](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#711-http-status-codes)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [HTTP Status (Collections)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status)
  * **Section**: [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Meaningful HTTP Status Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-meaningful-http-status-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for HTTP Statuses; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for HTTP Statuses. |
| **Contract Stability** | Version and document `http-status` formally in `@snp/shared` | Breaking `http-status` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `HTTP Statuses` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
