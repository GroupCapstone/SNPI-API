# Design Topic: Developer experience (`developer-experience`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/developer-experience](https://apistylebook.com/design/topics/developer-experience)

---

## 1. Original Topic Definition

> "How to take care of developer experience (DX)"

---

## 2. Architectural Principles Learned

This design topic governs **Developer experience** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `developer-experience` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `developer-experience` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `developer-experience` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `developer-experience` formally | Changing `developer-experience` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `developer-experience`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Developer experience` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
