# Design Topic: HTTP protocol (`http`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Protocol](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http](https://apistylebook.com/design/topics/http)

---

## 1. Original Topic Definition

> "General informations about HTTP protocol"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for HTTP protocol within the domain of HTTP Protocol. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to General informations about HTTP protocol.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to HTTP Protocol specifications for HTTP protocol.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [HTTP](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/http.html)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Compression](http://deliveroo.engineering/guidelines/api-design/#compression)
    > Verbatim Quote: "Servers may support the Accept-Encoding header for compression purposes, but this is not mandatory."

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [HTTP protocol](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [HTTP](http://zalando.github.io/restful-api-guidelines/)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for HTTP protocol; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for HTTP protocol. |
| **Contract Stability** | Version and document `http` formally in `@snp/shared` | Breaking `http` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `HTTP protocol` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
