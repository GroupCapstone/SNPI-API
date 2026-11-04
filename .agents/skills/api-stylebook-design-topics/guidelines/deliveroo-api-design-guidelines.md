# Guideline: API Design

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Deliveroo**
> **Canonical Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 60 topics across 15 categories

---

## 1. Executive Summary & Architectural Philosophy

**Deliveroo** published the *API Design* as an authoritative engineering standard.

> Deliveroo's pragmatic, high-throughput e-commerce and logistics REST guide. Highlights three core principles: RESTful, Hypermedia, and Fine-grained API boundaries. Mandates snake_case/camelCase rules and mobile-friendly payloads.

---

## 2. Analyzed Design Topics by Category

This guideline covers **60 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `api-counts` | **API counts** | [Fine-grained](http://deliveroo.engineering/guidelines/api-design/#fine-grained) | Standard rule | [`api-counts.md`](../library/01-api-design/api-counts.md) |
| `global-design` | **Global design** | [General Principles](http://deliveroo.engineering/guidelines/api-design/#general-principles) | "We choose to adopt three general principles. Here’s a shortcut to remember:
RESTful, Hypermedia, Fine-grained" | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [API and domain modelling](http://deliveroo.engineering/guidelines/api-design/#api-and-domain-modelling) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [External-facing APIs](http://deliveroo.engineering/guidelines/api-design/#external-facing) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Mobile-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `versioning` | **Updates and Versioning** | [Content type negotiation](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation) | "The Accept header may include the v parameter to specify the API version requested; see “Versioning” below." | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) | "a new (breaking/major) version of a set of public-facing APIS should be an entirely new domain (e.g. v2.my-api.example.com), with entirely segregated infrastructure." | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-pagination` | **Pagination** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-pagination` | **Pagination** | [Query parameters](http://deliveroo.engineering/guidelines/api-design/#query-parameters) | "Those should accept the page and per_page parameters" | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | Standard rule | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-internationalization` | **Internationalization** | [Internationalisation (i18n)](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n) | Standard rule | [`data-internationalization.md`](../library/05-data/data-internationalization.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |
| `errors` | **Errors** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-delete` | **DELETE** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-patch` | **PATCH** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "409 Conflict: PATCH and PUT failures with unique fields" | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "POST and PATCH should never result in a 200 (generally 201, occasionally 202)." | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "POST and PATCH should never result in a 200 (generally 201, occasionally 202)." | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Resource lifecycle](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-caching` | **Caching** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-caching` | **Caching** | [Mutable resources](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Content type negotiation](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [Resource lifecycle](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) | "either If-Unmodified-Since or If-Match" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning) | "Clients may specify a desired version as the v parameter of the Accept header" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning) | "If the version was unspecified, the server should use the latest available version, and specify the Vary header" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Internationalisation (i18n)](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n) | "Localisation is inherently a representation concern, and HTTP mandates such concerns to be addressed using protocol headers." | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) | "Responses should include a Last-Modified or ETag header, and may include both" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Compression](http://deliveroo.engineering/guidelines/api-design/#compression) | "Servers may support the Accept-Encoding header for compression purposes, but this is not mandatory." | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http` | **HTTP protocol** | [Compression](http://deliveroo.engineering/guidelines/api-design/#compression) | "Servers may support the Accept-Encoding header for compression purposes, but this is not mandatory." | [`http.md`](../library/08-http-protocol/http.md) |

### Category: HTTP Status Redirection

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-300` | **300 Multiple Choices** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-300.md`](../library/09-http-status-redirection/http-status-300.md) |
| `http-status-301` | **301 Moved Permanently** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-301.md`](../library/09-http-status-redirection/http-status-301.md) |
| `http-status-302` | **302 Found** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-302.md`](../library/09-http-status-redirection/http-status-302.md) |
| `http-status-304` | **304 Not Modified** | [Resource lifecycle](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle) | Standard rule | [`http-status-304.md`](../library/09-http-status-redirection/http-status-304.md) |
| `http-status-307` | **307 Temporary Redirect** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-307.md`](../library/09-http-status-redirection/http-status-307.md) |
| `http-status-308` | **308 Permanent Redirect** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-308.md`](../library/09-http-status-redirection/http-status-308.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) | "200 OK, if the modification succeeded" | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "POST and PATCH should never result in a 200 (generally 201, occasionally 202)." | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "201 Created if the entity was successfully created" | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-201` | **201 Created** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "POST and PATCH should never result in a 200 (generally 201, occasionally 202)." | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-202` | **202 Accepted** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "POST and PATCH should never result in a 200 (generally 201, occasionally 202)." | [`http-status-202.md`](../library/11-http-status-success/http-status-202.md) |
| `http-status-203` | **203 Non-Authoritative Information** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-203.md`](../library/11-http-status-success/http-status-203.md) |
| `http-status-204` | **204 No Content** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | "204 No Content if the entity was successfully destroyed" | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |
| `http-status-206` | **206 Partial Content** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-206.md`](../library/11-http-status-success/http-status-206.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "400 Bad Request if the entity cannot be created with the information in the request body" | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-400` | **400 Bad Request** | [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) | "400 Bad Request, if the modification failed." | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-400` | **400 Bad Request** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "400 Bad Request: bad syntax (unknown route, missing required fields or parameters, unknown extra parameters, bad field or parameter values)." | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-400` | **400 Bad Request** | [Parameters](http://deliveroo.engineering/guidelines/api-design/#parameters) | "Those endpoints may return 400 Bad Request if parameters are specified." | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-404` | **404 Not Found** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | "404 Not Found if the entity does not exist" | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "404 Not Found: the specified entity does not exist (unknown routes should not 404)." | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-406` | **406 Not Acceptable** | [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning) | "The service should respond with status 406, Not Acceptable if the version is unavailable." | [`http-status-406.md`](../library/12-http-status-user-error/http-status-406.md) |
| `http-status-409` | **409 Conflict** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "409 Conflict: PATCH and PUT failures with unique fields" | [`http-status-409.md`](../library/12-http-status-user-error/http-status-409.md) |
| `http-status-410` | **410 Gone** | [RESTful](http://deliveroo.engineering/guidelines/api-design/#restful) | Standard rule | [`http-status-410.md`](../library/12-http-status-user-error/http-status-410.md) |
| `http-status-410` | **410 Gone** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | "410 Gone if the entity is known to have existed but no longer does." | [`http-status-410.md`](../library/12-http-status-user-error/http-status-410.md) |
| `http-status-410` | **410 Gone** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "Responses with the following status codes should specify a Cache-Control header" | [`http-status-410.md`](../library/12-http-status-user-error/http-status-410.md) |
| `http-status-412` | **412 Precondition Failed** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "412 Precondition Failed if e.g. the resource wouldn’t statisfy some uniqueness criterion" | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-412` | **412 Precondition Failed** | [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) | "412 Precondition failed, when failing to honour If-Match or If-Unmodified-Since headers." | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-412` | **412 Precondition Failed** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | "412 Precondition Failed" | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-412` | **412 Precondition Failed** | [Return codes and errors](http://deliveroo.engineering/guidelines/api-design/#return-codes-and-errors) | "412 Precondition failed: resource versioning issues." | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-415` | **415 Unsupported Media Type** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "415 Unsupported if using versioning and the server doesn’t support the specified version" | [`http-status-415.md`](../library/12-http-status-user-error/http-status-415.md) |
| `http-status-415` | **415 Unsupported Media Type** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "415 Unsupported if using versioning and the server doesn’t support the specified version." | [`http-status-415.md`](../library/12-http-status-user-error/http-status-415.md) |
| `http-status-415` | **415 Unsupported Media Type** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | "415 Unsupported if using versioning and the server doesn’t support the specified version." | [`http-status-415.md`](../library/12-http-status-user-error/http-status-415.md) |
| `http-status-428` | **428 Precondition Required** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "428 Precondition Required, when the request lack a If-* header." | [`http-status-428.md`](../library/12-http-status-user-error/http-status-428.md) |
| `http-status-429` | **429 Too Many Requests** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "429 Too Many Requests if the service throttles requests from an aggressive client" | [`http-status-429.md`](../library/12-http-status-user-error/http-status-429.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [Hypermedia / HATEOAS](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | "should link to relations next and prev for pagination purposes" | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) | "While it is still recommended to include hypermedia links to encourage good practices, is it not mandated like for internal services." | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Hypermedia / HATEOAS](http://deliveroo.engineering/guidelines/api-design/#hypermedia--hateoas) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | "should link to relations next and prev for pagination purposes" | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis) | "While it is still recommended to include hypermedia links to encourage good practices, is it not mandated like for internal services." | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `documentation` | **Documentation** | [Documenting APIs](http://deliveroo.engineering/guidelines/api-design/#documenting-apis) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `performance` | **Performance and bandwidth** | [Compression](http://deliveroo.engineering/guidelines/api-design/#compression) | Standard rule | [`performance.md`](../library/14-miscellaneous/performance.md) |
| `performance` | **Performance and bandwidth** | [Mobile-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#mobile-friendly-apis) | Standard rule | [`performance.md`](../library/14-miscellaneous/performance.md) |
| `query-parameter` | **Query parameters** | [Parameters](http://deliveroo.engineering/guidelines/api-design/#parameters) | Standard rule | [`query-parameter.md`](../library/14-miscellaneous/query-parameter.md) |
| `rate-limiting` | **Rate limiting** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | "429 Too Many Requests if the service throttles requests from an aggressive client" | [`rate-limiting.md`](../library/14-miscellaneous/rate-limiting.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming` | **Naming** | [Naming](http://deliveroo.engineering/guidelines/api-design/#naming) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-creation` | **Create resource** | [POST, creating entities](http://deliveroo.engineering/guidelines/api-design/#post-creating-entities) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [DELETE, destroying entities](http://deliveroo.engineering/guidelines/api-design/#delete-destroying-entities) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Fine-grained](http://deliveroo.engineering/guidelines/api-design/#fine-grained) | "Embedding entities should be avoided" | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Conventions on responses](http://deliveroo.engineering/guidelines/api-design/#conventions-on-responses) | "In addition, embedded entities (using _embedded) should be avoided when possible" | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | "Exceptionally, a collection representation, may embedded representations of the linked resources..." | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-relationships` | **Relationships** | [None](http://deliveroo.engineering/guidelines/api-design/#listing-relations) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource` | **Resource** | [Listing intrinsic properties](http://deliveroo.engineering/guidelines/api-design/#listing-intrinsic-properties) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Normalising concepts](http://deliveroo.engineering/guidelines/api-design/#normalising-concepts) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Single-resource representation](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-id` | **Resource ID** | [Single-resource representation](http://deliveroo.engineering/guidelines/api-design/#single-resource-representation) | "A single resource representation should have a numeric id field" | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-retrieve` | **Retrieve resource** | [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) | "Partial responses (e.g. with field query param) should not be returned." | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-change-tracking` | **Track change** | [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) | "Responses should include a Last-Modified or ETag header, and may include both" | [`resource-change-tracking.md`](../library/16-resources/resource-change-tracking.md) |
| `resource-url-format` | **URL format** | [Path segments](http://deliveroo.engineering/guidelines/api-design/#path-segments) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [Mutable resources](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [PATCH, mutating entities](http://deliveroo.engineering/guidelines/api-design/#patch-mutating-entities) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |
| `resource-update-partial` | **Update resource partially** | [Mutable resources](http://deliveroo.engineering/guidelines/api-design/#mutable-resources) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [None](http://deliveroo.engineering/guidelines/api-design/#security) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Caching](http://deliveroo.engineering/guidelines/api-design/#caching) | "External APIs must always use TLS so only direct clients or trusted intermediaries who have our certificates (CDNs, typically) will be able to view the content" | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Deliveroo**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Collection Resources, Data, Error handling`.
* **Contract Invariant**: Enforce strict adherence to Deliveroo's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Deliveroo's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.