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
9. `.agents/skills/snp-sms-design-standards/10-ui-components.md`: Authoritative 10 core UI components specification and paradigms (Snackbar, Bottom Sheet, Dialog, Bottom Nav, Toggle Switch, Chips, FAB, Card, Dropdown, Tooltip).
10. `.agents/skills/snp-sms-local-domains-setup/SKILL.md`: Authoritative local custom domain specification and automated setup handbook for macOS, Windows, and Linux (*.snpi.edu.kh).
11. `.agents/skills/snp-sms-design-standards/living-interface-animation-manual.md`: Authoritative A Living Manual for Better Interfaces: The 12 Principles of Animation for Web Interfaces, <300ms timing rule, spring physics, and AnimatePresence exit protocols.
12. `.agents/skills/snp-sms-design-standards/modern-css-pseudo-elements-manual.md`: Authoritative A Living Manual for Modern CSS Pseudo-Elements & Native Browser Transitions (::before/::after hit-target expansion, View Transitions API, native dialog ::backdrop).
13. `.agents/skills/snp-sms-design-standards/eases-vs-springs-guide.md`: Authoritative Easing Curves vs. Springs: A Design and Engineering Decision Framework (User Reacting vs System Speaking, Interaction Roles, Bézier vs Spring Physics, <300ms timing rule).
14. `.agents/skills/snp-sms-design-standards/interface-sound-design-manual.md`: Authoritative A Living Manual for Interface Sound Design: Audio Feedback in Web Interfaces (auditory speed advantage 25ms vs 250ms, complementary accessibility, interaction audio matrix, Web Audio API synthesis).
15. `.agents/skills/snp-sms-design-standards/ai-sound-synthesis-manual.md`: Authoritative Procedural Audio Synthesis: Generating UI Sounds with Web Audio API & AI (waveform primitives, bandpass noise clicks, exponential envelopes, zero-asset UI sound libraries).
16. `.agents/skills/snp-sms-design-standards/morphing-icons-specification.md`: Authoritative Morphing Icons: The Three-Line SVG Transformation System (universal 3-line invariant, invisible collapsed anchors, rotational groups, zero-DOM-churn transitions).
17. `.agents/skills/snp-sms-design-standards/animating-container-bounds-manual.md`: Authoritative A Living Manual for Animating Container Bounds: Smooth Width & Height Transitions with Motion and ResizeObserver (two-div architecture, zero-dependency useMeasure hook, mount zero-guard).
18. `.agents/skills/snp-sms-design-standards/laws-of-ux-psychology-manual.md`: Authoritative A Living Manual for the Laws of UX: Cognitive Psychology in Interface Design (Fitts's Law, Hick's Law, Miller's Law, Doherty Threshold <400ms, Postel's Law).
19. `.agents/skills/snp-sms-design-standards/mastering-animate-presence-manual.md`: Authoritative A Living Manual for Mastering Animate Presence: Presence State, Manual Exits, Nested Hierarchies, and Modes (useIsPresent, usePresence safeToRemove, propagate, sync/wait/popLayout).
20. `.agents/skills/snp-sms-design-standards/sidebar-design-manual.md`: Authoritative Sidebar Architecture (header, quick action pills, nested groups, count badges, sticky positioning).
21. `.agents/skills/snp-sms-design-standards/color-theory-manual.md`: Authoritative Color Theory Standards (60-30-10 rule, functional palettes, accessible contrast, emotional psychology).
22. `.agents/skills/snp-sms-design-standards/button-design-system-manual.md`: Authoritative Button Design System (4 states, 3 variants, 44x44px touch targets, full-width mobile CTAs).
23. `.agents/skills/snp-sms-design-standards/scroll-patterns-manual.md`: Authoritative Scroll Patterns (9 core patterns: sticky, scroll snap, scroll driven, parallax, infinite scroll).
24. `.agents/skills/snp-sms-design-standards/profile-settings-manual.md`: Authoritative Profile Settings UX (8 principles, categorization, universal icons, instant search filtering).
25. `.agents/skills/snp-sms-design-standards/dark-mode-elevation-manual.md`: Authoritative Dark Mode Elevation (5-level elevation ladder, surface lightness, 87/60/38 typography ratios).
26. `.agents/skills/snp-sms-design-standards/linear-blur-glassmorphism-manual.md`: Authoritative Linear Blur & Glassmorphism (progressive multi-layer blur, subtle borders, luminance highlights).
27. `.agents/skills/snp-sms-design-standards/production-deploy-checklist.md`: Authoritative Production Deploy Checklist (20-point pre-launch quality gate: responsiveness, SEO, a11y, CWV).
28. `.agents/skills/snp-sms-design-standards/ux-ui-laws-manual.md`: Authoritative Foundational UX/UI Laws (Jakob's, Fitts's, Miller's, Hick's, Proximity, and Tesler's Laws).
29. `.agents/skills/snp-sms-design-standards/interactive-effects-manual.md`: Authoritative Interactive Effects Catalog (18+ effect styles: kinetic hook, gravity drop, NLE timeline, jiggle delete).
30. `.agents/skills/snp-sms-design-standards/system-architecture-lexicon.md`: Authoritative System Architecture Lexicon (1,111 concepts: systems, concurrency, cryptography, LLM, and AI agents).
31. `.agents/skills/snp-sms-design-standards/universal-ai-agent-prompt-manual.md`: Authoritative Universal AI Agent Prompt & MVP Component Generation Manual (procedural prompt synthesis, [Preview | Prompt] tabs, 1-click copy action, MVP component blueprints).
32. `.agents/skills/snp-sms-design-standards/line-tracker-navigation-manual.md`: Authoritative Precision Line Tracker Navigation & Zero-Scrollbar Manual (dotless continuous vertical rail, active indicator segment, zero-scrollbar standard).

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

| Skill Code       | Specific Skill Folder & Filename                                               | Description                                                                                                                          | User Command String        |
| :--------------- | :----------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :------------------------- |
| `SKILL-ARCH`     | `.agents/skills/snp-sms-monorepo-architecture/SKILL.md`                        | Monorepo topology, 7-layer modular monolith, serverless/container hybrid model                                                       | `apply skill arch`         |
| `SKILL-SEC`      | `.agents/skills/snp-sms-code-security-quality-policy/SKILL.md`                 | Enterprise cryptographic hygiene, injection defenses, tenant scoping, zero emojis                                                    | `apply skill security`     |
| `SKILL-DS`       | `.agents/skills/snp-sms-design-standards/SKILL.md`                             | Unified Single-Folder Design System & Dark UI, mathematical tokens, elevation, flat components, zero shadows                         | `apply skill design`       |
| `SKILL-UI10`     | `.agents/skills/snp-sms-design-standards/10-ui-components.md`                  | 10 Core UI Components specification (Snackbar, Bottom Sheet, Dialog, Bottom Nav, Toggle Switch, Chips, FAB, Card, Dropdown, Tooltip) | `apply skill 10-ui`        |
| `SKILL-DOMAIN`   | `.agents/skills/snp-sms-local-domains-setup/SKILL.md`                          | Local custom domain setup (*.snpi.edu.kh) via automated osascript/PowerShell and manual hosts guide                                  | `apply skill local-domain` |
| `SKILL-LOG`      | `.agents/skills/snp-sms-changelog-workflow/SKILL.md`                           | Real-time changelog synchronization with developer portal and CHANGELOG.md                                                           | `apply skill changelog`    |
| `SKILL-PUSH`     | `.agents/skills/snp-sms-push-checkpoint-workflow/SKILL.md`                     | Pre-push verification gate, automated testing, typechecking, checkpoint release tagging                                              | `apply skill push`         |
| `SKILL-MOTION`   | `.agents/skills/snp-sms-design-standards/living-interface-animation-manual.md` | A Living Manual for Better Interfaces (12 principles of animation, spring physics, <300ms rule, AnimatePresence)                     | `apply skill motion`       |
| `SKILL-PSEUDO`   | `.agents/skills/snp-sms-design-standards/modern-css-pseudo-elements-manual.md` | A Living Manual for Modern CSS Pseudo-Elements & Native Browser Transitions (View Transitions API, ::backdrop, ::before/::after)     | `apply skill pseudo`       |
| `SKILL-SPRING`   | `.agents/skills/snp-sms-design-standards/eases-vs-springs-guide.md`            | Easing Curves vs. Springs Decision Framework (User Reacting vs System Speaking, Interaction Roles, Spring Physics)                   | `apply skill spring`       |
| `SKILL-SOUND`    | `.agents/skills/snp-sms-design-standards/interface-sound-design-manual.md`     | A Living Manual for Interface Sound Design (Auditory Speed Advantage 25ms vs 250ms, Web Audio API, Tactile Feedback)                 | `apply skill sound`        |
| `SKILL-SYNTH`    | `.agents/skills/snp-sms-design-standards/ai-sound-synthesis-manual.md`         | Procedural Audio Synthesis & Web Audio API (Waveforms, Filtered Noise Clicks, Exponential Envelopes)                                 | `apply skill synth`        |
| `SKILL-MORPH`    | `.agents/skills/snp-sms-design-standards/morphing-icons-specification.md`      | Morphing Icons: The Three-Line SVG Transformation System (Universal 3-Line Invariant, Rotational Groups)                             | `apply skill morph`        |
| `SKILL-BOUNDS`   | `.agents/skills/snp-sms-design-standards/animating-container-bounds-manual.md` | Animating Container Bounds (Two-Div Architecture, ResizeObserver useMeasure, Mount Zero-Guard)                                       | `apply skill bounds`       |
| `SKILL-UX`       | `.agents/skills/snp-sms-design-standards/laws-of-ux-psychology-manual.md`      | Laws of UX: Cognitive Psychology (Fitts's Law, Hick's Law, Miller's Law, Doherty Threshold, Postel's Law)                            | `apply skill ux`           |
| `SKILL-PRESENCE` | `.agents/skills/snp-sms-design-standards/mastering-animate-presence-manual.md` | Mastering Animate Presence (useIsPresent, usePresence safeToRemove, propagate, popLayout/wait/sync)                                  | `apply skill presence`     |
| `SKILL-SIDEBAR`  | `.agents/skills/snp-sms-design-standards/sidebar-design-manual.md`             | Sidebar Architecture (header, quick action pills, nested groups, count badges, sticky positioning)                                   | `apply skill sidebar`      |
| `SKILL-COLOR`    | `.agents/skills/snp-sms-design-standards/color-theory-manual.md`               | Color Theory Standards (60-30-10 rule, functional palettes, accessible contrast, emotional psychology)                               | `apply skill color`        |
| `SKILL-BTN`      | `.agents/skills/snp-sms-design-standards/button-design-system-manual.md`       | Button Design System (4 states, 3 variants, 44x44px touch targets, full-width mobile CTAs)                                           | `apply skill button`       |
| `SKILL-SCROLL`   | `.agents/skills/snp-sms-design-standards/scroll-patterns-manual.md`            | Scroll Patterns Manual (9 core patterns: sticky, scroll snap, scroll driven, parallax, infinite scroll)                              | `apply skill scroll`       |
| `SKILL-PROFILE`  | `.agents/skills/snp-sms-design-standards/profile-settings-manual.md`           | Profile Settings Architecture (8 UX principles, categorization, universal icons, instant search filtering)                           | `apply skill profile`      |
| `SKILL-DARK`     | `.agents/skills/snp-sms-design-standards/dark-mode-elevation-manual.md`        | Dark Mode Elevation System (5-level elevation ladder, surface lightness, 87/60/38 typography ratios)                                 | `apply skill dark`         |
| `SKILL-BLUR`     | `.agents/skills/snp-sms-design-standards/linear-blur-glassmorphism-manual.md`  | Linear Blur & Glassmorphism (progressive multi-layer blur, subtle borders, luminance highlights)                                     | `apply skill blur`         |
| `SKILL-DEPLOY`   | `.agents/skills/snp-sms-design-standards/production-deploy-checklist.md`       | Production Deploy Checklist (20-point pre-launch quality gate: responsiveness, SEO, a11y, CWV)                                       | `apply skill deploy`       |
| `SKILL-UXLAW`    | `.agents/skills/snp-sms-design-standards/ux-ui-laws-manual.md`                 | Foundational UX/UI Laws Framework (Jakob's, Fitts's, Miller's, Hick's, Proximity, and Tesler's Laws)                                 | `apply skill ux-law`       |
| `SKILL-EFFECT`   | `.agents/skills/snp-sms-design-standards/interactive-effects-manual.md`        | Interactive Effects Catalog (18+ effect styles: kinetic hook, gravity drop, NLE timeline, jiggle delete)                             | `apply skill effect`       |
| `SKILL-LEXICON`  | `.agents/skills/snp-sms-design-standards/system-architecture-lexicon.md`       | System Architecture Lexicon (1,111 concepts: systems, concurrency, cryptography, LLM, and AI agents)                                 | `apply skill lexicon`      |
| `SKILL-PROMPT`   | `.agents/skills/snp-sms-design-standards/universal-ai-agent-prompt-manual.md` | Universal AI Agent Prompt Manual (Procedural prompt synthesis, [Preview \| Prompt] tabs, 1-click copy action, MVP blueprints)         | `apply skill prompt`       |
| `SKILL-TRACKER`  | `.agents/skills/snp-sms-design-standards/line-tracker-navigation-manual.md`    | Precision Line Tracker Navigation Manual (Dotless continuous vertical rail, active indicator segment, zero-scrollbar standard)      | `apply skill tracker`      |
