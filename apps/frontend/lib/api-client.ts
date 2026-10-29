import { getApiBaseUrl } from './env';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code?: string;

  public constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

interface ApiErrorPayload {
  message?: string;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface RefreshResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

let inMemoryAccessToken: string | null = null;
let sessionVersion = 0;

let refreshPromise: Promise<RefreshResponsePayload<{
  accessToken: string;
  user: unknown;
}> | null> | null = null;
let unauthorizedHandler: (() => void) | null = null;
let sessionRefreshHandler: ((session: { accessToken: string; user: unknown }) => void) | null =
  null;

export const setAccessToken = (token: string | null): void => {
  sessionVersion += 1;
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => inMemoryAccessToken;

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

export const setSessionRefreshHandler = (handler: typeof sessionRefreshHandler): void => {
  sessionRefreshHandler = handler;
};

export const performTokenRefresh = async <
  T = { accessToken: string; user: unknown },
>(): Promise<RefreshResponsePayload<T> | null> => {
  if (refreshPromise) {
    return refreshPromise as Promise<RefreshResponsePayload<T> | null>;
  }

  const refreshingSessionVersion = sessionVersion;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (refreshingSessionVersion !== sessionVersion) return null;
      if (!response.ok) {
        inMemoryAccessToken = null;
        return null;
      }

      const payload = (await response.json()) as RefreshResponsePayload<{
        accessToken: string;
        user: unknown;
      }>;

      if (refreshingSessionVersion !== sessionVersion) return null;
      if (!payload.success || !payload.data?.accessToken || !payload.data.user) {
        inMemoryAccessToken = null;
        return null;
      }
      inMemoryAccessToken = payload.data.accessToken;
      sessionRefreshHandler?.(payload.data);
      return payload;
    } catch {
      if (refreshingSessionVersion === sessionVersion) inMemoryAccessToken = null;
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise as Promise<RefreshResponsePayload<T> | null>;
};

const silentRefreshToken = async (): Promise<string | null> => {
  const result = await performTokenRefresh();
  return (result?.data as { accessToken?: string } | undefined)?.accessToken ?? null;
};

const baseRequest = async <T>(path: string, init?: RequestInit, isRetry = false): Promise<T> => {
  const requestSessionVersion = sessionVersion;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };

  if (inMemoryAccessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }

  if (typeof window !== 'undefined' && !headers['X-Branch-Id']) {
    try {
      const activeBranch = localStorage.getItem('snp_active_branch_id');
      if (activeBranch && activeBranch !== 'all') {
        headers['X-Branch-Id'] = activeBranch;
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  if (requestSessionVersion !== sessionVersion) {
    throw new ApiClientError(
      'The active session changed during the request',
      401,
      'SESSION_CHANGED',
    );
  }

  if (
    response.status === 401 &&
    !isRetry &&
    !path.startsWith('/auth/login') &&
    !path.startsWith('/auth/refresh')
  ) {
    const newToken = await silentRefreshToken();
    if (requestSessionVersion !== sessionVersion) {
      throw new ApiClientError(
        'The active session changed during the request',
        401,
        'SESSION_CHANGED',
      );
    }
    if (newToken) {
      return baseRequest<T>(path, init, true);
    }
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
  }
  if (response.status === 401 && isRetry) {
    inMemoryAccessToken = null;
    unauthorizedHandler?.();
  }

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    const detailMsg = errorPayload.errors?.[0]?.message;
    const fieldName = errorPayload.errors?.[0]?.field;
    const resolvedMsg =
      detailMsg && fieldName
        ? `${errorPayload.message ?? 'Validation failed'}: ${fieldName} - ${detailMsg}`
        : (errorPayload.message ?? 'Unable to complete the request');

    throw new ApiClientError(resolvedMsg, response.status, errorPayload.code);
  }

  const payload = (await response.json()) as T;
  if (requestSessionVersion !== sessionVersion) {
    throw new ApiClientError(
      'The active session changed during the request',
      401,
      'SESSION_CHANGED',
    );
  }
  return payload;
};

export const apiClient = Object.assign(baseRequest, {
  get: <T>(path: string, init?: RequestInit) => baseRequest<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    baseRequest<T>(path, {
      ...init,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    baseRequest<T>(path, {
      ...init,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    baseRequest<T>(path, {
      ...init,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, init?: RequestInit) =>
    baseRequest<T>(path, { ...init, method: 'DELETE' }),
  setAccessToken,
  getAccessToken,
  setUnauthorizedHandler,
});
