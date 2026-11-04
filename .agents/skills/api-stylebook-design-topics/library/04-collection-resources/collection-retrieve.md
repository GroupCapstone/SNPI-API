# Design Topic: Retrieve a collection (`collection-retrieve`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Collection Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/collection-retrieve](https://apistylebook.com/design/topics/collection-retrieve)

---

## 1. Original Topic Definition

> "How to get a collection or resources"

---

## 2. Architectural Principles Learned

This design topic governs **Retrieve a collection** within the domain of **Collection Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `collection-retrieve` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `collection-retrieve` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `collection-retrieve` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 7 organization guidelines explicitly specify standards for this topic:

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [GET](https://github.com/cloudfoundry/cc-api-v3-style-guide#get)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Standard Methods](https://cloud.google.com/apis/design/standard_methods)
  * **Section**: [List](https://cloud.google.com/apis/design/standard_methods#list)
    > Verbatim Quote: "The List method takes a collection name and zero or more parameters as input, and returns a list of resources that match the input"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Get List of resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [GET](http://zalando.github.io/restful-api-guidelines/http/Http.html#get)
    > Verbatim Quote: "reads a resource or set of resource instances"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `collection-retrieve` formally | Changing `collection-retrieve` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `collection-retrieve`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Retrieve a collection` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
