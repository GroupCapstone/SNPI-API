export interface ChangeLogEntry {
  version: string;
  date: string;
  commitHash?: string;
  description: string;
}

export const CHANGE_LOGS: ChangeLogEntry[] = [
  {
    "version": "0.1.12",
    "date": "30.10.2026",
    "commitHash": "f995875",
    "description": "Add public ledger lookup gateway page and verify subdomain routing"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "49c4968",
    "description": "Record local subdomain reverse proxy and middleware support"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "4d25a83",
    "description": "Add local subdomain routing middleware, reverse proxy, and CORS origin support"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "21f4c8b",
    "description": "Record skill filename consolidation to 10-ui-components.md"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "348a5aa",
    "description": "Consolidate to single specific filename 10-ui-components.md and remove symlink"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "72ca1b1",
    "description": "Record prettier formatting quality gate fix"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "f364686",
    "description": "Format documentation, agent rules, and ui-library components with prettier"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "8f3b4be",
    "description": "Codify mandatory local-only commits and zero git push without explicit user command"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "89b03c9",
    "description": "Transform design system into extensible component library with category navigation"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "3ba6be9",
    "description": "Remove repeated branding words from document navigation bar"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "a72b8a5",
    "description": "Convert design library and 10 ui components to default white document style"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "75a7abc",
    "description": "Record developer library protocol commit"
  }
];
