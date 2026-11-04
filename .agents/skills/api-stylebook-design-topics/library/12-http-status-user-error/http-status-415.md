# Design Topic: 415 Unsupported Media Type (`http-status-415`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status User Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-415](https://apistylebook.com/design/topics/http-status-415)

---

## 1. Original Topic Definition

> "The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format."

---

## 2. In-Depth Architectural Knowledge Learned

Defines standard semantics, headers, and payload expectations for HTTP status code 415.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-415` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-415` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 415
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities)
    > Verbatim Quote: "415 Unsupported if using versioning and the server doesn’t support the specified version"
  * **Section**: [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities)
    > Verbatim Quote: "415 Unsupported if using versioning and the server doesn’t support the specified version."
  * **Section**: [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities)
    > Verbatim Quote: "415 Unsupported if using versioning and the server doesn’t support the specified version."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return status code 415 strictly when conditions specified by RFC 9110 and guidelines are met. | Misusing 415 for unrelated semantic conditions or masking errors with 200 OK. |
| **Contract Stability** | Version and document `http-status-415` formally in `@snp/shared` | Breaking `http-status-415` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-415`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `415 Unsupported Media Type` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
