# Design Topic: Errors (`errors`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Error handling](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/errors](https://apistylebook.com/design/topics/errors)

---

## 1. Original Topic Definition

> "How to handle errors"

---

## 2. In-Depth Architectural Knowledge Learned

RFC 7807 Problem Details for HTTP APIs (application/problem+json). Zalando, Google, and Microsoft require standard machine-readable error bodies containing type, title, status, detail, instance, code, and invalidParams for validation failures. Sensitive stack traces must never reach production responses.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `errors` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `errors` operations.

### Concrete HTTP Syntax / Representation:
```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json
{"type": "https://api.snp.edu.kh/errors/invalid-input", "title": "Validation Error", "status": 422, "code": "INVALID_STUDENT_AGE", "detail": "Student must be at least 5 years old."}
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Problem Detail](https://adidas-group.gitbooks.io/api-guidelines/content/message/error-reporting.html)
    > Verbatim Quote: "application/problem+json"
  * **Section**: [Error Response Format](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html)
    > Verbatim Quote: "application/problem+json"

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Error handling](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Use the Problem JSON scheme for error responses](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Errors](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors)
  * **Section**: [Faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults)
  * **Section**: [Long running API faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults)
  * **Section**: [Silent Fail Rule](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#63-silent-fail-rule)
  * **Section**: [Unsupported requests](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#15-unsupported-requests)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return RFC 7807 problem details; include deterministic error code and field-level validation errors. | Returning 200 OK with success: false; leaking database errors or backend stack traces. |
| **Contract Stability** | Version and document `errors` formally in `@snp/shared` | Breaking `errors` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `errors`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Errors` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
