# Security Audit & Remediation Report

**Project**: SNP-SMS (SNPI-SMS Full-Stack TypeScript Monorepo)  
**Report Date**: 2026-11-01  
**Auditor**: Antigravity Security Automation  
**Repository**: `shiliaiwei/SNPI-SMS`  
**Status**: RESOLVED (0 Vulnerabilities)

---

## 1. Executive Summary

A routine automated security audit detected three moderate-severity Dependabot alerts across the repository's dependency lockfiles, originating from `minimatch < 11.0.1` (transitive dependency of ESLint and TypeScript-ESLint). All three alerts have been patched, aligned to `minimatch@11.0.3`, verified via zero-vulnerability audit scans across all workspaces, and permanently recorded.

---

## 2. Vulnerability Details

| Alert ID | Ecosystem | Manifest Location                 | Package     | Vulnerable Range | Severity | Advisory ID         | CVE             |
| -------- | --------- | --------------------------------- | ----------- | ---------------- | -------- | ------------------- | --------------- |
| **#1**   | npm       | `apps/backend/package-lock.json`  | `minimatch` | `< 11.0.1`       | Moderate | GHSA-g3hv-75wg-m249 | CVE-2026-118764 |
| **#2**   | npm       | `apps/frontend/package-lock.json` | `minimatch` | `< 11.0.1`       | Moderate | GHSA-g3hv-75wg-m249 | CVE-2026-118764 |
| **#3**   | npm       | `package-lock.json` (root)        | `minimatch` | `< 11.0.1`       | Moderate | GHSA-g3hv-75wg-m249 | CVE-2026-118764 |

### Vulnerability Impact

- **Type**: Asymmetric Resource Consumption (Amplification) / Regular Expression Denial of Service (ReDoS) via Globparts Amplification (CWE-405).
- **Mechanism**: Attacker-supplied glob patterns triggered uncontrolled growth in `firstPhasePreProcess()` under optimization levels `>= 2`, leading to quadratic second-phase processing and CPU/memory exhaustion.
- **Affected Subsystems**: Development toolchain (ESLint linting rules, TypeScript AST traversal, file globbing). Production runtime was not directly exposed, but development and CI/CD pipelines were vulnerable.

---

## 3. Remediation Strategy & Implementation

### 3.1 Direct Workspace Override

Added a top-level dependency override in [package.json](file:///Users/Apple16/Desktop/SNP-SMS/package.json) to guarantee that all direct and transitive references across both `apps/` and `packages/` resolve to the secure upstream release:

```json
{
  "devDependencies": {
    "minimatch": "11.0.3"
  },
  "overrides": {
    "minimatch": "$minimatch"
  }
}
```

### 3.2 Lockfile Synchronization

Reconciled and updated all three lockfiles to `minimatch@11.0.3` along with its required companion dependency `@isaacs/nonrecursive-glob-match@1.0.3`:

1. [package-lock.json](file:///Users/Apple16/Desktop/SNP-SMS/package-lock.json) (Root monorepo lockfile)
2. [apps/backend/package-lock.json](file:///Users/Apple16/Desktop/SNP-SMS/apps/backend/package-lock.json) (Backend container lockfile)
3. [apps/frontend/package-lock.json](file:///Users/Apple16/Desktop/SNP-SMS/apps/frontend/package-lock.json) (Frontend container lockfile)

### 3.3 Physical Node Modules Alignment

Synchronized physical binary resolution across:

- `node_modules/minimatch` (v11.0.3)
- `apps/backend/node_modules/minimatch` (v11.0.3)
- `apps/frontend/node_modules/minimatch` (v11.0.3)

---

## 4. Verification & Quality Gates

| Verification Gate   | Execution Command               | Result | Details                                  |
| ------------------- | ------------------------------- | ------ | ---------------------------------------- |
| Root Audit          | `npm audit`                     | PASS   | `found 0 vulnerabilities`                |
| Backend Audit       | `cd apps/backend && npm audit`  | PASS   | `found 0 vulnerabilities`                |
| Frontend Audit      | `cd apps/frontend && npm audit` | PASS   | `found 0 vulnerabilities`                |
| TypeScript Compiler | `npm run typecheck`             | PASS   | 0 errors across 3 workspaces             |
| ESLint Verification | `npm run lint`                  | PASS   | 0 errors across backend & frontend       |
| Smoke End-to-End    | `npm run smoke`                 | PASS   | 100% PASS (RBAC, API health, workspaces) |

---

## 5. Security Audit Log History

| Date       | Release | Advisory                              | Action Taken                                                                       | Auditor        |
| ---------- | ------- | ------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| 2026-11-01 | v0.2.13 | GHSA-g3hv-75wg-m249 (CVE-2026-118764) | Overrode `minimatch` to 11.0.3 across all 3 lockfiles; verified 0 vulnerabilities. | Antigravity AI |
