# API Stylebook: Authoritative REST API Design Topics Catalog

> **Status**: Authoritative REST API Design Reference  
> **Source**: API Stylebook (apistylebook.com / Arnaud Lauret)  
> **Architecture**: 17 Design Categories | 100 Standardized Design Topics | Cross-Guideline Analyzed References  

This document provides the complete, unabridged catalog of all API design topics cataloged by the API Stylebook. Each topic details its architectural intent, industry consensus, and every explicit reference across the 16 analyzed corporate and public sector API guidelines.

---

## Category Summary Overview

| # | Category Name | Topics Count | Architectural Scope |
| :--- | :--- | :--- | :--- |
| 1 | **API Design** | 2 | Overall resource topology, granularity, endpoint counts, and API design philosophy. |
| 2 | **API Lifecycle** | 2 | Evolution, deprecation schedules, retirement headers, and lifecycle governance. |
| 3 | **Asynchronicity** | 2 | Long-running operations, 202 Accepted processing, polling, and progress callbacks. |
| 4 | **Collection Resources** | 5 | Filtering, sorting, pagination, and multi-resource retrieval patterns. |
| 5 | **Data** | 5 | Payload formats, date/time ISO 8601, null value handling, standards, and internationalization. |
| 6 | **Error handling** | 2 | Standardized error payloads, RFC 7807 problem details, error codes, and debugging metadata. |
| 7 | **HTTP Methods** | 9 | Semantics, idempotency, and safety for GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS. |
| 8 | **HTTP Protocol** | 5 | Content negotiation, HTTP headers, caching headers (ETag, Cache-Control), and protocol rules. |
| 9 | **HTTP Status Redirection** | 7 | 3xx status code usage: 301, 302, 303, 304 Not Modified, 307, and 308 permanent redirect. |
| 10 | **HTTP Status Server Error** | 3 | 5xx status code semantics: 500 Internal Error, 501 Not Implemented, 503 Unavailable. |
| 11 | **HTTP Status Success** | 6 | 2xx status code semantics: 200 OK, 201 Created, 202 Accepted, 204 No Content, 206 Partial. |
| 12 | **HTTP Status User Error** | 16 | 4xx status code semantics: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404, 409, 422, 429. |
| 13 | **Hypermedia** | 3 | HATEOAS patterns, HAL, JSON:API, link relations, state machine transitions, hypermedia write. |
| 14 | **Miscellaneous** | 10 | CORS, rate limiting, debug headers, developer experience (DX), documentation, and API chaining. |
| 15 | **Naming** | 3 | Casing conventions (camelCase, snake_case, kebab-case), URI grammar, language, and pluralization. |
| 16 | **Resources** | 18 | Resource hierarchies, IDs, sub-resources, creation, deletion, partial updates, and relationships. |
| 17 | **Security** | 2 | Authentication, authorization, TLS, token scopes, API keys, and sensitive data protection. |

---

## 1. Category: API Design
**Total Topics in Category**: 2
**Domain Focus**: Overall resource topology, granularity, endpoint counts, and API design philosophy.

### Topic: `api-counts` - API counts
* **Category**: API Design
* **Definition**: How many endpoints/resources in an API?
* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Minimal API surface | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/minimal-api-surface.html) |
| **Deliveroo** | API Design | Fine-grained | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#fine-grained) |
| **Zalando** | RESTFul API Guidelines | Limit of Resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-resources) |

---

### Topic: `global-design` - Global design
* **Category**: API Design
* **Definition**: General considerations on API design
* **Guidelines Addressing This Topic**: 9 companies (35 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Core principles | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/) |
| **adidas** | adidas API design guidelines | API First | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/api-first.html) |
| **adidas** | adidas API design guidelines | Contract | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/contract.html) |
| **adidas** | adidas API design guidelines | Design Maturity | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/design-maturity.html) |
| **adidas** | adidas API design guidelines | Robustness | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/robustness.html) |
| **adidas** | adidas API design guidelines | Loose Coupling | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/clients/loose-coupling.html) |
| **Australian Digital Transformation Office** | API Design Guide | Granularity | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/granularity.html) |
| **Australian Digital Transformation Office** | API Design Guide | Functionality | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/coverage.html) |
| **Deliveroo** | API Design | General Principles | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#general-principles) |
| **Deliveroo** | API Design | API and domain modelling | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#api-and-domain-modelling) |
| **Deliveroo** | API Design | External-facing APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#external-facing) |
| **Deliveroo** | API Design | Mobile-friendly APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis) |
| **Deliveroo** | API Design | Public-friendly APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| **Google** | Google API Design Guide | Resource Oriented Design | [Open Guideline](https://cloud.google.com/apis/design/resources) |
| **Google** | Google API Design Guide | What is a REST API? | [Open Guideline](https://cloud.google.com/apis/design/resources#what_is_a_rest_api) |
| **Google** | Google API Design Guide | Design flow | [Open Guideline](https://cloud.google.com/apis/design/resources#design_flow) |
| **Google** | Google API Design Guide | Design Patterns | [Open Guideline](https://cloud.google.com/apis/design/design_patterns) |
| **Haufe** | Haufe API style guide | Introduction | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/introduction/introduction.md) |
| **Haufe** | Haufe API style guide | General Guidelines | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md) |
| **Haufe** | Haufe API style guide | Message Schema and Postel's Law | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) |
| **Heroku** | HTTP API Design Guide | Separate Concerns | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/separate-concerns.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Introduction to service interfaces | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Paradigms of cooperation | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#paradigmi-di-cooperazione) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | SOAP | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#soap) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Comparative considerations (REST vs SOAP vs Message broket) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_06.html#considerazioni-comparative) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Other approches (Distributed data stores, open data) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_07.html#altri-approcci-e-tecnologie-di-integrazione) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Paradigms for the design of service interfaces (RPC-like vs resource oriented) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#paradigmi-per-la-progettazione-delle-interfacce-di-servizio) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Perimeter of service interfaces | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#perimetro-delle-interfacce-di-servizio) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Technical recommendations for REST | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-rest) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Technical recommendations for SOAP | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-soap) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | The european context | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_02.html#il-contesto-europeo) |
| **Microsoft** | Microsoft REST API Guidelines | Introduction | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#3-introduction) |
| **Zalando** | RESTFul API Guidelines | Design Principles | [Open Guideline](http://zalando.github.io/restful-api-guidelines/design-principles/DesignPrinciples.html) |

---

## 2. Category: API Lifecycle
**Total Topics in Category**: 2
**Domain Focus**: Evolution, deprecation schedules, retirement headers, and lifecycle governance.

### Topic: `governance` - Governance
* **Category**: API Lifecycle
* **Definition**: How to ensure API governance (advertise, consistency, ...)
* **Guidelines Addressing This Topic**: 8 companies (21 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Version Control System | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/version-control-system.html) |
| **adidas** | adidas API design guidelines | OpenAPI Specification | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html) |
| **adidas** | adidas API design guidelines | API Design Platform - Apiary | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html) |
| **adidas** | adidas API design guidelines | Testing | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/testing.html) |
| **adidas** | adidas API design guidelines | Rules For Extending | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Using these Guidelines | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-UsingtheseGuidelines) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Version Control for APIs | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs) |
| **Atlassian** | Atlassian REST API Policy | Compatibility policy | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) |
| **Atlassian** | Atlassian REST API Policy | Deprecation policy | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy) |
| **Australian Digital Transformation Office** | API Design Guide | Register your API | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/advertise.html) |
| **Haufe** | Haufe API style guide | API Modelling and Design Process | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#api-modelling-and-design-process) |
| **Haufe** | Haufe API style guide | API Design Review Process | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-review-process/api-design-review-process.md) |
| **Haufe** | Haufe API style guide | Message Schema and Postel's Law | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Catalog of API/Services | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#catalogo-delle-api-servizi) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Model governance | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#governance-del-modello) |
| **Microsoft** | Microsoft REST API Guidelines | Interpreting The Guidelines | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#4-interpreting-the-guidelines) |
| **Microsoft** | Microsoft REST API Guidelines | When to version | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#122-when-to-version) |
| **Microsoft** | Microsoft REST API Guidelines | Definition of a breaking change | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#123-definition-of-a-breaking-change) |
| **Zalando** | RESTFul API Guidelines | API First | [Open Guideline](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-api-first-define-apis-using-openapi) |
| **Zalando** | RESTFul API Guidelines | Deprecation | [Open Guideline](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html) |
| **Zalando** | RESTFul API Guidelines | API Discovery | [Open Guideline](http://zalando.github.io/restful-api-guidelines/api-discovery/ApiDiscovery.html) |

---

### Topic: `versioning` - Updates and Versioning
* **Category**: API Lifecycle
* **Definition**: How to handle API updates and versioning
* **Guidelines Addressing This Topic**: 13 companies (30 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Changes and Versioning | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html) |
| **adidas** | adidas API design guidelines | Rules For Extending | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Version Control for APIs | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs) |
| **Atlassian** | Atlassian REST API Policy | Compatibility policy | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) |
| **Atlassian** | Atlassian REST API Policy | Backwards compatibility | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Backwardscompatibility) |
| **Atlassian** | Atlassian REST API Policy | Structured representations (application/json) | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json)) |
| **Atlassian** | Atlassian REST API Policy | API versioning | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-APIversioning) |
| **Australian Digital Transformation Office** | API Design Guide | Versioning | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#versioning) |
| **Australian Digital Transformation Office** | API Design Guide | Use versions | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/versioning.html) |
| **Cisco** | API Design Guide | 3.13 Versioning | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#313-versioning) |
| **Deliveroo** | API Design | Content type negotiation | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation) |
| **Deliveroo** | API Design | Versioning | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| **Deliveroo** | API Design | Public-friendly APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| **Google** | Google API Design Guide | List Pagination | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#list_pagination) |
| **Google** | Google API Design Guide | Versioning | [Open Guideline](https://cloud.google.com/apis/design/versioning) |
| **Google** | Google API Design Guide | Compatibility | [Open Guideline](https://cloud.google.com/apis/design/compatibility) |
| **Google** | Google API Design Guide | Backwards-compatible (non-breaking) changes | [Open Guideline](https://cloud.google.com/apis/design/compatibility#backwards-compatible_non-breaking_changes) |
| **Google** | Google API Design Guide | Backwards-incompatible (breaking) changes | [Open Guideline](https://cloud.google.com/apis/design/compatibility#backwards-incompatible_breaking_changes) |
| **Haufe** | Haufe API style guide | Version | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md#version) |
| **Heroku** | HTTP API Design Guide | Require Versioning in the Accepts Header | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html) |
| **Heroku** | HTTP API Design Guide | Describe stability | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/describe-stability.html) |
| **Microsoft** | Microsoft REST API Guidelines | Guidelines for existing services and versioning of services | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#42-guidelines-for-existing-services-and-versioning-of-services) |
| **Microsoft** | Microsoft REST API Guidelines | Versioning | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#12-versioning) |
| **PayPal** | API Style Guide | Version | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#version) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **White House** | White House Web API Standards | Versions | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#versions) |
| **Zalando** | RESTFul API Guidelines | Compatibility | [Open Guideline](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html) |
| **Zalando** | RESTFul API Guidelines | Don’t Break Backward Compatibility | [Open Guideline](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-dont-break-backward-compatibility) |
| **Zalando** | RESTFul API Guidelines | Avoid Versioning | [Open Guideline](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#should-avoid-versioning) |
| **Zalando** | RESTFul API Guidelines | Use Media Type Versioning | [Open Guideline](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning) |

---

## 3. Category: Asynchronicity
**Total Topics in Category**: 2
**Domain Focus**: Long-running operations, 202 Accepted processing, polling, and progress callbacks.

### Topic: `asynchronicity` - Asynchronicity
* **Category**: Asynchronicity
* **Definition**: How to handle long operations
* **Guidelines Addressing This Topic**: 7 companies (19 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Asynchronous Tasks | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Asynchronicity | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#asynchronicity) |
| **Google** | Google API Design Guide | Delete | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#delete) |
| **Google** | Google API Design Guide | Common Custom Methods | [Open Guideline](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| **Google** | Google API Design Guide | Long Running Operation | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#long_running_operations) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Non blocking profile | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccanti) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Non-blocking RPC PUSH profiles (callback based) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccante-rpc-push-basato-su-callback) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Non-blocking profile RPC PULL (busy waiting) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profilo-non-bloccante-rpc-pull-busy-waiting) |
| **Microsoft** | Microsoft REST API Guidelines | Long running API faults | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults) |
| **Microsoft** | Microsoft REST API Guidelines | Long running operations | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#13-long-running-operations) |
| **Microsoft** | Microsoft REST API Guidelines | Operations resource | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource) |
| **Microsoft** | Microsoft REST API Guidelines | Operation resource | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource) |
| **Microsoft** | Microsoft REST API Guidelines | Operation tombstones | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones) |
| **Microsoft** | Microsoft REST API Guidelines | The typical flow, polling | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling) |
| **Microsoft** | Microsoft REST API Guidelines | The typical flow, push notifications | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) |
| **Microsoft** | Microsoft REST API Guidelines | Retry-After | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after) |
| **Red Hat** | Thoughts on RESTful API Design | Asynchronous Requests | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#asynchronous-requests) |
| **Zalando** | RESTFul API Guidelines | Events | [Open Guideline](http://zalando.github.io/restful-api-guidelines/events/events.html) |

---

### Topic: `notifications-server-events` - Notifying API consumers
* **Category**: Asynchronicity
* **Definition**: How to send events or notifications to API consumers
* **Guidelines Addressing This Topic**: 3 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Microsoft** | Microsoft REST API Guidelines | The typical flow, push notifications | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) |
| **Microsoft** | Microsoft REST API Guidelines | Push notifications via webhooks | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#14-push-notifications-via-webhooks) |
| **Red Hat** | Thoughts on RESTful API Design | Notifications | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#notifications) |
| **Zalando** | RESTFul API Guidelines | Events | [Open Guideline](http://zalando.github.io/restful-api-guidelines/events/events.html) |

---

## 4. Category: Collection Resources
**Total Topics in Category**: 5
**Domain Focus**: Filtering, sorting, pagination, and multi-resource retrieval patterns.

### Topic: `collection` - Collection
* **Category**: Collection Resources
* **Definition**: What is a collection (set) of resources
* **Guidelines Addressing This Topic**: 11 companies (17 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Cisco** | API Design Guide | 3.6.3 GET | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Collections | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#collections) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Google** | Google API Design Guide | Resources | [Open Guideline](https://cloud.google.com/apis/design/resources#resources) |
| **Google** | Google API Design Guide | Methods | [Open Guideline](https://cloud.google.com/apis/design/resources#methods) |
| **Google** | Google API Design Guide | Resources examples | [Open Guideline](https://cloud.google.com/apis/design/resources#examples) |
| **Google** | Google API Design Guide | Collection ID | [Open Guideline](https://cloud.google.com/apis/design/resource_names#collection_id) |
| **Haufe** | Haufe API style guide | Collection Resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Resource collections can use plural names | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Code structured data with JSON objects | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#codificare-dati-strutturati-con-oggetti-json) |
| **Microsoft** | Microsoft REST API Guidelines | Collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#9-collections) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **PayPal** | API Style Guide | Sub-Resource Collection | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-collection) |
| **Red Hat** | Thoughts on RESTful API Design | URLs | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/urls.html) |
| **Zalando** | RESTFul API Guidelines | Resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html) |

---

### Topic: `collection-filtering` - Filtering
* **Category**: Collection Resources
* **Definition**: How to select some resources in a collection
* **Guidelines Addressing This Topic**: 9 companies (15 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Search Requests | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/search-requests.html) |
| **Cisco** | API Design Guide | 3.6.3 GET | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Filtering | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#filtering) |
| **Google** | Google API Design Guide | List filter field | [Open Guideline](https://cloud.google.com/apis/design/naming_convention#list_filter_field) |
| **Google** | Google API Design Guide | Common Custom Methods | [Open Guideline](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| **Google** | Google API Design Guide | List Sub-Collections | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#list_sub-collections) |
| **Google** | Google API Design Guide | Get Unique Resource From Sub-Collection | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection) |
| **Haufe** | Haufe API style guide | Filtering | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#filtering) |
| **Haufe** | Haufe API style guide | Time selection | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#time-selection) |
| **Haufe** | Haufe API style guide | Search | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md) |
| **Microsoft** | Microsoft REST API Guidelines | Filtering | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#97-filtering) |
| **PayPal** | API Style Guide | Time Selection | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#time-selection) |
| **PayPal** | API Style Guide | Complex Operation - Search | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---search) |
| **White House** | White House Web API Standards | Record Limits | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#record-limits) |
| **Zalando** | RESTFul API Guidelines | Use Conventional Query Strings | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |

---

### Topic: `collection-pagination` - Pagination
* **Category**: Collection Resources
* **Definition**: How to retrieve a range of resources in a collection
* **Guidelines Addressing This Topic**: 14 companies (19 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Pagination | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/pagination.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Policy | Resource/rate limits and paging | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging) |
| **Australian Digital Transformation Office** | API Design Guide | Batching results | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/batching_results.html) |
| **Cisco** | API Design Guide | 3.6.3 GET | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Pagination | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Pagination of Related Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination-of-related-resources) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Deliveroo** | API Design | Query parameters | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#query-parameters) |
| **Google** | Google API Design Guide | List Pagination | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#list_pagination) |
| **Haufe** | Haufe API style guide | Paging | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#paging) |
| **Heroku** | HTTP API Design Guide | Divide Large Responses Across Requests with Ranges | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/) |
| **Microsoft** | Microsoft REST API Guidelines | Big collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections) |
| **Microsoft** | Microsoft REST API Guidelines | Pagination | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#98-pagination) |
| **PayPal** | API Style Guide | Paging | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging) |
| **PayPal** | API Style Guide | Paging (Complex Operation - Search) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging-1) |
| **Red Hat** | Thoughts on RESTful API Design | Ranges Pagination | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#ranges-pagination) |
| **Zalando** | RESTFul API Guidelines | Use Conventional Query Strings | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| **Zalando** | RESTFul API Guidelines | Pagination | [Open Guideline](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html) |

---

### Topic: `collection-retrieve` - Retrieve a collection
* **Category**: Collection Resources
* **Definition**: How to get a collection or resources
* **Guidelines Addressing This Topic**: 7 companies (8 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | GET | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | List | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#list) |
| **Haufe** | Haufe API style guide | Get List of resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **Zalando** | RESTFul API Guidelines | GET | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) |

---

### Topic: `collection-sorting` - Sorting a collection
* **Category**: Collection Resources
* **Definition**: How to sort a collection of resources
* **Guidelines Addressing This Topic**: 5 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Google** | Google API Design Guide | Sorting Order | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#sorting_order) |
| **Haufe** | Haufe API style guide | Sorting | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#sorting) |
| **Microsoft** | Microsoft REST API Guidelines | Variable order rule | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#62-variable-order-rule) |
| **Microsoft** | Microsoft REST API Guidelines | Sorting collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#96-sorting-collections) |
| **PayPal** | API Style Guide | Sorting | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sorting) |
| **Zalando** | RESTFul API Guidelines | Use Conventional Query Strings | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |

---

## 5. Category: Data
**Total Topics in Category**: 5
**Domain Focus**: Payload formats, date/time ISO 8601, null value handling, standards, and internationalization.

### Topic: `data-format` - Data format
* **Category**: Data
* **Definition**: which data format use
* **Guidelines Addressing This Topic**: 11 companies (26 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Corporate Data Model | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/application/harmonize-data.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix B: Basic Data Types | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixB:BasicDataTypes) |
| **Atlassian** | Atlassian REST API Policy | Compatibility policy | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) |
| **Atlassian** | Atlassian REST API Policy | Structured representations (application/json) | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json)) |
| **Atlassian** | Atlassian REST API Policy | Forward compatibility | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Forwardcompatibility) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Google** | Google API Design Guide | Grammar Syntax | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| **Google** | Google API Design Guide | Integer Types | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#integer_types) |
| **Haufe** | Haufe API style guide | Hypermedia Response Format | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md) |
| **Haufe** | Haufe API style guide | Type Formatting | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md) |
| **Haufe** | Haufe API style guide | Message Schema and Postel's Law | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) |
| **Heroku** | HTTP API Design Guide | Accept serialized JSON in request bodies | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/accept-serialized-json-in-request-bodies.html) |
| **Heroku** | HTTP API Design Guide | Provide standard timestamps | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html) |
| **Heroku** | HTTP API Design Guide | Nest foreign key relations | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html) |
| **Heroku** | HTTP API Design Guide | Keep JSON minified in all responses | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Data uniformity | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#uniformita-dei-dati) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Data format (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#formato-dei-dati) |
| **Microsoft** | Microsoft REST API Guidelines | Response Formats | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#710-response-formats) |
| **Microsoft** | Microsoft REST API Guidelines | JSON standardizations | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#11-json-standardizations) |
| **Red Hat** | Thoughts on RESTful API Design | Resource Data | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html#resource-data) |
| **Zalando** | RESTFul API Guidelines | Property Values | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values) |
| **Zalando** | RESTFul API Guidelines | Date property values should conform to RFC 3399 | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399) |
| **Zalando** | RESTFul API Guidelines | Time durations and intervals could conform to ISO 8601 | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601) |
| **Zalando** | RESTFul API Guidelines | Data Formats | [Open Guideline](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html) |
| **Zalando** | RESTFul API Guidelines | Common Data Objects | [Open Guideline](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html) |

---

### Topic: `data-format-date-time` - Date and Time
* **Category**: Data
* **Definition**: How to deal with date and time data
* **Guidelines Addressing This Topic**: 7 companies (16 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Common Data Types | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Google** | Google API Design Guide | Time and Duration | [Open Guideline](https://cloud.google.com/apis/design/naming_convention#time_and_duration) |
| **Google** | Google API Design Guide | Date and Time of the Day | [Open Guideline](https://cloud.google.com/apis/design/naming_convention#date_and_time_of_day) |
| **Haufe** | Haufe API style guide | Dates and Times | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#dates-and-times) |
| **Heroku** | HTTP API Design Guide | Provide standard timestamps | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html) |
| **Heroku** | HTTP API Design Guide | Use UTC times formatted in ISO8601 | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/use-utc-times-formatted-in-iso8601.html) |
| **Microsoft** | Microsoft REST API Guidelines | Guidelines for dates and times | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#112-guidelines-for-dates-and-times) |
| **Microsoft** | Microsoft REST API Guidelines | JSON serialization of dates and times | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#113-json-serialization-of-dates-and-times) |
| **Microsoft** | Microsoft REST API Guidelines | Durations | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#114-durations) |
| **Microsoft** | Microsoft REST API Guidelines | Intervals | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#115-intervals) |
| **Microsoft** | Microsoft REST API Guidelines | Repeating intervals | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#116-repeating-intervals) |
| **Zalando** | RESTFul API Guidelines | Date property values should conform to RFC 3399 | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399) |
| **Zalando** | RESTFul API Guidelines | Time durations and intervals could conform to ISO 8601 | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601) |
| **Zalando** | RESTFul API Guidelines | Use Standard Date and Time Formats | [Open Guideline](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#must-use-standard-date-and-time-formats) |
| **Zalando** | RESTFul API Guidelines | HTTP headers | [Open Guideline](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers) |

---

### Topic: `data-format-null` - Null data
* **Category**: Data
* **Definition**: How to deal with null data
* **Guidelines Addressing This Topic**: 2 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | JSON Attributes | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#json-attributes) |
| **Zalando** | RESTFul API Guidelines | Property values | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values) |
| **Zalando** | RESTFul API Guidelines | Null values should have their fields removed | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-null-values-should-have-their-fields-removed) |
| **Zalando** | RESTFul API Guidelines | Boolean property values must not be null | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-boolean-property-values-must-not-be-null) |
| **Zalando** | RESTFul API Guidelines | Empty array values should not be null | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-empty-array-values-should-not-be-null) |

---

### Topic: `data-internationalization` - Internationalization
* **Category**: Data
* **Definition**: Providing internationalized data representation (e.g. adapted to the user's country)
* **Guidelines Addressing This Topic**: 2 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Common Data Types | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) |
| **adidas** | adidas API design guidelines | Localization | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/localization.html) |
| **Deliveroo** | API Design | Internationalisation (i18n) | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n) |

---

### Topic: `data-standards` - Standards data
* **Category**: Data
* **Definition**: Which standard use for values like languages, countries, currencies, ...
* **Guidelines Addressing This Topic**: 4 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Common Data Types | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) |
| **Haufe** | Haufe API style guide | Currency | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#currency) |
| **Haufe** | Haufe API style guide | Country | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#country) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Use the properties according to standard nomenclatures | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#utilizzare-le-properties-secondo-nomenclature-standard) |
| **Zalando** | RESTFul API Guidelines | Standards could be used for Language, Country and Currency | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-standards-could-be-used-for-language-country-and-currency) |
| **Zalando** | RESTFul API Guidelines | Use Standards for Country, Language and Currency Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-standards-for-country-language-and-currency-codes) |

---

## 6. Category: Error handling
**Total Topics in Category**: 2
**Domain Focus**: Standardized error payloads, RFC 7807 problem details, error codes, and debugging metadata.

### Topic: `errors` - Errors
* **Category**: Error handling
* **Definition**: How to handle errors
* **Guidelines Addressing This Topic**: 5 companies (10 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Problem Detail | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/error-reporting.html) |
| **adidas** | adidas API design guidelines | Error Response Format | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Haufe** | Haufe API style guide | Error handling | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Use the Problem JSON scheme for error responses | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore) |
| **Microsoft** | Microsoft REST API Guidelines | Errors | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors) |
| **Microsoft** | Microsoft REST API Guidelines | Faults | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults) |
| **Microsoft** | Microsoft REST API Guidelines | Long running API faults | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults) |
| **Microsoft** | Microsoft REST API Guidelines | Silent Fail Rule | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#63-silent-fail-rule) |
| **Microsoft** | Microsoft REST API Guidelines | Unsupported requests | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#15-unsupported-requests) |

---

### Topic: `http-status-standard-error` - Error format
* **Category**: Error handling
* **Definition**: How to provide information about errors
* **Guidelines Addressing This Topic**: 10 companies (11 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Error Response Format | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html) |
| **Australian Digital Transformation Office** | API Design Guide | HTTP response principles | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#http-response-principles) |
| **Cisco** | API Design Guide | 3.9 Status Codes | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#errors) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Haufe** | Haufe API style guide | Error handling | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md) |
| **Heroku** | HTTP API Design Guide | Generate structured errors | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/generate-structured-errors.html) |
| **Microsoft** | Microsoft REST API Guidelines | Error condition responses | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses) |
| **White House** | White House Web API Standards | Error handling | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| **Zalando** | RESTFul API Guidelines | Providing Error Documentation | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-providing-error-documentation) |
| **Zalando** | RESTFul API Guidelines | Use Problem JSON | [Open Guideline](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html#must-use-problem-json) |

---

## 7. Category: HTTP Methods
**Total Topics in Category**: 9
**Domain Focus**: Semantics, idempotency, and safety for GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.

### Topic: `http-methods` - HTTP methods
* **Category**: HTTP Methods
* **Definition**: General information about HTTP methods usage
* **Guidelines Addressing This Topic**: 13 companies (19 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Request Methods | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-methods.html) |
| **Australian Digital Transformation Office** | API Design Guide | Use HTTP methods and status codes | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) |
| **Cisco** | API Design Guide | 3.6 HTTP Verbs | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Cisco** | API Design Guide | REST Methods | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#rest-methods) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Requests | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#requests) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Google** | Google API Design Guide | Resource Oriented Design | [Open Guideline](https://cloud.google.com/apis/design/resources) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | HTTP Verbs | [Open Guideline](https://cloud.google.com/apis/design/http_verbs) |
| **Haufe** | Haufe API style guide | HTTP Verbs | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | HTTP verbs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | Use HTTP Methods Correctly | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-http-methods-correctly) |
| **Zalando** | RESTFul API Guidelines | HTTP Methods must Fulfill Safeness and Idempotency Properties | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#must--http-methods-must-fulfill-safeness-and-idempotency-properties) |

---

### Topic: `http-methods-alternative` - Forbidden methods alternatives
* **Category**: HTTP Methods
* **Definition**: What to do when only possible HTTP methods are POST and GET
* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Query Requests with Large Inputs | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html) |
| **Cisco** | API Design Guide | 3.7 Alternative Forms | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#37-alternative-forms) |

---

### Topic: `http-methods-delete` - DELETE
* **Category**: HTTP Methods
* **Definition**: The DELETE method deletes the specified resource.
* **Guidelines Addressing This Topic**: 13 companies (19 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Concurrency | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| **Australian Digital Transformation Office** | API Design Guide | DELETE /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | DELETE /magazines/1234 | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines-1234) |
| **Cisco** | API Design Guide | 3.6.4 DELETE | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | DELETE | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#delete) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Delete | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#delete) |
| **Haufe** | Haufe API style guide | HTTP Verbs | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **PayPal** | API Style Guide | Delete Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | DELETE | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#delete) |

---

### Topic: `http-methods-get` - GET
* **Category**: HTTP Methods
* **Definition**: The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect.

* **Guidelines Addressing This Topic**: 12 companies (21 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Australian Digital Transformation Office** | API Design Guide | GET /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) |
| **Cisco** | API Design Guide | 3.6.3 GET | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | GET | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Deliveroo** | API Design | Single-entity GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | List | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#list) |
| **Google** | Google API Design Guide | Get | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#get) |
| **Haufe** | Haufe API style guide | HTTP Verbs | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| **Haufe** | Haufe API style guide | Get List of resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources) |
| **Haufe** | Haufe API style guide | Read Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **PayPal** | API Style Guide | HTTP Status (Read Single Resource) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | GET | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) |

---

### Topic: `http-methods-head` - HEAD
* **Category**: HTTP Methods
* **Definition**: The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.

* **Guidelines Addressing This Topic**: 7 companies (8 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Australian Digital Transformation Office** | API Design Guide | HEAD /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | HEAD /magazines/1234 | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines-1234) |
| **Cisco** | API Design Guide | 3.6.6 HEAD | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **Zalando** | RESTFul API Guidelines | HEAD | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#head) |

---

### Topic: `http-methods-options` - OPTIONS
* **Category**: HTTP Methods
* **Definition**: The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.

* **Guidelines Addressing This Topic**: 4 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.7 OPTIONS | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **Microsoft** | Microsoft REST API Guidelines | Options and link headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **Zalando** | RESTFul API Guidelines | OPTIONS | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#options) |

---

### Topic: `http-methods-patch` - PATCH
* **Category**: HTTP Methods
* **Definition**: The PATCH method applies partial modifications to a resource.

* **Guidelines Addressing This Topic**: 10 companies (18 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.5 PATCH | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PATCH | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Deliveroo** | API Design | PATCH, mutating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Update | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#update) |
| **Haufe** | Haufe API style guide | HTTP Verbs | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| **Haufe** | Haufe API style guide | Update Partial Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **Microsoft** | Microsoft REST API Guidelines | PATCH | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) |
| **Microsoft** | Microsoft REST API Guidelines | Creating resources via PATCH (UPSERT semantics) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **PayPal** | API Style Guide | Update Partial Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **Zalando** | RESTFul API Guidelines | PATCH | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) |

---

### Topic: `http-methods-post` - POST
* **Category**: HTTP Methods
* **Definition**: The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.

* **Guidelines Addressing This Topic**: 13 companies (25 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Query Requests with Large Inputs | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html) |
| **Australian Digital Transformation Office** | API Design Guide | POST /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#post--magazines) |
| **Cisco** | API Design Guide | 3.6.1 POST | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | POST | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#post) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Create | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#create) |
| **Haufe** | Haufe API style guide | HTTP Verbs | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| **Haufe** | Haufe API style guide | Create New Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource) |
| **Haufe** | Haufe API style guide | Using POST (Search) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md#using-post) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **Microsoft** | Microsoft REST API Guidelines | POST | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) |
| **Microsoft** | Microsoft REST API Guidelines | Changing collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) |
| **Microsoft** | Microsoft REST API Guidelines | POST (Long running operations) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1322-post) |
| **Microsoft** | Microsoft REST API Guidelines | POST, hybrid model (Long running operations) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1323-post-hybrid-model) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **PayPal** | API Style Guide | Create New Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | POST | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#post) |

---

### Topic: `http-methods-put` - PUT
* **Category**: HTTP Methods
* **Definition**: The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.

* **Guidelines Addressing This Topic**: 12 companies (21 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Concurrency | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| **Australian Digital Transformation Office** | API Design Guide | PUT /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | PUT /magazines/1234 | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines-1234) |
| **Cisco** | API Design Guide | 3.6.2 PUT | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PUT | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#put) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Update | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#update) |
| **Haufe** | Haufe API style guide | HTTP Verbs | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| **Haufe** | Haufe API style guide | Update Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) |
| **Haufe** | Haufe API style guide | Create New Resource - Consumer Supplied Identifier | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Message broker | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | Supported Methods | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| **Microsoft** | Microsoft REST API Guidelines | Changing collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) |
| **Microsoft** | Microsoft REST API Guidelines | PUT (Long running operations) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1321-put) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **PayPal** | API Style Guide | Update Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | PUT | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) |

---

## 8. Category: HTTP Protocol
**Total Topics in Category**: 5
**Domain Focus**: Content negotiation, HTTP headers, caching headers (ETag, Cache-Control), and protocol rules.

### Topic: `http` - HTTP protocol
* **Category**: HTTP Protocol
* **Definition**: General informations about HTTP protocol
* **Guidelines Addressing This Topic**: 4 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | HTTP | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/http.html) |
| **Deliveroo** | API Design | Compression | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#compression) |
| **Microsoft** | Microsoft REST API Guidelines | HTTP protocol | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) |
| **Zalando** | RESTFul API Guidelines | HTTP | [Open Guideline](http://zalando.github.io/restful-api-guidelines/) |

---

### Topic: `http-caching` - Caching
* **Category**: HTTP Protocol
* **Definition**: How to use and provide relevant caching informations
* **Guidelines Addressing This Topic**: 11 companies (17 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Caching | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/caching.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Caching | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching) |
| **Cisco** | API Design Guide | 3.5.1 Standard Headers | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) |
| **Deliveroo** | API Design | Resource lifecycle | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Deliveroo** | API Design | Mutable resources | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) |
| **Google** | Google API Design Guide | ETags | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#etags) |
| **Haufe** | Haufe API style guide | Caching | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md) |
| **Heroku** | HTTP API Design Guide | Support ETags for Caching | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Directions for use (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | By default, http caching must be disabled | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#di-default-il-caching-http-deve-essere-disabilitato) |
| **Microsoft** | Microsoft REST API Guidelines | Standard request headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Standard response headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Retention policy for operation results | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#133-retention-policy-for-operation-results) |
| **PayPal** | API Style Guide | Read-only resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-only-resources) |
| **Zalando** | RESTFul API Guidelines | Support the ETag Header | [Open Guideline](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#could-support-the-etag-header) |

---

### Topic: `http-content-negotiation` - Content negociation and media types
* **Category**: HTTP Protocol
* **Definition**: How to describe your API data format and/or propose different formats (like json, yaml, xml atom, ...)
* **Guidelines Addressing This Topic**: 10 companies (19 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Content Negociation | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/content-negotiation.html) |
| **Australian Digital Transformation Office** | API Design Guide | Formats | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#formats) |
| **Australian Digital Transformation Office** | API Design Guide | API Payload format encoding | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#api-payload-format-encoding) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Cisco** | API Design Guide | 3.5.1 Standard Headers | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) |
| **Deliveroo** | API Design | Content type negotiation | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation) |
| **Deliveroo** | API Design | Versioning | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| **Google** | Google API Design Guide | Protocol Buffers v3 | [Open Guideline](https://cloud.google.com/apis/design/proto3) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Avoid custom Content-Types | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#evitare-content-type-personalizzati) |
| **Microsoft** | Microsoft REST API Guidelines | Standard request headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Standard response headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Clients-specified response format | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7101-clients-specified-response-format) |
| **Red Hat** | Thoughts on RESTful API Design | Representations | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html#representations) |
| **Red Hat** | Thoughts on RESTful API Design | Content-Types | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html#content-types) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | Use Media Type Versioning | [Open Guideline](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning) |
| **Zalando** | RESTFul API Guidelines | Modify the Content-Type for Embedded Resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources) |
| **Zalando** | RESTFul API Guidelines | Use Application-Specific Content Types | [Open Guideline](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-applicationspecific-content-types) |

---

### Topic: `http-headers` - HTTP Headers
* **Category**: HTTP Protocol
* **Definition**: How to use standard or custom HTTP headers
* **Guidelines Addressing This Topic**: 11 companies (36 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Naming Conventions | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Caching | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching) |
| **Atlassian** | Atlassian REST API Policy | Detectability (Deprecation Policy) | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Detectability) |
| **Cisco** | API Design Guide | 3.5 HTTP Headers | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) |
| **Cisco** | API Design Guide | 3.6.1 POST | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| **Deliveroo** | API Design | Resource lifecycle | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) |
| **Deliveroo** | API Design | Versioning | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| **Deliveroo** | API Design | Versioning | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| **Deliveroo** | API Design | Internationalisation (i18n) | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n) |
| **Deliveroo** | API Design | Single-entity GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| **Deliveroo** | API Design | Compression | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#compression) |
| **Haufe** | Haufe API style guide | Expires HTTP Header | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#expires-http-header) |
| **Haufe** | Haufe API style guide | https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header) |
| **Haufe** | Haufe API style guide | ETag | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#etag) |
| **Heroku** | HTTP API Design Guide | Require Versioning in the Accepts Header | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html) |
| **Heroku** | HTTP API Design Guide | Support ETags for Caching | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html) |
| **Heroku** | HTTP API Design Guide | Provide Request-Ids for Introspection | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html) |
| **Heroku** | HTTP API Design Guide | Divide Large Responses Across Requests with Ranges | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/) |
| **Microsoft** | Microsoft REST API Guidelines | POST | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) |
| **Microsoft** | Microsoft REST API Guidelines | Options and link headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Standard request headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Standard response headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Custom Headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#77-custom-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Specifying headers as query parameters | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#78-specifying-headers-as-query-parameters) |
| **Red Hat** | Thoughts on RESTful API Design | Link Headers | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | You Must Hyphenate HTTP Headers | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-you-must-hyphenate-http-headers) |
| **Zalando** | RESTFul API Guidelines | Prefer Hyphenated-Pascal-Case for HTTP header Fields | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#should-prefer-hyphenatedpascalcase-for-http-header-fields) |
| **Zalando** | RESTFul API Guidelines | Use Standardized Headers | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-standardized-headers) |
| **Zalando** | RESTFul API Guidelines | Use 429 with Headers for Rate Limits | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits) |
| **Zalando** | RESTFul API Guidelines | Do Not Use Link Headers with JSON entities | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |
| **Zalando** | RESTFul API Guidelines | HTTP headers | [Open Guideline](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers) |
| **Zalando** | RESTFul API Guidelines | Common Headers | [Open Guideline](http://zalando.github.io/restful-api-guidelines/headers/CommonHeaders.html) |
| **Zalando** | RESTFul API Guidelines | Proprietary Headers | [Open Guideline](http://zalando.github.io/restful-api-guidelines/headers/ProprietaryHeaders.html) |
| **Zalando** | RESTFul API Guidelines | Add a Warning Header to Responses | [Open Guideline](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#should-add-a-warning-header-to-responses) |

---

### Topic: `http-status` - HTTP Statuses
* **Category**: HTTP Protocol
* **Definition**: General information about HTTP statuses usage
* **Guidelines Addressing This Topic**: 11 companies (22 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Status Codes | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-status-codes.html) |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Cisco** | API Design Guide | 3.9 Status Codes | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Responses Codes | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#response-codes) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | GET responses (Resource) | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-resource) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | GET responses (Collection) | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-collection) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | POST responses | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PUT responses | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-1) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PATCH responses | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-2) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | DELETE responses | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-3) |
| **Haufe** | Haufe API style guide | Mapping Response Codes For Success and Failure | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#mapping-response-codes-for-success-and-failure) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | Errors | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors) |
| **Microsoft** | Microsoft REST API Guidelines | Faults | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults) |
| **Microsoft** | Microsoft REST API Guidelines | HTTP Status Codes | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#711-http-status-codes) |
| **PayPal** | API Style Guide | HTTP Status (Collections) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| **PayPal** | API Style Guide | HTTP Status (Read Single Resource) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| **White House** | White House Web API Standards | Error handling | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| **Zalando** | RESTFul API Guidelines | Use Meaningful HTTP Status Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-meaningful-http-status-codes) |

---

## 9. Category: HTTP Status Redirection
**Total Topics in Category**: 7
**Domain Focus**: 3xx status code usage: 301, 302, 303, 304 Not Modified, 307, and 308 permanent redirect.

### Topic: `http-status-300` - 300 Multiple Choices
* **Category**: HTTP Status Redirection
* **Definition**: The 300 (Multiple Choices) status code indicates that the target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers. In other words, the server desires that the user agent engage in reactive negotiation to select the most appropriate representation(s) for its needs.

* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |

---

### Topic: `http-status-301` - 301 Moved Permanently
* **Category**: HTTP Status Redirection
* **Definition**: This and all future requests should be directed to the given URI.
* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Zalando** | RESTFul API Guidelines | Redirection Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) |

---

### Topic: `http-status-302` - 302 Found
* **Category**: HTTP Status Redirection
* **Definition**: Common way of performing URL redirection. An HTTP response with this status code will additionally provide a URL in the location header field. The user agent (e.g. a web browser) is invited by a response with this code to make a second, otherwise identical, request to the new URL specified in the location field. 

* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Redirections | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Zalando** | RESTFul API Guidelines | HTTP Status 302 | [Open Guideline](http://zalando.github.io/restful-api-guidelines/) |

---

### Topic: `http-status-303` - 303 See Other
* **Category**: HTTP Status Redirection
* **Definition**: The response to the request can be found under another URI using a GET method. When received in response to a POST (or PUT/DELETE), the client should presume that the server has received the data and should issue a redirect with a separate GET message.

* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Asynchronous Tasks | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Redirections | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection) |
| **Zalando** | RESTFul API Guidelines | Redirection Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) |

---

### Topic: `http-status-304` - 304 Not Modified
* **Category**: HTTP Status Redirection
* **Definition**: Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.

* **Guidelines Addressing This Topic**: 4 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Deliveroo** | API Design | Resource lifecycle | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Zalando** | RESTFul API Guidelines | Redirection Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) |

---

### Topic: `http-status-307` - 307 Temporary Redirect
* **Category**: HTTP Status Redirection
* **Definition**: The 307 (Temporary Redirect) status code indicates that the target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI. Since the redirection can change over time, the client ought to continue using the original effective request URI for future requests.

* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |

---

### Topic: `http-status-308` - 308 Permanent Redirect
* **Category**: HTTP Status Redirection
* **Definition**: The 308 (Permanent Redirect) status code indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs. 

* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |

---

## 10. Category: HTTP Status Server Error
**Total Topics in Category**: 3
**Domain Focus**: 5xx status code semantics: 500 Internal Error, 501 Not Implemented, 503 Unavailable.

### Topic: `http-status-500` - 500 Internal Server Error
* **Category**: HTTP Status Server Error
* **Definition**: A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
* **Guidelines Addressing This Topic**: 5 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Server Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **White House** | White House Web API Standards | Error handling | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| **Zalando** | RESTFul API Guidelines | Server Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) |

---

### Topic: `http-status-501` - 501 Not Implemented
* **Category**: HTTP Status Server Error
* **Definition**: The server either does not recognize the request method, or it lacks the ability to fulfill the request. Usually this implies future availability (e.g., a new feature of a web-service API).
* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Zalando** | RESTFul API Guidelines | Server Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) |

---

### Topic: `http-status-503` - 503 Service Unavailable
* **Category**: HTTP Status Server Error
* **Definition**: The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.
* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Server Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors) |
| **Zalando** | RESTFul API Guidelines | Server Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) |

---

## 11. Category: HTTP Status Success
**Total Topics in Category**: 6
**Domain Focus**: 2xx status code semantics: 200 OK, 201 Created, 202 Accepted, 204 No Content, 206 Partial.

### Topic: `http-status-200` - 200 OK
* **Category**: HTTP Status Success
* **Definition**: Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action.
* **Guidelines Addressing This Topic**: 11 companies (22 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Asynchronous Tasks | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Australian Digital Transformation Office** | API Design Guide | GET /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | PUT /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | DELETE /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | DELETE /magazines/1234 | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines-1234) |
| **Australian Digital Transformation Office** | API Design Guide | HEAD /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines) |
| **Australian Digital Transformation Office** | API Design Guide | HEAD /magazines/1234 | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines-1234) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Successful Requests | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| **Deliveroo** | API Design | PATCH, mutating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Haufe** | Haufe API style guide | HTTP Status (Get List of resources) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) |
| **Haufe** | Haufe API style guide | HTTP Status (Read Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **PayPal** | API Style Guide | HTTP Status (Collections) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| **PayPal** | API Style Guide | HTTP Status (Read Single Resource) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| **White House** | White House Web API Standards | Error handling | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| **Zalando** | RESTFul API Guidelines | Success Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |

---

### Topic: `http-status-201` - 201 Created
* **Category**: HTTP Status Success
* **Definition**: The request has been fulfilled, resulting in the creation of a new resource.
* **Guidelines Addressing This Topic**: 8 companies (10 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Australian Digital Transformation Office** | API Design Guide | Use HTTP methods and status codes | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) |
| **Australian Digital Transformation Office** | API Design Guide | PUT /magazines/1234 | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines-1234) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Successful Requests | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Zalando** | RESTFul API Guidelines | Success Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |

---

### Topic: `http-status-202` - 202 Accepted
* **Category**: HTTP Status Success
* **Definition**: The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs.

* **Guidelines Addressing This Topic**: 5 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Successful Requests | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Zalando** | RESTFul API Guidelines | Success Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |

---

### Topic: `http-status-203` - 203 Non-Authoritative Information
* **Category**: HTTP Status Success
* **Definition**: The 203 (Non-Authoritative Information) status code indicates that the request was successful but the enclosed payload has been modified from that of the origin server’s 200 (OK) response by a transforming proxy. 

* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |

---

### Topic: `http-status-204` - 204 No Content
* **Category**: HTTP Status Success
* **Definition**: The server successfully processed the request and is not returning any content.
* **Guidelines Addressing This Topic**: 7 companies (12 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Successful Requests | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Haufe** | Haufe API style guide | HTTP Status (Update Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) |
| **Haufe** | Haufe API style guide | HTTP Status (Update Partial Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) |
| **Haufe** | Haufe API style guide | Delete Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **PayPal** | API Style Guide | Update Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| **PayPal** | API Style Guide | Update Partial Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| **PayPal** | API Style Guide | Delete Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| **Zalando** | RESTFul API Guidelines | Success Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |

---

### Topic: `http-status-206` - 206 Partial Content
* **Category**: HTTP Status Success
* **Definition**: The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.

* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |

---

## 12. Category: HTTP Status User Error
**Total Topics in Category**: 16
**Domain Focus**: 4xx status code semantics: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404, 409, 422, 429.

### Topic: `http-status-400` - 400 Bad Request
* **Category**: HTTP Status User Error
* **Definition**: The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, too large size, invalid request message framing, or deceptive request routing).

* **Guidelines Addressing This Topic**: 7 companies (13 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Client Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Deliveroo** | API Design | PATCH, mutating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Deliveroo** | API Design | Parameters | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#parameters) |
| **Haufe** | Haufe API style guide | HTTP Status (Get List of resources) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) |
| **Haufe** | Haufe API style guide | HTTP Status (Update Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) |
| **Haufe** | Haufe API style guide | HTTP Status (Update Partial Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **PayPal** | API Style Guide | HTTP Status (Collections) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| **White House** | White House Web API Standards | Error handling | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-401` - 401 Unauthorized
* **Category**: HTTP Status User Error
* **Definition**: Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. 

* **Guidelines Addressing This Topic**: 6 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Client Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-403` - 403 Forbidden
* **Category**: HTTP Status User Error
* **Definition**: The request was a valid request, but the server is refusing to respond to it. The user might be logged in but does not have the necessary permissions for the resource.
* **Guidelines Addressing This Topic**: 5 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Client Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Require Secure Connections | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-404` - 404 Not Found
* **Category**: HTTP Status User Error
* **Definition**: The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
* **Guidelines Addressing This Topic**: 9 companies (18 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Australian Digital Transformation Office** | API Design Guide | GET /magazines | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Client Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Haufe** | Haufe API style guide | HTTP Status (Get List of resources) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) |
| **Haufe** | Haufe API style guide | HTTP Status (Read Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1) |
| **Haufe** | Haufe API style guide | Delete Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **PayPal** | API Style Guide | HTTP Status (Collections) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| **PayPal** | API Style Guide | HTTP Status (Read Single Resource) | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| **PayPal** | API Style Guide | Update Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| **PayPal** | API Style Guide | Delete Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-405` - 405 Method Not Allowed
* **Category**: HTTP Status User Error
* **Definition**: A request method is not supported for the requested resource; for example, a GET request on a form which requires data to be presented via POST, or a PUT request on a read-only resource.

* **Guidelines Addressing This Topic**: 6 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Australian Digital Transformation Office** | API Design Guide | Use HTTP methods and status codes | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-406` - 406 Not Acceptable
* **Category**: HTTP Status User Error
* **Definition**: The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Versioning | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-408` - 408 Request Timeout
* **Category**: HTTP Status User Error
* **Definition**: The server timed out waiting for the request. According to HTTP specifications: The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.

* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-409` - 409 Conflict
* **Category**: HTTP Status User Error
* **Definition**: Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.

* **Guidelines Addressing This Topic**: 4 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-410` - 410 Gone
* **Category**: HTTP Status User Error
* **Definition**: Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a *404 Not Found* may be used instead.

* **Guidelines Addressing This Topic**: 2 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | RESTful | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#restful) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |

---

### Topic: `http-status-411` - 411 Length Required
* **Category**: HTTP Status User Error
* **Definition**: The request did not specify the length of its content, which is required by the requested resource.
* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |

---

### Topic: `http-status-412` - 412 Precondition Failed
* **Category**: HTTP Status User Error
* **Definition**: The server does not meet one of the preconditions that the requester put on the request.
* **Guidelines Addressing This Topic**: 4 companies (8 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Concurrency | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Appendix A: Response Codes | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Deliveroo** | API Design | PATCH, mutating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Deliveroo** | API Design | Return codes and errors | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-415` - 415 Unsupported Media Type
* **Category**: HTTP Status User Error
* **Definition**: The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.
* **Guidelines Addressing This Topic**: 4 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-422` - 422 Unprocessable Entity
* **Category**: HTTP Status User Error
* **Definition**: The request was well-formed but was unable to be followed due to semantic errors.
* **Guidelines Addressing This Topic**: 5 companies (7 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Client Errors | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| **Haufe** | Haufe API style guide | HTTP Status (Update Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) |
| **Haufe** | Haufe API style guide | HTTP Status (Update Partial Single Resource) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) |
| **Haufe** | Haufe API style guide | HTTP Status Codes | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Use the Problem JSON scheme for error responses | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore) |
| **PayPal** | API Style Guide | Update Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |

---

### Topic: `http-status-423` - 423 Locked
* **Category**: HTTP Status User Error
* **Definition**: The resource that is being accessed is locked.
* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-428` - 428 Precondition Required
* **Category**: HTTP Status User Error
* **Definition**: The origin server requires the request to be conditional. 
Intended to prevent the *lost update* problem, where a client GETs a resource's state, modifies it, 
and PUTs it back to the server, when meanwhile a third party has modified the state on the server, 
leading to a conflict.

* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |

---

### Topic: `http-status-429` - 429 Too Many Requests
* **Category**: HTTP Status User Error
* **Definition**: The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.
* **Guidelines Addressing This Topic**: 4 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Heroku** | HTTP API Design Guide | Return appropriate status codes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| **Zalando** | RESTFul API Guidelines | Client Side Error Codes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| **Zalando** | RESTFul API Guidelines | Use 429 with Headers for Rate Limits | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits) |

---

## 13. Category: Hypermedia
**Total Topics in Category**: 3
**Domain Focus**: HATEOAS patterns, HAL, JSON:API, link relations, state machine transitions, hypermedia write.

### Topic: `hypermedia` - Hypermedia
* **Category**: Hypermedia
* **Definition**: How to use hypermedia
* **Guidelines Addressing This Topic**: 11 companies (28 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | HAL | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/hal.html) |
| **adidas** | adidas API design guidelines | Foreign Key Relations | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Australian Digital Transformation Office** | API Design Guide | Management state with HATEOAS | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Links | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Includind Related Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources) |
| **Deliveroo** | API Design | Hypermedia / HATEOAS | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Deliveroo** | API Design | Public-friendly APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| **Haufe** | Haufe API style guide | Expanding Resources Through Hypermedia Linking | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking) |
| **Haufe** | Haufe API style guide | Support Hypermedia | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/rest-principles/rest-principles.md#support-hypermedia) |
| **Haufe** | Haufe API style guide | Hypermedia and REST | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md) |
| **Haufe** | Haufe API style guide | Relationships and Sub-Resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) |
| **Haufe** | Haufe API style guide | Hypermedia Links (Pagination) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links) |
| **Haufe** | Haufe API style guide | Hypermedia Response Format | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Use absolute URIs in the results | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-uri-assoluti-nei-risultati) |
| **PayPal** | API Style Guide | Paging Hypermedia Links | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links) |
| **PayPal** | API Style Guide | Create New Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| **Red Hat** | Thoughts on RESTful API Design | REST Metadata | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) |
| **Red Hat** | Thoughts on RESTful API Design | Link Headers | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) |
| **Red Hat** | Thoughts on RESTful API Design | Relationships | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/relationships.html) |
| **Zalando** | RESTFul API Guidelines | Use Pagination Links Where Applicable | [Open Guideline](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable) |
| **Zalando** | RESTFul API Guidelines | Hypermedia | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html) |
| **Zalando** | RESTFul API Guidelines | Use a well-defined subset of HAL | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) |
| **Zalando** | RESTFul API Guidelines | Do Not Use Link Headers with JSON entities | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |

---

### Topic: `hypermedia-read` - Hypermedia (read)
* **Category**: Hypermedia
* **Definition**: How to use hypermedia to read data
* **Guidelines Addressing This Topic**: 10 companies (23 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Australian Digital Transformation Office** | API Design Guide | Management state with HATEOAS | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Links | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| **Deliveroo** | API Design | Hypermedia / HATEOAS | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Deliveroo** | API Design | Public-friendly APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| **Haufe** | Haufe API style guide | Expanding Resources Through Hypermedia Linking | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking) |
| **Haufe** | Haufe API style guide | Hypermedia and REST | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md) |
| **Haufe** | Haufe API style guide | Relationships and Sub-Resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) |
| **Haufe** | Haufe API style guide | Hypermedia Links (Pagination) | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links) |
| **Microsoft** | Microsoft REST API Guidelines | Options and link headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Big collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections) |
| **PayPal** | API Style Guide | Paging Hypermedia Links | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links) |
| **PayPal** | API Style Guide | Create New Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| **Red Hat** | Thoughts on RESTful API Design | REST Metadata | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) |
| **Red Hat** | Thoughts on RESTful API Design | Link Headers | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) |
| **Red Hat** | Thoughts on RESTful API Design | Relationships | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/relationships.html) |
| **Zalando** | RESTFul API Guidelines | Use Pagination Links Where Applicable | [Open Guideline](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable) |
| **Zalando** | RESTFul API Guidelines | Use a well-defined subset of HAL | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) |
| **Zalando** | RESTFul API Guidelines | Use Custom Link Relations | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations) |
| **Zalando** | RESTFul API Guidelines | Do Not Use Link Headers with JSON entities | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |

---

### Topic: `hypermedia-write` - Hypermedia (write)
* **Category**: Hypermedia
* **Definition**: How to use hypermedia to write data
* **Guidelines Addressing This Topic**: 4 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Australian Digital Transformation Office** | API Design Guide | Management state with HATEOAS | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Links | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| **Red Hat** | Thoughts on RESTful API Design | Forms | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/forms.html) |

---

## 14. Category: Miscellaneous
**Total Topics in Category**: 10
**Domain Focus**: CORS, rate limiting, debug headers, developer experience (DX), documentation, and API chaining.

### Topic: `api-chaining` - API chaining
* **Category**: Miscellaneous
* **Definition**: How to chain API call in internal systems
* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.5.2 TrackingID Header | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#352-trackingid-header) |

---

### Topic: `cors` - CORS
* **Category**: Miscellaneous
* **Definition**: How to deal with CORS
* **Guidelines Addressing This Topic**: 4 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Australian Digital Transformation Office** | API Design Guide | Support cross-domain mashups with CORS | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/cors.html) |
| **Microsoft** | Microsoft REST API Guidelines | CORS | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#8-cors) |
| **White House** | White House Web API Standards | JSONP | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#jsonp) |

---

### Topic: `debug-diagnose` - Debug and diagnose
* **Category**: Miscellaneous
* **Definition**: How to provide informations to debug and diagnose
* **Guidelines Addressing This Topic**: 1 companies (1 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Heroku** | HTTP API Design Guide | Provide Request-Ids for Introspection | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html) |

---

### Topic: `developer-experience` - Developer experience
* **Category**: Miscellaneous
* **Definition**: How to take care of developer experience (DX)
* **Guidelines Addressing This Topic**: 5 companies (8 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Policy | Deprecation policy | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy) |
| **Australian Digital Transformation Office** | API Design Guide | Empathy | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/empathy.html) |
| **Australian Digital Transformation Office** | API Design Guide | Errors | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/errors.html) |
| **Australian Digital Transformation Office** | API Design Guide | Endpoint Stability | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/availability.html) |
| **Google** | Google API Design Guide | Grammar Syntax | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| **Haufe** | Haufe API style guide | Documentation | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md) |
| **Microsoft** | Microsoft REST API Guidelines | Client Guidance | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#6-client-guidance) |
| **Microsoft** | Microsoft REST API Guidelines | Client library optional | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#712-client-library-optional) |

---

### Topic: `documentation` - Documentation
* **Category**: Miscellaneous
* **Definition**: How to produce and/or propose API documentation
* **Guidelines Addressing This Topic**: 11 companies (21 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | OpenAPI Specification | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html) |
| **adidas** | adidas API design guidelines | API Design Platform - Apiary | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html) |
| **Australian Digital Transformation Office** | API Design Guide | Discoverability | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/discoverability.html) |
| **Australian Digital Transformation Office** | API Design Guide | Document your API | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/documentation.html) |
| **Cisco** | API Design Guide | 3.9 Status Codes | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) |
| **Cisco** | API Design Guide | API Documentation | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#api-documentation) |
| **Deliveroo** | API Design | Documenting APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#documenting-apis) |
| **Google** | Google API Design Guide | Grammar Syntax | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| **Google** | Google API Design Guide | Output Fields | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#output_fields) |
| **Google** | Google API Design Guide | Documentation | [Open Guideline](https://cloud.google.com/apis/design/documentation) |
| **Google** | Google API Design Guide | Checklist for all descriptions | [Open Guideline](https://cloud.google.com/apis/design/documentation#checklist_for_all_descriptions) |
| **Haufe** | Haufe API style guide | Every API MUST be described using a formal API description language | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#every-api-must-be-described-using-a-formal-api-description-language) |
| **Haufe** | Haufe API style guide | Documentation | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md) |
| **Heroku** | HTTP API Design Guide | Provide machine-readable JSON schema | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-machine-readable-json-schema.html) |
| **Heroku** | HTTP API Design Guide | Provide human-readable docs | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-human-readable-docs.html) |
| **Heroku** | HTTP API Design Guide | Provide executable examples | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-executable-examples.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) |
| **Microsoft** | Microsoft REST API Guidelines | Options and link headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| **Red Hat** | Thoughts on RESTful API Design | Forms | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/forms.html) |
| **Zalando** | RESTFul API Guidelines | Provide External Documentation | [Open Guideline](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#should-provide-external-documentation) |
| **Zalando** | RESTFul API Guidelines | Reflect Deprecation in API Definition | [Open Guideline](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#must-reflect-deprecation-in-api-definition) |

---

### Topic: `guiding-input` - Guiding inputs
* **Category**: Miscellaneous
* **Definition**: How to help consumers or end user to input relevant data
* **Guidelines Addressing This Topic**: 2 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Google** | Google API Design Guide | Request Validation | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#request_validation) |
| **Google** | Google API Design Guide | Request Duplication | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#request_duplication) |
| **Google** | Google API Design Guide | Grammar Syntax | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| **Google** | Google API Design Guide | Output Fields | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#output_fields) |
| **Red Hat** | Thoughts on RESTful API Design | Forms | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/forms.html) |

---

### Topic: `performance` - Performance and bandwidth
* **Category**: Miscellaneous
* **Definition**: How to deal with high traffic or consumers with low bandwith
* **Guidelines Addressing This Topic**: 5 companies (6 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Compression | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#compression) |
| **Deliveroo** | API Design | Mobile-friendly APIs | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis) |
| **Heroku** | HTTP API Design Guide | Keep JSON minified in all responses | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Optimize bandwidth usage and improve responsiveness | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita) |
| **PayPal** | API Style Guide | Performance and bandwidth | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md) |
| **Zalando** | RESTFul API Guidelines | Performance | [Open Guideline](http://zalando.github.io/restful-api-guidelines/performance/Performance.html) |

---

### Topic: `query-parameter` - Query parameters
* **Category**: Miscellaneous
* **Definition**: How to use query parameters
* **Guidelines Addressing This Topic**: 4 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Query Parameters | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) |
| **Deliveroo** | API Design | Parameters | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#parameters) |
| **PayPal** | API Style Guide | Filtering | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#filtering) |
| **Zalando** | RESTFul API Guidelines | Query parameters must be snake_case (never camelCase) | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-query-parameters-must-be-snakecase-never-camelcase) |
| **Zalando** | RESTFul API Guidelines | Use Conventional Query Strings | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |

---

### Topic: `rate-limiting` - Rate limiting
* **Category**: Miscellaneous
* **Definition**: How to provide information about how many calls a consumer can do
* **Guidelines Addressing This Topic**: 4 companies (4 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Rate Limiting | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/rate-limiting.html) |
| **Atlassian** | Atlassian REST API Policy | Resource/rate limits and paging | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Heroku** | HTTP API Design Guide | Show rate limit status | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/show-rate-limit-status.html) |

---

### Topic: `undo` - Undo
* **Category**: Miscellaneous
* **Definition**: How to undo things
* **Guidelines Addressing This Topic**: 2 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6 HTTP Verbs | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Google** | Google API Design Guide | Delete | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#delete) |
| **Google** | Google API Design Guide | Undelete | [Open Guideline](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |

---

## 15. Category: Naming
**Total Topics in Category**: 3
**Domain Focus**: Casing conventions (camelCase, snake_case, kebab-case), URI grammar, language, and pluralization.

### Topic: `naming` - Naming
* **Category**: Naming
* **Definition**: How to name things
* **Guidelines Addressing This Topic**: 11 companies (23 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Naming Conventions | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) |
| **adidas** | adidas API design guidelines | Reserved Identifiers | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/reserved-identifiers.html) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Query Parameters | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Field Names | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | URL Structure | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure) |
| **Deliveroo** | API Design | Naming | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#naming) |
| **Google** | Google API Design Guide | Collection ID | [Open Guideline](https://cloud.google.com/apis/design/resource_names#collection_id) |
| **Google** | Google API Design Guide | Standard Fields | [Open Guideline](https://cloud.google.com/apis/design/standard_fields) |
| **Google** | Google API Design Guide | Naming Conventions | [Open Guideline](https://cloud.google.com/apis/design/naming_convention) |
| **Google** | Google API Design Guide | Representing Ranges | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#representing_ranges) |
| **Google** | Google API Design Guide | List Paginations | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#list_pagination) |
| **Haufe** | Haufe API style guide | Building Your Resource Taxonomy | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy) |
| **Haufe** | Haufe API style guide | Resource naming | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#resource-naming) |
| **Heroku** | HTTP API Design Guide | Resource names | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/resource-names.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Uniformity and naming (REST) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#uniformita-e-naming) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Uniformity and naming (SOAP) | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#uniformita-e-naming) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Resource collections can use plural names | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale) |
| **PayPal** | API Style Guide | Collection Resources | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| **White House** | White House Web API Standards | General guidelines for RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| **Zalando** | RESTFul API Guidelines | Property naming | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-naming) |
| **Zalando** | RESTFul API Guidelines | API Naming | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html) |
| **Zalando** | RESTFul API Guidelines | Use Domain-Specific Resource Names | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-use-domainspecific-resource-names) |

---

### Topic: `naming-case` - Case
* **Category**: Naming
* **Definition**: Which case (lowercase, camelCase, ...) to use and when
* **Guidelines Addressing This Topic**: 7 companies (11 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Naming Conventions | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) |
| **adidas** | adidas API design guidelines | JSON | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/json.html) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Cisco** | API Design Guide | URL Paths | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Query Parameters | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Field Names | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names) |
| **Google** | Google API Design Guide | Collection ID | [Open Guideline](https://cloud.google.com/apis/design/resource_names#collection_id) |
| **Google** | Google API Design Guide | Camel Case | [Open Guideline](https://cloud.google.com/apis/design/naming_convention#camel_case) |
| **Heroku** | HTTP API Design Guide | Downcase paths and attributes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | The properties of JSON objects must have a consistent naming | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-proprieta-degli-oggetti-json-devono-avere-un-naming-consistente) |
| **Zalando** | RESTFul API Guidelines | Property names must be snake_case | [Open Guideline](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-property-names-must-be-snakecase-and-never-camelcase) |

---

### Topic: `naming-language` - Language
* **Category**: Naming
* **Definition**: Which language(s) use when designing an API
* **Guidelines Addressing This Topic**: 2 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Google** | Google API Design Guide | Collection ID | [Open Guideline](https://cloud.google.com/apis/design/resource_names#collection_id) |
| **Google** | Google API Design Guide | Naming Conventions | [Open Guideline](https://cloud.google.com/apis/design/naming_convention) |
| **Zalando** | RESTFul API Guidelines | Write APIs in U.S. English | [Open Guideline](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-write-apis-in-us-english) |

---

## 16. Category: Resources
**Total Topics in Category**: 18
**Domain Focus**: Resource hierarchies, IDs, sub-resources, creation, deletion, partial updates, and relationships.

### Topic: `resource` - Resource
* **Category**: Resources
* **Definition**: General informations about resources
* **Guidelines Addressing This Topic**: 10 companies (21 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Cisco** | API Design Guide | 3 Guidelines | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#3-guidelines) |
| **Cisco** | API Design Guide | 3.3 Representations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| **Deliveroo** | API Design | Listing intrinsic properties | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#listing-intrinsic-properties) |
| **Deliveroo** | API Design | Normalising concepts | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#normalising-concepts) |
| **Deliveroo** | API Design | Single-resource representation | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation) |
| **Google** | Google API Design Guide | Resources | [Open Guideline](https://cloud.google.com/apis/design/resources#resources) |
| **Google** | Google API Design Guide | Methods | [Open Guideline](https://cloud.google.com/apis/design/resources#methods) |
| **Google** | Google API Design Guide | Resources examples | [Open Guideline](https://cloud.google.com/apis/design/resources#examples) |
| **Google** | Google API Design Guide | Resource Labels | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#resource_labels) |
| **Haufe** | Haufe API style guide | Building Your Resource Taxonomy | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy) |
| **Haufe** | Haufe API style guide | Defining Resource Lifecycles | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#defining-resource-lifecycles) |
| **Haufe** | Haufe API style guide | Resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/resources/resources.md) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | The concept of service | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#il-concetto-di-servizio) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | CRUD Access to Resources | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#accesso-crud-a-risorse) |
| **PayPal** | API Style Guide | Read Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource) |
| **PayPal** | API Style Guide | Sub-Resource Singleton | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-singleton) |
| **Red Hat** | Thoughts on RESTful API Design | Resources | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html) |
| **Red Hat** | Thoughts on RESTful API Design | URLs | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/urls.html) |
| **Zalando** | RESTFul API Guidelines | resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html) |

---

### Topic: `resource-action` - Action resource
* **Category**: Resources
* **Definition**: How to use action resource (e.g. resources like /cancel or /approve)
* **Guidelines Addressing This Topic**: 8 companies (15 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.8 Action Resources | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#38-action-resources) |
| **Cisco** | API Design Guide | 3.6.1 POST | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PUT | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#put) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Actions | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#actions) |
| **Google** | Google API Design Guide | Custom Methods | [Open Guideline](https://cloud.google.com/apis/design/custom_methods) |
| **Heroku** | HTTP API Design Guide | Actions | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/actions.html) |
| **Microsoft** | Microsoft REST API Guidelines | Operations resource | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource) |
| **Microsoft** | Microsoft REST API Guidelines | Operation resource | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource) |
| **Microsoft** | Microsoft REST API Guidelines | Operation tombstones | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones) |
| **Microsoft** | Microsoft REST API Guidelines | The typical flow, polling | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling) |
| **Microsoft** | Microsoft REST API Guidelines | The typical flow, push notifications | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) |
| **Microsoft** | Microsoft REST API Guidelines | Retry-After | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after) |
| **PayPal** | API Style Guide | Complex Operation | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation) |
| **Red Hat** | Thoughts on RESTful API Design | Actions | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#actions) |
| **Zalando** | RESTFul API Guidelines | Avoid Actions — Think About Resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-avoid-actions-—-think-about-resources) |

---

### Topic: `resource-change-tracking` - Track change
* **Category**: Resources
* **Definition**: How to track change on resources
* **Guidelines Addressing This Topic**: 2 companies (2 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Deliveroo** | API Design | Single-entity GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| **Microsoft** | Microsoft REST API Guidelines | Delta queries | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#10-delta-queries) |

---

### Topic: `resource-creation` - Create resource
* **Category**: Resources
* **Definition**: How to create resources
* **Guidelines Addressing This Topic**: 12 companies (14 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.1 POST | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | POST | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#post) |
| **Deliveroo** | API Design | POST, creating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Create | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#create) |
| **Haufe** | Haufe API style guide | Create New Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource) |
| **Heroku** | HTTP API Design Guide | Provide full resources where available | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | POST | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) |
| **Microsoft** | Microsoft REST API Guidelines | Changing collections | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) |
| **PayPal** | API Style Guide | Create New Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | HTTP verbs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| **Zalando** | RESTFul API Guidelines | POST | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#post) |

---

### Topic: `resource-creation-with-id` - Create resource with a specific ID
* **Category**: Resources
* **Definition**: How to create resource with a provided id
* **Guidelines Addressing This Topic**: 5 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.2 PUT | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| **Google** | Google API Design Guide | Update | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#update) |
| **Haufe** | Haufe API style guide | Create New Resource - Consumer Supplied Identifier | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier) |
| **Microsoft** | Microsoft REST API Guidelines | Creating resources via PATCH (UPSERT semantics) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| **PayPal** | API Style Guide | Create New Resource - Consumer Supplied Identifier | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource---consumer-supplied-identifier) |

---

### Topic: `resource-deletion` - Delete resource
* **Category**: Resources
* **Definition**: How to delete resources
* **Guidelines Addressing This Topic**: 12 companies (13 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Concurrency | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| **Cisco** | API Design Guide | 3.6.4 DELETE | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | DELETE | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#delete) |
| **Deliveroo** | API Design | DELETE, destroying entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Delete | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#delete) |
| **Haufe** | Haufe API style guide | Delete Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) |
| **Heroku** | HTTP API Design Guide | Provide full resources where available | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **PayPal** | API Style Guide | Delete Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | HTTP verbs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| **Zalando** | RESTFul API Guidelines | DELETE | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#delete) |

---

### Topic: `resource-id` - Resource ID
* **Category**: Resources
* **Definition**: What is a resource ID and/or how it's built
* **Guidelines Addressing This Topic**: 7 companies (8 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| **Deliveroo** | API Design | Single-resource representation | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation) |
| **Google** | Google API Design Guide | Resource ID | [Open Guideline](https://cloud.google.com/apis/design/resource_names#resource_id) |
| **Haufe** | Haufe API style guide | Composite Keys | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/faq/faq.md#composite-keys) |
| **Heroku** | HTTP API Design Guide | Support non-id dereferencing for convenience | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html) |
| **Heroku** | HTTP API Design Guide | Provide resource (UU)IDs | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-resource-uuids.html) |
| **Microsoft** | Microsoft REST API Guidelines | Canonical identifier | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier) |
| **Red Hat** | Thoughts on RESTful API Design | REST Metadata | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) |

---

### Topic: `resource-id-semantic` - ID with semantic
* **Category**: Resources
* **Definition**: Using meaningful ids (like `me`)
* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.4.2 User Scoped Endpoints | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#342-user-scoped-endpoints) |
| **Heroku** | HTTP API Design Guide | Support non-id dereferencing for convenience | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html) |
| **Microsoft** | Microsoft REST API Guidelines | Canonical identifier | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier) |

---

### Topic: `resource-multiple` - Batch Bulk
* **Category**: Resources
* **Definition**: How to handle batch/bulk processing/creation/update/... (e.g. handle multiple resources at conce)
* **Guidelines Addressing This Topic**: 6 companies (7 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | None | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/batch-operations.html) |
| **Cisco** | API Design Guide | 3.11 Bulk, Batch, and Multi-Result Operations | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#311-bulk-batch-and-multi-result-operations) |
| **Google** | Google API Design Guide | Batch Get | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#list) |
| **Google** | Google API Design Guide | Common Custom Methods | [Open Guideline](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| **Microsoft** | Microsoft REST API Guidelines | Batch Bulk | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) |
| **PayPal** | API Style Guide | Complex Operation - Composite | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---composite) |
| **White House** | White House Web API Standards | HTTP verbs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |

---

### Topic: `resource-relationships` - Relationships
* **Category**: Resources
* **Definition**: How to define and use relations between resources
* **Guidelines Addressing This Topic**: 8 companies (12 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Foreign Key Relations | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html) |
| **Australian Digital Transformation Office** | API Design Guide | Management state with HATEOAS | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Relationships | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#relationships) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Links | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| **Deliveroo** | API Design | None | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#listing-relations) |
| **Haufe** | Haufe API style guide | How to Handle Resource Relationships and Composition | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#how-to-handle-resource-relationships-and-composition) |
| **Haufe** | Haufe API style guide | Relationships and Sub-Resources | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) |
| **Heroku** | HTTP API Design Guide | Nest foreign key relations | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html) |
| **Red Hat** | Thoughts on RESTful API Design | Relationships | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/relationships.html) |
| **Zalando** | RESTFul API Guidelines | Use a well-defined subset of HAL | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) |
| **Zalando** | RESTFul API Guidelines | Use Custom Link Relations | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations) |
| **Zalando** | RESTFul API Guidelines | Do Not Use Link Headers with JSON entities | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |

---

### Topic: `resource-replacement` - Replace resource
* **Category**: Resources
* **Definition**: How to replace (or update fully) a resource
* **Guidelines Addressing This Topic**: 5 companies (5 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.2 PUT | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| **Google** | Google API Design Guide | Update | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#update) |
| **Haufe** | Haufe API style guide | Update Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) |
| **PayPal** | API Style Guide | Update Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| **Zalando** | RESTFul API Guidelines | PUT | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) |

---

### Topic: `resource-retrieve` - Retrieve resource
* **Category**: Resources
* **Definition**: How to retrieve a resource
* **Guidelines Addressing This Topic**: 11 companies (13 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.3 GET | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | GET | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) |
| **Deliveroo** | API Design | Single-entity GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Get | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#get) |
| **Google** | Google API Design Guide | Get Unique Resource From Sub-Collection | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection) |
| **Haufe** | Haufe API style guide | Read Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource) |
| **Heroku** | HTTP API Design Guide | Provide full resources where available | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **PayPal** | API Style Guide | Read Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | HTTP verbs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| **Zalando** | RESTFul API Guidelines | GET | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) |

---

### Topic: `resource-retrieve-dereference` - Dereference Relationships
* **Category**: Resources
* **Definition**: How to load a resource and its linked resources in one call
* **Guidelines Addressing This Topic**: 6 companies (12 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Choosing Fields & Embedded Resources | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Cisco** | API Design Guide | 3.6.3 GET | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Includind Related Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources) |
| **Deliveroo** | API Design | Fine-grained | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#fine-grained) |
| **Deliveroo** | API Design | Conventions on responses | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#conventions-on-responses) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Zalando** | RESTFul API Guidelines | Use Conventional Query Strings | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| **Zalando** | RESTFul API Guidelines | Define useful resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources) |
| **Zalando** | RESTFul API Guidelines | Allow Optional Embedding of Sub-Resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#should-allow-optional-embedding-of-subresources) |
| **Zalando** | RESTFul API Guidelines | Modify the Content-Type for Embedded Resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources) |

---

### Topic: `resource-retrieve-partial` - Retrieve resource partially
* **Category**: Resources
* **Definition**: How to retrieve partially a resource
* **Guidelines Addressing This Topic**: 9 companies (14 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | Choosing Fields & Embedded Resources | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html) |
| **Cisco** | API Design Guide | 3.6.3.6 Services MAY support partial retrieval of resource state | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Requesting Partiel Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#requesting-partial-resources) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | Nested Resources | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#nested-resources) |
| **Deliveroo** | API Design | Single-entity GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| **Google** | Google API Design Guide | Partial Response | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#partial_response) |
| **Google** | Google API Design Guide | Resource View | [Open Guideline](https://cloud.google.com/apis/design/design_patterns#resource_view) |
| **Haufe** | Haufe API style guide | Field selection | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#field-selection) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Optimize bandwidth usage and improve responsiveness | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita) |
| **Microsoft** | Microsoft REST API Guidelines | Standard request headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| **Microsoft** | Microsoft REST API Guidelines | Standard response headers | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| **Zalando** | RESTFul API Guidelines | Use Conventional Query Strings | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| **Zalando** | RESTFul API Guidelines | Define useful resources | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources) |
| **Zalando** | RESTFul API Guidelines | Support Filtering of Resource Fields | [Open Guideline](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#should-support-filtering-of-resource-fields) |

---

### Topic: `resource-state` - Resource's state
* **Category**: Resources
* **Definition**: How to change a resource's state/status (like processed/sent/paid/...)
* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Google** | Google API Design Guide | Use Cases | [Open Guideline](https://cloud.google.com/apis/design/custom_methods#use_cases) |
| **Haufe** | Haufe API style guide | Resource's state | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md) |
| **PayPal** | API Style Guide | Complex Operation - Transient | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---transient) |

---

### Topic: `resource-update` - Update resource
* **Category**: Resources
* **Definition**: How to update a resource
* **Guidelines Addressing This Topic**: 13 companies (20 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Concurrency | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| **Cisco** | API Design Guide | 3.6.2 PUT | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| **Cisco** | API Design Guide | 3.6.5 PATCH | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PATCH | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) |
| **Deliveroo** | API Design | PATCH, mutating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| **Deliveroo** | API Design | Mutable resources | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) |
| **Google** | Google API Design Guide | Standard Methods | [Open Guideline](https://cloud.google.com/apis/design/standard_methods) |
| **Google** | Google API Design Guide | Update | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#update) |
| **Google** | Google API Design Guide | Move | [Open Guideline](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| **Haufe** | Haufe API style guide | Update Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) |
| **Haufe** | Haufe API style guide | Update Partial Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) |
| **Heroku** | HTTP API Design Guide | Provide full resources where available | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST interface processing rules | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| **Microsoft** | Microsoft REST API Guidelines | PATCH | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) |
| **Microsoft** | Microsoft REST API Guidelines | Creating resources via PATCH (UPSERT semantics) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| **PayPal** | API Style Guide | Update Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | Methods | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| **White House** | White House Web API Standards | HTTP verbs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| **Zalando** | RESTFul API Guidelines | PUT | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) |
| **Zalando** | RESTFul API Guidelines | PATCH | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) |

---

### Topic: `resource-update-partial` - Update resource partially
* **Category**: Resources
* **Definition**: How to udate partially a resource
* **Guidelines Addressing This Topic**: 9 companies (11 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Cisco** | API Design Guide | 3.6.5 PATCH | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | PATCH | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) |
| **Deliveroo** | API Design | PATCH, mutating entities | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| **Deliveroo** | API Design | Mutable resources | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) |
| **Google** | Google API Design Guide | Update | [Open Guideline](https://cloud.google.com/apis/design/standard_methods#update) |
| **Haufe** | Haufe API style guide | Update Partial Single Resource | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) |
| **Microsoft** | Microsoft REST API Guidelines | PATCH | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) |
| **Microsoft** | Microsoft REST API Guidelines | Creating resources via PATCH (UPSERT semantics) | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| **PayPal** | API Style Guide | Update Partial Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | PATCH vs PUT | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/methods.html#patch-vs-put) |
| **Zalando** | RESTFul API Guidelines | PATCH | [Open Guideline](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) |

---

### Topic: `resource-url-format` - URL format
* **Category**: Resources
* **Definition**: How to design URLs
* **Guidelines Addressing This Topic**: 15 companies (30 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | URI structure | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/uri-structure.html) |
| **adidas** | adidas API design guidelines | Changes and Versioning | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | REST Resources | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| **Atlassian** | Atlassian REST API Policy | Stable URIs | [Open Guideline](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-StableURIs) |
| **Australian Digital Transformation Office** | API Design Guide | URL Depth | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#url-depth) |
| **Australian Digital Transformation Office** | API Design Guide | Good RESTful URL examples | [Open Guideline](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#good-restful-url-examples) |
| **Cisco** | API Design Guide | 3.4 URL Format | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#34-url-format) |
| **Cisco** | API Design Guide | URL Paths | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | URL Structure | [Open Guideline](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure) |
| **Deliveroo** | API Design | Path segments | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#path-segments) |
| **Deliveroo** | API Design | Single-entity GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| **Deliveroo** | API Design | Collection GET endpoints | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| **Google** | Google API Design Guide | Resource Names | [Open Guideline](https://cloud.google.com/apis/design/resource_names) |
| **Google** | Google API Design Guide | Resource Name vs URL | [Open Guideline](https://cloud.google.com/apis/design/resource_names#resource_name_vs_url) |
| **Haufe** | Haufe API style guide | URI Components | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md) |
| **Heroku** | HTTP API Design Guide | Use consistent path formats | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/use-consistent-path-formats.html) |
| **Heroku** | HTTP API Design Guide | Downcase paths and attributes | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html) |
| **Heroku** | HTTP API Design Guide | Minimize path nesting | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/requests/minimize-path-nesting.html) |
| **Microsoft** | Microsoft REST API Guidelines | URL Structure | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#71-url-structure) |
| **Microsoft** | Microsoft REST API Guidelines | URL Length | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#72-url-length) |
| **Microsoft** | Microsoft REST API Guidelines | Collection URL patterns | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#93-collection-url-patterns) |
| **PayPal** | API Style Guide | URL Components | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#uri-components) |
| **PayPal** | API Style Guide | Update Partial Single Resource | [Open Guideline](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| **Red Hat** | Thoughts on RESTful API Design | URLs | [Open Guideline](http://restful-api-design.readthedocs.io/en/latest/urls.html) |
| **White House** | White House Web API Standards | RESTful URLs | [Open Guideline](https://github.com/WhiteHouse/api-standards/blob/master/README.md#restful-urls) |
| **Zalando** | RESTFul API Guidelines | Path segments must be lowercase separate words with hyphens | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-path-segments-must-be-lowercase-separate-words-with-hyphens) |
| **Zalando** | RESTFul API Guidelines | Always Pluralize Resource Names | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-always-pluralize-resource-names) |
| **Zalando** | RESTFul API Guidelines | First Path segment May be /api | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-first-path-segment-may-be-api) |
| **Zalando** | RESTFul API Guidelines | Avoid Trailing Slashes | [Open Guideline](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-avoid-trailing-slashes) |
| **Zalando** | RESTFul API Guidelines | Limit of Sub-Resource Levels | [Open Guideline](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-subresource-levels) |

---

## 17. Category: Security
**Total Topics in Category**: 2
**Domain Focus**: Authentication, authorization, TLS, token scopes, API keys, and sensitive data protection.

### Topic: `security` - Security
* **Category**: Security
* **Definition**: Security concerns
* **Guidelines Addressing This Topic**: 10 companies (25 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | TLS | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/tls.html) |
| **adidas** | adidas API design guidelines | Security | [Open Guideline](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | Security | [Open Guideline](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Security) |
| **Australian Digital Transformation Office** | API Design Guide | Privacy and security | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/security.html) |
| **Cisco** | API Design Guide | 3.1 Security | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#31-security) |
| **Cisco** | API Design Guide | 3.2 Authentication and Representation | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#32-authentication-and-authorization) |
| **Cisco** | API Design Guide | 3.6.8 Safe and Non-Safe Methods | [Open Guideline](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| **Deliveroo** | API Design | None | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#security) |
| **Deliveroo** | API Design | Caching | [Open Guideline](http://deliveroo.engineering/guidelines/api-design/#caching) |
| **Haufe** | Haufe API style guide | API clients MUST use an API Key | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#api-clients-must-use-an-api-key) |
| **Heroku** | HTTP API Design Guide | Require Secure Connections | [Open Guideline](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Security concepts | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_02.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Security | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04_cap_00.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Channel security and / or identification of organizations | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/sicurezza-di-canale-eo-autenticazione-delle-organizzazioni.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | User (consumer) access | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/autenticazione-del-soggetto-richiedente.html) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Integrity of SOAP message | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idas03-integrita-della-payload-del-messaggio-soap) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Integrity of REST message | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idar03-integrita-della-payload-messaggio-rest) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Confidentiality and user (consumer) authentication | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzione-per-confidenzialita-ed-autenticazione-del-soggetto-fruitore) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | Non repudiation of transactions | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzioni-per-la-non-ripudiabilita-della-trasmissione) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | REST API safety | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#sicurezza) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | SOAP service safety | [Open Guideline](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#sicurezza) |
| **Microsoft** | Microsoft REST API Guidelines | Security | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#148-security) |
| **Zalando** | RESTFul API Guidelines | Security | [Open Guideline](http://zalando.github.io/restful-api-guidelines/security/Security.html) |
| **Zalando** | RESTFul API Guidelines | Secure Endpoints with OAuth 2.0 | [Open Guideline](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-secure-endpoints-with-oauth-20) |
| **Zalando** | RESTFul API Guidelines | Define and Assign Access Rights (Scopes) | [Open Guideline](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-define-and-assign-access-rights-scopes) |

---

### Topic: `security-data` - Data privacy
* **Category**: Security
* **Definition**: Data privacy concerns
* **Guidelines Addressing This Topic**: 3 companies (3 citations)

#### Analyzed Guideline Citations

| Organization | Guideline Title | Section / Rule | Reference Link |
| :--- | :--- | :--- | :--- |
| **Australian Digital Transformation Office** | API Design Guide | Privacy and security | [Open Guideline](https://apiguide.readthedocs.io/en/latest/principles/security.html) |
| **Haufe** | Haufe API style guide | Security and Authentication | [Open Guideline](https://github.com/Haufe-Lexware/api-style-guide/blob/master/security-and-authentication/security-and-authentication.md) |
| **Microsoft** | Microsoft REST API Guidelines | PII parameters | [Open Guideline](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#79-pii-parameters) |

---
