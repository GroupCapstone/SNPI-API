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
    "commitHash": "ac50766",
    "description": "Configure monorepo root context and multi-stage backend container build"
  },
  {
    "version": "0.1.11",
    "date": "29.10.2026",
    "commitHash": "075b74e",
    "description": "Record github enterprise workflow suite addition in changelog"
  },
  {
    "version": "0.1.10",
    "date": "29.10.2026",
    "commitHash": "a927611",
    "description": "Ci(github): add comprehensive enterprise workflows, codeowners, copilot instructions, and issue templates"
  },
  {
    "version": "0.1.9",
    "date": "29.10.2026",
    "commitHash": "249ac96",
    "description": "Record v0.1.2 checkpoint in changelog and document portal"
  },
  {
    "version": "0.1.8",
    "date": "29.10.2026",
    "commitHash": "1ccdea6",
    "description": "Record linux native binding fix in changelog and document portal"
  },
  {
    "version": "0.1.7",
    "date": "29.10.2026",
    "commitHash": "4f33810",
    "description": "Install linux native bindings for vitest and lightningcss on ubuntu runners"
  },
  {
    "version": "0.1.6",
    "date": "29.10.2026",
    "commitHash": "179e1c9",
    "description": "Record v0.1.1 checkpoint sync in changelog and document portal"
  },
  {
    "version": "0.1.5",
    "date": "29.10.2026",
    "commitHash": "a8a9595",
    "description": "Record push checkpoint workflow skill in changelog"
  },
  {
    "version": "0.1.4",
    "date": "29.10.2026",
    "commitHash": "4c1c22d",
    "description": "Establish snp-sms-push-checkpoint-workflow and update rules"
  },
  {
    "version": "0.1.3",
    "date": "29.10.2026",
    "commitHash": "ebf30c4",
    "description": "Record ownership transfer protocol commit in changelog"
  },
  {
    "version": "0.1.2",
    "date": "29.10.2026",
    "commitHash": "e99ffb9",
    "description": "Document future repository ownership transfer protocol and decoupled configuration standard"
  },
  {
    "version": "0.1.1",
    "date": "29.10.2026",
    "commitHash": "45d6f8d",
    "description": "Record repository standards commit in changelog and document portal"
  }
];
