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
    "commitHash": "ee6ae19",
    "description": "Configure app.kesararamwithdigital.tech and api.kesararamwithdigital.tech temporary domains"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "10b3646",
    "description": "Ignore .vercel directory for clean teardown"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "847e12b",
    "description": "Remove verify and portal subdomains, proxy routes, and /verify web page"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "c5e3dd8",
    "description": "Format AGENTS.md table style with prettier and sync changelog"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "bf94507",
    "description": "Consolidate 21 design manuals into single folder architecture (v0.2.5)"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "a9859ab",
    "description": "Synchronize real-time changelog and technical portal"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "f5eb812",
    "description": "Activate all sidebar navigation menus, pin sticky sidebars, and document 9 interface motion and cognitive ux skills"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "e5aed2f",
    "description": "Unify design concept, 3-column layout, and capsule nav across Open API and UI Library views"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "c5e7337",
    "description": "Sync changelog and build types prior to push checkpoint"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "668d708",
    "description": "Remove duplicate key in hanging-tabs-nav props"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "54145ae",
    "description": "Allow deploy gate to pass resolving commit when ALLOW_FIX is active"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "3ec0aae",
    "description": "Resolve eslint jsx-key, component-in-render, and render-purity errors"
  }
];
