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
    "commitHash": "4bea29b",
    "description": "Implement pre-push deployment and ci quality gate rule"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "5a0b874",
    "description": "Supply super admin credentials for e2e api test suite"
  },
  {
    "version": "0.1.10",
    "date": "29.10.2026",
    "commitHash": "aadeb32",
    "description": "Configure serverless backend gateway, atlas connection pooling, and dynamic cors for temporary testing"
  },
  {
    "version": "0.1.9",
    "date": "29.10.2026",
    "commitHash": "3b40f7a",
    "description": "Ci(github): remove auto release workflow and preserve tag-only checkpoints"
  },
  {
    "version": "0.1.8",
    "date": "29.10.2026",
    "commitHash": "8c2c4bd",
    "description": "Record v0.1.7 release checkpoint in changelog and document portal"
  },
  {
    "version": "0.1.7",
    "date": "29.10.2026",
    "commitHash": "b43af76",
    "description": "Implement rfc 7807 problem details, idempotency middleware, hmac signing, etag and openapi 3.1 contract"
  },
  {
    "version": "0.1.6",
    "date": "29.10.2026",
    "commitHash": "61152a6",
    "description": "Record latest verification and push checkpoint in changelog"
  },
  {
    "version": "0.1.5",
    "date": "29.10.2026",
    "commitHash": "e0036aa",
    "description": "Remove unused Types import from certificate ledger test"
  },
  {
    "version": "0.1.4",
    "date": "29.10.2026",
    "commitHash": "d503f8f",
    "description": "Record v0.1.6 release checkpoint in changelog and document portal"
  },
  {
    "version": "0.1.3",
    "date": "29.10.2026",
    "commitHash": "4a14638",
    "description": "Implement github-inspired public verification api with cryptographic ledger proof and json viewer"
  },
  {
    "version": "0.1.2",
    "date": "29.10.2026",
    "commitHash": "1f8c6ca",
    "description": "Record enterprise standards update in changelog"
  },
  {
    "version": "0.1.1",
    "date": "29.10.2026",
    "commitHash": "5c09ed5",
    "description": "Add turborepo caching pipeline, adrs 0001-0005, boundary rules, and pre-commit gate"
  }
];
