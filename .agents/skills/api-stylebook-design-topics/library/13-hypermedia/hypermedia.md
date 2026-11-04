# Design Topic: Hypermedia (`hypermedia`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Hypermedia](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/hypermedia](https://apistylebook.com/design/topics/hypermedia)

---

## 1. Original Topic Definition

> "How to use hypermedia"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Hypermedia within the domain of Hypermedia. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to use hypermedia.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `hypermedia` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `hypermedia` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Hypermedia specifications for Hypermedia.
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [HAL](https://adidas-group.gitbooks.io/api-guidelines/content/message/hal.html)
  * **Section**: [Foreign Key Relations](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Hypertext Linking within an Entity"

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)
    > Verbatim Quote: "3.3.3 A resource identifier labeled "url" MUST be present in all RESTful API resource representations"

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources)
  * **Section**: [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links)
  * **Section**: [Includind Related Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Hypermedia / HATEOAS](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas)
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)
    > Verbatim Quote: "should link to relations next and prev for pagination purposes"
  * **Section**: [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis)
    > Verbatim Quote: "While it is still recommended to include hypermedia links to encourage good practices, is it not mandated like for internal services."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Expanding Resources Through Hypermedia Linking](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking)
  * **Section**: [Support Hypermedia](https://github.com/Haufe-Lexware/api-style-guide/blob/master/rest-principles/rest-principles.md#support-hypermedia)
  * **Section**: [Hypermedia and REST](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md)
  * **Section**: [Relationships and Sub-Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md)
  * **Section**: [Hypermedia Links (Pagination)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links)
  * **Section**: [Hypermedia Response Format](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest)
    > Verbatim Quote: "According to this approach, by accessing a resource, the server's response contains hyperlinks to other actions that can be performed on the resource"
  * **Section**: [Use absolute URIs in the results](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-uri-assoluti-nei-risultati)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Paging Hypermedia Links](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links)
  * **Section**: [Create New Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource)
    > Verbatim Quote: "Hypermedia links provide an easy way to get the URL of the newly created resource"

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [REST Metadata](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata)
  * **Section**: [Link Headers](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers)
  * **Section**: [Relationships](http://restful-api-design.readthedocs.io/en/latest/relationships.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Use Pagination Links Where Applicable](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable)
  * **Section**: [Hypermedia](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html)
  * **Section**: [Use a well-defined subset of HAL](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal)
  * **Section**: [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Hypermedia; enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Hypermedia. |
| **Contract Stability** | Version and document `hypermedia` formally in `@snp/shared` | Breaking `hypermedia` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `hypermedia`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Hypermedia` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
