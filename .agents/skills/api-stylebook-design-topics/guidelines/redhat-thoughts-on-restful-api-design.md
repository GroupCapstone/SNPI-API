# Guideline: Thoughts on RESTful API Design

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Red Hat**
> **Canonical Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 32 topics across 9 categories

---

## 1. Executive Summary & Architectural Philosophy

**Red Hat** published the *Thoughts on RESTful API Design* as an authoritative engineering standard.

> Red Hat's foundational architectural treatise on REST philosophy, resource representations, hypermedia navigation, state transfer, and decoupling service implementations from consumer interfaces.

---

## 2. Analyzed Design Topics by Category

This guideline covers **32 standardized API design topics** categorized below:

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Asynchronous Requests](http://restful-api-design.readthedocs.io/en/latest/methods.html#asynchronous-requests) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `notifications-server-events` | **Notifying API consumers** | [Notifications](http://restful-api-design.readthedocs.io/en/latest/methods.html#notifications) | Standard rule | [`notifications-server-events.md`](../library/03-asynchronicity/notifications-server-events.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [URLs](http://restful-api-design.readthedocs.io/en/latest/urls.html) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-pagination` | **Pagination** | [Ranges Pagination](http://restful-api-design.readthedocs.io/en/latest/methods.html#ranges-pagination) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Resource Data](http://restful-api-design.readthedocs.io/en/latest/resources.html#resource-data) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-options` | **OPTIONS** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-options.md`](../library/07-http-methods/http-methods-options.md) |
| `http-methods-patch` | **PATCH** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-content-negotiation` | **Content negociation and media types** | [Representations](http://restful-api-design.readthedocs.io/en/latest/resources.html#representations) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Content-Types](http://restful-api-design.readthedocs.io/en/latest/resources.html#content-types) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-headers` | **HTTP Headers** | [Link Headers](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) | Standard rule | [`http-headers.md`](../library/08-http-protocol/http-headers.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-405` | **405 Method Not Allowed** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`http-status-405.md`](../library/12-http-status-user-error/http-status-405.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [REST Metadata](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Link Headers](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Relationships](http://restful-api-design.readthedocs.io/en/latest/relationships.html) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia-read` | **Hypermedia (read)** | [REST Metadata](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Link Headers](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-read` | **Hypermedia (read)** | [Relationships](http://restful-api-design.readthedocs.io/en/latest/relationships.html) | Standard rule | [`hypermedia-read.md`](../library/13-hypermedia/hypermedia-read.md) |
| `hypermedia-write` | **Hypermedia (write)** | [Forms](http://restful-api-design.readthedocs.io/en/latest/forms.html) | "... without referring to external documentation, an API user does not know what data to provide to operations that take input." | [`hypermedia-write.md`](../library/13-hypermedia/hypermedia-write.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `documentation` | **Documentation** | [Forms](http://restful-api-design.readthedocs.io/en/latest/forms.html) | "... without referring to external documentation, an API user does not know what data to provide to operations that take input." | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `guiding-input` | **Guiding inputs** | [Forms](http://restful-api-design.readthedocs.io/en/latest/forms.html) | "... without referring to external documentation, an API user does not know what data to provide to operations that take input." | [`guiding-input.md`](../library/14-miscellaneous/guiding-input.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [Actions](http://restful-api-design.readthedocs.io/en/latest/methods.html#actions) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-creation` | **Create resource** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-relationships` | **Relationships** | [Relationships](http://restful-api-design.readthedocs.io/en/latest/relationships.html) | Standard rule | [`resource-relationships.md`](../library/16-resources/resource-relationships.md) |
| `resource` | **Resource** | [Resources](http://restful-api-design.readthedocs.io/en/latest/resources.html) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [URLs](http://restful-api-design.readthedocs.io/en/latest/urls.html) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-id` | **Resource ID** | [REST Metadata](http://restful-api-design.readthedocs.io/en/latest/resources.html#rest-metadata) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-retrieve` | **Retrieve resource** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-url-format` | **URL format** | [URLs](http://restful-api-design.readthedocs.io/en/latest/urls.html) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [PATCH vs PUT](http://restful-api-design.readthedocs.io/en/latest/methods.html#patch-vs-put) | Standard rule | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Red Hat**'s design guidelines:
* **Core Strengths**: High alignment with `Asynchronicity, Collection Resources, Data, HTTP Methods, HTTP Protocol`.
* **Contract Invariant**: Enforce strict adherence to Red Hat's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Red Hat's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.