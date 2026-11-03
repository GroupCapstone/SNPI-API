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
30. `.agents/skills/system-architecture-lexicon/SKILL.md` (and `.agents/skills/snp-sms-design-standards/system-architecture-lexicon.md`): Authoritative System Architecture Lexicon & 21 Standard Rules (1,111 concepts: systems, concurrency, cryptography, LLM, and AI agents).
31. `.agents/skills/snp-sms-design-standards/universal-ai-agent-prompt-manual.md`: Authoritative Universal AI Agent Prompt & MVP Component Generation Manual (procedural prompt synthesis, [Preview | Prompt] tabs, 1-click copy action, MVP component blueprints).
32. `.agents/skills/snp-sms-design-standards/line-tracker-navigation-manual.md`: Authoritative Precision Line Tracker Navigation & Zero-Scrollbar Manual (dotless continuous vertical rail, active indicator segment, zero-scrollbar standard).
33. `.agents/skills/snp-sms-design-standards/cyber-armor-nav-manual.md`: Authoritative Cyber Armor Modular Navigation & Aerospace Mecha HUD Console Manual (45° chamfered armor plates, double-seam milled dividers, Royal Blue luminous glow, zero dots).
34. `.agents/skills/snp-sms-design-standards/accessible-design-principles-manual.md`: Authoritative Material 3 & WCAG 2.1 AAA Accessible Design Architecture Manual (13 lived experience dimensions, WCAG AAA 7:1 contrast, Alt text ≤140 chars, notifications, UX writing, M3 custom color roles, multi-modal inputs, selection architecture, layout scaffold & 5 breakpoints, 6 interaction states, grids, spacing & density scaling, 5 adaptation vectors, canonical layouts, and usability & M3 expressive architecture).
35. `.agents/skills/snp-sms-design-standards/material-a-z-glossary.md`: Authoritative Material Design 3 (M3) A-Z Lexicon & Architectural Standard (Adaptive design, HCT color science, Dynamic color, 5 color roles, Reference/System/Component tokens, 35 components, Orbiter & Spatial XR).
36. `.agents/skills/snp-sms-design-standards/layout-scaffold-manual.md`: Authoritative Material 3 Layout Scaffold Architecture Manual (Bars, Rails, Panes, Safety Regions, Jetpack Compose Rulers, Spacing tokens).
37. `.agents/skills/snp-sms-design-standards/color-roles-system-manual.md`: Authoritative Material 3 Color Roles System Manual (26 standard color roles, 6 groups, 3 contrast levels, tone-based surface containers, tone 98 surface, chroma 6 neutral palette, fixed accent colors).
38. `.agents/skills/snp-sms-design-standards/interaction-states-manual.md`: Authoritative Material 3 Interaction States & State Layers Manual (6 canonical states: Enabled, Disabled, Hover, Focused, Pressed, Dragged, State layers 8%/12%/16%, Action/Selection/Input inheritance, container exclusion, FAB hide rule, disabled contrast exemption).
39. `.agents/skills/snp-sms-design-standards/grids-spacing-density-manual.md`: Authoritative Material 3 Grids, Spacing & Density Scaling Manual (4/8/12 adaptive grid columns, 0-64dp mathematical spacing scale, density scale 0 to -3 with 4dp increments without font shrinking, >=44x44px touch targets).
40. `.agents/skills/snp-sms-design-standards/adaptive-breakpoints-manual.md`: Authoritative Material 3 Adaptive Breakpoints & 5-Vector Transformation Manual (5 standard breakpoints: Compact <600dp, Medium 600-839dp, Expanded 840-1199dp, Large 1200-1599dp, Extra-Large >=1600dp; 5 Vectors: Reveal, Divide, Resize, Reposition, Swap; component swapping matrix).
41. `.agents/skills/snp-sms-design-standards/canonical-layouts-manual.md`: Authoritative Material 3 Canonical Layout Archetypes Manual (Feed 1-4 cols, List-Detail 1-pane vs 2-pane co-planar with selection persistence, Supporting Pane 2/3 + 1/3 at 360dp min-width, Levitate layering strategy).
42. `.agents/skills/snp-sms-design-standards/usability-expressive-manual.md`: Authoritative Material 3 Usability & Expressive Architecture Manual (Nielsen Norman 5 pillars: Efficiency, Error reduction, Learnability, Memorability, Satisfaction; 6 Expressive tactics: Size, Containment, Shape, Color, Motion, Typography; Aura breathing case study; V1 Cluttered vs V2 Calm; Primary goal hierarchy).
43. `.agents/skills/snp-sms-design-standards/psychological-design-rules.md`: Mandatory Psychological Design Rules for AI Agents (Fitts's Law >=44px, Hick's Law <=5 choices, Miller's Law <=5 fields/card, Doherty Threshold <=400ms, Postel's Law liberal inputs, and 6-tier culinary downward dependency).
44. `.agents/skills/snp-sms-design-standards/culinary-component-taxonomy.md`: Authoritative 6-Tier Culinary Component Architecture (Ingredients, Recipes, Entrees, Templates, Pages, Cookbook with strict downward-only import invariant).
45. `.agents/skills/snp-sms-design-standards/open-source-checklist-macro-phases.md`: Open-Source Design System Checklist (230 Total Checks grouped across 4 macro-phases: Design Language 5/10, Foundations 0/26, Core Components 0/166, Maintenance 0/28, with isolated categorical boundaries).
46. `.agents/skills/architecture-assessment-audit/SKILL.md` (and `.agents/skills/snp-sms-design-standards/architecture-assessment-framework.md` & `docs/architecture/architecture-assessment-framework.md`): Authoritative Enterprise Architecture Assessment Framework, 7-Layer REST API, Master MVP Flow, AI Agent Protocol & 10-Domain Systems Audit Checklist (Scalability, Resiliency, Efficiency, Simplicity, Documentation, Disaster Recovery, Modularity, Interoperability, Observability, GitHub Enterprise Deployments).
47. `.agents/skills/enterprise-custom-agents-context/SKILL.md` (and `.agents/skills/enterprise-custom-agents-context/references/enterprise-custom-agents-article.md`): Authoritative Enterprise Custom Agents Expanded Context Standard via Model Context Protocol (MCP) and GitHub's built-in MCP server (30,000-character limit bypass, centralized knowledge base in `.github/knowledge/`, specialized agents in `.github/agents/`, per-repository `copilot` environment PAT secrets, and automated provisioning).
48. `.agents/skills/polyrepo-github-architecture/SKILL.md` (and `.agents/skills/polyrepo-github-architecture/references/polyrepo-github-article.md`): Authoritative Enterprise Polyrepo GitHub Architecture, Meta-Repo Manifest Integration (`release.yaml`), Cross-Repo Change Sets (`CHG-XXXX`), 4 Branching & Merge Coordination Models, Reusable Workflow Governance, Decoupled Releases, GHAS Security Campaigns, and Orchestration Automation.
49. `.agents/skills/actions-runner-controller/SKILL.md` (and `.agents/skills/actions-runner-controller/references/actions-runner-controller-article.md`): Authoritative Actions Runner Controller (ARC) Kubernetes Deployment Standard, Requests==Limits QoS, Zero Spot Instances, Single Label Routing, and DinD Sidecar Isolation.
50. `.agents/skills/repository-resilience-mirroring/SKILL.md` (and `.agents/skills/repository-resilience-mirroring/references/repository-mirroring-article.md`): Authoritative Repository Resilience Mirroring Standard, Narrow Refspec Policy (+refs/heads/main, +refs/tags/*), Out-of-Band Sync Locks, Break-Glass Deployment Runbooks, and Incident Reconciliation.
51. `.agents/skills/application-security-design-principles/SKILL.md` (and `.github/knowledge/security/application-security-design-principles.md` & `docs/architecture/application-security-design-principles.md`): Authoritative Primary Application Security Design Principles & Progressive Maturity Model (Security, Compliance, Proactivity, Awareness, Simplicity across Start, Mature, and Advance Tiers).
52. `.agents/skills/actions-private-networking/SKILL.md` (and `.agents/skills/actions-private-networking/references/actions-private-networking-article.md` & `docs/architecture/actions-private-networking.md`): Authoritative GitHub Actions Private Networking & Azure VNet Injection Standard (Subnet Delegation to `GitHub.Network/networkSettings`, Subnet Sizing Invariant: Usable IPs >= Max Concurrency * 1.20, Azure Firewall Egress FQDN Rules, No macOS Runners, and Automated CLI Verification).
53. `.agents/skills/github-repository-threat-model/SKILL.md` (and `.agents/skills/github-repository-threat-model/references/github-repository-threat-model-article.md` & `docs/architecture/github-repository-threat-model.md`): Authoritative GitHub Repositories Threat Model & Source Integrity Defense Standard (SLSA v1.0 Alignment, 8 Core Threats T-01 to T-08, Danger Zone Governance, Ruleset Force-Push/Deletion Blocks, Dual-Control PR Reviews, Signed Commits, and Automated Threat Auditing).
54. `.agents/skills/dependency-supply-chain-defense/SKILL.md` (and `.agents/skills/dependency-supply-chain-defense/references/dependency-supply-chain-attacks.md` & `docs/architecture/dependency-supply-chain-defense.md` & `.github/knowledge/security/dependency-supply-chain-defense.md`): Authoritative Dependency Supply Chain Defense Standard (Ken Muse & Josh Johanning, Layered Defenses across Package Lifecycle Script Disabling, Dev Container Isolation, Signed Commits with User Interaction, Repository Rulesets, OIDC Trusted Publishing with Attestation Verification, and Automated Scanning with Dependabot Auto-Triage).
55. `.agents/skills/prioritizing-security-alerts/SKILL.md` (and `.agents/skills/prioritizing-security-alerts/references/prioritizing-security-alerts.md` & `docs/architecture/prioritizing-security-alerts.md` & `.github/knowledge/security/prioritizing-security-alerts.md`): Authoritative Security Alert Prioritization Standard (Greg Mohler & Tom Horton, 3-Step Remediation Model, GitHub Alert Metadata, Repository Custom Properties, Targeted Security Campaigns, and Automated Multiplier Risk Scoring).
56. `.agents/skills/securing-github-actions-workflows/SKILL.md` (and `.agents/skills/securing-github-actions-workflows/references/securing-github-actions-workflows-article.md` & `docs/architecture/securing-github-actions-workflows.md`): Authoritative Securing GitHub Actions Workflows Standard (Greg Mohler & Kitty Chiu, Full 40-Character Action SHA Pinning, Least-Privilege Permissions Scoping, Script Injection Elimination via Environment Mapping, Pwn-Request Defenses, and Automated Workflow Security Auditing).
57. `.agents/skills/enforce-ghas-at-scale/SKILL.md` (and `.agents/skills/enforce-ghas-at-scale/references/enforce-ghas-at-scale-article.md` & `docs/architecture/enforce-ghas-at-scale.md` & `.github/knowledge/security/enforce-ghas-at-scale.md`): Authoritative Enforce GitHub Advanced Security (GHAS) at Scale Standard (Greg Mohler, Custom Properties Dynamic Targeting, Security Configurations, Push Ruleset Bypass Prevention for `.github/secret_scanning.yml`, Centralized Dependency Review Reusable Workflows, CodeQL Matrix Scans, and SIEM Audit Log Streaming).
58. `.agents/skills/repository-architecture-strategy/SKILL.md` (and `.agents/skills/repository-architecture-strategy/references/repository-architecture-strategy-article.md` & `docs/architecture/repository-architecture-strategy.md` & `.github/knowledge/architecture/repository-architecture-strategy.md`): Authoritative Repository Architecture Strategy Standard (Monorepo vs Polyrepo, 10 Core Design Strategies, 13-Point Implementation Checklist, Workspace Boundary Decoupling, Circular Dependency Guards, and Alternate Deployment Continuity).
59. `.agents/skills/managing-large-git-repositories/SKILL.md` (and `.agents/skills/managing-large-git-repositories/references/managing-large-git-repositories-article.md` & `docs/architecture/managing-large-git-repositories.md` & `.github/knowledge/architecture/managing-large-git-repositories.md`): Authoritative Managing Large Git Repositories Standard (Scaling Git Repositories, Git LFS Offloading, Shallow/Partial Clones, Deep .gitignore Optimization, Tree Depth Limits, and Automated Bloat Auditing).

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

## 5. Mandatory Pre-Push CI, Dual-Developer Sync & Deployment Quality Gate Rule

- **One-Command Automated Push & Checkpoint (`npm run push:checkpoint`)**:
  - Whenever the user explicitly commands to push (`push`, `git push`, `publish`), always run `npm run push:checkpoint` (or the complete 10-step sequence: format, lint, typecheck, smoke, deploy:verify, git:sync, changelog:sync, commit, tag, push, and live CI status verification).
- **Mandatory Pre-Push ESLint Quality Gate (`npm run lint`)**:
  - `npm run lint` MUST be executed and pass with 0 errors before any commit or push. JSX text node violations, unescaped entities, and typing errors must never reach remote CI.
- **Mandatory Dual-Developer Git Reconciliation & Merge Gate (`npm run git:sync`)**:
  - Two developers actively collaborate on this repository. Before attempting any commit push or release checkpoint, the system must **ALWAYS run `npm run git:sync`** (or `git fetch origin` followed by `git merge origin/<branch> --no-edit`).
  - If remote has incoming commits from the other developer, merge them immediately into the working tree. Never overwrite or force-push over collaborator code.
  - If conflicts occur, resolve them cleanly, run the full verification pipeline (`npm run typecheck`, `npm run lint`, `npm run deploy:verify`), and commit the merged result before pushing.
- **Zero Push on Failed Deploy or CI**: Never run `git push`, push release tags, or publish checkpoints if any GitHub deployment, build, test, or CI workflow is failed or failing on `main`.
- **Pre-Push Deployment Gate (`npm run deploy:verify`)**: Always execute `npm run deploy:verify` prior to pushing to ensure all deployment manifests exist (`vercel.json`, `apps/backend/vercel.json`, `apps/frontend/vercel.json`, Kubernetes manifests), production builds compile with zero errors, and recent GitHub Actions workflows on `main` are green.
- **Mandatory Post-Push Live CI Monitoring Until 100% Green (`npm run push:verify`)**:
  - Every remote push MUST actively monitor GitHub Actions runs for the pushed commit SHA (`gh run list --commit <SHA>`) until all triggered workflows reach completed `[PASSED]` status.
  - The agent must NOT end the turn or claim completion until all remote checks are green.
  - If any workflow fails, the agent must immediately fetch the failed logs (`gh run view <ID> --log-failed`), diagnose the error, resolve it locally, and push the fix.

---

## 6. Autonomous AI Agents Policy

All AI coding assistants (including Antigravity, Claude, Copilot, Codex, and subagents) operating in this repository must strictly comply with the following operational rules:

- **Verification-First Mandate**: AI agents must never claim a task, bug fix, or feature is complete without executing live verification commands (`npm run typecheck`, `npm run test`, `npm run smoke`, `npm run deploy:verify`). Verification outputs must be presented in compact, structured Markdown tables with actual exit codes.
- **Zero Hallucination of Credentials & Endpoints**: AI agents must never invent fictional API keys, imaginary environment variables, mock endpoints, or unregistered packages. Always retrieve authentic contracts from `@snp/shared` and authentic configuration from `apps/backend/src/config/`.
- **Non-Destructive Operations Guard**: AI agents must NEVER execute destructive shell commands (`rm -rf /`, `git reset --hard` on uncommitted user work, unseeded database drops, or dropping git stashes). Preserve existing comments, docstrings, and architectural decision records (ADRs).
- **Contract Preservation Mandate**: AI agents must never modify existing API routes, query params, HTTP status codes, or payload schemas without explicit user direction.
- **Real-Time Technical Documentation Sync**: AI agents must execute `npm run changelog:sync` whenever architectural changes, skills, or features are implemented to keep `CHANGELOG.md` and the live developer document portal in real-time alignment.
- **Mandatory UI Agent Design Implementation Invariants (Every Skill & Agent)**: Whenever designing, styling, refactoring, or generating UI components, navigation menus, or documentation views across the entire platform, all AI agents must strictly enforce:
  1. **Minimal Guide Text**: Only render title and buttons/controls; never write walls of descriptive paragraphs or redundant guide text.
  2. **Mandatory Icon Hover Definitions**: Every interactive icon and icon button must show an accessible definition/action label on hover via `title` or tooltip.
  3. **Pure Icon Hygiene**: Never use emojis, informal symbols, or decorative background shapes/colored blobs (`bg-blue-100 rounded-full`, `bg-[#0056FF] rounded-lg`) behind icons.
  4. **Brand Blueprint Compliance**: Exclusively respect the 5 primary brand tokens (`#0056FF`, `#2277FF`, `#E3E7FC`, `#FFFFFF`, `#EFF5FF`) and high-contrast `#0A1A4A` Deep Navy text.
  5. **Universal Web & Mobile Responsive Device First**: Always engineer for fluid responsive behavior across both mobile viewports and desktop with zero clipping and >=44x44px touch targets.
  6. **Mandatory Zero Links Rule (Never Add Links)**: Under no circumstances should AI agents add markdown links, file links (`file://`, `[label](...)`), URL hyperlinks, or unnecessary navigation anchor links in responses or generated UI components unless explicitly requested by the user. Use plain text, backticks (`code`), or bold text for references.
  7. **Notification & SMS Architecture Invariants**: All system notifications and SMS messages must strictly obey: Title <29 characters with front-loaded information and zero product name repetition; Collapsed body <40 characters; Expanded body <80 characters; Action buttons 1–2 buttons (1–2 words each); SMS Latin <160 characters, Non-Latin <134 characters; Day-specific timing (explicit weekdays, never relative "today/tomorrow"); zero dynamic variables in titles; zero unsolicited ads; zero jokes; zero emoji clutter; never interrupt active onboarding.
  8. **UX Writing, Pronoun & Punctuation Invariants**: Enforce universal sentence-case across all titles, buttons, and navigation (zero Title Case, zero all-caps blocks); second-person ("you/your") point of view without mixing "my/your"; avoid corporate "we/I" (except legal consent "I agree"); skip terminal periods on single sentences, tooltips, and labels; use contractions ("don't", "can't"); use Oxford serial commas; En dash (–) without spaces for ranges; hyphenate adjective/noun phrases, never verbs; ban Latin abbreviations ("e.g.", "etc."); explain consequences neutrally with mandatory undo recovery instructions.
  9. **Customizing Material & M3 Color Roles System Invariants**: Enforce 26 standard color roles organized into 6 groups: Primary, Secondary, Tertiary, Error, Surface, and Outline; support 3 contrast levels (Standard, Medium, High); apply updated colorful container on-roles (`on-primary-container`, `on-secondary-container`, `on-tertiary-container`, `on-error-container`) across 14 affected components (Badges, Buttons, Extended FAB, FAB, Icon buttons, Segmented buttons, Chips, Lists, Menus, Navigation bar, Navigation drawer, Navigation rail, Switches, Toolbars); implement tone-based surface container scale (`surface-container-lowest` through `highest`) replacing legacy elevation overlays; enforce technical calibrations: default light surface tone 98 (from 99), neutral palette chroma 6 (from 4), and darkened dark theme surfaces; support add-on fixed accent colors (`primary-fixed`, `fixed-dim`, `on-fixed`, `on-fixed-variant`) for theme-independent elements; support selective dynamic color scoping with immutable brand fallback; export via Design System Package (DSP) and W3C token formats.
  10. **Multi-Modal Input Architecture Invariants**: Build for simultaneous mouse, trackpad, physical keyboard, stylus, and touch inputs across all device form factors; show visible mouse cursor when external pointing device is connected; separate mouse-drag text selection from touch-drag scrolling; implement semantic cursor morphology (`default`, `pointer`, `text`, `col-resize`, `row-resize`); support secondary click for context menus; suppress virtual on-screen keyboards when physical keyboard is attached; wire up `Enter` for submission, `Spacebar` for media/toggle control, and `Escape` for dismiss/focus clear without deleting typed text.
  11. **Selection Architecture & Indicators Invariants**: Apply three canonical selection indicators (surface tint `#EFF5FF` with `#0056FF` border, checkmark icon, checkbox component); enforce single-select active pill indicators on navigation rails/drawers/tabs; implement touch selection modes (long-press, avatar tap shortcut, Contextual Action Bar with `[N Selected]`, and batch drag without reordering conflicts); enforce desktop checkbox rules (always visible in primary data tables; reveal-on-hover / reveal-on-first-select in secondary feeds).
  12. **Layout Architecture & Adaptive Scaffold Invariants**: Structure interfaces via Material 3 Scaffold building blocks: Windows (multi-window, full-screen, split, bubbles), Grids (columns, spacing, focal points), Bars (app bar, bottom nav bar spanning 1+ panes), Rails (perimeter space, navigation rail, toolbars, FABs), Panes (1–3 panes; co-planar, floating, docked; implicit vs explicit grouping), Drag handles (resizable flexible panes, collapse/expand), Rulers (global alignment lines); adapt fluidly across 5 opinionated breakpoints (Compact <600dp, Medium 600–839dp, Expanded 840–1199dp, Large 1200–1599dp, Extra-Large ≥1600dp) and 3 primary experience types (Mobile full-screen, Desktop free-form resizable multi-window, Spatial/XR 3D space with high-contrast pane containers and orbiters); enforce 3 adaptive pane strategies (show/hide, levitate, reflow) and 3 component adaptation patterns (resizing, progressive disclosure showing/hiding, presentation changes like standard to extended FAB); guarantee complete RTL bidirectionality (Arabic, Hebrew, Farsi) with navigation mirroring and respect system safety regions.
  13. **Interaction States & State Layers Invariants**: Implement 6 canonical interaction states (Enabled, Disabled, Hover, Focused, Pressed, Dragged) using standardized state layers; enforce component inheritance (Action, Selection, Input, and Containment components inherit states; container shells like App Bars, Badges, Navigation Drawers/Rails, and Dialogs do NOT inherit states—only their child interactive elements do); enforce FAB rule (unavailable FAB actions must completely hide rather than display as disabled); maintain layout exclusivity (strictly one hover, one focus, one pressed, and one dragged state active at any time in the layout); enforce accessible ring-like focus indicators (2px solid #0056FF with 2px offset) for keyboard navigation; support valid compound states (Hover+Focused, Selected+Hover, Selected+Pressed); strictly prohibit disabled elements from receiving hover, focus, press, or drag events.
  14. **Grids, Spacing & Density Scaling Invariants**: Sequence layout composition by placing grid columns -> edge bars & rails -> content panes; align across global rulers (safety insets, title baseline, content anchors, and margin guides); apply implicit grouping (close proximity) and explicit grouping (keyline borders/cards); enforce the component density scale (0 default, -1, -2, -3 decreasing height/padding by 4dp increments without shrinking font size); strictly maintain minimum 48x48dp touch hit targets for interactive controls; prohibit high density in focused selection menus, dialogs, and snackbars; allow users to opt into dense views via accessible settings.
  15. **Adaptive Breakpoints & 5-Vector Transformation Invariants**: Classify viewports strictly across 5 breakpoints (<600dp Compact, 600–839dp Medium, 840–1199dp Expanded, 1200–1599dp Large, ≥1600dp Extra-Large); govern breakpoint adaptations via the 5 vectors: Reveal (expose secondary panes/rails), Divide (1 pane <840dp, 2 panes 840–1599dp, 3 panes ≥1600dp; single-pane immersion for focused tasks), Resize (maintain 40–60 characters per line readability), Reposition (shift bottom mobile actions to leading rail edges; anchor centered labels), and Swap (substitute functionally equivalent components: Bottom Nav -> Collapsed Rail -> Expanded Rail; Bottom Sheet -> Menu; Full-screen -> Basic Dialog); strictly prohibit invalid cross-type swaps (button to chip/menu).
  16. **Canonical Layout Archetypes Invariants**: Standardize interface structures across 3 canonical archetypes: Feed (content browsing via 1-column vertical stack on compact, 2–3 columns on medium, 4+ columns on expanded), List-Detail (parent-child data models; single-pane drill-down with Top App Bar Back button on compact/medium, 2-pane co-planar with active selection highlighting and scroll persistence on expanded), and Supporting Pane (asymmetric ~2/3 primary focus pane + 1/3 contextual supporting panel; stacked below or as bottom sheet on compact/medium, docked beside at fixed 360dp on expanded); apply the Levitate layering strategy for task-focused auxiliary workflows; never use List-Detail for non-parent-child workflows.
  17. **Usability & M3 Expressive Architecture Invariants**: Govern interface design via Nielsen Norman Group's 5 usability pillars (Efficiency, Error reduction, Learnability, Memorability, Satisfaction); distinguish Usability (intuitive & easy for everyone) from Accessibility (perceivable, operable, understandable, robust for assistive technology); enforce strict Primary, Secondary, and Tertiary goal hierarchy per view (maximum one primary goal per screen, prominent CTA, generous empty space, supportive data/settings styled with secondary containers); leverage M3 Expressive tactics systematically (Containment/grouping, Size & scale hierarchy, Shape & shape morph across 35 standard shapes, Color contrast & dynamic color roles, Typographic scale distinction); maintain calm, balanced layouts (uniform shapes, consistent text spacing, avoiding visual clutter, preventing simultaneous competing animations); reserve hero moments for primary flow culminations (e.g., interactive breathing guidance with spring motion) and subordinate controls to bottom easy-to-reach zones.
- **Mandatory Zero Links Rule — AI Agents Must Never Add Links (ABSOLUTE RULE)**: AI agents must NEVER add markdown links, file scheme links (`file://`), URL hyperlinks, or anchor tags in responses, reports, or code unless explicitly commanded by the user.

---

## 7. Repository Ownership & Future Transfer Protocol

- **Official Repository Ownership**: The official GitHub repository owner is `@Tan-Saphea` (`https://github.com/Tan-Saphea/SNPI-SMS.git`).
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

---

## 10. Mandatory Zero Gradient & Zero Black/Gray Component Design Rule — ABSOLUTE STANDARD

- **Zero Color Gradients**: Under no circumstances should CSS gradients (`bg-gradient-to-*`, `linear-gradient`, gradient text, gradient borders) be used in document layouts or component designs. All surfaces, accents, indicators, and fills must be flat, pure solid colors.
- **Zero Black & Zero Gray Component Design**: Never use solid black (`#000000`, `bg-black`, `bg-slate-950`) or drab gray (`bg-gray-*`, `bg-slate-900`, dark gray card containers) to design components.
- **Authoritative Solid Brand Palette**:
  - **Royal Blue (`#0056FF`)**: Primary brand base, buttons, active segments, flight contrails, core CTAs.
  - **Azure Blue (`#2277FF`)**: Interactive accents, hover highlights, waypoint node rings.
  - **Soft Lavender (`#E3E7FC`)**: Surface micro-tints, chips, badge containers, secondary pill cards.
  - **Light Ice Blue (`#EFF5FF`)**: Micro-container fills, code callout backgrounds, soft active tabs.
  - **Pure White (`#FFFFFF`)**: Default document canvas, card backgrounds, print-ready surfaces.
  - **Deep Brand Navy (`#0A1A4A` / `#001D66`)**: High-contrast, crystal-clear typography on light surfaces.
    | `SKILL-EFFECT` | `.agents/skills/snp-sms-design-standards/interactive-effects-manual.md` | Interactive Effects Catalog (18+ effect styles: kinetic hook, gravity drop, NLE timeline, jiggle delete) | `apply skill effect` |
    | `SKILL-LEXICON` | `.agents/skills/system-architecture-lexicon/SKILL.md` | System Architecture Lexicon & 21 Standard Rules (1,111 concepts: systems, concurrency, cryptography, LLM, and AI agents) | `apply skill lexicon` |
    | `SKILL-PROMPT` | `.agents/skills/snp-sms-design-standards/universal-ai-agent-prompt-manual.md` | Universal AI Agent Prompt Manual (Procedural prompt synthesis, [Preview \| Prompt] tabs, 1-click copy action, MVP blueprints) | `apply skill prompt` |
    | `SKILL-TRACKER` | `.agents/skills/snp-sms-design-standards/line-tracker-navigation-manual.md` | Precision Line Tracker Navigation Manual (Dotless continuous vertical rail, active indicator segment, zero-scrollbar standard) | `apply skill tracker` |
    | `SKILL-ICONBAR` | `.agents/skills/snp-sms-design-standards/icon-bar-toolbar-manual.md` | Icon Bar Toolbar & Blueprint Precision Design Standards (Bloom label reveal, status dot, roving tabindex, r4 radii, 44px banner suite) | `apply skill iconbar` |
    | `SKILL-RAILTOC` | `.agents/skills/snp-sms-design-standards/rail-toc-flight-tracker-manual.md` | Rail TOC Flight Tracker Navigation Manual (Origami paper plane flight navigation, directional turning, solid/dashed rail states, r4 buttons) | `apply skill rail-toc` |
    | `SKILL-ROYAL` | `.agents/skills/snp-sms-design-standards/royal-blue-brand-system-manual.md` | Royal Blue Brand Colors, Futurewave Gradients, Light Day First, Zero-Dot UI Standards, and Deduplicated Components Standard | `apply skill royal` |
    | `SKILL-CYBER-NAV` | `.agents/skills/snp-sms-design-standards/cyber-armor-nav-manual.md` | Cyber Armor Modular Navigation & Aerospace Mecha HUD Console Manual (45° chamfered armor plates, double-seam milled dividers, Royal Blue glow) | `apply skill cyber-nav` |
    | `SKILL-MINIMAL-UI` | `.agents/skills/snp-sms-design-standards/SKILL.md` (Section 7.13) | Minimal guide text (title & buttons only), icon hover definitions, pure icon hygiene (zero emojis/blobs), brand blueprint, responsive | `apply skill minimal-ui` |
    | `SKILL-A11Y` | `.agents/skills/snp-sms-design-standards/accessible-design-principles-manual.md` | Material 3 & WCAG 2.1 AAA Accessible Design Architecture (13 dimensions, Alt text, inputs, selection, layout scaffold, 6 states, grids & density) | `apply skill a11y` |
    | `SKILL-SCAFFOLD` | `.agents/skills/snp-sms-design-standards/layout-scaffold-manual.md` | Material 3 Layout Scaffold (Bars, Rails, Panes, Safety Regions, Compose Rulers, Spacing Tokens) | `apply skill scaffold` |
    | `SKILL-COLOR-ROLES` | `.agents/skills/snp-sms-design-standards/color-roles-system-manual.md` | Material 3 Color Roles System (26 roles, 6 groups, 3 contrast levels, tone surfaces, fixed accents) | `apply skill color-roles` |
    | `SKILL-STATES` | `.agents/skills/snp-sms-design-standards/interaction-states-manual.md` | Material 3 Interaction States & State Layers (Enabled, Disabled, Hover, Focused, Pressed, Dragged) | `apply skill states` |
    | `SKILL-GRIDS` | `.agents/skills/snp-sms-design-standards/grids-spacing-density-manual.md` | Material 3 Grids, Spacing & Density Scaling (4/8/12 Columns, 0-64dp Spacing, Density 0 to -3) | `apply skill grids` |
    | `SKILL-BREAKPOINTS` | `.agents/skills/snp-sms-design-standards/adaptive-breakpoints-manual.md` | Material 3 Adaptive Breakpoints & 5-Vector Transformation (Compact, Medium, Expanded, Large, Extra-Large) | `apply skill breakpoints` |
    | `SKILL-CANONICAL` | `.agents/skills/snp-sms-design-standards/canonical-layouts-manual.md` | Material 3 Canonical Layout Archetypes (Feed, List-Detail, Supporting Pane, Levitate Strategy) | `apply skill canonical` |
    | `SKILL-USABILITY` | `.agents/skills/snp-sms-design-standards/usability-expressive-manual.md` | Material 3 Usability & Expressive Architecture (Nielsen Norman 5 Pillars, 6 Tactics, Aura Case Study) | `apply skill usability` |
    | `SKILL-GLOSSARY` | `.agents/skills/snp-sms-design-standards/material-a-z-glossary.md` | Material Design 3 (M3) A-Z Lexicon Standards (107 Architectural Terms, HCT Color Science, Tokens) | `apply skill glossary` |
    | `SKILL-AUDIT` | `.agents/skills/architecture-assessment-audit/SKILL.md` (and `.agents/skills/snp-sms-design-standards/architecture-assessment-framework.md`) | Authoritative Enterprise Architecture Assessment Framework, REST API & 10-Domain Audit Checklist (Scalability, Resiliency, Efficiency, Simplicity, Documentation, Disaster Recovery, Modularity, Interoperability, Observability, GitHub Enterprise Deployments) | `apply skill audit` |
    | `SKILL-APPSEC` | `.agents/skills/application-security-design-principles/SKILL.md` (and `.github/knowledge/security/application-security-design-principles.md`) | Authoritative Primary Application Security Design Principles & Progressive Maturity Model (Security, Compliance, Proactivity, Awareness, Simplicity across Start, Mature, Advance Tiers) | `apply skill appsec` |
    | `SKILL-SUPPLYCHAIN` | `.agents/skills/dependency-supply-chain-defense/SKILL.md` (and `.github/knowledge/security/dependency-supply-chain-defense.md`) | Authoritative Dependency Supply Chain Defense Standard (Layer 1-6 Defense-in-Depth, Disabled Lifecycle Scripts, Dev Containers, Signed Commits, Rulesets, Trusted Publishing, Dependabot) | `apply skill supplychain` |
    | `SKILL-ALERTPRIO` | `.agents/skills/prioritizing-security-alerts/SKILL.md` (and `.github/knowledge/security/prioritizing-security-alerts.md`) | Authoritative Security Alert Prioritization Standard (3-Step Remediation Model, Metadata Enrichment, Custom Properties, Campaigns & Scoring Formula) | `apply skill alertprio` |
    | `SKILL-THREATMODEL` | `.agents/skills/github-repository-threat-model/SKILL.md` (and `docs/architecture/github-repository-threat-model.md`) | Authoritative GitHub Repositories Threat Model & Source Integrity Defense Standard (SLSA v1.0 Alignment, 8 Core Threats T-01 to T-08, Danger Zone Governance) | `apply skill threatmodel` |
    | `SKILL-WORKFLOWS` | `.agents/skills/securing-github-actions-workflows/SKILL.md` (and `docs/architecture/securing-github-actions-workflows.md`) | Authoritative Securing GitHub Actions Workflows Standard (Full 40-Char SHA Pinning, Least-Privilege Scoping, Pwn-Request Defenses) | `apply skill workflows` |
    | `SKILL-GHASCALE` | `.agents/skills/enforce-ghas-at-scale/SKILL.md` (and `docs/architecture/enforce-ghas-at-scale.md`) | Authoritative Enforce GHAS at Scale Standard (Custom Properties, Security Configurations, Push Ruleset Bypass Prevention, Dependency Review Gate) | `apply skill ghascale` |
    | `SKILL-ARC` | `.agents/skills/actions-runner-controller/SKILL.md` (and `docs/architecture/actions-runner-controller.md`) | Authoritative Actions Runner Controller (ARC) Kubernetes Deployment Standard (Requests==Limits QoS, Zero Spot Instances) | `apply skill arc` |
    | `SKILL-MIRROR` | `.agents/skills/repository-resilience-mirroring/SKILL.md` (and `docs/architecture/repository-resilience-mirroring.md`) | Authoritative Repository Resilience Mirroring Standard (Narrow Refspec, Out-of-Band Sync Locks, Break-Glass Deployments) | `apply skill mirror` |
    | `SKILL-PRIVATE-NET` | `.agents/skills/actions-private-networking/SKILL.md` (and `docs/architecture/actions-private-networking.md`) | Authoritative Actions Private Networking & Azure VNet Injection Standard (Subnet Delegation, Capacity Formula Usable IPs >= Max * 1.20) | `apply skill private-net` |
    | `SKILL-CUSTOM-AGENTS` | `.agents/skills/enterprise-custom-agents-context/SKILL.md` | Authoritative Enterprise Custom Agents Expanded Context Standard via MCP (30,000-char limit bypass) | `apply skill custom-agents` |
    | `SKILL-POLYREPO` | `.agents/skills/polyrepo-github-architecture/SKILL.md` | Authoritative Enterprise Polyrepo GitHub Architecture (`release.yaml`, `CHG-XXXX`, 4 Branching Models) | `apply skill polyrepo` |
    | `SKILL-REPOSTRATEGY` | `.agents/skills/repository-architecture-strategy/SKILL.md` (and `docs/architecture/repository-architecture-strategy.md`) | Authoritative Repository Architecture Strategy Standard (Monorepo vs Polyrepo, 10 Strategies, 13 Checklist Steps, Alternate Deployment Continuity) | `apply skill repostrategy` |
    | `SKILL-LARGEREPO` | `.agents/skills/managing-large-git-repositories/SKILL.md` (and `docs/architecture/managing-large-git-repositories.md`) | Authoritative Managing Large Git Repositories Standard (Scaling Git Repos, Git LFS, Clone Optimization, Tree Depth Limits) | `apply skill largerepo` |

---

## 11. Mandatory Zero Blue Dot & Clean Navigation Standard — ABSOLUTE STANDARD

- **Strict Prohibition — Zero Blue Indicator Dots**: Under no circumstances should animated pinging or static blue dots (`animate-ping bg-[#0056FF]`, live indicator status dots, pulsing waypoint rings) be used in navigation bars, breadcrumbs, titles, sub-headers, or status pills. Never use this blue dot style anywhere in the application or documentation.
- **Clean Sticky Sub-Navigation Rails**: Sticky sub-navigation bars must strictly render clean, direct category jump pills (`Home`, `Navigation`, `Inputs`, `Feedback`, `Display`, `AI Kit`, `Forms`) without dynamic location breadcrumbs, shifting title texts, or pulsing dots taking up horizontal space.

---

## 12. Mandatory Full Brand Name SNPI Rule — ALWAYS USE FULL NAME SNPI (NEVER TRUNCATE TO SNP)

- **Mandatory Full Institutional Identity**: Always use the full institutional name **SNPI** (or **SNPI-SMS**), never truncate or abbreviate to bare "SNP".
- **Strict Brand Naming Invariants**:
  - Educational Institution: **SNPI International School** (Khmer: **សាលាអន្តរជាតិ អេស អ៊ិន ភី អាយ · SNPI INTERNATIONAL SCHOOL**), never "SNP International School".
  - Enterprise Platform: **SNPI-SMS** / **SNPI Management System**, never "SNP-SMS" or "SNP Management System" without the "I".
  - Documentation, Badges & Labels: Always display **SNPI** (e.g. `SNPI ENTERPRISE UI SYSTEM`, `SNPI UI Library`, `snpi-ui`, `*.snpi.edu.kh`).
  - Code & Metadata: Page titles, descriptions, and placeholder names must strictly refer to **SNPI** / **SNPI-SMS**.

---

## 13. Mandatory Minimal Guide Text, Icon Hover Definitions, Pure Icon Hygiene & Responsive Brand Blueprint Standard — ABSOLUTE STANDARD

- **Minimal Guide & Description Text (Title & Buttons Only)**:
  - Strictly prohibit walls of descriptive text, redundant guide paragraphs, helper instructions, or verbose labels under components and sections.
  - Every component interface must remain minimal, clean, high-density, and direct: render only the title name, buttons, and direct interactive component controls. Never write redundant guide text.
- **Mandatory Icon Hover Definition Standard**:
  - Every interactive icon, icon button, and indicator across desktop and mobile must provide a clean, descriptive hover definition of that place/action via accessible `title` attribute or `LibraryTooltip`. Zero mystery icons.
- **Pure Icon Hygiene (Zero Shapes or Color Blobs Behind Icons)**:
  - Strictly never use emojis, informal symbols, or colored shapes/blobs (circles, squares, tinted background patches such as `rounded-full bg-blue-100`, `rounded-lg bg-[#0056FF]`) behind icons.
  - Icons must always be pure, clean vector marks rendered in authoritative brand colors (`text-[#0056FF]`, `text-[#2277FF]`, `text-slate-700`, `text-white` on standard buttons) without decorative background badge shapes.
- **Strict Brand Blueprint & Color Token Integrity**:
  - All page designs, navigation hubs, menus, and component views must strictly respect the 5 primary brand tokens:
    1. `01 #0056FF` Royal Blue — Core brand base, buttons, active highlights.
    2. `02 #2277FF` Azure Blue — Interactive accents, hover states.
    3. `03 #E3E7FC` Soft Lavender — Surface micro-tints, subtle borders (`#CAD3F5`), badge fills.
    4. `04 #FFFFFF` Pure White — Document canvas base, card foundations.
    5. `05 #EFF5FF` Ice Tint — Subsurface fills, segment tracks, hover backdrops.
    - Typography Token: Deep Navy `#0A1A4A` (primary headings & text) / Slate-900 `#0F172A`. Never use muddy slate or dark gray containers.
- **Universal Web & Mobile Responsive Device First**:
  - Always engineer and verify layouts, menus, and component demos for both mobile viewports (<640px) and wide desktop screens.
  - Zero text clipping/truncation, zero horizontal overflow, fluid flex wrapping, and minimum 44x44px touch targets.

---

## 14. Mandatory Autonomous AI Agent Compliance with Design Skills & Architecture Rules — ABSOLUTE STANDARD

All autonomous AI coding assistants (including Antigravity, Claude, Copilot, Codex, and subagents) operating in this repository must strictly work with the complete suite of Material Design 3 and SNPI enterprise design skills as non-negotiable operational rules:

1. **Scaffold Architecture Compliance (`SKILL-SCAFFOLD`)**:
   - Every UI layout must structure interfaces via Scaffold primitives: Bars (Top App Bar variants, Bottom App Bar / Bottom Nav), Rails (Navigation Rail, Trailing Utility Rails), and Panes (1–3 panes; co-planar, docked, or floating).
   - Must strictly respect safety regions (hardware camera cutouts, system gesture navigation insets, foldable physical hinge seams) and align across Jetpack Compose Rulers (Margin, Baseline, Split Anchor).

2. **Color Roles System & Calibrations Compliance (`SKILL-COLOR-ROLES`)**:
   - Enforce 26 standard color roles across 6 groups (Primary, Secondary, Tertiary, Error, Surface, Outline) and 3 contrast levels (Standard, Medium, High).
   - Use updated colorful container on-roles (`on-primary-container`, `on-secondary-container`, `on-tertiary-container`, `on-error-container`) across 14 affected components.
   - Enforce discrete tone-based surface containers (`surface-container-lowest` through `highest`) replacing legacy elevation overlays.
   - Strictly apply technical calibrations: Tone 98 light surface, Chroma 6 neutral palette, and darkened dark surfaces. Use fixed accents (`*-fixed`, `*-fixed-dim`) for theme-independent elements.

3. **Interaction States & State Layers Compliance (`SKILL-STATES`)**:
   - Implement 6 canonical interaction states (Enabled, Disabled, Hover, Focused, Pressed, Dragged) using standardized state layers (8%, 12%, 16% opacity).
   - Strictly enforce component inheritance: Action, Selection, and Input components inherit states; container shells (App bars, Badges, Navigation bars, Dialogs, Toolbars) do NOT inherit states.
   - Unavailable FAB actions must hide completely rather than display as disabled. Disabled states are exempt from contrast requirements.
   - Layout exclusivity: strictly one hover, one focus, one pressed, and one dragged state active at any given moment.

4. **Grids, Spacing & Density Scaling Compliance (`SKILL-GRIDS`)**:
   - Sequence layout composition: Grid columns (4 compact, 8 medium, 12 expanded+) -> Edge bars/rails -> Content panes.
   - Adhere strictly to the mathematical spacing scale: 0dp, 4dp, 8dp, 12dp, 16dp, 24dp, 32dp, 40dp, 48dp, 56dp, 64dp.
   - Enforce component density scale (0 default, -1, -2, -3 decreasing container padding/height by 4dp increments without altering font size).
   - Maintain minimum 48x48dp (>=44x44px) touch targets across all density levels. Never apply high density to selection menus, dialogs, or snackbars.

5. **Adaptive Breakpoints & 5-Vector Transformation Compliance (`SKILL-BREAKPOINTS`)**:
   - Classify all viewports into 5 standard breakpoints: Compact (<600dp), Medium (600–839dp), Expanded (840–1199dp), Large (1200–1599dp), Extra-Large (≥1600dp).
   - Govern breakpoint transformations strictly through the 5 vectors: Reveal (expose secondary panes/rails), Divide (1 pane <840dp, 2 panes 840–1599dp, 3 panes ≥1600dp), Resize (40–60 characters per line readability), Reposition (shift bottom actions to leading rails), and Swap (substitute functionally equivalent components).

6. **Canonical Layout Archetypes Compliance (`SKILL-CANONICAL`)**:
   - Standardize all screen structures across the 3 canonical archetypes: Feed (content browsing in 1 to 4+ columns), List-Detail (parent-child data models; single-pane drilldown on compact vs 2-pane co-planar on expanded), and Supporting Pane (~2/3 primary canvas + 1/3 supporting pane right docked at 360dp min-width).
   - Apply the Levitate layering strategy for task-focused auxiliary workflows; never use List-Detail for non-parent-child workflows.

7. **Usability & M3 Expressive Architecture Compliance (`SKILL-USABILITY`)**:
   - Govern all interface design via Nielsen Norman Group's 5 usability pillars (Efficiency, Error reduction, Learnability, Memorability, Satisfaction).
   - Enforce strict goal hierarchy: maximum one primary hero goal per screen, prominent CTA, generous white space, supportive secondary actions.
   - Systematically apply 6 M3 Expressive design tactics: Containment, Size, Shape, Color, Motion (<300ms spring physics), Typography. Maintain calm layouts (anti-clutter Aura standard).

8. **Material Design 3 A-Z Lexicon Compliance (`SKILL-GLOSSARY`)**:
   - Maintain strict terminology and conceptual alignment across all 107 foundational architectural terms, HCT color science, and 3-tier token hierarchy (Reference, System, Component).

9. **Blueprint Menu Primary Anchor Invariant (Brand Colors & Color Ramps Tokens — NEVER CHANGE)**:
   - In the Blueprint menu (`DesignSystemHomeView` / `/document/design`), the two primary anchor sections:
     1. **Brand Colors** (`#brand-blueprint` / `BrandConceptBlueprint`: 01 Royal Blue `#0056FF`, 02 Azure Blue `#2277FF`, 03 Soft Lavender `#E3E7FC`, 04 White `#FFFFFF`, 05 Ice Tint `#EFF5FF`, and the SNPI International School Logo).
     2. **Color Ramps & Semantic Tokens** (`#color-ramps-tokens` / `ColorRampsTokens`: Brand primary, Accents, Neutral, and Status contrast-checked color ramps with AA/AAA filter modes).
   - MUST ALWAYS remain primary, top-level (index 01 and 02 in `SIDEBAR_TREE`), and permanently immutable. Under no circumstances should AI agents or developers modify, remove, hide, reorder, or replace these two core foundation sections. They are the permanent, authoritative visual anchor of the SNPI enterprise platform.
