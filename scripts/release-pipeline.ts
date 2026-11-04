import { execSync } from 'node:child_process';

function run(cmd: string): void {
  execSync(cmd, { stdio: 'inherit' });
}

async function main() {
  console.log('======================================================');
  console.log('Scenario C: All-In-One Verified Sync & Deploy Pipeline');
  console.log('Architecture: Zero-Bridge Independent Deployment');
  console.log('Backend Domain: https://api.kesararamwithdigital.tech');
  console.log('======================================================\n');

  // Step 1: Pre-flight Verification Gates
  console.log('[1/4] Running Quality & Compilation Gates (Typecheck, Lint, Build)...');
  run('npm run typecheck');
  run('npm run lint');
  run('npm run build');
  console.log('      [PASS] Codebase clean and compiled.\n');

  // Step 2: Dual-Developer Git Reconciliation
  console.log('[2/4] Reconciling commits with co-developer from origin...');
  run('npm run git:sync');
  console.log('      [PASS] Dual-developer sync complete.\n');

  // Step 3: GitHub Push (Source Code Storage Only - Zero Vercel Bridge)
  console.log('[3/4] Pushing changes to GitHub origin (Team Code Repository)...');
  run('git push origin main');
  console.log('      [PASS] GitHub updated successfully. Zero Vercel bridge.\n');

  // Step 4: Direct Local-to-Vercel CLI Deployment (Domain: api.kesararamwithdigital.tech)
  console.log('[4/4] Deploying directly from local terminal to Vercel Production...');
  console.log('      Target Domain: https://api.kesararamwithdigital.tech');
  run('npx vercel --prod');
  console.log('\n======================================================');
  console.log('[COMPLETED] Backend live at: https://api.kesararamwithdigital.tech');
  console.log('======================================================');
}

main().catch((err: unknown) => {
  const error = err as Error;
  console.error('\n[FAILED] Release pipeline aborted:', error.message);
  process.exit(1);
});
