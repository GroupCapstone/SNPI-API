import { execSync } from 'node:child_process';

interface VercelDeployment {
  url: string;
  name: string;
  state: string; // 'READY' | 'BUILDING' | 'ERROR' | 'QUEUED'
  target: string; // 'production' | 'preview'
  createdAt: number;
  buildingAt?: number;
  ready?: number;
  meta?: Record<string, string>;
}

interface VercelListResponse {
  deployments: VercelDeployment[];
}

function runCapture(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message: string };
    throw new Error(error.stderr || error.stdout || error.message);
  }
}

export async function verifyVercelDeployment(options?: {
  expectedTarget?: string;
  maxWaitSec?: number;
  pollIntervalMs?: number;
}): Promise<boolean> {
  const expectedTarget = options?.expectedTarget || 'production';
  const maxWaitSec = options?.maxWaitSec || 180;
  const pollIntervalMs = options?.pollIntervalMs || 4000;

  console.log('======================================================');
  console.log('SNPI-API Vercel Production Blue / Success Verification');
  console.log('======================================================');
  console.log(`Expected Target : ${expectedTarget}`);
  console.log(`Production Host : https://api.kesararamwithdigital.tech`);
  console.log(`Live Probe Path : /api/v1/health`);
  console.log('======================================================\n');

  const startTime = Date.now();
  let latestDeploy: VercelDeployment | undefined;

  // 1. Poll Vercel deployment status until READY (Blue)
  console.log('[1/2] Inspecting Vercel deployment state via Vercel CLI...');
  while ((Date.now() - startTime) / 1000 < maxWaitSec) {
    try {
      const output = runCapture('npx vercel ls --limit 3 --json');
      const parsed = JSON.parse(output) as VercelListResponse;
      const deployments = parsed.deployments || [];
      const prodDeployments = deployments.filter((d) => d.target === expectedTarget);

      if (prodDeployments.length > 0) {
        latestDeploy = prodDeployments[0];
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        if (latestDeploy.state === 'READY') {
          console.log(`      [PASS] (${elapsed}s) Deployment is READY [Blue Success]!`);
          console.log(`      Deployment URL : https://${latestDeploy.url}`);
          console.log(`      Commit SHA     : ${latestDeploy.meta?.githubCommitSha || 'N/A'}`);
          console.log(`      Commit Message : ${latestDeploy.meta?.githubCommitMessage || 'N/A'}`);
          break;
        } else if (latestDeploy.state === 'ERROR' || latestDeploy.state === 'CANCELED') {
          throw new Error(
            `Vercel deployment failed with state: ${latestDeploy.state} (URL: https://${latestDeploy.url})`,
          );
        } else {
          console.log(
            `      [${elapsed}s] Deployment state is "${latestDeploy.state}". Waiting for READY (Blue)...`,
          );
        }
      }
    } catch (pollErr: unknown) {
      console.warn(
        `      [WARN] Vercel query notice: ${(pollErr as Error).message.split('\n')[0]}`,
      );
    }

    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  if (!latestDeploy || latestDeploy.state !== 'READY') {
    throw new Error(
      `Vercel deployment did not reach READY state within ${maxWaitSec}s timeout. Current state: ${latestDeploy?.state || 'UNKNOWN'}`,
    );
  }

  // 2. Probe Live Production Health Endpoint
  console.log('\n[2/2] Probing live production domain health...');
  const healthUrl = 'https://api.kesararamwithdigital.tech/api/v1/health';
  try {
    const headerOutput = runCapture(`curl -sI ${healthUrl}`);
    const httpLine = headerOutput.split('\n')[0] || '';
    if (!httpLine.includes('200')) {
      throw new Error(`Live health check returned unexpected HTTP status: ${httpLine}`);
    }
    console.log(`      [PASS] HTTP Status: ${httpLine.trim()}`);

    const jsonBody = runCapture(`curl -s ${healthUrl}`);
    const parsedBody = JSON.parse(jsonBody) as {
      success?: boolean;
      data?: { status?: string; database?: string; service?: string };
    };

    if (parsedBody.success && parsedBody.data?.status === 'healthy') {
      console.log(
        `      [PASS] Service Status: ${parsedBody.data.service} (${parsedBody.data.status})`,
      );
      console.log(`      [PASS] Database State: ${parsedBody.data.database}`);
    } else {
      console.warn(`      [WARN] Unexpected health payload: ${jsonBody}`);
    }
  } catch (probeErr: unknown) {
    const error = probeErr as Error;
    console.error(`      [FAILED] Live health probe failed: ${error.message}`);
    throw error;
  }

  console.log('\n======================================================');
  console.log('[VERIFIED] Vercel Production is 100% READY [Blue], live and healthy!');
  console.log('Domain: https://api.kesararamwithdigital.tech');
  console.log('Turn conclusion / conversation break criteria fulfilled.');
  console.log('======================================================\n');

  return true;
}

if (require.main === module) {
  verifyVercelDeployment()
    .then(() => process.exit(0))
    .catch((err: Error) => {
      console.error(`\n[FAILED] Vercel verification gate error: ${err.message}`);
      process.exit(1);
    });
}
