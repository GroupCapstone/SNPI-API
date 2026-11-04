# Design Topic: PATCH (`http-methods-patch`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods-patch](https://apistylebook.com/design/topics/http-methods-patch)

---

## 1. Original Topic Definition

> "The PATCH method applies partial modifications to a resource.
"

---

## 2. In-Depth Architectural Knowledge Learned

Partial resource modification. Adheres to RFC 7396 (JSON Merge Patch) where only modified properties are supplied in the request body. Properties with null values indicate field removal.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-methods-patch` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-methods-patch` operations.

### Concrete HTTP Syntax / Representation:
```http
PATCH /api/v1/students/STU-001
Content-Type: application/merge-patch+json
{"status": "SUSPENDED"}
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 10 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.5 PATCH](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [PATCH](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful)
  * **Section**: [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities)
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)
    > Verbatim Quote: "409 Conflict: PATCH and PUT failures with unique fields"
  * **Section**: [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors)
    > Verbatim Quote: "POST and PATCH should never result in a 200 (generally 201, occasionally 202)."

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Standard Methods](https://cloud.google.com/apis/design/standard_methods)
  * **Section**: [Update](https://cloud.google.com/apis/design/standard_methods#update)
    > Verbatim Quote: "The standard Update method should support partial resource update, and use HTTP verb PATCH"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md)
  * **Section**: [Update Partial Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods)
  * **Section**: [PATCH](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch)
  * **Section**: [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)
  * **Section**: [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [PATCH](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Use PATCH for updating subsets of fields; follow RFC 7396 merge patch semantics. | Requiring full entity payloads on PATCH requests; rejecting partial property sets. |
| **Contract Stability** | Version and document `http-methods-patch` formally in `@snp/shared` | Breaking `http-methods-patch` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods-patch`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `PATCH` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
