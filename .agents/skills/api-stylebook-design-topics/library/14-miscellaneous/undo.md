# Design Topic: Undo (`undo`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/undo](https://apistylebook.com/design/topics/undo)

---

## 1. Original Topic Definition

> "How to undo things"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Undo within the domain of Miscellaneous. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to undo things.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `undo` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `undo` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Miscellaneous specifications for Undo.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6 HTTP Verbs](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)
    > Verbatim Quote: "*3.6.4.3 *The POST verb MAY be used to reverse the soft-delete of a resource, using an undelete parameter"

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Delete](https://cloud.google.com/apis/design/standard_methods#delete)
    > Verbatim Quote: "If the Delete method only marks the resource as being deleted, it should return the updated resource."
  * **Section**: [Undelete](https://cloud.google.com/apis/design/custom_methods#common_custom_methods)
    > Verbatim Quote: "Restore a resource that was previously deleted. The recommended retention period is 30-day."

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Undo; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Undo. |
| **Contract Stability** | Version and document `undo` formally in `@snp/shared` | Breaking `undo` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `undo`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Undo` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
