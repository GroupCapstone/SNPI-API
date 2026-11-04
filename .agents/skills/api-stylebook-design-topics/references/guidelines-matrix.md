# API Stylebook: Analyzed Design Guidelines & Cross-Reference Matrix

> **Status**: Authoritative Enterprise Reference Matrix  
> **Source**: API Stylebook (apistylebook.com / Arnaud Lauret)  
> **Coverage**: 16 Enterprise Guidelines | 17 Design Categories | 100 Normalized Topics | 1,051 Curated References  

---

## 1. Analyzed Enterprise Guidelines Inventory

| ID | Company / Organization | Guideline Title | Mapped Topics | Primary Documentation |
| :--- | :--- | :--- | :--- | :--- |
| `adidas-api-design-guidelines` | **adidas** | adidas API design guidelines | 41 | [Official Guide](https://adidas-group.gitbooks.io/api-guidelines/content/) |
| `atlassian-rest-api-design-guidelines-version-1` | **Atlassian** | Atlassian REST API Design Guidelines version 1 | 28 | [Official Guide](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1) |
| `atlassian-rest-api-policy` | **Atlassian** | Atlassian REST API Policy | 8 | [Official Guide](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy) |
| `ausdto-api-design-guide` | **Australian Digital Transformation Office** | API Design Guide | 26 | [Official Guide](https://apiguide.readthedocs.io/en/latest/index.html) |
| `cisco-api-design-guide` | **Cisco** | API Design Guide | 43 | [Official Guide](https://github.com/CiscoDevNet/api-design-guide) |
| `cloud-foundy-cloud-controller-api-style-guide` | **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | 44 | [Official Guide](https://github.com/cloudfoundry/cc-api-v3-style-guide) |
| `deliveroo-api-design-guidelines` | **Deliveroo** | API Design | 60 | [Official Guide](http://deliveroo.engineering/guidelines/api-design/) |
| `google-api-design-guide` | **Google** | Google API Design Guide | 39 | [Official Guide](https://cloud.google.com/apis/design/) |
| `haufe-api-styleguide` | **Haufe** | Haufe API style guide | 61 | [Official Guide](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md) |
| `heroku-http-api-design-guide` | **Heroku** | HTTP API Design Guide | 34 | [Official Guide](https://geemus.gitbooks.io/http-api-design/content/en/) |
| `italian-public-administration` | **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | 37 | [Official Guide](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/) |
| `microsoft-rest-api-guidelines` | **Microsoft** | Microsoft REST API Guidelines | 43 | [Official Guide](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) |
| `paypal-api-style-guide` | **PayPal** | API Style Guide | 36 | [Official Guide](https://github.com/paypal/api-standards/blob/master/api-style-guide.md) |
| `redhat-thoughts-on-restful-api-design` | **Red Hat** | Thoughts on RESTful API Design | 32 | [Official Guide](http://restful-api-design.readthedocs.io/en/latest/) |
| `white-house-web-api-standards` | **White House** | White House Web API Standards | 22 | [Official Guide](https://github.com/WhiteHouse/api-standards) |
| `zalando-restful-api-guidelines` | **Zalando** | RESTFul API Guidelines | 74 | [Official Guide](http://zalando.github.io/restful-api-guidelines/) |

---

## 2. Topic to Guidelines Coverage Matrix

This matrix maps each normalized API design topic to the specific enterprise guidelines that govern it.

| Topic ID | Category | Topic Name | Companies Covering | References Count |
| :--- | :--- | :--- | :--- | :--- |
| `api-counts` | API Design | **API counts** | Deliveroo, Zalando, adidas | 3 |
| `global-design` | API Design | **Global design** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Deliveroo, Google, Haufe, Heroku, Microsoft, Zalando, adidas | 35 |
| `governance` | API Lifecycle | **Governance** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Haufe, Microsoft, Zalando, adidas | 21 |
| `versioning` | API Lifecycle | **Updates and Versioning** | Atlassian, Australian Digital Transformation Office, Cisco, Deliveroo, Google, Haufe, Heroku, Microsoft, PayPal, White House, Zalando, adidas | 30 |
| `asynchronicity` | Asynchronicity | **Asynchronicity** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cloud Foundry, Google, Microsoft, Red Hat, Zalando, adidas | 19 |
| `notifications-server-events` | Asynchronicity | **Notifying API consumers** | Microsoft, Red Hat, Zalando | 4 |
| `collection` | Collection Resources | **Collection** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, Zalando | 17 |
| `collection-filtering` | Collection Resources | **Filtering** | Cisco, Cloud Foundry, Google, Haufe, Microsoft, PayPal, White House, Zalando, adidas | 15 |
| `collection-pagination` | Collection Resources | **Pagination** | Atlassian, Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, Microsoft, PayPal, Red Hat, Zalando, adidas | 19 |
| `collection-retrieve` | Collection Resources | **Retrieve a collection** | Cloud Foundry, Deliveroo, Google, Haufe, PayPal, Red Hat, Zalando | 8 |
| `collection-sorting` | Collection Resources | **Sorting a collection** | Google, Haufe, Microsoft, PayPal, Zalando | 6 |
| `data-format` | Data | **Data format** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Google, Haufe, Heroku, Microsoft, Red Hat, Zalando, adidas | 26 |
| `data-format-date-time` | Data | **Date and Time** | Cisco, Google, Haufe, Heroku, Microsoft, Zalando, adidas | 16 |
| `data-format-null` | Data | **Null data** | Cisco, Zalando | 5 |
| `data-internationalization` | Data | **Internationalization** | Deliveroo, adidas | 3 |
| `data-standards` | Data | **Standards data** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Haufe, Zalando, adidas | 6 |
| `errors` | Error handling | **Errors** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Deliveroo, Haufe, Microsoft, adidas | 10 |
| `http-status-standard-error` | Error handling | **Error format** | Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Haufe, Heroku, Microsoft, White House, Zalando, adidas | 11 |
| `http-methods` | HTTP Methods | **HTTP methods** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, White House, Zalando, adidas | 19 |
| `http-methods-alternative` | HTTP Methods | **Forbidden methods alternatives** | Cisco, adidas | 2 |
| `http-methods-delete` | HTTP Methods | **DELETE** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, White House, Zalando | 19 |
| `http-methods-get` | HTTP Methods | **GET** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, White House, Zalando | 21 |
| `http-methods-head` | HTTP Methods | **HEAD** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Cisco, Deliveroo, Microsoft, Red Hat, Zalando | 8 |
| `http-methods-options` | HTTP Methods | **OPTIONS** | Cisco, Microsoft, Red Hat, Zalando | 5 |
| `http-methods-patch` | HTTP Methods | **PATCH** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, Zalando | 18 |
| `http-methods-post` | HTTP Methods | **POST** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, White House, Zalando, adidas | 25 |
| `http-methods-put` | HTTP Methods | **PUT** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cisco, Cloud Foundry, Google, Haufe, Microsoft, PayPal, Red Hat, White House, Zalando | 21 |
| `http` | HTTP Protocol | **HTTP protocol** | Deliveroo, Microsoft, Zalando, adidas | 4 |
| `http-caching` | HTTP Protocol | **Caching** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Deliveroo, Google, Haufe, Heroku, Microsoft, PayPal, Zalando, adidas | 17 |
| `http-content-negotiation` | HTTP Protocol | **Content negociation and media types** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Cisco, Deliveroo, Google, Microsoft, Red Hat, White House, Zalando, adidas | 19 |
| `http-headers` | HTTP Protocol | **HTTP Headers** | Atlassian, Cisco, Deliveroo, Haufe, Heroku, Microsoft, Red Hat, White House, Zalando, adidas | 36 |
| `http-status` | HTTP Protocol | **HTTP Statuses** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Cloud Foundry, Haufe, Heroku, Microsoft, PayPal, White House, Zalando, adidas | 22 |
| `http-status-300` | HTTP Status Redirection | **300 Multiple Choices** | Deliveroo | 1 |
| `http-status-301` | HTTP Status Redirection | **301 Moved Permanently** | Atlassian, Deliveroo, Zalando | 3 |
| `http-status-302` | HTTP Status Redirection | **302 Found** | Cloud Foundry, Deliveroo, Zalando | 3 |
| `http-status-303` | HTTP Status Redirection | **303 See Other** | Cloud Foundry, Zalando, adidas | 3 |
| `http-status-304` | HTTP Status Redirection | **304 Not Modified** | Atlassian, Deliveroo, Haufe, Zalando | 4 |
| `http-status-307` | HTTP Status Redirection | **307 Temporary Redirect** | Deliveroo | 1 |
| `http-status-308` | HTTP Status Redirection | **308 Permanent Redirect** | Deliveroo | 1 |
| `http-status-500` | HTTP Status Server Error | **500 Internal Server Error** | Cloud Foundry, Haufe, Heroku, White House, Zalando | 5 |
| `http-status-501` | HTTP Status Server Error | **501 Not Implemented** | Haufe, Zalando | 2 |
| `http-status-503` | HTTP Status Server Error | **503 Service Unavailable** | Cloud Foundry, Zalando | 2 |
| `http-status-200` | HTTP Status Success | **200 OK** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cloud Foundry, Deliveroo, Haufe, Heroku, PayPal, White House, Zalando, adidas | 22 |
| `http-status-201` | HTTP Status Success | **201 Created** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cloud Foundry, Deliveroo, Haufe, Heroku, Zalando | 10 |
| `http-status-202` | HTTP Status Success | **202 Accepted** | Atlassian, Cloud Foundry, Deliveroo, Heroku, Zalando | 5 |
| `http-status-203` | HTTP Status Success | **203 Non-Authoritative Information** | Deliveroo | 1 |
| `http-status-204` | HTTP Status Success | **204 No Content** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cloud Foundry, Deliveroo, Haufe, PayPal, Zalando | 12 |
| `http-status-206` | HTTP Status Success | **206 Partial Content** | Deliveroo, Heroku | 2 |
| `http-status-400` | HTTP Status User Error | **400 Bad Request** | Cloud Foundry, Deliveroo, Haufe, PayPal, White House, Zalando, adidas | 13 |
| `http-status-401` | HTTP Status User Error | **401 Unauthorized** | Atlassian, Cloud Foundry, Haufe, Heroku, Zalando, adidas | 6 |
| `http-status-403` | HTTP Status User Error | **403 Forbidden** | Cloud Foundry, Haufe, Heroku, Zalando, adidas | 6 |
| `http-status-404` | HTTP Status User Error | **404 Not Found** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cloud Foundry, Deliveroo, Haufe, PayPal, Zalando, adidas | 18 |
| `http-status-405` | HTTP Status User Error | **405 Method Not Allowed** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Haufe, Red Hat, Zalando, adidas | 6 |
| `http-status-406` | HTTP Status User Error | **406 Not Acceptable** | Deliveroo, Haufe, Zalando | 3 |
| `http-status-408` | HTTP Status User Error | **408 Request Timeout** | Haufe, Zalando | 2 |
| `http-status-409` | HTTP Status User Error | **409 Conflict** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Deliveroo, Haufe, Zalando | 4 |
| `http-status-410` | HTTP Status User Error | **410 Gone** | Deliveroo, Haufe | 4 |
| `http-status-411` | HTTP Status User Error | **411 Length Required** | Haufe | 1 |
| `http-status-412` | HTTP Status User Error | **412 Precondition Failed** | Atlassian, Deliveroo, Haufe, Zalando | 8 |
| `http-status-415` | HTTP Status User Error | **415 Unsupported Media Type** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Deliveroo, Haufe, Zalando | 6 |
| `http-status-422` | HTTP Status User Error | **422 Unprocessable Entity** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cloud Foundry, Haufe, Heroku, PayPal | 7 |
| `http-status-423` | HTTP Status User Error | **423 Locked** | Zalando | 1 |
| `http-status-428` | HTTP Status User Error | **428 Precondition Required** | Deliveroo, Zalando | 2 |
| `http-status-429` | HTTP Status User Error | **429 Too Many Requests** | Deliveroo, Heroku, Zalando, adidas | 5 |
| `hypermedia` | Hypermedia | **Hypermedia** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Haufe, PayPal, Red Hat, Zalando, adidas | 28 |
| `hypermedia-read` | Hypermedia | **Hypermedia (read)** | Atlassian, Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Haufe, Microsoft, PayPal, Red Hat, Zalando | 23 |
| `hypermedia-write` | Hypermedia | **Hypermedia (write)** | Atlassian, Australian Digital Transformation Office, Cloud Foundry, Red Hat | 4 |
| `api-chaining` | Miscellaneous | **API chaining** | Cisco | 1 |
| `cors` | Miscellaneous | **CORS** | Australian Digital Transformation Office, Microsoft, White House, adidas | 4 |
| `debug-diagnose` | Miscellaneous | **Debug and diagnose** | Heroku | 1 |
| `developer-experience` | Miscellaneous | **Developer experience** | Atlassian, Australian Digital Transformation Office, Google, Haufe, Microsoft | 8 |
| `documentation` | Miscellaneous | **Documentation** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Australian Digital Transformation Office, Cisco, Deliveroo, Google, Haufe, Heroku, Microsoft, Red Hat, Zalando, adidas | 21 |
| `guiding-input` | Miscellaneous | **Guiding inputs** | Google, Red Hat | 5 |
| `performance` | Miscellaneous | **Performance and bandwidth** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Deliveroo, Heroku, PayPal, Zalando | 6 |
| `query-parameter` | Miscellaneous | **Query parameters** | Cloud Foundry, Deliveroo, PayPal, Zalando | 5 |
| `rate-limiting` | Miscellaneous | **Rate limiting** | Atlassian, Deliveroo, Heroku, adidas | 4 |
| `undo` | Miscellaneous | **Undo** | Cisco, Google | 3 |
| `naming` | Naming | **Naming** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, PayPal, White House, Zalando, adidas | 23 |
| `naming-case` | Naming | **Case** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cisco, Cloud Foundry, Google, Heroku, Zalando, adidas | 11 |
| `naming-language` | Naming | **Language** | Google, Zalando | 3 |
| `resource` | Resources | **Resource** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, PayPal, Red Hat, Zalando | 21 |
| `resource-action` | Resources | **Action resource** | Cisco, Cloud Foundry, Google, Heroku, Microsoft, PayPal, Red Hat, Zalando | 15 |
| `resource-change-tracking` | Resources | **Track change** | Deliveroo, Microsoft | 2 |
| `resource-creation` | Resources | **Create resource** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, Microsoft, PayPal, Red Hat, White House, Zalando | 14 |
| `resource-creation-with-id` | Resources | **Create resource with a specific ID** | Cisco, Google, Haufe, Microsoft, PayPal | 5 |
| `resource-deletion` | Resources | **Delete resource** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, PayPal, Red Hat, White House, Zalando | 13 |
| `resource-id` | Resources | **Resource ID** | Cloud Foundry, Deliveroo, Google, Haufe, Heroku, Microsoft, Red Hat | 8 |
| `resource-id-semantic` | Resources | **ID with semantic** | Cisco, Heroku, Microsoft | 3 |
| `resource-multiple` | Resources | **Batch Bulk** | Cisco, Google, Microsoft, PayPal, White House, adidas | 7 |
| `resource-relationships` | Resources | **Relationships** | Australian Digital Transformation Office, Cloud Foundry, Deliveroo, Haufe, Heroku, Red Hat, Zalando, adidas | 12 |
| `resource-replacement` | Resources | **Replace resource** | Cisco, Google, Haufe, PayPal, Zalando | 5 |
| `resource-retrieve` | Resources | **Retrieve resource** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, PayPal, Red Hat, White House, Zalando | 13 |
| `resource-retrieve-dereference` | Resources | **Dereference Relationships** | Atlassian, Cisco, Cloud Foundry, Deliveroo, Zalando, adidas | 12 |
| `resource-retrieve-partial` | Resources | **Retrieve resource partially** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, Zalando, adidas | 14 |
| `resource-state` | Resources | **Resource's state** | Google, Haufe, PayPal | 3 |
| `resource-update` | Resources | **Update resource** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, Microsoft, PayPal, Red Hat, White House, Zalando | 20 |
| `resource-update-partial` | Resources | **Update resource partially** | Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Microsoft, PayPal, Red Hat, Zalando | 11 |
| `resource-url-format` | Resources | **URL format** | Atlassian, Australian Digital Transformation Office, Cisco, Cloud Foundry, Deliveroo, Google, Haufe, Heroku, Microsoft, PayPal, Red Hat, White House, Zalando, adidas | 30 |
| `security` | Security | **Security** | Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration), Atlassian, Australian Digital Transformation Office, Cisco, Deliveroo, Haufe, Heroku, Microsoft, Zalando, adidas | 25 |
| `security-data` | Security | **Data privacy** | Australian Digital Transformation Office, Haufe, Microsoft | 3 |

---

## 3. Guideline Profiles & Topic Index

### `adidas-api-design-guidelines` - adidas: adidas API design guidelines
* **Primary URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Total Topics Covered**: 41
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `api-counts` | API counts | Minimal API surface | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/minimal-api-surface.html) |
| `asynchronicity` | Asynchronicity | Asynchronous Tasks | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) |
| `collection-filtering` | Filtering | Search Requests | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/search-requests.html) |
| `collection-pagination` | Pagination | Pagination | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/pagination.html) |
| `cors` | CORS | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `data-format` | Data format | Corporate Data Model | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/application/harmonize-data.html) |
| `data-format-date-time` | Date and Time | Common Data Types | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) |
| `data-internationalization` | Internationalization | Common Data Types | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) |
| `data-internationalization` | Internationalization | Localization | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/localization.html) |
| `data-standards` | Standards data | Common Data Types | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) |
| `documentation` | Documentation | OpenAPI Specification | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html) |
| `documentation` | Documentation | API Design Platform - Apiary | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html) |
| `errors` | Errors | Problem Detail | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/error-reporting.html) |
| `errors` | Errors | Error Response Format | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html) |
| `global-design` | Global design | Core principles | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/) |
| `global-design` | Global design | API First | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/api-first.html) |
| `global-design` | Global design | Contract | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/contract.html) |
| `global-design` | Global design | Design Maturity | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/design-maturity.html) |
| `global-design` | Global design | Robustness | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/robustness.html) |
| `global-design` | Global design | Loose Coupling | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/clients/loose-coupling.html) |
| `governance` | Governance | Version Control System | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/version-control-system.html) |
| `governance` | Governance | OpenAPI Specification | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html) |
| `governance` | Governance | API Design Platform - Apiary | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html) |
| `governance` | Governance | Testing | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/testing.html) |
| `governance` | Governance | Rules For Extending | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html) |
| `http` | HTTP protocol | HTTP | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/http.html) |
| `http-caching` | Caching | Caching | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/caching.html) |
| `http-content-negotiation` | Content negociation and media types | Content Negociation | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/content-negotiation.html) |
| `http-headers` | HTTP Headers | Naming Conventions | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) |
| `http-methods` | HTTP methods | Request Methods | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-methods.html) |
| `http-methods-alternative` | Forbidden methods alternatives | Query Requests with Large Inputs | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html) |
| `http-methods-post` | POST | Query Requests with Large Inputs | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html) |
| `http-status` | HTTP Statuses | Status Codes | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-status-codes.html) |
| `http-status` | HTTP Statuses | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-200` | 200 OK | Asynchronous Tasks | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) |
| `http-status-200` | 200 OK | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-303` | 303 See Other | Asynchronous Tasks | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) |
| `http-status-400` | 400 Bad Request | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-401` | 401 Unauthorized | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-403` | 403 Forbidden | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-404` | 404 Not Found | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-405` | 405 Method Not Allowed | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-429` | 429 Too Many Requests | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `http-status-standard-error` | Error format | Error Response Format | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html) |
| `hypermedia` | Hypermedia | HAL | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/hal.html) |
| `hypermedia` | Hypermedia | Foreign Key Relations | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html) |
| `naming` | Naming | Naming Conventions | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) |
| `naming` | Naming | Reserved Identifiers | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/reserved-identifiers.html) |
| `naming-case` | Case | Naming Conventions | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) |
| `naming-case` | Case | JSON | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/json.html) |
| `rate-limiting` | Rate limiting | Rate Limiting | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/rate-limiting.html) |
| `resource-multiple` | Batch Bulk | None | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/batch-operations.html) |
| `resource-relationships` | Relationships | Foreign Key Relations | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html) |
| `resource-retrieve-dereference` | Dereference Relationships | Choosing Fields & Embedded Resources | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html) |
| `resource-retrieve-partial` | Retrieve resource partially | Choosing Fields & Embedded Resources | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html) |
| `resource-url-format` | URL format | URI structure | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/uri-structure.html) |
| `resource-url-format` | URL format | Changes and Versioning | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html) |
| `security` | Security | TLS | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/tls.html) |
| `security` | Security | Security | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) |
| `versioning` | Updates and Versioning | Changes and Versioning | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html) |
| `versioning` | Updates and Versioning | Rules For Extending | [Link](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html) |

### `atlassian-rest-api-design-guidelines-version-1` - Atlassian: Atlassian REST API Design Guidelines version 1
* **Primary URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Total Topics Covered**: 28
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection` | Collection | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `collection` | Collection | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `collection-pagination` | Pagination | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `data-format` | Data format | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `data-format` | Data format | Appendix B: Basic Data Types | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixB:BasicDataTypes) |
| `governance` | Governance | Using these Guidelines | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-UsingtheseGuidelines) |
| `governance` | Governance | Version Control for APIs | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs) |
| `http-caching` | Caching | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `http-caching` | Caching | Caching | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching) |
| `http-headers` | HTTP Headers | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `http-headers` | HTTP Headers | Caching | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching) |
| `http-methods-delete` | DELETE | Concurrency | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| `http-methods-put` | PUT | Concurrency | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| `http-status` | HTTP Statuses | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-200` | 200 OK | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-201` | 201 Created | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-202` | 202 Accepted | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-204` | 204 No Content | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-301` | 301 Moved Permanently | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-304` | 304 Not Modified | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-401` | 401 Unauthorized | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-404` | 404 Not Found | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `http-status-412` | 412 Precondition Failed | Concurrency | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| `http-status-412` | 412 Precondition Failed | Appendix A: Response Codes | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) |
| `hypermedia` | Hypermedia | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `hypermedia-read` | Hypermedia (read) | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `hypermedia-write` | Hypermedia (write) | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `resource` | Resource | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `resource-deletion` | Delete resource | Concurrency | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| `resource-retrieve-dereference` | Dereference Relationships | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `resource-retrieve-dereference` | Dereference Relationships | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `resource-update` | Update resource | Concurrency | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) |
| `resource-url-format` | URL format | REST Resources | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) |
| `security` | Security | Security | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Security) |
| `versioning` | Updates and Versioning | Version Control for APIs | [Link](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs) |

### `atlassian-rest-api-policy` - Atlassian: Atlassian REST API Policy
* **Primary URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Total Topics Covered**: 8
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection-pagination` | Pagination | Resource/rate limits and paging | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging) |
| `data-format` | Data format | Compatibility policy | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) |
| `data-format` | Data format | Structured representations (application/json) | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json)) |
| `data-format` | Data format | Forward compatibility | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Forwardcompatibility) |
| `developer-experience` | Developer experience | Deprecation policy | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy) |
| `governance` | Governance | Compatibility policy | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) |
| `governance` | Governance | Deprecation policy | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy) |
| `http-headers` | HTTP Headers | Detectability (Deprecation Policy) | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Detectability) |
| `rate-limiting` | Rate limiting | Resource/rate limits and paging | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging) |
| `resource-url-format` | URL format | Stable URIs | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-StableURIs) |
| `versioning` | Updates and Versioning | Compatibility policy | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) |
| `versioning` | Updates and Versioning | Backwards compatibility | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Backwardscompatibility) |
| `versioning` | Updates and Versioning | Structured representations (application/json) | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json)) |
| `versioning` | Updates and Versioning | API versioning | [Link](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-APIversioning) |

### `ausdto-api-design-guide` - Australian Digital Transformation Office: API Design Guide
* **Primary URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Total Topics Covered**: 26
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection-pagination` | Pagination | Batching results | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/batching_results.html) |
| `cors` | CORS | Support cross-domain mashups with CORS | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/cors.html) |
| `developer-experience` | Developer experience | Empathy | [Link](https://apiguide.readthedocs.io/en/latest/principles/empathy.html) |
| `developer-experience` | Developer experience | Errors | [Link](https://apiguide.readthedocs.io/en/latest/principles/errors.html) |
| `developer-experience` | Developer experience | Endpoint Stability | [Link](https://apiguide.readthedocs.io/en/latest/principles/availability.html) |
| `documentation` | Documentation | Discoverability | [Link](https://apiguide.readthedocs.io/en/latest/principles/discoverability.html) |
| `documentation` | Documentation | Document your API | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/documentation.html) |
| `global-design` | Global design | Granularity | [Link](https://apiguide.readthedocs.io/en/latest/principles/granularity.html) |
| `global-design` | Global design | Functionality | [Link](https://apiguide.readthedocs.io/en/latest/principles/coverage.html) |
| `governance` | Governance | Register your API | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/advertise.html) |
| `http-content-negotiation` | Content negociation and media types | Formats | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#formats) |
| `http-content-negotiation` | Content negociation and media types | API Payload format encoding | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#api-payload-format-encoding) |
| `http-methods` | HTTP methods | Use HTTP methods and status codes | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) |
| `http-methods-delete` | DELETE | DELETE /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines) |
| `http-methods-delete` | DELETE | DELETE /magazines/1234 | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines-1234) |
| `http-methods-get` | GET | GET /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) |
| `http-methods-head` | HEAD | HEAD /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines) |
| `http-methods-head` | HEAD | HEAD /magazines/1234 | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines-1234) |
| `http-methods-post` | POST | POST /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#post--magazines) |
| `http-methods-put` | PUT | PUT /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines) |
| `http-methods-put` | PUT | PUT /magazines/1234 | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines-1234) |
| `http-status-200` | 200 OK | GET /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) |
| `http-status-200` | 200 OK | PUT /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines) |
| `http-status-200` | 200 OK | DELETE /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines) |
| `http-status-200` | 200 OK | DELETE /magazines/1234 | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines-1234) |
| `http-status-200` | 200 OK | HEAD /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines) |
| `http-status-200` | 200 OK | HEAD /magazines/1234 | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines-1234) |
| `http-status-201` | 201 Created | Use HTTP methods and status codes | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) |
| `http-status-201` | 201 Created | PUT /magazines/1234 | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines-1234) |
| `http-status-404` | 404 Not Found | GET /magazines | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) |
| `http-status-405` | 405 Method Not Allowed | Use HTTP methods and status codes | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) |
| `http-status-standard-error` | Error format | HTTP response principles | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#http-response-principles) |
| `hypermedia` | Hypermedia | Management state with HATEOAS | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| `hypermedia-read` | Hypermedia (read) | Management state with HATEOAS | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| `hypermedia-write` | Hypermedia (write) | Management state with HATEOAS | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| `resource-relationships` | Relationships | Management state with HATEOAS | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) |
| `resource-url-format` | URL format | URL Depth | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#url-depth) |
| `resource-url-format` | URL format | Good RESTful URL examples | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#good-restful-url-examples) |
| `security` | Security | Privacy and security | [Link](https://apiguide.readthedocs.io/en/latest/principles/security.html) |
| `security-data` | Data privacy | Privacy and security | [Link](https://apiguide.readthedocs.io/en/latest/principles/security.html) |
| `versioning` | Updates and Versioning | Versioning | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#versioning) |
| `versioning` | Updates and Versioning | Use versions | [Link](https://apiguide.readthedocs.io/en/latest/build_and_publish/versioning.html) |

### `cisco-api-design-guide` - Cisco: API Design Guide
* **Primary URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Total Topics Covered**: 43
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `api-chaining` | API chaining | 3.5.2 TrackingID Header | [Link](https://github.com/CiscoDevNet/api-design-guide#352-trackingid-header) |
| `collection` | Collection | 3.6.3 GET | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `collection-filtering` | Filtering | 3.6.3 GET | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `collection-pagination` | Pagination | 3.6.3 GET | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `data-format` | Data format | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `data-format-date-time` | Date and Time | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `data-format-null` | Null data | JSON Attributes | [Link](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#json-attributes) |
| `documentation` | Documentation | 3.9 Status Codes | [Link](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) |
| `documentation` | Documentation | API Documentation | [Link](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#api-documentation) |
| `http-caching` | Caching | 3.5.1 Standard Headers | [Link](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) |
| `http-content-negotiation` | Content negociation and media types | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `http-content-negotiation` | Content negociation and media types | 3.5.1 Standard Headers | [Link](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) |
| `http-headers` | HTTP Headers | 3.5 HTTP Headers | [Link](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) |
| `http-headers` | HTTP Headers | 3.6.1 POST | [Link](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| `http-methods` | HTTP methods | 3.6 HTTP Verbs | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `http-methods` | HTTP methods | REST Methods | [Link](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#rest-methods) |
| `http-methods-alternative` | Forbidden methods alternatives | 3.7 Alternative Forms | [Link](https://github.com/CiscoDevNet/api-design-guide#37-alternative-forms) |
| `http-methods-delete` | DELETE | 3.6.4 DELETE | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `http-methods-get` | GET | 3.6.3 GET | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `http-methods-head` | HEAD | 3.6.6 HEAD | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `http-methods-options` | OPTIONS | 3.6.7 OPTIONS | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `http-methods-patch` | PATCH | 3.6.5 PATCH | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `http-methods-post` | POST | 3.6.1 POST | [Link](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| `http-methods-put` | PUT | 3.6.2 PUT | [Link](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| `http-status` | HTTP Statuses | 3.9 Status Codes | [Link](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) |
| `http-status-standard-error` | Error format | 3.9 Status Codes | [Link](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) |
| `hypermedia` | Hypermedia | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `hypermedia-read` | Hypermedia (read) | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `naming` | Naming | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `naming-case` | Case | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `naming-case` | Case | URL Paths | [Link](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths) |
| `resource` | Resource | 3 Guidelines | [Link](https://github.com/CiscoDevNet/api-design-guide#3-guidelines) |
| `resource` | Resource | 3.3 Representations | [Link](https://github.com/CiscoDevNet/api-design-guide#33-representations) |
| `resource-action` | Action resource | 3.8 Action Resources | [Link](https://github.com/CiscoDevNet/api-design-guide#38-action-resources) |
| `resource-action` | Action resource | 3.6.1 POST | [Link](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| `resource-creation` | Create resource | 3.6.1 POST | [Link](https://github.com/CiscoDevNet/api-design-guide#361-post) |
| `resource-creation-with-id` | Create resource with a specific ID | 3.6.2 PUT | [Link](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| `resource-deletion` | Delete resource | 3.6.4 DELETE | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `resource-id-semantic` | ID with semantic | 3.4.2 User Scoped Endpoints | [Link](https://github.com/CiscoDevNet/api-design-guide#342-user-scoped-endpoints) |
| `resource-multiple` | Batch Bulk | 3.11 Bulk, Batch, and Multi-Result Operations | [Link](https://github.com/CiscoDevNet/api-design-guide#311-bulk-batch-and-multi-result-operations) |
| `resource-replacement` | Replace resource | 3.6.2 PUT | [Link](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| `resource-retrieve` | Retrieve resource | 3.6.3 GET | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `resource-retrieve-dereference` | Dereference Relationships | 3.6.3 GET | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `resource-retrieve-partial` | Retrieve resource partially | 3.6.3.6 Services MAY support partial retrieval of resource state | [Link](https://github.com/CiscoDevNet/api-design-guide#363-get) |
| `resource-update` | Update resource | 3.6.2 PUT | [Link](https://github.com/CiscoDevNet/api-design-guide#362-put) |
| `resource-update` | Update resource | 3.6.5 PATCH | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `resource-update-partial` | Update resource partially | 3.6.5 PATCH | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `resource-url-format` | URL format | 3.4 URL Format | [Link](https://github.com/CiscoDevNet/api-design-guide#34-url-format) |
| `resource-url-format` | URL format | URL Paths | [Link](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths) |
| `security` | Security | 3.1 Security | [Link](https://github.com/CiscoDevNet/api-design-guide#31-security) |
| `security` | Security | 3.2 Authentication and Representation | [Link](https://github.com/CiscoDevNet/api-design-guide#32-authentication-and-authorization) |
| `security` | Security | 3.6.8 Safe and Non-Safe Methods | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `undo` | Undo | 3.6 HTTP Verbs | [Link](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) |
| `versioning` | Updates and Versioning | 3.13 Versioning | [Link](https://github.com/CiscoDevNet/api-design-guide#313-versioning) |

### `cloud-foundy-cloud-controller-api-style-guide` - Cloud Foundry: Cloud Controller API v3 Style Guide (Proposal)
* **Primary URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Total Topics Covered**: 44
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `asynchronicity` | Asynchronicity | Asynchronicity | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#asynchronicity) |
| `collection` | Collection | Collections | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#collections) |
| `collection-filtering` | Filtering | Filtering | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#filtering) |
| `collection-pagination` | Pagination | Pagination | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination) |
| `collection-pagination` | Pagination | Pagination of Related Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination-of-related-resources) |
| `collection-retrieve` | Retrieve a collection | GET | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) |
| `http-methods` | HTTP methods | Requests | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#requests) |
| `http-methods-delete` | DELETE | DELETE | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#delete) |
| `http-methods-get` | GET | GET | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) |
| `http-methods-patch` | PATCH | PATCH | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) |
| `http-methods-post` | POST | POST | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#post) |
| `http-methods-put` | PUT | PUT | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#put) |
| `http-status` | HTTP Statuses | Responses Codes | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#response-codes) |
| `http-status` | HTTP Statuses | GET responses (Resource) | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-resource) |
| `http-status` | HTTP Statuses | GET responses (Collection) | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-collection) |
| `http-status` | HTTP Statuses | POST responses | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses) |
| `http-status` | HTTP Statuses | PUT responses | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-1) |
| `http-status` | HTTP Statuses | PATCH responses | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-2) |
| `http-status` | HTTP Statuses | DELETE responses | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-3) |
| `http-status-200` | 200 OK | Successful Requests | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| `http-status-201` | 201 Created | Successful Requests | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| `http-status-202` | 202 Accepted | Successful Requests | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| `http-status-204` | 204 No Content | Successful Requests | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) |
| `http-status-302` | 302 Found | Redirections | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection) |
| `http-status-303` | 303 See Other | Redirections | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection) |
| `http-status-400` | 400 Bad Request | Client Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| `http-status-401` | 401 Unauthorized | Client Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| `http-status-403` | 403 Forbidden | Client Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| `http-status-404` | 404 Not Found | Client Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| `http-status-422` | 422 Unprocessable Entity | Client Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) |
| `http-status-500` | 500 Internal Server Error | Server Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors) |
| `http-status-503` | 503 Service Unavailable | Server Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors) |
| `http-status-standard-error` | Error format | Errors | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#errors) |
| `hypermedia` | Hypermedia | Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| `hypermedia` | Hypermedia | Links | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| `hypermedia` | Hypermedia | Includind Related Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources) |
| `hypermedia-read` | Hypermedia (read) | Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| `hypermedia-read` | Hypermedia (read) | Links | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| `hypermedia-write` | Hypermedia (write) | Links | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| `naming` | Naming | Query Parameters | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) |
| `naming` | Naming | Field Names | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names) |
| `naming` | Naming | URL Structure | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure) |
| `naming-case` | Case | Query Parameters | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) |
| `naming-case` | Case | Field Names | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names) |
| `query-parameter` | Query parameters | Query Parameters | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) |
| `resource` | Resource | Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| `resource-action` | Action resource | PUT | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#put) |
| `resource-action` | Action resource | Actions | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#actions) |
| `resource-creation` | Create resource | POST | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#post) |
| `resource-deletion` | Delete resource | DELETE | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#delete) |
| `resource-id` | Resource ID | Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) |
| `resource-relationships` | Relationships | Relationships | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#relationships) |
| `resource-relationships` | Relationships | Links | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) |
| `resource-retrieve` | Retrieve resource | GET | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) |
| `resource-retrieve-dereference` | Dereference Relationships | Includind Related Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources) |
| `resource-retrieve-partial` | Retrieve resource partially | Requesting Partiel Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#requesting-partial-resources) |
| `resource-retrieve-partial` | Retrieve resource partially | Nested Resources | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#nested-resources) |
| `resource-update` | Update resource | PATCH | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) |
| `resource-update-partial` | Update resource partially | PATCH | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) |
| `resource-url-format` | URL format | URL Structure | [Link](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure) |

### `deliveroo-api-design-guidelines` - Deliveroo: API Design
* **Primary URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Total Topics Covered**: 60
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `api-counts` | API counts | Fine-grained | [Link](http://deliveroo.engineering/guidelines/api-design/#fine-grained) |
| `collection` | Collection | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `collection-pagination` | Pagination | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `collection-pagination` | Pagination | Query parameters | [Link](http://deliveroo.engineering/guidelines/api-design/#query-parameters) |
| `collection-retrieve` | Retrieve a collection | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `data-internationalization` | Internationalization | Internationalisation (i18n) | [Link](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n) |
| `documentation` | Documentation | Documenting APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#documenting-apis) |
| `errors` | Errors | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `global-design` | Global design | General Principles | [Link](http://deliveroo.engineering/guidelines/api-design/#general-principles) |
| `global-design` | Global design | API and domain modelling | [Link](http://deliveroo.engineering/guidelines/api-design/#api-and-domain-modelling) |
| `global-design` | Global design | External-facing APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#external-facing) |
| `global-design` | Global design | Mobile-friendly APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis) |
| `global-design` | Global design | Public-friendly APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| `http` | HTTP protocol | Compression | [Link](http://deliveroo.engineering/guidelines/api-design/#compression) |
| `http-caching` | Caching | Resource lifecycle | [Link](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) |
| `http-caching` | Caching | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-caching` | Caching | Mutable resources | [Link](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) |
| `http-content-negotiation` | Content negociation and media types | Content type negotiation | [Link](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation) |
| `http-content-negotiation` | Content negociation and media types | Versioning | [Link](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| `http-headers` | HTTP Headers | Resource lifecycle | [Link](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) |
| `http-headers` | HTTP Headers | Versioning | [Link](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| `http-headers` | HTTP Headers | Versioning | [Link](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| `http-headers` | HTTP Headers | Internationalisation (i18n) | [Link](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n) |
| `http-headers` | HTTP Headers | Single-entity GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| `http-headers` | HTTP Headers | Compression | [Link](http://deliveroo.engineering/guidelines/api-design/#compression) |
| `http-methods` | HTTP methods | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-methods-delete` | DELETE | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-methods-delete` | DELETE | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `http-methods-get` | GET | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-methods-get` | GET | Single-entity GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| `http-methods-get` | GET | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `http-methods-head` | HEAD | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-methods-patch` | PATCH | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-methods-patch` | PATCH | PATCH, mutating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| `http-methods-patch` | PATCH | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-methods-patch` | PATCH | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-methods-post` | POST | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-methods-post` | POST | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-methods-post` | POST | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-200` | 200 OK | PATCH, mutating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| `http-status-200` | 200 OK | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-200` | 200 OK | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-201` | 201 Created | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-201` | 201 Created | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-202` | 202 Accepted | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-203` | 203 Non-Authoritative Information | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-204` | 204 No Content | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `http-status-206` | 206 Partial Content | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-300` | 300 Multiple Choices | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-301` | 301 Moved Permanently | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-302` | 302 Found | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-304` | 304 Not Modified | Resource lifecycle | [Link](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) |
| `http-status-307` | 307 Temporary Redirect | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-308` | 308 Permanent Redirect | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-400` | 400 Bad Request | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-400` | 400 Bad Request | PATCH, mutating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| `http-status-400` | 400 Bad Request | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-400` | 400 Bad Request | Parameters | [Link](http://deliveroo.engineering/guidelines/api-design/#parameters) |
| `http-status-404` | 404 Not Found | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-status-404` | 404 Not Found | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `http-status-404` | 404 Not Found | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-404` | 404 Not Found | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-406` | 406 Not Acceptable | Versioning | [Link](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| `http-status-409` | 409 Conflict | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-410` | 410 Gone | RESTful | [Link](http://deliveroo.engineering/guidelines/api-design/#restful) |
| `http-status-410` | 410 Gone | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `http-status-410` | 410 Gone | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `http-status-412` | 412 Precondition Failed | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-412` | 412 Precondition Failed | PATCH, mutating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| `http-status-412` | 412 Precondition Failed | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `http-status-412` | 412 Precondition Failed | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `http-status-415` | 415 Unsupported Media Type | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-415` | 415 Unsupported Media Type | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-415` | 415 Unsupported Media Type | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `http-status-428` | 428 Precondition Required | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-429` | 429 Too Many Requests | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `http-status-standard-error` | Error format | Return codes and errors | [Link](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) |
| `hypermedia` | Hypermedia | Hypermedia / HATEOAS | [Link](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) |
| `hypermedia` | Hypermedia | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `hypermedia` | Hypermedia | Public-friendly APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| `hypermedia-read` | Hypermedia (read) | Hypermedia / HATEOAS | [Link](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) |
| `hypermedia-read` | Hypermedia (read) | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `hypermedia-read` | Hypermedia (read) | Public-friendly APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |
| `naming` | Naming | Naming | [Link](http://deliveroo.engineering/guidelines/api-design/#naming) |
| `performance` | Performance and bandwidth | Compression | [Link](http://deliveroo.engineering/guidelines/api-design/#compression) |
| `performance` | Performance and bandwidth | Mobile-friendly APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis) |
| `query-parameter` | Query parameters | Parameters | [Link](http://deliveroo.engineering/guidelines/api-design/#parameters) |
| `rate-limiting` | Rate limiting | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `resource` | Resource | Listing intrinsic properties | [Link](http://deliveroo.engineering/guidelines/api-design/#listing-intrinsic-properties) |
| `resource` | Resource | Normalising concepts | [Link](http://deliveroo.engineering/guidelines/api-design/#normalising-concepts) |
| `resource` | Resource | Single-resource representation | [Link](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation) |
| `resource-change-tracking` | Track change | Single-entity GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| `resource-creation` | Create resource | POST, creating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) |
| `resource-deletion` | Delete resource | DELETE, destroying entities | [Link](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) |
| `resource-id` | Resource ID | Single-resource representation | [Link](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation) |
| `resource-relationships` | Relationships | None | [Link](http://deliveroo.engineering/guidelines/api-design/#listing-relations) |
| `resource-retrieve` | Retrieve resource | Single-entity GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| `resource-retrieve-dereference` | Dereference Relationships | Fine-grained | [Link](http://deliveroo.engineering/guidelines/api-design/#fine-grained) |
| `resource-retrieve-dereference` | Dereference Relationships | Conventions on responses | [Link](http://deliveroo.engineering/guidelines/api-design/#conventions-on-responses) |
| `resource-retrieve-dereference` | Dereference Relationships | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `resource-retrieve-partial` | Retrieve resource partially | Single-entity GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| `resource-update` | Update resource | PATCH, mutating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| `resource-update` | Update resource | Mutable resources | [Link](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) |
| `resource-update-partial` | Update resource partially | PATCH, mutating entities | [Link](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) |
| `resource-update-partial` | Update resource partially | Mutable resources | [Link](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) |
| `resource-url-format` | URL format | Path segments | [Link](http://deliveroo.engineering/guidelines/api-design/#path-segments) |
| `resource-url-format` | URL format | Single-entity GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) |
| `resource-url-format` | URL format | Collection GET endpoints | [Link](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) |
| `security` | Security | None | [Link](http://deliveroo.engineering/guidelines/api-design/#security) |
| `security` | Security | Caching | [Link](http://deliveroo.engineering/guidelines/api-design/#caching) |
| `versioning` | Updates and Versioning | Content type negotiation | [Link](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation) |
| `versioning` | Updates and Versioning | Versioning | [Link](http://deliveroo.engineering/guidelines/api-design/#versioning) |
| `versioning` | Updates and Versioning | Public-friendly APIs | [Link](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) |

### `google-api-design-guide` - Google: Google API Design Guide
* **Primary URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Total Topics Covered**: 39
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `asynchronicity` | Asynchronicity | Delete | [Link](https://cloud.google.com/apis/design/standard_methods#delete) |
| `asynchronicity` | Asynchronicity | Common Custom Methods | [Link](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| `asynchronicity` | Asynchronicity | Long Running Operation | [Link](https://cloud.google.com/apis/design/design_patterns#long_running_operations) |
| `collection` | Collection | Resources | [Link](https://cloud.google.com/apis/design/resources#resources) |
| `collection` | Collection | Methods | [Link](https://cloud.google.com/apis/design/resources#methods) |
| `collection` | Collection | Resources examples | [Link](https://cloud.google.com/apis/design/resources#examples) |
| `collection` | Collection | Collection ID | [Link](https://cloud.google.com/apis/design/resource_names#collection_id) |
| `collection-filtering` | Filtering | List filter field | [Link](https://cloud.google.com/apis/design/naming_convention#list_filter_field) |
| `collection-filtering` | Filtering | Common Custom Methods | [Link](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| `collection-filtering` | Filtering | List Sub-Collections | [Link](https://cloud.google.com/apis/design/design_patterns#list_sub-collections) |
| `collection-filtering` | Filtering | Get Unique Resource From Sub-Collection | [Link](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection) |
| `collection-pagination` | Pagination | List Pagination | [Link](https://cloud.google.com/apis/design/design_patterns#list_pagination) |
| `collection-retrieve` | Retrieve a collection | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `collection-retrieve` | Retrieve a collection | List | [Link](https://cloud.google.com/apis/design/standard_methods#list) |
| `collection-sorting` | Sorting a collection | Sorting Order | [Link](https://cloud.google.com/apis/design/design_patterns#sorting_order) |
| `data-format` | Data format | Grammar Syntax | [Link](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| `data-format` | Data format | Integer Types | [Link](https://cloud.google.com/apis/design/design_patterns#integer_types) |
| `data-format-date-time` | Date and Time | Time and Duration | [Link](https://cloud.google.com/apis/design/naming_convention#time_and_duration) |
| `data-format-date-time` | Date and Time | Date and Time of the Day | [Link](https://cloud.google.com/apis/design/naming_convention#date_and_time_of_day) |
| `developer-experience` | Developer experience | Grammar Syntax | [Link](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| `documentation` | Documentation | Grammar Syntax | [Link](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| `documentation` | Documentation | Output Fields | [Link](https://cloud.google.com/apis/design/design_patterns#output_fields) |
| `documentation` | Documentation | Documentation | [Link](https://cloud.google.com/apis/design/documentation) |
| `documentation` | Documentation | Checklist for all descriptions | [Link](https://cloud.google.com/apis/design/documentation#checklist_for_all_descriptions) |
| `global-design` | Global design | Resource Oriented Design | [Link](https://cloud.google.com/apis/design/resources) |
| `global-design` | Global design | What is a REST API? | [Link](https://cloud.google.com/apis/design/resources#what_is_a_rest_api) |
| `global-design` | Global design | Design flow | [Link](https://cloud.google.com/apis/design/resources#design_flow) |
| `global-design` | Global design | Design Patterns | [Link](https://cloud.google.com/apis/design/design_patterns) |
| `guiding-input` | Guiding inputs | Request Validation | [Link](https://cloud.google.com/apis/design/design_patterns#request_validation) |
| `guiding-input` | Guiding inputs | Request Duplication | [Link](https://cloud.google.com/apis/design/design_patterns#request_duplication) |
| `guiding-input` | Guiding inputs | Grammar Syntax | [Link](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) |
| `guiding-input` | Guiding inputs | Output Fields | [Link](https://cloud.google.com/apis/design/design_patterns#output_fields) |
| `http-caching` | Caching | ETags | [Link](https://cloud.google.com/apis/design/design_patterns#etags) |
| `http-content-negotiation` | Content negociation and media types | Protocol Buffers v3 | [Link](https://cloud.google.com/apis/design/proto3) |
| `http-methods` | HTTP methods | Resource Oriented Design | [Link](https://cloud.google.com/apis/design/resources) |
| `http-methods` | HTTP methods | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `http-methods` | HTTP methods | HTTP Verbs | [Link](https://cloud.google.com/apis/design/http_verbs) |
| `http-methods-delete` | DELETE | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `http-methods-delete` | DELETE | Delete | [Link](https://cloud.google.com/apis/design/standard_methods#delete) |
| `http-methods-get` | GET | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `http-methods-get` | GET | List | [Link](https://cloud.google.com/apis/design/standard_methods#list) |
| `http-methods-get` | GET | Get | [Link](https://cloud.google.com/apis/design/standard_methods#get) |
| `http-methods-patch` | PATCH | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `http-methods-patch` | PATCH | Update | [Link](https://cloud.google.com/apis/design/standard_methods#update) |
| `http-methods-post` | POST | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `http-methods-post` | POST | Create | [Link](https://cloud.google.com/apis/design/standard_methods#create) |
| `http-methods-put` | PUT | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `http-methods-put` | PUT | Update | [Link](https://cloud.google.com/apis/design/standard_methods#update) |
| `naming` | Naming | Collection ID | [Link](https://cloud.google.com/apis/design/resource_names#collection_id) |
| `naming` | Naming | Standard Fields | [Link](https://cloud.google.com/apis/design/standard_fields) |
| `naming` | Naming | Naming Conventions | [Link](https://cloud.google.com/apis/design/naming_convention) |
| `naming` | Naming | Representing Ranges | [Link](https://cloud.google.com/apis/design/design_patterns#representing_ranges) |
| `naming` | Naming | List Paginations | [Link](https://cloud.google.com/apis/design/design_patterns#list_pagination) |
| `naming-case` | Case | Collection ID | [Link](https://cloud.google.com/apis/design/resource_names#collection_id) |
| `naming-case` | Case | Camel Case | [Link](https://cloud.google.com/apis/design/naming_convention#camel_case) |
| `naming-language` | Language | Collection ID | [Link](https://cloud.google.com/apis/design/resource_names#collection_id) |
| `naming-language` | Language | Naming Conventions | [Link](https://cloud.google.com/apis/design/naming_convention) |
| `resource` | Resource | Resources | [Link](https://cloud.google.com/apis/design/resources#resources) |
| `resource` | Resource | Methods | [Link](https://cloud.google.com/apis/design/resources#methods) |
| `resource` | Resource | Resources examples | [Link](https://cloud.google.com/apis/design/resources#examples) |
| `resource` | Resource | Resource Labels | [Link](https://cloud.google.com/apis/design/design_patterns#resource_labels) |
| `resource-action` | Action resource | Custom Methods | [Link](https://cloud.google.com/apis/design/custom_methods) |
| `resource-creation` | Create resource | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `resource-creation` | Create resource | Create | [Link](https://cloud.google.com/apis/design/standard_methods#create) |
| `resource-creation-with-id` | Create resource with a specific ID | Update | [Link](https://cloud.google.com/apis/design/standard_methods#update) |
| `resource-deletion` | Delete resource | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `resource-deletion` | Delete resource | Delete | [Link](https://cloud.google.com/apis/design/standard_methods#delete) |
| `resource-id` | Resource ID | Resource ID | [Link](https://cloud.google.com/apis/design/resource_names#resource_id) |
| `resource-multiple` | Batch Bulk | Batch Get | [Link](https://cloud.google.com/apis/design/standard_methods#list) |
| `resource-multiple` | Batch Bulk | Common Custom Methods | [Link](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| `resource-replacement` | Replace resource | Update | [Link](https://cloud.google.com/apis/design/standard_methods#update) |
| `resource-retrieve` | Retrieve resource | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `resource-retrieve` | Retrieve resource | Get | [Link](https://cloud.google.com/apis/design/standard_methods#get) |
| `resource-retrieve` | Retrieve resource | Get Unique Resource From Sub-Collection | [Link](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection) |
| `resource-retrieve-partial` | Retrieve resource partially | Partial Response | [Link](https://cloud.google.com/apis/design/design_patterns#partial_response) |
| `resource-retrieve-partial` | Retrieve resource partially | Resource View | [Link](https://cloud.google.com/apis/design/design_patterns#resource_view) |
| `resource-state` | Resource's state | Use Cases | [Link](https://cloud.google.com/apis/design/custom_methods#use_cases) |
| `resource-update` | Update resource | Standard Methods | [Link](https://cloud.google.com/apis/design/standard_methods) |
| `resource-update` | Update resource | Update | [Link](https://cloud.google.com/apis/design/standard_methods#update) |
| `resource-update` | Update resource | Move | [Link](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| `resource-update-partial` | Update resource partially | Update | [Link](https://cloud.google.com/apis/design/standard_methods#update) |
| `resource-url-format` | URL format | Resource Names | [Link](https://cloud.google.com/apis/design/resource_names) |
| `resource-url-format` | URL format | Resource Name vs URL | [Link](https://cloud.google.com/apis/design/resource_names#resource_name_vs_url) |
| `undo` | Undo | Delete | [Link](https://cloud.google.com/apis/design/standard_methods#delete) |
| `undo` | Undo | Undelete | [Link](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) |
| `versioning` | Updates and Versioning | List Pagination | [Link](https://cloud.google.com/apis/design/design_patterns#list_pagination) |
| `versioning` | Updates and Versioning | Versioning | [Link](https://cloud.google.com/apis/design/versioning) |
| `versioning` | Updates and Versioning | Compatibility | [Link](https://cloud.google.com/apis/design/compatibility) |
| `versioning` | Updates and Versioning | Backwards-compatible (non-breaking) changes | [Link](https://cloud.google.com/apis/design/compatibility#backwards-compatible_non-breaking_changes) |
| `versioning` | Updates and Versioning | Backwards-incompatible (breaking) changes | [Link](https://cloud.google.com/apis/design/compatibility#backwards-incompatible_breaking_changes) |

### `haufe-api-styleguide` - Haufe: Haufe API style guide
* **Primary URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Total Topics Covered**: 61
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection` | Collection | Collection Resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md) |
| `collection-filtering` | Filtering | Filtering | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#filtering) |
| `collection-filtering` | Filtering | Time selection | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#time-selection) |
| `collection-filtering` | Filtering | Search | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md) |
| `collection-pagination` | Pagination | Paging | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#paging) |
| `collection-retrieve` | Retrieve a collection | Get List of resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources) |
| `collection-sorting` | Sorting a collection | Sorting | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#sorting) |
| `data-format` | Data format | Hypermedia Response Format | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md) |
| `data-format` | Data format | Type Formatting | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md) |
| `data-format` | Data format | Message Schema and Postel's Law | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) |
| `data-format-date-time` | Date and Time | Dates and Times | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#dates-and-times) |
| `data-standards` | Standards data | Currency | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#currency) |
| `data-standards` | Standards data | Country | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#country) |
| `developer-experience` | Developer experience | Documentation | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md) |
| `documentation` | Documentation | Every API MUST be described using a formal API description language | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#every-api-must-be-described-using-a-formal-api-description-language) |
| `documentation` | Documentation | Documentation | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md) |
| `errors` | Errors | Error handling | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md) |
| `global-design` | Global design | Introduction | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/introduction/introduction.md) |
| `global-design` | Global design | General Guidelines | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md) |
| `global-design` | Global design | Message Schema and Postel's Law | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) |
| `governance` | Governance | API Modelling and Design Process | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#api-modelling-and-design-process) |
| `governance` | Governance | API Design Review Process | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-review-process/api-design-review-process.md) |
| `governance` | Governance | Message Schema and Postel's Law | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) |
| `http-caching` | Caching | Caching | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md) |
| `http-headers` | HTTP Headers | Expires HTTP Header | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#expires-http-header) |
| `http-headers` | HTTP Headers | https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header) |
| `http-headers` | HTTP Headers | ETag | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#etag) |
| `http-methods` | HTTP methods | HTTP Verbs | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| `http-methods-delete` | DELETE | HTTP Verbs | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| `http-methods-get` | GET | HTTP Verbs | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| `http-methods-get` | GET | Get List of resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources) |
| `http-methods-get` | GET | Read Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource) |
| `http-methods-patch` | PATCH | HTTP Verbs | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| `http-methods-patch` | PATCH | Update Partial Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) |
| `http-methods-post` | POST | HTTP Verbs | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| `http-methods-post` | POST | Create New Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource) |
| `http-methods-post` | POST | Using POST (Search) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md#using-post) |
| `http-methods-put` | PUT | HTTP Verbs | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) |
| `http-methods-put` | PUT | Update Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) |
| `http-methods-put` | PUT | Create New Resource - Consumer Supplied Identifier | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier) |
| `http-status` | HTTP Statuses | Mapping Response Codes For Success and Failure | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#mapping-response-codes-for-success-and-failure) |
| `http-status` | HTTP Statuses | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-200` | 200 OK | HTTP Status (Get List of resources) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) |
| `http-status-200` | 200 OK | HTTP Status (Read Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1) |
| `http-status-200` | 200 OK | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-201` | 201 Created | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-204` | 204 No Content | HTTP Status (Update Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) |
| `http-status-204` | 204 No Content | HTTP Status (Update Partial Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) |
| `http-status-204` | 204 No Content | Delete Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) |
| `http-status-204` | 204 No Content | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-304` | 304 Not Modified | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-400` | 400 Bad Request | HTTP Status (Get List of resources) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) |
| `http-status-400` | 400 Bad Request | HTTP Status (Update Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) |
| `http-status-400` | 400 Bad Request | HTTP Status (Update Partial Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) |
| `http-status-400` | 400 Bad Request | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-401` | 401 Unauthorized | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-403` | 403 Forbidden | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-404` | 404 Not Found | HTTP Status (Get List of resources) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) |
| `http-status-404` | 404 Not Found | HTTP Status (Read Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1) |
| `http-status-404` | 404 Not Found | Delete Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) |
| `http-status-404` | 404 Not Found | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-405` | 405 Method Not Allowed | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-406` | 406 Not Acceptable | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-408` | 408 Request Timeout | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-409` | 409 Conflict | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-410` | 410 Gone | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-411` | 411 Length Required | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-412` | 412 Precondition Failed | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-415` | 415 Unsupported Media Type | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-422` | 422 Unprocessable Entity | HTTP Status (Update Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) |
| `http-status-422` | 422 Unprocessable Entity | HTTP Status (Update Partial Single Resource) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) |
| `http-status-422` | 422 Unprocessable Entity | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-500` | 500 Internal Server Error | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-501` | 501 Not Implemented | HTTP Status Codes | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) |
| `http-status-standard-error` | Error format | Error handling | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md) |
| `hypermedia` | Hypermedia | Expanding Resources Through Hypermedia Linking | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking) |
| `hypermedia` | Hypermedia | Support Hypermedia | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/rest-principles/rest-principles.md#support-hypermedia) |
| `hypermedia` | Hypermedia | Hypermedia and REST | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md) |
| `hypermedia` | Hypermedia | Relationships and Sub-Resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) |
| `hypermedia` | Hypermedia | Hypermedia Links (Pagination) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links) |
| `hypermedia` | Hypermedia | Hypermedia Response Format | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md) |
| `hypermedia-read` | Hypermedia (read) | Expanding Resources Through Hypermedia Linking | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking) |
| `hypermedia-read` | Hypermedia (read) | Hypermedia and REST | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md) |
| `hypermedia-read` | Hypermedia (read) | Relationships and Sub-Resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) |
| `hypermedia-read` | Hypermedia (read) | Hypermedia Links (Pagination) | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links) |
| `naming` | Naming | Building Your Resource Taxonomy | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy) |
| `naming` | Naming | Resource naming | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#resource-naming) |
| `resource` | Resource | Building Your Resource Taxonomy | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy) |
| `resource` | Resource | Defining Resource Lifecycles | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#defining-resource-lifecycles) |
| `resource` | Resource | Resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/resources/resources.md) |
| `resource-creation` | Create resource | Create New Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource) |
| `resource-creation-with-id` | Create resource with a specific ID | Create New Resource - Consumer Supplied Identifier | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier) |
| `resource-deletion` | Delete resource | Delete Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) |
| `resource-id` | Resource ID | Composite Keys | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/faq/faq.md#composite-keys) |
| `resource-relationships` | Relationships | How to Handle Resource Relationships and Composition | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#how-to-handle-resource-relationships-and-composition) |
| `resource-relationships` | Relationships | Relationships and Sub-Resources | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) |
| `resource-replacement` | Replace resource | Update Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) |
| `resource-retrieve` | Retrieve resource | Read Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource) |
| `resource-retrieve-partial` | Retrieve resource partially | Field selection | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#field-selection) |
| `resource-state` | Resource's state | Resource's state | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md) |
| `resource-update` | Update resource | Update Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) |
| `resource-update` | Update resource | Update Partial Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) |
| `resource-update-partial` | Update resource partially | Update Partial Single Resource | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) |
| `resource-url-format` | URL format | URI Components | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md) |
| `security` | Security | API clients MUST use an API Key | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#api-clients-must-use-an-api-key) |
| `security-data` | Data privacy | Security and Authentication | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/security-and-authentication/security-and-authentication.md) |
| `versioning` | Updates and Versioning | Version | [Link](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md#version) |

### `heroku-http-api-design-guide` - Heroku: HTTP API Design Guide
* **Primary URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Total Topics Covered**: 34
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection-pagination` | Pagination | Divide Large Responses Across Requests with Ranges | [Link](https://geemus.gitbooks.io/http-api-design/content/en/) |
| `data-format` | Data format | Accept serialized JSON in request bodies | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/accept-serialized-json-in-request-bodies.html) |
| `data-format` | Data format | Provide standard timestamps | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html) |
| `data-format` | Data format | Nest foreign key relations | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html) |
| `data-format` | Data format | Keep JSON minified in all responses | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html) |
| `data-format-date-time` | Date and Time | Provide standard timestamps | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html) |
| `data-format-date-time` | Date and Time | Use UTC times formatted in ISO8601 | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/use-utc-times-formatted-in-iso8601.html) |
| `debug-diagnose` | Debug and diagnose | Provide Request-Ids for Introspection | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html) |
| `documentation` | Documentation | Provide machine-readable JSON schema | [Link](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-machine-readable-json-schema.html) |
| `documentation` | Documentation | Provide human-readable docs | [Link](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-human-readable-docs.html) |
| `documentation` | Documentation | Provide executable examples | [Link](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-executable-examples.html) |
| `global-design` | Global design | Separate Concerns | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/separate-concerns.html) |
| `http-caching` | Caching | Support ETags for Caching | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html) |
| `http-headers` | HTTP Headers | Require Versioning in the Accepts Header | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html) |
| `http-headers` | HTTP Headers | Support ETags for Caching | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html) |
| `http-headers` | HTTP Headers | Provide Request-Ids for Introspection | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html) |
| `http-headers` | HTTP Headers | Divide Large Responses Across Requests with Ranges | [Link](https://geemus.gitbooks.io/http-api-design/content/en/) |
| `http-status` | HTTP Statuses | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-200` | 200 OK | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-201` | 201 Created | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-202` | 202 Accepted | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-206` | 206 Partial Content | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-401` | 401 Unauthorized | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-403` | 403 Forbidden | Require Secure Connections | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html) |
| `http-status-403` | 403 Forbidden | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-422` | 422 Unprocessable Entity | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-429` | 429 Too Many Requests | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-500` | 500 Internal Server Error | Return appropriate status codes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) |
| `http-status-standard-error` | Error format | Generate structured errors | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/generate-structured-errors.html) |
| `naming` | Naming | Resource names | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/resource-names.html) |
| `naming-case` | Case | Downcase paths and attributes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html) |
| `performance` | Performance and bandwidth | Keep JSON minified in all responses | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html) |
| `rate-limiting` | Rate limiting | Show rate limit status | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/show-rate-limit-status.html) |
| `resource-action` | Action resource | Actions | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/actions.html) |
| `resource-creation` | Create resource | Provide full resources where available | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| `resource-deletion` | Delete resource | Provide full resources where available | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| `resource-id` | Resource ID | Support non-id dereferencing for convenience | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html) |
| `resource-id` | Resource ID | Provide resource (UU)IDs | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-resource-uuids.html) |
| `resource-id-semantic` | ID with semantic | Support non-id dereferencing for convenience | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html) |
| `resource-relationships` | Relationships | Nest foreign key relations | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html) |
| `resource-retrieve` | Retrieve resource | Provide full resources where available | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| `resource-update` | Update resource | Provide full resources where available | [Link](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) |
| `resource-url-format` | URL format | Use consistent path formats | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/use-consistent-path-formats.html) |
| `resource-url-format` | URL format | Downcase paths and attributes | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html) |
| `resource-url-format` | URL format | Minimize path nesting | [Link](https://geemus.gitbooks.io/http-api-design/content/en/requests/minimize-path-nesting.html) |
| `security` | Security | Require Secure Connections | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html) |
| `versioning` | Updates and Versioning | Require Versioning in the Accepts Header | [Link](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html) |
| `versioning` | Updates and Versioning | Describe stability | [Link](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/describe-stability.html) |

### `italian-public-administration` - Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration): Interoperability model for the Public Administration
* **Primary URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Total Topics Covered**: 37
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `asynchronicity` | Asynchronicity | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `asynchronicity` | Asynchronicity | Non blocking profile | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccanti) |
| `asynchronicity` | Asynchronicity | Non-blocking RPC PUSH profiles (callback based) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccante-rpc-push-basato-su-callback) |
| `asynchronicity` | Asynchronicity | Non-blocking profile RPC PULL (busy waiting) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profilo-non-bloccante-rpc-pull-busy-waiting) |
| `collection` | Collection | Resource collections can use plural names | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale) |
| `collection` | Collection | Code structured data with JSON objects | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#codificare-dati-strutturati-con-oggetti-json) |
| `data-format` | Data format | Data uniformity | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#uniformita-dei-dati) |
| `data-format` | Data format | Data format (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#formato-dei-dati) |
| `data-standards` | Standards data | Use the properties according to standard nomenclatures | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#utilizzare-le-properties-secondo-nomenclature-standard) |
| `documentation` | Documentation | REST | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) |
| `errors` | Errors | Use the Problem JSON scheme for error responses | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore) |
| `global-design` | Global design | Introduction to service interfaces | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html) |
| `global-design` | Global design | Paradigms of cooperation | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#paradigmi-di-cooperazione) |
| `global-design` | Global design | SOAP | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#soap) |
| `global-design` | Global design | REST | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) |
| `global-design` | Global design | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `global-design` | Global design | Comparative considerations (REST vs SOAP vs Message broket) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_06.html#considerazioni-comparative) |
| `global-design` | Global design | Other approches (Distributed data stores, open data) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_07.html#altri-approcci-e-tecnologie-di-integrazione) |
| `global-design` | Global design | Paradigms for the design of service interfaces (RPC-like vs resource oriented) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#paradigmi-per-la-progettazione-delle-interfacce-di-servizio) |
| `global-design` | Global design | Perimeter of service interfaces | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#perimetro-delle-interfacce-di-servizio) |
| `global-design` | Global design | Technical recommendations for REST | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-rest) |
| `global-design` | Global design | Technical recommendations for SOAP | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-soap) |
| `global-design` | Global design | The european context | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_02.html#il-contesto-europeo) |
| `governance` | Governance | Catalog of API/Services | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#catalogo-delle-api-servizi) |
| `governance` | Governance | Model governance | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#governance-del-modello) |
| `http-caching` | Caching | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-caching` | Caching | By default, http caching must be disabled | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#di-default-il-caching-http-deve-essere-disabilitato) |
| `http-content-negotiation` | Content negociation and media types | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-content-negotiation` | Content negociation and media types | Avoid custom Content-Types | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#evitare-content-type-personalizzati) |
| `http-methods` | HTTP methods | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-methods` | HTTP methods | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `http-methods-delete` | DELETE | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-methods-delete` | DELETE | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `http-methods-delete` | DELETE | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-methods-get` | GET | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-methods-get` | GET | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `http-methods-get` | GET | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-methods-head` | HEAD | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-methods-patch` | PATCH | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-methods-post` | POST | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-methods-post` | POST | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `http-methods-post` | POST | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-methods-put` | PUT | Directions for use (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) |
| `http-methods-put` | PUT | Message broker | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) |
| `http-methods-put` | PUT | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status` | HTTP Statuses | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-200` | 200 OK | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-201` | 201 Created | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-204` | 204 No Content | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-404` | 404 Not Found | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-405` | 405 Method Not Allowed | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-409` | 409 Conflict | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-415` | 415 Unsupported Media Type | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `http-status-422` | 422 Unprocessable Entity | Use the Problem JSON scheme for error responses | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore) |
| `hypermedia` | Hypermedia | REST | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) |
| `hypermedia` | Hypermedia | Use absolute URIs in the results | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-uri-assoluti-nei-risultati) |
| `naming` | Naming | Uniformity and naming (REST) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#uniformita-e-naming) |
| `naming` | Naming | Uniformity and naming (SOAP) | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#uniformita-e-naming) |
| `naming` | Naming | Resource collections can use plural names | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale) |
| `naming-case` | Case | The properties of JSON objects must have a consistent naming | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-proprieta-degli-oggetti-json-devono-avere-un-naming-consistente) |
| `performance` | Performance and bandwidth | Optimize bandwidth usage and improve responsiveness | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita) |
| `resource` | Resource | The concept of service | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#il-concetto-di-servizio) |
| `resource` | Resource | CRUD Access to Resources | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#accesso-crud-a-risorse) |
| `resource-creation` | Create resource | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `resource-deletion` | Delete resource | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `resource-retrieve` | Retrieve resource | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `resource-retrieve-partial` | Retrieve resource partially | Optimize bandwidth usage and improve responsiveness | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita) |
| `resource-update` | Update resource | REST interface processing rules | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) |
| `security` | Security | Security concepts | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_02.html) |
| `security` | Security | Security | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04_cap_00.html) |
| `security` | Security | Channel security and / or identification of organizations | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/sicurezza-di-canale-eo-autenticazione-delle-organizzazioni.html) |
| `security` | Security | User (consumer) access | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/autenticazione-del-soggetto-richiedente.html) |
| `security` | Security | Integrity of SOAP message | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idas03-integrita-della-payload-del-messaggio-soap) |
| `security` | Security | Integrity of REST message | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idar03-integrita-della-payload-messaggio-rest) |
| `security` | Security | Confidentiality and user (consumer) authentication | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzione-per-confidenzialita-ed-autenticazione-del-soggetto-fruitore) |
| `security` | Security | Non repudiation of transactions | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzioni-per-la-non-ripudiabilita-della-trasmissione) |
| `security` | Security | REST API safety | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#sicurezza) |
| `security` | Security | SOAP service safety | [Link](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#sicurezza) |

### `microsoft-rest-api-guidelines` - Microsoft: Microsoft REST API Guidelines
* **Primary URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Total Topics Covered**: 43
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `asynchronicity` | Asynchronicity | Long running API faults | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults) |
| `asynchronicity` | Asynchronicity | Long running operations | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#13-long-running-operations) |
| `asynchronicity` | Asynchronicity | Operations resource | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource) |
| `asynchronicity` | Asynchronicity | Operation resource | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource) |
| `asynchronicity` | Asynchronicity | Operation tombstones | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones) |
| `asynchronicity` | Asynchronicity | The typical flow, polling | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling) |
| `asynchronicity` | Asynchronicity | The typical flow, push notifications | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) |
| `asynchronicity` | Asynchronicity | Retry-After | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after) |
| `collection` | Collection | Collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#9-collections) |
| `collection-filtering` | Filtering | Filtering | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#97-filtering) |
| `collection-pagination` | Pagination | Big collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections) |
| `collection-pagination` | Pagination | Pagination | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#98-pagination) |
| `collection-sorting` | Sorting a collection | Variable order rule | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#62-variable-order-rule) |
| `collection-sorting` | Sorting a collection | Sorting collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#96-sorting-collections) |
| `cors` | CORS | CORS | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#8-cors) |
| `data-format` | Data format | Response Formats | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#710-response-formats) |
| `data-format` | Data format | JSON standardizations | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#11-json-standardizations) |
| `data-format-date-time` | Date and Time | Guidelines for dates and times | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#112-guidelines-for-dates-and-times) |
| `data-format-date-time` | Date and Time | JSON serialization of dates and times | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#113-json-serialization-of-dates-and-times) |
| `data-format-date-time` | Date and Time | Durations | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#114-durations) |
| `data-format-date-time` | Date and Time | Intervals | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#115-intervals) |
| `data-format-date-time` | Date and Time | Repeating intervals | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#116-repeating-intervals) |
| `developer-experience` | Developer experience | Client Guidance | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#6-client-guidance) |
| `developer-experience` | Developer experience | Client library optional | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#712-client-library-optional) |
| `documentation` | Documentation | Options and link headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| `errors` | Errors | Errors | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors) |
| `errors` | Errors | Faults | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults) |
| `errors` | Errors | Long running API faults | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults) |
| `errors` | Errors | Silent Fail Rule | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#63-silent-fail-rule) |
| `errors` | Errors | Unsupported requests | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#15-unsupported-requests) |
| `global-design` | Global design | Introduction | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#3-introduction) |
| `governance` | Governance | Interpreting The Guidelines | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#4-interpreting-the-guidelines) |
| `governance` | Governance | When to version | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#122-when-to-version) |
| `governance` | Governance | Definition of a breaking change | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#123-definition-of-a-breaking-change) |
| `http` | HTTP protocol | HTTP protocol | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) |
| `http-caching` | Caching | Standard request headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| `http-caching` | Caching | Standard response headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| `http-caching` | Caching | Retention policy for operation results | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#133-retention-policy-for-operation-results) |
| `http-content-negotiation` | Content negociation and media types | Standard request headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| `http-content-negotiation` | Content negociation and media types | Standard response headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| `http-content-negotiation` | Content negociation and media types | Clients-specified response format | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7101-clients-specified-response-format) |
| `http-headers` | HTTP Headers | POST | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) |
| `http-headers` | HTTP Headers | Options and link headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| `http-headers` | HTTP Headers | Standard request headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| `http-headers` | HTTP Headers | Standard response headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| `http-headers` | HTTP Headers | Custom Headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#77-custom-headers) |
| `http-headers` | HTTP Headers | Specifying headers as query parameters | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#78-specifying-headers-as-query-parameters) |
| `http-methods` | HTTP methods | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-delete` | DELETE | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-get` | GET | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-head` | HEAD | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-options` | OPTIONS | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-options` | OPTIONS | Options and link headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| `http-methods-patch` | PATCH | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-patch` | PATCH | PATCH | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) |
| `http-methods-patch` | PATCH | Creating resources via PATCH (UPSERT semantics) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| `http-methods-post` | POST | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-post` | POST | POST | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) |
| `http-methods-post` | POST | Changing collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) |
| `http-methods-post` | POST | POST (Long running operations) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1322-post) |
| `http-methods-post` | POST | POST, hybrid model (Long running operations) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1323-post-hybrid-model) |
| `http-methods-put` | PUT | Supported Methods | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) |
| `http-methods-put` | PUT | Changing collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) |
| `http-methods-put` | PUT | PUT (Long running operations) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1321-put) |
| `http-status` | HTTP Statuses | Errors | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors) |
| `http-status` | HTTP Statuses | Faults | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults) |
| `http-status` | HTTP Statuses | HTTP Status Codes | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#711-http-status-codes) |
| `http-status-standard-error` | Error format | Error condition responses | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses) |
| `hypermedia-read` | Hypermedia (read) | Options and link headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) |
| `hypermedia-read` | Hypermedia (read) | Big collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections) |
| `notifications-server-events` | Notifying API consumers | The typical flow, push notifications | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) |
| `notifications-server-events` | Notifying API consumers | Push notifications via webhooks | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#14-push-notifications-via-webhooks) |
| `resource-action` | Action resource | Operations resource | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource) |
| `resource-action` | Action resource | Operation resource | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource) |
| `resource-action` | Action resource | Operation tombstones | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones) |
| `resource-action` | Action resource | The typical flow, polling | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling) |
| `resource-action` | Action resource | The typical flow, push notifications | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) |
| `resource-action` | Action resource | Retry-After | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after) |
| `resource-change-tracking` | Track change | Delta queries | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#10-delta-queries) |
| `resource-creation` | Create resource | POST | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) |
| `resource-creation` | Create resource | Changing collections | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) |
| `resource-creation-with-id` | Create resource with a specific ID | Creating resources via PATCH (UPSERT semantics) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| `resource-id` | Resource ID | Canonical identifier | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier) |
| `resource-id-semantic` | ID with semantic | Canonical identifier | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier) |
| `resource-multiple` | Batch Bulk | Batch Bulk | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) |
| `resource-retrieve-partial` | Retrieve resource partially | Standard request headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) |
| `resource-retrieve-partial` | Retrieve resource partially | Standard response headers | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) |
| `resource-update` | Update resource | PATCH | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) |
| `resource-update` | Update resource | Creating resources via PATCH (UPSERT semantics) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| `resource-update-partial` | Update resource partially | PATCH | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) |
| `resource-update-partial` | Update resource partially | Creating resources via PATCH (UPSERT semantics) | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) |
| `resource-url-format` | URL format | URL Structure | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#71-url-structure) |
| `resource-url-format` | URL format | URL Length | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#72-url-length) |
| `resource-url-format` | URL format | Collection URL patterns | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#93-collection-url-patterns) |
| `security` | Security | Security | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#148-security) |
| `security-data` | Data privacy | PII parameters | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#79-pii-parameters) |
| `versioning` | Updates and Versioning | Guidelines for existing services and versioning of services | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#42-guidelines-for-existing-services-and-versioning-of-services) |
| `versioning` | Updates and Versioning | Versioning | [Link](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#12-versioning) |

### `paypal-api-style-guide` - PayPal: API Style Guide
* **Primary URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Total Topics Covered**: 36
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection` | Collection | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `collection` | Collection | Sub-Resource Collection | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-collection) |
| `collection-filtering` | Filtering | Time Selection | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#time-selection) |
| `collection-filtering` | Filtering | Complex Operation - Search | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---search) |
| `collection-pagination` | Pagination | Paging | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging) |
| `collection-pagination` | Pagination | Paging (Complex Operation - Search) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging-1) |
| `collection-retrieve` | Retrieve a collection | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `collection-sorting` | Sorting a collection | Sorting | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sorting) |
| `http-caching` | Caching | Read-only resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-only-resources) |
| `http-methods` | HTTP methods | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `http-methods-delete` | DELETE | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `http-methods-delete` | DELETE | Delete Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| `http-methods-get` | GET | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `http-methods-get` | GET | HTTP Status (Read Single Resource) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| `http-methods-patch` | PATCH | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `http-methods-patch` | PATCH | Update Partial Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| `http-methods-post` | POST | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `http-methods-post` | POST | Create New Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| `http-methods-put` | PUT | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `http-methods-put` | PUT | Update Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| `http-status` | HTTP Statuses | HTTP Status (Collections) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| `http-status` | HTTP Statuses | HTTP Status (Read Single Resource) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| `http-status-200` | 200 OK | HTTP Status (Collections) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| `http-status-200` | 200 OK | HTTP Status (Read Single Resource) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| `http-status-204` | 204 No Content | Update Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| `http-status-204` | 204 No Content | Update Partial Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| `http-status-204` | 204 No Content | Delete Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| `http-status-400` | 400 Bad Request | HTTP Status (Collections) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| `http-status-404` | 404 Not Found | HTTP Status (Collections) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) |
| `http-status-404` | 404 Not Found | HTTP Status (Read Single Resource) | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) |
| `http-status-404` | 404 Not Found | Update Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| `http-status-404` | 404 Not Found | Delete Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| `http-status-422` | 422 Unprocessable Entity | Update Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| `hypermedia` | Hypermedia | Paging Hypermedia Links | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links) |
| `hypermedia` | Hypermedia | Create New Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| `hypermedia-read` | Hypermedia (read) | Paging Hypermedia Links | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links) |
| `hypermedia-read` | Hypermedia (read) | Create New Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| `naming` | Naming | Collection Resources | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) |
| `performance` | Performance and bandwidth | Performance and bandwidth | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md) |
| `query-parameter` | Query parameters | Filtering | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#filtering) |
| `resource` | Resource | Read Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource) |
| `resource` | Resource | Sub-Resource Singleton | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-singleton) |
| `resource-action` | Action resource | Complex Operation | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation) |
| `resource-creation` | Create resource | Create New Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) |
| `resource-creation-with-id` | Create resource with a specific ID | Create New Resource - Consumer Supplied Identifier | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource---consumer-supplied-identifier) |
| `resource-deletion` | Delete resource | Delete Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) |
| `resource-multiple` | Batch Bulk | Complex Operation - Composite | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---composite) |
| `resource-replacement` | Replace resource | Update Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| `resource-retrieve` | Retrieve resource | Read Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource) |
| `resource-state` | Resource's state | Complex Operation - Transient | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---transient) |
| `resource-update` | Update resource | Update Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) |
| `resource-update-partial` | Update resource partially | Update Partial Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| `resource-url-format` | URL format | URL Components | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#uri-components) |
| `resource-url-format` | URL format | Update Partial Single Resource | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) |
| `versioning` | Updates and Versioning | Version | [Link](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#version) |

### `redhat-thoughts-on-restful-api-design` - Red Hat: Thoughts on RESTful API Design
* **Primary URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Total Topics Covered**: 32
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `asynchronicity` | Asynchronicity | Asynchronous Requests | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#asynchronous-requests) |
| `collection` | Collection | URLs | [Link](http://restful-api-design.readthedocs.io/en/latest/urls.html) |
| `collection-pagination` | Pagination | Ranges Pagination | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#ranges-pagination) |
| `collection-retrieve` | Retrieve a collection | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `data-format` | Data format | Resource Data | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html#resource-data) |
| `documentation` | Documentation | Forms | [Link](http://restful-api-design.readthedocs.io/en/latest/forms.html) |
| `guiding-input` | Guiding inputs | Forms | [Link](http://restful-api-design.readthedocs.io/en/latest/forms.html) |
| `http-content-negotiation` | Content negociation and media types | Representations | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html#representations) |
| `http-content-negotiation` | Content negociation and media types | Content-Types | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html#content-types) |
| `http-headers` | HTTP Headers | Link Headers | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) |
| `http-methods` | HTTP methods | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-delete` | DELETE | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-get` | GET | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-head` | HEAD | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-options` | OPTIONS | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-patch` | PATCH | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-post` | POST | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-methods-put` | PUT | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `http-status-405` | 405 Method Not Allowed | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `hypermedia` | Hypermedia | REST Metadata | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) |
| `hypermedia` | Hypermedia | Link Headers | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) |
| `hypermedia` | Hypermedia | Relationships | [Link](http://restful-api-design.readthedocs.io/en/latest/relationships.html) |
| `hypermedia-read` | Hypermedia (read) | REST Metadata | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) |
| `hypermedia-read` | Hypermedia (read) | Link Headers | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) |
| `hypermedia-read` | Hypermedia (read) | Relationships | [Link](http://restful-api-design.readthedocs.io/en/latest/relationships.html) |
| `hypermedia-write` | Hypermedia (write) | Forms | [Link](http://restful-api-design.readthedocs.io/en/latest/forms.html) |
| `notifications-server-events` | Notifying API consumers | Notifications | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#notifications) |
| `resource` | Resource | Resources | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html) |
| `resource` | Resource | URLs | [Link](http://restful-api-design.readthedocs.io/en/latest/urls.html) |
| `resource-action` | Action resource | Actions | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#actions) |
| `resource-creation` | Create resource | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `resource-deletion` | Delete resource | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `resource-id` | Resource ID | REST Metadata | [Link](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) |
| `resource-relationships` | Relationships | Relationships | [Link](http://restful-api-design.readthedocs.io/en/latest/relationships.html) |
| `resource-retrieve` | Retrieve resource | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `resource-update` | Update resource | Methods | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html) |
| `resource-update-partial` | Update resource partially | PATCH vs PUT | [Link](http://restful-api-design.readthedocs.io/en/latest/methods.html#patch-vs-put) |
| `resource-url-format` | URL format | URLs | [Link](http://restful-api-design.readthedocs.io/en/latest/urls.html) |

### `white-house-web-api-standards` - White House: White House Web API Standards
* **Primary URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Total Topics Covered**: 22
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `collection-filtering` | Filtering | Record Limits | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#record-limits) |
| `cors` | CORS | JSONP | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#jsonp) |
| `http-content-negotiation` | Content negociation and media types | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-headers` | HTTP Headers | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-methods` | HTTP methods | HTTP verbs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| `http-methods` | HTTP methods | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-methods-delete` | DELETE | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-methods-get` | GET | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-methods-post` | POST | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-methods-put` | PUT | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `http-status` | HTTP Statuses | Error handling | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| `http-status-200` | 200 OK | Error handling | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| `http-status-400` | 400 Bad Request | Error handling | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| `http-status-500` | 500 Internal Server Error | Error handling | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| `http-status-standard-error` | Error format | Error handling | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) |
| `naming` | Naming | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `resource-creation` | Create resource | HTTP verbs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| `resource-deletion` | Delete resource | HTTP verbs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| `resource-multiple` | Batch Bulk | HTTP verbs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| `resource-retrieve` | Retrieve resource | HTTP verbs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| `resource-update` | Update resource | HTTP verbs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) |
| `resource-url-format` | URL format | RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#restful-urls) |
| `versioning` | Updates and Versioning | General guidelines for RESTful URLs | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) |
| `versioning` | Updates and Versioning | Versions | [Link](https://github.com/WhiteHouse/api-standards/blob/master/README.md#versions) |

### `zalando-restful-api-guidelines` - Zalando: RESTFul API Guidelines
* **Primary URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Total Topics Covered**: 74
* **Covered Topics Table**:

| Topic ID | Topic Name | Guideline Section | Section URL |
| :--- | :--- | :--- | :--- |
| `api-counts` | API counts | Limit of Resources | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-resources) |
| `asynchronicity` | Asynchronicity | Events | [Link](http://zalando.github.io/restful-api-guidelines/events/events.html) |
| `collection` | Collection | Resources | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html) |
| `collection-filtering` | Filtering | Use Conventional Query Strings | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| `collection-pagination` | Pagination | Use Conventional Query Strings | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| `collection-pagination` | Pagination | Pagination | [Link](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html) |
| `collection-retrieve` | Retrieve a collection | GET | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) |
| `collection-sorting` | Sorting a collection | Use Conventional Query Strings | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| `data-format` | Data format | Property Values | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values) |
| `data-format` | Data format | Date property values should conform to RFC 3399 | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399) |
| `data-format` | Data format | Time durations and intervals could conform to ISO 8601 | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601) |
| `data-format` | Data format | Data Formats | [Link](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html) |
| `data-format` | Data format | Common Data Objects | [Link](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html) |
| `data-format-date-time` | Date and Time | Date property values should conform to RFC 3399 | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399) |
| `data-format-date-time` | Date and Time | Time durations and intervals could conform to ISO 8601 | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601) |
| `data-format-date-time` | Date and Time | Use Standard Date and Time Formats | [Link](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#must-use-standard-date-and-time-formats) |
| `data-format-date-time` | Date and Time | HTTP headers | [Link](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers) |
| `data-format-null` | Null data | Property values | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values) |
| `data-format-null` | Null data | Null values should have their fields removed | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-null-values-should-have-their-fields-removed) |
| `data-format-null` | Null data | Boolean property values must not be null | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-boolean-property-values-must-not-be-null) |
| `data-format-null` | Null data | Empty array values should not be null | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-empty-array-values-should-not-be-null) |
| `data-standards` | Standards data | Standards could be used for Language, Country and Currency | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-standards-could-be-used-for-language-country-and-currency) |
| `data-standards` | Standards data | Use Standards for Country, Language and Currency Codes | [Link](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-standards-for-country-language-and-currency-codes) |
| `documentation` | Documentation | Provide External Documentation | [Link](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#should-provide-external-documentation) |
| `documentation` | Documentation | Reflect Deprecation in API Definition | [Link](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#must-reflect-deprecation-in-api-definition) |
| `global-design` | Global design | Design Principles | [Link](http://zalando.github.io/restful-api-guidelines/design-principles/DesignPrinciples.html) |
| `governance` | Governance | API First | [Link](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-api-first-define-apis-using-openapi) |
| `governance` | Governance | Deprecation | [Link](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html) |
| `governance` | Governance | API Discovery | [Link](http://zalando.github.io/restful-api-guidelines/api-discovery/ApiDiscovery.html) |
| `http` | HTTP protocol | HTTP | [Link](http://zalando.github.io/restful-api-guidelines/) |
| `http-caching` | Caching | Support the ETag Header | [Link](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#could-support-the-etag-header) |
| `http-content-negotiation` | Content negociation and media types | Use Media Type Versioning | [Link](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning) |
| `http-content-negotiation` | Content negociation and media types | Modify the Content-Type for Embedded Resources | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources) |
| `http-content-negotiation` | Content negociation and media types | Use Application-Specific Content Types | [Link](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-applicationspecific-content-types) |
| `http-headers` | HTTP Headers | You Must Hyphenate HTTP Headers | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-you-must-hyphenate-http-headers) |
| `http-headers` | HTTP Headers | Prefer Hyphenated-Pascal-Case for HTTP header Fields | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#should-prefer-hyphenatedpascalcase-for-http-header-fields) |
| `http-headers` | HTTP Headers | Use Standardized Headers | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-standardized-headers) |
| `http-headers` | HTTP Headers | Use 429 with Headers for Rate Limits | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits) |
| `http-headers` | HTTP Headers | Do Not Use Link Headers with JSON entities | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |
| `http-headers` | HTTP Headers | HTTP headers | [Link](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers) |
| `http-headers` | HTTP Headers | Common Headers | [Link](http://zalando.github.io/restful-api-guidelines/headers/CommonHeaders.html) |
| `http-headers` | HTTP Headers | Proprietary Headers | [Link](http://zalando.github.io/restful-api-guidelines/headers/ProprietaryHeaders.html) |
| `http-headers` | HTTP Headers | Add a Warning Header to Responses | [Link](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#should-add-a-warning-header-to-responses) |
| `http-methods` | HTTP methods | Use HTTP Methods Correctly | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-http-methods-correctly) |
| `http-methods` | HTTP methods | HTTP Methods must Fulfill Safeness and Idempotency Properties | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#must--http-methods-must-fulfill-safeness-and-idempotency-properties) |
| `http-methods-delete` | DELETE | DELETE | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#delete) |
| `http-methods-get` | GET | GET | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) |
| `http-methods-head` | HEAD | HEAD | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#head) |
| `http-methods-options` | OPTIONS | OPTIONS | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#options) |
| `http-methods-patch` | PATCH | PATCH | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) |
| `http-methods-post` | POST | POST | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#post) |
| `http-methods-put` | PUT | PUT | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) |
| `http-status` | HTTP Statuses | Use Meaningful HTTP Status Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-meaningful-http-status-codes) |
| `http-status-200` | 200 OK | Success Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |
| `http-status-201` | 201 Created | Success Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |
| `http-status-202` | 202 Accepted | Success Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |
| `http-status-204` | 204 No Content | Success Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) |
| `http-status-301` | 301 Moved Permanently | Redirection Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) |
| `http-status-302` | 302 Found | HTTP Status 302 | [Link](http://zalando.github.io/restful-api-guidelines/) |
| `http-status-303` | 303 See Other | Redirection Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) |
| `http-status-304` | 304 Not Modified | Redirection Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) |
| `http-status-400` | 400 Bad Request | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-401` | 401 Unauthorized | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-403` | 403 Forbidden | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-404` | 404 Not Found | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-405` | 405 Method Not Allowed | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-406` | 406 Not Acceptable | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-408` | 408 Request Timeout | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-409` | 409 Conflict | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-412` | 412 Precondition Failed | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-415` | 415 Unsupported Media Type | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-423` | 423 Locked | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-428` | 428 Precondition Required | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-429` | 429 Too Many Requests | Client Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) |
| `http-status-429` | 429 Too Many Requests | Use 429 with Headers for Rate Limits | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits) |
| `http-status-500` | 500 Internal Server Error | Server Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) |
| `http-status-501` | 501 Not Implemented | Server Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) |
| `http-status-503` | 503 Service Unavailable | Server Side Error Codes | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) |
| `http-status-standard-error` | Error format | Providing Error Documentation | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-providing-error-documentation) |
| `http-status-standard-error` | Error format | Use Problem JSON | [Link](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html#must-use-problem-json) |
| `hypermedia` | Hypermedia | Use Pagination Links Where Applicable | [Link](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable) |
| `hypermedia` | Hypermedia | Hypermedia | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html) |
| `hypermedia` | Hypermedia | Use a well-defined subset of HAL | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) |
| `hypermedia` | Hypermedia | Do Not Use Link Headers with JSON entities | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |
| `hypermedia-read` | Hypermedia (read) | Use Pagination Links Where Applicable | [Link](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable) |
| `hypermedia-read` | Hypermedia (read) | Use a well-defined subset of HAL | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) |
| `hypermedia-read` | Hypermedia (read) | Use Custom Link Relations | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations) |
| `hypermedia-read` | Hypermedia (read) | Do Not Use Link Headers with JSON entities | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |
| `naming` | Naming | Property naming | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-naming) |
| `naming` | Naming | API Naming | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html) |
| `naming` | Naming | Use Domain-Specific Resource Names | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-use-domainspecific-resource-names) |
| `naming-case` | Case | Property names must be snake_case | [Link](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-property-names-must-be-snakecase-and-never-camelcase) |
| `naming-language` | Language | Write APIs in U.S. English | [Link](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-write-apis-in-us-english) |
| `notifications-server-events` | Notifying API consumers | Events | [Link](http://zalando.github.io/restful-api-guidelines/events/events.html) |
| `performance` | Performance and bandwidth | Performance | [Link](http://zalando.github.io/restful-api-guidelines/performance/Performance.html) |
| `query-parameter` | Query parameters | Query parameters must be snake_case (never camelCase) | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-query-parameters-must-be-snakecase-never-camelcase) |
| `query-parameter` | Query parameters | Use Conventional Query Strings | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| `resource` | Resource | resources | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html) |
| `resource-action` | Action resource | Avoid Actions — Think About Resources | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-avoid-actions-—-think-about-resources) |
| `resource-creation` | Create resource | POST | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#post) |
| `resource-deletion` | Delete resource | DELETE | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#delete) |
| `resource-relationships` | Relationships | Use a well-defined subset of HAL | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) |
| `resource-relationships` | Relationships | Use Custom Link Relations | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations) |
| `resource-relationships` | Relationships | Do Not Use Link Headers with JSON entities | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) |
| `resource-replacement` | Replace resource | PUT | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) |
| `resource-retrieve` | Retrieve resource | GET | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) |
| `resource-retrieve-dereference` | Dereference Relationships | Use Conventional Query Strings | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| `resource-retrieve-dereference` | Dereference Relationships | Define useful resources | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources) |
| `resource-retrieve-dereference` | Dereference Relationships | Allow Optional Embedding of Sub-Resources | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#should-allow-optional-embedding-of-subresources) |
| `resource-retrieve-dereference` | Dereference Relationships | Modify the Content-Type for Embedded Resources | [Link](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources) |
| `resource-retrieve-partial` | Retrieve resource partially | Use Conventional Query Strings | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) |
| `resource-retrieve-partial` | Retrieve resource partially | Define useful resources | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources) |
| `resource-retrieve-partial` | Retrieve resource partially | Support Filtering of Resource Fields | [Link](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#should-support-filtering-of-resource-fields) |
| `resource-update` | Update resource | PUT | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) |
| `resource-update` | Update resource | PATCH | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) |
| `resource-update-partial` | Update resource partially | PATCH | [Link](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) |
| `resource-url-format` | URL format | Path segments must be lowercase separate words with hyphens | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-path-segments-must-be-lowercase-separate-words-with-hyphens) |
| `resource-url-format` | URL format | Always Pluralize Resource Names | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-always-pluralize-resource-names) |
| `resource-url-format` | URL format | First Path segment May be /api | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-first-path-segment-may-be-api) |
| `resource-url-format` | URL format | Avoid Trailing Slashes | [Link](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-avoid-trailing-slashes) |
| `resource-url-format` | URL format | Limit of Sub-Resource Levels | [Link](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-subresource-levels) |
| `security` | Security | Security | [Link](http://zalando.github.io/restful-api-guidelines/security/Security.html) |
| `security` | Security | Secure Endpoints with OAuth 2.0 | [Link](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-secure-endpoints-with-oauth-20) |
| `security` | Security | Define and Assign Access Rights (Scopes) | [Link](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-define-and-assign-access-rights-scopes) |
| `versioning` | Updates and Versioning | Compatibility | [Link](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html) |
| `versioning` | Updates and Versioning | Don’t Break Backward Compatibility | [Link](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-dont-break-backward-compatibility) |
| `versioning` | Updates and Versioning | Avoid Versioning | [Link](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#should-avoid-versioning) |
| `versioning` | Updates and Versioning | Use Media Type Versioning | [Link](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning) |
