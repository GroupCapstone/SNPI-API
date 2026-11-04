# Guideline: RESTFul API Guidelines

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Zalando**
> **Canonical Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 74 topics across 17 categories

---

## 1. Executive Summary & Architectural Philosophy

**Zalando** published the *RESTFul API Guidelines* as an authoritative engineering standard.

> Zalando's community-standard microservices REST guidelines (74 topics covered). Mandates OpenAPI 3.0 contract-first engineering, bounded context API counts (4-8 resources), RFC 7807 error format, and backward compatibility rules.

---

## 2. Analyzed Design Topics by Category

This guideline covers **74 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `api-counts` | **API counts** | [Limit of Resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-resources) | "a typical range of resources for a well-designed API is between 4 and 8" | [`api-counts.md`](../library/01-api-design/api-counts.md) |
| `global-design` | **Global design** | [Design Principles](http://zalando.github.io/restful-api-guidelines/design-principles/DesignPrinciples.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [API First](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-api-first-define-apis-using-openapi) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Deprecation](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [API Discovery](http://zalando.github.io/restful-api-guidelines/api-discovery/ApiDiscovery.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Compatibility](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Don’t Break Backward Compatibility](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-dont-break-backward-compatibility) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Avoid Versioning](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#should-avoid-versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Use Media Type Versioning](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Events](http://zalando.github.io/restful-api-guidelines/events/events.html) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `notifications-server-events` | **Notifying API consumers** | [Events](http://zalando.github.io/restful-api-guidelines/events/events.html) | Standard rule | [`notifications-server-events.md`](../library/03-asynchronicity/notifications-server-events.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) | "q — default query parameter" | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) | "limit, cursor, offset" | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-pagination` | **Pagination** | [Pagination](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [GET](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) | "reads a resource or set of resource instances" | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |
| `collection-sorting` | **Sorting a collection** | [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) | "sort — comma-separated list of fields to sort" | [`collection-sorting.md`](../library/04-collection-resources/collection-sorting.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Property Values](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Date property values should conform to RFC 3399](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Time durations and intervals could conform to ISO 8601](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Data Formats](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Common Data Objects](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [Date property values should conform to RFC 3399](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Time durations and intervals could conform to ISO 8601](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Use Standard Date and Time Formats](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#must-use-standard-date-and-time-formats) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [HTTP headers](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers) | "Use the HTTP date format defined in RFC 7231" | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-null` | **Null data** | [Property values](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-values) | Standard rule | [`data-format-null.md`](../library/05-data/data-format-null.md) |
| `data-format-null` | **Null data** | [Null values should have their fields removed](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-null-values-should-have-their-fields-removed) | Standard rule | [`data-format-null.md`](../library/05-data/data-format-null.md) |
| `data-format-null` | **Null data** | [Boolean property values must not be null](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-boolean-property-values-must-not-be-null) | Standard rule | [`data-format-null.md`](../library/05-data/data-format-null.md) |
| `data-format-null` | **Null data** | [Empty array values should not be null](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-empty-array-values-should-not-be-null) | Standard rule | [`data-format-null.md`](../library/05-data/data-format-null.md) |
| `data-standards` | **Standards data** | [Standards could be used for Language, Country and Currency](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-standards-could-be-used-for-language-country-and-currency) | Standard rule | [`data-standards.md`](../library/05-data/data-standards.md) |
| `data-standards` | **Standards data** | [Use Standards for Country, Language and Currency Codes](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-standards-for-country-language-and-currency-codes) | Standard rule | [`data-standards.md`](../library/05-data/data-standards.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Providing Error Documentation](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-providing-error-documentation) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |
| `http-status-standard-error` | **Error format** | [Use Problem JSON](http://zalando.github.io/restful-api-guidelines/common-data-objects/CommonDataObjects.html#must-use-problem-json) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [DELETE](http://zalando.github.io/restful-api-guidelines/http/Http.html#delete) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [GET](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [HEAD](http://zalando.github.io/restful-api-guidelines/http/Http.html#head) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [Use HTTP Methods Correctly](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-http-methods-correctly) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods` | **HTTP methods** | [HTTP Methods must Fulfill Safeness and Idempotency Properties](http://zalando.github.io/restful-api-guidelines/http/Http.html#must--http-methods-must-fulfill-safeness-and-idempotency-properties) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-options` | **OPTIONS** | [OPTIONS](http://zalando.github.io/restful-api-guidelines/http/Http.html#options) | Standard rule | [`http-methods-options.md`](../library/07-http-methods/http-methods-options.md) |
| `http-methods-patch` | **PATCH** | [PATCH](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [POST](http://zalando.github.io/restful-api-guidelines/http/Http.html#post) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [PUT](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Support the ETag Header](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#could-support-the-etag-header) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Use Media Type Versioning](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Modify the Content-Type for Embedded Resources](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Use Application-Specific Content Types](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#could-use-applicationspecific-content-types) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [You Must Hyphenate HTTP Headers](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-you-must-hyphenate-http-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Prefer Hyphenated-Pascal-Case for HTTP header Fields](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#should-prefer-hyphenatedpascalcase-for-http-header-fields) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Use Standardized Headers](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-standardized-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Use 429 with Headers for Rate Limits](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [HTTP headers](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers) | "Use the HTTP date format defined in RFC 7231" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Common Headers](http://zalando.github.io/restful-api-guidelines/headers/CommonHeaders.html) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Proprietary Headers](http://zalando.github.io/restful-api-guidelines/headers/ProprietaryHeaders.html) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Add a Warning Header to Responses](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#should-add-a-warning-header-to-responses) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Use Meaningful HTTP Status Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-meaningful-http-status-codes) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http` | **HTTP protocol** | [HTTP](http://zalando.github.io/restful-api-guidelines/) | Standard rule | [`http.md`](../library/08-http-protocol/http.md) |

### Category: HTTP Status Redirection

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-301` | **301 Moved Permanently** | [Redirection Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) | Standard rule | [`http-status-301.md`](../library/09-http-status-redirection/http-status-301.md) |
| `http-status-302` | **302 Found** | [HTTP Status 302](http://zalando.github.io/restful-api-guidelines/) | Standard rule | [`http-status-302.md`](../library/09-http-status-redirection/http-status-302.md) |
| `http-status-303` | **303 See Other** | [Redirection Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) | Standard rule | [`http-status-303.md`](../library/09-http-status-redirection/http-status-303.md) |
| `http-status-304` | **304 Not Modified** | [Redirection Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#redirection-codes) | Standard rule | [`http-status-304.md`](../library/09-http-status-redirection/http-status-304.md) |

### Category: HTTP Status Server Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-500` | **500 Internal Server Error** | [Server Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) | Standard rule | [`http-status-500.md`](../library/10-http-status-server-error/http-status-500.md) |
| `http-status-501` | **501 Not Implemented** | [Server Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) | Standard rule | [`http-status-501.md`](../library/10-http-status-server-error/http-status-501.md) |
| `http-status-503` | **503 Service Unavailable** | [Server Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#server-side-error-codes) | Standard rule | [`http-status-503.md`](../library/10-http-status-server-error/http-status-503.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [Success Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [Success Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-202` | **202 Accepted** | [Success Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) | Standard rule | [`http-status-202.md`](../library/11-http-status-success/http-status-202.md) |
| `http-status-204` | **204 No Content** | [Success Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#success-codes) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-401` | **401 Unauthorized** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-401.md`](../library/12-http-status-user-error/http-status-401.md) |
| `http-status-403` | **403 Forbidden** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-403.md`](../library/12-http-status-user-error/http-status-403.md) |
| `http-status-404` | **404 Not Found** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-405` | **405 Method Not Allowed** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-405.md`](../library/12-http-status-user-error/http-status-405.md) |
| `http-status-406` | **406 Not Acceptable** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-406.md`](../library/12-http-status-user-error/http-status-406.md) |
| `http-status-408` | **408 Request Timeout** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-408.md`](../library/12-http-status-user-error/http-status-408.md) |
| `http-status-409` | **409 Conflict** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-409.md`](../library/12-http-status-user-error/http-status-409.md) |
| `http-status-412` | **412 Precondition Failed** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-415` | **415 Unsupported Media Type** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-415.md`](../library/12-http-status-user-error/http-status-415.md) |
| `http-status-423` | **423 Locked** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-423.md`](../library/12-http-status-user-error/http-status-423.md) |
| `http-status-428` | **428 Precondition Required** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-428.md`](../library/12-http-status-user-error/http-status-428.md) |
| `http-status-429` | **429 Too Many Requests** | [Client Side Error Codes](http://zalando.github.io/restful-api-guidelines/http/Http.html#client-side-error-codes) | Standard rule | [`http-status-429.md`](../library/12-http-status-user-error/http-status-429.md) |
| `http-status-429` | **429 Too Many Requests** | [Use 429 with Headers for Rate Limits](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits) | Standard rule | [`http-status-429.md`](../library/12-http-status-user-error/http-status-429.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [Use Pagination Links Where Applicable](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Hypermedia](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Use a well-defined subset of HAL](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Use Pagination Links Where Applicable](http://zalando.github.io/restful-api-guidelines/pagination/Pagination.html#could-use-pagination-links-where-applicable) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Use a well-defined subset of HAL](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Use Custom Link Relations](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `documentation` | **Documentation** | [Provide External Documentation](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#should-provide-external-documentation) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Reflect Deprecation in API Definition](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#must-reflect-deprecation-in-api-definition) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `performance` | **Performance and bandwidth** | [Performance](http://zalando.github.io/restful-api-guidelines/performance/Performance.html) | Standard rule | [`performance.md`](../library/14-miscellaneous/performance.md) |
| `query-parameter` | **Query parameters** | [Query parameters must be snake_case (never camelCase)](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-query-parameters-must-be-snakecase-never-camelcase) | Standard rule | [`query-parameter.md`](../library/14-miscellaneous/query-parameter.md) |
| `query-parameter` | **Query parameters** | [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) | Standard rule | [`query-parameter.md`](../library/14-miscellaneous/query-parameter.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [Property names must be snake_case](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#must-property-names-must-be-snakecase-and-never-camelcase) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming-language` | **Language** | [Write APIs in U.S. English](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-write-apis-in-us-english) | Standard rule | [`naming-language.md`](../library/15-naming/naming-language.md) |
| `naming` | **Naming** | [Property naming](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#property-naming) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [API Naming](http://zalando.github.io/restful-api-guidelines/naming/Naming.html) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Use Domain-Specific Resource Names](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-use-domainspecific-resource-names) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [Avoid Actions — Think About Resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-avoid-actions-—-think-about-resources) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-creation` | **Create resource** | [POST](http://zalando.github.io/restful-api-guidelines/http/Http.html#post) | "creates a resource instance" | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [DELETE](http://zalando.github.io/restful-api-guidelines/http/Http.html#delete) | "deletes a resource instance" | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) | "embed — to expand embedded entities" | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Define useful resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources) | Standard rule | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Allow Optional Embedding of Sub-Resources](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#should-allow-optional-embedding-of-subresources) | Standard rule | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Modify the Content-Type for Embedded Resources](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-modify-the-contenttype-for-embedded-resources) | Standard rule | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-relationships` | **Relationships** | [Use a well-defined subset of HAL](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-use-a-welldefined-subset-of-hal) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-relationships` | **Relationships** | [Use Custom Link Relations](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#could-use-custom-link-relations) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-relationships` | **Relationships** | [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-replacement` | **Replace resource** | [PUT](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) | "fully uploads an entity" | [`resource-replacement.md`](../library/16-resources/resource-replacement.md) |
| `resource` | **Resource** | [resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-retrieve` | **Retrieve resource** | [GET](http://zalando.github.io/restful-api-guidelines/http/Http.html#get) | "reads a resource or set of resource instances" | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Use Conventional Query Strings](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-conventional-query-strings) | "fields — to retrieve a subset of fields" | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Define useful resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-define-useful-resources) | Standard rule | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Support Filtering of Resource Fields](http://zalando.github.io/restful-api-guidelines/performance/Performance.html#should-support-filtering-of-resource-fields) | Standard rule | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-url-format` | **URL format** | [Path segments must be lowercase separate words with hyphens](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-path-segments-must-be-lowercase-separate-words-with-hyphens) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Always Pluralize Resource Names](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-always-pluralize-resource-names) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [First Path segment May be /api](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-first-path-segment-may-be-api) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Avoid Trailing Slashes](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-avoid-trailing-slashes) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Limit of Sub-Resource Levels](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-subresource-levels) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [PUT](http://zalando.github.io/restful-api-guidelines/http/Http.html#put) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [PATCH](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [PATCH](http://zalando.github.io/restful-api-guidelines/http/Http.html#patch) | "only a specific subset of resource fields are replaced" | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [Security](http://zalando.github.io/restful-api-guidelines/security/Security.html) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Secure Endpoints with OAuth 2.0](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-secure-endpoints-with-oauth-20) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Define and Assign Access Rights (Scopes)](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-define-and-assign-access-rights-scopes) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Zalando**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Asynchronicity, Collection Resources, Data`.
* **Contract Invariant**: Enforce strict adherence to Zalando's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Zalando's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.