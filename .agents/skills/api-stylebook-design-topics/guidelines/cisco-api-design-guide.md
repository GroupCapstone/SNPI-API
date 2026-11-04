# Guideline: API Design Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Cisco**
> **Canonical Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 43 topics across 11 categories

---

## 1. Executive Summary & Architectural Philosophy

**Cisco** published the *API Design Guide* as an authoritative engineering standard.

> Cisco DevNet's engineering guide for enterprise networking, cloud controllers, and IoT platforms. Enforces rigorous filtering, sorting, authentication, and HTTP status code semantics across complex infrastructure systems.

---

## 2. Analyzed Design Topics by Category

This guideline covers **43 standardized API design topics** categorized below:

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `versioning` | **Updates and Versioning** | [3.13 Versioning](https://github.com/CiscoDevNet/api-design-guide#313-versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | "... prefer the native JSON boolean type ..." | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | "3.3.8 Date and time fields MUST be represented as strings and formatted according to RFC-3339" | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-null` | **Null data** | [JSON Attributes](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#json-attributes) | Standard rule | [`data-format-null.md`](../library/05-data/data-format-null.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [3.9 Status Codes](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [3.6.4 DELETE](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-alternative` | **Forbidden methods alternatives** | [3.7 Alternative Forms](https://github.com/CiscoDevNet/api-design-guide#37-alternative-forms) | Standard rule | [`http-methods-alternative.md`](../library/07-http-methods/http-methods-alternative.md) |
| `http-methods-get` | **GET** | [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [3.6.6 HEAD](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [3.6 HTTP Verbs](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods` | **HTTP methods** | [REST Methods](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#rest-methods) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-options` | **OPTIONS** | [3.6.7 OPTIONS](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`http-methods-options.md`](../library/07-http-methods/http-methods-options.md) |
| `http-methods-patch` | **PATCH** | [3.6.5 PATCH](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [3.6.1 POST](https://github.com/CiscoDevNet/api-design-guide#361-post) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [3.6.2 PUT](https://github.com/CiscoDevNet/api-design-guide#362-put) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [3.5.1 Standard Headers](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) | "ETag, If-Match, If-None-Match" | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [3.5.1 Standard Headers](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) | "Accept header, Content-Type header" | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [3.5 HTTP Headers](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [3.6.1 POST](https://github.com/CiscoDevNet/api-design-guide#361-post) | "Location header" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [3.9 Status Codes](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | "3.3.3 A resource identifier labeled "url" MUST be present in all RESTful API resource representations" | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | "3.3.3 A resource identifier labeled "url" MUST be present in all RESTful API resource representations" | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `api-chaining` | **API chaining** | [3.5.2 TrackingID Header](https://github.com/CiscoDevNet/api-design-guide#352-trackingid-header) | Standard rule | [`api-chaining.md`](../library/14-miscellaneous/api-chaining.md) |
| `documentation` | **Documentation** | [3.9 Status Codes](https://github.com/CiscoDevNet/api-design-guide#39-status-codes) | "3.9.4 Documentation of response payloads MUST NOT reveal internal implementation details of the server." | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [API Documentation](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#api-documentation) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `undo` | **Undo** | [3.6 HTTP Verbs](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | "*3.6.4.3 *The POST verb MAY be used to reverse the soft-delete of a resource, using an undelete parameter" | [`undo.md`](../library/14-miscellaneous/undo.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming-case` | **Case** | [URL Paths](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming` | **Naming** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | "3.3.11 With regard to JSON representation property names, and URL query parameters, services SHOULD..." | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [3.8 Action Resources](https://github.com/CiscoDevNet/api-design-guide#38-action-resources) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [3.6.1 POST](https://github.com/CiscoDevNet/api-design-guide#361-post) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-multiple` | **Batch Bulk** | [3.11 Bulk, Batch, and Multi-Result Operations](https://github.com/CiscoDevNet/api-design-guide#311-bulk-batch-and-multi-result-operations) | Standard rule | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-creation` | **Create resource** | [3.6.1 POST](https://github.com/CiscoDevNet/api-design-guide#361-post) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation-with-id` | **Create resource with a specific ID** | [3.6.2 PUT](https://github.com/CiscoDevNet/api-design-guide#362-put) | Standard rule | [`resource-creation-with-id.md`](../library/16-resources/resource-creation-with-id.md) |
| `resource-deletion` | **Delete resource** | [3.6.4 DELETE](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get) | "If a service supports the fields parameter, then a value of @reference, @narrow, or @wide SHOULD..." | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-id-semantic` | **ID with semantic** | [3.4.2 User Scoped Endpoints](https://github.com/CiscoDevNet/api-design-guide#342-user-scoped-endpoints) | Standard rule | [`resource-id-semantic.md`](../library/16-resources/resource-id-semantic.md) |
| `resource-replacement` | **Replace resource** | [3.6.2 PUT](https://github.com/CiscoDevNet/api-design-guide#362-put) | Standard rule | [`resource-replacement.md`](../library/16-resources/resource-replacement.md) |
| `resource` | **Resource** | [3 Guidelines](https://github.com/CiscoDevNet/api-design-guide#3-guidelines) | "Reference Representation, Narrow Representation, Wide Representation" | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-retrieve` | **Retrieve resource** | [3.6.3 GET](https://github.com/CiscoDevNet/api-design-guide#363-get) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [3.6.3.6 Services MAY support partial retrieval of resource state](https://github.com/CiscoDevNet/api-design-guide#363-get) | "RFC-3986" | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-url-format` | **URL format** | [3.4 URL Format](https://github.com/CiscoDevNet/api-design-guide#34-url-format) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [URL Paths](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [3.6.2 PUT](https://github.com/CiscoDevNet/api-design-guide#362-put) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [3.6.5 PATCH](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [3.6.5 PATCH](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [3.1 Security](https://github.com/CiscoDevNet/api-design-guide#31-security) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [3.2 Authentication and Representation](https://github.com/CiscoDevNet/api-design-guide#32-authentication-and-authorization) | "The REST API MUST use OAuth2 implementation for user authentication and authorization, exclusively" | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [3.6.8 Safe and Non-Safe Methods](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Cisco**'s design guidelines:
* **Core Strengths**: High alignment with `API Lifecycle, Collection Resources, Data, Error handling, HTTP Methods`.
* **Contract Invariant**: Enforce strict adherence to Cisco's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Cisco's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.