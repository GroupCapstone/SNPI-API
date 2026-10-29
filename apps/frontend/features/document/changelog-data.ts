export interface ChangeLogEntry {
  version: string;
  date: string;
  commitHash?: string;
  description: string;
}

export const CHANGE_LOGS: ChangeLogEntry[] = [
  {
    "version": "0.1.12",
    "date": "29.10.2026",
    "commitHash": "28ef01b",
    "description": "Synchronize changelog for initial private release checkpoint"
  },
  {
    "version": "0.1.11",
    "date": "29.10.2026",
    "commitHash": "15fe977",
    "description": "Add heavy media and database file exclusions to gitignore"
  },
  {
    "version": "0.1.10",
    "date": "29.10.2026",
    "commitHash": "33fc507",
    "description": "Synchronize latest commit to live document and CHANGELOG.md"
  },
  {
    "version": "0.1.9",
    "date": "29.10.2026",
    "commitHash": "d8b127e",
    "description": "Establish automated real-time changelog synchronization skill, script, and live document integration"
  },
  {
    "version": "0.1.8",
    "date": "29.10.2026",
    "commitHash": "b2a1270",
    "description": "Enforce 100% pure white light-mode design across document portal"
  },
  {
    "version": "0.1.7",
    "date": "29.10.2026",
    "commitHash": "c945865",
    "description": "Name portal as document, add endpoint access tiers, who can access matrix, and protected mutation guardrails"
  },
  {
    "version": "0.1.6",
    "date": "29.10.2026",
    "commitHash": "fc458cb",
    "description": "Redesign developer documentation with On-This-Page layout, change logs, and technical specification structure"
  },
  {
    "version": "0.1.5",
    "date": "29.10.2026",
    "commitHash": "d8eca0b",
    "description": "Rebuild developer portal at /developers with streamlined 4-section layout"
  },
  {
    "version": "0.1.4",
    "date": "29.10.2026",
    "commitHash": "f6a733a",
    "description": "Implement Nextra-style developer documentation portal at /docs"
  },
  {
    "version": "0.1.3",
    "date": "29.10.2026",
    "commitHash": "6bba7ee",
    "description": "Implement connection pooling bounds, liveness probe, and keepalive timeouts"
  },
  {
    "version": "0.1.2",
    "date": "29.10.2026",
    "commitHash": "36845de",
    "description": "Record snp-sms monorepo architecture skill and root agent guidelines"
  },
  {
    "version": "0.1.1",
    "date": "29.10.2026",
    "commitHash": "9a76b96",
    "description": "Add automated live api test suite covering all 47 modules"
  }
];
