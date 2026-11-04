# OWASP API Security Top 10 (2023) Masterclass & Defense Handbook

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Standard**: [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/)
> **Scope**: Dual-stack defense (Express 5 Backend API & Next.js 16 Web Frontend)

---

## 1. Overview of the 2023 Vulnerability Landscape

The OWASP API Security Top 10 (2023) reflects the shift towards microservices, distributed architectures, and mobile/single-page application (SPA) consumers:

| Code | Vulnerability Name | Primary Threat Vector | Dual-Stack Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **API1:2023** | **Broken Object Level Authorization (BOLA / IDOR)** | Accessing objects belonging to other users or tenants | Enforce tenant/branch scoping server-side on every query. |
| **API2:2023** | **Broken Authentication** | Credential stuffing, weak tokens, brute force | RFC 8725 JWT hygiene, rate-limiting, short TTLs. |
| **API3:2023** | **Broken Object Property Level Authorization (BOPLA)** | Mass assignment, exposing internal object attributes | Strict Zod schemas with `.strict()`, explicit response DTOs. |
| **API4:2023** | **Unrestricted Resource Consumption** | DoS via oversized payloads, unbounded pagination | Strict page limits (`limit <= 100`), body parser size limits (1MB). |
| **API5:2023** | **Broken Function Level Authorization (BFLA)** | Regular users executing admin endpoints | Declarative RBAC middleware with hierarchical implied scopes. |
| **API6:2023** | **Unrestricted Access to Sensitive Business Flows** | Bots bulk-scraping grades or abusing registration | Velocity throttling, CAPTCHA/Turnstile, business workflow guards. |
| **API7:2023** | **Server-Side Request Forgery (SSRF)** | Exploiting backend webhooks or image fetchers | Strict URL protocol and domain whitelisting, private IP blocking. |
| **API8:2023** | **Security Misconfiguration** | Permissive CORS, verbose stack traces in production | Explicit CORS origins, Helmet headers, RFC 7807 error envelopes. |
| **API9:2023** | **Improper Inventory Management** | Shadow APIs, unpatched v1 endpoints, debug routes | Automated OpenAPI generation, version retirement lifecycle. |
| **API10:2023**| **Unsafe Consumption of APIs** | Blindly trusting 3rd-party webhook payloads or APIs | Input validation on incoming webhooks, TLS verification. |

---

## 2. In-Depth Vulnerability Analysis & Concrete Defenses

### API1:2023 - Broken Object Level Authorization (BOLA)
* **Threat Mechanism**: Attacker substitutes an identifier in the request URL (`GET /api/v1/students/std_9999`) to view or mutate another student's confidential records without permission.
* **Backend Defense (Express 5 + Mongoose)**:
  * Never query by `_id` in isolation. Always merge the user's authenticated scope (`schoolId`, `branchId`) into the query filter:
  ```typescript
  // Secure repository implementation
  public async findStudentById(studentId: string, user: AuthenticatedUser) {
    const query: FilterQuery<StudentDocument> = { _id: studentId, schoolId: user.schoolId };
    
    // Inject branch access boundary unless user is super admin
    if (!user.permissions.includes('student.view.all_branches')) {
      query.branchId = user.primaryBranchId;
    }
    
    const record = await StudentModel.findOne(query);
    if (!record) {
      throw new NotFoundError('Student not found or access denied');
    }
    return record;
  }
  ```
* **Frontend Defense (Next.js)**:
  * Validate path parameters before dispatching network requests.
  * Never store raw object IDs in mutable browser state that can be tampered with.

---

### API2:2023 - Broken Authentication
* **Threat Mechanism**: Attackers exploit weak JWT secrets, missing signature validations, credential stuffing on login, or missing token revocation.
* **Backend Defense**:
  * Implement constant-time comparison for password and signature checks using `crypto.timingSafeEqual`.
  * Enforce strict IP/user rate limiting on login routes (max 5 failed attempts per 15-minute window).
  * Require short-lived access tokens (15 minutes) paired with single-use rotating refresh tokens stored in hashed format.
* **Frontend Defense**:
  * Store tokens in `HttpOnly; Secure; SameSite=Strict` cookies rather than `localStorage`.
  * Automatically clear client session state on `401 Unauthorized` responses.

---

### API3:2023 - Broken Object Property Level Authorization (BOPLA)
* **Threat Mechanism**:
  1. **Mass Assignment**: Attacker submits `{ "role": "super_admin", "tuitionPaid": true }` to `/profile`.
  2. **Data Exposure**: API serializes internal database columns (`passwordHash`, `auditMetadata`) into the client response.
* **Backend Defense**:
  * Enforce strict Zod schemas on every write route:
  ```typescript
  export const updateStudentSchema = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    phone: z.string().regex(/^\+?[0-9]{8,15}$/).optional(),
  }).strict(); // Drops or rejects unapproved fields
  ```
  * Enforce explicit Response DTO projection before serializing JSON:
  ```typescript
  function toStudentResponseDTO(doc: StudentDocument): StudentResponseDTO {
    return {
      id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      gradeLevel: doc.gradeLevel,
      status: doc.status
    };
  }
  ```

---

### API4:2023 - Unrestricted Resource Consumption
* **Threat Mechanism**: Attacker requests `GET /api/v1/students?limit=1000000`, causing Out-Of-Memory (OOM) crashes on the Node.js event loop or MongoDB connection pool exhaustion.
* **Backend Defense**:
  * Enforce non-negotiable pagination bounds:
  ```typescript
  const MAX_PAGE_LIMIT = 100;
  const DEFAULT_PAGE_LIMIT = 20;

  export const paginationQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(MAX_PAGE_LIMIT).default(DEFAULT_PAGE_LIMIT),
    page: z.coerce.number().int().min(1).default(1),
  });
  ```
  * Restrict Express JSON body parser size: `express.json({ limit: '1mb' })`.
  * Enforce database query timeouts: `StudentModel.find(query).maxTimeMS(5000)`.

---

### API5:2023 - Broken Function Level Authorization (BFLA)
* **Threat Mechanism**: Regular user accesses administrative endpoints by guessing URL paths (`DELETE /api/v1/finance/invoices/{id}` or `POST /api/v1/users/roles`).
* **Backend Defense**:
  * Declarative RBAC middleware attached to every route with granular implied scope validation:
  ```typescript
  invoiceRouter.delete(
    '/:id',
    authenticate,
    requireAuth,
    authorize('finance.delete.own_branch', 'finance.delete.all_branches'),
    requireBranchAccess(),
    controller.deleteInvoice
  );
  ```

---

### API6:2023 - Unrestricted Access to Sensitive Business Flows
* **Threat Mechanism**: Automated bots spam student registration forms, scrape teacher schedules, or brute-force promotional coupon codes.
* **Backend Defense**:
  * Apply flow-specific velocity limits (e.g., max 3 student registration attempts per hour per IP).
  * Require state tokens / idempotency keys on multi-step financial and academic checkout flows.
* **Frontend Defense**:
  * Integrate Cloudflare Turnstile or invisible bot-verification widgets on high-risk public forms.

---

### API7:2023 - Server-Side Request Forgery (SSRF)
* **Threat Mechanism**: API accepts an arbitrary URL for fetching student avatar images or external webhooks, allowing an attacker to probe `http://169.254.169.254` (cloud metadata) or internal database ports (`localhost:27017`).
* **Backend Defense**:
  * Whitelist allowed destination domains and protocols (`https:` only).
  * Resolve DNS and block private / loopback IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`):
  ```typescript
  import dns from 'node:dns/promises';
  import ipaddr from 'ipaddr.js';

  export async function validateSafeWebhookUrl(inputUrl: string): Promise<boolean> {
    const parsed = new URL(inputUrl);
    if (parsed.protocol !== 'https:') return false;

    const lookup = await dns.lookup(parsed.hostname);
    const addr = ipaddr.parse(lookup.address);
    if (addr.range() !== 'unicast') return false; // Blocks loopback, private, carrier-grade NAT

    return true;
  }
  ```

---

### API8:2023 - Security Misconfiguration
* **Threat Mechanism**: Default passwords, enabled debug routes, overly permissive CORS (`Access-Control-Allow-Origin: *` with credentials), or unhandled exceptions leaking database stack traces.
* **Backend Defense**:
  * Configure Helmet for secure HTTP headers (HSTS, CSP, X-Frame-Options).
  * Whitelist exact CORS origins only (`portal.snpi.edu.kh`, `localhost:3000`).
  * Return RFC 7807 error envelopes in production with zero internal stack traces.

---

### API9:2023 - Improper Inventory Management
* **Threat Mechanism**: Outdated API versions (`/api/v1/`) left running without security patches, or staging/debug routes exposed in production (`/debug/reset-db`).
* **Backend Defense**:
  * Maintain machine-generated OpenAPI 3.1 contracts in CI.
  * Formal sunset headers for retiring versions:
    ```http
    Sunset: Wed, 11 Nov 2026 00:00:00 GMT
    Deprecation: @1793788800
    Link: <https://api.snpi.edu.kh/v2/docs>; rel="successor-version"
    ```

---

### API10:2023 - Unsafe Consumption of APIs
* **Threat Mechanism**: Trusting incoming webhook payloads from external payment processors (e.g., Bakong KHQR, Stripe) without cryptographic signature verification.
* **Backend Defense**:
  * Verify webhook signatures using HMAC-SHA256 with `crypto.timingSafeEqual`:
  ```typescript
  import crypto from 'node:crypto';

  export function verifyWebhookSignature(rawBody: Buffer, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const expected = hmac.update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expected, 'utf8');
    const receivedBuf = Buffer.from(signature, 'utf8');

    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }
  ```
