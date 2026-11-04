# Design Topic: OPTIONS (`http-methods-options`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods-options](https://apistylebook.com/design/topics/http-methods-options)

---

## 1. Original Topic Definition

> "The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
"

---

## 2. In-Depth Architectural Knowledge Learned

Communication options and CORS preflight. Server returns the Allow header specifying valid HTTP verbs and CORS Access-Control-* headers.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-methods-options` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-methods-options` operations.

### Concrete HTTP Syntax / Representation:
```http
OPTIONS /api/v1/students -> HTTP/1.1 204 No Content
Allow: GET, POST, OPTIONS
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.7 OPTIONS](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods)
  * **Section**: [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [OPTIONS](http://zalando.github.io/restful-api-guidelines/http/Http.html#options)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Return 204 No Content with Allow: GET, POST, PUT, DELETE, OPTIONS and CORS headers. | Blocking OPTIONS requests with 401 Unauthorized or omitting preflight headers. |
| **Contract Stability** | Version and document `http-methods-options` formally in `@snp/shared` | Breaking `http-methods-options` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods-options`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `OPTIONS` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
