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
    "commitHash": "a997f54",
    "description": "Integrate Google Fonts Sora, enlarged typography scale, and sticky Open API / Library navigation header"
  },
  {
    "version": "0.1.11",
    "date": "30.10.2026",
    "commitHash": "83d72c1",
    "description": "Apply geometric tag button style, chamfered shapes, and 2px card lines across docs"
  },
  {
    "version": "0.1.10",
    "date": "30.10.2026",
    "commitHash": "a1556a2",
    "description": "Enforce pure light mode, Sora font, card hover animation, and minimal navigation"
  },
  {
    "version": "0.1.9",
    "date": "30.10.2026",
    "commitHash": "8ff306d",
    "description": "Add Cloudflare-inspired 3-column layout, line tracker TOC, and schematic component gallery grid"
  },
  {
    "version": "0.1.8",
    "date": "30.10.2026",
    "commitHash": "421f376",
    "description": "Rollback previous theme and apply Royal Blue, Futurewave gradients, and Sora font"
  },
  {
    "version": "0.1.7",
    "date": "30.10.2026",
    "commitHash": "dd20d66",
    "description": "Add isolated custom font architecture with inter.ttf for docs subdomain"
  },
  {
    "version": "0.1.6",
    "date": "30.10.2026",
    "commitHash": "5c1a272",
    "description": "Apply Move Green and Signal Lime brand concept blueprint to docs subdomain"
  },
  {
    "version": "0.1.5",
    "date": "30.10.2026",
    "commitHash": "b803a8d",
    "description": "Codify snp-sms-local-domains-setup skill for automated and manual setup"
  },
  {
    "version": "0.1.4",
    "date": "30.10.2026",
    "commitHash": "68aace6",
    "description": "Record public ledger verification gateway"
  },
  {
    "version": "0.1.3",
    "date": "30.10.2026",
    "commitHash": "f995875",
    "description": "Add public ledger lookup gateway page and verify subdomain routing"
  },
  {
    "version": "0.1.2",
    "date": "30.10.2026",
    "commitHash": "49c4968",
    "description": "Record local subdomain reverse proxy and middleware support"
  },
  {
    "version": "0.1.1",
    "date": "30.10.2026",
    "commitHash": "4d25a83",
    "description": "Add local subdomain routing middleware, reverse proxy, and CORS origin support"
  }
];
