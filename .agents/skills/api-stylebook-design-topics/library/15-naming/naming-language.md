# Design Topic: Language (`naming-language`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Naming](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/naming-language](https://apistylebook.com/design/topics/naming-language)

---

## 1. Original Topic Definition

> "Which language(s) use when designing an API"

---

## 2. In-Depth Architectural Knowledge Learned

Universal API language specification. All API contracts, paths, parameters, schemas, and error messages must be authored in American English.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `naming-language` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `naming-language` operations.

### Concrete HTTP Syntax / Representation:
```http
/enrollments (Standard American English)
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id)
    > Verbatim Quote: "Must use clear and concise English terms."
  * **Section**: [Naming Conventions](https://cloud.google.com/apis/design/naming_convention)
    > Verbatim Quote: "Names used in APIs should be in correct American English."

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Write APIs in U.S. English](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-write-apis-in-us-english)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Standardize all API symbols in American English (enrollment, cancel, color). | Mixing multiple spoken languages or dialects in endpoint paths or JSON schemas. |
| **Contract Stability** | Version and document `naming-language` formally in `@snp/shared` | Breaking `naming-language` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `naming-language`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Language` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
