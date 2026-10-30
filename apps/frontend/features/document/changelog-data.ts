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
    "commitHash": "085697d",
    "description": "Redesign native Snackbar component with bottom-center anchor, obsidian surface, progress countdown, and action recovery"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "28fa0e3",
    "description": "Remove background outlined watermark words and clutter elements from UI Library and Open API headers"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "ca270d5",
    "description": "Add Component Templates for Backgrounds, Text Effects, Cards, Sections, Forms, and Overlays with Rare UI capsule dock navigation copy style"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "f03bb47",
    "description": "Add 28 interactive components across 5 categories with responsive Web/Phone preview"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "b56feb8",
    "description": "Style(docs): apply #E3E7FC header background, remove github button, and remove design standard badge from demo"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "e1cadf4",
    "description": "Style(ui-library): streamline hero card with bold title, ultra-short component descriptions, and direct sidebar components list"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "cfc9d95",
    "description": "Resolve Open API navigation glitch and hanging tabs click suppression"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "220a601",
    "description": "Provide complete 52-collection test data seeder and self-protect deletion script"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "71edb9e",
    "description": "Resolve production vercel builds for frontend and backend with shared package compilation"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "ee6ae19",
    "description": "Configure app.kesararamwithdigital.tech and api.kesararamwithdigital.tech temporary domains"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "10b3646",
    "description": "Ignore .vercel directory for clean teardown"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "847e12b",
    "description": "Remove verify and portal subdomains, proxy routes, and /verify web page"
  }
];
