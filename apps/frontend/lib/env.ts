const API_PATH = '/api/v1';

const getServerApiBaseUrl = (): string => {
  const configuredUrl = process.env.BACKEND_INTERNAL_URL;
  const requiresHttps = Boolean(process.env.VERCEL_ENV) || process.env.APP_ENV !== 'development';
  if (!configuredUrl && requiresHttps) {
    throw new Error('BACKEND_INTERNAL_URL must be configured for production server requests');
  }

  const backendUrl = configuredUrl ?? 'http://localhost:4000/api/v1';
  const parsedUrl = new URL(backendUrl);
  const apiPath = parsedUrl.pathname.replace(/\/$/, '');

  if (
    (requiresHttps && parsedUrl.protocol !== 'https:') ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.search ||
    parsedUrl.hash ||
    apiPath !== API_PATH
  ) {
    throw new Error('BACKEND_INTERNAL_URL must be a credential-free HTTPS API base in production');
  }

  return `${parsedUrl.origin}${apiPath}`;
};

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') {
    return API_PATH;
  }

  return getServerApiBaseUrl();
};
