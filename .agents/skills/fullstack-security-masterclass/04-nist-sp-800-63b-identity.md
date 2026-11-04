# NIST SP 800-63B: Digital Identity & Authentication Management Handbook

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Standard**: [NIST Special Publication 800-63B (Revision 3/4 Draft) - Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
> **Focus**: Password policy, Authenticator Assurance Levels (AAL), credential stuffing defense, session lifecycle.

---

## 1. Modern NIST Password Guidelines vs. Outdated Legacy Rules

NIST SP 800-63B fundamentally changed authentication standards based on empirical human factors research:

| Area | Outdated Legacy Rules (Disallowed) | Modern NIST SP 800-63B Standard (Mandatory) |
| :--- | :--- | :--- |
| **Minimum Length** | 8 characters | **Minimum 12 characters** for user accounts; **16 characters** for administrators. |
| **Maximum Length** | 16-32 characters (truncated) | **At least 64 characters** supported without truncation (allows passphrases). |
| **Composition Rules** | Mandatory special characters, uppercase, numbers (e.g., `P@ssw0rd1!`) | **Zero composition rules**. Complexity rules encourage predictable patterns. |
| **Periodic Expiration** | Mandatory password changes every 90 days | **No arbitrary periodic expiration**. Force password change **only upon evidence of compromise**. |
| **Password Hints / Questions** | "Mother's maiden name", "First pet" | **Strictly prohibited**. Knowledge-based authentication (KBA) is insecure. |
| **Breached Credential Checks** | None | **Mandatory checking** against lists of known compromised passwords (e.g., HaveIBeenPwned). |

---

## 2. Authenticator Assurance Levels (AAL) for School Roles

```text
[ AAL1: Single-Factor ]         ──> Students, Parents (Password or Magic Link)
[ AAL2: Multi-Factor (MFA) ]    ──> Teachers, Staff, Registrars (Password + TOTP/Authenticator)
[ AAL3: Hardware / WebAuthn ]   ──> Super Admins, System Engineers, Finance Directors (Passkeys/FIDO2)
```

### Role-Based AAL Requirements:
* **Students & Parents (AAL1)**: Memorized secret (password $\ge 12$ chars) or passwordless magic link to verified email.
* **Faculty & Staff (AAL2)**: Password $\ge 12$ chars + time-based one-time password (TOTP via Google/Microsoft Authenticator).
* **Super Admins & Finance Directors (AAL2/AAL3)**: Passkey (FIDO2 / WebAuthn) or hardware security key; mandatory session re-authentication before sensitive operations (e.g., changing banking details, mass student deletion).

---

## 3. Defense Against Credential Stuffing & Brute Force

NIST SP 800-63B requires organizations to protect login endpoints against automated credential guessing:

### 1. Progressive Delay & IP Throttling
```typescript
import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute observation window
  max: 5,                   // Max 5 failed attempts per IP
  standardHeaders: true,    // Returns RateLimit-* headers (RFC 7807 compliant)
  legacyHeaders: false,
  message: {
    status: 429,
    title: 'Too Many Requests',
    detail: 'Too many failed login attempts. Please wait 15 minutes before retrying.'
  }
});
```

### 2. Account-Level Lockout Defense
* After 10 consecutive failed attempts on a specific username/email:
  * Temporarily lock the account for 30 minutes.
  * Dispatch an automated security alert email to the registered address informing them of the lockout.
  * Do not reveal whether the account exists in the HTTP response (generic error: *"Invalid credentials or account locked"*).

---

## 4. Session Lifecycle Management Standards

NIST SP 800-63B mandates strict controls over session duration and termination:

* **Inactivity Timeout**:
  * Automatically invalidate sessions after **30 minutes of user inactivity**.
  * The frontend detects mouse/keyboard idle state and prompts the user 2 minutes before expiration.
* **Maximum Session Duration**:
  * An absolute session limit of **12 hours**, regardless of activity. After 12 hours, require fresh re-authentication.
* **Explicit Logout Invalidation**:
  * On `POST /auth/logout`, destroy the session on the server, invalidate the refresh token in MongoDB, and clear client cookies.
* **Concurrent Session Termination**:
  * Provide users with a "Log out of all devices" button that revokes all active refresh tokens associated with their `userId`.
