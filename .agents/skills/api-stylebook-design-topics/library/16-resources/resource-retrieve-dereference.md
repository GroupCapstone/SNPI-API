# Design Topic: Dereference Relationships (`resource-retrieve-dereference`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-retrieve-dereference](https://apistylebook.com/design/topics/resource-retrieve-dereference)

---

## 1. Original Topic Definition

> "How to load a resource and its linked resources in one call"

---

## 2. Architectural Principles Learned

This design topic governs **Dereference Relationships** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-retrieve-dereference` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-retrieve-dereference` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-retrieve-dereference` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 6 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Choosing Fields & Embedded Resources](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Standard Query Parameters in URIs (expand)"
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Title Expansion for Entities"

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get)
    > Verbatim Quote: "If a service supports the fields parameter, then a value of @reference, @narrow, or @wide SHOULD..."

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Includind Related Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Fine-grained](http://deliveroo.engineering/guidelines/api-design/#fine-grained)
    > Verbatim Quote: "Embedding entities should be avoided"
  * **Section**: [Conventions on responses](http://deliveroo.engineering/guidelines/api-design/#conventions-on-responses)
    > Verbatim Quote: "In addition, embedded entities (using _embedded) should be avoided when possible"
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)
    > Verbatim Quote: "Exceptionally, a collection representation, may embedded representations of the linked resources..."

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings)
    > Verbatim Quote: "embed — to expand embedded entities"
  * **Section**: [Define useful resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources)
  * **Section**: [Allow Optional Embedding of Sub-Resources](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#should-allow-optional-embedding-of-subresources)
  * **Section**: [Modify the Content-Type for Embedded Resources](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-retrieve-dereference` formally | Changing `resource-retrieve-dereference` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-retrieve-dereference`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Dereference Relationships` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
