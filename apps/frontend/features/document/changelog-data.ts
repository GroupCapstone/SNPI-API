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
    "commitHash": "4dfc963",
    "description": "Add public design library and 10 core ui components showcase in developer portal"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "417bfea",
    "description": "Revert(frontend): remove applied dark mode and UI components from main code per instruction"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "1453c51",
    "description": "Consolidate design standards and 10 ui components into single folder"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "20e0388",
    "description": "Integrate all 10 core ui components across layout, pages, and interactive guide"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "a823461",
    "description": "Decommission api.kesararamwithdigital.tech and lock local-only endpoints"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "51ed131",
    "description": "Apply dark ui standards and 10 core ui components"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "048350c",
    "description": "Record 10 core ui components guide skill"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "6307f72",
    "description": "Record frontend folder architecture and dark ui design skill"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "8123890",
    "description": "Perf(backend): optimize seed script with insertMany batching for attendance and scores"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "d6ef58d",
    "description": "Resolve module import path and promise resolution in vercel serverless api handler"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "c974fd2",
    "description": "Codify enterprise code security, quality standards, and ai agents policy"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "4bea29b",
    "description": "Implement pre-push deployment and ci quality gate rule"
  }
];
