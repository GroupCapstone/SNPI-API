# Guideline: Cloud Controller API v3 Style Guide (Proposal)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Cloud Foundry**
> **Canonical Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 44 topics across 13 categories

---

## 1. Executive Summary & Architectural Philosophy

**Cloud Foundry** published the *Cloud Controller API v3 Style Guide (Proposal)* as an authoritative engineering standard.

> Cloud Foundry's style guide for the Cloud Controller API v3. Specializes in multi-tenant platform APIs, asynchronous long-running background tasks (202 Accepted), resource relationship links, and quota limits.

---

## 2. Analyzed Design Topics by Category

This guideline covers **44 standardized API design topics** categorized below:

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Asynchronicity](https://github.com/cloudfoundry/cc-api-v3-style-guide#asynchronicity) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Collections](https://github.com/cloudfoundry/cc-api-v3-style-guide#collections) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [Filtering](https://github.com/cloudfoundry/cc-api-v3-style-guide#filtering) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [Pagination](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-pagination` | **Pagination** | [Pagination of Related Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#pagination-of-related-resources) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [GET](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) | Standard rule | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#errors) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [DELETE](https://github.com/cloudfoundry/cc-api-v3-style-guide#delete) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [GET](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods` | **HTTP methods** | [Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#requests) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-patch` | **PATCH** | [PATCH](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [POST](https://github.com/cloudfoundry/cc-api-v3-style-guide#post) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [PUT](https://github.com/cloudfoundry/cc-api-v3-style-guide#put) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status` | **HTTP Statuses** | [Responses Codes](https://github.com/cloudfoundry/cc-api-v3-style-guide#response-codes) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [GET responses (Resource)](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-resource) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [GET responses (Collection)](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-collection) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [POST responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [PUT responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-1) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [PATCH responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-2) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [DELETE responses](https://github.com/cloudfoundry/cc-api-v3-style-guide#responses-3) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Redirection

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-302` | **302 Found** | [Redirections](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection) | Standard rule | [`http-status-302.md`](../library/09-http-status-redirection/http-status-302.md) |
| `http-status-303` | **303 See Other** | [Redirections](https://github.com/cloudfoundry/cc-api-v3-style-guide#redirection) | Standard rule | [`http-status-303.md`](../library/09-http-status-redirection/http-status-303.md) |

### Category: HTTP Status Server Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-500` | **500 Internal Server Error** | [Server Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors) | Standard rule | [`http-status-500.md`](../library/10-http-status-server-error/http-status-500.md) |
| `http-status-503` | **503 Service Unavailable** | [Server Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#server-errors) | Standard rule | [`http-status-503.md`](../library/10-http-status-server-error/http-status-503.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [Successful Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [Successful Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-202` | **202 Accepted** | [Successful Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) | Standard rule | [`http-status-202.md`](../library/11-http-status-success/http-status-202.md) |
| `http-status-204` | **204 No Content** | [Successful Requests](https://github.com/cloudfoundry/cc-api-v3-style-guide#successful-requests) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-401` | **401 Unauthorized** | [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) | Standard rule | [`http-status-401.md`](../library/12-http-status-user-error/http-status-401.md) |
| `http-status-403` | **403 Forbidden** | [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) | Standard rule | [`http-status-403.md`](../library/12-http-status-user-error/http-status-403.md) |
| `http-status-404` | **404 Not Found** | [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-422` | **422 Unprocessable Entity** | [Client Errors](https://github.com/cloudfoundry/cc-api-v3-style-guide#client-errors) | Standard rule | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Includind Related Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-write` | **Hypermedia (write)** | [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) | Standard rule | [`hypermedia-write.md`](../library/13-hypermedia/hypermedia-write.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `query-parameter` | **Query parameters** | [Query Parameters](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) | Standard rule | [`query-parameter.md`](../library/14-miscellaneous/query-parameter.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [Query Parameters](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming-case` | **Case** | [Field Names](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming` | **Naming** | [Query Parameters](https://github.com/cloudfoundry/cc-api-v3-style-guide#query-parameters) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Field Names](https://github.com/cloudfoundry/cc-api-v3-style-guide#field-names) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [URL Structure](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [PUT](https://github.com/cloudfoundry/cc-api-v3-style-guide#put) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-action` | **Action resource** | [Actions](https://github.com/cloudfoundry/cc-api-v3-style-guide#actions) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-creation` | **Create resource** | [POST](https://github.com/cloudfoundry/cc-api-v3-style-guide#post) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [DELETE](https://github.com/cloudfoundry/cc-api-v3-style-guide#delete) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Includind Related Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#including-related-resources) | Standard rule | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-relationships` | **Relationships** | [Relationships](https://github.com/cloudfoundry/cc-api-v3-style-guide#relationships) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-relationships` | **Relationships** | [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource` | **Resource** | [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-id` | **Resource ID** | [Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#resources) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-retrieve` | **Retrieve resource** | [GET](https://github.com/cloudfoundry/cc-api-v3-style-guide#get) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Requesting Partiel Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#requesting-partial-resources) | Standard rule | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Nested Resources](https://github.com/cloudfoundry/cc-api-v3-style-guide#nested-resources) | Standard rule | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-url-format` | **URL format** | [URL Structure](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [PATCH](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [PATCH](https://github.com/cloudfoundry/cc-api-v3-style-guide#patch) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Cloud Foundry**'s design guidelines:
* **Core Strengths**: High alignment with `Asynchronicity, Collection Resources, Error handling, HTTP Methods, HTTP Protocol`.
* **Contract Invariant**: Enforce strict adherence to Cloud Foundry's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Cloud Foundry's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.