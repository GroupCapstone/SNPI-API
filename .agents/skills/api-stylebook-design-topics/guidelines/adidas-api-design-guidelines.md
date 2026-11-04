# Guideline: adidas API design guidelines

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **adidas**
> **Canonical Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 41 topics across 16 categories

---

## 1. Executive Summary & Architectural Philosophy

**adidas** published the *adidas API design guidelines* as an authoritative engineering standard.

> Adidas focuses on consumer-facing digital experiences, advocating for a 'minimal API surface', API-first design, strict contract stability, and loose coupling between mobile/web clients and backend services.

---

## 2. Analyzed Design Topics by Category

This guideline covers **41 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `api-counts` | **API counts** | [Minimal API surface](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/minimal-api-surface.html) | Standard rule | [`api-counts.md`](../library/01-api-design/api-counts.md) |
| `global-design` | **Global design** | [Core principles](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [API First](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/api-first.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Contract](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/contract.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Design Maturity](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/design-maturity.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Robustness](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/robustness.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Loose Coupling](https://adidas-group.gitbooks.io/api-guidelines/content/clients/loose-coupling.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [Version Control System](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/version-control-system.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [OpenAPI Specification](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [API Design Platform - Apiary](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Testing](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/testing.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Rules For Extending](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Changes and Versioning](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Rules For Extending](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Asynchronous Tasks](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection-filtering` | **Filtering** | [Search Requests](https://adidas-group.gitbooks.io/api-guidelines/content/execution/search-requests.html) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [Pagination](https://adidas-group.gitbooks.io/api-guidelines/content/execution/pagination.html) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Corporate Data Model](https://adidas-group.gitbooks.io/api-guidelines/content/application/harmonize-data.html) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [Common Data Types](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) | "data, time, interval, duration, timestamps" | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-internationalization` | **Internationalization** | [Common Data Types](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) | "language, country code, currency" | [`data-internationalization.md`](../library/05-data/data-internationalization.md) |
| `data-internationalization` | **Internationalization** | [Localization](https://adidas-group.gitbooks.io/api-guidelines/content/execution/localization.html) | Standard rule | [`data-internationalization.md`](../library/05-data/data-internationalization.md) |
| `data-standards` | **Standards data** | [Common Data Types](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html) | "data, time, interval, duration, timestamps, language, country code, currency" | [`data-standards.md`](../library/05-data/data-standards.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [Error Response Format](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html) | "application/problem+json" | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |
| `errors` | **Errors** | [Problem Detail](https://adidas-group.gitbooks.io/api-guidelines/content/message/error-reporting.html) | "application/problem+json" | [`errors.md`](../library/06-error-handling/errors.md) |
| `errors` | **Errors** | [Error Response Format](https://adidas-group.gitbooks.io/api-guidelines/content/message/message-formats.html) | "application/problem+json" | [`errors.md`](../library/06-error-handling/errors.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-alternative` | **Forbidden methods alternatives** | [Query Requests with Large Inputs](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html) | Standard rule | [`http-methods-alternative.md`](../library/07-http-methods/http-methods-alternative.md) |
| `http-methods` | **HTTP methods** | [Request Methods](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-methods.html) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-post` | **POST** | [Query Requests with Large Inputs](https://adidas-group.gitbooks.io/api-guidelines/content/execution/query-requests-with-large-inputs.html) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Caching](https://adidas-group.gitbooks.io/api-guidelines/content/execution/caching.html) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Content Negociation](https://adidas-group.gitbooks.io/api-guidelines/content/message/content-negotiation.html) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [Naming Conventions](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) | "Every HTTP Header should use Hyphenated-Pascal-Case. A custom HTTP Header SHOULD NOT start with X- (RFC6648)." | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Status Codes](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/use-appropriate-status-codes.html) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http-status` | **HTTP Statuses** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |
| `http` | **HTTP protocol** | [HTTP](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/http.html) | Standard rule | [`http.md`](../library/08-http-protocol/http.md) |

### Category: HTTP Status Redirection

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-303` | **303 See Other** | [Asynchronous Tasks](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) | Standard rule | [`http-status-303.md`](../library/09-http-status-redirection/http-status-303.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [Asynchronous Tasks](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-400.md`](../library/12-http-status-user-error/http-status-400.md) |
| `http-status-401` | **401 Unauthorized** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-401.md`](../library/12-http-status-user-error/http-status-401.md) |
| `http-status-403` | **403 Forbidden** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-403.md`](../library/12-http-status-user-error/http-status-403.md) |
| `http-status-404` | **404 Not Found** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-405` | **405 Method Not Allowed** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-405.md`](../library/12-http-status-user-error/http-status-405.md) |
| `http-status-429` | **429 Too Many Requests** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`http-status-429.md`](../library/12-http-status-user-error/http-status-429.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [HAL](https://adidas-group.gitbooks.io/api-guidelines/content/message/hal.html) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Foreign Key Relations](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `cors` | **CORS** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`cors.md`](../library/14-miscellaneous/cors.md) |
| `documentation` | **Documentation** | [OpenAPI Specification](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/openapi-specification.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [API Design Platform - Apiary](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/apiary.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `rate-limiting` | **Rate limiting** | [Rate Limiting](https://adidas-group.gitbooks.io/api-guidelines/content/execution/rate-limiting.html) | Standard rule | [`rate-limiting.md`](../library/14-miscellaneous/rate-limiting.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [Naming Conventions](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming-case` | **Case** | [JSON](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/json.html) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming` | **Naming** | [Naming Conventions](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Reserved Identifiers](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/reserved-identifiers.html) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-multiple` | **Batch Bulk** | [None](https://adidas-group.gitbooks.io/api-guidelines/content/execution/batch-operations.html) | Standard rule | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [Choosing Fields & Embedded Resources](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html) | Standard rule | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-relationships` | **Relationships** | [Foreign Key Relations](https://adidas-group.gitbooks.io/api-guidelines/content/message/foreign-key-relations.html) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Choosing Fields & Embedded Resources](https://adidas-group.gitbooks.io/api-guidelines/content/execution/choosing-fields-and-embedded-resoruces.html) | Standard rule | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-url-format` | **URL format** | [URI structure](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/uri-structure.html) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Changes and Versioning](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [TLS](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/tls.html) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **adidas**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Asynchronicity, Collection Resources, Data`.
* **Contract Invariant**: Enforce strict adherence to adidas's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply adidas's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.