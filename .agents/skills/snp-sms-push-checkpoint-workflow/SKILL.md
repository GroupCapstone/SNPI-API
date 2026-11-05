---
name: snp-sms-push-checkpoint-workflow
description: >-
  Authoritative GitHub push, polyrepo organization sync, pre-push verification, and equal collaborator permission protocol for SNPI-API and SNPI-Web.
  Enforces in-project build isolation, differentiated commit messages, independent tracking, equal organization admin permissions under ytivargitna, and zero-emoji policy.
  Trigger on: "push", "git push", "push now", "checkpoint", "release checkpoint", "publish".
---

# SNPI Polyrepo GitHub Push & Organization Checkpoint Workflow

This skill defines the authoritative, mandatory protocol that every agent and contributor must execute whenever commanded to push, publish, or checkpoint code to GitHub across the SNPI polyrepo workspace.

---

## 1. Organization Topology & Equal Ownership

Both repositories are hosted under the shared GitHub Organization **`GroupCapstone`**, where both `shiliaiwei` and `Tan-Saphea` hold equal **Organization Admin** rights:

* **Backend (`SNPI-API`)**:
  * Dedicated Headless REST API (Express 5, TypeScript, MongoDB Replica Set `rs0`, 7-layer modular monolith).
  * Primary Remote (`origin`): `https://github.com/GroupCapstone/SNPI-API.git` (tracked on `main -> origin/main`).
  * Secondary Remotes: `personal` (`shiliaiwei/SNPI-API.git`), `ytivargitna` (`ytivargitna/SNPI-API.git`), `upstream` (`Tan-Saphea/SNPI-SMS.git`).
  * Organization Permissions: Equal Admin (`shiliaiwei` & `Tan-Saphea`).

* **Frontend Web Portal (`SNPI-Web`)**:
  * Next.js 16 Web Portal & Integrated Nextra Docs (React 19, Tailwind CSS 4, Radix UI).
  * Primary Remote (`origin`): `https://github.com/GroupCapstone/SNPI-Web.git` (tracked on `main -> origin/main`).
  * Secondary Remote: `personal` (`shiliaiwei/SNPI-Web.git`).
  * Organization Permissions: Equal Admin (`shiliaiwei` & `Tan-Saphea`).

---

## 2. In-Project Boundary & Execution Rules

1. **Strict In-Project Writes**:
   * All file edits, test scripts, and build artifacts MUST be self-contained in the target project folder (`SNPI-API` or `SNPI-Web`).
   * **Zero Root Pollution**: Never create files in `/Users/Apple16/Desktop/SNPI/`.
   * **Zero Cross-Contamination**: Never place API code in `SNPI-Web` or frontend code in `SNPI-API`.

2. **Differentiated Commit Messages**:
   * `SNPI-API`: Strictly prefixed with `(api)` or `(api/<scope>)` (e.g. `feat(api): ...`, `fix(api): ...`, `docs(api): ...`).
   * `SNPI-Web`: Strictly prefixed with `(web)` or `(web/<scope>)` (e.g. `feat(web): ...`, `fix(web): ...`, `docs(web): ...`).
   * Commits must NEVER share identical or generic commit messages across repositories.

3. **Strict Zero Emojis**:
   * Never use emojis in code, comments, commit messages, PR descriptions, or agent responses. Use textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.

4. **Explicit User Command Required**:
   * Never execute `git push` without an explicit user command (`push`, `git push`, `publish`).

---

## 3. Pre-Push Verification Pipeline

Before executing any push, run the target project's quality gates:

### For Backend (`SNPI-API`):
```bash
cd /Users/Apple16/Desktop/SNPI/SNPI-API

# 1. TypeScript static analysis (0 errors required)
npm run typecheck

# 2. Build verification (outputs strictly contained in dist/)
npm run build
```

### For Frontend Web (`SNPI-Web`):
```bash
cd /Users/Apple16/Desktop/SNPI/SNPI-Web

# 1. TypeScript static analysis (0 errors required)
npm run typecheck

# 2. Production build verification (outputs contained in .next/)
npm run build
```

---

## 4. Remote Push Execution Protocol

Once quality gates pass, execute remote synchronization to the `GroupCapstone` organization:

```bash
# Set large buffer to prevent RPC push failures
git config http.postBuffer 524288000

# Push main branch to organization origin
git push origin main
```

---

## 5. Operational Summary Table

| Scope | Project Folder | Primary GitHub Remote (Org) | Commit Prefix | Permissions | Verification Gates |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend API** | `SNPI-API/` | `GroupCapstone/SNPI-API` | `(api)` / `(api/<scope>)` | Org Admin (`shiliaiwei` / `Tan-Saphea`) | `npm run format:check` + `npm run lint` + `npm run typecheck` + `npm run build` |
| **Frontend Web** | `SNPI-Web/` | `GroupCapstone/SNPI-Web` | `(web)` / `(web/<scope>)` | Org Admin (`shiliaiwei` / `Tan-Saphea`) | `npm run format:check` + `npm run lint` + `npm run typecheck` + `npm run build` |

---

## 6. Mandatory Post-Push GitHub Actions & Vercel Verification Gate (100% Green)

Every remote push MUST follow the strict sequential pipeline: **Push to GitHub First -> Watch CI Until 100% Green -> Deploy to Vercel Production**:

1. **Pre-Push Fast Quality Gate Enforcement**:
   - `npm run format:check` (Prettier code style compliance).
   - `npm run lint` (ESLint 0 errors).
   - `npm run typecheck` (TypeScript 0 errors).
   - `npm run build` (Production compilation 0 errors).
   - `npm run git:sync` (Dual-developer reconciliation).

2. **Push to GitHub FIRST**:
   - Push commits and release tags to GitHub remote `origin/main`:
     ```bash
     git push origin main --tags
     ```

3. **Active Remote CI Monitoring Until 100% Green (Optimized Fast Polling)**:
   - Actively query GitHub Actions runs for the pushed commit SHA using fast 3.5s polling:
     ```bash
     gh run list -R GroupCapstone/SNPI-API --commit <HEAD_SHA>
     ```
   - All triggered workflows (Code Quality & Lint, Monorepo CI, Automated Test Suites, Test Coverage, CodeQL Analysis, Deployment Verification, Docker Container Build, Blockchain & Ledger Integrity, Secret Scanning, License Compliance, etc.) must reach completed `[success / PASSED]`.
   - Never proceed to Vercel deployment if any workflow fails.

4. **Deploy to Vercel Production AFTER CI Green**:
   - ONLY after GitHub Actions CI is 100% green and successful, deploy directly to Vercel production:
     ```bash
     npx vercel --prod
     ```

5. **Automated Failure Diagnosis & Self-Healing**:
   - If any workflow fails, immediately inspect the failure logs:
     ```bash
     gh run view <RUN_ID> -R GroupCapstone/SNPI-API --log-failed
     ```
   - Diagnose the root cause, apply the fix locally, re-run format/lint/typecheck, commit with differentiated prefix, push, and resume monitoring until 100% green.

6. **Live Production Smoke Verification**:
   - Probe live production domain (`https://api.kesararamwithdigital.tech/api/v1/health`) to confirm that the deployed build is active and serving traffic.

