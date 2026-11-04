export interface ChangeLogEntry {
  version: string;
  date: string;
  commitHash?: string;
  developer?: string;
  description: string;
}

export const CHANGE_LOGS: ChangeLogEntry[] = [
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "4c5628c",
    "developer": "史力爱卫",
    "description": "Align feed sequence in lockstep with sidebar parent range and child lists"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "d007ade",
    "developer": "史力爱卫",
    "description": "Add liquid glass parent icon circles, auto-dropdown accordion on scroll, and auto-centering in sidebar"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "e9710dd",
    "developer": "史力爱卫",
    "description": "Redesign floating label form and multi-step wizard with fluid water progress and brand dropdowns"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "fc42d97",
    "developer": "史力爱卫",
    "description": "Redesign VoiceNote with real Web Audio synthesis and live reactive AnalyserNode waveform"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "f065b4a",
    "developer": "史力爱卫",
    "description": "Add animated connection loading lines and step-to-step transitions to StepPlayer"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "d58e20a",
    "developer": "史力爱卫",
    "description": "Format feedback-demos with prettier"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "8465821",
    "developer": "史力爱卫",
    "description": "Redesign status page with clean status code and title only, remove descriptions and style archetypes"
  },
  {
    "version": "0.2.17",
    "date": "04.11.2026",
    "commitHash": "3939f12",
    "developer": "史力爱卫",
    "description": "Redesign dropdown selector with clean brand tokens, white card surfaces, and zero indicator dots"
  },
  {
    "version": "0.2.22",
    "date": "04.11.2026",
    "commitHash": "9702289",
    "developer": "史力爱卫",
    "description": "Checkpoint & live ci deploy verification [PASSED]"
  },
  {
    "version": "0.2.22",
    "date": "04.11.2026",
    "commitHash": "2585f81",
    "developer": "史力爱卫",
    "description": "Add build:shared and liveness timeout check to e2e daemon"
  },
  {
    "version": "0.2.21",
    "date": "04.11.2026",
    "commitHash": "2a539c2",
    "developer": "史力爱卫",
    "description": "Checkpoint & live ci deploy verification [PASSED]"
  },
  {
    "version": "0.2.21",
    "date": "04.11.2026",
    "commitHash": "9a73765",
    "developer": "史力爱卫",
    "description": "Synchronize real-time changelog and prettier formatting"
  },
  {
    "version": "0.2.21",
    "date": "04.11.2026",
    "commitHash": "f79c40c",
    "developer": "史力爱卫",
    "description": "Remove card background tints, enforce clean white surface with 4px border radius"
  },
  {
    "version": "0.2.21",
    "date": "04.11.2026",
    "commitHash": "29c1be3",
    "developer": "史力爱卫",
    "description": "Perf(api): optimize resource reading speed and query serialization across feature modules"
  },
  {
    "version": "0.2.21",
    "date": "04.11.2026",
    "commitHash": "00a8b53",
    "developer": "史力爱卫",
    "description": "Perf(api-client): optimize header allocation, active branch caching, and query string compilation"
  },
  {
    "version": "0.2.21",
    "date": "04.11.2026",
    "commitHash": "2e8b66a",
    "developer": "史力爱卫",
    "description": "Add agent skill routing index, governance policies, and query parameters utility"
  },
  {
    "version": "0.2.21",
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
  }
];
