# Guideline: Haufe API style guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Haufe**
> **Canonical Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 61 topics across 16 categories

---

## 1. Executive Summary & Architectural Philosophy

**Haufe** published the *Haufe API style guide* as an authoritative engineering standard.

> Haufe Group's exhaustive European enterprise style guide covering 61 design topics. Champions domain-driven API design, rich hypermedia, comprehensive query options, pagination, and multi-tenant SaaS integration.

---

## 2. Analyzed Design Topics by Category

This guideline covers **61 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `global-design` | **Global design** | [Introduction](https://github.com/Haufe-Lexware/api-style-guide/blob/master/introduction/introduction.md) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [General Guidelines](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Message Schema and Postel's Law](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [API Modelling and Design Process](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#api-modelling-and-design-process) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [API Design Review Process](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-review-process/api-design-review-process.md) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Message Schema and Postel's Law](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Version](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md#version) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Collection Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [Filtering](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#filtering) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-filtering` | **Filtering** | [Time selection](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#time-selection) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-filtering` | **Filtering** | [Search](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [Paging](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#paging) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [Get List of resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources) | Standard rule | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |
| `collection-sorting` | **Sorting a collection** | [Sorting](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#sorting) | Standard rule | [`collection-sorting.md`](../library/04-collection-resources/collection-sorting.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Hypermedia Response Format](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Type Formatting](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Message Schema and Postel's Law](https://github.com/Haufe-Lexware/api-style-guide/blob/master/message-schema/message-schema.md) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [Dates and Times](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#dates-and-times) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-standards` | **Standards data** | [Currency](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#currency) | "3-character ISO-4217" | [`data-standards.md`](../library/05-data/data-standards.md) |
| `data-standards` | **Standards data** | [Country](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#country) | "ISO 3166-1-alpha-2" | [`data-standards.md`](../library/05-data/data-standards.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Error handling](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |
| `errors` | **Errors** | [Error handling](https://github.com/Haufe-Lexware/api-style-guide/blob/master/error-handling/error-handling.md) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [Get List of resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#get-list-of-resources) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [Read Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods` | **HTTP methods** | [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-patch` | **PATCH** | [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [Update Partial Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Create New Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Using POST (Search)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/search/search.md#using-post) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [HTTP Verbs](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-verbs/http-verbs.md) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [Update Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [Create New Resource - Consumer Supplied Identifier](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Caching](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-headers` | **HTTP Headers** | [Expires HTTP Header](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#expires-http-header) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [ETag](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#etag) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Mapping Response Codes For Success and Failure](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#mapping-response-codes-for-success-and-failure) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Redirection

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-304` | **304 Not Modified** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-304.md`](../library/09-http-status-redirection/http-status-304.md) |

### Category: HTTP Status Server Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-500` | **500 Internal Server Error** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-500.md`](../library/10-http-status-server-error/http-status-500.md) |
| `http-status-501` | **501 Not Implemented** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-501.md`](../library/10-http-status-server-error/http-status-501.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [HTTP Status (Get List of resources)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [HTTP Status (Read Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-204` | **204 No Content** | [HTTP Status (Update Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |
| `http-status-204` | **204 No Content** | [HTTP Status (Update Partial Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |
| `http-status-204` | **204 No Content** | [Delete Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |
| `http-status-204` | **204 No Content** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [HTTP Status (Get List of resources)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-400` | **400 Bad Request** | [HTTP Status (Update Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-400` | **400 Bad Request** | [HTTP Status (Update Partial Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-400` | **400 Bad Request** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-401` | **401 Unauthorized** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-401.md`](../library/12-http-status-user-error/http-status-401.md) |
| `http-status-403` | **403 Forbidden** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-403.md`](../library/12-http-status-user-error/http-status-403.md) |
| `http-status-404` | **404 Not Found** | [HTTP Status (Get List of resources)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [HTTP Status (Read Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-1) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [Delete Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) | "404 Not Found HTTP status should not be utilized" | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-405` | **405 Method Not Allowed** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-405.md`](../library/12-http-status-user-error/http-status-405.md) |
| `http-status-406` | **406 Not Acceptable** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-406.md`](../library/12-http-status-user-error/http-status-406.md) |
| `http-status-408` | **408 Request Timeout** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-408.md`](../library/12-http-status-user-error/http-status-408.md) |
| `http-status-409` | **409 Conflict** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-409.md`](../library/12-http-status-user-error/http-status-409.md) |
| `http-status-410` | **410 Gone** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-410.md`](../library/12-http-status-user-error/http-status-410.md) |
| `http-status-411` | **411 Length Required** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-411.md`](../library/12-http-status-user-error/http-status-411.md) |
| `http-status-412` | **412 Precondition Failed** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-415` | **415 Unsupported Media Type** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-415.md`](../library/12-http-status-user-error/http-status-415.md) |
| `http-status-422` | **422 Unprocessable Entity** | [HTTP Status (Update Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-2) | Standard rule | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |
| `http-status-422` | **422 Unprocessable Entity** | [HTTP Status (Update Partial Single Resource)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#http-status-3) | Standard rule | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |
| `http-status-422` | **422 Unprocessable Entity** | [HTTP Status Codes](https://github.com/Haufe-Lexware/api-style-guide/blob/master/http-status-codes/http-status-codes.md) | Standard rule | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [Expanding Resources Through Hypermedia Linking](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Support Hypermedia](https://github.com/Haufe-Lexware/api-style-guide/blob/master/rest-principles/rest-principles.md#support-hypermedia) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Hypermedia and REST](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Relationships and Sub-Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Hypermedia Links (Pagination)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Hypermedia Response Format](https://github.com/Haufe-Lexware/api-style-guide/blob/master/response-format/response-format.md) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Expanding Resources Through Hypermedia Linking](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#expanding-resources-through-hypermedia-linking) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Hypermedia and REST](https://github.com/Haufe-Lexware/api-style-guide/blob/master/hypermedia-and-rest/hypermedia-and-rest.md) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Relationships and Sub-Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Hypermedia Links (Pagination)](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#hypermedia-links) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `developer-experience` | **Developer experience** | [Documentation](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `documentation` | **Documentation** | [Every API MUST be described using a formal API description language](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#every-api-must-be-described-using-a-formal-api-description-language) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Documentation](https://github.com/Haufe-Lexware/api-style-guide/blob/master/documentation/documentation.md) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming` | **Naming** | [Building Your Resource Taxonomy](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Resource naming](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#resource-naming) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-creation` | **Create resource** | [Create New Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation-with-id` | **Create resource with a specific ID** | [Create New Resource - Consumer Supplied Identifier](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#create-new-resource---consumer-supplied-identifier) | Standard rule | [`resource-creation-with-id.md`](../library/16-resources/resource-creation-with-id.md) |
| `resource-deletion` | **Delete resource** | [Delete Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#delete-single-resource) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-relationships` | **Relationships** | [How to Handle Resource Relationships and Composition](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#how-to-handle-resource-relationships-and-composition) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-relationships` | **Relationships** | [Relationships and Sub-Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/relationships-and-sub-resources/relationships-and-sub-resources.md) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-replacement` | **Replace resource** | [Update Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) | Standard rule | [`resource-replacement.md`](../library/16-resources/resource-replacement.md) |
| `resource` | **Resource** | [Building Your Resource Taxonomy](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#building-your-resource-taxonomy) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Defining Resource Lifecycles](https://github.com/Haufe-Lexware/api-style-guide/blob/master/api-design-process/api-design-process.md#defining-resource-lifecycles) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Resources](https://github.com/Haufe-Lexware/api-style-guide/blob/master/resources/resources.md) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-id` | **Resource ID** | [Composite Keys](https://github.com/Haufe-Lexware/api-style-guide/blob/master/faq/faq.md#composite-keys) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-state` | **Resource's state** | [Resource's state](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md) | Standard rule | [`resource-state.md`](../library/16-resources/resource-state.md) |
| `resource-retrieve` | **Retrieve resource** | [Read Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#read-single-resource) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Field selection](https://github.com/Haufe-Lexware/api-style-guide/blob/master/filtering-sorting-field-selection-and-paging/filtering-sorting-field-selection-and-paging.md#field-selection) | Standard rule | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-url-format` | **URL format** | [URI Components](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [Update Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-single-resource) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [Update Partial Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [Update Partial Single Resource](https://github.com/Haufe-Lexware/api-style-guide/blob/master/collection-resources/collection-resources.md#update-partial-single-resource) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security-data` | **Data privacy** | [Security and Authentication](https://github.com/Haufe-Lexware/api-style-guide/blob/master/security-and-authentication/security-and-authentication.md) | Standard rule | [`security-data.md`](../library/17-security/security-data.md) |
| `security` | **Security** | [API clients MUST use an API Key](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#api-clients-must-use-an-api-key) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Haufe**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Collection Resources, Data, Error handling`.
* **Contract Invariant**: Enforce strict adherence to Haufe's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Haufe's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.