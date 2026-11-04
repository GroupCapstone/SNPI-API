---
name: snp-sms-code-security-quality-policy
description: >-
  Authoritative enterprise code security, software quality, and autonomous AI
  agent operational policy for the SNP-SMS monorepo. Governs cryptographic key
  hygiene, injection defenses, multi-tenant isolation, 7-layer architecture, zero
  emojis, verification-first mandate, and pre-push quality gates.
---

# SNP-SMS Enterprise Code Security, Quality & AI Agents Policy

This specification establishes the mandatory code security standards, software quality metrics, and autonomous AI agent operational guidelines across the SNP-SMS full-stack monorepo.

---

## 1. Enterprise Code Security Standards

### 1.1 Cryptographic Hygiene & Zero Secret Exposure
- **Zero Plain-Text Credentials**: API keys, JWT secrets, database connection strings, and passwords must NEVER be committed to version control.
- **Zero Display of Concrete Credentials or Identifiers in Docs & UI**: Under no circumstances should concrete user credentials, identity IDs, real or mock staff/admin email accounts (e.g. `admin@snp.edu.kh`, `info@snp.edu.kh`), concrete passwords (`YourPassword123`), secret keys, or authentication IDs be rendered or displayed in documentation, UI examples, or client-facing mockups. All documentation and sample payloads must strictly use standardized abstract placeholder tokens: `<SERVICE_ACCOUNT_IDENTIFIER>`, `<SECURE_AUTHENTICATION_CREDENTIAL>`, `<AUTHORIZED_USER_EMAIL>`, `<CONTACT_EMAIL_PLACEHOLDER>`, `<JWT_ACCESS_TOKEN_SAMPLE>`, `<USER_UUID>`, `<BRANCH_ID>`.
- **Placeholder Secret Prohibition**: Environments reject common placeholder values (`replace-with`, `example`, `change-me`, `your-secret`) via automated runtime Zod refinement.
- **Constant-Time Verification**: All signature checks, webhook verifications, and token hash comparisons must execute via `crypto.timingSafeEqual` to eliminate timing side-channel attacks.
- **Secret Differentiation**: In all runtime environments, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `COOKIE_SECRET` must be distinct cryptographic values of at least 32 characters.

### 1.2 Injection Prevention & Input Sanitization
- **Strict Schema Enforcement**: Every HTTP endpoint must validate request bodies, query parameters, and route parameters against strict Zod validation schemas prior to controller invocation.
- **Mongoose Query Hardening**: Mongoose must run with `strictQuery: true`. Raw MongoDB query operators (`$where`, `$regex`, `$expr`) must never accept unsanitized client parameters.
- **Prototype Pollution Defense**: Object spreads and recursive merges must reject `__proto__`, `constructor`, and `prototype` keys.

### 1.3 Multi-Tenant & Multi-Branch Data Scoping
- **Server-Side Tenancy Scoping**: Every database read, insert, update, and deletion must include authenticated `schoolId` and applicable `branchId` filters derived from the verified user session token—never from client request parameters.
- **Parent-Child Soft-Delete Cascade**: Deleting high-level entities (e.g. Schools, Branches, Academic Years) must enforce soft-delete protections (`isDeleted: true`, `deletedAt`, `deletedBy`) with integrity checks on child records.

### 1.4 Transport Security & Session Hardening
- **Strict TLS & HSTS**: All production HTTP traffic requires TLS 1.3 / HTTPS. Deployed environments must send `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **Cookie Security Flags**: Session and refresh token cookies must enforce `HttpOnly: true`, `Secure: true`, `SameSite: 'Lax'` (or `'Strict'`), and partitioned attributes where applicable.
- **Dynamic CORS Origin Whitelisting**: CORS must dynamically validate incoming origins against configured domains (`FRONTEND_URL`), Vercel preview environments (`*.vercel.app`), and designated temporary domains, blocking unauthenticated third-party cross-origin requests.

### 1.5 Rate Limiting & Denial-of-Service Defense
- **Two-Tier Rate Limiting**: Global IP rate limiting (2,000 requests / 15 minutes) combined with strict authentication rate limiting (10 attempts / 60 seconds) on `/api/v1/auth/login`.
- **Pagination Depth Bounds**: All queryable list endpoints must enforce pagination bounds (`default: 20`, `max: 100`). Unbounded queries (`find({})`) are strictly forbidden in production endpoints.

---

## 2. Software Quality & Architectural Standards

### 2.1 7-Layer Backend Modular Monolith Boundary
Every domain module in `apps/backend/src/modules/<domain>/` must adhere strictly to the 7-layer architecture:
`route -> controller -> service -> repository -> model -> validation -> types`
- Controllers handle HTTP serialization and error routing only; zero business logic in controllers.
- Services implement all business logic, ACID transactions, and tenancy enforcement.
- Repositories encapsulate all Mongoose database access.

### 2.2 Preservation of API Contracts
- Never alter existing REST API paths, query parameters, HTTP status codes, or payload formats unless explicitly commanded by the user.
- Maintain all 193 REST API endpoints across the 47 domain modules with backwards compatibility.

### 2.3 Strict Zero-Emoji Rule
- Under no circumstances should emojis be used in code, comments, docstrings, commit messages, PR descriptions, test outputs, or agent responses.
- Use clean, standardized textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.

### 2.4 TypeScript & Build Integrity
- Full static analysis across all workspaces with zero TypeScript errors (`tsc --noEmit`).
- No implicit `any` types; all API DTOs and data models must have strong TypeScript typing shared from `@snp/shared`.

---

## 3. Autonomous AI Agents Policy

All AI coding assistants (including Antigravity, Claude, Copilot, Codex, and subagents) operating in this repository must strictly comply with the following operational rules:

### 3.1 Verification-First Mandate
- Never claim a behavior change is complete without running checks that cover the changed behavior. For TypeScript changes, run `npm run typecheck`, `npm run lint`, and relevant workspace tests.
- Run `npm run test:api`, `npm run smoke`, and `npm run deploy:verify` when the change affects API, database, integration, or deployment behavior, or when the user explicitly requests those gates.
- For documentation, skill routing, or agent configuration, validate the references and routes and review the diff; do not start unrelated live services.
- Report each verification command and its actual exit code.

### 3.2 Zero Hallucination of Credentials & Infrastructure
- AI agents must never invent fictional API keys, imaginary environment variables, mock endpoints, or unregistered packages.
- Always retrieve authentic contracts from `@snp/shared` and authentic configuration from `apps/backend/src/config/`.

### 3.3 Non-Destructive Operations Guard
- AI agents must NEVER execute destructive shell commands (`rm -rf /`, `git reset --hard` on uncommitted user work, unseeded database drops, or dropping git stashes).
- Preserve existing comments, docstrings, and architectural decision records (ADRs).

### 3.4 Pre-Push CI & Deployment Quality Gate
- AI agents must NEVER run `git push` or publish release checkpoints if any GitHub deployment, build, test, or CI workflow is failed on `main`.
- Always execute `npm run deploy:verify` prior to initiating any push.

### 3.5 Real-Time Technical Documentation & Changelog Sync
- AI agents must execute `npm run changelog:sync` whenever architectural changes, skills, or features are implemented to keep `CHANGELOG.md` and the live developer document portal in real-time alignment.

### 3.6 Mandatory UI Agent Design Implementation Invariants (Every Skill & Agent)
Whenever designing, styling, refactoring, or generating UI components, navigation menus, or documentation views across the entire platform, all AI agents must strictly enforce:
1. **Minimal Guide Text**: Only render title and buttons/controls; never write walls of descriptive paragraphs or redundant guide text.
2. **Mandatory Icon Hover Definitions**: Every interactive icon and icon button must show an accessible definition/action label on hover via `title` or tooltip.
3. **Pure Icon Hygiene**: Never use emojis, informal symbols, or decorative background shapes/colored blobs (`bg-blue-100 rounded-full`, `bg-[#0056FF] rounded-lg`) behind icons.
4. **Brand Blueprint Compliance**: Exclusively respect the 5 primary brand tokens (`#0056FF`, `#2277FF`, `#E3E7FC`, `#FFFFFF`, `#EFF5FF`) and high-contrast `#0A1A4A` Deep Navy text.
5. **Universal Web & Mobile Responsive Device First**: Always engineer for fluid responsive behavior across both mobile viewports and desktop with zero clipping and >=44x44px touch targets.
6. **Mandatory Zero Links Rule (Never Add Links)**: Under no circumstances should AI agents add markdown links, URL hyperlinks, file scheme links (`file://`), or unnecessary anchor links in responses or generated UI components unless explicitly requested by the user. Use plain text or code font.

### 3.7 Task-Scoped Design Skill Loading
When a task changes UI, design, or documentation views, use `.agents/skills/INDEX.md` to select the exact design skill and read its authoritative source plus only relevant references. Apply all relevant design requirements, including the permanent Brand Colors and Color Ramps anchors. Do not load the complete design suite for non-UI work.
