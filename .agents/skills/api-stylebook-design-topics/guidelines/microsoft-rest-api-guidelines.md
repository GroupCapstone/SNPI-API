# Guideline: Microsoft REST API Guidelines

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Microsoft**
> **Canonical Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 43 topics across 12 categories

---

## 1. Executive Summary & Architectural Philosophy

**Microsoft** published the *Microsoft REST API Guidelines* as an authoritative engineering standard.

> Microsoft's comprehensive enterprise REST standards used across Azure, Microsoft 365, and Graph APIs. Governs OData-style query filtering ($filter, $top, $skip), consistent JSON schema structures, standard error codes, and batching.

---

## 2. Analyzed Design Topics by Category

This guideline covers **43 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `global-design` | **Global design** | [Introduction](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#3-introduction) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [Interpreting The Guidelines](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#4-interpreting-the-guidelines) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [When to version](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#122-when-to-version) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Definition of a breaking change](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#123-definition-of-a-breaking-change) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Guidelines for existing services and versioning of services](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#42-guidelines-for-existing-services-and-versioning-of-services) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Versioning](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#12-versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Long running API faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Long running operations](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#13-long-running-operations) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Operations resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Operation resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Operation tombstones](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [The typical flow, polling](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [The typical flow, push notifications](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Retry-After](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `notifications-server-events` | **Notifying API consumers** | [The typical flow, push notifications](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) | Standard rule | [`notifications-server-events.md`](../library/03-asynchronicity/notifications-server-events.md) |
| `notifications-server-events` | **Notifying API consumers** | [Push notifications via webhooks](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#14-push-notifications-via-webhooks) | Standard rule | [`notifications-server-events.md`](../library/03-asynchronicity/notifications-server-events.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#9-collections) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [Filtering](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#97-filtering) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [Big collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-pagination` | **Pagination** | [Pagination](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#98-pagination) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-sorting` | **Sorting a collection** | [Variable order rule](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#62-variable-order-rule) | Standard rule | [`collection-sorting.md`](../library/04-collection-resources/collection-sorting.md) |
| `collection-sorting` | **Sorting a collection** | [Sorting collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#96-sorting-collections) | Standard rule | [`collection-sorting.md`](../library/04-collection-resources/collection-sorting.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Response Formats](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#710-response-formats) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [JSON standardizations](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#11-json-standardizations) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [Guidelines for dates and times](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#112-guidelines-for-dates-and-times) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [JSON serialization of dates and times](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#113-json-serialization-of-dates-and-times) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Durations](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#114-durations) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Intervals](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#115-intervals) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Repeating intervals](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#116-repeating-intervals) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Error condition responses](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |
| `errors` | **Errors** | [Errors](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |
| `errors` | **Errors** | [Faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |
| `errors` | **Errors** | [Long running API faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |
| `errors` | **Errors** | [Silent Fail Rule](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#63-silent-fail-rule) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |
| `errors` | **Errors** | [Unsupported requests](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#15-unsupported-requests) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-options` | **OPTIONS** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-options.md`](../library/07-http-methods/http-methods-options.md) |
| `http-methods-options` | **OPTIONS** | [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) | Standard rule | [`http-methods-options.md`](../library/07-http-methods/http-methods-options.md) |
| `http-methods-patch` | **PATCH** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [PATCH](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [POST](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Changing collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [POST (Long running operations)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1322-post) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [POST, hybrid model (Long running operations)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1323-post-hybrid-model) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [Changing collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [PUT (Long running operations)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1321-put) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) | "If-Match, If-None-Match, If-Range" | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-caching` | **Caching** | [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) | "ETag" | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-caching` | **Caching** | [Retention policy for operation results](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#133-retention-policy-for-operation-results) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) | "Accept Content Type" | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) | "Content Type" | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Clients-specified response format](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7101-clients-specified-response-format) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [POST](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) | "POST operations SHOULD support the Location response header" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Custom Headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#77-custom-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Specifying headers as query parameters](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#78-specifying-headers-as-query-parameters) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Errors](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#51-errors) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [Faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#52-faults) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [HTTP Status Codes](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#711-http-status-codes) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http` | **HTTP protocol** | [HTTP protocol](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) | Standard rule | [`http.md`](../library/08-http-protocol/http.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia-read` | **Hypermedia (read)** | [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Big collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#94-big-collections) | "the serialization payload MUST contain the opaque URL for the next page" | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `cors` | **CORS** | [CORS](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#8-cors) | Standard rule | [`cors.md`](../library/14-miscellaneous/cors.md) |
| `developer-experience` | **Developer experience** | [Client Guidance](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#6-client-guidance) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `developer-experience` | **Developer experience** | [Client library optional](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#712-client-library-optional) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `documentation` | **Documentation** | [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers) | "In addition, services SHOULD include a Link header (see RFC 5988) to point to documentation for the resource" | [`documentation.md`](../library/14-miscellaneous/documentation.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [Operations resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [Operation resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [Operation tombstones](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [The typical flow, polling](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [The typical flow, push notifications](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [Retry-After](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-multiple` | **Batch Bulk** | [Batch Bulk](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) | Standard rule | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-creation` | **Create resource** | [POST](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation` | **Create resource** | [Changing collections](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#95-changing-collections) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation-with-id` | **Create resource with a specific ID** | [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) | Standard rule | [`resource-creation-with-id.md`](../library/16-resources/resource-creation-with-id.md) |
| `resource-id-semantic` | **ID with semantic** | [Canonical identifier](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier) | Standard rule | [`resource-id-semantic.md`](../library/16-resources/resource-id-semantic.md) |
| `resource-id` | **Resource ID** | [Canonical identifier](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#73-canonical-identifier) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers) | "Prefer return=minimal, return=representation" | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers) | "Preference-Applied" | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-change-tracking` | **Track change** | [Delta queries](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#10-delta-queries) | Standard rule | [`resource-change-tracking.md`](../library/16-resources/resource-change-tracking.md) |
| `resource-url-format` | **URL format** | [URL Structure](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#71-url-structure) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [URL Length](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#72-url-length) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Collection URL patterns](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#93-collection-url-patterns) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [PATCH](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [PATCH](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#742-patch) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |
| `resource-update-partial` | **Update resource partially** | [Creating resources via PATCH (UPSERT semantics)](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#743-creating-resources-via-patch-upsert-semantics) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security-data` | **Data privacy** | [PII parameters](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#79-pii-parameters) | Standard rule | [`security-data.md`](../library/17-security/security-data.md) |
| `security` | **Security** | [Security](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#148-security) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Microsoft**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Asynchronicity, Collection Resources, Data`.
* **Contract Invariant**: Enforce strict adherence to Microsoft's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Microsoft's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.