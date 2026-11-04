# RFC 8725: JSON Web Token (JWT) Best Current Practices Handbook

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Standard**: [RFC 8725 - JSON Web Token Best Current Practices (IETF)](https://datatracker.ietf.org/doc/html/rfc8725)
> **Scope**: Token issuance, cryptographic validation, algorithm confusion defense, and rotation lifecycle.

---

## 1. Core Threat Vectors in JWT Deployments

RFC 8725 documents attacks against JWT implementations and prescribes mandatory defenses:

| Vulnerability Vector | Threat Description | Mandatory RFC 8725 Defense |
| :--- | :--- | :--- |
| **Algorithm Confusion** | Attacker switches asymmetric RSA token to symmetric HMAC using server's public key. | Explicitly whitelist verified algorithms; never infer verification method from `alg` header. |
| **The `none` Algorithm** | Attacker changes header `alg: "none"` and strips signature. | Disallow `none` algorithm unconditionally in production decoders. |
| **Weak Symmetric Secrets** | HMAC secrets with low entropy brute-forced via hashcat. | Minimum 256 bits (32 bytes) of cryptographically random entropy for HS256. |
| **Replay & Reuse Attacks** | Stolen tokens reused indefinitely by attackers. | Enforce short `exp` TTL (15 min), validate `jti` (JWT ID), rotate refresh tokens. |
| **Timing Side-Channels** | Byte-by-byte comparison leaks HMAC signature characters. | Compare signatures using constant-time `crypto.timingSafeEqual`. |
| **Cross-Service Confusion** | Token issued for Service A used to authenticate Service B. | Validate `iss` (issuer) and `aud` (audience) claims on every request. |

---

## 2. Mandatory JWT Verification Engine

In [`apps/backend/src/middleware/authenticate.ts`](file:///Users/Apple16/Desktop/SNP-SMS/apps/backend/src/middleware/authenticate.ts), token verification must adhere to the following rules:

```typescript
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../shared/errors/app-error';

export interface TokenPayload {
  sub: string;             // User Subject ID
  schoolId: string;        // Tenant School Identifier
  branchId: string;        // Assigned Primary Branch
  roles: string[];         // Assigned Core Roles
  permissions: string[];   // Pre-computed Implied Permissions
  jti: string;             // Unique Token Identifier (UUIDv4)
  iss: string;             // Issuer: 'https://api.snpi.edu.kh'
  aud: string;             // Audience: 'snpi-sms-web'
  iat: number;             // Issued At
  exp: number;             // Expiration (Max 15 minutes)
}

export function verifyAccessToken(token: string, secret: string): TokenPayload {
  try {
    return jwt.verify(token, secret, {
      // 1. Mandatory Algorithm Whitelist (Blocks 'none' and algorithm confusion attacks)
      algorithms: ['HS256'],
      
      // 2. Strict Issuer & Audience Validation
      issuer: 'https://api.snpi.edu.kh',
      audience: 'snpi-sms-web',
      
      // 3. Strict Clock Skew Tolerance (Max 5 seconds)
      clockTolerance: 5,
    }) as TokenPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token expired. Please refresh session.');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid cryptographic token signature.');
    }
    throw new UnauthorizedError('Authentication failed.');
  }
}
```

---

## 3. Refresh Token Rotation & Reuse Detection (RTR)

To achieve maximum security without forcing users to re-enter passwords every 15 minutes, implement **Refresh Token Rotation (RTR)**:

```text
[ Client ]                                     [ API Server ]
    │                                                 │
    ├── 1. POST /auth/refresh (RefreshToken A) ──────>│
    │                                                 ├── Verifies RefreshToken A in DB
    │                                                 ├── INVALIDATES RefreshToken A
    │                                                 ├── Generates RefreshToken B
    │                                                 ├── Generates AccessToken (15m)
    │<── 2. Returns (AccessToken + RefreshToken B) ───┤
    │                                                 │
    │   [ ATTACK SCENARIO: Stolen RefreshToken A ]    │
    ├── 3. Attacker sends RefreshToken A ────────────>│
    │                                                 ├── DETECTS REUSE OF REVOKED TOKEN
    │                                                 ├── REVOKES ALL TOKENS FOR USER
    │<── 4. Returns 401 Unauthorized (Breach Alarm) ──┤
```

### Server-Side Implementation Rules:
1. **Hash in Database**: Never store raw refresh tokens in plaintext. Store SHA-256 hashes (`crypto.createHash('sha256').update(rawToken).digest('hex')`).
2. **Reuse Detection**: If an incoming refresh token matches a token already flagged as `revoked: true`, immediately invalidate **all active sessions** for that `userId` (indicates a compromised token).
3. **Single-Use Enforcement**: Every refresh request burns the incoming token and issues a new pair.

---

## 4. Secure Token Storage: Cookie vs. LocalStorage

| Storage Mechanism | XSS Vulnerability | CSRF Vulnerability | Recommendation |
| :--- | :--- | :--- | :--- |
| **`localStorage`** | **CRITICAL**: Any XSS payload can read and exfiltrate tokens. | Immune. | **FORBIDDEN** for sensitive tokens. |
| **`HttpOnly; Secure; SameSite=Strict` Cookie** | **PROTECTED**: JavaScript running in browser cannot read token. | Protected by `SameSite=Strict` and Origin verification. | **MANDATORY** for Refresh & Access Tokens. |

### Cookie Header Configuration (Express):
```typescript
res.cookie('refreshToken', newRefreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/v1/identity/auth/refresh', // Scoped exclusively to refresh route
  maxAge: 7 * 24 * 60 * 60 * 1000,       // 7 days
});
```
