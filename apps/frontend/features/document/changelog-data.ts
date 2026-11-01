export interface ChangeLogEntry {
  version: string;
  date: string;
  commitHash?: string;
  developer?: string;
  description: string;
}

export const CHANGE_LOGS: ChangeLogEntry[] = [
  {
    "version": "0.2.15",
    "date": "01.11.2026",
    "commitHash": "6e526a3",
    "developer": "史力爱卫",
    "description": "Resolve eslint minimatch conflict, sanitize secrets, and format telegram alerts"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "aa64a62",
    "developer": "史力爱卫",
    "description": "Bump monorepo version to v0.2.14"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "acaeca5",
    "developer": "史力爱卫",
    "description": "Format scripts and sync changelog for release checkpoint v0.2.14"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "4217c14",
    "developer": "史力爱卫",
    "description": "Consolidate all alerts into one single all-in-one status message and disable local commit hook"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "0997258",
    "developer": "史力爱卫",
    "description": "Enforce human-readable summaries and developer attribution across changelog and telegram alerts"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "96be3fd",
    "developer": "史力爱卫",
    "description": "Record Certificate Verification and Real-Time SSE removal"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "56d407a",
    "developer": "史力爱卫",
    "description": "Redesign alerts with clean human-readable short headers"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "d5e63ca",
    "developer": "史力爱卫",
    "description": "Format telegram repo watcher"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "237630a",
    "developer": "史力爱卫",
    "description": "Record Real-Time SSE Stream section removal"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "0cceac0",
    "developer": "史力爱卫",
    "description": "Delete Real-Time SSE Stream section and card from Open API view"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "8d1d574",
    "developer": "史力爱卫",
    "description": "Expand telegram watcher triggers to all branches, PRs, releases, and CI runs"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "1b22570",
    "developer": "史力爱卫",
    "description": "Migrate official repository owner to Tan-Saphea/SNPI-SMS"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "410a1b1",
    "developer": "史力爱卫",
    "description": "Support both single and double underscore token secrets in telegram watcher"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "d0e0dd8",
    "developer": "史力爱卫",
    "description": "Record README clean state"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "d670a24",
    "developer": "史力爱卫",
    "description": "Remove security remediation log from README per standard"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "af52d17",
    "developer": "史力爱卫",
    "description": "Record README security remediation section"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "e9af90d",
    "developer": "史力爱卫",
    "description": "Add standard security vulnerability remediation log to README"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "e70bf64",
    "developer": "史力爱卫",
    "description": "Sync security documentation report commit"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "4a46a37",
    "developer": "史力爱卫",
    "description": "Record security audit and remediation report history"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "4ad793d",
    "developer": "史力爱卫",
    "description": "Record security patch in documentation"
  },
  {
    "version": "0.2.14",
    "date": "01.11.2026",
    "commitHash": "190ac14",
    "developer": "史力爱卫",
    "description": "Resolve CVE-2026-118764 minimatch DoS across workspaces"
  },
  {
    "version": "0.2.14",
    "date": "31.10.2026",
    "commitHash": "dc26051",
    "developer": "史力爱卫",
    "description": "Pretty-print code blocks with syntax highlighting and bakong-inspired layout"
  },
  {
    "version": "0.2.14",
    "date": "31.10.2026",
    "commitHash": "c127141",
    "developer": "史力爱卫",
    "description": "Remove class catalog, certificate ledger, and rest api directory sections"
  },
  {
    "version": "0.2.14",
    "date": "31.10.2026",
    "commitHash": "cfdd732",
    "developer": "史力爱卫",
    "description": "Redesign 4 service cards with prominent top icon, protocol pill, and route capsule"
  },
  {
    "version": "0.2.14",
    "date": "31.10.2026",
    "commitHash": "c9ae516",
    "developer": "史力爱卫",
    "description": "Streamline mobile navigation and cleanup demo viewports"
  }
];
