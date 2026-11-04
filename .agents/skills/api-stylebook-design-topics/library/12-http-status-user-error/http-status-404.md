# Design Topic: 404 Not Found (`http-status-404`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Status User Error](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-404](https://apistylebook.com/design/topics/http-status-404)

---

## 1. Original Topic Definition

> "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible."

---

## 2. Architectural Principles Learned

This design topic governs **404 Not Found** within the domain of **HTTP Status User Error**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-status-404` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-status-404` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-status-404` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 9 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [GET /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful)
  * **Section**: [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities)
    > Verbatim Quote: "404 Not Found if the entity does not exist"
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)
    > Verbatim Quote: "404 Not Found: the specified entity does not exist (unknown routes should not 404)."
  * **Section**: [Caching](http://deliveroo.engineering/guidelines/api-design/#caching)
    > Verbatim Quote: "Responses with the following status codes should specify a Cache-Control header"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Status (Get List of resources)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status)
  * **Section**: [HTTP Status (Read Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1)
  * **Section**: [Delete Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource)
    > Verbatim Quote: "404 Not Found HTTP status should not be utilized"
  * **Section**: [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [HTTP Status (Collections)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status)
  * **Section**: [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1)
  * **Section**: [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource)
  * **Section**: [Delete Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-status-404` formally | Changing `http-status-404` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-404`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `404 Not Found` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
