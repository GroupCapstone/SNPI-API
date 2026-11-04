# Guideline: Atlassian REST API Design Guidelines version 1

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Atlassian**
> **Canonical Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 28 topics across 11 categories

---

## 1. Executive Summary & Architectural Philosophy

**Atlassian** published the *Atlassian REST API Design Guidelines version 1* as an authoritative engineering standard.

> Atlassian standardizes enterprise collaboration software REST APIs across Jira, Confluence, and Bitbucket. Emphasizes URI structure, predictable JSON representations, standard HTTP methods, and extensible plugin APIs.

---

## 2. Analyzed Design Topics by Category

This guideline covers **28 standardized API design topics** categorized below:

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [Using these Guidelines](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-UsingtheseGuidelines) | "We strongly recommend that someone who is familiar with these guidelines should review your REST API code" | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Version Control for APIs](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs) | "When to Change the Version" | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Version Control for APIs](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "URI Structure" | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection` | **Collection** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Collections of Entities" | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-pagination` | **Pagination** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Standard Query Parameters in URIs (start-index, max-results)" | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Representations (Content Types) of Entities" | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Appendix B: Basic Data Types](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixB:BasicDataTypes) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [Concurrency](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-put` | **PUT** | [Concurrency](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Version Control for Entities" | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-caching` | **Caching** | [Caching](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-headers` | **HTTP Headers** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Entities SHOULD be served with an ETag header." | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-headers` | **HTTP Headers** | [Caching](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching) | "ETag, If-None-Match" | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |
| `http-status` | **HTTP Statuses** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Redirection

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-301` | **301 Moved Permanently** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-301.md`](../library/09-http-status-redirection/http-status-301.md) |
| `http-status-304` | **304 Not Modified** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-304.md`](../library/09-http-status-redirection/http-status-304.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-202` | **202 Accepted** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-202.md`](../library/11-http-status-success/http-status-202.md) |
| `http-status-204` | **204 No Content** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-401` | **401 Unauthorized** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-401.md`](../library/12-http-status-user-error/http-status-401.md) |
| `http-status-404` | **404 Not Found** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-412` | **412 Precondition Failed** | [Concurrency](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) | Standard rule | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |
| `http-status-412` | **412 Precondition Failed** | [Appendix A: Response Codes](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-AppendixA:ResponseCodes) | Standard rule | [`http-status-412.md`](../library/12-http-status-user-error/http-status-412.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Hypertext Linking within an Entity" | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Hypertext Linking within an Entity" | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-write` | **Hypermedia (write)** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Hypertext Linking within an Entity" | [`hypermedia-write.md`](../library/13-hypermedia/hypermedia-write.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-deletion` | **Delete resource** | [Concurrency](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Standard Query Parameters in URIs (expand)" | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource-retrieve-dereference` | **Dereference Relationships** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "Title Expansion for Entities" | [`resource-retrieve-dereference.md`](../library/16-resources/resource-retrieve-dereference.md) |
| `resource` | **Resource** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-url-format` | **URL format** | [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources) | "URI Structure" | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [Concurrency](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Concurrency) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [Security](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Security) | Standard rule | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Atlassian**'s design guidelines:
* **Core Strengths**: High alignment with `API Lifecycle, Collection Resources, Data, HTTP Methods, HTTP Protocol`.
* **Contract Invariant**: Enforce strict adherence to Atlassian's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Atlassian's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.