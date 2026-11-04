import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

function loadEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = { ...loadEnvFile('.env'), ...loadEnvFile('.env.local') };

interface EndpointEntry {
  method: string;
  path: string;
  module: string;
  file: string;
}

interface TestRecord {
  method: string;
  path: string;
  module: string;
  testedUrl: string;
  statusCode: number;
  durationMs: number;
  statusText: string;
  category: 'SUCCESS' | 'CLIENT_VALIDATION' | 'NOT_FOUND' | 'FORBIDDEN' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'UNREACHABLE';
}

async function fetchToken(username: string, pass: string): Promise<string> {
  const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: username, password: pass }),
  });
  if (!loginRes.ok) throw new Error('Login failed');
  const json = await loginRes.json();
  return json.data.accessToken;
}

async function runComprehensiveTest() {
  console.log('================================================================================');
  console.log('    SNP-SMS COMPLETE ENDPOINT REGISTRY & LIVE VERIFICATION SUITE               ');
  console.log('================================================================================\n');

  // 1. Authenticate
  const username = process.env.SUPER_ADMIN_USERNAME || env.SUPER_ADMIN_USERNAME || 'admin_local';
  const password = process.env.SUPER_ADMIN_PASSWORD || env.SUPER_ADMIN_PASSWORD || 'AdminPasse7a049b8a2009c4c22be1e02';

  console.log(`[Auth] Authenticating as Super Admin (${username})...`);
  let token = await fetchToken(username, password);
  console.log('[Auth] Access token acquired successfully.\n');

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // 2. Load registry
  const registryPath = path.resolve(process.cwd(), 'scripts/endpoints-registry.json');
  if (!fs.existsSync(registryPath)) {
    throw new Error('scripts/endpoints-registry.json not found');
  }
  let endpoints: EndpointEntry[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

  // Move logout endpoints to the very end so session stays alive during test
  const logoutEndpoints = endpoints.filter((e) => e.path.includes('/logout'));
  endpoints = endpoints.filter((e) => !e.path.includes('/logout')).concat(logoutEndpoints);

  console.log(`[Registry] Loaded ${endpoints.length} unique endpoints across modules.\n`);

  // Fetch sample IDs for dynamic parameter replacement
  const sampleIds: Record<string, string> = {};
  try {
    const sRes = await fetch(`${BASE_URL}/api/v1/students?limit=1`, { headers });
    const sJson = await sRes.json();
    if (sJson.data?.[0]) sampleIds['studentId'] = sJson.data[0]._id || sJson.data[0].id;

    const cRes = await fetch(`${BASE_URL}/api/v1/classes?limit=1`, { headers });
    const cJson = await cRes.json();
    if (cJson.data?.[0]) sampleIds['classId'] = cJson.data[0]._id || cJson.data[0].id;

    const bRes = await fetch(`${BASE_URL}/api/v1/branches?limit=1`, { headers });
    const bJson = await bRes.json();
    if (bJson.data?.[0]) sampleIds['branchId'] = bJson.data[0]._id || bJson.data[0].id;

    const rRes = await fetch(`${BASE_URL}/api/v1/roles?limit=1`, { headers });
    const rJson = await rRes.json();
    if (rJson.data?.[0]) sampleIds['roleId'] = rJson.data[0]._id || rJson.data[0].id;
  } catch {}

  const defaultDummyId = '507f1f77bcf86cd799439011'; // Valid 24-char MongoDB ObjectId

  const testRecords: TestRecord[] = [];

  for (const ep of endpoints) {
    let testPath = ep.path;
    // Replace URL parameters with sample ID or valid ObjectId
    testPath = testPath
      .replace(/:id\b/g, defaultDummyId)
      .replace(/:studentId\b/g, sampleIds['studentId'] || defaultDummyId)
      .replace(/:classId\b/g, sampleIds['classId'] || defaultDummyId)
      .replace(/:branchId\b/g, sampleIds['branchId'] || defaultDummyId)
      .replace(/:roleId\b/g, sampleIds['roleId'] || defaultDummyId)
      .replace(/:[a-zA-Z0-9_]+/g, defaultDummyId);

    const start = performance.now();
    try {
      const doFetch = async () => {
        if (ep.method === 'GET') {
          return fetch(`${BASE_URL}${testPath}`, { method: 'GET', headers });
        } else if (ep.method === 'POST') {
          return fetch(`${BASE_URL}${testPath}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({}),
          });
        } else if (ep.method === 'PATCH' || ep.method === 'PUT') {
          return fetch(`${BASE_URL}${testPath}`, {
            method: ep.method,
            headers,
            body: JSON.stringify({}),
          });
        } else if (ep.method === 'DELETE') {
          return fetch(`${BASE_URL}${testPath}`, { method: 'DELETE', headers });
        } else {
          return fetch(`${BASE_URL}${testPath}`, { method: ep.method, headers });
        }
      };

      let res = await doFetch();

      // If token expired or was invalidated, re-authenticate and retry once
      if (res.status === 401 && !ep.path.includes('/login') && !ep.path.includes('/refresh')) {
        token = await fetchToken(username, password);
        headers.Authorization = `Bearer ${token}`;
        res = await doFetch();
      }

      const durationMs = Math.round(performance.now() - start);
      let cat: TestRecord['category'] = 'SUCCESS';
      if (res.status >= 200 && res.status < 300) {
        cat = 'SUCCESS';
      } else if (res.status === 400 || res.status === 422 || res.status === 409) {
        cat = 'CLIENT_VALIDATION';
      } else if (res.status === 404) {
        cat = 'NOT_FOUND';
      } else if (res.status === 401) {
        cat = 'UNAUTHORIZED';
      } else if (res.status === 403) {
        cat = 'FORBIDDEN';
      } else {
        cat = 'SERVER_ERROR';
      }

      testRecords.push({
        method: ep.method,
        path: ep.path,
        module: ep.module,
        testedUrl: testPath,
        statusCode: res.status,
        durationMs,
        statusText: res.statusText,
        category: cat,
      });

      const tag = `[${res.status}]`.padEnd(6);
      console.log(`${tag} ${ep.method.padEnd(6)} ${ep.path.padEnd(55)} -> ${durationMs}ms (${cat})`);
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      testRecords.push({
        method: ep.method,
        path: ep.path,
        module: ep.module,
        testedUrl: testPath,
        statusCode: 0,
        durationMs,
        statusText: (err as Error).message,
        category: 'UNREACHABLE',
      });
      console.log(`[ERR]  ${ep.method.padEnd(6)} ${ep.path.padEnd(55)} -> FAILED`);
    }
  }

  // Generate markdown artifact
  const successCount = testRecords.filter((r) => r.category === 'SUCCESS').length;
  const validationCount = testRecords.filter((r) => r.category === 'CLIENT_VALIDATION').length;
  const notFoundCount = testRecords.filter((r) => r.category === 'NOT_FOUND').length;
  const errorCount = testRecords.filter((r) => r.category === 'SERVER_ERROR' || r.category === 'UNREACHABLE').length;
  const total = testRecords.length;
  const avgLatency = Math.round(testRecords.reduce((acc, r) => acc + r.durationMs, 0) / total);

  console.log('\n================================================================================');
  console.log(` TOTAL ENDPOINTS TESTED : ${total}`);
  console.log(` SUCCESS (2xx)          : ${successCount}`);
  console.log(` VALIDATION REJECT (4xx): ${validationCount} (Expected for empty mutation probes)`);
  console.log(` NOT FOUND (404)        : ${notFoundCount} (Expected for dummy ObjectId probes)`);
  console.log(` SERVER ERRORS (500)    : ${errorCount}`);
  console.log(` AVERAGE LATENCY        : ${avgLatency}ms`);
  console.log('================================================================================\n');

  // Write artifact
  const artifactDir = '/Users/Apple16/.gemini/antigravity/brain/859bb8a1-1d2a-4c7b-8eca-2e606e459928';
  let md = '# SNP-SMS Comprehensive REST API Endpoint Registry & Verification Report\n\n';
  md += `> **Audit Execution Date**: ${new Date().toISOString()}\n`;
  md += `> **Total Registered Endpoints**: ${total}\n`;
  md += `> **Direct 2xx Success**: ${successCount}\n`;
  md += `> **Protected Validation Rejections (400/422)**: ${validationCount}\n`;
  md += `> **Dummy ID Fallbacks (404)**: ${notFoundCount}\n`;
  md += `> **Server Failures (500)**: ${errorCount}\n`;
  md += `> **Average Latency**: ${avgLatency}ms\n\n`;
  md += '## Endpoint Test Records by Module\n\n';
  md += '| Method | Route Path | Module | Status Code | Latency | Result Type |\n';
  md += '| :--- | :--- | :--- | :--- | :--- | :--- |\n';

  for (const r of testRecords) {
    md += `| \`${r.method}\` | \`${r.path}\` | ${r.module} | \`${r.statusCode}\` | ${r.durationMs}ms | ${r.category} |\n`;
  }

  fs.writeFileSync(path.join(artifactDir, 'api_endpoint_registry_report.md'), md, 'utf-8');
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/api-endpoints-registry.md', md, 'utf-8');
  console.log(`[Report] Recorded to artifact directory and docs/api-endpoints-registry.md`);
}

runComprehensiveTest().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
