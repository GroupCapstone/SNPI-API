---
name: prioritizing-security-alerts
description: >-
  Authoritative Security Alert Prioritization Standard (Greg Mohler & Tom Horton).
  Governs the 3-step prioritized remediation model: GitHub Alert Metadata (CodeQL,
  Secret Validity, Dependabot EPSS & Scope), Repository Custom Properties (Exposure,
  Criticality, Compliance), and Time-Bound Security Campaigns with Automated Triage.
---

# Authoritative Security Alert Prioritization Standard

> **Status**: Primary Architectural & Security Standard  
> **Authors**: Greg Mohler & Tom Horton (October 2, 2026)  
> **Authoritative Scope**: Vulnerability Management, Alert Triage & Security Campaign Orchestration  
> **Primary Safe Folder**: `.agents/skills/prioritizing-security-alerts/`  
> **Unabridged Reference**: `references/prioritizing-security-alerts.md`  
> **Plaintext Reference**: `references/prioritizing-security-alerts.txt`  
> **Enterprise Knowledge Base**: `.github/knowledge/security/prioritizing-security-alerts.md`  
> **Architecture Reference**: `docs/architecture/prioritizing-security-alerts.md`  

---

## 1. Executive Summary & The Alert Sprawl Dilemma

Engineering teams are frequently overwhelmed by high volumes of automated security notifications ("alert sprawl"). Treating all alerts with uniform urgency exhausts development bandwidth, slows feature releases, and creates dangerous blind spots.

Effective remediation requires a **Context-Enriched Prioritization Strategy** that systematically combines:
1. **Native GitHub Alert Metadata**: Severity, CWE, EPSS probability, secret validity, dependency scope.
2. **Organizational Repository Context**: Custom properties defining internet exposure, business criticality, compliance scopes, and active user volume.
3. **Structured Security Campaigns**: Time-bound remediation waves targeting the highest-risk alert clusters with binding SLOs and automated tracking.

---

## 2. The 3-Step Prioritization Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: GitHub Alert Metadata                               │
│ - CodeQL: Severity, CWE ID, Copilot Autofix                 │
│ - Secret Scanning: Active/Inactive Validity, Partner Match  │
│ - Dependabot: EPSS score, Runtime vs Dev, Direct/Transitive │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Organizational Context (Custom Properties)          │
│ - Internet Facing: Public ingress vs Internal microservice  │
│ - Regulatory Mandate: FERPA, GDPR, HIPAA, SOC 2             │
│ - Business Criticality: Mission-Critical, High, Medium, Low │
│ - User Volume: Active enterprise accounts affected          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Targeted Security Campaigns                         │
│ - Time-bound remediation waves (e.g. 14d / 30d SLOs)        │
│ - Filtered alert cohorts dispatched to responsible squads   │
│ - Centralized burn-down telemetry and executive reporting   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Mathematical Risk Scoring Formula

The automated triage engine evaluates every alert against the normalized **Composite Risk Formulation**:

$$\text{Composite Risk} = \text{Base Severity} \times M_{\text{EPSS}} \times M_{\text{Exposure}} \times M_{\text{Scope}} \times M_{\text{Validity}}$$

### Parameter Weights:
- **Base Severity**:
  - `CRITICAL`: 100 points
  - `HIGH`: 70 points
  - `MEDIUM`: 40 points
  - `LOW`: 10 points
- **EPSS Multiplier ($M_{\text{EPSS}}$)**:
  - $\text{EPSS} \ge 0.50$ (Active Wild Exploits): $1.50$
  - $0.10 \le \text{EPSS} < 0.50$: $1.20$
  - $\text{EPSS} < 0.10$: $1.00$
- **Exposure Multiplier ($M_{\text{Exposure}}$)**:
  - `internet_facing: true`: $1.40$
  - `internet_facing: false`: $0.90$
- **Scope Multiplier ($M_{\text{Scope}}$)**:
  - `runtime` (Production code): $1.30$
  - `development` (Build / Test only): $0.70$
- **Validity Multiplier ($M_{\text{Validity}}$)**:
  - Secret `valid` (confirmed active): $2.00$
  - Secret `unknown`: $1.00$
  - Secret `invalid` (confirmed revoked): $0.20$

---

## 4. Priority Tiers & Service Level Objectives (SLOs)

| Priority Tier | Score Range | Criteria Profile | Binding Remediation SLO |
| :--- | :---: | :--- | :---: |
| **P0 (Emergency)** | $\ge 150$ | Active partner secrets, critical runtime RCE/SQLi in internet-facing systems, high EPSS | **7 Days** |
| **P1 (High)** | $100 - 149$ | High severity CodeQL/Dependabot in production, patch available, sensitive compliance scope | **14 Days** |
| **P2 (Standard)** | $50 - 99$ | Medium severity runtime alerts, direct dependencies without active exploits | **30 Days** |
| **P3 (Backlog)** | $< 50$ | Low severity alerts, dev-dependencies, confirmed inactive credentials | **90 Days** |

---

## 5. Architectural Invariants & Verification

Every CI audit and automated triage runner evaluates compliance against these primary invariants:

1. **INVARIANT-1 (Custom Properties Registry)**: Repository must define structured custom properties in `infrastructure/security/alert-prioritization/custom-properties.yaml`.
2. **INVARIANT-2 (Security Campaigns Blueprint)**: Active and templated campaigns must be codified in `infrastructure/security/alert-prioritization/security-campaigns.yaml`.
3. **INVARIANT-3 (Triage Policy Enforcement)**: Automated alert scoring logic must be defined in `infrastructure/security/alert-prioritization/alert-triage-policy.json`.
4. **INVARIANT-4 (Automated CLI Auditor)**: `scripts/verify-alert-prioritization.ts` must pass with 100% compliance.
5. **INVARIANT-5 (Zero Emojis)**: All triage reports, campaign logs, and CLI outputs must use textual status badges (`[PASSED]`, `[FAILED]`, `[P0]`, `[P1]`, `[P2]`, `[P3]`).

---

## 6. Operational CLI Command

```bash
# Run the 3-step alert prioritization auditor
npm run verify:alert-prio
```
