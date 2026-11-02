---
name: snp-sms-push-checkpoint-workflow
description: >-
  Mandatory GitHub push, dual-developer sync, checkpoint release, and live CI verification protocol for the SNP-SMS monorepo.
  Executes automated formatting, full ESLint quality gate, typechecking, smoke verification, real-time
  changelog sync, release checkpoint tagging, remote push, and automated live GitHub Actions CI monitoring until 100% green.
  Trigger on: "push", "git push", "push now", "checkpoint", "release checkpoint", "publish".
---

# SNP-SMS GitHub Push, Checkpoint & CI Verification Workflow

This skill defines the authoritative, mandatory protocol that every agent and contributor must execute whenever commanded to push, publish, or checkpoint code to GitHub.

---

## 1. Core Rule & Execution Gate

* **One-Command Automated Execution (`npm run push:checkpoint`)**: Whenever the user commands to push or publish, run the all-in-one automated verification and push pipeline: `npm run push:checkpoint`.
* **Mandatory Dual-Developer Git Reconciliation Gate (`npm run git:sync`)**: We have two active developers committing to this repository. Before pushing any code, release tag, or checkpoint, the system must **ALWAYS run `npm run git:sync`** (`git fetch origin` and `git merge origin/<branch> --no-edit`). If the other developer has pushed new code to remote, merge all incoming changes into the local working tree first. Never overwrite, discard, or force-push over collaborator commits.
* **Mandatory Local-Only Commits & Zero Remote Push Without Explicit Command**: In every conversation, session, and task, AI agents and contributors are strictly permitted to make local git commits only. Remote `git push` is strictly prohibited under all circumstances unless the user gives an explicit, direct command.
* **Never Push Blindly**: A push command must NEVER execute a raw `git push` without first running the standard verification pipeline (format, lint, typecheck, smoke, build), remote sync reconciliation, and synchronizing the changelog.
* **Mandatory Pre-Push CI & Deploy Quality Gate**: If any GitHub deployment or CI workflow is failed on `main`, pushing new commits, tags, or checkpoints is STRICTLY FORBIDDEN.
* **Mandatory Post-Push Live CI Monitoring Until 100% Green**: Every push must trigger the automated live CI watcher (`npm run push:verify` or the integrated watcher in `npm run push:checkpoint`). The system MUST actively poll GitHub Actions (`gh run list --commit <SHA>`) and wait until all workflows reach completed `[PASSED]` status. If any check fails, immediately extract the failing logs and report the exact error.
* **Zero Emojis**: All commit messages, tags, summaries, and agent responses must strictly avoid emojis. Use textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.

---

## 2. 10-Step Automated Checkpoint & Push Pipeline

Execute `npm run push:checkpoint` to run all 10 steps automatically:

### Step 1: Code Formatting Audit & Auto-Fix
```bash
npm run format:check || npm run format
```
Asserts that Prettier validates all matched files without syntax or style issues. Automatically formats code if differences exist.

### Step 2: Full ESLint Quality Gate
```bash
npm run lint
```
Asserts zero ESLint errors across all packages and apps. Crucial gate that stops JSX, syntax, and typing violations before remote push.

### Step 3: TypeScript Static Analysis
```bash
npm run typecheck
```
Asserts zero TypeScript errors across `apps/backend`, `apps/frontend`, and `packages/shared`.

### Step 4: Monorepo Smoke Tests
```bash
npm run smoke
```
Verifies workspace package resolution, MongoDB replica set health, and core API responses.

### Step 5: Pre-Push Deployment & CI Quality Gate
```bash
npm run deploy:verify
```
Asserts that all deployment manifests exist (`vercel.json`, Kubernetes configs), production builds compile with zero errors, and recent GitHub workflows on `main` are green.

### Step 6: Dual-Developer Git Reconciliation & Merge Gate
```bash
npm run git:sync
```
Fetches remote changes from `origin/<branch>` and merges incoming commits from the other developer into the local tree (`git merge origin/<branch> --no-edit`). Resolves non-conflicting divergent branches cleanly.

### Step 7: Real-Time Changelog Synchronization
```bash
npm run changelog:sync
```
Captures recent commits into both `CHANGELOG.md` and the live developer technical document portal at `apps/frontend/features/document/changelog-data.ts`.

### Step 8: Working Tree Inspection, Commit & Release Checkpoint Tagging
```bash
git add -A && git commit -m "..."
git tag -a v0.2.x -m "Release Checkpoint v0.2.x: <Summary of capabilities> [PASSED]"
```
Auto-increments the semantic patch version and tags the commit with a clean descriptive checkpoint note.

### Step 9: GitHub Remote Push
```bash
git config http.postBuffer 524288000
git push origin <branch> --tags
```
Pushes all commits and annotated release tags over HTTPS with an expanded 500MB buffer.

### Step 10: Live CI/CD Pipeline Monitoring & Automated Green Waiter
```bash
npm run push:verify
# or automatically executed via npm run push:checkpoint
```
Polls `gh run list --commit <SHA>` every 10 seconds. Streams live workflow progress and waits until all triggered GitHub Actions runs reach completed and 100% green (`[PASSED]`). If any workflow fails, automatically fetches and dumps the failed logs (`gh run view <ID> --log-failed`).

---

## 3. Operational Reference Table

| Step | Command | Success Criteria |
| :--- | :--- | :--- |
| **1. Formatting** | `npm run format:check` | All matched files Prettier compliant |
| **2. ESLint Quality** | `npm run lint` | 0 ESLint errors across workspaces |
| **3. Typecheck** | `npm run typecheck` | 0 TypeScript errors across monorepo |
| **4. Smoke Test** | `npm run smoke` | Core API & database checks passed |
| **5. Deploy Gate** | `npm run deploy:verify` | Manifests valid, production build passes |
| **6. Dual-Dev Sync** | `npm run git:sync` | Remote commits cleanly merged |
| **7. Changelog** | `npm run changelog:sync` | Developer portal & CHANGELOG.md updated |
| **8. Checkpoint** | `git tag -a <version>` | Annotated release checkpoint created |
| **9. Remote Push** | `git push origin main --tags` | Commits & tags pushed to GitHub |
| **10. Live CI Monitor** | `npm run push:verify` | All GitHub Actions runs completed & 100% green |
| **4. Live API Test** | `npm run test:api` | 56/56 Endpoints HTTP 200 OK |
| **5. Deploy Gate** | `npm run deploy:verify` | Manifests valid, build passes, 0 CI failures |
| **6. Changelog** | `npm run changelog:sync` | Live document & CHANGELOG.md updated |
| **7. Dual-Dev Sync** | `npm run git:sync` | Remote code from 2nd dev fetched & merged |
| **8. Checkpoint** | `git tag -a <version> -m "..."` | Annotated release tag created |
| **9. Remote Push** | `git push origin main --tags` | Commits & tags pushed to GitHub |
| **10. CI Monitor** | `gh run list --limit 15` | All triggered workflows passing green |
