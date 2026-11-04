# Guideline: White House Web API Standards

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **White House**
> **Canonical Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 22 topics across 11 categories

---

## 1. Executive Summary & Architectural Philosophy

**White House** published the *White House Web API Standards* as an authoritative engineering standard.

> US Federal Government Open Data API standards (Project Open Data). Promotes public accountability, transparent JSON representations, record limit boundaries, RESTful URL conventions, and open access.

---

## 2. Analyzed Design Topics by Category

This guideline covers **22 standardized API design topics** categorized below:

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `versioning` | **Updates and Versioning** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Versions](https://github.com/WhiteHouse/api-standards/blob/master/README.md#versions) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection-filtering` | **Filtering** | [Record Limits](https://github.com/WhiteHouse/api-standards/blob/master/README.md#record-limits) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods` | **HTTP methods** | [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods` | **HTTP methods** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-post` | **POST** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-content-negotiation` | **Content negociation and media types** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | "Formats should be in the form of api/v2/resource/{id}.json" | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | "URL v. header" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Server Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-500` | **500 Internal Server Error** | [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) | Standard rule | [`http-status-500.md`](../library/10-http-status-server-error/http-status-500.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [Error handling](https://github.com/WhiteHouse/api-standards/blob/master/README.md#error-handling) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `cors` | **CORS** | [JSONP](https://github.com/WhiteHouse/api-standards/blob/master/README.md#jsonp) | Standard rule | [`cors.md`](../library/14-miscellaneous/cors.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming` | **Naming** | [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-multiple` | **Batch Bulk** | [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) | "Bulk update, Delete all dogs" | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-creation` | **Create resource** | [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-retrieve` | **Retrieve resource** | [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-url-format` | **URL format** | [RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#restful-urls) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [HTTP verbs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#http-verbs) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **White House**'s design guidelines:
* **Core Strengths**: High alignment with `API Lifecycle, Collection Resources, Error handling, HTTP Methods, HTTP Protocol`.
* **Contract Invariant**: Enforce strict adherence to White House's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply White House's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.