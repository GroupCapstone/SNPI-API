---
name: polyrepo-github-architecture
description: Authoritative enterprise operating model for polyrepo engineering on GitHub. Covers integration layer (meta-repo) manifest validation, cross-repo change sets (CHG-XXXX), 4 branching & merge coordination models, reusable workflow governance, decoupled system releases, GHAS security campaigns, and orchestrator/executor automation.
---

# Enterprise Polyrepo GitHub Architecture & Operating Model

> Authoritative enterprise operating specification for multi-repository software development on GitHub Enterprise Cloud (GHEC/EMU). Provides a structured framework to maintain service autonomy while eliminating cross-repo coordination fragility.

---

## 1. Architectural Foundations & Invariants

```
               [ Enterprise Integration Meta-Repo ]
                     (Manifest: release.yaml)
           +--------------------+--------------------+
           |                    |                    |
           v                    v                    v
  [ auth-service ]       [ billing-api ]     [ web-frontend ]
    (Repo-Scoped)          (Repo-Scoped)       (Repo-Scoped)
           |                    |                    |
           +--------------------+--------------------+
                                |
               [ Central Reusable Workflows Repo ]
              (Semantic Versioning: @v1, @v1.2.3)
```

1. **Composition Boundary Separation**: Component repositories contain application business logic. The integration repository (meta-repo) strictly contains composition manifests (`release.yaml`), integration/contract test suites, and system-level release tagging. **Never put application code into the meta-repo.**
2. **Change Set Traceability**: Cross-repo changes must be indexed by a unique change set ID (`CHG-XXXX`). The parent tracking issue lives in the integration repository; child issues live in impacted component repositories.
3. **Explicit Merge Coordination**: Polyrepo merges cannot be assumed atomic. Every cross-repo change must use one of the 4 defined coordination patterns based on risk.
4. **Platform Workflow Contracts**: Centralized CI/CD workflows in a shared workflow repo are versioned platform products governed by `CODEOWNERS`, rulesets, and semantic versioning (`@v1`, `@v1.2.3`).
5. **Decoupled Releases**: Individual component releases (`v1.8.2`) are decoupled from composite system releases (`system-2026.03.01`).
6. **Zero Floating Refs in Production**: Production manifests and workflow calls must never target floating branches (`@main`, `@master`, `@latest`). Always pin to immutable tags or SHAs.

---

## 2. Nine-Point Polyrepo Audit & Governance Checklist

| # | Domain | Policy Requirement | Verification Command / Check |
| :- | :--- | :--- | :--- |
| **01** | **Integration Repo** | Manifest-driven repo mapping components to immutable refs | `release.yaml` validated against schema |
| **02** | **Change Management** | Parent tracking issue (`CHG-XXXX`) with linked child issues | GitHub Projects change set board active |
| **03** | **Branching Model** | Consistent branch prefixes (`changeset/CHG-XXXX/...`) | Protected branches enforced via Rulesets |
| **04** | **Reusable Workflows**| Shared workflows versioned via semver with input schemas | Pinning policy to `@vN` or `@vN.N.N` |
| **05** | **Release Governance**| Component tags decoupled from system release BOM | System manifest tags cut in integration repo |
| **06** | **Workflow Telemetry**| Workflows emit structured telemetry (actor, duration, SHA) | Observability dashboard ingest verified |
| **07** | **Security Campaigns**| GHAS code scanning, Dependabot & secret alerts tracked | Alert-to-issue deduplication & SLA sync |
| **08** | **Orchestration** | Orchestrator/executor pattern with GitHub App auth | Least-privilege scoped permissions (no PATs) |
| **09** | **Pinning Policy** | Zero floating refs in release paths | Manifest validation script exit code 0 |

---

## 3. Four Branching & Merge Coordination Models

```
Option 1: Integration Branch (Release Train)
  auth-service:    main <--- integration/CHG-1042-auth-v3 (PR #1)
  billing-api:     main <--- integration/CHG-1042-auth-v3 (PR #2)
  web-frontend:    main <--- integration/CHG-1042-auth-v3 (PR #3)
  Integration CI validates combined state -> Promotes provider first, then consumers.

Option 2: Meta-Repo Manifest (Lockfile Driven)
  billing-api:     PR #87 merges -> Bot opens PR in integration repo updating release.yaml
  Integration CI validates all repos at pinned SHAs -> Merges and cuts system release.

Option 3: Versioned Artifacts (Decoupled Consumer/Producer)
  auth-service:    Publishes container image ghcr.io/org/auth-service:v2.5.0
  web-frontend:    Dependabot opens version-bump PR -> Team reviews & merges independently.

Option 4: Linked PRs with Merge Gating (Lightweight)
  auth-service:    PR #42 (label: changeset:CHG-1099)
  billing-api:     PR #87 (label: changeset:CHG-1099)
  Required status check verifies all linked PRs approved -> Bot merges in strict order.
```

### Model Selection Decision Matrix

| Change Type | Recommended Model | Rationale |
| :--- | :--- | :--- |
| **Breaking API / Contract** | Option 1 (Integration Branch) or Option 2 (Meta-Repo Manifest) | Maximum pre-merge correctness guarantees across all tiers |
| **Routine Dependencies** | Option 3 (Versioned Artifacts) | Complete decoupling; independent team velocity |
| **Shared Config / Minor Update** | Option 4 (Linked PRs + Merge Gating) | Lowest process overhead with automated order enforcement |

---

## 4. Reusable Workflow Platform Specification

Shared workflows must reside in a dedicated platform repository (e.g., `org/workflows` or `org/.github`) and adhere to the contract standard:

```yaml
# Calling pattern from component repo
jobs:
  validate:
    uses: org/shared-workflows/.github/workflows/component-ci.yml@v1
    with:
      node-version: "22"
      run-tests: true
    secrets: inherit
```

### Telemetry Dashboard Data Feeds:
1. **Inventory**: Workflow references across all repositories (identifying drift and unmigrated major versions).
2. **Runtime Metrics**:
   * Caller repository and workflow path
   * Reusable workflow version/tag/SHA
   * Run ID, execution status, duration, actor
   * Failure rates and p50/p95 latency trends

---

## 5. Security Campaigns & GHAS Orchestration

When remediation involves dozens of component repositories:
1. **System of Record**: GitHub Advanced Security (GHAS) code scanning, Dependabot alerts, secret scanning.
2. **Alert-to-Issue Sync**: Filter by severity (Critical / High), deduplicate by alert ID, and automatically link to parent security campaign issues.
3. **Execution Guardrails**:
   * Automation must execute via GitHub App installation tokens, never personal access tokens.
   * Repository rulesets and `CODEOWNERS` must remain active against automated execution.
   * Rate limits and phased batch rollouts to prevent compute exhaustion.

---

## 6. Primary Reference & Artifact Manifests

* **Authoritative Article Reference**: [`references/polyrepo-github-article.md`](file:///Users/Apple16/.gemini/config/skills/polyrepo-github-architecture/references/polyrepo-github-article.md)
* **Integration Manifest Template**: [`templates/release-manifest-template.yaml`](file:///Users/Apple16/.gemini/config/skills/polyrepo-github-architecture/templates/release-manifest-template.yaml)
* **Parent Change Set Template**: [`templates/changeset-parent-issue-template.md`](file:///Users/Apple16/.gemini/config/skills/polyrepo-github-architecture/templates/changeset-parent-issue-template.md)
* **Child Issue Template**: [`templates/changeset-child-issue-template.md`](file:///Users/Apple16/.gemini/config/skills/polyrepo-github-architecture/templates/changeset-child-issue-template.md)
* **Reusable Workflow Template**: [`templates/reusable-workflow-template.yml`](file:///Users/Apple16/.gemini/config/skills/polyrepo-github-architecture/templates/reusable-workflow-template.yml)
* **Manifest Validation Script**: [`scripts/validate-polyrepo-manifest.ts`](file:///Users/Apple16/.gemini/config/skills/polyrepo-github-architecture/scripts/validate-polyrepo-manifest.ts)
