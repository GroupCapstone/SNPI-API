# API Security Dictionary & REST API Architecture

Comprehensive reference for API concepts, REST structure standards, and OWASP API Security Top 10 implementation in the SNP Integrated Multi-Branch School Management System (SNP-SMS).

---

## 1. Word Dictionary & Technical Glossary

- **API (Application Programming Interface)**: The formal communication contract between client applications and server services.
- **API Call**: A single network request dispatched to invoke a specific server action.
- **API Economy**: Business value model derived from exposing services and data securely through APIs.
- **API Endpoint**: The URI location where a specific resource or operation is addressed (e.g. `/api/v1/students`).
- **API Gateway**: Edge routing and reverse-proxy component handling rate limiting, security, and protocol translation.
- **API Integration**: Connecting external services (Telegram, Twilio) with internal system logic.
- **API Keys**: Static authentication credentials for server-to-server communication.
- **API Layer**: The presentation tier receiving HTTP requests, validating inputs, and returning responses.
- **API Lifecycle**: End-to-end design, development, testing, monitoring, and deprecation lifecycle.
- **API Portal**: Centralized developer interface for viewing documentation, testing endpoints, and managing keys.
- **API Request**: Inbound HTTP message containing verbs, headers, queries, and payload bodies.
- **API Security**: Policies and controls safeguarding APIs against unauthorized access, leaks, and exploitation.
- **Apigee**: Google Cloud enterprise API management platform.
- **APIsec**: Automated API security scanner specializing in finding business logic flaws.
- **Application**: The complete multi-branch school management software system.
- **Authentication**: Verifying the user or system identity via JWT tokens.
- **Burp Suite**: Industry standard penetration testing tool for intercepting and inspecting HTTP traffic.
- **Cache**: Fast transient storage layer for frequently read or static resources.
- **CI/CD**: Continuous Integration / Continuous Deployment pipeline automating tests and production releases.
- **Client**: Front-end consumer (Next.js web application, mobile app, or external webhook receiver).
- **CRUD**: Core data persistence actions (Create, Read, Update, Delete).
- **DDoS**: Distributed Denial of Service attack exhausting server resources.
- **Framework**: Core runtime scaffold (Express.js on backend, Next.js on frontend).
- **JSON**: JavaScript Object Notation data serialization format.
- **Logic Flaw**: Flaw in business rules or authorization checks allowing unintended manipulation.
- **Method**: Standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`).
- **Microservices**: Modular architectural style with distributed, independently deployable services.
- **Monetization**: Commercial subscription, fee collection, and tuition billing capabilities.
- **Over-Permissioned**: An account, token, or role assigned broader authority than needed (violating least privilege).
- **OWASP**: Open Worldwide Application Security Project, maintaining the API Security Top 10 standards.
- **Pagination**: Structured chunking of large datasets via `page` and `limit`.
- **Parameters**: Variables provided via URL paths (`:id`), queries (`?status=active`), or headers (`X-Branch-ID`).
- **Payload**: Request or response body data, constrained by size limits (`1mb`).
- **Penetration Testing**: Simulated security attacks verifying vulnerability defense.
- **Production**: Live deployed operating environment with strict secret separation and error masking.
- **Query Parameters**: Key-value pairs used for filtering, searching, and sorting collections.
- **Rate Limiting**: Request frequency throttling mitigating brute force, scraping, and DoS.
- **Red Teams**: Offensive cybersecurity assessment teams testing system resilience.
- **Request**: Client-to-server transaction.
- **Resource**: Domain business entity (e.g., `Branch`, `Student`, `Employee`).
- **Response**: Server-to-client return message with status code, headers, and body.
- **Response Code**: Standard 3-digit HTTP status code (`200`, `201`, `400`, `401`, `403`, `404`, `422`, `429`, `500`).
- **REST (Representational State Transfer)**: Architectural pattern leveraging standard HTTP methods and resource URIs.
- **SDK (Software Development Kit)**: Reusable client library simplifying API consumption.
- **SDLC**: Software Development Life Cycle.
- **SOAP**: Legacy XML-based messaging protocol.
- **SQL / NoSQL Injection**: Exploitation injecting query syntax into untrusted inputs.
- **Webhook**: Event-driven HTTP push callback.
- **ZAP (Zed Attack Proxy)**: OWASP dynamic security testing tool.

---

## 2. REST API Design Roadmap

1. **API Fundamentals**: Clean REST conventions over HTTPS using versioned URIs (`/api/v1/...`).
2. **Design Principles**: Uniform response formats, deterministic status codes, zero trust of client IDs.
3. **Resource Modeling**: Plural nouns for collections (`/api/v1/classes`, `/api/v1/departments`).
4. **Endpoint Design**:
   - `GET /api/v1/<resources>`: List resources (paginated).
   - `POST /api/v1/<resources>`: Create new resource.
   - `GET /api/v1/<resources>/:id`: Retrieve single resource by ID.
   - `PATCH /api/v1/<resources>/:id`: Partial resource update.
   - `DELETE /api/v1/<resources>/:id`: Soft delete resource.
5. **Query Parameters**: Standardized `page`, `limit`, `search`, `status`, and `branchId`.
6. **Request & Response Envelopes**:
   - `SuccessResponse`: `{ success: true, message, data }`.
   - `PaginatedResponse`: `{ success: true, message, data, pagination: { page, limit, total, totalPages } }`.
   - `ErrorResponse`: `{ success: false, message, code, errors?: [...] }`.
7. **Error Handling**: Mask internal server errors in production while returning actionable validation error lists.
8. **Security**: Dual-token JWT lifecycle (15m access / 7d refresh), strict RBAC permissions, branch-level access control.
9. **Versioning**: Route-based `/api/v1` namespace.
10. **Cross-Cutting Concerns**: Rate limiting, Pino structured logging with PII redaction, Helmet security headers.

---

## 3. OWASP API Security Top 10 Summary & SNP-SMS Defenses

| Vulnerability                       | SNP-SMS Defense & Implementation                                                                                 |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **API1: BOLA / IDOR**               | Enforced session `schoolId` and `branchAccess` scoping on every database lookup.                                 |
| **API2: Broken Authentication**     | 15-min JWT access tokens, SHA-256 rotated refresh tokens, 5-attempt lockout, weak password rejection.            |
| **API3: BOPLA / Mass Assignment**   | Strict Zod schemas for input validation; output projection whitelisting in `AuthService.sanitizeUser`.           |
| **API4: Resource Consumption**      | Dual-tier rate limiting (global + mutation), `1mb` body limit, max 100 items/page, 413 error normalization.      |
| **API5: BFLA / RBAC**               | Strict 3-part permission structure (`module.action.scope`) checked via `authorize(...)` on all protected routes. |
| **API6: Sensitive Business Flows**  | Audit logging on high-impact administrative actions (password resets, role updates, bulk imports).               |
| **API7: SSRF**                      | Outbound requests restricted to trusted static URLs (Telegram/Twilio) with explicit timeout abort signals.       |
| **API8: Security Misconfiguration** | Hardened Helmet headers (HSTS, CSP, nosniff), disabled `x-powered-by`, sanitized `X-Request-ID`.                 |
| **API9: Inventory Management**      | Clean API versioning under `/api/v1/*`, catch-all 404 handler for unmapped routes.                               |
| **API10: Unsafe Consumption**       | Strict validation and response typing on third-party webhook and API payloads.                                   |
