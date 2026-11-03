# GitHub Copilot Instructions for SNP-SMS Monorepo

These instructions govern all code generation, refactoring, and automated review within the SNP-SMS repository.

---

## 1. Monorepo Architecture & Boundaries

- **Monorepo Topology**: npm workspaces with unified root dependencies and lockfile.
  - `apps/backend`: Express 5, TypeScript, MongoDB Replica Set (`rs0`), 7-layer modular monolith API.
  - `apps/frontend`: Next.js (App Router), React 19, Tailwind CSS v4, Radix UI.
  - `packages/shared` (`@snp/shared`): Canonical auth contracts, RBAC permissions, implied scopes, DTOs, and validation schemas.
  - `packages/tsconfig` (`@snp/tsconfig`): Shared TypeScript compiler configurations.
  - `packages/eslint-config` (`@snp/eslint-config`): Shared linting configurations.
- **Contract Preservation**:
  - Never alter existing REST API paths, query params, HTTP status codes, or payload formats unless explicitly commanded by the user.
  - Maintain all 193 REST API endpoints across the 47 domain modules.

---

## 2. 7-Layer Backend Pattern

Every domain module in `apps/backend/src/modules/<domain>/` must strictly adhere to the 7-layer pattern:

```
route -> controller -> service -> repository -> model -> validation -> types
```

- **Routes**: Expose HTTP endpoints, bind auth middleware (`authenticate`, `authorize`, `branchAccess`).
- **Controllers**: Parse request params/body, invoke service layer, return standardized HTTP responses.
- **Services**: Business logic, orchestrate MongoDB multi-document ACID transactions using sessions (`client.startSession()`).
- **Repositories**: Data access layer executing Mongoose operations with explicit `schoolId` and `branchId` filters.
- **Models**: Mongoose schemas with compound multi-tenant indexes and audit timestamps (`createdAt`, `updatedAt`).
- **Validation**: Zod request validation schemas.
- **Types**: Domain TypeScript interfaces and DTOs.

---

## 3. Strict Frontend & UI Standards

- **Strict Light Mode Only**:
  - NEVER introduce dark mode styles, dark theme toggles, or `dark:` CSS classes.
  - Default background is Pure White (`#FFFFFF`), with crisp borders (`#E2E8F0` / `#CBD5E1`) and high-contrast typography.
- **Next.js App Router**:
  - Co-locate features in `apps/frontend/features/<feature>/` (`api/`, `components/`, `hooks/`, `schemas/`, `types/`).
  - Use TanStack React Query for server state management with optimistic cache invalidation.
- **Zero Emojis Policy**:
  - Under no circumstances should emojis be used in code, comments, docstrings, commit messages, or PR descriptions.
  - Use clean textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.

---

## 4. Single Source of Truth for RBAC & Permissions

- All permission codes (`SYSTEM_PERMISSIONS`), role definitions (`DEFAULT_CORE_ROLES`), and implied scope checks must be imported from `@snp/shared`.
- Never duplicate permission strings or role enums across backend and frontend workspaces.
- Always enforce tenant scoping (`schoolId`, `branchId`) server-side. Never trust client-supplied tenant scopes.

---

## 5. Repository Ownership & Portable Configuration

- The official GitHub repository owner is `@Tan-Saphea` (`https://github.com/Tan-Saphea/SNPI-SMS`).
- Never hardcode personal GitHub usernames or user paths into workflows, scripts, or package metadata.
- Maintainer verification relies on immutable numeric GitHub account IDs in `apps/backend/.github/maintainers.json`.

---

## 6. Verification Pipeline

Always ensure all quality gates pass before completing code changes:

- `npm run format:check`: Code style formatting with Prettier.
- `npm run typecheck`: TypeScript static analysis across all workspaces.
- `npm run smoke`: Workspace resolution, MongoDB `rs0` replica set, and API smoke tests.
- `npm run test:api`: Live HTTP endpoint verification across all 47 domain modules.
- `npm run test`: Vitest automated test suites.
- `npm run build`: Production builds for backend and frontend.
- `npm run changelog:sync`: Real-time changelog synchronization.

---

## 7. Enterprise Custom Agents & Expanded MCP Context

- **Knowledge Base Source of Truth**: All enterprise policies are partitioned under `.github/knowledge/`:
  - `security/`: Secure coding, authentication patterns, vulnerability remediation, application security design principles.
  - `architecture/`: Modular monolith patterns, API design guidelines, database standards.
  - `ci-cd/`: GitHub actions best practices, deployment workflows, container security.
  - `design-standards/`: Psychological design rules, culinary component taxonomy, open-source checklist macro-phases.
- **Custom Agent Definitions**: Located in `.github/agents/` (`ci-cd-expert.md`, `security-reviewer.md`, `architecture-advisor.md`, `design-system-lead.md`).
- **Dynamic Context Loading**: Custom agents dynamically fetch files from `.github/knowledge/` via the GitHub Model Context Protocol (MCP) server `get_file_contents` tool, bypassing the single-file 30,000-character limit.
- **Environment Secret**: Multi-repository access is authenticated via `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` in the `copilot` environment.
- **Skill Specification**: Refer to `.agents/skills/enterprise-custom-agents-context/SKILL.md` for full implementation details.
