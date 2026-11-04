# Design Topic: HTTP methods (`http-methods`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods](https://apistylebook.com/design/topics/http-methods)

---

## 1. Original Topic Definition

> "General information about HTTP methods usage"

---

## 2. In-Depth Architectural Knowledge Learned

RFC 9110 HTTP method semantics. Methods are strictly classified into Safe (read-only, zero side effects: GET, HEAD, OPTIONS) and Idempotent (repeated identical executions yield identical state: GET, HEAD, PUT, DELETE, OPTIONS). POST is non-idempotent.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-methods` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-methods` operations.

### Concrete HTTP Syntax / Representation:
```http
GET: Safe & Idempotent | PUT: Idempotent | DELETE: Idempotent | POST: Non-idempotent
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 13 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Request Methods](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-methods.html)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Use HTTP methods and status codes](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6 HTTP Verbs](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)
  * **Section**: [REST Methods](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#rest-methods)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#requests)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Resource Oriented Design](https://cloud.google.com/apis/design/resources)
    > Verbatim Quote: "With the HTTP protocol, the resource names naturally map to URLs, and methods naturally map to HTTP methods POST, GET, PUT, PATCH, and DELETE."
  * **Section**: [Standard Methods](https://cloud.google.com/apis/design/standard_methods)
  * **Section**: [HTTP Verbs](https://cloud.google.com/apis/design/http_verbs)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo)
    > Verbatim Quote: "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231"
  * **Section**: [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker)
    > Verbatim Quote: "Although, depending on the implementations, the different REST service interfaces for accessing message brokers differ in functionality offered and ways of modeling queues, topics / subscriptions, the following behaviors of HTTP methods can be abstracted"

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs)
  * **Section**: [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use HTTP Methods Correctly](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-http-methods-correctly)
  * **Section**: [HTTP Methods must Fulfill Safeness and Idempotency Properties](http://zalando.github.io/restful-api-guidelines/http/Http.html#must--http-methods-must-fulfill-safeness-and-idempotency-properties)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Enforce strict safe and idempotent method semantics across all endpoints. | Tunneling all writes through GET or all actions through POST (RPC style). |
| **Contract Stability** | Version and document `http-methods` formally in `@snp/shared` | Breaking `http-methods` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `HTTP methods` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
