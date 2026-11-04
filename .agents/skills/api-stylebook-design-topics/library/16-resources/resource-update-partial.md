# Design Topic: Update resource partially (`resource-update-partial`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-update-partial](https://apistylebook.com/design/topics/resource-update-partial)

---

## 1. Original Topic Definition

> "How to udate partially a resource"

---

## 2. Architectural Principles Learned

This design topic governs **Update resource partially** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-update-partial` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-update-partial` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-update-partial` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 9 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.5 PATCH](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [PATCH](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities)
  * **Section**: [Mutable resources](http://deliveroo.engineering/guidelines/api-design/#mutable-resources)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Update](https://cloud.google.com/apis/design/standard_methods#update)
    > Verbatim Quote: "The standard Update method should support partial resource update, and use HTTP verb PATCH"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Update Partial Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [PATCH](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch)
  * **Section**: [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [PATCH vs PUT](http://restful-api-design.readthedocs.io/en/latest/methods.html#patch-vs-put)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [PATCH](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch)
    > Verbatim Quote: "only a specific subset of resource fields are replaced"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-update-partial` formally | Changing `resource-update-partial` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-update-partial`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Update resource partially` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
