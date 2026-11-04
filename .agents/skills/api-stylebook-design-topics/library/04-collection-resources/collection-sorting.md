# Design Topic: Sorting a collection (`collection-sorting`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Collection Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/collection-sorting](https://apistylebook.com/design/topics/collection-sorting)

---

## 1. Original Topic Definition

> "How to sort a collection of resources"

---

## 2. In-Depth Architectural Knowledge Learned

Standardizes ordering of collection entities. Industry guidelines converge on sort parameter. Zalando and Deliveroo use prefix notation (+name for ascending, -name for descending) or comma-separated fields with direction (?sort=lastName,asc,createdAt,desc).

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `collection-sorting` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `collection-sorting` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students?sort=-enrollmentDate,lastName
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Sorting Order](https://cloud.google.com/apis/design/design_patterns#sorting_order)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Sorting](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#sorting)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Variable order rule](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#62-variable-order-rule)
  * **Section**: [Sorting collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#96-sorting-collections)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Sorting](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sorting)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings)
    > Verbatim Quote: "sort — comma-separated list of fields to sort"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Support sort parameter with +/- or asc/desc prefix; enforce deterministic secondary sorting by ID. | Non-deterministic sorting that shifts item positions across pagination boundaries. |
| **Contract Stability** | Version and document `collection-sorting` formally in `@snp/shared` | Breaking `collection-sorting` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `collection-sorting`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Sorting a collection` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
