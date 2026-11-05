import { execSync } from 'node:child_process';
import { getRemoteRepo } from './verify-ci-status';

export interface GitHubPullRequest {
  number: number;
  title: string;
  author: {
    login: string;
    is_bot?: boolean;
  };
  headRefName: string;
  mergeable: string;
}

function run(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message: string };
    throw new Error(error.stderr || error.stdout || error.message);
  }
}

export function checkAndReconcileGitHubPRs(options?: { autoMerge?: boolean; repo?: string }): {
  openCount: number;
  mergedCount: number;
  prs: GitHubPullRequest[];
} {
  const repo =
    options?.repo ||
    getRemoteRepo('origin') ||
    getRemoteRepo('groupcapstone') ||
    'GroupCapstone/SNPI-API';
  const autoMerge = options?.autoMerge ?? process.argv.includes('--merge-open');

  console.log('======================================================');
  console.log('SNPI-API Pre-Push GitHub PR Inspection & Reconcile Gate');
  console.log('======================================================');
  console.log(`Repository: ${repo}`);
  console.log(`Auto-Merge: ${autoMerge ? 'ENABLED' : 'DISABLED (inspection only)'}`);
  console.log('======================================================\n');

  let prs: GitHubPullRequest[] = [];
  try {
    const output = run(
      `gh pr list -R ${repo} --state open --json number,title,author,headRefName,mergeable`,
    );
    prs = JSON.parse(output) as GitHubPullRequest[];
  } catch (err: unknown) {
    const error = err as Error;
    console.warn(`[WARN] Unable to list open PRs via gh CLI: ${error.message.split('\n')[0]}`);
    return { openCount: 0, mergedCount: 0, prs: [] };
  }

  if (prs.length === 0) {
    console.log('[PASS] Zero open PRs detected on GitHub. Main branch is ready for sync.\n');
    return { openCount: 0, mergedCount: 0, prs: [] };
  }

  console.log(`[INFO] Found ${prs.length} open pull request(s) on ${repo}:\n`);
  console.log('--------------------------------------------------------------------------------');
  console.log('  #   | MERGEABLE | AUTHOR               | TITLE');
  console.log('--------------------------------------------------------------------------------');
  for (const pr of prs) {
    const num = `#${pr.number}`.padEnd(5);
    const m = pr.mergeable.padEnd(9);
    const author = (pr.author?.login || 'unknown').padEnd(20);
    const title = pr.title.length > 40 ? `${pr.title.slice(0, 37)}...` : pr.title;
    console.log(`  ${num} | ${m} | ${author} | ${title}`);
  }
  console.log('--------------------------------------------------------------------------------\n');

  let mergedCount = 0;
  if (autoMerge) {
    console.log('[SYNC] Auto-merging mergeable open PRs into main...');
    for (const pr of prs) {
      if (pr.mergeable === 'MERGEABLE') {
        try {
          console.log(`       Attempting auto-merge for PR #${pr.number} (${pr.title})...`);
          run(`gh pr merge ${pr.number} -R ${repo} --merge --admin --auto`);
          console.log(`       [PASS] PR #${pr.number} merged successfully.`);
          mergedCount++;
        } catch (mergeErr: unknown) {
          const error = mergeErr as Error;
          console.warn(
            `       [WARN] Could not auto-merge PR #${pr.number}: ${error.message.split('\n')[0]}`,
          );
        }
      } else {
        console.warn(
          `       [WARN] PR #${pr.number} is ${pr.mergeable} (not cleanly mergeable). Skipping.`,
        );
      }
    }

    if (mergedCount > 0) {
      console.log(
        `\n[SYNC] ${mergedCount} PR(s) merged into remote main. Running dual-developer git sync...`,
      );
      try {
        run('npm run git:sync');
        console.log('[PASS] Local branch synchronized with newly merged PR commits.\n');
      } catch (syncErr: unknown) {
        console.warn(`[WARN] Post-PR sync notice: ${(syncErr as Error).message}`);
      }
    }
  } else {
    console.log('[NOTE] To automatically merge open PRs, pass --merge-open flag.');
    console.log(
      '       Please review open PRs before pushing to avoid overwriting or diverging.\n',
    );
  }

  return { openCount: prs.length, mergedCount, prs };
}

if (require.main === module) {
  try {
    const res = checkAndReconcileGitHubPRs();
    if (res.openCount > 0 && res.mergedCount === 0 && !process.argv.includes('--allow-open')) {
      console.log(
        '[INFO] Open PRs exist. Note: Git sync will ensure local HEAD tracks remote origin/main.\n',
      );
    }
    process.exit(0);
  } catch (err: unknown) {
    console.error(`[FAILED] PR check error: ${(err as Error).message}`);
    process.exit(1);
  }
}
