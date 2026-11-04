# SNP-SMS Backend Project Structure

This repository owns only the SNP-SMS backend API. The Next.js frontend lives in the independent `snp-sms-frontend` repository, with its own package lock, CI, and deployment configuration. The repositories integrate through the versioned REST API; they do not share source files or a monorepo workspace.

```text
snp-sms-backend/
├── .agents/
│   └── skills/                  # Shared project rules and current milestone
├── .github/workflows/           # Backend CI
├── api/
│   └── index.ts                 # Vercel serverless adapter for the Express app
├── docs/
│   ├── api/                     # API contract and security reference
│   ├── architecture/            # Backend architecture and data design
│   └── *.md                     # Backend deploy, operations, backup, and security guides
├── infrastructure/
│   ├── k8s/                     # Backend-only Kubernetes resources
│   └── observability/           # Backend and MongoDB monitoring configuration
├── scripts/                     # Cross-module smoke checks
├── src/
│   ├── config/                  # Environment, database, logger, bootstrap
│   ├── constants/               # Shared backend constants and permissions
│   ├── middleware/              # HTTP security, auth, RBAC, tenant access, validation
│   ├── modules/<domain>/        # Domain-owned seven-layer API modules
│   ├── scripts/                 # Database seed, migration, and maintenance commands
│   ├── shared/                  # Reusable HTTP and error primitives
│   ├── types/                   # Backend-wide TypeScript types
│   ├── utils/                   # Backend-wide utilities
│   ├── app.ts                   # Express middleware and API route composition
│   └── server.ts                # Local/container HTTP server entry point
├── tests/                       # Vitest unit and API regression suites
├── Dockerfile
├── docker-compose.yml           # Local MongoDB replica set and backend
├── package.json
├── package-lock.json
└── vercel.json
```

## Backend module structure

Each domain under `src/modules/<domain>/` owns its API layers. Keep files together by domain and follow this dependency direction:

```text
route -> controller -> service -> repository -> model
          validation/types support the boundary and contracts
```

```text
<domain>/
├── <domain>.model.ts       # Mongoose schemas and indexes
├── <domain>.types.ts       # DTOs and query/filter types
├── <domain>.validation.ts  # Zod request validation
├── <domain>.repository.ts  # Database reads and writes
├── <domain>.service.ts     # Business rules, tenant checks, audit events
├── <domain>.controller.ts  # HTTP input/output and status handling
└── <domain>.route.ts       # Express paths and middleware composition
```

Some domains may have additional model or helper files when their existing behavior requires them. Do not create empty placeholder layers or duplicate a shared helper merely to match the tree.

## Request and data flow

1. The browser calls the frontend’s same-origin `/api/v1/...` URL over HTTPS.
2. The frontend’s server-side rewrite proxies the request to `BACKEND_INTERNAL_URL`, a server-only HTTPS setting in the frontend deployment environment.
3. `api/index.ts` adapts Vercel requests to the Express app; local/container deployments start `src/server.ts`, which uses `src/app.ts`.
4. `src/app.ts` applies global security, CORS, rate limiting, logging, and transport middleware, then mounts the versioned routes.
5. A module route validates/authenticates/authorizes the request before its controller calls the service.
6. The service enforces business rules, school/branch access, and audit requirements; the repository performs database operations through Mongoose models.
7. MongoDB is reached only by the backend over a TLS-enabled connection in production.

The frontend repository owns its own Next.js app, UI, API client, Vercel configuration, and frontend CI. Keep API contracts and backend authorization here; do not copy frontend code, frontend deployment manifests, or frontend dependencies into this repository.

## Install and local development

Required tools are Node.js `>=22.13.0`, npm, and Docker if you want the bundled local MongoDB replica set. npm packages are project-local and installed from `package-lock.json`.

```bash
node --version
npm --version
cp .env.example .env
# Put private local secrets in .env; never commit it.
npm ci
docker compose up -d mongodb
npm run dev
```

The local API listens on port 4000. To run the whole local stack in containers instead, use `docker compose up -d --build`. MongoDB runs as a replica set because backend transaction flows require it. Do not commit `node_modules` or `.env`. For deployment, put credentials in the hosting platform's encrypted secret store. The frontend's `BACKEND_INTERNAL_URL` is configured in the frontend repository's deployment environment, not in this backend repository.

## Dependency updates

Use this process for each planned dependency update:

```bash
npm outdated
npm view express@latest engines peerDependencies
npm install express@latest
npm ci
npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
```

Replace `express` with the package being reviewed. Check release notes and peer dependencies for every direct or transitive major change. Prefer versions compatible with the current Node runtime and framework stack; for a deliberate major update, update related packages together and review migration notes. The install updates `package.json` and `package-lock.json` together. Never hand-edit lockfile resolutions or use `npm audit fix --force` without reviewing its breaking changes. Review the final diff for API, security, and lockfile changes before merge.

## Safe code removal

A file can be unused at runtime and still be a valid CLI entry point, migration, test, deployment manifest, or documented operator tool. Before removal, search its references in imports, route registration, package scripts, framework conventions, deployment manifests, CI, tests, and operator documentation. Remove only confirmed stale assets and keep behavior-bearing modules, API aliases, tests, and maintenance commands unless their owners and callers are verified.
