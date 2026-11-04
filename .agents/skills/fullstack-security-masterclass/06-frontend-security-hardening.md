# Next.js Frontend Security & Browser Hardening Handbook

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Scope**: Next.js 16 (App Router), React 19, and Browser Runtime Security

---

## 1. Mandatory HTTP Security Headers (`next.config.ts`)

Configure browser security headers in `apps/frontend/next.config.ts` to defend against Clickjacking, MIME-sniffing, and Protocol Downgrades:

```typescript
import type { NextConfig } from 'next';

const securityHeaders = [
  // 1. Enforce HTTPS for 2 years with preloading
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // 2. Prevent Clickjacking (disallow embedding in iframes)
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // 3. Block MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // 4. Protect referrer leakage on cross-origin navigation
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // 5. Restrict dangerous browser hardware APIs
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  // 6. Content Security Policy (CSP)
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self';
      connect-src 'self' https://api.snpi.edu.kh http://localhost:5000;
      frame-src https://challenges.cloudflare.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## 2. Cross-Site Scripting (XSS) Defenses in React 19

### 1. Ban Raw HTML Injection
* Avoid `dangerouslySetInnerHTML` across all UI components.
* If rendering sanitized user markup (e.g., student announcement rich text), always pass through **DOMPurify** with strict tags:
  ```typescript
  import DOMPurify from 'isomorphic-dompurify';

  export function SafeHTML({ content }: { content: string }) {
    const clean = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });

    return <div dangerouslySetInnerHTML={{ __html: clean }} />;
  }
  ```

### 2. URL Scheme Validation on Dynamic Links
* Prevent `javascript:` URI attacks when rendering student-provided portfolio links:
  ```typescript
  export function sanitizeExternalUrl(url: string): string {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString();
      }
    } catch {
      // Invalid URL
    }
    return '#';
  }
  ```

---

## 3. Client-Side Sensitive State Hygiene

* **Rule 1: Never Store Sensitive PII in `localStorage`**:
  * Passwords, National IDs, student medical notes, and payment tokens must never be written to `localStorage` or `sessionStorage` (accessible to any malicious JavaScript or browser extension).
* **Rule 2: Mask Sensitive Data in UI Presentation**:
  * Credit card numbers, bank accounts, and telephone numbers must be masked by default:
    * `**** **** **** 4821`
    * `+855 12 *** 789`
* **Rule 3: Automatic Session Teardown**:
  * The frontend client must register a 401 response interceptor that immediately purges user profile state and redirects to `/login` upon token expiration or invalidation.
