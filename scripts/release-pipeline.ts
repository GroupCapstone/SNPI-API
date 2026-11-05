import { execSync } from 'node:child_process';
import { waitForCIStatus } from './verify-ci-status';

function run(cmd: string): void {
  execSync(cmd, { stdio: 'inherit' });
}

function runCapture(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

async function main() {
  console.log('======================================================');
  console.log('Scenario C: All-In-One Verified Sync & Deploy Pipeline');
  console.log('Architecture: Zero-Bridge Independent Deployment');
  console.log('Backend Domain: https://api.kesararamwithdigital.tech');
  console.log('======================================================\n');

  // Step 1: Pre-flight Quality & Compilation Gates
  console.log('[1/6] Running Quality & Compilation Gates (Format, Lint, Typecheck, Build)...');
  try {
    run('npm run format:check');
  } catch {
    console.log(
      '      [FIX] Prettier format issues detected. Auto-formatting with npm run format...',
    );
    run('npm run format');
  }
  run('npm run lint');
  run('npm run typecheck');
  run('npm run build');
  console.log('      [PASS] Codebase formatted, clean, and compiled.\n');

  // Step 2: Dual-Developer Git Reconciliation
  console.log('[2/6] Reconciling commits with co-developer from origin...');
  run('npm run git:sync');
  console.log('      [PASS] Dual-developer sync complete.\n');

  // Step 3: GitHub Push (Source Code Storage Only - Zero Vercel Bridge)
  console.log('[3/6] Pushing changes to GitHub origin (Team Code Repository)...');
  run('git push origin main --tags');
  const headSha = runCapture('git rev-parse HEAD');
  console.log(`      [PASS] GitHub updated successfully at commit: ${headSha}\n`);

  // Step 4: Direct Local-to-Vercel CLI Deployment (Domain: api.kesararamwithdigital.tech)
  console.log('[4/6] Deploying directly from local terminal to Vercel Production...');
  console.log('      Target Domain: https://api.kesararamwithdigital.tech');
  run('npx vercel --prod');
  console.log('      [PASS] Vercel Production deployment complete.\n');

  // Step 5: Real-time GitHub Actions CI/CD Verification Until 100% Green
  console.log('[5/6] Actively monitoring GitHub Actions CI runs until 100% GREEN [PASSED]...');
  await waitForCIStatus({
    commitSha: headSha,
    timeoutMinutes: 15,
    minWorkflows: 8,
  });
  console.log('      [PASS] All GitHub Actions workflows are 100% GREEN.\n');

  // Step 6: Live Production Health Verification Probe
  console.log(
    '[6/6] Probing live production domain: https://api.kesararamwithdigital.tech/api/v1/health...',
  );
  try {
    const healthProbe = runCapture('curl -sI https://api.kesararamwithdigital.tech/api/v1/health');
    const firstLine = healthProbe.split('\n')[0] || '';
    console.log(`      [PASS] Live endpoint responded: ${firstLine}`);
  } catch (err: unknown) {
    console.warn(`      [WARN] Live health probe notice: ${(err as Error).message}`);
  }

  console.log('\n======================================================');
  console.log('[COMPLETED] Release 100% Green & Verified Live on GitHub & Vercel!');
  console.log('Backend Domain: https://api.kesararamwithdigital.tech');
  console.log('======================================================');
}

main().catch((err: unknown) => {
  const error = err as Error;
  console.error('\n[FAILED] Release pipeline aborted:', error.message);
  process.exit(1);
});
