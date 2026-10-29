# SNP-SMS Full-Stack Monorepo Agent Rules

These rules apply to every AI coding agent and human contributor working in the SNP-SMS repository. They are project rules, not instructions for one vendor, model, IDE, or agent framework.

---

## 1. Required Reading

Before modifying code, packages, or repository structure, read:

1. `.agents/skills/snp-sms-monorepo-architecture/SKILL.md`: The authoritative monorepo and modular monolith architectural specification.
2. `.agents/skills/snp-sms-code-security-quality-policy/SKILL.md`: Mandatory code security, software quality, and autonomous AI agents policy.
3. `.agents/skills/snp-sms-changelog-workflow/SKILL.md`: Mandatory real-time changelog recording protocol.
4. `.agents/skills/snp-sms-push-checkpoint-workflow/SKILL.md`: Mandatory GitHub push and checkpoint quality gate protocol.
5. `packages/shared/src/index.ts`: The single source of truth for permissions, core roles, implied scopes, and shared DTO contracts.
6. `apps/backend/src/modules/`: The 47 domain modules in the modular monolith backend.
7. `apps/frontend/app/`: The Next.js App Router frontend routes, features, and proxy architecture.
8. `.agents/skills/snp-sms-design-standards/SKILL.md`: Authoritative design standards and Dark UI specification (single folder design architecture, flat style, zero shadows, luminance depth, mathematical tokens).
9. `.agents/skills/snp-sms-design-standards/I. 10 UI components.md`: Authoritative 10 core UI components specification and paradigms (Snackbar, Bottom Sheet, Dialog, Bottom Nav, Toggle Switch, Chips, FAB, Card, Dropdown, Tooltip).

---

## 2. Core Architecture & Monorepo Boundaries

- **Monorepo Topology**: npm workspaces with unified root dependencies and lockfile.
  - `apps/backend`: Express 5, TypeScript, MongoDB Replica Set (`rs0`), 7-layer modular monolith API.
  - `apps/frontend`: Next.js (App Router), React 19, Tailwind CSS, Radix UI.
  - `packages/shared` (`@snp/shared`): Canonical auth contracts, RBAC permissions, implied scopes, DTOs, and validation schemas.
  - `packages/tsconfig` (`@snp/tsconfig`): Shared TypeScript compiler configurations.
  - `packages/eslint-config` (`@snp/eslint-config`): Shared linting configurations.
- **Serverless / Container Hybrid Deployment**:
  - Frontend deploys serverless (e.g. Vercel / Edge CDN). Proxies `/api/v1/*` server-side via `next.config.ts` rewrites to `BACKEND_INTERNAL_URL` (zero CORS issues).
  - Backend runs as a long-running container (e.g. Docker / VPS / ECS) maintaining persistent MongoDB connection pools and ACID transaction sessions.
- **Preservation of Contracts**:
  - Never alter existing REST API paths, query params, HTTP status codes, or payload formats unless explicitly commanded by the user.
  - Maintain all 193 REST API endpoints across the 47 domain modules.

---

## 3. Strict Development Standards

- **Zero Emojis**: Under no circumstances should emojis be used in code, comments, docstrings, commit messages, PR descriptions, or agent responses. Use clean textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.
- **7-Layer Backend Pattern**: Every domain module in `apps/backend/src/modules/<domain>/` must adhere to:
  `route -> controller -> service -> repository -> model -> validation -> types`
- **Single Source of Truth**: All permission codes (`SYSTEM_PERMISSIONS`), role definitions (`DEFAULT_CORE_ROLES`), and implied scope checks must be imported from `@snp/shared`. Do not duplicate permission strings or role enums.
- **Multi-Tenant & Data Scoping**: Every query and write must strictly enforce `schoolId`, `branchId`, and user RBAC permissions server-side. Never trust client-supplied scopes.
- **Cryptographic Security**: All signature checks, webhook verifications, and token hash comparisons must execute via constant-time `crypto.timingSafeEqual`. Plaintext credentials and placeholder secrets are strictly forbidden.
- **Input Sanitization & Injection Defense**: Every HTTP endpoint must validate inputs using strict Zod schemas. Mongoose queries must run with `strictQuery: true`, rejecting raw unescaped regex and operator injections.
- **Mandatory Local-Only Commits & Zero Push Without Explicit Command — ABSOLUTE RULE**:
  - In every conversation, session, and task, AI agents and contributors are **strictly permitted to make local git commits only**.
  - **NEVER execute `git push`**, push release tags, publish release checkpoints, or perform remote publishing actions under any circumstances unless the user gives an explicit, direct command (e.g., `git push`, `push now`, `push to github`).
  - Do not auto-push "for convenience", at the conclusion of a turn, or after running builds, tests, or changelog syncs.
  - Remote publishing is exclusively gated behind explicit user command.

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

# Verify production builds and deployment manifests
npm run deploy:verify

# Synchronize real-time changelog to live document portal and CHANGELOG.md
npm run changelog:sync
```

---

## 5. Mandatory Pre-Push CI & Deployment Quality Gate Rule

- **Zero Push on Failed Deploy or CI**: Never run `git push`, push release tags, or publish checkpoints if any GitHub deployment, build, test, or CI workflow is failed or failing on `main`.
- **Pre-Push Deployment Gate (`npm run deploy:verify`)**: Always execute `npm run deploy:verify` prior to pushing to ensure all deployment manifests exist (`vercel.json`, `apps/backend/vercel.json`, `apps/frontend/vercel.json`, Kubernetes manifests), production builds compile with zero errors, and recent GitHub Actions workflows on `main` are green.
- **Immediate Failure Resolution**: If a workflow fails on GitHub Actions, diagnosing and fixing the failure is the immediate top priority. Pushing further feature code is blocked until all 17 GitHub checks are green.
- **Post-Push Health Monitoring**: Every push must be monitored via `gh run list` until all active workflows reach `[PASSED]` status.

---

## 6. Autonomous AI Agents Policy

All AI coding assistants (including Antigravity, Claude, Copilot, Codex, and subagents) operating in this repository must strictly comply with the following operational rules:

- **Verification-First Mandate**: AI agents must never claim a task, bug fix, or feature is complete without executing live verification commands (`npm run typecheck`, `npm run test`, `npm run smoke`, `npm run deploy:verify`). Verification outputs must be presented in compact, structured Markdown tables with actual exit codes.
- **Zero Hallucination of Credentials & Endpoints**: AI agents must never invent fictional API keys, imaginary environment variables, mock endpoints, or unregistered packages. Always retrieve authentic contracts from `@snp/shared` and authentic configuration from `apps/backend/src/config/`.
- **Non-Destructive Operations Guard**: AI agents must NEVER execute destructive shell commands (`rm -rf /`, `git reset --hard` on uncommitted user work, unseeded database drops, or dropping git stashes). Preserve existing comments, docstrings, and architectural decision records (ADRs).
- **Contract Preservation Mandate**: AI agents must never modify existing API routes, query params, HTTP status codes, or payload schemas without explicit user direction.
- **Real-Time Technical Documentation Sync**: AI agents must execute `npm run changelog:sync` whenever architectural changes, skills, or features are implemented to keep `CHANGELOG.md` and the live developer document portal in real-time alignment.

---

## 7. Repository Ownership & Future Transfer Protocol

- **Planned Ownership Transfer**: The current GitHub repository owner (`shiliaiwei`) is provisional. Repository ownership will be transferred in the future to an institutional organization or designated enterprise owner.
- **Portable & Decoupled Configuration**:
  - Never hardcode personal GitHub usernames or user paths into CI/CD workflows, automation secrets, or package metadata.
  - Maintainer verification relies on immutable numeric GitHub account IDs in `.github/maintainers.json`, which must be updated upon ownership migration.
  - Remote repository URLs in git remotes, documentation (`README.md`, `CONTRIBUTING.md`), and container registries must remain easily re-targetable via `git remote set-url origin <new-url>`.

---

## 8. Mandatory UI Skill Design Protocol — Developer Library First & Zero Real Frontend Changes

- **Mandatory User Confirmation Gate**:
  - Whenever a new skill or design specification is created or verified as good, the user explicitly confirms it. Once confirmed, the skill MUST be permanently recorded into `.agents/skills/<skill-name>/` so all future builds reference and enforce it.
- **Developer Library First Mandate**:
  - All new UI components, dark modes, animations, layouts, and design tokens MUST strictly be built and demoed in the **Public Developer Documentation Library** (`apps/frontend/features/document/components/ui-library/` and `apps/frontend/app/document/design-system/`).
  - Prototyping must never touch production application routes.
- **Strict Prohibition — Zero Changes to Real Frontend Without Explicit Command**:
  - AI agents and contributors MUST NEVER apply, inject, or migrate experimental designs, dark modes, or new components to the real frontend (`apps/frontend/app/(dashboard)/`, `apps/frontend/components/`, `apps/frontend/app/globals.css`) until the user inspects the library demo and issues an **explicit command** to apply it.
  - The Admin Dashboard (`/(dashboard)/*`) strictly remains clean, light mode, and unaffected.
- **Immediate Revert Requirement**:
  - If any design or component is accidentally or prematurely applied to the real frontend before explicit user command, it must be reverted back immediately and placed in the developer library first.

---

## 9. Authoritative Monorepo Skills & Specific Command Catalog

Use these specific skill identifiers and command strings to instruct the agent:

| Skill Code   | Specific Skill Folder & Filename                                 | Description                                                                                                                          | User Command String     |
| :----------- | :--------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :---------------------- |
| `SKILL-ARCH` | `.agents/skills/snp-sms-monorepo-architecture/SKILL.md`          | Monorepo topology, 7-layer modular monolith, serverless/container hybrid model                                                       | `apply skill arch`      |
| `SKILL-SEC`  | `.agents/skills/snp-sms-code-security-quality-policy/SKILL.md`   | Enterprise cryptographic hygiene, injection defenses, tenant scoping, zero emojis                                                    | `apply skill security`  |
| `SKILL-DS`   | `.agents/skills/snp-sms-design-standards/SKILL.md`               | Single-folder Dark UI standards, flat components, zero shadows, luminance depth                                                      | `apply skill design`    |
| `SKILL-UI10` | `.agents/skills/snp-sms-design-standards/I. 10 UI components.md` | 10 Core UI Components specification (Snackbar, Bottom Sheet, Dialog, Bottom Nav, Toggle Switch, Chips, FAB, Card, Dropdown, Tooltip) | `apply skill 10-ui`     |
| `SKILL-LOG`  | `.agents/skills/snp-sms-changelog-workflow/SKILL.md`             | Real-time changelog synchronization with developer portal and CHANGELOG.md                                                           | `apply skill changelog` |
| `SKILL-PUSH` | `.agents/skills/snp-sms-push-checkpoint-workflow/SKILL.md`       | Pre-push verification gate, automated testing, typechecking, checkpoint release tagging                                              | `apply skill push`      |
