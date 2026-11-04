---
name: securing-github-actions-workflows
description: Authoritative enterprise operational guide and workflow security specification for GitHub Actions based on the GitHub Well-Architected Framework (Greg Mohler & Kitty Chiu). Governs OIDC authentication, fine-grained least-privilege permissions, immutable full-length commit SHA action pinning, script injection prevention, pwn request defenses, workflow_run validation, and self-hosted runner guardrails.
---

# Securing GitHub Actions Workflows: Enterprise Standard

Authoritative enterprise operational guide and implementation specification for hardening GitHub Actions continuous integration and deployment pipelines against remote code execution, supply chain tampering, and credential theft.

---

## 1. Threat Landscape & CI/CD Security Architecture

CI/CD platforms are remote code execution (RCE) systems by design. A compromise of a workflow file, triggering payload, or third-party action compromises deployment environments, package registries, and cloud infrastructure.

```
+------------------------------------------------------------------------------------------+
| GitHub Actions Attack Surface & Defense Invariants                                       |
|                                                                                          |
| 1. Credential Theft       ---> Eliminate static secrets; enforce OIDC with claims        |
| 2. Privilege Escalation   ---> Set top-level `permissions: {}`, declare per-job          |
| 3. Tag Mutation Attacks   ---> Enforce 40-character immutable commit SHA pinning         |
| 4. Script Injection (RCE) ---> Never evaluate untrusted contexts in run: blocks          |
| 5. Pwn Requests           ---> Strictly prohibit code checkouts under pull_request_target|
| 6. Artifact Poisoning     ---> Treat workflow_run artifacts as untrusted                 |
| 7. Runner Hijacking       ---> NEVER use self-hosted runners on public repositories      |
+------------------------------------------------------------------------------------------+
```

---

## 2. Core Security Pillars

### Pillar 1: OpenID Connect (OIDC) Authentication
* **Zero Long-Lived Secrets**: Remove cloud static API keys and service account JSON files from repository secrets.
* **Granular Subject (`sub`) Claims**: Enforce exact subject matching rather than wildcards:
  $$\text{sub} = \text{"repo:org/repo:environment:production"}$$
* **Immutable Tenant Identifiers**: Prefer immutable IDs over mutable names:
  $$\text{sub} = \text{"repository_owner_id:12345:repository_id:67890"}$$
* **Job Workflow Validation (`job_workflow_ref`)**: Validate exact caller workflow path and commit SHA when calling cross-repository reusable workflows.

### Pillar 2: Least-Privilege Workflow Permissions
* **Organization / Repository Default**: Set default `GITHUB_TOKEN` permissions to **Restricted (Read-only)**.
* **Workflow-Level Zeroing**: Explicitly zero permissions at the root of the workflow file:
  ```yaml
  permissions: {}
  ```
* **Explicit Job-Level Scoping**: Declare only the minimal necessary permissions per job:
  ```yaml
  jobs:
    build-and-test:
      permissions:
        contents: read
    deploy:
      permissions:
        id-token: write
        contents: read
  ```

### Pillar 3: Immutable Action Version Pinning (Full Commit SHA)
* **Prohibit Floating Tags**: Never use major version tags (`@v4`, `@v1`) or `@latest` in production workflows. Tags are mutable and can be repointed by compromised maintainer accounts.
* **Full-Length 40-Character SHA**:
  ```yaml
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  - uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af # v4.1.0
  ```
* **Enterprise Enforcement**: Enable "Require full-length commit SHA" in Enterprise/Organization *Allowed Actions and Reusable Workflows* policy.

### Pillar 4: Script Injection Prevention
* **Vulnerability**: Inserting untrusted expressions directly into shell script strings allows arbitrary command injection:
  ```bash
  # CRITICAL VULNERABILITY (Script Injection)
  run: echo "Processing ${{ github.event.issue.title }}"
  ```
* **Remediation**: Map all dynamic GitHub context data into shell environment variables:
  ```yaml
  # SECURE IMPLEMENTATION
  env:
    ISSUE_TITLE: ${{ github.event.issue.title }}
  run: |
    echo "Processing $ISSUE_TITLE"
  ```

### Pillar 5: Elimination of "Pwn Requests" (`pull_request_target`)
* `pull_request_target` executes in the context of the base branch and has access to repository secrets and write tokens.
* **Prohibited Anti-Pattern**: Checking out the untrusted fork PR commit under `pull_request_target`:
  ```yaml
  # CATASTROPHIC PWN REQUEST VULNERABILITY
  on: pull_request_target
  steps:
    - uses: actions/checkout@...
      with:
        ref: ${{ github.event.pull_request.head.sha }} # Executes malicious fork code!
  ```
* **Rule**: Use standard `pull_request` for building and testing untrusted code. Use `pull_request_target` **only** for labeling and comment bots without checking out or executing PR code.

### Pillar 6: Hardened `workflow_run` Pipelines
* Verify triggering event:
  ```yaml
  if: ${{ github.event.workflow_run.event != 'pull_request' }}
  ```
* Download untrusted artifacts into isolated temporary directories (`$RUNNER_TEMP`).
* Never append untrusted artifact contents to `$GITHUB_ENV` or `$GITHUB_OUTPUT`.

### Pillar 7: Public Repository & Self-Hosted Runner Isolation
* **Zero Self-Hosted Runners on Public Repos**: Anyone can submit a fork PR to execute cryptominers, steal host network tokens, or compromise cluster nodes.
* Enforce ephemeral GitHub-hosted runners for public or untrusted contributions.

---

## 3. Defense Implementation Matrix

| Threat Vector | Root Cause | Mandatory Mitigation | Project Enforcement |
| :--- | :--- | :--- | :--- |
| **Credential Theft** | Stale static secrets | OIDC federated identity credentials | `permissions: id-token: write` |
| **Privilege Escalation** | Permissive `GITHUB_TOKEN` | Top-level `permissions: {}` + job-level limits | `verify-workflow-security.ts` |
| **Supply Chain Poisoning** | Tag mutation (`@v4`) | 40-character full commit SHA pinning | `verify-workflow-security.ts` |
| **Script Injection** | Expressions in `run:` | Intermediary environment variables (`$VAR`) | `verify-workflow-security.ts` |
| **Pwn Request** | Checkout under PR target | Prohibit checkout in `pull_request_target` | `verify-workflow-security.ts` |
| **Runner Escape** | Self-hosted on public repo | Enforce GitHub-hosted or isolated ARC runners | `verify-workflow-security.ts` |

---

## 4. Enterprise 16-Point Verification Checklist

1. [ ] **OIDC Federation**: Cloud deployments utilize OIDC tokens; zero static long-lived credentials in secrets.
2. [ ] **Exact Subject Claims**: OIDC trust configured with exact repository and environment `sub` claims.
3. [ ] **Default Restricted Token**: Organization default `GITHUB_TOKEN` set to Restricted (Read-only).
4. [ ] **Workflow Root Zeroed**: All workflows declare explicit `permissions: {}` at root level.
5. [ ] **Job-Level Permissions**: Every individual job declares only the minimal permissions required.
6. [ ] **40-Char SHA Pinning**: All third-party `uses:` actions pinned to immutable 40-character commit SHAs.
7. [ ] **Version Comment**: Every pinned SHA includes an inline comment referencing the semantic version.
8. [ ] **Allowed Actions Policy**: Enterprise policy enforces allowed actions and full commit SHA pinning.
9. [ ] **No Script Injections**: Zero `${{ ... }}` expressions inside `run:` shell command lines.
10. [ ] **Environment Variable Intermediary**: All user-controlled context passed via `env:` mapping.
11. [ ] **Prohibit PR Target Checkout**: Zero checkouts of untrusted code under `pull_request_target`.
12. [ ] **Secure Workflow Run**: Artifacts from `workflow_run` downloaded to `$RUNNER_TEMP` and validated.
13. [ ] **Reference `head.sha`**: Workflows reference immutable `head.sha` instead of mutable `head.ref`.
14. [ ] **Dependabot Version Updates**: Dependabot configured for GitHub Actions dependency monitoring.
15. [ ] **No Public Self-Hosted Runners**: Self-hosted runners strictly blocked from public repositories.
16. [ ] **Automated CI Enforcement**: Workflows verified via `npm run verify:workflows`.
