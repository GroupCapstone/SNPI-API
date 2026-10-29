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
    "commitHash": "4a14638",
    "description": "Implement github-inspired public verification api with cryptographic ledger proof and json viewer"
  },
  {
    "version": "0.1.11",
    "date": "29.10.2026",
    "commitHash": "1f8c6ca",
    "description": "Record enterprise standards update in changelog"
  },
  {
    "version": "0.1.10",
    "date": "29.10.2026",
    "commitHash": "5c09ed5",
    "description": "Add turborepo caching pipeline, adrs 0001-0005, boundary rules, and pre-commit gate"
  },
  {
    "version": "0.1.9",
    "date": "29.10.2026",
    "commitHash": "f3077e7",
    "description": "Record v0.1.4 release checkpoint in changelog and document portal"
  },
  {
    "version": "0.1.8",
    "date": "29.10.2026",
    "commitHash": "fa62bc0",
    "description": "Add repository standards, issue chooser, pr labeler, license compliance, and runtime pin"
  },
  {
    "version": "0.1.7",
    "date": "29.10.2026",
    "commitHash": "b0c227d",
    "description": "Record docker build fix in changelog and document portal"
  },
  {
    "version": "0.1.6",
    "date": "29.10.2026",
    "commitHash": "ac50766",
    "description": "Configure monorepo root context and multi-stage backend container build"
  },
  {
    "version": "0.1.5",
    "date": "29.10.2026",
    "commitHash": "075b74e",
    "description": "Record github enterprise workflow suite addition in changelog"
  },
  {
    "version": "0.1.4",
    "date": "29.10.2026",
    "commitHash": "a927611",
    "description": "Ci(github): add comprehensive enterprise workflows, codeowners, copilot instructions, and issue templates"
  },
  {
    "version": "0.1.3",
    "date": "29.10.2026",
    "commitHash": "249ac96",
    "description": "Record v0.1.2 checkpoint in changelog and document portal"
  },
  {
    "version": "0.1.2",
    "date": "29.10.2026",
    "commitHash": "1ccdea6",
    "description": "Record linux native binding fix in changelog and document portal"
  },
  {
    "version": "0.1.1",
    "date": "29.10.2026",
    "commitHash": "4f33810",
    "description": "Install linux native bindings for vitest and lightningcss on ubuntu runners"
  }
];
