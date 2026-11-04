# Design Topic: Replace resource (`resource-replacement`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-replacement](https://apistylebook.com/design/topics/resource-replacement)

---

## 1. Original Topic Definition

> "How to replace (or update fully) a resource"

---

## 2. Architectural Principles Learned

This design topic governs **Replace resource** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-replacement` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-replacement` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-replacement` prevents unneeded compute overhead, database contention, and network payloads.

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
    > Verbatim Quote: "If the Update method only supports full resource update, it must use HTTP verb PUT"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Update Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [PUT](http://zalando.github.io/restful-api-guidelines/http/Http.html#put)
    > Verbatim Quote: "fully uploads an entity"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-replacement` formally | Changing `resource-replacement` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-replacement`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Replace resource` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
