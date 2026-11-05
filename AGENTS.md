<!-- markdownlint-disable -->

# SNP-SMS Full-Stack Monorepo Agent Rules

These rules apply to every AI coding agent and human contributor working in the SNP-SMS repository. They are project rules, not instructions for one vendor, model, IDE, or agent framework.

---

## 1. Task-Scoped Context and Skill Routing

- Follow these repository rules and the nearest nested `AGENTS.md` for the files being changed.
- Before code, package, configuration, or repository-structure changes, read `.agents/skills/snp-sms-monorepo-architecture/SKILL.md` and `.agents/skills/snp-sms-code-security-quality-policy/SKILL.md`.
- Read `.agents/skills/snp-sms-changelog-workflow/SKILL.md` when changing skills, architecture, or features. Read `.agents/skills/snp-sms-push-checkpoint-workflow/SKILL.md` only when the user explicitly requests a push, publish, or checkpoint.
- For UI or design work, read `.agents/skills/snp-sms-design-standards/SKILL.md` and only the applicable design manuals.
- Inspect `packages/shared/src/index.ts`, backend modules, frontend routes, and workspace configuration only when the task touches their contracts or behavior; do not load complete directories by default.
- Resolve the most specific skill through `.agents/skills/INDEX.md`. Read that source and only its task-relevant references. Keep every existing skill and reference available; do not preload unrelated resources.
- When asked which skill to apply, give the exact `apply skill <alias>` command from the index. Never guess an alias. For work that uses a skill, identify the exact skill in the task update or final report.

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
- **Zero Display of Concrete Credentials or Identifiers in Docs & UI (MANDATORY)**: Never display, embed, or expose concrete user credentials, identity IDs, real or mock staff/admin email accounts (e.g. `admin@snp.edu.kh`, `info@snp.edu.kh`), concrete passwords (`YourPassword123`), secret tokens, or authentication IDs in documentation, sample payloads, API references, or UI code. Always use sanitized abstract placeholder tokens (`<SERVICE_ACCOUNT_IDENTIFIER>`, `<SECURE_AUTHENTICATION_CREDENTIAL>`, `<AUTHORIZED_USER_EMAIL>`, `<CONTACT_EMAIL_PLACEHOLDER>`, `<JWT_ACCESS_TOKEN_SAMPLE>`, `<USER_UUID>`, `<BRANCH_ID>`).
- **Mandatory Display-Only Public API & Syndication Standard — Zero Access Mode & Zero Credential Exposure (CRITICAL RULE)**:
  - **Never Design "Access Mode" or Access-Granting Columns**: Under no circumstances should tables or UI views include an "ACCESS MODE" column, "[Lock] Read-Only" badges, or UI components that suggest user access rights, permissions, or access gates.
  - **Strictly Display-Only Presentation**: All public catalogs, syndication feeds, and embed previews must strictly be visual, display-only guides showing clean data fields only (`Code`, `Title`, `Schedule`, `Capacity`, `Status`).
  - **Zero Credential Headers or Inspection Code**: Never display, instruct, or include credential headers (`X-Subscription-Key`, auth tokens, secret keys) or credential flags (`withCredentials: true`) in client-side code snippets or documentation. Endpoints must be presented purely as standard public display feeds without user credential inspection.
- **Mandatory Prohibition of Dark Navy / Black Terminal Box Aesthetics in Documentation (CRITICAL RULE)**:
  - **Never Design Dark Terminal Containers**: Under no circumstances should logs, telemetry monitors, event stream cards, or inspection boxes be designed with solid dark navy (`#0A1A4A`), black, or dark terminal background styles.
  - **Light-Day-First Modern UI**: All telemetry monitors, packet streams, and documentation cards must strictly use **Pure White (`#FFFFFF`)** or **Ice Tint (`#EFF5FF`)** backgrounds with Soft Lavender borders (`#CAD3F5`), Deep Navy (`#0A1A4A`) high-contrast text, and Royal Blue (`#0056FF`) accent pills.
  - **Zero Dark Hacker Inversion**: Never invert page sections into high-contrast dark terminal boxes or hacker consoles in documentation views.
- **Mandatory Brand Color Tokens & Anti-Muddy Gray / Anti-Blur / High-Contrast Typography Rule (CRITICAL RULE)**:
  - **Zero Muddy Gray, Slate Containers, or Blur Styles**: Under no circumstances should components, cards, tables, or callouts be styled with muddy gray (`#64748B`, `#475569`), dark slate blocks, or blur backgrounds. Never use solid black or dark slate (`bg-slate-900`, `bg-black`) for buttons or badges in UI library components.
  - **Zero Washed-Out, Pale Gray, or Hidden Text**: Never design components where text fades, washes out, or lacks sufficient contrast. All body text, data table rows, headers, and values on light surfaces (`#FFFFFF`, `#EFF5FF`, `#E3E7FC`) must maintain high contrast (WCAG AAA >= 7:1) using **Deep Navy (`#0A1A4A`)** or **Slate-900 (`#0F172A`)**. Text color must NEVER match or blend into the background.
  - **Exclusively Use the 5 Primary Brand Tokens**:
    1. `01 #0056FF` Royal Blue — Primary brand base, active pills, core CTAs, active highlights.
    2. `02 #2277FF` Azure Blue — Interactive accents, illuminated hover states, secondary highlights.
    3. `03 #E3E7FC` Soft Lavender — Surface micro-tints, subtle borders (`#CAD3F5`), badge fills.
    4. `04 #FFFFFF` White — Document canvas base, card foundations, clean backgrounds.
    5. `05 #EFF5FF` Ice Tint — Subsurface card fills, segment track fills, hover backdrops.
    - Typography Token: Deep Navy `#0A1A4A` (primary headings & text) / Slate-900 `#0F172A` / `#334155` (secondary descriptive copy). Never use light gray on light surfaces.
  - **Zero Accidental Dark Mode Inversion**: Never allow media-query dark styles or `dark:*` Tailwind classes to invert UI components into dark slate/muddy gray boxes or render washed-out white/light gray text on white tables.
- **Mandatory Prohibition of Pulsing Beacons, Status Dots, Ping Rings, and Live Presence Dots (ABSOLUTE RULE)**:
  - **Zero Pulsing Beacons & Status Beacons**: Under no circumstances should icons, buttons, cards, headers, navigation bars, or components feature pulsing beacons, blinking live dots, status beacons, radar pings, or heartbeat indicators (`animate-ping`, `animate-pulse` on green/colored corner dots).
  - **Zero Live Status Dots & Presence Rings**: Never design or place colored corner dots (green, blue, red, or any color), live online presence dots, or expanding ripple rings on icons, avatars, badges, or brand marks.
  - **Clean Static Typography & Structured Pills Only**: State must strictly be communicated via clean, high-contrast textual badges or static pills adhering to the 5 brand tokens (e.g. `LIVE`, `NEW`, `ACTIVE`, `READY`), never via distracting pulsing animations or corner beacon dots.
- **Mandatory Local-Only Commits & Zero Push Without Explicit Command — ABSOLUTE RULE**:
  - In every conversation, session, and task, AI agents and contributors are **strictly permitted to make local git commits only**.
  - **NEVER execute `git push`**, push release tags, publish release checkpoints, or perform remote publishing actions under any circumstances unless the user gives an explicit, direct command (e.g., `git push`, `push now`, `push to github`).
  - Do not auto-push "for convenience", at the conclusion of a turn, or after running builds, tests, or changelog syncs.
  - Remote publishing is exclusively gated behind explicit user command.
- **Mandatory In-Project File Writing & Build Isolation Rule — ABSOLUTE RULE**:
  - In every conversation, session, and task, AI agents and contributors MUST **strictly write files inside the `SNPI-API` project directory**.
  - **Never write outside `SNPI-API`**: Under no circumstances should files, code, scratch scripts, tests, configs, or build artifacts be written to the workspace root (`/Users/Apple16/Desktop/SNPI/`), sibling project (`SNPI-Web/`), Desktop (`/Users/Apple16/Desktop/`), home folder (`~/`), or `/tmp`.
  - **Build Output Isolation**: All build commands (`npm run build`, `npm run typecheck`, `tsc`) must strictly output within `SNPI-API` (e.g. `dist/`). No build script or compiler may emit artifacts outside `SNPI-API`.
  - **Zero Cross-Project Contamination**: Never write backend code, test scripts, or database utilities into `SNPI-Web`.
- **Mandatory Differentiated Commit & Independent Tracking Rule — ABSOLUTE RULE**:
  - All commits in `SNPI-API` must strictly use the `(api)` or `(api/<scope>)` prefix (e.g., `feat(api): ...`, `fix(api/auth): ...`, `docs(api): ...`).
  - Never share generic or identical commit messages with `SNPI-Web`.
  - Maintain an independent commit history, tag tracking (`api-vX.Y.Z`), and separate changelog.
- **Mandatory Single Testing Subdomain & Slug-Only Route Standard — Zero Extra Subdomains (ABSOLUTE RULE)**:
  - **Single Designated Testing Subdomain**: Exclusively use `api.kesararamwithdigital.tech` as the sole temporary free testing endpoint.
  - **Zero Outside Domains & Zero Additional Subdomains**: Under no circumstances should any outside domains or extra subdomains be added or configured (strictly NO `dev.`, `staging.`, `test.`, `preview.`, `admin.kesararamwithdigital.tech`).
  - **Slug-Based Path Routing Only**: All future pages, test routes, preview tools, documentation views, and endpoints must be accessed via URL slugs/paths under this single subdomain (e.g. `/`, `/docs`, `/api/v1/*`, `/<slug>`).
  - **Temporary Free Test Bed Status**: This subdomain is strictly temporary for testing purposes and will be replaced by the owner with the permanent domain in the future.
- **Mandatory Frontend Impact Alert & Implementation Prompt Standard — ABSOLUTE RULE**:
  - **Breaking Change & Frontend Effect Detection**: Any backend update that affects or alters contracts consumed by the frontend (`SNPI-Web`) is strictly classified as a **Frontend-Impacting Change**. This includes:
    1. **Endpoint Contracts**: Added, removed, deprecated, or renamed REST paths, query parameters, route slugs, or HTTP methods.
    2. **Request / Response Schemas**: Changed payload DTOs, modified field names, new required body fields, changed nullability, or altered data structures.
    3. **Authentication & Session Flows**: Changes to login identifier expectations (e.g., `identifier` vs `email`/`username`), JWT claims, token header standards, cookie names, or password constraints.
    4. **Status Codes & Error Payloads**: Changed HTTP status codes, modified RFC 7807 error structures, new domain validation codes, or error response formats.
    5. **Database & Entity Models**: Schema migrations that affect fields surfaced in API responses or frontend table views.
    6. **Environment & Networking**: Changed backend production domain (`https://api.kesararamwithdigital.tech`), altered port, or CORS origin changes.
  - **Mandatory `[FRONTEND IMPACT ALERT]`**: Whenever any of the above conditions occur, the AI agent or developer MUST explicitly emit a prominent alert badge:
    `[FRONTEND IMPACT ALERT]`
    accompanied by a concise breakdown of what was changed and why it affects the frontend client.
  - **Mandatory Copy-Paste Implementation Prompt for Frontend Team**: The agent MUST provide a ready-to-use, turnkey copy-paste prompt formatted specifically for the `SNPI-Web` development team or AI agent in a designated block:
    `### Frontend Implementation Prompt (Copy & Paste to SNPI-Web Team / Agent)`
    The prompt must contain:
    - Target file paths in `SNPI-Web` to modify (e.g., API client services, hooks, forms, auth state).
    - Exact TypeScript request/response interfaces reflecting the new backend contract.
    - Updated request payload examples (e.g. `{"identifier": "...", "password": "..."}`).
    - Step-by-step verification instructions (e.g., test login, verify form submissions, handle new error codes).

---

## 4. Task-Scoped Verification

Run the fastest checks that cover the changed behavior, and always run checks explicitly requested by the user.

- TypeScript changes: run `npm run typecheck`, `npm run lint`, and the relevant workspace tests.
- API, database, or deployment changes: add the applicable `npm run test:api`, `npm run smoke`, and `npm run deploy:verify` gates.
- Documentation, skill-routing, or agent-configuration changes: validate referenced paths and routing entries, then review the diff. Do not run database, live API, or deployment checks when those systems were not changed.
- Synchronize the changelog when required by `.agents/skills/snp-sms-changelog-workflow/SKILL.md`.
- For a push request, follow the complete push workflow in section 5.

Never run an unrelated full suite solely because it is listed here; report which checks ran and their actual exit codes.

---

## 5. Mandatory Pre-Push CI, Dual-Developer Sync & Deployment Quality Gate Rule

- **Mandatory GitHub-First Push, CI Watch & Subsequent Vercel Release Rule (ABSOLUTE RULE)**:
  - Whenever the user commands to push (`push`, `git push`, `release it all`, `publish`):
    1. **Pre-Push GitHub PR Check & Reconciliation Gate**: Before attempting any git push or skipping sync, check open GitHub PRs (`npm run pr:check`). If open PRs exist, inspect them, merge mergeable PRs into `main` (`gh pr merge <ID> --merge --auto`), and reconcile local tracking.
    2. **Dual-Developer Git Reconciliation & Merge Gate (NEVER SKIP GIT SYNC)**: Always run `npm run git:sync` (or fetch and merge `origin/main --no-edit`). Never skip sync or push over unmerged collaborator commits or PRs.
    3. **Comprehensive Security & Quality Audit Workflow**: Run `npm run audit:security-quality` to verify Overview Findings, Code Quality, Dependabot Malware & Vulnerabilities, Reporting, and Security Policy compliance.
    4. **Fast Pre-Flight Gates & Compilation**: Run Prettier format check (`npm run format:check`), ESLint (`npm run lint`), TypeScript static analysis (`npm run typecheck`), and build compilation (`npm run build`).
    5. **Push to GitHub FIRST**: Immediately push commits and annotated release tags to GitHub remote `origin/main` (`git push origin main --tags`).
    6. **Watch & Check GitHub Actions CI Until 100% Green (Optimized Fast Polling)**: Actively monitor all triggered GitHub Actions CI runs for the pushed commit SHA via `gh run list --commit <SHA>` using fast 3.5s polling. Continue monitoring until 100% of workflows achieve completed `[PASSED]` status. If any workflow fails, abort immediately, fetch failed logs (`gh run view <ID> --log-failed`), resolve the failure locally, and NEVER proceed to Vercel.
    7. **Deploy to Vercel Production AFTER CI Green**: ONLY AFTER all GitHub Actions CI workflows are 100% green and successful, deploy directly to Vercel production via Vercel CLI (`npx vercel --prod`).
    8. **Vercel Blue Success & Live Health Verification (Conversation Break Gate)**: Inspect Vercel deployment status via `npm run deploy:vercel:verify`. Confirm deployment state is `READY` (blue success) and probe `https://api.kesararamwithdigital.tech/api/v1/health` for `HTTP/2 200 OK`. The conversation turn may only conclude once Vercel production is confirmed blue and healthy.
- **Mandatory Pre-Push PR Check & Auto-Merge Gate (`npm run pr:check`)**:
  - Before pushing code, inspect all open PRs on GitHub (`gh pr list --state open`).
  - Never push over unmerged open PRs without review or auto-reconciliation. When `--merge-open` is specified, mergeable PRs are merged into `main` and synchronized into the working tree.
- **Mandatory Security & Quality Audit Workflow (`npm run audit:security-quality`)**:
  - **Overview Findings**: Audit GitHub Advanced Security, Secret Scanning alerts, and Code Scanning findings.
  - **Code Quality**: ESLint (0 errors), TypeScript strict analysis (0 errors), Prettier format compliance, and fast unit & architecture smoke tests.
  - **Dependabot Malware & Vulnerabilities**: Scan for critical/high open Dependabot alerts via GitHub API, execute `npm audit --audit-level=high`, and ensure zero malicious piped scripts in dependency lifecycles.
  - **Reporting**: Output structured findings summary table with explicit `[PASSED]`, `[WARNING]`, `[FAILED]` status badges.
  - **Security Policy Compliance**: Verify `SECURITY.md` vulnerability disclosure procedures, immutable numeric maintainer IDs (`70220432`, `216975960`) in `.github/maintainers.json`, and all required GitHub security workflows (`security.yml`, `codeql.yml`, `secret-scan.yml`, `ci.yml`).
- **Mandatory Watch All GitHub Actions CI to 100% Green Before Vercel Deploy (ABSOLUTE RULE)**:
  - Vercel production deployment is strictly forbidden while any GitHub Actions workflow is running, pending, or failed.
  - All workflows (CI, lint, tests, build, docker, codeql, secret scan, license compliance, blockchain integrity) must pass with 100% green before invoking Vercel CLI.
- **Mandatory Vercel Blue Status Verification Before Ending Conversation (`npm run deploy:vercel:verify`)**:
  - Deployment must be verified as `state: "READY"` (blue indicator) in Vercel CLI JSON output.
  - Live production domain `https://api.kesararamwithdigital.tech/api/v1/health` must return `HTTP/2 200 OK` with status `healthy` and database `connected`.
- **One-Command Automated Push & Checkpoint (`npm run push:checkpoint` / `npm run release:all`)**:
  - Both commands execute the complete optimized sequence: PR check -> git sync -> security & quality audit -> pre-flight compile -> GitHub push first -> watch CI until green -> Vercel production deploy -> Vercel blue & live health verification.
- **Mandatory Pre-Push ESLint Quality Gate (`npm run lint`)**:
  - `npm run lint` MUST be executed and pass with 0 errors before any commit or push. JSX text node violations, unescaped entities, and typing errors must never reach remote CI.
- **Mandatory Dual-Developer Git Reconciliation & Merge Gate (`npm run git:sync`)**:
  - Two developers actively collaborate on this repository. Before attempting any commit push or release checkpoint, the system must **ALWAYS run `npm run git:sync`** (or `git fetch origin` followed by `git merge origin/<branch> --no-edit`).
  - If remote has incoming commits from the other developer, merge them immediately into the working tree. Never overwrite or force-push over collaborator code. Never skip git sync.
  - If conflicts occur, resolve them cleanly, run the full verification pipeline (`npm run typecheck`, `npm run lint`, `npm run deploy:verify`), and commit the merged result before pushing.
- **Zero Push on Failed Deploy or CI**: Never run `git push`, push release tags, or publish checkpoints if any GitHub deployment, build, test, or CI workflow is failed or failing on `main`.
- **Pre-Push Deployment Gate (`npm run deploy:verify`)**: Always execute `npm run deploy:verify` prior to pushing to ensure all deployment manifests exist (`vercel.json`, `apps/backend/vercel.json`, `apps/frontend/vercel.json`, Kubernetes manifests), production builds compile with zero errors, and recent GitHub Actions workflows on `main` are green.
- **Mandatory Post-Push Live CI Monitoring Until 100% Green (`npm run push:verify`)**:
  - Every remote push MUST actively monitor GitHub Actions runs for the pushed commit SHA (`gh run list --commit <SHA>`) until all triggered workflows reach completed `[PASSED]` status.
  - The agent must NOT end the turn or claim completion until all remote checks are green and Vercel is blue/healthy.
  - If any workflow fails, the agent must immediately fetch the failed logs (`gh run view <ID> --log-failed`), diagnose the error, resolve it locally, and push the fix.

---

## 6. Autonomous AI Agents Policy

- Follow section 4's task-scoped verification and report actual exit codes. Preserve API contracts, avoid destructive operations, and use authentic contracts and configuration from `@snp/shared` and `apps/backend/src/config/`.
- Synchronize changelog changes as required by `.agents/skills/snp-sms-changelog-workflow/SKILL.md`.
- For UI, design-system, notification, or UX-writing changes, resolve the exact skill in `.agents/skills/INDEX.md` and read only its authoritative source and relevant manuals. Apply the complete relevant standards, including responsive behavior, accessibility, notification limits, writing rules, and the immutable brand anchors.
- Follow the code-security skill's global zero-link and zero-emoji rules. Do not load the complete design suite for unrelated tasks.

---

## 7. Organization Repositories, Push Policy & Permissions

- **Organization Remotes (`GroupCapstone`)**:
  - `SNPI-API`: `origin` -> `https://github.com/GroupCapstone/SNPI-API.git` (tracked on `main -> origin/main`).
  - Secondary Remotes: `personal` (`shiliaiwei/SNPI-API.git`), `ytivargitna` (`ytivargitna/SNPI-API.git`), `upstream` (`Tan-Saphea/SNPI-SMS.git`).
- **Equal Organization Admin Permissions**:
  - Both repositories (`SNPI-API` and `SNPI-Web`) are hosted under the `GroupCapstone` organization, granting equal Admin rights to `shiliaiwei` and `Tan-Saphea`.
- **Mandatory Synchronized Release Rule — Vercel Must Always Update When GitHub Updates (ABSOLUTE RULE)**:
  - Whenever code is updated or pushed to GitHub (`GroupCapstone/SNPI-API`), the release pipeline MUST push to GitHub first, monitor GitHub Actions CI until 100% green, and then deploy to Vercel production (`https://api.kesararamwithdigital.tech`) via Vercel CLI (`npm run deploy:prod` / `npx vercel --prod`).
  - Zero code drift is permitted: live production code running on `api.kesararamwithdigital.tech` must always match the latest code pushed to GitHub.
  - Standard synchronized release command: `npm run release:all` (verifies pre-flight quality gates, syncs git, pushes to GitHub `origin/main --tags` first, verifies CI is 100% green, and deploys directly to Vercel production in lockstep).
- **Push Quality Gate**:
  - Before pushing, always run `npm run typecheck` and `npm run build` in `SNPI-API/`.

---

## 8. UI, Design, and Documentation Work

- The full UI standards live in `.agents/skills/snp-sms-design-standards/SKILL.md` and its focused manuals. Use `.agents/skills/INDEX.md` to select only the manuals relevant to the requested change.
- Keep the developer library first for new UI designs. Do not apply experimental designs to production frontend routes unless the user explicitly asks.
- Preserve the repository's mandatory design rules, including approved brand tokens, accessible contrast and touch targets, zero emojis, no blue indicator dots, SNPI naming, and the immutable Brand Colors and Color Ramps menu anchors. The design skill is authoritative for their full definitions.
- Do not load or apply unrelated design manuals to backend, CI, or other non-UI tasks.
