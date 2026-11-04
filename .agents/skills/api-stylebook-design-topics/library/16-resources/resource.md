# Design Topic: Resource (`resource`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource](https://apistylebook.com/design/topics/resource)

---

## 1. Original Topic Definition

> "General informations about resources"

---

## 2. In-Depth Architectural Knowledge Learned

Fundamental unit of REST architecture. Resources represent addressable entities or concepts within a bounded context, each possessing a canonical URI.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `resource` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `resource` operations.

### Concrete HTTP Syntax / Representation:
```http
/api/v1/students/:id
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 10 organization guidelines explicitly specify standards for this topic:

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3 Guidelines](https://github.com/CiscoDevNet/api-design-guide#3-guidelines)
    > Verbatim Quote: "Reference Representation, Narrow Representation, Wide Representation"
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Listing intrinsic properties](http://deliveroo.engineering/guidelines/api-design/#listing-intrinsic-properties)
  * **Section**: [Normalising concepts](http://deliveroo.engineering/guidelines/api-design/#normalising-concepts)
  * **Section**: [Single-resource representation](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Resources](https://cloud.google.com/apis/design/resources#resources)
    > Verbatim Quote: "A resource has some state and zero or more sub-resources. Each sub-resource can be either a simple resource or a collection resource."
  * **Section**: [Methods](https://cloud.google.com/apis/design/resources#methods)
    > Verbatim Quote: "The key characteristic of a resource-oriented API is that it emphasizes resources (data model) over the methods performed on the resources (functionality)"
  * **Section**: [Resources examples](https://cloud.google.com/apis/design/resources#examples)
  * **Section**: [Resource Labels](https://cloud.google.com/apis/design/design_patterns#resource_labels)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Building Your Resource Taxonomy](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy)
  * **Section**: [Defining Resource Lifecycles](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#defining-resource-lifecycles)
  * **Section**: [Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/resources/resources.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [The concept of service](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#il-concetto-di-servizio)
    > Verbatim Quote: "We can identify the types of properties, functional property, which expresses "what" we get from service; quality of the service, referring to characteristics (for example, delivery time) that specify benefits or perceived utility associated with the service; non-functional properties, expressing "how" the service is delivered to us."
  * **Section**: [CRUD Access to Resources](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#accesso-crud-a-risorse)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Read Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource)
  * **Section**: [Sub-Resource Singleton](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-singleton)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Resources](http://restful-api-design.readthedocs.io/en/latest/resources.html)
  * **Section**: [URLs](http://restful-api-design.readthedocs.io/en/latest/urls.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Model clear resource boundaries mapped to business aggregate roots. | Exposing raw database tables or non-entity internal memory states as public resources. |
| **Contract Stability** | Version and document `resource` formally in `@snp/shared` | Breaking `resource` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Resource` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
