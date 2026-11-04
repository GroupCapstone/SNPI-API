# Guideline: API Design Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Australian Digital Transformation Office**
> **Canonical Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 26 topics across 12 categories

---

## 1. Executive Summary & Architectural Philosophy

**Australian Digital Transformation Office** published the *API Design Guide* as an authoritative engineering standard.

> The Australian Digital Transformation Office (AusDTO) provides government-wide guidelines for public sector digital services, focusing on user-centered design, granularity, accessibility, and standardized error messaging.

---

## 2. Analyzed Design Topics by Category

This guideline covers **26 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `global-design` | **Global design** | [Granularity](https://apiguide.readthedocs.io/en/latest/principles/granularity.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Functionality](https://apiguide.readthedocs.io/en/latest/principles/coverage.html) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [Register your API](https://apiguide.readthedocs.io/en/latest/build_and_publish/advertise.html) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Versioning](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Use versions](https://apiguide.readthedocs.io/en/latest/build_and_publish/versioning.html) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection-pagination` | **Pagination** | [Batching results](https://apiguide.readthedocs.io/en/latest/build_and_publish/batching_results.html) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-standard-error` | **Error format** | [HTTP response principles](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#http-response-principles) | Standard rule | [`http-status-standard-error.md`](../library/06-error-handling/http-status-standard-error.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [DELETE /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-delete` | **DELETE** | [DELETE /magazines/1234](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines-1234) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [GET /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [HEAD /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods-head` | **HEAD** | [HEAD /magazines/1234](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines-1234) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [Use HTTP methods and status codes](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-post` | **POST** | [POST /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#post--magazines) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [PUT /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [PUT /magazines/1234](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines-1234) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-content-negotiation` | **Content negociation and media types** | [Formats](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#formats) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [API Payload format encoding](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#api-payload-format-encoding) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [GET /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [PUT /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [DELETE /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [DELETE /magazines/1234](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#delete--magazines-1234) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [HEAD /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-200` | **200 OK** | [HEAD /magazines/1234](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#head--magazines-1234) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [Use HTTP methods and status codes](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-201` | **201 Created** | [PUT /magazines/1234](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#put--magazines-1234) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-404` | **404 Not Found** | [GET /magazines](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#get--magazines) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-405` | **405 Method Not Allowed** | [Use HTTP methods and status codes](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_HTTP_methods.html#use-http-methods-and-status-codes) | Standard rule | [`http-status-405.md`](../library/12-http-status-user-error/http-status-405.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-write` | **Hypermedia (write)** | [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) | Standard rule | [`hypermedia-write.md`](../library/13-hypermedia/hypermedia-write.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `cors` | **CORS** | [Support cross-domain mashups with CORS](https://apiguide.readthedocs.io/en/latest/build_and_publish/cors.html) | Standard rule | [`cors.md`](../library/14-miscellaneous/cors.md) |
| `developer-experience` | **Developer experience** | [Empathy](https://apiguide.readthedocs.io/en/latest/principles/empathy.html) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `developer-experience` | **Developer experience** | [Errors](https://apiguide.readthedocs.io/en/latest/principles/errors.html) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `developer-experience` | **Developer experience** | [Endpoint Stability](https://apiguide.readthedocs.io/en/latest/principles/availability.html) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `documentation` | **Documentation** | [Discoverability](https://apiguide.readthedocs.io/en/latest/principles/discoverability.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Document your API](https://apiguide.readthedocs.io/en/latest/build_and_publish/documentation.html) | Standard rule | [`documentation.md`](../library/14-miscellaneous/documentation.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-relationships` | **Relationships** | [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource-url-format` | **URL format** | [URL Depth](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#url-depth) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Good RESTful URL examples](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#good-restful-url-examples) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security-data` | **Data privacy** | [Privacy and security](https://apiguide.readthedocs.io/en/latest/principles/security.html) | Standard rule | [`security-data.md`](../library/17-security/security-data.md) |
| `security` | **Security** | [Privacy and security](https://apiguide.readthedocs.io/en/latest/principles/security.html) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Australian Digital Transformation Office**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Collection Resources, Error handling, HTTP Methods`.
* **Contract Invariant**: Enforce strict adherence to Australian Digital Transformation Office's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Australian Digital Transformation Office's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.