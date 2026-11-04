export interface ChangeLogEntry {
  version: string;
  date: string;
  commitHash?: string;
  developer?: string;
  description: string;
}

export const CHANGE_LOGS: ChangeLogEntry[] = [
  {
    version: 'Unreleased',
    date: '04.11.2026',
    developer: 'Codex',
    description: 'Optimize agent skill routing and task-scoped context loading while retaining all resources',
  },
  {
    "version": "0.2.17",
    "date": "03.11.2026",
    "commitHash": "7e103eb",
    "developer": "史力爱卫",
    "description": "Update stale action SHA pins & build shared before smoke"
  },
  {
    "version": "0.2.20",
    "date": "03.11.2026",
    "commitHash": "fce1f03",
    "developer": "史力爱卫",
    "description": "Correct docker build-push-action sha pinning & verify all workflows"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "e0a23f5",
    "developer": "史力爱卫",
    "description": "Implement appsec design principles, large repo optimization & resilient cicd continuity"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "a4349a6",
    "developer": "史力爱卫",
    "description": "Implement repository architecture strategy, monorepo boundaries & alternate deployment continuity"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "df99922",
    "developer": "史力爱卫",
    "description": "Sync verbatim github repository threat model reference and TA-01-TA-09 actor taxonomy"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "265b462",
    "developer": "史力爱卫",
    "description": "Implement enforce ghas at scale, push ruleset bypass prevention & dependency review gates"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "b07d908",
    "developer": "史力爱卫",
    "description": "Implement securing github actions workflows, 40-char sha pinning & script injection defense"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "a59bce1",
    "developer": "史力爱卫",
    "description": "Sync changelog for dependency supply chain defense"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "9f14394",
    "developer": "史力爱卫",
    "description": "Implement 6-layer dependency supply chain defense standard & automated verification"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "485f0b0",
    "developer": "史力爱卫",
    "description": "Add unified verify:all-standards command for all enterprise standards"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "eb81feb",
    "developer": "史力爱卫",
    "description": "Implement github repository threat model (T-01 to T-08), danger zone governance & ruleset defenses"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "63a9dcf",
    "developer": "史力爱卫",
    "description": "Wire private networking into pre-push quality gates, deploy workflows & internal endpoints"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "f4f0003",
    "developer": "史力爱卫",
    "description": "Implement actions private networking, azure vnet injection & firewall fqdn standards"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "4225b26",
    "developer": "史力爱卫",
    "description": "Real-time changelog sync for primary appsec skill"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "febce6b",
    "developer": "史力爱卫",
    "description": "Establish primary Application Security Design Principles skill & agent bindings"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "c9e1343",
    "developer": "史力爱卫",
    "description": "Sync resilience mirroring changelog entry"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "e4f59ac",
    "developer": "史力爱卫",
    "description": "Record application security principles commit"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "0e6083f",
    "developer": "史力爱卫",
    "description": "Record enterprise application security design principles & maturity framework"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "6c6675d",
    "developer": "史力爱卫",
    "description": "Sync changelog for safe folder archiving"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "6a9f0fe",
    "developer": "史力爱卫",
    "description": "Archive Git LFS article and standard plaintext in safe folders"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "cca75ce",
    "developer": "史力爱卫",
    "description": "Record ARC and git lfs updates in AGENTS.md and agent specs"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "858d883",
    "developer": "史力爱卫",
    "description": "Record actions runner controller architecture guide"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "838f934",
    "developer": "史力爱卫",
    "description": "Sync changelog"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "3559b00",
    "developer": "史力爱卫",
    "description": "Add verify:arc script command"
  },
  {
    "version": "0.2.19",
    "date": "03.11.2026",
    "commitHash": "cf69ccd",
    "developer": "史力爱卫",
    "description": "Refine DinD privilege separation regex check in ARC verification script"
  }
];
