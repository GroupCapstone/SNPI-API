---
name: swr-cache-data-fetching
description: Authoritative specification for SWR (Stale-While-Revalidate, HTTP RFC 5861) client data fetching, background revalidation, request deduplication, optimistic UI mutations, and backend 304 ETag handshakes for SNP-SMS.
---

# SWR: Stale-While-Revalidate Client Architecture & Backend Integration

> Authoritative enterprise specification for client-side data fetching, automatic background revalidation, request deduplication, and optimistic mutations based on **HTTP RFC 5861 (Stale-While-Revalidate)** and **SWR**.

---

## 1. Core Principle (RFC 5861)

```
"Serve cached data first, revalidate behind it, then update. Repeat views render instantly."
```

Instead of blocking UI rendering with spinner states on every navigation, the client renders the last-known cached representation at **0 milliseconds**, fires an asynchronous background revalidation to the backend API, and reconciles any state diffs seamlessly.

---

## 2. The 12 Foundational Architectural Capabilities

Derived from the official SWR architecture (`media_1793793930948_63db6aee.png`):

| # | Capability | Architectural Description | Authoritative Reference |
| :- | :--- | :--- | :--- |
| **01** | **Fast, Lightweight, Reusable** | ~4KB footprint, single hook invocation across UI tree | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **02** | **Transport & Protocol Agnostic**| Bring your own fetcher: REST, GraphQL, gRPC, or custom fetch | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **03** | **Built-in Cache & Deduplication**| Components sharing a key issue a single request | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **04** | **Real-Time Experience** | Key subscription listeners push live updates | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **05** | **Revalidation on Focus** | Switching back to a browser tab refetches automatically | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **06** | **Revalidation on Reconnect** | Reconnecting to the internet refetches without event listeners | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **07** | **Polling on Interval** | Timer-based periodic polling, paused when tab is hidden | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **08** | **Pagination & Scroll Restoration**| Paginated and infinite lists (`useSWRInfinite`) preserve scroll | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **09** | **SSR and SSG Hydration** | Hydrate from server-rendered HTML and revalidate on client | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **10** | **Local Optimistic Mutation** | Update UI optimistically, reconcile against server response | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **11** | **Smart Error Retry** | Exponential backoff algorithm prevents hammering the origin | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |
| **12** | **TypeScript and Suspense** | Fully typed generic signatures with React Suspense readiness | [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md) |

---

## 3. Knowledge Directory Index

* [`01-rfc-5861-stale-while-revalidate.md`](./01-rfc-5861-stale-while-revalidate.md): RFC 5861 caching standard, Cache-Control headers, and 304 ETag handshakes.
* [`02-swr-12-core-capabilities.md`](./02-swr-12-core-capabilities.md): Exhaustive breakdown and code snippets for all 12 capabilities from the visual specification.
* [`03-backend-api-integration.md`](./03-backend-api-integration.md): Express 5 backend optimizations for SWR (Weak ETags, Cache-Control, and mutation payloads).

---

## 4. The 10-Point SWR Quality Gate

Verify every client data hook and backend API endpoint against this gate:

1. [ ] **RFC 5861 Compliance**: Client renders cached data immediately while revalidating.
2. [ ] **Request Deduplication**: Sibling components mount with shared key emitting $\le 1$ network call.
3. [ ] **Focus Revalidation**: Stale data updates automatically when the user returns to the tab.
4. [ ] **Reconnect Revalidation**: Network recovery automatically refetches active keys.
5. [ ] **Optimistic Rollback**: Local mutations roll back to previous state if backend returns 4xx/5xx.
6. [ ] **Visibility Guard on Polling**: Periodic polling pauses when browser tab is inactive (`refreshWhenHidden: false`).
7. [ ] **Jittered Backoff**: Network errors back off exponentially (1s, 2s, 4s) instead of hammering the server.
8. [ ] **Backend Weak ETags**: Express backend returns `ETag: W/"..."` on all GET responses.
9. [ ] **Conditional GET (304)**: Backend returns `304 Not Modified` with 0 bytes body when hash matches `If-None-Match`.
10. [ ] **Full Mutation Returns**: Backend `POST`/`PATCH` endpoints return the full updated object for instant cache reconciliation.

---

## 5. Skill Activation & Routing

* **Registered Aliases**:
  * `apply skill swr`
  * `apply skill data-fetching`
* **Trigger Situations**:
  * Implementing client-side data fetching in Next.js or React.
  * Adding optimistic UI updates for student registration, grades, or payments.
  * Configuring backend caching headers (`Cache-Control`) and ETags.
  * Building infinite-scroll tables or paginated directories.
  * Handling real-time synchronization between separate frontend and backend repos.

---

## 6. Standby Operating Protocol

* **Standby Mode**: All SWR architectural patterns and code samples are recorded for future reference.
* **Zero Premature Modification**: Do not modify existing production routes or frontend query hooks until the user explicitly commands to apply SWR.
