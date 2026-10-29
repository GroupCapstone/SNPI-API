import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface ChangeLogItem {
  version: string;
  date: string;
  commitHash: string;
  description: string;
}

const ROOT_DIR = path.resolve(__dirname, '..');
const CHANGELOG_DATA_FILE = path.join(
  ROOT_DIR,
  'apps/frontend/features/document/changelog-data.ts',
);
const ROOT_CHANGELOG_MD = path.join(ROOT_DIR, 'CHANGELOG.md');

export const syncChangelog = (): void => {
  console.log('[Changelog] Extracting recent git commits for real-time document sync...');

  const gitOutput = execSync('git log -n 12 --pretty=format:"%h|%ad|%s" --date=format:"%d.%m.%Y"', {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
  });

  const lines = gitOutput.trim().split('\n').filter(Boolean);
  const items: ChangeLogItem[] = [];

  let minor = 1;
  let patch = lines.length;

  for (const line of lines) {
    const [hash, date, ...subjectParts] = line.split('|');
    const subject = subjectParts.join('|').trim();

    // Clean conventional commit prefix for readability
    const cleanDesc = subject
      .replace(/^(feat|fix|docs|refactor|test|chore)(\([^)]+\))?:\s*/i, '')
      .replace(/^./, (c) => c.toUpperCase());

    items.push({
      version: `0.${minor}.${patch}`,
      date: date.trim(),
      commitHash: hash.trim(),
      description: cleanDesc,
    });

    patch -= 1;
  }

  // 1. Write TypeScript file for live frontend /document page
  const tsContent = `export interface ChangeLogEntry {
  version: string;
  date: string;
  commitHash?: string;
  description: string;
}

export const CHANGE_LOGS: ChangeLogEntry[] = ${JSON.stringify(items, null, 2)};
`;

  fs.writeFileSync(CHANGELOG_DATA_FILE, tsContent, 'utf-8');
  console.log(`[Changelog] Successfully updated ${CHANGELOG_DATA_FILE} (${items.length} entries).`);

  // 2. Write root CHANGELOG.md
  let mdContent = `# SNP-SMS Changelog\n\nAll notable changes, commits, and skill updates are recorded here in real-time.\n\n`;
  for (const item of items) {
    mdContent += `### Version ${item.version} (${item.date}) - \`${item.commitHash}\`\n\n- ${item.description}\n\n`;
  }

  fs.writeFileSync(ROOT_CHANGELOG_MD, mdContent, 'utf-8');
  console.log(`[Changelog] Successfully updated ${ROOT_CHANGELOG_MD}.`);
};

if (require.main === module) {
  syncChangelog();
}
