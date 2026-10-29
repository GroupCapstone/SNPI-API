# SNP-SMS Full-Stack Monorepo Agent Rules

These rules apply to every AI coding agent and human contributor working in the SNP-SMS repository. They are project rules, not instructions for one vendor, model, IDE, or agent framework.

---

## 1. Required Reading

Before modifying code, packages, or repository structure, read:

1. `.agents/skills/snp-sms-monorepo-architecture/SKILL.md`: The authoritative monorepo and modular monolith architectural specification.
2. `packages/shared/src/index.ts`: The single source of truth for permissions, core roles, implied scopes, and shared DTO contracts.
3. `apps/backend/src/modules/`: The 47 domain modules in the modular monolith backend.
4. `apps/frontend/app/`: The Next.js App Router frontend routes, features, and proxy architecture.

---

## 2. Core Architecture & Monorepo Boundaries

* **Monorepo Topology**: npm workspaces with unified root dependencies and lockfile.
  * `apps/backend`: Express 5, TypeScript, MongoDB Replica Set (`rs0`), 7-layer modular monolith API.
  * `apps/frontend`: Next.js (App Router), React 19, Tailwind CSS, Radix UI.
  * `packages/shared` (`@snp/shared`): Canonical auth contracts, RBAC permissions, implied scopes, DTOs, and validation schemas.
  * `packages/tsconfig` (`@snp/tsconfig`): Shared TypeScript compiler configurations.
  * `packages/eslint-config` (`@snp/eslint-config`): Shared linting configurations.
* **Serverless / Container Hybrid Deployment**:
  * Frontend deploys serverless (e.g. Vercel / Edge CDN). Proxies `/api/v1/*` server-side via `next.config.ts` rewrites to `BACKEND_INTERNAL_URL` (zero CORS issues).
  * Backend runs as a long-running container (e.g. Docker / VPS / ECS) maintaining persistent MongoDB connection pools and ACID transaction sessions.
* **Preservation of Contracts**:
  * Never alter existing REST API paths, query params, HTTP status codes, or payload formats unless explicitly commanded by the user.
  * Maintain all 193 REST API endpoints across the 47 domain modules.

---

## 3. Strict Development Standards

* **Zero Emojis**: Under no circumstances should emojis be used in code, comments, docstrings, commit messages, PR descriptions, or agent responses. Use clean textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.
* **7-Layer Backend Pattern**: Every domain module in `apps/backend/src/modules/<domain>/` must adhere to:
  `route -> controller -> service -> repository -> model -> validation -> types`
* **Single Source of Truth**: All permission codes (`SYSTEM_PERMISSIONS`), role definitions (`DEFAULT_CORE_ROLES`), and implied scope checks must be imported from `@snp/shared`. Do not duplicate permission strings or role enums.
* **Multi-Tenant & Data Scoping**: Every query and write must strictly enforce `schoolId`, `branchId`, and user RBAC permissions server-side. Never trust client-supplied scopes.
* **Zero Direct Git Pushes**: Never run `git push` or remote publishing commands under any circumstances unless explicitly commanded by the user.

---

## 4. Operational & Verification Pipeline

Always verify changes using the standard verification suite:

```bash
# Verify workspace resolution, database health, and API smoke tests
npm run smoke

# Verify live HTTP responses across all 47 domain modules
npm run test:api

# Typecheck all workspaces
npm run typecheck

# Run full test suite across backend and frontend
npm run test

# Verify production builds
npm run build
```
