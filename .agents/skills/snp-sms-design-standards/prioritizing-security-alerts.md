# Security Alert Prioritization Standard (Agent Mirror)

This mirror document provides autonomous agents with rapid operational access to the 3-step alert prioritization model.

## Core Rules for Autonomous Agents

1. **Never Triage by Raw Severity Alone**: Always evaluate severity alongside EPSS exploit probability and production runtime scope.
2. **Prioritize Active Secrets Immediately**: Valid/active secret scanning alerts represent live credentials and must be treated as `[P0]` emergencies.
3. **Respect Organizational Context**: Repositories marked `internet_facing: true` or `business_criticality: mission-critical` receive strict prioritization multipliers.
4. **Enforce Campaign Deadlines**: Remediate alerts within binding campaign SLOs (P0 = 7 days, P1 = 14 days, P2 = 30 days).
5. **Zero Emojis**: All audit outputs, commit messages, and logs must use textual status badges (`[PASSED]`, `[FAILED]`, `[WARNING]`, `[P0]`, `[P1]`).
6. **Automated Verification**: Run `npm run verify:alert-prio` before marking security remediation campaigns complete.
