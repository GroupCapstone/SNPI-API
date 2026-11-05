---
name: iam-rbac-abac-rebac-authorization
description: >-
  Authoritative specification and operational guide for Modern IAM, Authentication (AuthN) vs. Authorization (AuthZ), Access Control Architectures (RBAC, ABAC, ReBAC), Red Hat Developer Hub RBAC REST API standards, and Zero-Trust Layer 1 Client Authentication. Trigger on: "iam", "rbac", "abac", "rebac", "authentication vs authorization", "auth0", "red hat developer hub rbac", "permission policies", "access control".
---

# Modern IAM & Access Control Architecture Standard
## Identity, Authentication, Authorization, RBAC REST APIs & Zero-Trust Defense

This skill establishes the authoritative architectural rules, comparison matrices, REST API specifications, and operational standards for Identity & Access Management (IAM), Authentication (AuthN), Authorization (AuthZ), and modern access control paradigms (RBAC, ABAC, ReBAC) across the enterprise platform.

---

## 1. Authentication (AuthN) vs. Authorization (AuthZ) Invariants

Authentication and Authorization represent two distinct, sequential security checkpoints within the IAM lifecycle:

| Dimension | Authentication (AuthN) | Authorization (AuthZ) |
| :--- | :--- | :--- |
| **Core Question** | *"Who are you?"* | *"What are you permitted to do?"* |
| **The Process** | Cryptographic verification of identity claims against an Identity Provider (IdP) | Evaluation of authenticated identity, roles, attributes, and context against policy rules |
| **Sequence** | **Step 1 (First)** — Precedes all permission and policy evaluation | **Step 2 (Second)** — Evaluated strictly after identity is cryptographically proven |
| **Methods & Protocols** | Passwords, Passkeys, WebAuthn, MFA, OAuth 2.0 / OIDC, SAML 2.0 | RBAC (Roles), ABAC (Attributes), ReBAC (Graphs), Scopes, Policy Engines |
| **Token Representation** | **ID Token** (JWT containing identity claims: `sub`, `email`, `name`, `auth_time`) | **Access Token** (JWT containing authorization claims: `roles`, `permissions`, `scopes`) |
| **HTTP Failure Status** | **`401 Unauthorized`** (Missing, expired, or invalid identity credentials) | **`403 Forbidden`** (Identity is verified, but permissions/policies deny access) |
| **Real-World Analogy** | Government Passport (Proves who you are at customs security) | Boarding Pass (Grants entry to a specific seat on a specific departing flight) |

---

## 2. Access Control Model Comparison: RBAC vs. ABAC vs. ReBAC

| Dimension | Role-Based Access Control (RBAC) | Attribute-Based Access Control (ABAC) | Relationship-Based Access Control (ReBAC) |
| :--- | :--- | :--- | :--- |
| **Decision Determinant** | User's assigned **Role** (Job function/responsibility) | Contextual **Attributes** (User, Resource, Environment, Time) | **Graph Relationships** and entity tuples |
| **Core Question** | *"What role does this user hold?"* | *"Do user and environment attributes satisfy the policy rule?"* | *"What is the relational path between user and resource?"* |
| **Evaluation Latency** | **Fastest (~0.1ms)** (In-memory Set / bitwise lookup) | **Medium (~2-10ms)** (Evaluates Boolean rule expressions) | **Variable (~5-30ms)** (Graph traversal across entity links) |
| **Implementation Complexity** | Low (Straightforward to model, configure, and audit) | High (Complex policy engine, e.g. OPA, XACML, Cedar) | High (Requires dedicated graph datastore like OpenFGA or SpiceDB) |
| **Primary Failure Mode** | **Role Explosion** (e.g. creating 500 micro-roles for combinations) | **Policy Sprawl** (Unmanageable conflicting policy rules) | **Traversal Bottlenecks** on deep hierarchical graphs |
| **Best Application** | Coarse-grained operational permissions (`Admin`, `Teacher`) | Dynamic constraints (Time of day, IP subnet, tenant boundary) | Fine-grained hierarchical sharing (Google Drive, GitHub Teams) |

---

## 3. High-Performance Hybrid Architecture: Scoped RBAC + Contextual ABAC

To eliminate Role Explosion while achieving sub-millisecond route authorization latency, modern enterprise microservices execute a **Dual-Layer Hybrid Model**:

```
[Incoming HTTP Request + Bearer JWT]
                 ↓
[Layer 1: Identity AuthN Middleware] ──(Validates JWT signature & expiration -> 401 if invalid)
                 ↓
[Layer 2: Fast RBAC Guard Middleware] ──(O(1) in-memory Set check: userPermissions.has(requiredPerm) -> 403 if missing)
                 ↓
[Layer 3: Scoped ABAC Context Injector] ──(Enforces tenant boundaries: schoolId, branchId, ownerId -> 403 if unauthorized)
                 ↓
[Domain Service & Repository Execution]
```

### Architectural Advantages:
1. **Zero Database Lookups for Route Guards**:
   - The user's active permissions array is embedded within the verified JWT access token or cached in high-speed in-memory store.
   - Route middleware performs an $O(1)$ lookup (`user.permissions.includes('student:write')`) in $<0.2\text{ms}$.
2. **Elimination of Role Explosion**:
   - Instead of defining separate roles for each branch (`Branch1_Teacher`, `Branch2_Teacher`), define a single role (`Teacher`) and enforce the branch boundary via Layer 3 context attributes (`schoolId`, `branchId`).
3. **ReBAC Consideration**:
   - Introduce ReBAC (OpenFGA, Google Zanzibar, SpiceDB) only when end-users dynamically share arbitrary resources with peer users in deep folder trees. Multi-tenant ERPs do not require ReBAC overhead.

---

## 4. Red Hat Developer Hub RBAC REST API Specification

The Red Hat Developer Hub (RHDH) RBAC plugin standardizes REST endpoints for managing role definitions and permission policies across developer platforms.

### A. Authorization & Administrative Guard
- **Header Standard**: All API requests must include a Bearer token:
  ```http
  Authorization: Bearer <BEARER_TOKEN>
  ```
- **Policy Administrator Guard**:
  - The API strictly enforces that the caller's identity is defined under `permission.rbac.admin.users` in `app-config.yaml`:
    ```yaml
    permission:
      enabled: true
      rbac:
        admin:
          users:
            - name: user:default/<USER_IDENTIFIER>
    ```
  - Unlisted users are rejected with HTTP `403 Forbidden`.

### B. Base URL & Resource Endpoint Structure
- **Base URL**: `http://<SERVER>:<PORT>/api/permission/policies` (e.g. `http://localhost:7007/api/permission/policies`)
- **URI Pattern**: `/api/permission/policies/[kind]/[namespace]/[name]`
  - Example: `http://localhost:7007/api/permission/policies/user/default/<USER_IDENTIFIER>`

### C. Supported HTTP Methods
- `GET`: Retrieves all permission policies, specific policies, or role definitions.
- `POST`: Creates or updates a permission policy or role.
- `PUT`: Updates an existing permission policy or role.
- `DELETE`: Deletes a permission policy or role.

### D. Source Tracking for Data Consistency
Every permission policy and role carries an immutable **Source** identifier to prevent collision between automated code and human edits:
1. **`CSV file`**: Policies sourced from static CSV manifests.
2. **`Configuration file`**: Policies defined statically in `app-config.yaml`.
3. **`REST API`**: Dynamic policies mutated via HTTP REST endpoints.
4. **`Legacy`**: Backward-compatible policies from previous plugin versions.

---

## 5. Zero-Trust Layer 1 Client Authentication Standard

In addition to user-level bearer authentication, all external client communication must implement Layer 1 Machine-to-Machine (M2M) perimeter validation:

1. **Client API Key Validation (`X-Client-Api-Key`)**:
   - Every client request must provide an authorized client key.
2. **HMAC-SHA256 Request Signing (`X-Signature-SHA256`)**:
   - Payloads are hashed using a shared secret and verified using constant-time comparison:
     ```typescript
     crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
     ```
3. **Dual-Token Session Lifecycle**:
   - **Access Token**: Short-lived (15 minutes), passed in `Authorization: Bearer <JWT>`, carries permissions.
   - **Refresh Token**: Long-lived (7 days), stored in an HTTP-only, secure, strict cookie (`refreshToken`), rotated upon use.

---

## 6. Headless Backend & Clean Documentation Invariant

- **Headless Backend**: The API backend must remain 100% headless, serving only JSON REST endpoints and raw OpenAPI schemas in development. Zero HTML/Nextra docs may be served from the backend domain.
- **Client Documentation Portal (`/document`)**: Must be hosted exclusively on the frontend web application (`SNPI-Web`) adhering to the Bakong Clean Table design:
  - High-contrast Light-Day-First surfaces (`#FFFFFF` White, `#EFF5FF` Ice Tint, `#CAD3F5` Lavender borders).
  - Deep Navy (`#0A1A4A`) typography.
  - Zero dark terminal boxes, zero pulsing beacons, and zero concrete credentials in sample code.

---

## 7. Mandatory GitHub-First CI/CD & Production Release Pipeline

Whenever commanded to release or push (`push`, `git push`, `release it all`, `publish`):
1. **Fast Pre-Flight Gates**: Format check, ESLint (`npm run lint`), TypeScript check (`npm run typecheck`), build compilation (`npm run build`), and dual-dev sync (`npm run git:sync`).
2. **Push to GitHub FIRST**: Push commits and tags to GitHub remote `origin/main` (`git push origin main --tags`).
3. **Watch CI Until 100% Green**: Monitor all triggered GitHub Actions CI runs via fast 3.5s polling. Halt immediately if any check fails.
4. **Deploy to Vercel Production AFTER CI Green**: Deploy via `npx vercel --prod` only after all remote CI checks pass.
5. **Live Health Probe**: Confirm `https://api.kesararamwithdigital.tech/api/v1/health` responds `HTTP/2 200 OK`.
