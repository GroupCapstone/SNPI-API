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
    "commitHash": "6859680",
    "description": "Record local release checkpoint 75e70d0"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "75e70d0",
    "description": "Redesign TOC scroll tracker, modernize tables into cards, relocate changelog, and adapt light footer"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "ff47186",
    "description": "Remove redundant introductory header block and in-page top nav section"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "11693b7",
    "description": "Enforce strict 5-color and 2-gradient brand palette and implement morphic timeline footer"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "2012656",
    "description": "Streamline top nav, accelerate route switching, eradicate input focus outline, and refine sleek real-time line tracker"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "a9ec589",
    "description": "Implement dedicated interactive demos, 8-section layout, and capsule pill search input with brand palette"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "2550b94",
    "description": "Enforce credential privacy rule, rename SNP to SNPI, and implement real-time scroll loading tracker line"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "0c80413",
    "description": "Remove background color behind icons, introduce GeometricInput, and accelerate navbar transitions"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "7412881",
    "description": "Center top navigation, remove number labels, and apply capsule pill button style"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "4f28543",
    "description": "Sync changelog and build types prior to push checkpoint"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "1b5e3df",
    "description": "Sync changelog with hanging top navigation feature"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "0f1ad56",
    "description": "Add hanging trapezoid top navigation style with notification badges"
  }
];
