# Design Topic: Resource's state (`resource-state`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-state](https://apistylebook.com/design/topics/resource-state)

---

## 1. Original Topic Definition

> "How to change a resource's state/status (like processed/sent/paid/...)"

---

## 2. In-Depth Architectural Knowledge Learned

Managing entity lifecycle states and transitions. State machines must validate valid next states and reject illegal transitions with 409 Conflict.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-state` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-state` operations.

### Concrete HTTP Syntax / Representation:
```http
PATCH /api/v1/invoices/INV-1 {"status": "PAID"} -> 409 if currently CANCELLED
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 3 organization guidelines explicitly specify standards for this topic:

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Use Cases](https://cloud.google.com/apis/design/custom_methods#use_cases)
    > Verbatim Quote: "Promote an employee (corpeng) If implemented as a standard update, the client would have to replicate the corporate policies governing the promotion process to ensure the promotion happens to the correct level, within the same career ladder etc."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Resource's state](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Complex Operation - Transient](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---transient)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Expose current status string; validate permitted transitions via state machine. | Allowing arbitrary direct status updates that skip business verification (e.g. from DRAFT to GRADUATED). |
| **Contract Stability** | Version and document `resource-state` formally in `@snp/shared` | Breaking `resource-state` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-state`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Resource's state` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
