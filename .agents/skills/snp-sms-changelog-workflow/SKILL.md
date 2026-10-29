---
name: snp-sms-changelog-workflow
description: >-
  Mandatory real-time changelog synchronization workflow for the SNP-SMS monorepo.
  Requires updating CHANGELOG.md and the live developer document portal (/document)
  on every skill update, architecture change, or commit.
---

# SNP-SMS Changelog Workflow Standard

This skill establishes the mandatory workflow for recording skill updates, API contract modifications, and code commits in real-time to the developer document portal.

---

## 1. Core Rule & Objective

* **Always Record Changes**: Every time a skill is modified, an API endpoint is added/altered, or a commit is prepared, the changelog must be updated immediately so the development team and external partners can track progress in real-time.
* **Dual Output Synchronization**:
  1. **Live Technical Document**: [`apps/frontend/features/document/changelog-data.ts`](file:///Users/Apple16/Desktop/SNP-SMS/apps/frontend/features/document/changelog-data.ts), displayed on [`/document`](http://localhost:3000/document).
  2. **Root Repository Log**: [`CHANGELOG.md`](file:///Users/Apple16/Desktop/SNP-SMS/CHANGELOG.md).

---

## 2. Automated Sync Command

Run the synchronization script directly from the root of the monorepo:

```bash
# Extract recent git commits and update both the Document portal and CHANGELOG.md
npm run changelog:sync
```

---

## 3. Workflow Steps for Every Commit & Skill Update

1. **Implement & Test**: Write code, update models/endpoints, or refine agent skills.
2. **Run Verification**: Ensure `npm run typecheck` and `npm run test:api` pass.
3. **Sync Changelog**:
   ```bash
   npm run changelog:sync
   ```
4. **Stage & Commit**:
   ```bash
   git add CHANGELOG.md apps/frontend/features/document/changelog-data.ts ...
   git commit -m "<type>(<scope>): <concise message>"
   ```
5. **Real-Time Verification**:
   Inspect [`http://localhost:3000/document`](http://localhost:3000/document) under the **Change Logs** section to confirm the latest version, date, and commit hash are live.
