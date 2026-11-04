---
name: enforce-ghas-at-scale
description: Authoritative enterprise operational guide and implementation standard for enforcing GitHub Advanced Security (GHAS) at scale based on the GitHub Well-Architected Framework (Greg Mohler). Governs custom properties dynamic targeting, Security Configurations, push ruleset bypass prevention, centralized Dependency Review reusable workflows, CodeQL matrix configurations, alert RBAC access permissions, and SIEM audit log streaming.
---

# Enforcing GitHub Advanced Security at Scale: Enterprise Standard

Authoritative enterprise operational guide and architecture specification for rolling out and enforcing GitHub Advanced Security (GHAS) across large-scale repository fleets without sacrificing developer velocity.

---

## 1. Enterprise Enforcement Architecture

Enforcing GHAS across hundreds or thousands of repositories requires a multi-layered governance model that combines **declarative Security Configurations**, **Repository Custom Properties**, **Repository Rulesets**, and **audit streaming**.

```
+------------------------------------------------------------------------------------------+
| GHAS Fleet Enforcement Control Plane                                                     |
|                                                                                          |
|  [Repository Custom Properties]  (e.g., criticality: high, compliance: soc2)            |
|                |                                                                         |
|                v                                                                         |
|  +-------------------------------------+   +------------------------------------------+  |
|  | Layer 1: Security Configurations    |   | Layer 2: Repository Rulesets             |  |
|  |   - Secret Scanning (Code, PR, Wiki)|   |   - Required Passing CI Workflows        |  |
|  |   - Push Protection (Delegated)     |   |   - Push Rule: Block secret_scanning.yml |  |
|  |   - Dependabot Alerts & Updates     |   |   - Centralized Dependency Review        |  |
|  |   - CodeQL Default Setup            |   |   - Strict Merge Gate (No Bypass)        |  |
|  +-------------------------------------+   +------------------------------------------+  |
|                |                                         |                               |
|                +--------------------+--------------------+                               |
|                                     v                                                    |
|  [Enterprise Audit Log Streaming] ----> SIEM / Microsoft Sentinel / Enterprise Webhooks  |
+------------------------------------------------------------------------------------------+
```

---

## 2. Core Pillars of Enforcement at Scale

### Pillar 1: Consistent Branching Strategy
* Enforce **GitHub Flow** (`main` as default production branch, ephemeral feature branches merged exclusively through Pull Requests).
* All GHAS merge gates anchor on target production branches (`refs/heads/main`).

### Pillar 2: Dynamic Governance via Custom Properties
Repositories declare metadata attributes that automatically drive security profiles:
* `business_criticality`: `tier-1-mission-critical`, `tier-2-internal`, `tier-3-experimental`
* `compliance_framework`: `soc2`, `ferpa`, `hipaa`, `pci-dss`
* `public_exposure`: `internal-only`, `partner-facing`, `public`
* `build_type`: `interpreted` (Node.js/Python), `compiled` (Go/Java/C#)

### Pillar 3: Security Configurations (Organization-Wide)
Applied automatically based on Custom Property targeting:
* **Secret Scanning**: Enabled across Code, Issues, Pull Requests, Discussions, and Wikis.
* **Push Protection**: Blocks commits containing valid tokens or keys before ingestion.
* **Delegated Bypass**: Restricts push protection bypass to designated Security Leads / Managers.
* **Dependabot Alerts & Automated Security PRs**: Continuously patches known vulnerable dependencies.

### Pillar 4: Ruleset Push Protection & Bypass Prevention
* **Attack Vector**: Contributors with Write access creating `.github/secret_scanning.yml` to exclude directories or files from secret scanning.
* **Mitigation**: Deploy an Organization Push Ruleset that strictly **restricts file paths**:
  ```json
  {
    "type": "file_path_restriction",
    "parameters": {
      "restricted_file_paths": [
        ".github/secret_scanning.yml"
      ]
    }
  }
  ```

### Pillar 5: Centralized Dependency Review Reusable Workflow
Blocks Pull Requests if a commit introduces:
1. Vulnerabilities exceeding specified severity (`fail-on-severity: moderate`).
2. Prohibited open-source licenses (`deny-licenses: GPL-1.0-or-later, LGPL-2.0-or-later`).

### Pillar 6: Alert Access Permissions & RBAC Matrix

| Role | Secret Scanning Alerts | Dependabot Alerts | CodeQL Scanning Alerts |
| :--- | :--- | :--- | :--- |
| **Read** | None (except commit author) | None | None |
| **Triage** | None (except commit author) | None | None |
| **Write** | None (except commit author) | Read + Write | Read + Write |
| **Maintain** | None (except commit author) | Read + Write | Read + Write |
| **Admin** | **Read + Write** | **Read + Write** | **Read + Write** |
| **Security Manager** | **Read + Write (Org-wide)** | **Read + Write (Org-wide)** | **Read + Write (Org-wide)** |

### Pillar 7: Auditable Exception Management & SIEM Streaming
* All ruleset bypasses and dismissed alerts emit Enterprise Audit Log events.
* Stream audit logs to **Microsoft Sentinel** or enterprise webhooks for immediate SOC notification.

---

## 3. Enforcement Implementation Matrix

| Control Area | GitHub Feature | Enforcement Mechanism | Failure Action |
| :--- | :--- | :--- | :--- |
| **Secret Ingestion** | Secret Scanning Push Protection | Security Configuration + Delegated Bypass | Commit rejected at push |
| **Bypass Prevention** | Push Ruleset (`.github/secret_scanning.yml`) | Organization Push Ruleset | Commit rejected if path modified |
| **Dependency CVEs** | Dependency Review Action | Reusable Workflow in Ruleset | PR status check blocked (`moderate+`) |
| **License Compliance**| Dependency Review License Filter | Reusable Workflow in Ruleset | PR status check blocked (`GPL/LGPL`) |
| **Code Vulnerabilities**| CodeQL SAST | Security Config / Custom Workflow | PR status check blocked |
| **Audit Compliance** | Enterprise Audit Log Streaming | Audit Log Export / Webhook to SIEM | Real-time alert dispatched to SOC |

---

## 4. Enterprise 16-Point Verification Checklist

1. [ ] **Default Branch Flow**: Production branch protected; direct pushes disabled.
2. [ ] **Custom Properties Configured**: Repositories tagged with `business_criticality` and `compliance`.
3. [ ] **Security Config Active**: GHAS Security Configuration assigned to target repository tier.
4. [ ] **Push Protection Enabled**: Secret scanning push protection enabled globally.
5. [ ] **Delegated Bypass Active**: Push protection bypass restricted to Security Managers.
6. [ ] **Bypass Ruleset Active**: Push ruleset blocks `.github/secret_scanning.yml` creation.
7. [ ] **Dependabot Alerts On**: Dependabot vulnerability scanning active across monorepo workspaces.
8. [ ] **Dependabot Auto-Updates**: Automated security PRs enabled for vulnerable dependencies.
9. [ ] **Dependency Review Workflow**: Reusable workflow checks PR dependency additions.
10. [ ] **Severity Threshold**: Dependency review fails on `moderate` or higher severity.
11. [ ] **License Restriction**: Dependency review blocks prohibited licenses (`GPL-1.0-or-later`, etc.).
12. [ ] **CodeQL Scanning**: CodeQL analysis active on pull requests and pushes to `main`.
13. [ ] **Language Compatibility**: CodeQL build steps tuned for compiled vs. interpreted languages.
14. [ ] **Security Manager Role**: Enterprise Security Manager role assigned to AppSec team.
15. [ ] **Audit Streaming**: Audit log events configured for real-time SIEM ingestion.
16. [ ] **Automated CI Enforcement**: Verified via `npm run verify:ghas`.
