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
    "commitHash": "4f33810",
    "description": "Install linux native bindings for vitest and lightningcss on ubuntu runners"
  },
  {
    "version": "0.1.11",
    "date": "29.10.2026",
    "commitHash": "179e1c9",
    "description": "Record v0.1.1 checkpoint sync in changelog and document portal"
  },
  {
    "version": "0.1.10",
    "date": "29.10.2026",
    "commitHash": "a8a9595",
    "description": "Record push checkpoint workflow skill in changelog"
  },
  {
    "version": "0.1.9",
    "date": "29.10.2026",
    "commitHash": "4c1c22d",
    "description": "Establish snp-sms-push-checkpoint-workflow and update rules"
  },
  {
    "version": "0.1.8",
    "date": "29.10.2026",
    "commitHash": "ebf30c4",
    "description": "Record ownership transfer protocol commit in changelog"
  },
  {
    "version": "0.1.7",
    "date": "29.10.2026",
    "commitHash": "e99ffb9",
    "description": "Document future repository ownership transfer protocol and decoupled configuration standard"
  },
  {
    "version": "0.1.6",
    "date": "29.10.2026",
    "commitHash": "45d6f8d",
    "description": "Record repository standards commit in changelog and document portal"
  },
  {
    "version": "0.1.5",
    "date": "29.10.2026",
    "commitHash": "cb79653",
    "description": "Establish repository standards for README, LICENSE, Code of Conduct, Contributing, and Security policy"
  },
  {
    "version": "0.1.4",
    "date": "29.10.2026",
    "commitHash": "1f114d1",
    "description": "Record standardized github actions workflow commit"
  },
  {
    "version": "0.1.3",
    "date": "29.10.2026",
    "commitHash": "ba822c7",
    "description": "Standardize GitHub Actions CI workflow, hoist prettier tailwind plugin, add .prettierignore, and fix health liveness route test"
  },
  {
    "version": "0.1.2",
    "date": "29.10.2026",
    "commitHash": "9faa8fc",
    "description": "Record document design alignment commit to changelog"
  },
  {
    "version": "0.1.1",
    "date": "29.10.2026",
    "commitHash": "6af477a",
    "description": "Style(document): align Nextra hero typography, Bakong open api section hierarchy, and 100% light mode code blocks"
  }
];
