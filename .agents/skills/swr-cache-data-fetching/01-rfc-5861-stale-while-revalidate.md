# RFC 5861: Stale-While-Revalidate & HTTP Caching Architecture

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Standard**: [RFC 5861: HTTP Cache-Control Extensions for Stale Content](https://datatracker.ietf.org/doc/html/rfc5861)
> **Core Concept**: Serve stale data from memory instantly, revalidate in background over the network, then reconcile UI state.

---

## 1. The Core RFC 5861 Lifecycle

```text
User Action / Navigation ──> 1. Cache HIT?
                                  │
                 ┌────────────────┴────────────────┐
                 ▼ YES                             ▼ NO
        Serve Stale Data (0ms)              Show Loading Skeleton
                 │                                 │
                 └──────────────┬──────────────────┘
                                │
                                ▼
                 2. Background Network Revalidation
                     GET /api/v1/student/students
                     If-None-Match: W/"3a1b-xyz..."
                                │
                 ┌──────────────┴────────────────┐
                 ▼ 304 Not Modified              ▼ 200 OK (New Data)
           Zero Bytes Transferred           Update In-Memory Cache
           Keep Existing View               Seamlessly Re-render Delta
```

---

## 2. HTTP Cache-Control Headers

To instruct edge CDNs (Vercel, Cloudflare) and client caches to leverage RFC 5861, the backend sends:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
ETag: W/"d41d8cd98f00b204e9800998ecf8427e"
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

### Parameter Breakdown:
* `max-age=60`: Data is fresh for 60 seconds. Within 60 seconds, no network call is needed.
* `stale-while-revalidate=300`: For the next 300 seconds, the client serves the cached copy immediately while triggering a background revalidation to fetch updated data.

---

## 3. Backend Implementation: Conditional GET with ETags

In [`apps/backend/src/middleware/etag.ts`](file:///Users/Apple16/Desktop/SNP-SMS/apps/backend/src/middleware/etag.ts), the backend computes a hash of the response JSON. If the client already has the identical hash, return `304 Not Modified`:

```typescript
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export function etagHandler(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = (body: unknown): Response => {
    if (req.method === 'GET' && res.statusCode === 200) {
      const hash = crypto.createHash('md5').update(JSON.stringify(body)).digest('hex');
      const etag = `W/"${hash}"`;

      res.setHeader('ETag', etag);

      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end(); // 0 bytes payload, ultra-fast response
      }
    }
    return originalJson(body);
  };

  next();
}
```
