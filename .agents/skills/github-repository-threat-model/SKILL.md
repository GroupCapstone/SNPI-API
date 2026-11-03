---
name: github-repository-threat-model
description: Authoritative enterprise operational guide and threat modeling specification for GitHub repositories based on SLSA v1.0 Source Integrity and GitHub Well-Architected Framework. Covers threat actors, the 8 primary threat vectors (T-01 through T-08), danger zone governance, ruleset enforcement, and automated repository threat auditing.
---

# GitHub Repositories Threat Model & Source Defense Standard

Authoritative enterprise operational guide and infrastructure specification for threat modeling and securing source code repositories across their lifecycle. Based on the **GitHub Well-Architected Framework** and **SLSA (Supply-Chain Levels for Software Artifacts) Threat Model v1.0 (Source Integrity)**.

---

## 1. Scope & Framework Alignment

Source code repositories are prime targets for threat actors seeking to pivot into cloud production environments, exfiltrate IP, or inject malicious code into software supply chains.

```
+---------------------------------------------------------------------------------------+
| SLSA v1.0 Source Integrity Perimeter                                                  |
|                                                                                       |
|  [Developer Workstation] --(SSH / PAT / Web)--> [GitHub Repository Boundary]          |
|                                                    |                                  |
|         +------------------------------------------+----------------------------+     |
|         |                     Trust Boundaries & Defenses                       |     |
|         |                                                                       |     |
|         |  T-01: Secret Leakage       --> Secret Scanning & Push Protection     |     |
|         |  T-02: Unauthorized Read    --> Private Visibility, EMU, IP Allow     |     |
|         |  T-03: Danger Zone Tamper   --> Org Admin Gate, Transfer Block        |     |
|         |  T-04: History Tampering    --> Ruleset: Block Force Push & Deletion  |     |
|         |  T-05: Unauthorized Merge   --> Required Status Checks & Linear Tree  |     |
|         |  T-06: Self-Approval Bypass --> 2-Person Review Gate, Zero Self-Merge |     |
|         |  T-07: Account Compromise   --> Enforced 2FA, SAML SSO, Commit Sign   |     |
|         |  T-08: Workflow Exploits    --> Action SHA Pinning, Least-Privilege   |     |
|         +-----------------------------------------------------------------------+     |
+---------------------------------------------------------------------------------------+
```

---

## 2. Threat Actor Taxonomies

1. **External Opportunistic Actors**: Automated bots and scrapers harvesting exposed credentials, API keys, and public commits.
2. **Targeted Advanced Adversaries**: Sophisticated actors targeting private repositories, trying to compromise maintainer sessions or build pipelines.
3. **Compromised Automations & Integrations**: Over-permissioned OAuth apps, stale PATs, or compromised GitHub Actions runners.
4. **Malicious Insiders**: Employees or contractors abusing elevated repository permissions to exfiltrate code or modify history.
5. **Accidental Contributors**: Well-meaning developers inadvertently committing sensitive secrets, overwriting Git history via force push, or misconfiguring workflow triggers.

---

## 3. The 8 Core Repository Threat Vectors (T-01 - T-08)

### T-01: Secret Exposure in Repositories
* **Threat**: Hard-coded credentials, private tokens, or database connection strings committed to code.
* **Impact**: Rapid lateral movement, cloud infrastructure compromise, database data breaches.
* **Mitigations**:
  * Enable **GitHub Secret Scanning** and **Push Protection** globally.
  * Enforce pre-commit scanning hooks (`gitleaks`, `secretlint`) on developer workstations.
  * Mandatory abstract credential placeholders in documentation and tests (`<AUTHORIZED_USER_TOKEN>`, `<REDACTED_SECRET>`).

### T-02: Unauthorized Access to Private Repositories
* **Threat**: Misconfiguration of visibility (public vs. private), unauthorized user invitations, or token leakage granting read access to proprietary intellectual property.
* **Impact**: Loss of proprietary IP, competitive disadvantage, exposure of unpublished vulnerabilities.
* **Mitigations**:
  * Enforce strict **Enterprise Managed Users (EMU)** with IdP synchronization (Okta / Azure Entra ID).
  * Require **IP Allow Lists** at the organization level.
  * Restrict repository creation and member invitation permissions to Organization Admins.

### T-03: Abuse or Manipulation of "Danger Zone" Settings
* **Threat**: Unintended or malicious modification of repository visibility, repository deletion, or transferring ownership out of the enterprise.
* **Impact**: Permanent data loss, catastrophic public exposure of private code, loss of governance.
* **Mitigations**:
  * Revoke default repository administration rights from service teams.
  * Restrict repository deletion and transfer strictly to designated Enterprise Security Admins.
  * Require multi-party approval or break-glass authorization for Danger Zone operations.

### T-04: Modification or Deletion of Branch History
* **Threat**: Malicious or accidental force push (`git push --force`) or branch deletion on critical release branches (`main`, `production`), erasing audit trails or rolling back security patches.
* **Impact**: Untracked code substitution, lost commits, broken deployment pipelines.
* **Mitigations**:
  * GitHub Repository Rulesets: `allow_force_pushes: false` and `allow_deletions: false`.
  * Enforce `required_linear_history: true` to prevent confusing octopus merges and back-dated commits.

### T-05: Unauthorized Submission of Changes to Protected Branches
* **Threat**: Pushing code directly to protected branches without review, testing, or automated CI checks.
* **Impact**: Unvetted vulnerabilities, broken builds, deployment of unauthorized code.
* **Mitigations**:
  * Enforce Pull Request workflows for all branch changes (`pull_request` requirement).
  * Enforce Mandatory Passing Status Checks (`deploy:verify`, `typecheck`, `lint`, `test:api`).
  * Dismiss stale pull request approvals when new commits are pushed.

### T-06: Self-Approval and Self-Merge of Pull Requests
* **Threat**: A single contributor authors a PR and merges it themselves without independent peer review.
* **Impact**: Bypassed code quality gates, deliberate insertion of backdoors, loss of four-eyes principle.
* **Mitigations**:
  * Ruleset: `require_last_push_approval: true`.
  * Minimum 1 independent approving review (`required_approving_review_count: 1`).
  * Prohibit PR authors from approving their own pull requests (`require_code_owner_reviews: true`).

### T-07: Account Compromise & Identity Spoofing
* **Threat**: Credential stuffing, phishing of developer accounts, or forging Git commit authorship (spoofing `git config user.email`).
* **Impact**: Attacker impersonates trusted senior engineers, bypasses RBAC, and introduces unvetted code.
* **Mitigations**:
  * Mandatory Enterprise Two-Factor Authentication (2FA) / FIDO2 security keys.
  * Enforce **Cryptographically Signed Commits** (`required_signatures: true` via GPG / SSH / S/MIME).
  * Restrict Personal Access Tokens (PATs) to fine-grained, short-lived tokens ($\le 30-90$ days).

### T-08: Workflow & Action Misconfiguration / Supply Chain Injection
* **Threat**: Untrusted third-party actions, floating tags (`@v4`), unpinned dependencies, or dangerous triggers (`pull_request_target`) allowing script injection.
* **Impact**: Compromise of GitHub Actions runners, stolen repository secrets, poisoned build artifacts.
* **Mitigations**:
  * **Immutable Action SHA Pinning**: Never use floating tags; pin exact full-length commit SHAs (e.g. `actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683`).
  * Enforce **Least-Privilege Token Permissions**: Default workflow `permissions: read-all` or explicit `contents: read`.
  * Scan workflows using automated linters and security analyzers (`actionlint`, `zizmor`).

---

## 4. Threat Model Defense Matrix

| Threat Code | Primary Threat Vector | SLSA v1.0 Track | Mandatory GitHub Control | Automated Audit Command |
| :--- | :--- | :--- | :--- | :--- |
| **T-01** | Secret Leakage | Source Integrity | Secret Scanning & Push Protection | `npm run audit:architecture` |
| **T-02** | Unauthorized Access | Identity & Access | Private Visibility, EMU, IP Whitelist | `npm run verify:threat-model` |
| **T-03** | Danger Zone Tamper | Repo Governance | Restrict Repo Deletion to Org Admins | `npm run verify:threat-model` |
| **T-04** | History Tampering | Source Integrity | Ruleset: Block Force Push & Deletion | `npm run verify:threat-model` |
| **T-05** | Unauthorized Merge | Quality Gate | Mandatory Status Checks (`deploy:verify`) | `npm run deploy:verify` |
| **T-06** | Self-Approval Bypass | Dual Control | Ruleset: Require Review, No Author Approve | `npm run verify:threat-model` |
| **T-07** | Account / Commit Spoof | Identity Trust | Commit Signature Verification (`GPG/SSH`) | `npm run verify:threat-model` |
| **T-08** | Workflow Exploitation | Build Integrity | Action Full SHA Pinning, Least Privilege | `npm run verify:threat-model` |

---

## 5. Enterprise 16-Point Verification Checklist

1. [ ] **T-01 Secret Scanning**: GitHub Secret Scanning enabled across all repositories.
2. [ ] **T-01 Push Protection**: Secret scanning push protection enabled (blocks commits containing secrets).
3. [ ] **T-01 Abstract Placeholders**: Documentation and tests use abstract placeholders, zero concrete credentials.
4. [ ] **T-02 Visibility Control**: Default repository creation set to Private; public conversions blocked.
5. [ ] **T-02 Enterprise Managed Users**: Access federated with Enterprise IdP (Azure Entra ID / Okta).
6. [ ] **T-03 Danger Zone Lockdown**: Repository deletion restricted to Organization Owners only.
7. [ ] **T-03 Transfer Restriction**: Repository transfer outside organization blocked.
8. [ ] **T-04 Force Push Block**: Ruleset strictly blocks force pushes (`allow_force_pushes: false`).
9. [ ] **T-04 Deletion Block**: Ruleset strictly blocks branch deletion on default branch.
10. [ ] **T-05 Pull Request Mandatory**: Direct commits to `main` prohibited; all changes via PR.
11. [ ] **T-05 Status Checks**: Mandatory passing CI checks required before merge.
12. [ ] **T-06 Independent Review**: Minimum 1 approving review required from non-author peer.
13. [ ] **T-06 Stale Approval Reset**: Approvals dismissed automatically upon new commit push.
14. [ ] **T-07 2FA Enforced**: Two-factor authentication required for all organization members.
15. [ ] **T-07 Signed Commits**: Branch ruleset enforces signed commits (`require_signed_commits: true`).
16. [ ] **T-08 Action SHA Pinning**: All GitHub Actions pinned to immutable 40-character commit SHAs.
