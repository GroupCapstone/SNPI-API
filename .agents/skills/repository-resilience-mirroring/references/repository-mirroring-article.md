# Building Resilience with Repository Mirroring

> Authoritative reference article and enterprise operational guide for establishing break-glass repository mirroring in independent failure domains.

---

## Scenario Overview

Modern engineering teams depend on their developer platform to store code and to build, review, and ship it. That dependency is usually invisible until the platform you rely on is temporarily unreachable. Even a short disruption can block an important launch, a customer commitment, or an urgent fix.

For critical services, maintain a current-enough copy of the code that matters most in a failure domain independent of the primary environment. Make sure a known group of responders has the access and permissions needed to retrieve that copy, patch it, build it, and deploy from it. When the primary environment is healthy again, reconcile the emergency change so both environments converge.

Treat resiliency mirroring as a rehearsed, break-glass deployment path. Active-active operation and comprehensive backup require separate architectures.

---

## Key Design Strategies and Checklist

A resilient mirroring design uses these strategies:
* **Mirror only what must be deployable**: Distinguish repositories retained only as inventory from critical services that must be ready to deploy during a disruption. Focus this continuity path on the deployment-ready set, mirror only the refs required by the emergency procedure, validate the CI/CD path, and regularly test deployment from the mirror.
* **Use a separate failure domain**: The mirror, its build path, credentials, and deployment dependencies must remain available during a primary environment disruption.
* **Minimize and isolate incident-time dependencies**: Every tool, identity, package registry, artifact store, and cloud control plane required during an incident must be available independently of the primary environment. Validate the continuity path with network access to the primary environment blocked, and restrict access to the mirror through separate, tightly scoped network controls.
* **Use immutable recovery inputs**: Select the exact production commit SHA. The tip of a branch may contain undeployed changes. Tie the resulting artifact and deployment back to that SHA.
* **Practice and reconcile**: Validate the mirror through regular deployment exercises, and make reconciliation to the primary environment a standard part of recovery.

---

## Implementation Checklist

* Identify the repositories and production revisions that must remain deployable during a disruption.
* Define the maximum acceptable mirror staleness and the time required to activate the continuity deployment path for each critical repository.
* Choose which branches, tags, or commit SHAs the sync job must mirror.
* Place the mirror in a separate failure domain from the primary environment.
* Provision the target repositories and set their visibility, default branch, and access controls.
* Store source-read, mirror-write, build, and deployment credentials independently of the primary environment.
* Monitor synchronization freshness, failed jobs, credential expiration, and authorization drift.
* Provision and test the build, deployment, dependencies, runners, artifacts, and runtime configuration required by the recovery path.
* Name the people who own synchronization, emergency approval, deployment, and reconciliation.
* Run a deployment drill from the mirror and record the gaps that need to be corrected.
* Document how to pause synchronization, select the recovery revision, deploy the hotfix, and resume synchronization safely.

---

## Assumptions and Preconditions

This recommendation assumes that:
* The primary GitHub environment is healthy enough to run the synchronization job before a disruption.
* A separate GitHub Enterprise Server (GHES) instance, or another independently operated Git service, is available as the mirror target.
* The organization can provide independent access to the mirror, break-glass credentials, build tooling, external dependencies, and deployment systems.
* The team has defined what "deployable" means for each critical service and has tested that path in a non-production environment.
* The mirror is reserved as a deployment source of last resort. Normal development and review continue in the primary environment.

---

## Recommended Deployment

Build the capability in small increments. The essential mechanism is a sync job that runs while the primary environment is healthy, reads the critical repositories, and pushes the required refs to a target in a separate failure domain.

### Minimum Viable Implementation Model

| Responsibility | Minimum Viable Implementation |
| :--- | :--- |
| **Select repositories and ref scope** | A checked-in configuration file listing critical repositories and the refs to mirror. |
| **Trigger synchronization** | A scheduled job that runs while the primary environment is healthy. Keep scheduler independent of target where practical. |
| **Mirror Git content** | Fetch from primary and push selected refs to the mirror using credentials for both sides. |
| **Provision the target** | Create each mirror repository as private or internal, set default branch, enable only continuity features. |
| **Store credentials** | Keep source-read and mirror-write credentials in a store that remains available independently of the primary environment. |
| **Verify freshness** | Compare source and mirror object IDs for every configured ref and alert on lag, missing or mismatched refs, or failed sync. |

The recovery point is the last successful synchronization. A shorter interval reduces the recovery point gap but increases cost and operational load. Tune the interval per repository, and verify the mirrored commit before relying on it.

---

## Choosing What to Mirror

Decide which refs the sync job pushes. Start with the narrowest scope that supports the emergency procedure and widen it only if a drill shows that more history is needed.

| Scope | Refspec | When to Choose It |
| :--- | :--- | :--- |
| **Default branch and deployed revisions** | `refs/heads/<default>` plus specific deployed commit SHAs or tags | Most critical services. Smallest mirror that carries the development baseline and known-good deployed revisions. |
| **All branches** | `+refs/heads/*:refs/heads/*` or `git push --mirror` | Repositories whose emergency procedure depends on release, maintenance, or long-running branches. Larger and slower. |

### Replicating Repository Settings
Mirroring copies Git refs, but it does not copy repository settings. Replicate only the settings required by the emergency workflow, such as applicable branch protections or rulesets and collaborator or team access. Users, teams, and apps must already exist in the mirror environment for those controls to work.

Configure a dedicated, least-privileged synchronization identity with any bypass permissions required to update mirrored refs. Required status checks and other controls that depend on the primary environment may not be available during a disruption. Identify which checks and builds are essential to deployment and make those capabilities available independently.

---

## Dependencies Outside the Mirror

A mirrored repository contains the Git commits required for recovery. Hotfix readiness also depends on separately provisioned and tested capabilities:
* CI/CD execution, secrets, variables, environments, runners, caches, and workflow history.
* Pull requests, issues, discussions, releases, deployment records, and webhooks.
* Packages, container images, release assets, and other build artifacts.
* External dependencies, package registries, artifact stores, and cloud control planes.
* Identities, teams, apps, tokens, and SSH keys from the primary environment.
* Git LFS objects, submodules, and other externally referenced content.
* A controlled path from the mirror back to the primary environment.

Runtime configuration, feature flags, and database changes must align with the specific commit deployed from the mirror. The primary environment's live state may differ. A hotfix that assumes the wrong runtime state can do more harm than the outage it is meant to address.

---

## Readiness and Practice

Prove the recovery path through deployment exercises before relying on it:
* **Name the humans**: Decide who owns synchronization, who approves an emergency change, and who performs the deployment.
* **Set clear objectives**: Define maximum acceptable mirror staleness (RPO) and activation time (RTO).
* **Keep the escape hatch independent**: Access to mirror, credentials, tooling, dependencies, and deployment credentials must be reachable without the primary environment.
* **Make it muscle memory for on-call**: Periodically select a known-good production commit, retrieve it from the mirror, build it, and deploy it to non-production. Rotate through on-call roster.
* **Monitor freshness continuously**: Confirm mirror freshness between exercises.

---

## Incident Break-Glass Sequence (When You Actually Need It)

1. **Establish control**: Open an incident, agree on roles, and activate an out-of-band synchronization lock that remains controllable while the primary environment is unavailable and that every sync run checks before pushing. Do not rely only on pausing a scheduler in the primary environment.
2. **Start from the right baseline**: Select the exact revision running in production. The tip of the default branch may contain undeployed changes. If the production commit is absent from the mirror, stop and escalate.
3. **Make the smallest safe change and review it**: Apply a minimal patch on a dedicated emergency branch, run tests available in the continuity environment, and obtain independent review. Identify the change by its immutable commit SHA.
4. **Build and deploy from the mirror**: Use the continuity build and deployment path, tie the resulting artifact to the commit SHA, and validate service health. Document any temporary control exceptions.
5. **Reconcile when the primary returns**: Push the fix to the primary environment, open a normal pull request, and resolve any divergence or conflicts before resuming synchronization. Merge through usual policy so permanent history reflects what shipped. Resume the sync job only after the mirror has caught up.

---

## Recommended Approach and Alternatives

* **Warm Narrow Mirror (Recommended)**: Narrow, warm mirror with rehearsed build/deploy path. Practical balance between recovery coverage, sync cost, and incident infrastructure.
* **Full Repository Backup**: Complete history for legal/compliance, but costs more and does not cover runtime or CI.
* **Active-Active Operation**: Highest cost and complexity; requires continuous data replication, traffic management, and multi-region runtime capacity.
