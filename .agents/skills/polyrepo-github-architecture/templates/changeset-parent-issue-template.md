---
name: Cross-Repo Change Set
about: Parent tracking issue for coordinating multi-repo changes
title: "[CHG-XXXX]: <Short description of multi-repo change>"
labels: ["changeset", "coordination"]
---

## Change Set Overview

* **Change Set ID**: `CHG-XXXX`
* **Target System Release**: `system-YYYY.MM.DD`
* **Target Merge Window**: `YYYY-MM-DD`
* **Lead Architect / Driver**: @<username>
* **Coordination Approach**: Integration Branch | Meta-Repo Manifest | Linked PRs

---

## Business & Technical Scope

<!-- Describe what is changing across repositories and why -->

---

## Impacted Repositories & Child Issues

| Repository | Responsibility | Child Issue | PR Link | Status |
| :--- | :--- | :--- | :--- | :--- |
| `org/auth-service` | Provider API v3 endpoint | # | # | `[QUEUED]` |
| `org/billing-api` | Consumer token client upgrade | # | # | `[QUEUED]` |
| `org/web-frontend` | Frontend auth handler update | # | # | `[QUEUED]` |

---

## Pre-Merge Validation Gate

- [ ] All child PRs opened with branch naming `changeset/CHG-XXXX/<topic>`
- [ ] Integration manifest updated with PR commit SHAs
- [ ] Integration CI test suite executed and passed
- [ ] Contract compatibility verified (zero breaking changes for consumers)
- [ ] Security scan / GHAS alerts cleared across all PRs

---

## Merge Order & Rollout Sequence

1. `org/auth-service` (Provider: must merge and cut tag first)
2. `org/billing-api` (Consumer 1)
3. `org/web-frontend` (Consumer 2)
4. Integration repo manifest bump to stable tags
