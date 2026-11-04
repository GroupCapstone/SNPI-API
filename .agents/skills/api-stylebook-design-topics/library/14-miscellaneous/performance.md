# Design Topic: Performance and bandwidth (`performance`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/performance](https://apistylebook.com/design/topics/performance)

---

## 1. Original Topic Definition

> "How to deal with high traffic or consumers with low bandwith"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Performance and bandwidth within the domain of Miscellaneous. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to deal with high traffic or consumers with low bandwith.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `performance` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `performance` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Miscellaneous specifications for Performance and bandwidth.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Compression](http://deliveroo.engineering/guidelines/api-design/#compression)
  * **Section**: [Mobile-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Keep JSON minified in all responses](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Optimize bandwidth usage and improve responsiveness](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Performance and bandwidth](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Performance](http://zalando.github.io/restful-api-guidelines/performance/Performance.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Performance and bandwidth; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Performance and bandwidth. |
| **Contract Stability** | Version and document `performance` formally in `@snp/shared` | Breaking `performance` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `performance`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Performance and bandwidth` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
