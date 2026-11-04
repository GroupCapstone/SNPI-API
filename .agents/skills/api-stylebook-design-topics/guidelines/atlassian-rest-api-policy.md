# Guideline: Atlassian REST API Policy

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Atlassian**
> **Canonical Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 8 topics across 6 categories

---

## 1. Executive Summary & Architectural Philosophy

**Atlassian** published the *Atlassian REST API Policy* as an authoritative engineering standard.

> Authoritative policy document detailing Atlassian's backward compatibility commitments, breaking change rules, deprecation grace periods (minimum 6 months), and major version retirement policies.

---

## 2. Analyzed Design Topics by Category

This guideline covers **8 standardized API design topics** categorized below:

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [Compatibility policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Deprecation policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `versioning` | **Updates and Versioning** | [Compatibility policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Backwards compatibility](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Backwardscompatibility) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Structured representations (application/json)](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json)) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [API versioning](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-APIversioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection-pagination` | **Pagination** | [Resource/rate limits and paging](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Compatibility policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Structured representations (application/json)](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json)) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Forward compatibility](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Forwardcompatibility) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-headers` | **HTTP Headers** | [Detectability (Deprecation Policy)](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Detectability) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `developer-experience` | **Developer experience** | [Deprecation policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Deprecationpolicy) | Standard rule | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `rate-limiting` | **Rate limiting** | [Resource/rate limits and paging](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Resource/ratelimitsandpaging) | Standard rule | [`rate-limiting.md`](../library/14-miscellaneous/rate-limiting.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-url-format` | **URL format** | [Stable URIs](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-StableURIs) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Atlassian**'s design guidelines:
* **Core Strengths**: High alignment with `API Lifecycle, Collection Resources, Data, HTTP Protocol, Miscellaneous`.
* **Contract Invariant**: Enforce strict adherence to Atlassian's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Atlassian's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.