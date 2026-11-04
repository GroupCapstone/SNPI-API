# Design Topic: Create resource with a specific ID (`resource-creation-with-id`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-creation-with-id](https://apistylebook.com/design/topics/resource-creation-with-id)

---

## 1. Original Topic Definition

> "How to create resource with a provided id"

---

## 2. In-Depth Architectural Knowledge Learned

Idempotent resource creation when client supplies the identifier. Modeled via PUT /collection/:id.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource-creation-with-id` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource-creation-with-id` operations.

### Concrete HTTP Syntax / Representation:
```http
PUT /api/v1/branches/BR-NORTH -> 201 Created (if new) / 200 OK (if replaced)
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 5 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.2 PUT](https://github.com/CiscoDevNet/api-design-guide#362-put)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Update](https://cloud.google.com/apis/design/standard_methods#update)
    > Verbatim Quote: "If the API accepts client-assigned resource names, the server may allow the client to specify a non-existent resource name and create a new resource."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Create New Resource - Consumer Supplied Identifier](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Create New Resource - Consumer Supplied Identifier](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource---consumer-supplied-identifier)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Use PUT /collection/:id when client is authorized to dictate identity; return 201 Created if newly made. | Silently overwriting existing data without precondition check. |
| **Contract Stability** | Version and document `resource-creation-with-id` formally in `@snp/shared` | Breaking `resource-creation-with-id` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-creation-with-id`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Create resource with a specific ID` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
