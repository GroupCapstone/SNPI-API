# Design Topic: GET (`http-methods-get`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods-get](https://apistylebook.com/design/topics/http-methods-get)

---

## 1. Original Topic Definition

> "The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect.
"

---

## 2. In-Depth Architectural Knowledge Learned

Safe, idempotent resource retrieval. Must never modify server state. Must not accept a request body. Responses should leverage HTTP caching headers (ETag, Cache-Control).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-methods-get` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-methods-get` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students/STU-001 -> HTTP/1.1 200 OK
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 12 organization guidelines explicitly specify standards for this topic:

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [GET /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [GET](https://github.com/cloudfoundry/cc-api-v3-style-guide#get)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful)
  * **Section**: [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints)
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Standard Methods](https://cloud.google.com/apis/design/standard_methods)
  * **Section**: [List](https://cloud.google.com/apis/design/standard_methods#list)
    > Verbatim Quote: "The List method must use an HTTP GET verb."
  * **Section**: [Get](https://cloud.google.com/apis/design/standard_methods#get)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md)
  * **Section**: [Get List of resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources)
  * **Section**: [Read Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo)
    > Verbatim Quote: "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231"
  * **Section**: [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker)
    > Verbatim Quote: "the GET method is used to consume messages from queues and topics / subscriptions;"
  * **Section**: [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)
  * **Section**: [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [GET](http://zalando.github.io/restful-api-guidelines/http/Http.html#get)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Use GET strictly for data retrieval; return 200 OK or 404 Not Found. | Triggering state changes, email dispatches, or database writes inside GET handlers. |
| **Contract Stability** | Version and document `http-methods-get` formally in `@snp/shared` | Breaking `http-methods-get` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods-get`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `GET` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
