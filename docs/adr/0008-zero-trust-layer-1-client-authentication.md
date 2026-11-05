# ADR-0008: Zero-Trust Layer 1 Client Authentication & M2M Request Verification

## Status

Accepted

## Context & Rationale (Why Developer Asked)

In standard REST API deployments, authentication typically relies solely on **User Authentication** via Bearer JWT tokens (`Authorization: Bearer <TOKEN>`). While this validates the identity and RBAC permissions of the human operator (teacher, student, administrator), it leaves a critical architectural vulnerability:

1. **Untrusted Application Origin**: An attacker or rogue script who acquires a user access token can execute API mutations directly from arbitrary clients (`curl`, Postman, automated scrapers) without traversing the authorized frontend client application (`SNPI-Web`).
2. **Missing Application Trust**: The backend had no mechanism to cryptographically confirm that incoming requests originated from an authentic, approved client application instance rather than an unauthorized third-party caller.

To eliminate this gap, the developer requested a **Zero-Trust Architecture (ZTA)** pattern: establishing **Dual-Layer Defense-in-Depth** by enforcing mutual trust at both the **Application Layer (Machine-to-Machine)** and the **User Layer (RBAC Session)**.

## Decision

1. **Zero-Trust Layer 1 Middleware (`src/middleware/client-auth.ts`)**:
   - Implemented `verifyTrustedClient` across all `/api/v1` routes ahead of domain controllers.
   - Evaluates incoming client credentials before passing requests to the user session auth guard.
   - Exempts public diagnostic routes: `/health`, `/docs`, and `/docs/openapi.json`.

2. **Constant-Time Verification Engine**:
   - Uses `crypto.timingSafeEqual` in `safeCompareSecrets()` to eliminate timing side-channel attacks during secret comparison.

3. **Dual Verification Channels**:
   - **Static M2M Key**: Verifies pre-shared secret passed via `X-Client-Api-Key`.
   - **Cryptographic Request Signing**: Supports dynamic HMAC-SHA256 payload signatures via `X-Signature-SHA256` computed with the shared secret.

4. **CORS Protocol Update (`src/middleware/security.ts`)**:
   - Whitelisted `X-Client-Api-Key` and `X-Signature-SHA256` in `corsOptions.allowedHeaders` to permit legitimate preflight requests from authorized web origins.

5. **Environment Configuration (`src/config/env.ts`)**:
   - Introduced `CLIENT_API_KEY` (minimum 16 characters) and `ENFORCE_CLIENT_AUTH` flags.
   - Graceful fallback in test environments (`NODE_ENV === 'test'`) ensuring backwards compatibility with existing unit and integration test suites.

## Consequences

- **Positive**:
  - Restricts API mutation surfaces strictly to trusted frontend applications (`SNPI-Web`) and authorized services.
  - Defense-in-depth: stolen user JWTs cannot be exploited through external scripts without the accompanying client key.
  - Full cryptographic timing attack resistance.
- **Negative**:
  - Frontend client configurations must maintain `BACKEND_CLIENT_API_KEY` within `.env.local` or Next.js server proxies.
