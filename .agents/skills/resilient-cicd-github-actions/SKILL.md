---
name: resilient-cicd-github-actions
description: Authoritative enterprise operational guide and architectural specification for building resilient CI/CD with GitHub Actions. Covers the 6 key design strategies: portable deployment logic outside workflows, release inputs & attestation preservation, dual-path authentication with independent short-lived credentials, GitHub Status API failure detection (/api/v2/components.json, /api/v2/incidents/unresolved.json, /api/v2/summary.json), post-disruption automation reconciliation before replay, and 6-step rehearsal drills.
---

# Building Resilient CI/CD with GitHub Actions Standard

> Authoritative enterprise engineering specification for establishing deployment execution continuity, dual invocation paths, decoupled deployment scripts, independent identity providers, and zero-loss post-incident reconciliation for GitHub Actions.

---

## 1. Architectural Scope: Source vs. Execution Resilience

Business continuity for mission-critical software systems spans two distinct operational tiers:

```
+---------------------------------------------------------------------------------------------------+
| Continuous Delivery Resiliency Domains                                                            |
+------------------------------------+--------------------------------------------------------------+
| 1. Source Availability Domain      | Handled by Repository Resilience Mirroring                   |
|    (.agents/skills/                | Independent git mirror, narrow refspec (+main, +tags),      |
|     repository-resilience-mirroring)| out-of-band sync locks, immutable commit SHA baselines      |
+------------------------------------+--------------------------------------------------------------+
| 2. CI/CD Execution Continuity Tier | Handled by Resilient CI/CD with GitHub Actions               |
|    (.agents/skills/                | Portable deployment scripts, dual invocation paths,          |
|     resilient-cicd-github-actions) | independent short-lived auth, status ingestion, reconciliation|
+------------------------------------+--------------------------------------------------------------+
```

When GitHub Actions orchestration experiences service degradation, regional cloud outages, or scheduler backpressure, engineering teams must not be locked out of deploying emergency fixes, rollbacks, or hotfixes.

---

## 2. The 6 Key Resilient CI/CD Design Strategies

```
+----------------------------------------------------------------------------------------------------+
|                               THE DUAL-PATH DEPLOYMENT MODEL                                       |
|                                                                                                    |
|  [ Normal Path: GitHub Actions ]                   [ Alternate Path: Authorized Responder ]        |
|  - Triggered by Git Push / Tag                     - Activated during CI/CD orchestration outage   |
|  - GitHub-hosted / ARC Runner                      - Isolated admin console / bastion runner       |
|  - GitHub Actions OIDC Auth                        - Independent Cloud SSO / IAM (Short-lived)     |
|              |                                                    |                                |
|              +--------------------------+-------------------------+                                |
|                                         |                                                          |
|                                         v                                                          |
|                    +------------------------------------------+                                    |
|                    |   Version-Controlled Deployment Logic    |                                    |
|                    |     (infrastructure/resilience/          |                                    |
|                    |      cicd-continuity/alternate-deploy.sh)|                                    |
|                    +--------------------+---------------------+                                    |
|                                         |                                                          |
|                                         v                                                          |
|                    +------------------------------------------+                                    |
|                    |    Deployment Target (Vercel / K8s)      |                                    |
|                    +------------------------------------------+                                    |
+----------------------------------------------------------------------------------------------------+
```

### Strategy 1: Keep Deployment Logic Portable
* **Zero Workflow Locking**: Never make a YAML workflow definition (`.github/workflows/*.yml`) the sole executable implementation of deployment procedures.
* **Decoupled Executable Scripts**: Package all container builds, asset uploads, health checks, traffic routing, and rollout logic into version-controlled scripts (`alternate-deploy.sh`, `scripts/deploy-*.ts`) or containerized CLI tooling.
* **Identical Implementation**: Both GitHub Actions and authorized emergency responders invoke the exact same script with the same input arguments, completely eliminating configuration drift without requiring a duplicate CI/CD platform.

### Strategy 2: Preserve the Inputs Needed to Deploy
During an incident, the alternate deployment path must be capable of independent execution with zero real-time dependency on GitHub-hosted artifacts:
1. **Approved Artifacts & Container Images**: Mirrored in secondary container registries (e.g., Azure ACR, AWS ECR) identified by immutable digest (`sha256:...`).
2. **Immutable Release Identifiers**: Explicit release tags and commit SHAs rather than mutable references like `latest`.
3. **Offline Attestations & Trust Material**: Preserve GitHub artifact attestation bundles, Sigstore root certificates, and verification tooling (`gh attestation verify`) offline alongside release bundles.
4. **Independent Build Capability**: If brand new binaries must be compiled during an extended outage, verify that compilers and container builders can execute in an isolated offline environment.

### Strategy 3: Maintain a Separate Authentication Path
Never allow GitHub Actions OpenID Connect (OIDC) to be the single point of failure for cloud authorization:
* **Normal Path**: GitHub Actions workflow requests an ephemeral OIDC token exchange (`permissions: id-token: write`) mapped to a tightly scoped cloud IAM role.
* **Alternate Path**: Authorized incident responders authenticate via an independent enterprise identity provider (Okta/Azure Entra ID) using hardware MFA, privileged access management (PAM), and just-in-time (JIT) short-lived credentials.
* **Zero Static Secrets**: Strictly prohibit permanent static break-glass API keys or root service account tokens in files or local workstations.

### Strategy 4: Detect What Has Failed
Before declaring a break-glass incident and activating alternate deployment procedures, systematically diagnose the failure domain using GitHub Status APIs:

| Endpoint | Ingestion Frequency | Telemetry Target |
| :--- | :--- | :--- |
| `https://www.githubstatus.com/api/v2/summary.json` | 60 seconds | Overall platform health & high-level component status |
| `https://www.githubstatus.com/api/v2/incidents/unresolved.json` | 30 seconds | Active incident declarations affecting Actions or APIs |
| `https://www.githubstatus.com/api/v2/components.json` | 60 seconds | Fine-grained status for `Actions`, `Git Operations`, `Pages` |
| `https://www.githubstatus.com/history.rss` | Event-driven | Incident management feed integration (Slack/PagerDuty) |

* **Gate Rule**: If the root cause is a downstream cloud target failure (e.g., AWS/Azure/Vercel regional outage), switching CI/CD invocation paths will not succeed. Only activate the alternate path when the failure is localized to CI/CD orchestration.

### Strategy 5: Reconcile Automation Before Replaying Work
When primary GitHub Actions capability is restored, immediately pausing automated replay is mandatory:
1. **State Audit**: Inventory all workflow runs queued, failed, or skipped during the outage.
2. **Target Alignment**: Verify which deployment versions actually reached production targets.
3. **Alternate Path Reconciliation**: Back-port release tags, immutable digests, incident ticket IDs, and deploy logs generated during alternate execution into the primary repository via a reconciliation PR.
4. **Credential Revocation**: Immediately terminate all temporary access grants, active sessions, and elevated tokens issued for the emergency alternate path.
5. **Selective Safe Replay**: Re-trigger only safe, unexecuted jobs; cancel stale or superseded pipeline runs.

### Strategy 6: Rehearse the Execution Path
Resilience protocols that are not exercised regularly fail during genuine emergencies:
* **The 6-Step Responder Drill**:
  1. Identify target release artifact digest and commit SHA.
  2. Retrieve deployment script, environment config, and offline trust bundle.
  3. Authenticate through the independent cloud path (MFA + JIT role).
  4. Execute independent artifact integrity verification.
  5. Run `alternate-deploy.sh` against the staging/canary target.
  6. Execute post-deployment health verification and reconciliation logging.
* **Cadence**: Execute quarterly drills with simulated network cuts to `github.com`.

---

## 3. The 10-Point Resilient CI/CD Checklist

| # | Checkpoint | Architecture Requirement | Verification Gate |
| :- | :--- | :--- | :--- |
| **01** | **Workload Tiering** | Critical workloads identified and mapped | `resilient-cicd-config.yaml` registered |
| **02** | **Portable Deployment** | Deployment logic isolated in standalone executable script | `alternate-deploy.sh` runnable locally |
| **03** | **Logic Parity** | Normal and alternate paths invoke identical deploy scripts | Zero configuration drift between paths |
| **04** | **Input Preservation** | Immutable artifact digests and trust material saved offline | Attestation bundle verification tooling verified |
| **05** | **Independent Invocation** | Execution path operates with zero dependency on Actions runner | CLI/Bastion alternate invocation path active |
| **06** | **Dependency Mapping** | All network, registry, IAM, and API targets cataloged | Boundary dependencies documented |
| **07** | **Dual Identity Paths** | Actions OIDC + Independent JIT cloud login configured | Zero shared credentials; zero static keys |
| **08** | **Activation Authority** | Incident Commander role and activation criteria defined | Activation protocol in `reconciliation-runbook.md` |
| **09** | **Reconciliation Protocol**| Step-by-step state recovery and credential revocation documented | Runbook reconciliation checklist verified |
| **10** | **Drill Frequency** | Documented quarterly drills exercising alternate path | Drill log and audit records maintained |

---

## 4. Responsibility Matrix: Normal vs. Alternate Path

| Operational Stage | Normal Path (GitHub Actions) | Alternate Path (Authorized Responder) |
| :--- | :--- | :--- |
| **Authentication** | Ephemeral GitHub Actions OIDC token (`actions.githubusercontent.com`) | Corporate SSO + Hardware MFA + Short-lived Cloud IAM Role |
| **Release Selection** | Automatic checkout of commit SHA and approved artifact digest | Operator specifies approved release tag & immutable SHA |
| **Verification & Gate** | Automated status checks, branch protection, and GHAS scans | Offline attestation verification + Independent dual human approval |
| **Execution Tooling** | Runner executes `infrastructure/resilience/cicd-continuity/alternate-deploy.sh` | Operator executes `infrastructure/resilience/cicd-continuity/alternate-deploy.sh` |
| **Telemetry & Log** | Actions workflow logs and GitHub Deployment API | Structured deployment log, incident ticket ID, operator audit trail |
| **Post-Action** | Automated branch tagging and release publishing | Post-incident reconciliation PR and credential revocation |

---

## 5. Automated Verification & Quality Gates

The repository enforces resilient CI/CD continuity through an automated verification engine:
* **Script**: `scripts/verify-resilient-cicd.ts`
* **NPM Command**: `npm run verify:resilient-cicd`
* **Unified Suite**: Integrated into `npm run verify:all-standards` and `scripts/verify-deploy-gate.ts`
