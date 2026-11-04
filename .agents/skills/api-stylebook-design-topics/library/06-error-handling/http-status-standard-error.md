# Design Topic: Error format (`http-status-standard-error`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Error handling](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-status-standard-error](https://apistylebook.com/design/topics/http-status-standard-error)

---

## 1. Original Topic Definition

> "How to provide information about errors"

---

## 2. In-Depth Architectural Knowledge Learned

Standardized mapping of error conditions to canonical HTTP status codes. 400 for malformed syntax, 401 for unauthenticated calls, 403 for unauthorized RBAC/tenant access, 404 for missing resources, 409 for state conflicts, 422 for schema validation errors, and 500 for internal server failures.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-status-standard-error` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-status-standard-error` operations.

### Concrete HTTP Syntax / Representation:
```http
400 (Bad Syntax) | 401 (No Token) | 403 (No Permission) | 404 (Not Found) | 422 (Validation Failed)
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 10 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Error Response Format](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html)
    > Verbatim Quote: "application/problem+json"

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [HTTP response principles](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#http-response-principles)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.9 Status Codes](https://github.com/CiscoDevNet/api-design-guide#39-status-codes)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#errors)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Error handling](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Generate structured errors](https://geemus.gitbooks.io/http-api-design/content/en/responses/generate-structured-errors.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Error condition responses](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Providing Error Documentation](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-providing-error-documentation)
  * **Section**: [Use Problem JSON](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html#must-use-problem-json)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Strictly align domain errors with the semantic HTTP status code hierarchy. | Using 500 Internal Error for user validation mistakes; using 404 when a user lacks access (use 403). |
| **Contract Stability** | Version and document `http-status-standard-error` formally in `@snp/shared` | Breaking `http-status-standard-error` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-status-standard-error`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Error format` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
