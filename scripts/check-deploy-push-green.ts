import { execSync } from 'node:child_process';
import { waitForCIStatus, getRemoteRepo } from './verify-ci-status';

function run(cmd: string, echo = false): string {
  if (echo) {
    console.log(`> ${cmd}`);
  }
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message: string };
    throw new Error(error.stderr || error.stdout || error.message);
  }
}

export async function checkDeployPushGreen(): Promise<void> {
  const args = process.argv.slice(2);
  const skipCiWait = args.includes('--skip-ci-wait');
  const dryRun = args.includes('--dry-run');

  let messageArg = '';
  const msgIdx = args.indexOf('--message');
  if (msgIdx !== -1 && args[msgIdx + 1]) {
    messageArg = args[msgIdx + 1];
  }

  let remoteArg = '';
  const remoteIdx = args.indexOf('--remote');
  if (remoteIdx !== -1 && args[remoteIdx + 1]) {
    remoteArg = args[remoteIdx + 1];
  }

  console.log('================================================================');
  console.log('SNPI-API Standard Check, Deploy, Push & Green Verification Gate');
  console.log('================================================================\n');

  // Gate 1: Code Formatting Audit & Auto-Fix
  console.log('[1/10] Verifying code formatting (Prettier)...');
  try {
    run('npm run format:check');
    console.log('       [PASS] Code formatting is 100% compliant.');
  } catch {
    console.log('       [FIX] Prettier format issues detected. Running npm run format...');
    run('npm run format');
    console.log('       [PASS] Code formatted successfully.');
  }

  // Gate 2: Full ESLint Quality Gate
  console.log('\n[2/10] Running ESLint Quality Gate...');
  try {
    run('npm run lint');
    console.log('       [PASS] ESLint passed with 0 errors.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('       [FAILED] ESLint checks failed:');
    console.error(error.message);
    throw new Error('Push blocked by ESLint Quality Gate.');
  }

  // Gate 3: TypeScript Static Analysis
  console.log('\n[3/10] Running TypeScript static typecheck (tsc --noEmit)...');
  try {
    run('npm run typecheck');
    console.log('       [PASS] TypeScript static analysis passed with 0 errors.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('       [FAILED] TypeScript typecheck failed:');
    console.error(error.message);
    throw new Error('Push blocked by TypeScript Quality Gate.');
  }

  // Gate 4: Production Build
  console.log('\n[4/10] Verifying production bundle compilation (npm run build)...');
  try {
    run('npm run build');
    console.log('       [PASS] Production build compiled with 0 errors.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('       [FAILED] Production build failed:');
    console.error(error.message);
    throw new Error('Push blocked by Production Build Gate.');
  }

  // Gate 5: Vitest Test Suite
  console.log('\n[5/10] Executing Vitest unit & integration test suites...');
  try {
    run('npm test');
    console.log('       [PASS] All test suites passed.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('       [FAILED] Tests failed:');
    console.error(error.message);
    throw new Error('Push blocked by Vitest Test Suite.');
  }

  // Gate 6: Smoke Health Probe
  console.log('\n[6/10] Executing smoke verification probe...');
  try {
    run('npm run smoke');
    console.log('       [PASS] Smoke verification passed.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('       [FAILED] Smoke verification failed:');
    console.error(error.message);
    throw new Error('Push blocked by Smoke Verification Gate.');
  }

  // Gate 7: Deployment Manifest & Health Check Gate
  console.log('\n[7/10] Verifying deployment manifests & cloud infrastructure configuration...');
  try {
    process.env.ALLOW_FIX = '1';
    run('npm run deploy:verify');
    console.log('       [PASS] Deployment manifests verified.');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('       [FAILED] Deployment verification failed:');
    console.error(error.message);
    throw new Error('Push blocked by Deployment Verification Gate.');
  }

  // Gate 8: Dual-Developer Git Reconciliation & Merge Gate
  console.log('\n[8/10] Checking dual-developer git reconciliation...');
  try {
    run('npm run git:sync');
    console.log('       [PASS] Local branch synchronized with remote collaborator commits.');
  } catch (err: unknown) {
    const error = err as Error;
    console.warn(
      '       [WARN] Git sync skipped or encountered non-blocking notice:',
      error.message,
    );
  }

  // Gate 9: Commit & Remote Push
  console.log('\n[9/10] Staging modifications and pushing to GitHub remotes...');
  const statusOutput = run('git status --porcelain');
  const currentBranch = run('git rev-parse --abbrev-ref HEAD');

  if (statusOutput.length > 0) {
    console.log('       Uncommitted changes detected in working tree. Staging and committing...');
    run('git add -A');
    let commitMsg = messageArg || 'feat(api): automated checkpoint and quality gate pass';
    if (
      !commitMsg.startsWith('feat(api') &&
      !commitMsg.startsWith('fix(api') &&
      !commitMsg.startsWith('docs(api') &&
      !commitMsg.startsWith('chore(api')
    ) {
      commitMsg = `feat(api): ${commitMsg}`;
    }
    run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    console.log(`       [PASS] Committed: "${commitMsg}"`);
  } else {
    console.log('       Working tree clean. No uncommitted modifications.');
  }

  const headSha = run('git rev-parse HEAD');
  console.log(`       Target HEAD Commit SHA: ${headSha}`);

  if (dryRun) {
    console.log('\n[DRY RUN] All quality gates passed. Skipping remote push.');
    return;
  }

  // Determine remotes to push
  const availableRemotes = run('git remote')
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean);
  const targetRemotes: string[] = [];

  if (remoteArg) {
    targetRemotes.push(remoteArg);
  } else {
    if (availableRemotes.includes('groupcapstone')) {
      targetRemotes.push('groupcapstone');
    }
    if (availableRemotes.includes('origin')) {
      targetRemotes.push('origin');
    }
    if (targetRemotes.length === 0 && availableRemotes.length > 0) {
      targetRemotes.push(availableRemotes[0]);
    }
  }

  run('git config http.postBuffer 524288000');
  for (const r of targetRemotes) {
    console.log(`       Pushing ${currentBranch} to remote "${r}"...`);
    try {
      run(`git push ${r} ${currentBranch}`);
      console.log(`       [PASS] Pushed to ${r}/${currentBranch}.`);
    } catch (pushErr: unknown) {
      console.warn(`       [WARN] Push to ${r} failed: ${(pushErr as Error).message}`);
    }
  }

  if (skipCiWait) {
    console.log('\n[INFO] Skipping CI wait as --skip-ci-wait flag was provided.');
    return;
  }

  // Gate 10: Real-time GitHub Actions CI Monitoring Until 100% Green
  console.log(
    '\n[10/10] Initiating automated live monitoring of GitHub Actions CI/CD workflows...',
  );
  const repoToMonitor = targetRemotes.includes('groupcapstone')
    ? getRemoteRepo('groupcapstone')
    : getRemoteRepo('origin');

  await waitForCIStatus({
    commitSha: headSha,
    repo: repoToMonitor,
    pollIntervalMs: 10000,
    timeoutMinutes: 15,
    minWorkflows: 6,
  });

  console.log('\n================================================================');
  console.log('[COMPLETED] Standard check, deploy, push & 100% green verified!');
  console.log('================================================================\n');
}

if (require.main === module) {
  checkDeployPushGreen()
    .then(() => {
      process.exit(0);
    })
    .catch((err: Error) => {
      console.error(`\n[FAILED] Pipeline aborted: ${err.message}`);
      process.exit(1);
    });
}
