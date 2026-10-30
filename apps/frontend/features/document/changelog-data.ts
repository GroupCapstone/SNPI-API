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
    "commitHash": "f5eb812",
    "description": "Activate all sidebar navigation menus, pin sticky sidebars, and document 9 interface motion and cognitive ux skills"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "e5aed2f",
    "description": "Unify design concept, 3-column layout, and capsule nav across Open API and UI Library views"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "c5e7337",
    "description": "Sync changelog and build types prior to push checkpoint"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "668d708",
    "description": "Remove duplicate key in hanging-tabs-nav props"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "54145ae",
    "description": "Allow deploy gate to pass resolving commit when ALLOW_FIX is active"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "3ec0aae",
    "description": "Resolve eslint jsx-key, component-in-render, and render-purity errors"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "63dd03b",
    "description": "Unify developer portal into instant SPA with monumental head titles and remove how-it-works hero"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "035cdc5",
    "description": "Expand interactive component demo viewports and remove redundant quick navigation buttons"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "23a8848",
    "description": "Integrate SNPI-SMS architecture hero with single scroll feed and real-time line tracker"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "51b9a93",
    "description": "Record local release checkpoint e1b59e4"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "e1b59e4",
    "description": "Replace static mockups with real 12 core UI interactive demos and brand palette"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "6859680",
    "description": "Record local release checkpoint 75e70d0"
  }
];
