# SWR Backend API Optimization Standards

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Scope**: Express 5 Backend API (`apps/backend` / `snp-sms-api`) optimizations for SWR clients.

---

## 1. Backend Requirements for SWR Clients

To extract maximum performance from SWR clients in the frontend, the backend API must implement:

1. **Weak ETags on all GET routes**: Express computes MD5 or CRC32 hash of the payload and sends `ETag: W/"..."`.
2. **Support for `If-None-Match`**: Responding with `304 Not Modified` when the client's cache is identical to the database.
3. **Cache-Control Headers**: Declarative `stale-while-revalidate` directives on public and semi-static routes.
4. **Fast Mutation Endpoints**: POST/PATCH endpoints must return the updated resource JSON so the client can reconcile its local SWR cache without making a secondary GET request.

---

## 2. Express 5 SWR Cache Middleware

In `apps/backend/src/middleware/swr-cache.ts`:

```typescript
import type { Request, Response, NextFunction } from 'express';

export function swrCache(maxAgeSeconds = 30, staleSeconds = 120) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET') {
      res.setHeader(
        'Cache-Control',
        `private, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleSeconds}`
      );
    }
    next();
  };
}
```

---

## 3. The 304 Not Modified Handshake

```text
[ SWR Client (Browser) ]                               [ Express 5 API ]
         │                                                     │
         ├── 1. Initial Request: GET /api/v1/students ────────>│
         │                                                     ├── Queries MongoDB
         │                                                     ├── Computes Hash: "a1b2c3"
         │<── 2. Response: 200 OK (Payload: 45KB) ─────────────┤
         │      Headers: ETag: W/"a1b2c3"                      │
         │      (SWR caches in memory)                         │
         │                                                     │
         │   [ User switches tabs & refocuses 5 mins later ]   │
         │   (SWR renders cached 45KB instantly at 0ms)        │
         │                                                     │
         ├── 3. Background Revalidation ──────────────────────>│
         │      Header: If-None-Match: W/"a1b2c3"              │
         │                                                     ├── Hash unchanged: "a1b2c3"
         │<── 4. Response: 304 Not Modified (Payload: 0 Bytes) ┤
         │      (SWR confirms cache is valid, 0 UI flicker)    │
```

---

## 4. Immediate Mutation Payload Standard

When mutating data via `POST` or `PATCH`, the backend must return the complete updated object. This allows SWR's `mutate()` to update the local cache without issuing another network request:

```typescript
// Good: Returns updated entity
res.status(200).json({
  id: student.id,
  firstName: student.firstName,
  lastName: student.lastName,
  status: student.status,
  updatedAt: student.updatedAt
});

// Bad: Forces client to make another GET request
res.status(200).json({ success: true });
```
