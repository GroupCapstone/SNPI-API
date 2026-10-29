---
name: snp-sms-push-checkpoint-workflow
description: >-
  Mandatory GitHub push and checkpoint protocol for the SNP-SMS monorepo.
  Executes automated formatting, typechecking, smoke verification, real-time
  changelog sync, and release checkpoint tagging before pushing commits to GitHub.
  Trigger on: "push", "git push", "push now", "checkpoint", "release checkpoint", "publish".
---

# SNP-SMS GitHub Push & Checkpoint Workflow

This skill defines the mandatory protocol that every agent and contributor must execute whenever commanded to push, publish, or checkpoint code to GitHub.

---

## 1. Core Rule & Execution Gate

* **Never Push Blindly**: A push command must NEVER execute a raw `git push` without first running the standard verification pipeline and synchronizing the changelog.
* **Explicit User Command Required**: Pushes are only triggered when the user explicitly commands `push`, `push now`, `publish`, or creates a release checkpoint.
* **Checkpoint Tagging Standard**: Tag release checkpoints using semantic versioning (`v0.1.x`) with descriptive release annotations.
* **Zero Emojis**: All commit messages, tags, summaries, and agent responses must strictly avoid emojis. Use textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.

---

## 2. 7-Step Checkpoint & Push Pipeline

Whenever the user instructs to push or checkpoint, execute the following steps in sequence:

### Step 1: Code Formatting Audit
```bash
npm run format:check
```
Assert that Prettier validates all matched files without syntax or style issues. If unformatted, run `npm run format`.

### Step 2: TypeScript Static Analysis
```bash
npm run typecheck
```
Assert zero TypeScript errors across `apps/backend`, `apps/frontend`, and `packages/shared`.

### Step 3: Smoke & Live API Verification
```bash
# 1. Verify workspace resolution, database container, and core endpoints
npm run smoke

# 2. Verify all 47 domain modules respond HTTP 200 OK
npm run test:api
```

### Step 4: Real-Time Changelog Synchronization
```bash
npm run changelog:sync
```
Captures recent commits into both `CHANGELOG.md` and the live developer technical document portal at `apps/frontend/features/document/changelog-data.ts`. Stage and commit these updates if new entries were generated.

### Step 5: Checkpoint Version Tagging (For Milestone / Release Pushes)
Determine the next patch version based on `package.json` and git tags:
```bash
# Example for tagging release checkpoint
git tag -a v0.1.1 -m "Release Checkpoint v0.1.1: <Summary of milestone capabilities>"
```

### Step 6: GitHub Remote Push
Ensure large media buffer configuration is active and push commits along with release tags:
```bash
git config http.postBuffer 524288000
git push origin <branch> --tags
```

### Step 7: CI/CD Pipeline Verification
Confirm that GitHub Actions workflows are triggered and monitor run progress:
```bash
gh run list --limit 3
```

---

## 3. Operational Reference Table

| Step | Command | Success Criteria |
| :--- | :--- | :--- |
| **1. Formatting** | `npm run format:check` | All matched files use Prettier code style |
| **2. Typecheck** | `npm run typecheck` | 0 Errors across all workspaces |
| **3. Smoke Test** | `npm run smoke` | 4/4 Checks Passed |
| **4. Live API Test** | `npm run test:api` | 56/56 Endpoints HTTP 200 OK |
| **5. Changelog** | `npm run changelog:sync` | Live document & CHANGELOG.md updated |
| **6. Checkpoint** | `git tag -a <version> -m "..."` | Annotated release tag created |
| **7. Remote Push** | `git push origin main --tags` | Commits & tags pushed to GitHub |
| **8. CI Verification**| `gh run list` | Workflow triggered and running clean |
