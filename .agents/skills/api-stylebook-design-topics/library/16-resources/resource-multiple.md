# Design Topic: Batch Bulk (`resource-multiple`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-multiple](https://apistylebook.com/design/topics/resource-multiple)

---

## 1. Original Topic Definition

> "How to handle batch/bulk processing/creation/update/... (e.g. handle multiple resources at conce)"

---

## 2. Architectural Principles Learned

This design topic governs **Batch Bulk** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-multiple` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-multiple` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-multiple` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 6 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [None](https://adidas-group.gitbooks.io/api-guidelines/content/execution/batch-operations.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.11 Bulk, Batch, and Multi-Result Operations](https://github.com/CiscoDevNet/api-design-guide#311-bulk-batch-and-multi-result-operations)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Batch Get](https://cloud.google.com/apis/design/standard_methods#list)
    > Verbatim Quote: "A batch get (such as a method that takes multiple resource ids and returns an object for each of those ids) should be implemented as a custom BatchGet method, rather than a List"
  * **Section**: [Common Custom Methods](https://cloud.google.com/apis/design/custom_methods#common_custom_methods)
    > Verbatim Quote: "Batch get of multiple resources."

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Batch Bulk](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Complex Operation - Composite](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---composite)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs)
    > Verbatim Quote: "Bulk update, Delete all dogs"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-multiple` formally | Changing `resource-multiple` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-multiple`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Batch Bulk` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
