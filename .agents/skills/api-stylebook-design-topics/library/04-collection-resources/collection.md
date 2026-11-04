# Design Topic: Collection (`collection`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Collection Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/collection](https://apistylebook.com/design/topics/collection)

---

## 1. Original Topic Definition

> "What is a collection (set) of resources"

---

## 2. In-Depth Architectural Knowledge Learned

Defines resource collections as homogeneous sets of subordinate entities. Standardized across Cisco, Deliveroo, Google, and Zalando: collections are identified by plural lowercase nouns representing entities, returning an array representation wrapped in metadata.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `collection` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `collection` operations.

### Concrete HTTP Syntax / Representation:
```http
GET /api/v1/students -> { "items": [ ... ], "totalCount": 450 }
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "URI Structure"
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Collections of Entities"

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Collections](https://github.com/cloudfoundry/cc-api-v3-style-guide#collections)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Resources](https://cloud.google.com/apis/design/resources#resources)
    > Verbatim Quote: "A collection contains a list of resources of the same type. For example, a user has a collection of contacts."
  * **Section**: [Methods](https://cloud.google.com/apis/design/resources#methods)
    > Verbatim Quote: "The key characteristic of a resource-oriented API is that it emphasizes resources (data model) over the methods performed on the resources (functionality)"
  * **Section**: [Resources examples](https://cloud.google.com/apis/design/resources#examples)
  * **Section**: [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Resource collections can use plural names](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale)
  * **Section**: [Code structured data with JSON objects](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#codificare-dati-strutturati-con-oggetti-json)
    > Verbatim Quote: "the payload of a response containing more than one entry returns an object containing a list and not directly a list."

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#9-collections)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources)
  * **Section**: [Sub-Resource Collection](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-collection)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [URLs](http://restful-api-design.readthedocs.io/en/latest/urls.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Name collection endpoints with plural nouns (/students, /fee-invoices); return consistent collection envelopes. | Singular nouns for collections (/student) or combining multiple disparate entity types in one list. |
| **Contract Stability** | Version and document `collection` formally in `@snp/shared` | Breaking `collection` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `collection`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Collection` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
