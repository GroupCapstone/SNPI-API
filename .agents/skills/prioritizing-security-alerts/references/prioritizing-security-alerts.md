# Prioritizing Security Alert Remediation

**Authors**: [Greg Mohler](https://github.com/callmegreg) and [Tom Horton](https://github.com/thomasphorton)  
**Published**: August 5, 2025  
**Updated**: October 2, 2026  
**Source**: GitHub Well-Architected Framework & Application Security Recommendations  

---

## Scenario Overview

Security teams are often swamped with alerts, making it tough to figure out what really matters. This flood of notifications, or "alert sprawl," can make it hard to fix the most important issues, leading to potential security gaps and wasted effort. Knowing which alerts to tackle first is key to spending your team's time wisely.

GitHub offers a lot of built-in information to help you sort through your security alerts. When you combine this with details from your own internal systems, you get a much clearer picture of an alert’s potential impact. Plus, setting up focused security campaigns can help your teams understand exactly which alerts they need to address and when, prioritizing effort on the right set of work.

---

## Key Design Strategies

The recommended approach for prioritizing security alerts employs three core strategies:

1. **Step 1: Understand GitHub Alert Metadata**: Begin by leveraging GitHub's comprehensive built-in metadata (severity, CWE, EPSS scores, validity, etc.) to establish a foundational understanding of alert context and potential impact. This native information provides immediate insights into vulnerability characteristics and exploitability.
2. **Step 2: Supplement with Organizational Context**: Enhance GitHub's metadata by adding custom properties to repositories to capture details about the applications and services that those repositories support, such as business criticality, internet exposure, compliance requirements, and user count. This dual-layer approach provides a more nuanced understanding of actual risk and impact within your specific environment.
3. **Step 3: Target High-Priority Alerts with Security Campaigns**: Use the enriched metadata to create focused, time-bound security campaigns that target the highest-priority alerts. This structured approach ensures accountability, clear deadlines, and measurable progress toward risk reduction goals while directing teams to focus on the most important vulnerabilities first.

---

## Assumptions and Preconditions

These recommendations assume that you have:
- GitHub Enterprise Cloud (GHEC)
- [Code Security](https://github.com/security/advanced-security/code-security), [Secret Protection](https://github.com/security/advanced-security/secret-protection), and/or [Dependabot](https://github.com/security/advanced-security/software-supply-chain) enabled and configured for your repositories.

---

## Recommended Approach

### Step 1: Understand GitHub Alert Metadata

When triaging which security alerts require immediate attention, GitHub provides comprehensive metadata that helps quickly determine context and potential impact:

#### Code Security (CodeQL)
- **Severity**: GitHub assigns severity levels (Critical, High, Medium, Low). Critical and High severity alerts are the starting point for addressing security technical debt.
- **CWE (Common Weakness Enumeration)**: Each alert maps to a CWE ID, categorizing the software weakness, indicating well-known attack patterns, and informing whether existing mitigations (e.g. WAF rules) alter urgency.
- **Copilot Autofix Support**: Code scanning alerts that support Copilot Autofix provide automated code remediation suggestions directly in pull requests, enabling quick wins and accelerating team velocity.

#### Secret Protection (Secret Scanning)
- **Validity**: Indicates whether an exposed secret is confirmed active or confirmed inactive. Valid (active) secrets are P0 immediate response items; confirmed inactive secrets are deprioritized.
- **Provider Patterns vs. Non-Provider Patterns**: Provider patterns identify secrets issued by specific partners (AWS, OpenAI, Atlassian, Google) where GitHub maintains direct verification relationships. These represent immediately usable credentials and carry higher urgency than generic non-provider keys (e.g. unassociated private RSA keys).

#### Dependabot (Software Supply Chain)
- **Severity**: Critical, High, Medium, Low severity classification.
- **EPSS (Exploit Prediction Scoring System)**: Quantifies the real-world probability that a vulnerability will be exploited in the wild. Higher EPSS scores identify vulnerabilities actively targeted by threat actors.
- **Relationship (Direct vs. Transitive)**: Direct dependencies are directly controllable and simpler to upgrade; transitive dependencies require upstream maintainer updates or dependency overrides.
- **Scope (Runtime vs. Development)**: Distinguishes between packages used only in development/test environments versus those deployed to production runtime. Runtime vulnerabilities carry significantly higher operational risk.
- **Patch Availability**: Indicates whether a remediated version is available for immediate upgrading.

---

### Step 2: Supplement with Organizational Context

GitHub metadata must be combined with organizational environment context to determine true enterprise risk. This context is attached to repositories via **GitHub Custom Properties**:

1. **Internet Facing (`internet_facing: boolean`)**: Publicly accessible services have significantly higher exposure and attack probability than internal-only microservices.
2. **Regulatory Compliance (`compliance: array`)**: Systems subject to FERPA, GDPR, HIPAA, or PCI DSS carry heightened legal, financial, and audit urgency.
3. **Business Criticality (`criticality: string`)**: Tiering repositories into Mission-Critical, High, Medium, or Low directs engineering focus to revenue-generating and core operational services.
4. **Number of Application Users (`user_count: number`)**: Applications serving thousands or millions of users present a much broader blast radius upon compromise.

---

### Step 3: Target High-Priority Alerts with Security Campaigns

Security campaigns group enriched alerts into focused, time-bound remediation initiatives across teams:

- **Targeted Subsets**: Campaigns isolate specific alert slices (e.g., all Critical CodeQL alerts with Copilot Autofix support, or all active secrets in internet-facing repositories within 30 days).
- **Automated Notifications**: Directs campaign updates to responsible engineering squad leads.
- **Clear Deadlines & Service Level Objectives (SLOs)**: Enforces binding remediation timeframes based on composite risk.
- **Centralized Tracking**: Leadership tracks burndown curves and measurable risk reduction metrics.

---

## Solution Details & Trade-offs

### Custom Property Management Overhead
Maintaining accurate custom properties across large repository fleets requires governance and automated synchronization from CMDBs or service catalogs. Outdated metadata leads to misplaced priorities.

### Alert Fatigue vs. Precision
Overusing security campaigns can lead to "priority fatigue." Organizations must balance campaign cadence, reserving urgent campaigns for high-impact risks while establishing steady-state triage for baseline tech debt.

### Resource Allocation Decisions
Avoid over-indexing exclusively on "easy wins" (e.g., only fixing Copilot Autofix alerts or direct dependencies). Ensure dedicated sprint capacity is allocated to complex architectural vulnerabilities and transitive dependencies.

### Security Campaign Platform Limitations
Native GitHub security campaigns operate primarily on code scanning and secret scanning alerts in GitHub Enterprise Cloud. Organizations managing Dependabot alerts or using GHES must augment native capabilities with automated CLI auditors and internal tracking engines.
