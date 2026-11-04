# Deep Dive Analysis: Google Cloud API Design Guide & AIP Architectural Standards

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.  
> **Source**: [https://apistylebook.com/blog/google-api-design-guide-added-on-the-api-stylebook](https://apistylebook.com/blog/google-api-design-guide-added-on-the-api-stylebook)  
> **Author**: Arnaud Lauret (The API Handyman / API Stylebook)  
> **Published**: March 5, 2017  
> **Related Guideline**: [`../guidelines/google-api-design-guide.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/guidelines/google-api-design-guide.md)  
> **Upstream Canonical Standards**: Google Cloud AIPs ([aip.dev](https://google.aip.dev)) & Google API Design Guide ([cloud.google.com/apis/design](https://cloud.google.com/apis/design/))  

---

## 1. Executive Summary & Architectural Scope

Google published its internal API Design Guide to the community after using and refining it internally across all Google Cloud and consumer platforms since 2014.

Arnaud Lauret emphasizes that while Google's guide deals with both REST and RPC (specifically gRPC using Protocol Buffers v3 / `proto3`), **it is an indispensable masterwork for any modern API designer**:

> *"This guide applies to both REST APIs and RPC APIs, with specific focus on gRPC APIs. gRPC APIs use Protocol Buffers to define their API surface and API Service Configuration to configure their API services, including HTTP mapping, logging, and monitoring."*

By demonstrating how to model resource-oriented systems independently of network transport, Google provides the gold standard for high-performance, strongly typed, multi-protocol systems.

---

## 2. Resource-Oriented Design (ROD) Master Methodology

Google pioneered **Resource-Oriented Design (ROD)** as a formal 6-step architectural pipeline:

```
+-------------------------------------------------------------------------------------------------------+
|                               GOOGLE RESOURCE-ORIENTED DESIGN FLOW                                    |
+-------------------------------------------------------------------------------------------------------+
| Step 1: Resource Types     -> Identify entities (e.g. Student, Course, Invoice, Branch)               |
| Step 2: Relationships      -> Establish parent-child hierarchies and sub-collections                  |
| Step 3: Resource Names     -> Define hierarchical, URI-safe resource names (REST URIs)                |
| Step 4: Resource Schemas   -> Define message schemas with strict types, avoiding tautological docs   |
| Step 5: Standard Methods   -> Attach standard CRUD methods (List, Get, Create, Update, Delete)        |
| Step 6: Custom Methods     -> Use custom methods (:search, :cancel, :batchGet) ONLY when CRUD fails   |
+-------------------------------------------------------------------------------------------------------+
```

---

## 3. The 5 Standard Methods & Protocol Mapping

Google strictly standardizes on 5 core methods. Every standard method has deterministic HTTP verb, URI path, status code, and payload contracts:

| Standard Method | HTTP Verb | URI Path Pattern | Request Body | Response Body | Status Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `List` | `GET` | `/v1/{parent=publishers/*}/books` | *None* | `ListBooksResponse` | `200 OK` |
| `Get` | `GET` | `/v1/{name=publishers/*/books/*}` | *None* | `Book` | `200 OK` |
| `Create` | `POST` | `/v1/{parent=publishers/*}/books` | `Book` | `Book` | `201 Created` / `200 OK` |
| `Update` | `PATCH` | `/v1/{name=publishers/*/books/*}` | `Book` + `update_mask` | `Book` | `200 OK` |
| `Delete` | `DELETE`| `/v1/{name=publishers/*/books/*}` | *None* | `google.protobuf.Empty` or `Operation` | `200 OK` / `204 No Content` |

### 3.1. List Method Invariants
- **Empty Collections**: If no resources match, return an empty array `[]` with HTTP `200 OK`. Never return `404 Not Found`.
- **Mandatory Pagination**: All `List` endpoints must support `page_size` and `page_token`, returning `next_page_token`.
- **Filtering**: Use `filter` query parameter with formal filter grammar (e.g. `filter="status = ACTIVE AND age > 18"`).

### 3.2. Update & FieldMask Invariant
Rather than sending partial ad-hoc JSON, Google standardizes partial updates via `PATCH` with an explicit `FieldMask` (`update_mask`):
```http
PATCH /v1/publishers/pub-1/books/book-99?updateMask=title,author.name
Content-Type: application/json

{
  "title": "Advanced Distributed Systems",
  "author": {
    "name": "Leslie Lamport"
  }
}
```
* The server updates **only** the fields specified in `updateMask`.
* Any field omitted from `updateMask` is completely ignored, preventing accidental data wiping.

---

## 4. Custom Methods (`:customVerb`)

When business operations cannot be cleanly expressed as standard CRUD operations on a resource, Google specifies **Custom Methods**.

* **Syntax**: Separated from the resource path by a colon `:`
* **HTTP Verb**: Standardized on HTTP `POST` (or `GET` for read-only actions).
* **Canonical Custom Methods**:

| Custom Method | HTTP Mapping | Purpose |
| :--- | :--- | :--- |
| `:search` | `POST /v1/{parent=...}/resources:search` | Multi-collection querying or complex JSON search payloads |
| `:cancel` | `POST /v1/{name=operations/*}:cancel` | Cancel an in-flight long-running operation or task |
| `:batchGet` | `GET /v1/{parent=...}/resources:batchGet?names=...` | Retrieve multiple resources by IDs in a single network round-trip |
| `:move` | `POST /v1/{name=...}:move` | Move a resource from one parent hierarchy to another |
| `:undelete` | `POST /v1/{name=...}:undelete` | Restore a soft-deleted or archived resource |

---

## 5. Long-Running Operations (`google.longrunning.Operation`)

For operations exceeding interactive latency (>500ms, such as report generation, database migration, or bulk invoicing), Google never holds HTTP connections open. The API returns an `Operation` entity:

```json
{
  "name": "operations/op-2026-98124",
  "metadata": {
    "@type": "type.googleapis.com/snp.sms.BulkInvoiceProgress",
    "totalRecords": 1500,
    "processedRecords": 750,
    "progressPercentage": 50
  },
  "done": false,
  "response": null,
  "error": null
}
```

### Operational Lifecycle:
1. Client polls `GET /v1/operations/op-2026-98124`.
2. When finished, `done: true`.
3. If successful: `response` contains the resulting entity or summary.
4. If failed: `error` contains standard `google.rpc.Status`.
5. Cancellation: Client can issue `POST /v1/operations/op-2026-98124:cancel`.

---

## 6. The 16 Canonical Error Codes (`google.rpc.Status`)

Google rejects ad-hoc error codes in favor of a universal 16-code taxonomy mapped to HTTP status codes:

| Google Status Code | HTTP Status Code | Semantic Condition |
| :--- | :--- | :--- |
| `OK` | `200 OK` | No error; operation completed successfully |
| `INVALID_ARGUMENT` | `400 Bad Request` | Client specified an invalid argument or malformed payload |
| `FAILED_PRECONDITION`| `400 Bad Request` | State machine violation (e.g. cannot delete active class) |
| `OUT_OF_RANGE` | `400 Bad Request` | Value out of bounds (e.g. pagination offset beyond total) |
| `UNAUTHENTICATED` | `401 Unauthorized` | Request lacks valid authentication credentials |
| `PERMISSION_DENIED` | `403 Forbidden` | Caller lacks RBAC permission or tenant scope |
| `NOT_FOUND` | `404 Not Found` | Requested resource does not exist within caller boundary |
| `ALREADY_EXISTS` | `409 Conflict` | Unique constraint violation (e.g. duplicate national ID) |
| `ABORTED` | `409 Conflict` | Concurrency conflict (e.g. optimistic lock collision) |
| `RESOURCE_EXHAUSTED`| `429 Too Many Requests`| Rate limit exceeded or quota exhausted |
| `CANCELLED` | `499 Client Closed Request` | Operation was cancelled by caller |
| `INTERNAL` | `500 Internal Server Error`| Serious server error; invariants broken |
| `DATA_LOSS` | `500 Internal Server Error`| Unrecoverable data loss or corruption |
| `UNKNOWN` | `500 Internal Server Error`| Unknown system error |
| `UNIMPLEMENTED` | `501 Not Implemented` | API method not supported or disabled |
| `UNAVAILABLE` | `503 Service Unavailable` | Service overloaded or down for maintenance |
| `DEADLINE_EXCEEDED` | `504 Gateway Timeout` | Timeout reached before operation finished |

---

## 7. The Documentation Invariant

Arnaud Lauret emphasizes Google's core documentation rule:

> **\"In most cases, there’s more to say than just restating the obvious.\"**

### Tautology vs Real Architectural Documentation:

```typescript
// [REJECTED TAUTOLOGY]
/**
 * The student ID.
 */
studentId: string;

// [STANDARD GOOGLE-STYLE DOCUMENTATION]
/**
 * Immutable, globally unique UUID v4 identifying the student within their school tenant.
 * Generated automatically by the admissions service upon initial enrollment.
 * Format: 8-4-4-4-12 lowercase hex characters.
 *
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
studentId: string;
```

---

## 8. Backward Compatibility: Breaking vs. Non-Breaking Invariants

Google defines the industry benchmark for API stability:

### 8.1. Backwards-Compatible (Non-Breaking / Safe):
* Adding a new service, resource, or endpoint.
* Adding a new optional request field.
* Adding any field to a response message (clients must tolerate unknown fields).
* Adding a new value to an enum (clients must default unknown values).
* Relaxing a validation constraint (e.g. increasing max string length).

### 8.2. Backwards-Incompatible (Breaking / Unsafe):
* Renaming or removing a resource, endpoint, field, or enum value.
* Changing the data type of an existing field.
* Changing an HTTP verb or URL path.
* Adding a new required field to an existing request.
* Tightening an input validation constraint.
* **Adding pagination to an existing unpaginated endpoint**: Google explicitly notes that while pagination is structurally additive, it is *behavior-breaking* because legacy clients expecting complete datasets will silently receive partial pages!

---

## 9. Standby Monorepo Mapping (Express 5 & TypeScript)

When instructed to apply Google Cloud API Design Guide standards to SNP-SMS:
- [ ] Adopt Google's 5 Standard Methods (`List`, `Get`, `Create`, `Update`, `Delete`) as the controller interface archetype across `apps/backend/src/modules/`.
- [ ] Model non-CRUD actions using Google's colon custom method convention (`POST /api/v1/fee-invoices/:id:cancel`).
- [ ] Implement `google.longrunning.Operation` schemas for batch student enrollments and fee generation.
- [ ] Map Zod schema validation errors directly to `google.rpc.BadRequest.FieldViolation`.
- [ ] Eliminate all tautological comments across `@snp/shared` DTO definitions.
