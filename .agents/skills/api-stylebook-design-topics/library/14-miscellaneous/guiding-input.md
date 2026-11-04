# Design Topic: Guiding inputs (`guiding-input`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/guiding-input](https://apistylebook.com/design/topics/guiding-input)

---

## 1. Original Topic Definition

> "How to help consumers or end user to input relevant data"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Guiding inputs within the domain of Miscellaneous. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to help consumers or end user to input relevant data.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `guiding-input` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `guiding-input` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Miscellaneous specifications for Guiding inputs.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Request Validation](https://cloud.google.com/apis/design/design_patterns#request_validation)
    > Verbatim Quote: "If this field is set to true, the server must not execute any side effects and only perform implementation-specific validation consistent with the full request."
  * **Section**: [Request Duplication](https://cloud.google.com/apis/design/design_patterns#request_duplication)
    > Verbatim Quote: "some API methods cannot easily be idempotent, such as creating a resource, and there is a need to avoid unnecessary duplication"
  * **Section**: [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax)
  * **Section**: [Output Fields](https://cloud.google.com/apis/design/design_patterns#output_fields)
    > Verbatim Quote: "This means that the server must ignore the presence of output only fields and any indication of it."

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Forms](http://restful-api-design.readthedocs.io/en/latest/forms.html)
    > Verbatim Quote: "... without referring to external documentation, an API user does not know what data to provide to operations that take input."

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Guiding inputs; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Guiding inputs. |
| **Contract Stability** | Version and document `guiding-input` formally in `@snp/shared` | Breaking `guiding-input` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `guiding-input`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Guiding inputs` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
