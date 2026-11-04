# Design Topic: Global design (`global-design`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [API Design](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/global-design](https://apistylebook.com/design/topics/global-design)

---

## 1. Original Topic Definition

> "General considerations on API design"

---

## 2. In-Depth Architectural Knowledge Learned

Establishes core architectural philosophy. Industry leaders converge on Resource-Oriented Design (Google AIP), Pragmatic REST (Deliveroo: RESTful, Hypermedia, Fine-grained), and Contract-First API development (Adidas). Public standards (Italian AgID, EIF) emphasize loose coupling, decoupled client-server contracts, and protocol neutrality.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `global-design` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `global-design` operations.

### Concrete HTTP Syntax / Representation:
```http
POST /api/v1/orders (Resource creation) vs /executeOrderRPC (Rejected RPC)
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 9 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Core principles](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/)
  * **Section**: [API First](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/api-first.html)
  * **Section**: [Contract](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/contract.html)
  * **Section**: [Design Maturity](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/design-maturity.html)
  * **Section**: [Robustness](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/robustness.html)
  * **Section**: [Loose Coupling](https://adidas-group.gitbooks.io/api-guidelines/content/clients/loose-coupling.html)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Granularity](https://apiguide.readthedocs.io/en/latest/principles/granularity.html)
  * **Section**: [Functionality](https://apiguide.readthedocs.io/en/latest/principles/coverage.html)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [General Principles](http://deliveroo.engineering/guidelines/api-design/#general-principles)
    > Verbatim Quote: "We choose to adopt three general principles. Here’s a shortcut to remember:
RESTful, Hypermedia, Fine-grained"
  * **Section**: [API and domain modelling](http://deliveroo.engineering/guidelines/api-design/#api-and-domain-modelling)
  * **Section**: [External-facing APIs](http://deliveroo.engineering/guidelines/api-design/#external-facing)
  * **Section**: [Mobile-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis)
  * **Section**: [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Resource Oriented Design](https://cloud.google.com/apis/design/resources)
    > Verbatim Quote: "This Design Guide explains how to apply REST principles to API designs independent of programming language, operating system, or network protocol. It is NOT a guide solely to creating REST APIs."
  * **Section**: [What is a REST API?](https://cloud.google.com/apis/design/resources#what_is_a_rest_api)
  * **Section**: [Design flow](https://cloud.google.com/apis/design/resources#design_flow)
    > Verbatim Quote: "The Design Guide suggests taking the following steps when designing resource- oriented APIs"
  * **Section**: [Design Patterns](https://cloud.google.com/apis/design/design_patterns)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Introduction](https://github.com/Haufe-Lexware/api-style-guide/blob/master/introduction/introduction.md)
  * **Section**: [General Guidelines](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md)
  * **Section**: [Message Schema and Postel's Law](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Separate Concerns](https://geemus.gitbooks.io/http-api-design/content/en/foundations/separate-concerns.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Introduction to service interfaces](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html)
    > Verbatim Quote: "A service therefore consists of an activity, or a series of activities, of a more or less intangible nature, which take place in an exchange between a supplier and a customer, in which the object of the transaction is an intangible asset."
  * **Section**: [Paradigms of cooperation](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#paradigmi-di-cooperazione)
    > Verbatim Quote: "Data sharing, Inter public administration notification, inter public administration composition"
  * **Section**: [SOAP](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#soap)
  * **Section**: [REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest)
  * **Section**: [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker)
  * **Section**: [Comparative considerations (REST vs SOAP vs Message broket)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_06.html#considerazioni-comparative)
  * **Section**: [Other approches (Distributed data stores, open data)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_07.html#altri-approcci-e-tecnologie-di-integrazione)
  * **Section**: [Paradigms for the design of service interfaces (RPC-like vs resource oriented)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#paradigmi-per-la-progettazione-delle-interfacce-di-servizio)
  * **Section**: [Perimeter of service interfaces](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#perimetro-delle-interfacce-di-servizio)
    > Verbatim Quote: "So each application server offers service interfaces, however it is still significant to distinguish whether the service interface is offered to interoperate within the domain..., towards other administrations or other subjects with whom a relationship of trust is established ... or externally...."
  * **Section**: [Technical recommendations for REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-rest)
  * **Section**: [Technical recommendations for SOAP](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-soap)
  * **Section**: [The european context](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_02.html#il-contesto-europeo)
    > Verbatim Quote: "The European Interoperability Framework (EIF) provides guidance to European public administrations on how to operate initiatives related to the issue of interoperability;"

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Introduction](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#3-introduction)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Design Principles](http://zalando.github.io/restful-api-guidelines/design-principles/DesignPrinciples.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Design resource-oriented APIs with contract-first OpenAPI schemas; maintain strict client decoupling. | Exposing internal database schemas or RPC-style function call endpoints in REST clothes. |
| **Contract Stability** | Version and document `global-design` formally in `@snp/shared` | Breaking `global-design` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `global-design`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Global design` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
