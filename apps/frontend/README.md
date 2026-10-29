# SNP-SMS Frontend

Standalone Next.js web app for SNP-SMS. The Express API is maintained and deployed from the separate `snp-sms-backend` project.

## Local development

```bash
cp .env.example .env.local
npm ci
npm run dev
```

The browser sends API requests to the same-origin `/api/v1` path. Next.js proxies those requests to `BACKEND_INTERNAL_URL`; the URL is server-only and must not contain credentials. The local example uses HTTP on localhost. For Vercel production and preview environments, set `BACKEND_INTERNAL_URL` to the HTTPS API base ending in `/api/v1`. Set `APP_ENV=production` for production builds outside Vercel.

Allow the frontend's exact HTTPS origin in the backend's `FRONTEND_URL`. Never put passwords, signing keys, database URLs, or other credentials in `NEXT_PUBLIC_*` variables. Keep deployment secrets in the hosting provider's encrypted environment settings.

## Checks and build

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Deploy this repository as its own Next.js/Vercel project. The Vercel project must have the server-side `BACKEND_INTERNAL_URL` configured for each environment. For a production Docker image, pass the HTTPS API base at build time with `--build-arg BACKEND_INTERNAL_URL=https://api.example.com/api/v1`; the URL is public routing configuration, not a credential.
