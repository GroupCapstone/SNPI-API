---
name: repository-resilience-mirroring
description: Authoritative enterprise specification and operational protocol for building repository resilience with warm mirroring in an independent failure domain. Covers narrow refspec selection, out-of-band sync locks, break-glass deployment runbooks, immutable SHA baselines, and post-incident reconciliation.
---

# Enterprise Repository Resilience Mirroring Standard

> Authoritative enterprise engineering specification for maintaining a warm, break-glass deployment replica of critical software repositories in a failure domain completely independent of the primary Git platform.

---

## 1. Architectural Foundations & Invariants

```
               [ Primary Environment: GitHub Cloud ]
             (Normal development, PR reviews, CI/CD)
                                |
               (Scheduled Sync Job / Every 30m)
            (Pre-flight Out-of-Band Lock Verification)
                                v
             [ Resiliency Mirror: Independent GHES/Git ]
           (Separate Failure Domain / No Incoming Traffic)
                                |
                   [ Break-Glass Hotfix Path ]
           (Deploy Directly to Production During Outage)
                                |
               (Post-Incident Reconciliation PR)
                                v
               [ Reconcile Back to Primary Git ]
```

1. **Mirror Only Deployable Refs (Narrow Refspec)**: Do not mirror all branches or untracked state. Only mirror `refs/heads/<default>` and deployed release tags (`refs/tags/*`).
2. **Independent Failure Domain**: The mirror host, build runners, credentials, package registries, and cloud control planes must exist in an infrastructure realm completely detached from the primary GitHub platform.
3. **Out-of-Band Sync Lock**: Before every push to the mirror, the sync job must query an independent lock provider. If responders declare an emergency (`LOCKED`), synchronization terminates immediately to prevent overwriting active incident hotfixes.
4. **Immutable Commit SHA Baselines**: During an incident, responders must branch from the exact production commit SHA—not the tip of the default branch.
5. **Mandatory Post-Incident Reconciliation**: Emergency hotfixes deployed from the mirror must be reconciled back to the primary environment through standard pull request policies once health is restored.
6. **Zero Primary Dependencies**: The continuity build and deployment paths must function with all network egress to `github.com` severed.

---

## 2. Eleven-Point Resiliency Mirroring Checklist

| # | Domain | Policy Requirement | Verification Check |
| :- | :--- | :--- | :--- |
| **01** | **Repository Scope** | Critical deployable services identified | `mirror-config.yaml` registered |
| **02** | **Refspec Standard** | Narrow refspec (`+refs/heads/main`, `+refs/tags/*`) | Zero unvetted branch mirroring |
| **03** | **Failure Domain** | Mirror hosted in independent data center/cloud | Isolated network route |
| **04** | **Sync Frequency** | Scheduled sync meeting RPO (e.g., 30 minutes) | Sync cron workflow active |
| **05** | **Out-of-Band Lock** | Pre-sync verification against independent lock | Sync aborts when lock is `LOCKED` |
| **06** | **Credential Isolation**| Mirror push/deploy credentials stored out-of-band | Zero dependency on primary secrets |
| **07** | **Freshness SLA** | Continuous comparison of primary & mirror commit SHAs | `scripts/verify-mirror-freshness.ts` |
| **08** | **Offline Runners** | Self-hosted runners capable of building without GitHub | Local runner pool verified |
| **09** | **Named Responders** | Specific on-call engineers designated for break-glass | On-call roster published |
| **10** | **Rehearsal Drills** | Regular deployment drills from mirror to non-prod | Quarterly break-glass drill |
| **11** | **Reconciliation** | Standardized hotfix back-porting procedure | Post-incident PR template |

---

## 3. Incident Break-Glass Operating Sequence

When the primary GitHub platform is unreachable:

```
[1. Activate Out-of-Band Lock]
    Responders set status endpoint to 'LOCKED' to freeze incoming sync jobs.

[2. Identify Exact Production SHA]
    Retrieve live running deployment commit SHA (e.g. via /api/health or deployment logs).

[3. Branch from Immutable SHA on Mirror]
    git checkout -b hotfix/INC-XXXX <PROD_COMMIT_SHA>

[4. Apply Minimal Patch & Review]
    Apply fix, execute local tests, obtain secondary sign-off from named responder.

[5. Build & Deploy from Mirror]
    Trigger emergency build using independent CI runners; deploy directly to production.

[6. Primary Restoration & Reconciliation]
    When primary returns, push hotfix branch to primary, open PR, merge, verify mirror caught up.

[7. Release Out-of-Band Lock]
    Set lock back to 'UNLOCKED' to restore regular synchronization.
```

---

## 4. Primary References & Templates

* **Authoritative Article Archive**: [`references/repository-mirroring-article.md`](file:///Users/Apple16/.gemini/config/skills/repository-resilience-mirroring/references/repository-mirroring-article.md)
* **Mirror Configuration Template**: [`templates/mirror-config.yaml`](file:///Users/Apple16/.gemini/config/skills/repository-resilience-mirroring/templates/mirror-config.yaml)
* **Automated Sync Workflow**: [`templates/mirror-sync-workflow.yml`](file:///Users/Apple16/.gemini/config/skills/repository-resilience-mirroring/templates/mirror-sync-workflow.yml)
* **Sync Script with Lock Check**: [`scripts/sync-mirror.sh`](file:///Users/Apple16/.gemini/config/skills/repository-resilience-mirroring/scripts/sync-mirror.sh)
* **Freshness & Staleness Auditor**: [`scripts/verify-mirror-freshness.ts`](file:///Users/Apple16/.gemini/config/skills/repository-resilience-mirroring/scripts/verify-mirror-freshness.ts)
