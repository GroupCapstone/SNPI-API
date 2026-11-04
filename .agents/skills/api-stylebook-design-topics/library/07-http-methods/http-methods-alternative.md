# Design Topic: Forbidden methods alternatives (`http-methods-alternative`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods-alternative](https://apistylebook.com/design/topics/http-methods-alternative)

---

## 1. Original Topic Definition

> "What to do when only possible HTTP methods are POST and GET"

---

## 2. In-Depth Architectural Knowledge Learned

Patterns for business actions that do not map naturally to CRUD verbs (e.g. approve, submit, cancel, activate). Modeled as sub-resource action verbs with POST.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `http-methods-alternative` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `http-methods-alternative` operations.

### Concrete HTTP Syntax / Representation:
```http
POST /api/v1/fee-invoices/INV-2026-001/cancel
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Query Requests with Large Inputs](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.7 Alternative Forms](https://github.com/CiscoDevNet/api-design-guide#37-alternative-forms)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Model actions as POST /resources/:id/<action-verb> (e.g. POST /invoices/INV-1/cancel). | Creating RPC methods in root path (/cancelInvoice); using GET for actions. |
| **Contract Stability** | Version and document `http-methods-alternative` formally in `@snp/shared` | Breaking `http-methods-alternative` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods-alternative`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Forbidden methods alternatives` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
