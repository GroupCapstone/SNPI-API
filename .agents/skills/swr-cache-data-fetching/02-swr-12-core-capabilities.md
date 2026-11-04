# SWR: The 12 Foundational Architectural Capabilities

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Source**: Official SWR Architecture Specification (Vercel)
> **Reference Image**: `media_1793793930948_63db6aee.png`

---

## The 12 Core Capabilities Matrix

| # | Capability | Architectural Mechanism | Implementation in SMS Project |
| :- | :--- | :--- | :--- |
| **01** | **Fast, Lightweight, Reusable** | Minimal bundle footprint (~4KB), single hook invocation | Wrap into domain hooks: `useStudent(id)`, `useClasses()`. |
| **02** | **Transport & Protocol Agnostic** | Custom fetcher accepting any Promise-returning function | Plugs directly into `fetch`, Axios, or GraphQL. |
| **03** | **Built-in Cache & Deduplication** | Identical keys across multiple components issue 1 HTTP request | 5 components requesting `/students` generate only 1 network call. |
| **04** | **Real-Time Experience** | Key subscription listeners push live updates | WebSockets / SSE seamlessly update SWR cache. |
| **05** | **Revalidation on Focus** | Window focus event listener automatically revalidates stale data | Switching tabs immediately syncs fresh student grades. |
| **06** | **Revalidation on Reconnect** | Network `online` event listener triggers automatic refetch | Coming back online after Wi-Fi drop syncs records without reload. |
| **07** | **Polling on Interval** | Timer-based periodic polling with background tab pausing | Poll active attendance session every 10s; auto-pauses when hidden. |
| **08** | **Pagination & Scroll Restoration** | `useSWRInfinite` with persistent cursor/offset positioning | Preserves user scroll position in 1,000+ student directory. |
| **09** | **SSR and SSG Hydration** | `fallback` prop seeds client cache from server-rendered HTML | Instant initial render via Next.js Server Components, then client SWR. |
| **10** | **Local Optimistic Mutation** | Update UI immediately; reconcile against server response | Student added to list instantly; rolls back if backend rejects. |
| **11** | **Smart Error Retry** | Exponential backoff algorithm prevents thundering herd | Retries failed network requests with jittered delays (1s, 2s, 4s). |
| **12** | **TypeScript and Suspense** | Fully typed generic signatures and React Suspense boundary support | `useSWR<StudentDTO>('/api/v1/students')` with 100% autocomplete. |

---

## Code Implementations of the 12 Capabilities

### 01 & 02: Fast, Reusable & Protocol Agnostic Fetcher
```typescript
import useSWR from 'swr';

// Unified Fetcher with Bearer Token
export const fetcher = async <T>(url: string): Promise<T> => {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Network error');
  }

  return res.json();
};

// Reusable Hook
export function useStudent(id: string) {
  return useSWR<StudentDTO>(id ? `/api/v1/student/students/${id}` : null, fetcher);
}
```

---

### 03: Request Deduplication
When three sibling components mount simultaneously:
```tsx
// Header.tsx
const { data } = useSWR('/api/v1/identity/users/me', fetcher);

// Sidebar.tsx
const { data } = useSWR('/api/v1/identity/users/me', fetcher);

// ProfileBadge.tsx
const { data } = useSWR('/api/v1/identity/users/me', fetcher);
```
* **Result**: SWR detects the identical key `/api/v1/identity/users/me` and triggers **only 1 network request**. All three components receive the shared cached response.

---

### 05 & 06: Focus & Reconnect Revalidation
Configured globally in `SWRConfig`:
```tsx
<SWRConfig
  value={{
    revalidateOnFocus: true,      // Refetch when user returns to browser tab
    revalidateOnReconnect: true,  // Refetch when internet connection restores
    dedupingInterval: 5000,       // Deduplicate identical requests within 5s
  }}
>
  <App />
</SWRConfig>
```

---

### 07: Polling on Interval with Visibility Guard
```typescript
export function useLiveAttendance(classId: string) {
  return useSWR(`/api/v1/student/attendance?classId=${classId}`, fetcher, {
    refreshInterval: 10000,     // Poll every 10 seconds
    refreshWhenHidden: false,   // Pauses timer when user minimizes or switches tabs
  });
}
```

---

### 08: Pagination & Infinite Scroll (`useSWRInfinite`)
```typescript
import useSWRInfinite from 'swr/infinite';

export function useInfiniteStudents(gradeLevel: number) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<StudentDTO> | null) => {
    if (previousPageData && !previousPageData.data.length) return null; // Reached end
    return `/api/v1/student/students?page=${pageIndex + 1}&limit=20&grade=${gradeLevel}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

  const students = data ? data.flatMap(page => page.data) : [];
  const loadMore = () => setSize(size + 1);

  return { students, loadMore, isValidating };
}
```

---

### 10: Local Optimistic Mutation (`mutate`)
Update the UI immediately before the network request finishes, with automatic rollback on error:

```typescript
import { mutate } from 'swr';

export async function addStudentOptimistically(newStudent: CreateStudentDTO) {
  const key = '/api/v1/student/students';

  // 1. Optimistic Update (UI updates instantly)
  await mutate(
    key,
    async (current: PaginatedResponse<StudentDTO> | undefined) => {
      // 2. Perform actual server write
      const created = await apiClient<StudentDTO>('/student/students', {
        method: 'POST',
        body: JSON.stringify(newStudent)
      });
      return {
        ...current!,
        data: [created, ...(current?.data || [])]
      };
    },
    {
      optimisticData: (current: PaginatedResponse<StudentDTO> | undefined) => ({
        ...current!,
        data: [{ id: 'temp-id', ...newStudent, status: 'active' } as StudentDTO, ...(current?.data || [])]
      }),
      rollbackOnError: true,   // Automatically restores previous state if API returns 4xx/5xx
      revalidate: true         // Re-sync with server after write
    }
  );
}
```

---

### 11: Smart Exponential Backoff Error Retry
SWR automatically manages retries without flooding backend servers:
```typescript
<SWRConfig
  value={{
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000, // 1s, then 2s, then 4s with exponential jitter
  }}
>
```
