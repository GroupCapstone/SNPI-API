---
name: github-well-architected-framework
description: >
  Comprehensive reference and implementation standard for the GitHub Well-Architected
  Framework covering all 7 pillars: Overview, Scenarios, Productivity, Collaboration,
  Application Security, Governance, and Architecture. Includes all child-page
  recommendations, checklists, trade-offs, and enforcement patterns applied to
  the SNP-SMS monorepo.
  Trigger on: "well-architected", "github governance", "actions allowlist",
  "rulesets best practices", "custom properties", "enterprise administration",
  "GHAS at scale", "agentic governance", "AI governance github".
source: https://learn.github.com/well-architected/
recorded: 2026-11-03
applies_to: Tan-Saphea/SNPI-SMS
---

# GitHub Well-Architected Framework — Full Reference

> [!IMPORTANT]
> This skill is the authoritative reference for GitHub platform governance,
> security, and architecture standards applied to SNP-SMS. Always read this
> before making any GitHub Actions, workflow, ruleset, or repository
> configuration changes.

## Framework Pillars Map

```
learn.github.com/well-architected/
├── Overview
│   ├── What is the Well-Architected Framework?
│   ├── Design Principles
│   └── Pillar Trade-off Matrix
├── Scenarios
│   ├── Enterprise Migration to GitHub
│   ├── SDLC Modernization
│   └── AI-Assisted Development Adoption
├── Productivity
│   ├── Developer Experience
│   ├── Codespaces & Dev Environments
│   ├── InnerSource & Reuse
│   └── Automation & Workflow Efficiency
├── Collaboration
│   ├── Code Review Standards
│   ├── Pull Request Governance
│   ├── Issue & Discussion Management
│   └── CODEOWNERS & Team Structure
├── Application Security
│   ├── GHAS at Scale
│   ├── Secret Scanning & Push Protection
│   ├── CodeQL & Code Scanning
│   ├── Dependency Review & Dependabot
│   └── Security Alert Prioritization
├── Governance
│   ├── Enterprise Administration
│   ├── Rulesets Best Practices
│   ├── Custom Properties Best Practices
│   ├── Actions Policy & Allowlist
│   └── AI & Agentic Governance
└── Architecture
    ├── Repository Architecture Strategy
    ├── Monorepo vs Polyrepo
    ├── Branching Strategy
    ├── Managing Large Repositories
    └── Resilience & Mirroring
```

---

## PILLAR 1: Overview

### What is the GitHub Well-Architected Framework?
A set of expert-driven, actionable design principles, recommendations, and
checklists for building secure, scalable, and governable software engineering
systems on GitHub. Modeled after AWS Well-Architected.

### Core Design Principles
1. **Least Privilege by Default** — Every token, workflow, and agent gets only
   the minimum permissions required for its task.
2. **Defense in Depth** — Multiple overlapping layers of security controls;
   no single point of failure in enforcement.
3. **Shift Security Left** — Security gates at PR level (CodeQL, dependency
   review, secret scanning) not just at release.
4. **Auditability Everywhere** — Every policy decision, merge, and deployment
   must be traceable in audit logs.
5. **Automate Compliance** — Enforce standards through automation (rulesets,
   required checks, OIDC) not manual process.
6. **Optimize for Developer Velocity** — Security and governance should
   accelerate, not block, developer flow.
7. **Treat AI as a Principal** — AI agents (Copilot, MCP clients) must be
   governed with the same rigor as human contributors.

### Pillar Trade-off Matrix

| Trade-off | Governance | Security | Productivity |
|-----------|-----------|----------|--------------|
| Strict rulesets | High | High | Medium (friction at PR) |
| Actions allowlist | High | High | Low (blocks new tools) |
| Required reviewers | High | Medium | Low (wait time) |
| OIDC over PATs | High | High | Medium (setup cost) |
| Codespaces standardization | Medium | High | High |

---

## PILLAR 2: Scenarios

### Enterprise Migration to GitHub
- Migrate from GitLab/Bitbucket/Azure DevOps using phased org strategy
- Establish enterprise hierarchy: Enterprise → Organizations → Repositories
- Map existing teams to GitHub Teams with inherited permissions
- Run parallel pipelines during transition; sunset legacy CI after validation

### SDLC Modernization
- Replace manual approval gates with required status checks
- Shift from branch-per-environment to environment-protection rules
- Introduce dependency review as a required PR gate
- Add SBOM generation to release workflows

### AI-Assisted Development Adoption
- Enable Copilot with organizational policy controls
- Define prompt injection boundaries via MCP server allowlists
- Audit Copilot usage through Enterprise audit log streaming
- Set AI credit budgets per business unit

---

## PILLAR 3: Productivity

### Developer Experience Principles
- **Standardized environments** via Codespaces devcontainer.json — zero
  "works on my machine" errors
- **Pre-commit hooks** enforced via `.pre-commit-config.yaml` (secret scanning,
  lint, format)
- **Reusable workflows** (`workflow_call`) shared across repositories reduce
  duplication and ensure consistent CI quality gates

### Codespaces & Dev Environments
- Define `devcontainer.json` at repo root with all tools pre-installed
- Use Codespaces Secrets for developer-scoped credentials (never in `.env`)
- Prebuild Codespaces for large repos to reduce spin-up time

### InnerSource & Reuse Patterns
- Tag repositories with `innersource` custom property for discoverability
- Use `CODEOWNERS` to auto-assign domain experts on cross-repo PRs
- Publish internal actions as versioned releases in a dedicated `actions-library` repo

### Automation & Workflow Efficiency
- Use `concurrency` groups on all workflows to cancel stale runs
- Enable workflow caching (`actions/cache`) for `node_modules`, pip, Go modules
- Use matrix strategies for parallel test sharding
- Set `timeout-minutes` on all jobs to prevent runaway billing

---

## PILLAR 4: Collaboration

### Code Review Standards
- **Required reviewers**: minimum 1 CODEOWNER approval for protected paths
- **Dismiss stale reviews**: enabled on all `main` branch protections
- **PR size limits**: recommended < 400 lines changed per PR (enforce via labeler)
- **Draft PR convention**: all WIP work stays as draft; only ready PRs trigger
  full CI

### Pull Request Governance
- PR templates in `.github/pull_request_template.md` with:
  - Linked issue reference
  - Testing checklist
  - Security impact assessment
  - Breaking change declaration
- Auto-labeler (`actions/labeler`) assigns area labels based on file paths
- Stale PR bot closes PRs with no activity after 30 days

### CODEOWNERS & Team Structure
```
# Example CODEOWNERS structure
/.github/            @org/platform-team
/apps/backend/       @org/backend-team
/apps/frontend/      @org/frontend-team
/packages/shared/    @org/backend-team @org/frontend-team
/docs/               @org/docs-team
```

### Issue & Discussion Management
- Issue templates for Bug, Feature Request, Security (private)
- Link issues to milestones and projects for roadmap tracking
- Use Discussions for architectural ADRs instead of Slack threads

---

## PILLAR 5: Application Security

> [!IMPORTANT]
> Full detail in [`enforce-ghas-at-scale`](../enforce-ghas-at-scale/SKILL.md)
> and [`github-repository-threat-model`](../github-repository-threat-model/SKILL.md).
> Summary here for cross-pillar reference.

### GHAS at Scale

#### Enable Order (Organization Level)
1. Secret Scanning + Push Protection — enable first, lowest noise
2. Dependency Review — block PRs with critical/high vulns
3. CodeQL Code Scanning — language-specific, higher setup cost
4. Security Campaigns — batch-remediate alert backlogs

#### Secret Scanning Configuration
```yaml
# .github/secret_scanning.yml
exemptions:
  - secret_type: generic_api_key
    paths:
      - "**/*.example"
      - "**/*.test.*"
```

#### CodeQL Best Practices
- Use `security-extended` query suite (not just `security-and-quality`)
- Add `continue-on-error: true` on analyze step to prevent blocking on
  false positives during ramp-up
- Pin `github/codeql-action` to SHA with version comment
- Schedule weekly scans (`cron: '30 2 * * 1'`) in addition to push triggers

#### Dependency Review Gate
```yaml
- uses: actions/dependency-review-action@SHA
  with:
    fail-on-severity: high
    deny-licenses: GPL-2.0, AGPL-3.0
    comment-summary-in-pr: always
```

#### Security Alert Prioritization (3-Step Model)
1. **GitHub Alert Metadata** — CodeQL severity, Secret validity, Dependabot
   EPSS score & dependency scope
2. **Repository Custom Properties** — Exposure (internet-facing?), Criticality
   (prod?), Compliance (regulated?)
3. **Time-Bound Campaigns** — SLA: Critical 24h, High 7d, Medium 30d, Low 90d

---

## PILLAR 6: Governance

### 6.1 Enterprise Administration

#### Hierarchy Design
```
GitHub Enterprise Cloud
└── Organization: Tan-Saphea (or org name)
    ├── Teams (role-based, not person-based)
    │   ├── @platform-team (admin)
    │   ├── @backend-team (write)
    │   ├── @frontend-team (write)
    │   └── @security-team (security manager)
    └── Repositories
        ├── SNPI-SMS (main monorepo)
        └── [future services]
```

#### Token & Permissions Governance
- **GITHUB_TOKEN default: `read-only`** — Set at org level:
  `Settings → Actions → Workflow permissions → Read repository contents`
- Each workflow explicitly grants only what it needs via `permissions:` block
- Use OIDC (`id-token: write`) instead of PATs for cloud provider auth
- Rotate any remaining PATs to Fine-Grained Tokens with repo/org scope limits

#### Audit Log Streaming
- Stream audit log to SIEM (Splunk, Datadog, or S3) for compliance
- Key events to alert on:
  - `repo.create`, `repo.delete`, `repo.transfer`
  - `org.invite_member`, `org.remove_member`
  - `protected_branch.create`, `protected_branch.destroy`
  - `workflow_run.completed` with `conclusion: failure`

---

### 6.2 Rulesets Best Practices

#### Phased Rollout Strategy
```
Phase 1: EVALUATE
  → Create ruleset in "evaluate" mode
  → Run for 2 weeks, collect bypass/violation data
  → Review with team; tune false positives

Phase 2: PILOT
  → Enable on non-critical repos first
  → Validate developer workflows are unblocked
  → Document expected bypass scenarios

Phase 3: EXPAND
  → Roll out to all repositories via org-level ruleset
  → Set bypass actors (platform-team only)
  → Monitor audit log for bypass events

Phase 4: ENFORCE
  → Switch to "active" enforcement
  → Remove broad bypass actors
  → Alert on any bypass via audit log
```

#### Recommended Ruleset Configuration
```json
{
  "name": "SNP-SMS Main Branch Protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_signatures" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": true,
        "allowed_merge_methods": ["squash"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "required_status_checks": [
          { "context": "Monorepo CI / Automated Test Suites" },
          { "context": "Code Quality & Lint / Code Quality & Lint" },
          { "context": "TypeScript Static Analysis / TypeScript Static Analysis" },
          { "context": "Security & Compliance Audit / Security & Vulnerability Audit" }
        ],
        "strict_required_status_checks_policy": true
      }
    },
    {
      "type": "required_deployments",
      "parameters": {
        "required_deployment_environments": []
      }
    }
  ],
  "bypass_actors": [
    {
      "actor_type": "Team",
      "actor_id": "<platform-team-id>",
      "bypass_mode": "pull_request"
    }
  ]
}
```

---

### 6.3 Custom Properties Best Practices

#### Standard Metadata Schema
Every repository in the enterprise should declare these custom properties:

| Property | Type | Values | Purpose |
|----------|------|--------|---------|
| `service-tier` | Single select | `critical`, `standard`, `experimental` | Alert prioritization SLA |
| `exposure` | Single select | `internet-facing`, `internal`, `offline` | Attack surface scoring |
| `compliance-scope` | Multi select | `gdpr`, `pci`, `hipaa`, `none` | Regulated data tagging |
| `team-owner` | String | team slug | Ownership routing |
| `deployment-target` | Single select | `production`, `staging`, `dev-only` | Environment gate control |
| `innersource` | Boolean | `true`/`false` | InnerSource discoverability |
| `has-ai-integration` | Boolean | `true`/`false` | AI governance tracking |

#### Using Custom Properties in Rulesets
Target rulesets to repositories by property:
```
Ruleset condition: repository property "service-tier" = "critical"
→ Enforce: required reviewers = 2, signed commits required
```

#### SNP-SMS Repository Property Values
```yaml
service-tier: critical
exposure: internet-facing
compliance-scope: [gdpr]
team-owner: snp-platform
deployment-target: production
innersource: false
has-ai-integration: true
```

---

### 6.4 Actions Policy & Allowlist

> [!IMPORTANT]
> This is the primary enforcement mechanism for supply chain security in CI/CD.
> GitHub Actions allowlist restricts which actions can run in your org/repo.

#### Policy Levels (Org → Repo hierarchy)
```
Enterprise policy (overrides all)
  └── Organization policy (overrides repo)
        └── Repository policy (most granular)
```

#### Allowlist Tiers

**Tier 1 — GitHub-owned actions (always safe)**
```
Allow: Actions by GitHub (github.com/actions/*)
Allow: Actions by GitHub Security (github.com/github/*)
```

**Tier 2 — Verified creator actions (marketplace verified)**
```
Allow verified creators only:
- docker/* (Docker Inc.)
- trufflesecurity/* (TruffleHog)
- codecov/* (Codecov)
```

**Tier 3 — Explicit SHA-pinned allowlist**
For any action outside Tier 1–2, explicitly pin and document:
```yaml
# .github/knowledge/ci-cd/actions-allowlist.md
actions/checkout@<SHA>          # v4.2.2 - GitHub
actions/setup-node@<SHA>        # v4.1.0 - GitHub
actions/cache@<SHA>             # v4 - GitHub
actions/upload-artifact@<SHA>   # v4 - GitHub
actions/download-artifact@<SHA> # v4 - GitHub
actions/dependency-review-action@<SHA>  # v4.5.0 - GitHub
actions/labeler@<SHA>           # v5.0.0 - GitHub
actions/stale@<SHA>             # v9.0.0 - GitHub
github/codeql-action/*@<SHA>    # v3 - GitHub Security
docker/build-push-action@<SHA>  # Docker Inc.
docker/setup-buildx-action@<SHA> # Docker Inc.
trufflesecurity/trufflehog@<SHA> # TruffleHog (Verified)
```

#### SHA Pinning Standard (MANDATORY)
```yaml
# CORRECT — SHA pinned with version comment
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

# WRONG — tag-pinned (mutable, can be hijacked)
- uses: actions/checkout@v4

# WRONG — unpinned (maximum risk)
- uses: actions/checkout@main
```

#### Automated SHA Freshness
- Use Dependabot to auto-update pinned SHAs:
```yaml
# .github/dependabot.yml
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    groups:
      github-actions:
        patterns: ["actions/*", "github/*"]
```

#### Org-Level Actions Policy Settings
Navigate to: `Org Settings → Actions → General → Actions permissions`

Recommended configuration:
```
[x] Allow all actions and reusable workflows created by GitHub
[x] Allow actions by Marketplace verified creators
[ ] Allow all actions  ← NEVER enable this
[x] Allow specific actions and reusable workflows:
    docker/build-push-action@*,
    docker/setup-buildx-action@*,
    trufflesecurity/trufflehog@*
```

#### Workflow Token Default Permission (MANDATORY)
`Org Settings → Actions → General → Workflow permissions`
```
[x] Read repository contents and packages permissions  ← set as DEFAULT
[ ] Read and write permissions  ← only grant explicitly per-workflow
[x] Allow GitHub Actions to create and approve pull requests  ← disable
```

#### Restricting `pull_request_target` (Critical)
`pull_request_target` has write access to the base repo even from forks.
Never use it with `actions/checkout` of PR head code:
```yaml
# DANGEROUS — do not do this
on: pull_request_target
steps:
  - uses: actions/checkout@SHA
    with:
      ref: ${{ github.event.pull_request.head.sha }}  # FORK CODE + WRITE ACCESS

# SAFE pattern — read-only checkout only
on: pull_request_target
permissions:
  contents: read
steps:
  - uses: actions/checkout@SHA  # checks out BASE, not fork
```

---

### 6.5 AI & Agentic Governance

#### Copilot Policy Controls (Org Level)
- Enable Copilot only for specific teams initially (pilot → expand)
- Disable Copilot suggestions for files containing secrets patterns
- Review Copilot suggested code in the same PR review flow
- Enable `copilot-instructions.md` for project-specific context injection

#### MCP Server Governance
- Maintain an explicit allowlist of approved MCP servers
- Each MCP server must have a documented trust boundary
- Audit MCP tool calls via GitHub audit log (agent activity events)
- Never allow MCP servers write access to production repositories

#### AI Credit Management
- Set spending caps per organization unit
- Alert at 80% of monthly budget threshold
- Review credit consumption weekly in first 90 days

#### Agentic Workflow Trust Taxonomy
```
Trust Level 1 — READ ONLY agents
  → Can: read code, search issues, comment on PRs
  → Cannot: push code, merge PRs, change settings

Trust Level 2 — WRITE agents (requires review)
  → Can: create PRs, push to feature branches
  → Cannot: merge without human approval, change branch protection

Trust Level 3 — ADMIN agents (platform-team only, explicit command-gate)
  → Can: update workflows, create releases
  → Cannot: modify org settings without audit trail
```

---

## PILLAR 7: Architecture

> [!IMPORTANT]
> Full detail in [`repository-architecture-strategy`](../repository-architecture-strategy/SKILL.md),
> [`polyrepo-github-architecture`](../polyrepo-github-architecture/SKILL.md), and
> [`managing-large-git-repositories`](../managing-large-git-repositories/SKILL.md).

### Repository Architecture Decision Tree
```
Single product with shared code?
  YES → Monorepo (npm workspaces / turborepo)
  NO  → Polyrepo with meta-repo manifest

< 5 services?
  YES → Monorepo first (simpler)
  NO  → Evaluate polyrepo for independent deploy velocity

Shared packages needed across repos?
  YES → Publish as versioned npm/pip packages
  NO  → Keep inline in monorepo

Multiple teams with independent release cycles?
  YES → Polyrepo with integration layer (meta-repo)
  NO  → Monorepo with CODEOWNERS-based ownership
```

### Branching Strategy (GitHub Flow — Recommended)
```
main (always deployable)
  ↑ squash merge
feature/TICKET-xxx  (short-lived, < 2 days ideal)
hotfix/TICKET-xxx   (from main, back to main)
```

- **No long-lived `develop` branch** — ship to main via feature flags
- **No `release/*` branches** — use GitHub Releases + tags instead
- **Delete branch after merge** — enforce via repo settings

### Managing Large Repositories
- Enable Git LFS for binary assets > 1MB
- Use sparse-checkout for teams working on subsystems
- Set `fetch-depth: 1` on CI checkouts (shallow clone)
- Archive stale repos after 12 months of inactivity

### Resilience & Mirroring
- Warm mirror in independent failure domain (different cloud provider)
- Mirror on schedule (every 4h) using deploy keys
- Test break-glass recovery quarterly
- Immutable SHA baseline for rollback

---

## SNP-SMS Applied Implementation

### Current Compliance Status

| Recommendation | Status | Notes |
|---|---|---|
| GITHUB_TOKEN default read-only | APPLIED | All workflows use `permissions: contents: read` |
| SHA-pinned actions | APPLIED | All 11 actions pinned to full SHA |
| CodeQL scanning | APPLIED | Weekly + push trigger |
| Secret scanning (TruffleHog) | APPLIED | `--only-verified --exclude-detectors=telegrambottoken` |
| Dependency review gate | APPLIED | Blocks `high+` vulns on PRs |
| Stale PR bot | APPLIED | `actions/stale` |
| Auto-labeler | APPLIED | `actions/labeler` |
| Concurrency groups | APPLIED | All workflows |
| Actions allowlist policy | PARTIAL | Dependabot SHA updates configured; org-level allowlist needs manual setup |
| Custom Properties metadata | TODO | Set via GitHub UI or API |
| Audit log streaming | TODO | Not yet configured |
| Rulesets (phased rollout) | TODO | Using legacy branch protection; migrate to rulesets |
| OIDC for cloud auth | APPLIED | `private-network-deploy.yml` uses `id-token: write` |
| Copilot instructions | APPLIED | `.github/copilot-instructions.md` exists |
| MCP governance | PARTIAL | `.github/agents/` exists; allowlist not formalized |

### Priority Action Items
1. **Migrate branch protection → Rulesets** (Governance 6.2)
2. **Set org-level Actions allowlist** (Governance 6.4) — org settings
3. **Configure Custom Repository Properties** (Governance 6.3) — via GitHub API
4. **Enable audit log streaming** (Governance 6.1) — requires GHEC plan
5. **Formalize MCP server allowlist** (Governance 6.5)

---

## Quick Reference: Actions Allowlist for SNP-SMS

All actions currently used in `.github/workflows/` — verified and approved:

| Action | Owner | SHA | Version | Allowlist Tier |
|--------|-------|-----|---------|----------------|
| `actions/checkout` | GitHub | `11bd719...` | v4.2.2 | Tier 1 |
| `actions/setup-node` | GitHub | `39370e3...` | v4.1.0 | Tier 1 |
| `actions/upload-artifact` | GitHub | `b4b15b8...` | v4 | Tier 1 |
| `actions/dependency-review-action` | GitHub | `3b139cf...` | v4.5.0 | Tier 1 |
| `actions/labeler` | GitHub | `8558fd7...` | v5.0.0 | Tier 1 |
| `actions/stale` | GitHub | `28ca103...` | v9.0.0 | Tier 1 |
| `github/codeql-action/init` | GitHub Security | `52cf185...` | bundle-v2.27.4 | Tier 1 |
| `github/codeql-action/analyze` | GitHub Security | `52cf185...` | bundle-v2.27.4 | Tier 1 |
| `docker/build-push-action` | Docker Inc. | `ca877d9...` | verified | Tier 2 |
| `docker/setup-buildx-action` | Docker Inc. | `6524bf6...` | verified | Tier 2 |
| `trufflesecurity/trufflehog` | TruffleHog | `ea68ca0...` | v3.99.8 | Tier 2 |
