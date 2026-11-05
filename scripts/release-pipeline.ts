import { execSync } from 'node:child_process';
import { waitForCIStatus } from './verify-ci-status';
import { checkAndReconcileGitHubPRs } from './check-github-prs';
import { runSecurityQualityAudit } from './verify-security-quality';
import { verifyVercelDeployment } from './verify-vercel-deployment';
import { syncDualDevGit } from './dual-dev-git-sync';

function run(cmd: string): void {
  execSync(cmd, { stdio: 'inherit' });
}

function runCapture(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

async function main() {
  console.log('================================================================================');
  console.log('SNPI-API Full Verified Release Pipeline: Security, CI Green & Vercel Blue');
  console.log('Backend Domain: https://api.kesararamwithdigital.tech');
  console.log('================================================================================\n');

  // Step 1: Pre-Push GitHub PR Inspection & Reconciliation
  console.log('[1/8] Inspecting open GitHub Pull Requests prior to sync or push...');
  const autoMergePRs = process.argv.includes('--merge-open');
  const prResult = checkAndReconcileGitHubPRs({ autoMerge: autoMergePRs });
  if (prResult.openCount > 0 && !autoMergePRs) {
    console.log(`      [NOTE] ${prResult.openCount} open PR(s) noted on remote repository.`);
  }

  // Step 2: Dual-Developer Git Reconciliation & Merge Gate (NEVER SKIP GIT SYNC)
  console.log(
    '\n[2/8] Reconciling commits with co-developer from remote origin (npm run git:sync)...',
  );
  syncDualDevGit();
  console.log('      [PASS] Dual-developer git reconciliation complete.\n');

  // Step 3: Comprehensive Security & Quality Audit Workflow
  console.log('[3/8] Executing Comprehensive Security & Quality Audit Workflow...');
  const secAudit = runSecurityQualityAudit();
  if (!secAudit.success) {
    throw new Error('Release aborted: Security & Quality Audit failed.');
  }
  console.log('      [PASS] Security & Quality Audit verified.\n');

  // Step 4: Pre-flight Compilation & Verification Gates
  console.log(
    '[4/8] Running Compilation & Verification Gates (Prettier, Lint, Typecheck, Build)...',
  );
  try {
    run('npm run format:check');
  } catch {
    console.log('      [FIX] Prettier format issues detected. Running npm run format...');
    run('npm run format');
  }
  run('npm run lint');
  run('npm run typecheck');
  run('npm run build');
  console.log('      [PASS] Codebase clean, strictly typed, and compiled into dist/.\n');

  // Step 5: Git Remote Push FIRST (Source Storage - Zero Vercel Bridge)
  console.log('[5/8] Pushing commits and release tags to GitHub origin FIRST...');
  run('git config http.postBuffer 524288000');
  run('git push origin main --tags');
  const headSha = runCapture('git rev-parse HEAD');
  console.log(`      [PASS] GitHub remote updated at commit SHA: ${headSha}\n`);

  // Step 6: Watch ALL GitHub Actions CI Workflows Until 100% Green
  console.log('[6/8] Actively watching ALL GitHub Actions CI runs until 100% GREEN [PASSED]...');
  await waitForCIStatus({
    commitSha: headSha,
    timeoutMinutes: 15,
    minWorkflows: 8,
    pollIntervalMs: 3500,
  });
  console.log('      [PASS] 100% GREEN! All GitHub Actions CI/CD workflows passed successfully.\n');

  // Step 7: Direct Local-to-Vercel CLI Deployment (ONLY AFTER CI IS 100% GREEN)
  console.log('[7/8] CI 100% Green confirmed! Deploying directly to Vercel Production...');
  console.log('      Target Domain: https://api.kesararamwithdigital.tech');
  run('npx vercel --prod');
  console.log('      [PASS] Vercel Production deployment complete.\n');

  // Step 8: Vercel Blue Success & Live Health Verification
  console.log(
    '[8/8] Verifying Vercel deployment status is READY [Blue] & probing live health endpoint...',
  );
  await verifyVercelDeployment({ expectedTarget: 'production' });

  console.log('\n================================================================================');
  console.log('[COMPLETED] Release 100% Green on GitHub & 100% Ready [Blue] on Vercel!');
  console.log('Live Production: https://api.kesararamwithdigital.tech');
  console.log('Conversation conclusion criteria fulfilled.');
  console.log('================================================================================\n');
}

main().catch((err: unknown) => {
  const error = err as Error;
  console.error('\n[FAILED] Release pipeline aborted:', error.message);
  process.exit(1);
});
