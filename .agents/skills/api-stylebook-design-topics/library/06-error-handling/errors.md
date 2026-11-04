# Design Topic: Errors (`errors`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Error handling](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/errors](https://apistylebook.com/design/topics/errors)

---

## 1. Original Topic Definition

> "How to handle errors"

---

## 2. Architectural Principles Learned

This design topic governs **Errors** within the domain of **Error handling**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `errors` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `errors` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `errors` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `errors` formally | Changing `errors` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `errors`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Errors` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
