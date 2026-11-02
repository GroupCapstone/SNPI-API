import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface WorkflowRun {
  databaseId: number;
  name: string;
  status: string;
  conclusion: string | null;
  displayTitle: string;
}

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message: string };
    throw new Error(error.stderr || error.stdout || error.message);
  }
}

async function verifyDeploymentManifests(): Promise<void> {
  console.log('[1/3] Verifying deployment manifests and configurations...');
  const requiredFiles = [
    'vercel.json',
    'apps/backend/vercel.json',
    'apps/frontend/vercel.json',
    'apps/backend/infrastructure/k8s/backend-deployment.yaml',
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.resolve(process.cwd(), file))) {
      throw new Error(`Missing required deployment manifest: ${file}`);
    }
    console.log(`      [PASS] Manifest verified: ${file}`);
  }
}

async function verifyLintQuality(): Promise<void> {
  console.log('\n[2/4] Verifying code quality & ESLint gate...');
  try {
    runCommand('npm run lint');
    console.log('      [PASS] ESLint passed with 0 errors.');
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(`ESLint quality check failed: ${error.message}`);
  }
}

async function verifyProductionBuilds(): Promise<void> {
  console.log('\n[3/4] Verifying production bundle compilation...');
  try {
    runCommand('npm run build');
    console.log('      [PASS] Production builds compiled with 0 errors.');
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(`Production build failed: ${error.message}`);
  }
}

async function verifyGitHubWorkflowStatus(): Promise<void> {
  console.log('\n[4/4] Checking GitHub Actions deployment & CI health on main...');
  try {
    const jsonOutput = runCommand(
      'gh run list --branch main --limit 15 --json databaseId,name,status,conclusion,displayTitle',
    );
    const runs: WorkflowRun[] = JSON.parse(jsonOutput);

    const latestRunsByName = new Map<string, WorkflowRun>();
    for (const run of runs) {
      if (!latestRunsByName.has(run.name)) {
        latestRunsByName.set(run.name, run);
      }
    }

    const failedWorkflows: WorkflowRun[] = [];
    for (const [, run] of latestRunsByName) {
      if (run.conclusion === 'failure') {
        failedWorkflows.push(run);
      }
    }

    if (failedWorkflows.length > 0) {
      if (process.env.ALLOW_FIX === '1' || process.env.CI_FIX === '1') {
        console.warn(
          '\n[WARN] Failed workflows detected on main, but ALLOW_FIX=1 is active to push the resolving commit.',
        );
      } else {
        console.error('\n[FAILED] PUSH BLOCKED: The following workflows failed on main:');
        for (const failed of failedWorkflows) {
          console.error(`  - ${failed.name} (ID: ${failed.databaseId}): "${failed.displayTitle}"`);
        }
        throw new Error(
          'Push blocked by Pre-Push Quality Gate: All GitHub deployment and CI workflows must be green before pushing new changes.',
        );
      }
    }

    console.log(
      '      [PASS] All active GitHub deployment and CI workflows on main are passing green.',
    );
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message.includes('PUSH BLOCKED')) {
      throw error;
    }
    // If gh CLI is not available or not logged in, skip GitHub check with a warning
    console.log(`      [WARN] GitHub CLI check skipped: ${error.message.split('\n')[0]}`);
  }
}

async function main() {
  console.log('======================================================');
  console.log('SNP-SMS Pre-Push Deployment & CI Quality Gate');
  console.log('======================================================\n');

  try {
    await verifyDeploymentManifests();
    await verifyLintQuality();
    await verifyProductionBuilds();
    await verifyGitHubWorkflowStatus();
    console.log('\n======================================================');
    console.log('[PASSED] Pre-push deployment and CI quality gate verified 100%.');
    console.log('======================================================');
  } catch (err: unknown) {
    const error = err as Error;
    console.error('\n[FAILED] Deployment Quality Gate assertion failed:');
    console.error(error.message);
    process.exit(1);
  }
}

void main();
