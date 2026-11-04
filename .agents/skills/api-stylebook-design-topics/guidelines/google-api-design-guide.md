# Guideline: Google API Design Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Google**
> **Canonical Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 39 topics across 10 categories

---

## 1. Executive Summary & Architectural Philosophy

**Google** published the *Google API Design Guide* as an authoritative engineering standard.

> Google Cloud's industry-defining API Design Guide based on AIPs (API Improvement Proposals). Establishes Resource-Oriented Design independent of language/protocol, custom methods (:search, :cancel), standard methods (List, Get, Create, Update, Delete), and long-running Operations.

---

## 2. Analyzed Design Topics by Category

This guideline covers **39 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `global-design` | **Global design** | [Resource Oriented Design](https://cloud.google.com/apis/design/resources) | "This Design Guide explains how to apply REST principles to API designs independent of programming language, operating system, or network protocol. It is NOT a guide solely to creating REST APIs." | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [What is a REST API?](https://cloud.google.com/apis/design/resources#what_is_a_rest_api) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Design flow](https://cloud.google.com/apis/design/resources#design_flow) | "The Design Guide suggests taking the following steps when designing resource- oriented APIs" | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Design Patterns](https://cloud.google.com/apis/design/design_patterns) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `versioning` | **Updates and Versioning** | [List Pagination](https://cloud.google.com/apis/design/design_patterns#list_pagination) | "Even though adding pagination support to an existing API is purely additive from API surface perspective, it is a behavior-breaking change" | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Versioning](https://cloud.google.com/apis/design/versioning) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Compatibility](https://cloud.google.com/apis/design/compatibility) | "This page provides more detailed explanations for the list of breaking and non-breaking changes given in the Versioning section." | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Backwards-compatible (non-breaking) changes](https://cloud.google.com/apis/design/compatibility#backwards-compatible_non-breaking_changes) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |
| `versioning` | **Updates and Versioning** | [Backwards-incompatible (breaking) changes](https://cloud.google.com/apis/design/compatibility#backwards-incompatible_breaking_changes) | Standard rule | [`versioning.md`](../library/02-api-lifecycle/versioning.md) |

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Delete](https://cloud.google.com/apis/design/standard_methods#delete) | "If the Delete method initiates a long-running operation, it should return the long-running operation." | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Common Custom Methods](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) | "Cancel an outstanding operation (build, computation etc.)" | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Long Running Operation](https://cloud.google.com/apis/design/design_patterns#long_running_operations) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Resources](https://cloud.google.com/apis/design/resources#resources) | "A collection contains a list of resources of the same type. For example, a user has a collection of contacts." | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection` | **Collection** | [Methods](https://cloud.google.com/apis/design/resources#methods) | "The key characteristic of a resource-oriented API is that it emphasizes resources (data model) over the methods performed on the resources (functionality)" | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection` | **Collection** | [Resources examples](https://cloud.google.com/apis/design/resources#examples) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection` | **Collection** | [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection-filtering` | **Filtering** | [List filter field](https://cloud.google.com/apis/design/naming_convention#list_filter_field) | Standard rule | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-filtering` | **Filtering** | [Common Custom Methods](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) | "(:search) Alternative to List for fetching data that does not adhere to List semantics." | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-filtering` | **Filtering** | [List Sub-Collections](https://cloud.google.com/apis/design/design_patterns#list_sub-collections) | "Sometimes, an API needs to let a client List/Search across sub- collections." | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-filtering` | **Filtering** | [Get Unique Resource From Sub-Collection](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection) | "it may be useful to allow a Get to retrieve that resource without knowing which parent collection contains it" | [`collection-filtering.md`](../library/04-collection-resources/collection-filtering.md) |
| `collection-pagination` | **Pagination** | [List Pagination](https://cloud.google.com/apis/design/design_patterns#list_pagination) | Standard rule | [`collection-pagination.md`](../library/04-collection-resources/collection-pagination.md) |
| `collection-retrieve` | **Retrieve a collection** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |
| `collection-retrieve` | **Retrieve a collection** | [List](https://cloud.google.com/apis/design/standard_methods#list) | "The List method takes a collection name and zero or more parameters as input, and returns a list of resources that match the input" | [`collection-retrieve.md`](../library/04-collection-resources/collection-retrieve.md) |
| `collection-sorting` | **Sorting a collection** | [Sorting Order](https://cloud.google.com/apis/design/design_patterns#sorting_order) | Standard rule | [`collection-sorting.md`](../library/04-collection-resources/collection-sorting.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Integer Types](https://cloud.google.com/apis/design/design_patterns#integer_types) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format-date-time` | **Date and Time** | [Time and Duration](https://cloud.google.com/apis/design/naming_convention#time_and_duration) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |
| `data-format-date-time` | **Date and Time** | [Date and Time of the Day](https://cloud.google.com/apis/design/naming_convention#date_and_time_of_day) | Standard rule | [`data-format-date-time.md`](../library/05-data/data-format-date-time.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-delete` | **DELETE** | [Delete](https://cloud.google.com/apis/design/standard_methods#delete) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [List](https://cloud.google.com/apis/design/standard_methods#list) | "The List method must use an HTTP GET verb." | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [Get](https://cloud.google.com/apis/design/standard_methods#get) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods` | **HTTP methods** | [Resource Oriented Design](https://cloud.google.com/apis/design/resources) | "With the HTTP protocol, the resource names naturally map to URLs, and methods naturally map to HTTP methods POST, GET, PUT, PATCH, and DELETE." | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods` | **HTTP methods** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods` | **HTTP methods** | [HTTP Verbs](https://cloud.google.com/apis/design/http_verbs) | Standard rule | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-patch` | **PATCH** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-patch` | **PATCH** | [Update](https://cloud.google.com/apis/design/standard_methods#update) | "The standard Update method should support partial resource update, and use HTTP verb PATCH" | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Create](https://cloud.google.com/apis/design/standard_methods#create) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [Update](https://cloud.google.com/apis/design/standard_methods#update) | "If the Update method only supports full resource update, it must use HTTP verb PUT" | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [ETags](https://cloud.google.com/apis/design/design_patterns#etags) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Protocol Buffers v3](https://cloud.google.com/apis/design/proto3) | "It supports both binary and text wire formats, and works with many different wire protocols on different platforms." | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `developer-experience` | **Developer experience** | [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) | "To provide a consistent developer experience across APIs and reduce learning curve, API designers must use the ISO 14977 Extended Backus-Naur Form (EBNF) syntax to define such grammars" | [`developer-experience.md`](../library/14-miscellaneous/developer-experience.md) |
| `documentation` | **Documentation** | [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) | "To provide a consistent developer experience across APIs and reduce learning curve, API designers must use the ISO 14977 Extended Backus-Naur Form (EBNF) syntax to define such grammars" | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Output Fields](https://cloud.google.com/apis/design/design_patterns#output_fields) | "For fields that are output only, the field attribute shall be documented." | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Documentation](https://cloud.google.com/apis/design/documentation) | "This section provides guidelines for adding inline documentation to your API. Most APIs will also have overviews, tutorials, and higher-level reference documentation, which are outside the scope of this Design Guide." | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `documentation` | **Documentation** | [Checklist for all descriptions](https://cloud.google.com/apis/design/documentation#checklist_for_all_descriptions) | "In most cases, there's more to say than just restating the obvious" | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `guiding-input` | **Guiding inputs** | [Request Validation](https://cloud.google.com/apis/design/design_patterns#request_validation) | "If this field is set to true, the server must not execute any side effects and only perform implementation-specific validation consistent with the full request." | [`guiding-input.md`](../library/14-miscellaneous/guiding-input.md) |
| `guiding-input` | **Guiding inputs** | [Request Duplication](https://cloud.google.com/apis/design/design_patterns#request_duplication) | "some API methods cannot easily be idempotent, such as creating a resource, and there is a need to avoid unnecessary duplication" | [`guiding-input.md`](../library/14-miscellaneous/guiding-input.md) |
| `guiding-input` | **Guiding inputs** | [Grammar Syntax](https://cloud.google.com/apis/design/design_patterns#grammar_syntax) | Standard rule | [`guiding-input.md`](../library/14-miscellaneous/guiding-input.md) |
| `guiding-input` | **Guiding inputs** | [Output Fields](https://cloud.google.com/apis/design/design_patterns#output_fields) | "This means that the server must ignore the presence of output only fields and any indication of it." | [`guiding-input.md`](../library/14-miscellaneous/guiding-input.md) |
| `undo` | **Undo** | [Delete](https://cloud.google.com/apis/design/standard_methods#delete) | "If the Delete method only marks the resource as being deleted, it should return the updated resource." | [`undo.md`](../library/14-miscellaneous/undo.md) |
| `undo` | **Undo** | [Undelete](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) | "Restore a resource that was previously deleted. The recommended retention period is 30-day." | [`undo.md`](../library/14-miscellaneous/undo.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id) | "Must be in plural form with lowerCamel case" | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming-case` | **Case** | [Camel Case](https://cloud.google.com/apis/design/naming_convention#camel_case) | Standard rule | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming-language` | **Language** | [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id) | "Must use clear and concise English terms." | [`naming-language.md`](../library/15-naming/naming-language.md) |
| `naming-language` | **Language** | [Naming Conventions](https://cloud.google.com/apis/design/naming_convention) | "Names used in APIs should be in correct American English." | [`naming-language.md`](../library/15-naming/naming-language.md) |
| `naming` | **Naming** | [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id) | "Must be in plural form" | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Standard Fields](https://cloud.google.com/apis/design/standard_fields) | "This section describes a set of standard message field definitions that should be used when similar concepts are needed. This will ensure the same concept has the same name and semantics across different APIs." | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Naming Conventions](https://cloud.google.com/apis/design/naming_convention) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Representing Ranges](https://cloud.google.com/apis/design/design_patterns#representing_ranges) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [List Paginations](https://cloud.google.com/apis/design/design_patterns#list_pagination) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-action` | **Action resource** | [Custom Methods](https://cloud.google.com/apis/design/custom_methods) | Standard rule | [`resource-action.md`](../library/16-resources/resource-action.md) |
| `resource-multiple` | **Batch Bulk** | [Batch Get](https://cloud.google.com/apis/design/standard_methods#list) | "A batch get (such as a method that takes multiple resource ids and returns an object for each of those ids) should be implemented as a custom BatchGet method, rather than a List" | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-multiple` | **Batch Bulk** | [Common Custom Methods](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) | "Batch get of multiple resources." | [`resource-multiple.md`](../library/16-resources/resource-multiple.md) |
| `resource-creation` | **Create resource** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation` | **Create resource** | [Create](https://cloud.google.com/apis/design/standard_methods#create) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-creation-with-id` | **Create resource with a specific ID** | [Update](https://cloud.google.com/apis/design/standard_methods#update) | "If the API accepts client-assigned resource names, the server may allow the client to specify a non-existent resource name and create a new resource." | [`resource-creation-with-id.md`](../library/16-resources/resource-creation-with-id.md) |
| `resource-deletion` | **Delete resource** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-deletion` | **Delete resource** | [Delete](https://cloud.google.com/apis/design/standard_methods#delete) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource-replacement` | **Replace resource** | [Update](https://cloud.google.com/apis/design/standard_methods#update) | "If the Update method only supports full resource update, it must use HTTP verb PUT" | [`resource-replacement.md`](../library/16-resources/resource-replacement.md) |
| `resource` | **Resource** | [Resources](https://cloud.google.com/apis/design/resources#resources) | "A resource has some state and zero or more sub-resources. Each sub-resource can be either a simple resource or a collection resource." | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Methods](https://cloud.google.com/apis/design/resources#methods) | "The key characteristic of a resource-oriented API is that it emphasizes resources (data model) over the methods performed on the resources (functionality)" | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Resources examples](https://cloud.google.com/apis/design/resources#examples) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [Resource Labels](https://cloud.google.com/apis/design/design_patterns#resource_labels) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-id` | **Resource ID** | [Resource ID](https://cloud.google.com/apis/design/resource_names#resource_id) | Standard rule | [`resource-id.md`](../library/16-resources/resource-id.md) |
| `resource-state` | **Resource's state** | [Use Cases](https://cloud.google.com/apis/design/custom_methods#use_cases) | "Promote an employee (corpeng) If implemented as a standard update, the client would have to replicate the corporate policies governing the promotion process to ensure the promotion happens to the correct level, within the same career ladder etc." | [`resource-state.md`](../library/16-resources/resource-state.md) |
| `resource-retrieve` | **Retrieve resource** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve` | **Retrieve resource** | [Get](https://cloud.google.com/apis/design/standard_methods#get) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve` | **Retrieve resource** | [Get Unique Resource From Sub-Collection](https://cloud.google.com/apis/design/design_patterns#get_unique_resource_from_sub-collection) | "it may be useful to allow a Get to retrieve that resource without knowing which parent collection contains it" | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Partial Response](https://cloud.google.com/apis/design/design_patterns#partial_response) | "Sometimes an API client only needs a specific subset of data in the response message." | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Resource View](https://cloud.google.com/apis/design/design_patterns#resource_view) | "To reduce network traffic, it is sometimes useful to allow the client to limit which parts of the resource the server should return in its responses, returning a view of the resource instead of the full resource representation." | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-url-format` | **URL format** | [Resource Names](https://cloud.google.com/apis/design/resource_names) | "The resource name is organized hierarchically using collection IDs and resource IDs, separated by forward slashes." | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-url-format` | **URL format** | [Resource Name vs URL](https://cloud.google.com/apis/design/resource_names#resource_name_vs_url) | Standard rule | [`resource-url-format.md`](../library/16-resources/resource-url-format.md) |
| `resource-update` | **Update resource** | [Standard Methods](https://cloud.google.com/apis/design/standard_methods) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [Update](https://cloud.google.com/apis/design/standard_methods#update) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update` | **Update resource** | [Move](https://cloud.google.com/apis/design/custom_methods#common_custom_methods) | "Move a resource from one parent to another." | [`resource-update.md`](../library/16-resources/resource-update.md) |
| `resource-update-partial` | **Update resource partially** | [Update](https://cloud.google.com/apis/design/standard_methods#update) | "The standard Update method should support partial resource update, and use HTTP verb PATCH" | [`resource-update-partial.md`](../library/16-resources/resource-update-partial.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Google**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Asynchronicity, Collection Resources, Data`.
* **Contract Invariant**: Enforce strict adherence to Google's documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Google's conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.