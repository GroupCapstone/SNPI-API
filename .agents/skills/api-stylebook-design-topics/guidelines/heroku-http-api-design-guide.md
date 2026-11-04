# Guideline: HTTP API Design Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Heroku**
> **Canonical Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 34 topics across 13 categories

---

## 1. Executive Summary & Architectural Philosophy

**Heroku** published the *HTTP API Design Guide* as an authoritative engineering standard.

> Heroku's iconic 12-factor HTTP API Design Guide. Emphasizes clean RESTful conventions, UUID identifiers, strict JSON formatting, Range-based pagination headers, rate limiting, and HTTP caching.

---

## 2. Analyzed Design Topics by Category

This guideline covers **34 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `global-design` | **Global design** | [Separate Concerns](https://geemus.gitbooks.io/http-api-design/content/en/foundations/separate-concerns.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `versioning` | **Updates and Versioning** | [Require Versioning in the Accepts Header](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Describe stability](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/describe-stability.html) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection-pagination` | **Pagination** | [Divide Large Responses Across Requests with Ranges](https://geemus.gitbooks.io/http-api-design/content/en/) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Accept serialized JSON in request bodies](https://geemus.gitbooks.io/http-api-design/content/en/requests/accept-serialized-json-in-request-bodies.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Provide standard timestamps](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Nest foreign key relations](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Keep JSON minified in all responses](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [Provide standard timestamps](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Use UTC times formatted in ISO8601](https://geemus.gitbooks.io/http-api-design/content/en/responses/use-utc-times-formatted-in-iso8601.html) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Generate structured errors](https://geemus.gitbooks.io/http-api-design/content/en/responses/generate-structured-errors.html) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Support ETags for Caching](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-headers` | **HTTP Headers** | [Require Versioning in the Accepts Header](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Support ETags for Caching](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Provide Request-Ids for Introspection](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Divide Large Responses Across Requests with Ranges](https://geemus.gitbooks.io/http-api-design/content/en/) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Server Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-500` | **500 Internal Server Error** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-500.md`](../library/10-http-status-server-error/http-status-500.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-202` | **202 Accepted** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-202.md`](../library/11-http-status-success/http-status-202.md) |
| `http-status-206` | **206 Partial Content** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-206.md`](../library/11-http-status-success/http-status-206.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-401` | **401 Unauthorized** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-401.md`](../library/12-http-status-user-error/http-status-401.md) |
| `http-status-403` | **403 Forbidden** | [Require Secure Connections](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html) | Standard rule | [`http-status-403.md`](../library/12-http-status-user-error/http-status-403.md) |
| `http-status-403` | **403 Forbidden** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-403.md`](../library/12-http-status-user-error/http-status-403.md) |
| `http-status-422` | **422 Unprocessable Entity** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |
| `http-status-429` | **429 Too Many Requests** | [Return appropriate status codes](https://geemus.gitbooks.io/http-api-design/content/en/responses/return-appropriate-status-codes.html) | Standard rule | [`http-status-429.md`](../library/12-http-status-user-error/http-status-429.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `debug-diagnose` | **Debug and diagnose** | [Provide Request-Ids for Introspection](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html) | Standard rule | [`debug-diagnose.md`](../library/14-miscellaneous/debug-diagnose.md) |
| `documentation` | **Documentation** | [Provide machine-readable JSON schema](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-machine-readable-json-schema.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Provide human-readable docs](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-human-readable-docs.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Provide executable examples](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/provide-executable-examples.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `performance` | **Performance and bandwidth** | [Keep JSON minified in all responses](https://geemus.gitbooks.io/http-api-design/content/en/responses/keep-json-minified-in-all-responses.html) | Standard rule | [`performance.md`](../library/14-miscellaneous/performance.md) |
| `rate-limiting` | **Rate limiting** | [Show rate limit status](https://geemus.gitbooks.io/http-api-design/content/en/responses/show-rate-limit-status.html) | Standard rule | [`rate-limiting.md`](../library/14-miscellaneous/rate-limiting.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [Downcase paths and attributes](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming` | **Naming** | [Resource names](https://geemus.gitbooks.io/http-api-design/content/en/requests/resource-names.html) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [Actions](https://geemus.gitbooks.io/http-api-design/content/en/requests/actions.html) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-creation` | **Create resource** | [Provide full resources where available](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [Provide full resources where available](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-id-semantic` | **ID with semantic** | [Support non-id dereferencing for convenience](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html) | Standard rule | [`resource-id-semantic.md`](../library/16-resources/resource-id-semantic.md) |
| `resource-relationships` | **Relationships** | [Nest foreign key relations](https://geemus.gitbooks.io/http-api-design/content/en/responses/nest-foreign-key-relations.html) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-id` | **Resource ID** | [Support non-id dereferencing for convenience](https://geemus.gitbooks.io/http-api-design/content/en/requests/support-non-id-dereferencing-for-convenience.html) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-id` | **Resource ID** | [Provide resource (UU)IDs](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-resource-uuids.html) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-retrieve` | **Retrieve resource** | [Provide full resources where available](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-url-format` | **URL format** | [Use consistent path formats](https://geemus.gitbooks.io/http-api-design/content/en/requests/use-consistent-path-formats.html) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Downcase paths and attributes](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Minimize path nesting](https://geemus.gitbooks.io/http-api-design/content/en/requests/minimize-path-nesting.html) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [Provide full resources where available](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-full-resources-where-available.html) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [Require Secure Connections](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Heroku**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Collection Resources, Data, Error handling`.
* **Contract Invariant**: Enforce strict adherence to Heroku's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Heroku's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.