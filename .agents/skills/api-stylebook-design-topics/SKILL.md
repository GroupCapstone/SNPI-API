---
name: api-stylebook-design-topics
description: >-
  Authoritative API Stylebook REST API Design Topics & Cross-Guideline Standards.
  Covers the 17 core API design categories and 100 standardized topics across 16
  industry leaders (Google, Microsoft, Zalando, PayPal, Cisco, Heroku, Atlassian,
  Red Hat, White House, Adidas, Haufe, etc.), establishing definitive rules for URI
  structure, HTTP methods, status codes, RFC 7807 error formatting, pagination,
  filtering, and multi-tenant scoping for Express 5 and TypeScript backends.
---

# API Stylebook: REST API Design Topics & Cross-Guideline Standards

> **Status**: Primary Architectural Standard  
> **Authoritative Scope**: REST API Design, HTTP Semantics, Resource Modeling, Error Handling, Contract Engineering  
> **Primary Safe Folder**: `.agents/skills/api-stylebook-design-topics/`  
> **Modular Knowledge Library**: [`library/README.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/library/README.md) (17 categories, 100 topic files with original text & quotes)  
> **Unabridged Topics Catalog**: `references/api-stylebook-design-topics.md`  
> **Cross-Guideline Matrix**: `references/guidelines-matrix.md`  
> **Machine-Readable Taxonomy**: `references/api-stylebook-topics.yaml`  
> **Source Guidelines Corpus**: `references/guidelines/` (16 enterprise guidelines)  
> **Enterprise Knowledge Base**: `.github/knowledge/architecture/api-stylebook-design-topics.md`  

---

## 1. Executive Summary & Core Taxonomy

The **API Stylebook** (curated by Arnaud Lauret) synthesizes and normalizes the architectural wisdom of 16 industry-defining corporate and governmental API design guidelines into a standardized taxonomy of **17 design categories** and **100 design topics** with over **1,051 curated citations**.

This standard establishes the mandatory REST API architecture, HTTP semantics, data formatting, and contract hygiene for all backend domain modules in the SNP-SMS monorepo (`apps/backend`) and shared type contracts (`@snp/shared`).

```
+---------------------------------------------------------------------------------------------------+
|                           17 REST API DESIGN CATEGORIES (API STYLEBOOK)                           |
+---------------------------------------------------------------------------------------------------+
| 01. API Design          : Granularity, endpoint counts, surface minimality, design philosophy.    |
| 02. API Lifecycle       : API governance, evolution, deprecation schedules, sunset policies.     |
| 03. Asynchronicity      : Long-running jobs, 202 Accepted, polling patterns, progress hooks.      |
| 04. Collection Resources: Filtering, sorting, cursor/offset pagination, collection queries.       |
| 05. Data Formats        : JSON structure, ISO 8601 date/time, null handling, I18N standards.      |
| 06. Error Handling      : RFC 7807 Problem Details, deterministic error codes, debug context.     |
| 07. HTTP Methods        : Semantics and idempotency for GET, POST, PUT, PATCH, DELETE, OPTIONS.   |
| 08. HTTP Protocol       : Content negotiation, standard headers, Cache-Control, ETag handling.   |
| 09. Status Redirection  : 3xx redirect semantics (301 Moved, 303 See Other, 304 Not Modified).  |
| 10. Status Server Error : 5xx error taxonomy (500 Internal, 501 Not Implemented, 503 Overloaded). |
| 11. Status Success      : 2xx success codes (200 OK, 201 Created, 202 Accepted, 204 No Content). |
| 12. Status User Error   : 4xx validation codes (400 Bad, 401 Auth, 403 Forbidden, 404, 409, 422). |
| 13. Hypermedia          : HATEOAS patterns, HAL / JSON:API link relations, state transitions.      |
| 14. Miscellaneous       : CORS policies, rate limiting (429), API chaining, developer experience. |
| 15. Naming Conventions  : URI casing (kebab-case), JSON casing (camelCase), pluralized nouns.    |
| 16. Resource Modeling   : Resource hierarchies, identifiers, sub-resources, partial updates.     |
| 17. Security Hygiene    : Scoped RBAC tokens, multi-tenant isolation, constant-time validation.   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Analyzed Guidelines Corpus & Industry Consensus

The taxonomy aggregates rules and recommendations from 16 benchmarked organizations:

| Guideline Key | Organization | Primary Focus | Consensus Weight |
| :--- | :--- | :--- | :--- |
| `zalando` | **Zalando** | Microservices REST API Guidelines, strict OpenAPI 3.0, JSON:API conventions | High (74 topics) |
| `haufe` | **Haufe-Lexware** | Comprehensive API Style Guide, hypermedia, domain modeling | High (61 topics) |
| `deliveroo` | **Deliveroo** | Pragmatic e-commerce REST guidelines, JSON formatting, pagination | High (60 topics) |
| `cisco` | **Cisco** | Enterprise networking API design, security, robust filtering | Moderate (43 topics) |
| `microsoft` | **Microsoft** | Microsoft REST API Guidelines, OData alignment, batch operations | High (43 topics) |
| `adidas` | **adidas** | Consumer digital experience API design, minimal surface philosophy | Moderate (41 topics) |
| `google` | **Google Cloud** | Google Cloud API Design Guide, resource-oriented design, AIP standards | High (39 topics) |
| `paypal` | **PayPal** | Financial REST standards, idempotency keys, payment status lifecycles | High (36 topics) |
| `heroku` | **Heroku** | HTTP API Design Guide, 12-factor architecture, UUIDs, caching | Moderate (34 topics) |
| `redhat` | **Red Hat** | RESTful API design philosophy, resource representations | Moderate (32 topics) |
| `atlassian` | **Atlassian** | Platform REST guidelines and deprecation policies | Moderate (28 topics) |
| `ausdto` | **Australian DTO** | Public sector digital service standards, accessibility | Moderate (26 topics) |
| `whitehouse` | **White House** | US Government Open Data and Web API Standards | Baseline (22 topics) |
| `cloudfoundry` | **Cloud Foundry** | Cloud Controller API v3 style guide, asynchronous tasks | Moderate (44 topics) |
| `italia` | **Italian Government** | Interoperability Model for Public Administration (AgID) | Moderate (37 topics) |

---

## 3. Mandatory Architectural Invariants for REST APIs

When designing, updating, or reviewing REST API endpoints in the SNP-SMS monorepo, AI agents must enforce these core invariants:

### 3.1. URI Grammar & Resource Hierarchy

* **Plural Nouns for Collections**: URIs identify resources, not actions. Always use plural nouns for collections:
  - `[STANDARD]`: `GET /api/v1/students`, `POST /api/v1/fee-invoices`
  - `[REJECTED]`: `GET /api/v1/getStudent`, `POST /api/v1/create_invoice`
* **Kebab-Case in URIs**: All multi-word URI segments must use lowercase hyphenated words:
  - `[STANDARD]`: `/api/v1/academic-years`, `/api/v1/exam-schedules`
  - `[REJECTED]`: `/api/v1/academicYears`, `/api/v1/academic_years`
* **Hierarchy Nesting Depth Limit**: Limit URI sub-resource nesting to maximum 2 levels of relationship to avoid brittle, overly deep routes:
  - `[STANDARD]`: `GET /api/v1/schools/:schoolId/branches/:branchId/classrooms`
  - `[STANDARD Alternative]`: Flatten deeper collections with query filters: `GET /api/v1/exam-scores?classId=:classId`
* **Actions as Sub-Resource Verbs**: For operations that cannot be cleanly modeled as standard CRUD on a resource, use sub-resource action verbs:
  - `[STANDARD]`: `POST /api/v1/fee-invoices/:id/cancel`
  - `[STANDARD]`: `POST /api/v1/students/:id/re-enroll`

### 3.2. HTTP Method Semantics & Idempotency Matrix

All endpoints must adhere to the RFC 9110 HTTP method contract:

| HTTP Method | Safe? | Idempotent? | Semantic Intent | Standard Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | **Yes** | **Yes** | Retrieve resource or collection representation | `200 OK` |
| `HEAD` | **Yes** | **Yes** | Retrieve identical headers to GET without body | `200 OK` |
| `OPTIONS`| **Yes** | **Yes** | Inspect communication options and CORS policies | `204 No Content` / `200 OK` |
| `POST` | **No** | **No** | Create subordinate resource or execute action | `201 Created` / `200 OK` / `202 Accepted` |
| `PUT` | **No** | **Yes** | Complete resource replacement or upsert | `200 OK` / `204 No Content` |
| `PATCH` | **No** | **No / Conditional** | Partial resource update (RFC 7396 Merge Patch) | `200 OK` |
| `DELETE` | **No** | **Yes** | Remove resource representation | `200 OK` (with body) / `204 No Content` |

### 3.3. HTTP Status Codes & Error Formatting (RFC 7807)

Never invent custom HTTP status codes or return `200 OK` with an embedded error flag.

* **Success Status Codes**:
  - `200 OK`: Successful retrieval (`GET`), update (`PUT`/`PATCH`), or action completion.
  - `201 Created`: Resource successfully created (`POST`). Must include `Location` header pointing to new resource.
  - `202 Accepted`: Asynchronous operation queued for background processing. Must provide polling URL or job token.
  - `204 No Content`: Successful action with no response body (e.g. deletion, empty updates).
* **Client Error Status Codes**:
  - `400 Bad Request`: Malformed syntax, invalid JSON, or unparseable query params.
  - `401 Unauthorized`: Missing or invalid authentication token. Must include `WWW-Authenticate` header.
  - `403 Forbidden`: Authenticated user lacks RBAC permission or tenant scope (`schoolId`/`branchId`).
  - `404 Not Found`: Target resource URI does not exist within the caller's tenant boundary.
  - `409 Conflict`: Business logic conflict (e.g. unique constraint collision, state machine violation).
  - `422 Unprocessable Entity`: Syntactically valid JSON that fails semantic domain validation (Zod schema failure).
  - `429 Too Many Requests`: Rate limit threshold exceeded. Must supply `Retry-After` header.
* **RFC 7807 Standard Error Envelope**:
  Every 4xx and 5xx response must return `application/problem+json`:

```json
{
  "type": "https://api.snp.edu.kh/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The payload failed schema validation constraints.",
  "instance": "/api/v1/students",
  "code": "STUDENT_VALIDATION_ERROR",
  "timestamp": "2026-11-04T10:30:00.000Z",
  "invalidParams": [
    {
      "field": "admissionDate",
      "reason": "Date must be formatted as ISO 8601 (YYYY-MM-DD)."
    }
  ]
}
```

### 3.4. Request & Response Payload Standards

* **JSON Data Types & Casing**:
  - All JSON property keys must be `camelCase`: `{"studentId": "...", "dateOfBirth": "..."}`.
  - Never use snake_case or PascalCase in JSON API bodies.
* **ISO 8601 Temporal Standards**:
  - All date-time values must be serialized in UTC ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g. `2026-11-04T10:24:41.000Z`).
  - Standalone calendar dates must use `YYYY-MM-DD`.
* **Explicit Null Handling**:
  - Prefer omitting optional keys or setting them explicitly to `null` if clearing a value.
  - Never serialize empty strings (`""`) as placeholders for missing numeric or date fields.
* **Monetary Values & Financial Precision**:
  - Never represent currency as IEEE 754 floating-point numbers.
  - Use integer cents/subunits (`amountCents: 15000` for \$150.00) or high-precision fixed strings (`amount: "150.00"`, `currency: "USD"`).

### 3.5. Collection Query Standards: Pagination, Filtering & Sorting

* **Cursor-Based Pagination (Primary)**:
  - Query parameters: `limit` (default 20, max 100) and `after` (opaque cursor token).
  - Response metadata:
    ```json
    {
      "data": [ ... ],
      "pagination": {
        "limit": 20,
        "hasMore": true,
        "nextCursor": "ZXhhbXBsZS1jdXJzb3I=",
        "totalCount": 1542
      }
    }
    ```
* **Offset-Based Pagination (Secondary / Reporting)**:
  - Query parameters: `page` (1-indexed) and `limit`.
* **Deterministic Sorting**:
  - Query parameter: `sort`. Use `-` prefix for descending order: `?sort=-createdAt,lastName`.
* **Filtering Conventions**:
  - Direct field equality: `?status=ACTIVE&branchId=BR-001`.
  - Date ranges: `?createdAfter=2026-01-01&createdBefore=2026-12-31`.

---

## 4. Integration with SNP-SMS Monorepo Architecture

All REST API endpoints in SNP-SMS live in `apps/backend/src/modules/` and must strictly follow the monorepo's 7-layer modular monolith pattern:

```
[HTTP Request]
      |
      v
  1. Route       : apps/backend/src/modules/<domain>/<domain>.routes.ts
      |           - Defines HTTP verb, URL path, middleware pipeline (Auth, RBAC, Tenancy)
      v
  2. Controller  : apps/backend/src/modules/<domain>/<domain>.controller.ts
      |           - Parses params/body, invokes Zod validation, maps HTTP status codes
      v
  3. Service     : apps/backend/src/modules/<domain>/<domain>.service.ts
      |           - Implements business logic, ACID transactions, domain invariants
      v
  4. Repository   : apps/backend/src/modules/<domain>/<domain>.repository.ts
      |           - Encapsulates database queries (MongoDB rs0 / Mongoose strictQuery)
      v
  5. Model        : apps/backend/src/modules/<domain>/<domain>.model.ts
      |           - Mongoose schema, compound tenant indexes ({ schoolId: 1, branchId: 1 })
      v
  6. Validation   : packages/shared/src/schemas/<domain>.schema.ts
      |           - Canonical Zod schemas shared between frontend and backend
      v
  7. Types / DTOs : packages/shared/src/types/<domain>.types.ts
                  - TypeScript interfaces, Request/Response DTO contracts
```

### 4.1. Mandatory Tenant Scoping Invariant

Every backend service, repository, and controller MUST scope all read and write operations by `schoolId` and `branchId` extracted from the authenticated JWT session:

```typescript
// [STANDARD] Multi-tenant isolation enforced server-side
export async function getStudentsByBranch(
  tenantContext: TenantContext, // { schoolId, branchId, userRole }
  queryFilter: StudentQueryDTO
): Promise<PaginatedResult<StudentDTO>> {
  const query = {
    schoolId: tenantContext.schoolId,
    branchId: tenantContext.branchId,
    ...sanitizeQuery(queryFilter)
  };
  return studentRepository.findPaginated(query);
}
```

---

## 5. Agent Operational Checklist for REST API Tasks

Before authoring, modifying, or reviewing any API endpoint, verify:

- `[CHECK-01]`: **URI Structure**: Uses plural nouns, kebab-case segments, and max 2 hierarchy levels.
- `[CHECK-02]`: **Method Semantics**: Uses `GET` for safe reads, `POST` for creations/actions, `PATCH` for partial updates, and `DELETE` for removal.
- `[CHECK-03]`: **Status Codes**: Returns canonical 2xx codes (`200`, `201`, `204`) and never masks errors behind `200 OK`.
- `[CHECK-04]`: **RFC 7807 Errors**: Error responses return `application/problem+json` with `title`, `status`, `detail`, `code`, and `invalidParams`.
- `[CHECK-05]`: **JSON & Casing**: All request/response keys are strictly `camelCase`.
- `[CHECK-06]`: **Date Standards**: All timestamps are formatted as ISO 8601 UTC strings (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- `[CHECK-07]`: **Pagination**: Large collections enforce cursor or limit/page pagination with max limit 100.
- `[CHECK-08]`: **Validation**: Inputs are rigorously validated using `@snp/shared` Zod schemas.
- `[CHECK-09]`: **Tenant Scoping**: All database queries filter by authenticated `schoolId` and `branchId`.
- `[CHECK-10]`: **Cryptographic Hygiene**: Secret comparisons and webhook validations execute via constant-time `crypto.timingSafeEqual`.
- `[CHECK-11]`: **Zero Credentials in Docs**: No concrete emails, passwords, or production IDs in documentation or test fixtures.
- `[CHECK-12]`: **Zero Emojis**: Strictly text-based status badges (`[PASSED]`, `[FAILED]`, `[MANDATORY]`).

---

## 6. Authoritative Reference Cross-Links

* Modular Knowledge Library (100 Topic Files): [`library/README.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/library/README.md)
* Unabridged 100 Topics Catalog: [`references/api-stylebook-design-topics.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/references/api-stylebook-design-topics.md)
* Cross-Guideline Reference Matrix: [`references/guidelines-matrix.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/references/guidelines-matrix.md)
* Machine-Readable Topics YAML: [`references/api-stylebook-topics.yaml`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/references/api-stylebook-topics.yaml)
* 16 Enterprise Source Guidelines: [`references/guidelines/`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/api-stylebook-design-topics/references/guidelines/)
* Monorepo Architecture Specification: [`.agents/skills/snp-sms-monorepo-architecture/SKILL.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/snp-sms-monorepo-architecture/SKILL.md)
* Code Security & Quality Policy: [`.agents/skills/snp-sms-code-security-quality-policy/SKILL.md`](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/snp-sms-code-security-quality-policy/SKILL.md)
