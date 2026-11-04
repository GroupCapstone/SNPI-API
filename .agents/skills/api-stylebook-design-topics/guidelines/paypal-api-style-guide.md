# Guideline: API Style Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **PayPal**
> **Canonical Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 36 topics across 10 categories

---

## 1. Executive Summary & Architectural Philosophy

**PayPal** published the *API Style Guide* as an authoritative engineering standard.

> PayPal's financial REST API standards. Focuses on mission-critical payments, strong cryptographic security, idempotency keys, financial auditability, time-window selection queries, and complex search operations via POST.

---

## 2. Analyzed Design Topics by Category

This guideline covers **36 standardized API design topics** categorized below:

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `versioning` | **Updates and Versioning** | [Version](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#version) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection` | **Collection** | [Sub-Resource Collection](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-collection) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [Time Selection](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#time-selection) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-filtering` | **Filtering** | [Complex Operation - Search](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---search) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [Paging](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-pagination` | **Pagination** | [Paging (Complex Operation - Search)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#paging-1) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |
| `collection-sorting` | **Sorting a collection** | [Sorting](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sorting) | Standard rule | [`collection-sorting.md`](../library/04-collection-resources/collection-sorting.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-delete` | **DELETE** | [Delete Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods` | **HTTP methods** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-patch` | **PATCH** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Create New Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Read-only resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-only-resources) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-status` | **HTTP Statuses** | [HTTP Status (Collections)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [HTTP Status (Collections)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-204` | **204 No Content** | [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |
| `http-status-204` | **204 No Content** | [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |
| `http-status-204` | **204 No Content** | [Delete Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [HTTP Status (Collections)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-404` | **404 Not Found** | [HTTP Status (Collections)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [HTTP Status (Read Single Resource)](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#http-status-1) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-404` | **404 Not Found** | [Delete Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-422` | **422 Unprocessable Entity** | [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) | Standard rule | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [Paging Hypermedia Links](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Create New Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) | "Hypermedia links provide an easy way to get the URL of the newly created resource" | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Paging Hypermedia Links](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#hypermedia-links) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Create New Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) | "Hypermedia links provide an easy way to get the URL of the newly created resource" | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `performance` | **Performance and bandwidth** | [Performance and bandwidth](https://github.com/paypal/api-standards/blob/master/api-style-guide.md) | Standard rule | [`performance.md`](../library/14-miscellaneous/performance.md) |
| `query-parameter` | **Query parameters** | [Filtering](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#filtering) | Standard rule | [`query-parameter.md`](../library/14-miscellaneous/query-parameter.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming` | **Naming** | [Collection Resources](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#collection-resources) | "Collection resource names should be plural nouns" | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [Complex Operation](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-multiple` | **Batch Bulk** | [Complex Operation - Composite](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---composite) | Standard rule | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-creation` | **Create resource** | [Create New Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation-with-id` | **Create resource with a specific ID** | [Create New Resource - Consumer Supplied Identifier](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#create-new-resource---consumer-supplied-identifier) | Standard rule | [`resource-creation-with-id.md`](../library/16-resources/resource-creation-with-id.md) |
| `resource-deletion` | **Delete resource** | [Delete Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#delete-single-resource) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-replacement` | **Replace resource** | [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) | Standard rule | [`resource-replacement.md`](../library/16-resources/resource-replacement.md) |
| `resource` | **Resource** | [Read Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Sub-Resource Singleton](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#sub-resource-singleton) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-state` | **Resource's state** | [Complex Operation - Transient](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation---transient) | Standard rule | [`resource-state.md`](../library/16-resources/resource-state.md) |
| `resource-retrieve` | **Retrieve resource** | [Read Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#read-single-resource) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-url-format` | **URL format** | [URL Components](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#uri-components) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [Update Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-single-resource) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **PayPal**'s design guidelines:
* **Core Strengths**: High alignment with `API Lifecycle, Collection Resources, HTTP Methods, HTTP Protocol, HTTP Status Success`.
* **Contract Invariant**: Enforce strict adherence to PayPal's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply PayPal's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.