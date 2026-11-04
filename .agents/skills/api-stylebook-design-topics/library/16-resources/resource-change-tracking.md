# Design Topic: Track change (`resource-change-tracking`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-change-tracking](https://apistylebook.com/design/topics/resource-change-tracking)

---

## 1. Original Topic Definition

> "How to track change on resources"

---

## 2. In-Depth Architectural Knowledge Learned

Tracking mutations and concurrency. Resources expose createdAt, updatedAt, version (or etag), and audit user references.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-change-tracking` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-change-tracking` operations.

### Concrete HTTP Syntax / Representation:
```http
{"createdAt": "2026-11-04T10:00:00.000Z", "updatedAt": "2026-11-04T10:30:00.000Z", "version": 2}
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints)
    > Verbatim Quote: "Responses should include a Last-Modified or ETag header, and may include both"

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Delta queries](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#10-delta-queries)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Include ISO 8601 timestamps (createdAt, updatedAt) and optimistic concurrency version numbers. | Allowing blind writes without optimistic concurrency control in multi-user workflows. |
| **Contract Stability** | Version and document `resource-change-tracking` formally in `@snp/shared` | Breaking `resource-change-tracking` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-change-tracking`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Track change` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
