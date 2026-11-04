# Design Topic: Developer experience (`developer-experience`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/developer-experience](https://apistylebook.com/design/topics/developer-experience)

---

## 1. Original Topic Definition

> "How to take care of developer experience (DX)"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Developer experience within the domain of Miscellaneous. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to take care of developer experience (DX).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `developer-experience` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `developer-experience` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Miscellaneous specifications for Developer experience.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Deprecation policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Empathy](https://apiguide.readthedocs.io/en/latest/principles/empathy.html)
  * **Section**: [Errors](https://apiguide.readthedocs.io/en/latest/principles/errors.html)
  * **Section**: [Endpoint Stability](https://apiguide.readthedocs.io/en/latest/principles/availability.html)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax)
    > Verbatim Quote: "To provide a consistent developer experience across APIs and reduce learning curve, API designers must use the ISO 14977 Extended Backus-Naur Form (EBNF) syntax to define such grammars"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Documentation](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Client Guidance](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#6-client-guidance)
  * **Section**: [Client library optional](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#712-client-library-optional)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Developer experience; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Developer experience. |
| **Contract Stability** | Version and document `developer-experience` formally in `@snp/shared` | Breaking `developer-experience` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `developer-experience`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Developer experience` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
