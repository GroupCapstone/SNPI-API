import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * SNPI Repository & Security Quality Telegram Watcher
 * Real-time monitoring for git pushes, developer commit fixes, releases,
 * GitHub security quality checks, and live API health.
 */

const DEFAULT_BOT_TOKEN = '9276848178:AAH3410AUju4t6MbUXkjThK_NTXsL9ellqU';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
const ROOT_DIR = path.resolve(__dirname, '..');
const CACHE_FILE = path.join(ROOT_DIR, '.telegram-watch-cache.json');

interface WatchCache {
  chatId?: string | number;
  lastCommitHash?: string;
  lastReleaseVersion?: string;
  lastSecurityAlertCount?: number;
  lastApiStatus?: string;
}

function loadCache(): WatchCache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch {
    // fallback
  }
  return {};
}

function saveCache(cache: WatchCache): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save cache file:', err);
  }
}

/**
 * Dispatches a formatted message to Telegram Bot API
 */
function escapeHtml(str: string): string {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatHumanTime(date = new Date()): string {
  const dateStr = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr}, ${timeStr}`;
}

function formatAuthor(author: string, email: string): string {
  const cleanName = (author || 'Developer').trim();
  if (email && email.includes('@users.noreply.github.com')) {
    const handleMatch = email.match(/(?:\d+\+)?([^@]+)@users\.noreply\.github\.com/);
    if (handleMatch && handleMatch[1] && handleMatch[1].toLowerCase() !== cleanName.toLowerCase()) {
      return `${cleanName} (@${handleMatch[1]})`;
    }
  }
  return cleanName;
}

function formatDiffSummary(diffStat: string, changedFiles: string[]): string {
  const filesMatch = diffStat.match(/(\d+)\s+file/);
  const insMatch = diffStat.match(/(\d+)\s+insertion/);
  const delMatch = diffStat.match(/(\d+)\s+deletion/);

  const count = filesMatch ? filesMatch[1] : String(changedFiles.length || 0);
  const ins = insMatch ? `+${insMatch[1]}` : '+0';
  const del = delMatch ? `-${delMatch[1]}` : '-0';

  if (changedFiles.length > 0 && changedFiles.length <= 3) {
    const names = changedFiles.map((f) => path.basename(f)).join(', ');
    return `${count} files (${ins}, ${del}) · <code>${escapeHtml(names)}</code>`;
  }
  return `${count} files (${ins}, ${del})`;
}

function formatSecurityAlerts(alerts: SecurityStatus['openAlerts']): string {
  const map = new Map<
    string,
    { package: string; severity: string; count: number; summary: string }
  >();
  for (const a of alerts) {
    const key = `${a.package}:${a.severity}`;
    if (!map.has(key)) {
      map.set(key, {
        package: a.package,
        severity: a.severity.toUpperCase(),
        count: 1,
        summary: a.summary.replace(/<[^>]*>?/gm, '').trim(),
      });
    } else {
      map.get(key)!.count += 1;
    }
  }

  const grouped = Array.from(map.values());
  return grouped
    .slice(0, 3)
    .map(
      (g) =>
        `• <b>${escapeHtml(g.package)}</b> · <code>${g.severity}</code>${g.count > 1 ? ` (x${g.count})` : ''}\n  ${escapeHtml(g.summary)}`,
    )
    .join('\n');
}

async function sendTelegramMessage(chatId: string | number, text: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = (await res.json()) as { ok: boolean; description?: string };
    if (!data.ok) {
      console.error(`Telegram API error: ${data.description}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to dispatch Telegram message:', err);
    return false;
  }
}

/**
 * Auto-detects chat ID from recent bot updates
 */
async function getActiveChatId(): Promise<string | number | null> {
  const envChatId = process.env.TELEGRAM_CHAT_ID;
  if (envChatId) return envChatId;

  const cache = loadCache();
  if (cache.chatId) return cache.chatId;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const data = (await res.json()) as {
      ok: boolean;
      result?: Array<{
        message?: { chat?: { id: number; username?: string; first_name?: string } };
      }>;
    };

    if (data.ok && data.result && data.result.length > 0) {
      const latestMsg = data.result[data.result.length - 1]?.message;
      if (latestMsg?.chat?.id) {
        const discoveredId = latestMsg.chat.id;
        console.log(
          `[Telegram] Discovered active Chat ID: ${discoveredId} (${latestMsg.chat.username || latestMsg.chat.first_name || 'User'})`,
        );
        cache.chatId = discoveredId;
        saveCache(cache);
        return discoveredId;
      }
    }
  } catch (err) {
    console.error('Failed to poll getUpdates:', err);
  }

  return null;
}

/**
 * Inspects recent Git commit / push fixes
 */
function inspectLatestCommit(): {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  branch: string;
  changedFiles: string[];
  diffStat: string;
} {
  const format = '%h|%an|%ae|%ad|%s';
  const out = execSync(`git log -1 --pretty=format:"${format}" --date=short`, {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
  }).trim();

  const [hash, author, email, date, message] = out.split('|');
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
  }).trim();

  let changedFiles: string[] = [];
  try {
    const diffOut = execSync(`git diff-tree --no-commit-id --name-only -r ${hash}`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
    changedFiles = diffOut.split('\n').filter(Boolean);
  } catch {
    // ignore
  }

  let diffStat = '';
  try {
    diffStat = execSync(`git diff --shortstat ${hash}^!`, {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
  } catch {
    try {
      diffStat = execSync(`git diff-tree --shortstat ${hash}`, {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
      }).trim();
    } catch {
      // ignore
    }
  }

  return { hash, author, email, date, message, branch, changedFiles, diffStat };
}

/**
 * Inspects package.json version and latest release tag
 */
function inspectVersionAndRelease(): {
  packageVersion: string;
  latestTag: string;
} {
  let packageVersion = '0.0.0';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
    packageVersion = pkg.version || '0.0.0';
  } catch {
    // ignore
  }

  let latestTag = '';
  try {
    latestTag = execSync('git describe --tags --abbrev=0', {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
  } catch {
    latestTag = `v${packageVersion}`;
  }

  return { packageVersion, latestTag };
}

/**
 * Checks GitHub Dependabot and Monorepo security health
 */
interface SecurityStatus {
  totalAlerts: number;
  openAlerts: Array<{
    number: number;
    package: string;
    severity: string;
    summary: string;
  }>;
}

function getRepoSlug(): string {
  try {
    const remoteUrl = execSync('git remote get-url origin', {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
    }).trim();
    const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    if (match) return `${match[1]}/${match[2].replace(/\.git$/, '')}`;
  } catch {
    // fallback
  }
  return 'Tan-Saphea/SNPI-SMS';
}

function inspectSecurityQuality(): SecurityStatus {
  try {
    const repoSlug = getRepoSlug();
    const cmd = `gh api repos/${repoSlug}/dependabot/alerts --jq '[.[] | select(.state=="open") | {number: .number, package: .security_vulnerability.package.name, severity: .security_advisory.severity, summary: .security_advisory.summary}]'`;
    const out = execSync(cmd, { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
    const openAlerts = JSON.parse(out);
    return {
      totalAlerts: openAlerts.length,
      openAlerts,
    };
  } catch {
    // If gh CLI fails or offline, return 0
    return { totalAlerts: 0, openAlerts: [] };
  }
}

/**
 * Inspects Live API status
 */
async function inspectLiveApi(endpoint = 'http://localhost:5001/health'): Promise<{
  online: boolean;
  statusCode: number;
  latencyMs: number;
  data?: Record<string, unknown>;
}> {
  const start = Date.now();
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(3500) });
    const latencyMs = Date.now() - start;
    let data: Record<string, unknown> | undefined;
    try {
      data = (await res.json()) as Record<string, unknown>;
    } catch {
      // non-json
    }
    return {
      online: res.status >= 200 && res.status < 400,
      statusCode: res.status,
      latencyMs,
      data,
    };
  } catch {
    return {
      online: false,
      statusCode: 0,
      latencyMs: Date.now() - start,
    };
  }
}

/**
 * Main evaluation and dispatch cycle
 */
export async function runWatcherCycle(options: { forceAlert?: boolean } = {}): Promise<void> {
  const cache = loadCache();
  const chatId = await getActiveChatId();

  if (!chatId) {
    console.log('\n[SNPI Telegram Watcher] No Chat ID detected yet.');
    console.log('Action Required: Open Telegram, search @snpi_statusbot and send /start');
    console.log('Then rerun this script to begin receiving alerts.\n');
    return;
  }

  const commit = inspectLatestCommit();
  const { packageVersion, latestTag } = inspectVersionAndRelease();
  const security = inspectSecurityQuality();
  const apiHealth = await inspectLiveApi();

  console.log(
    `[Watch Cycle] Commit: ${commit.hash} (${commit.author}) | Version: ${packageVersion} | Alerts: ${security.totalAlerts} | API: ${apiHealth.online ? 'ONLINE' : 'OFFLINE'}`,
  );

  let needsAlert = options.forceAlert || false;

  // 1. Check for New Commit / Push Fix by Developer
  const isNewCommit = cache.lastCommitHash !== commit.hash;
  if (isNewCommit || options.forceAlert) {
    const filesPreview =
      commit.changedFiles.length > 0
        ? `\n<b>Files Changed (${commit.changedFiles.length}):</b>\n<code>${commit.changedFiles.slice(0, 5).join('\n')}${commit.changedFiles.length > 5 ? `\n...and ${commit.changedFiles.length - 5} more` : ''}</code>`
        : '';

    const pushMessage = `<b>[SNPI REPO PUSH &amp; FIX ALERT]</b>
<b>Developer:</b> ${commit.author} &lt;${commit.email}&gt;
<b>Branch:</b> <code>${commit.branch}</code>
<b>Commit:</b> <code>${commit.hash}</code>
<b>Message:</b> ${commit.message}${filesPreview}
<b>System Version:</b> v${packageVersion}
<b>Timestamp:</b> ${new Date().toISOString()}`;

    await sendTelegramMessage(chatId, pushMessage);
    cache.lastCommitHash = commit.hash;
    needsAlert = true;
  }

  // 2. Check for New Version Release
  const isNewRelease = cache.lastReleaseVersion !== packageVersion;
  if (isNewRelease && !options.forceAlert) {
    const releaseMessage = `<b>[SNPI NEW VERSION RELEASE]</b>
<b>Release Tag:</b> ${latestTag || `v${packageVersion}`}
<b>Package Version:</b> v${packageVersion}
<b>Developer:</b> ${commit.author}
<b>Changelog:</b> <a href="https://github.com/${getRepoSlug()}/releases">GitHub Releases</a>
<b>Summary:</b> Enterprise monorepo updated with latest build checkpoints.`;

    await sendTelegramMessage(chatId, releaseMessage);
    cache.lastReleaseVersion = packageVersion;
    needsAlert = true;
  }

  // 3. Check for Security Alerts (Dependabot & Quality Gate)
  const isSecurityChanged =
    cache.lastSecurityAlertCount !== undefined &&
    cache.lastSecurityAlertCount !== security.totalAlerts;

  if ((isSecurityChanged || options.forceAlert) && security.totalAlerts > 0) {
    const alertList = security.openAlerts
      .slice(0, 3)
      .map(
        (a) =>
          `• <b>${a.package}</b> (${a.severity.toUpperCase()}): ${a.summary.replace(/<[^>]*>?/gm, '')}`,
      )
      .join('\n');

    const securityMessage = `<b>[SNPI SECURITY ALERT]</b>
<b>Repository:</b> ${getRepoSlug()}
<b>Active Dependabot Alerts:</b> ${security.totalAlerts} Open
${alertList}
<b>Action:</b> Review dependencies and apply security patch updates.`;

    await sendTelegramMessage(chatId, securityMessage);
    cache.lastSecurityAlertCount = security.totalAlerts;
    needsAlert = true;
  }

  // 4. Check for Live API Status Degraded
  const currentApiStatus = apiHealth.online ? 'ONLINE' : 'OFFLINE';
  if (cache.lastApiStatus && cache.lastApiStatus !== currentApiStatus) {
    const apiMessage = `<b>[SNPI LIVE API STATUS CHANGE]</b>
<b>Endpoint:</b> http://localhost:5001/health
<b>Status:</b> ${currentApiStatus} (Code: ${apiHealth.statusCode}, Latency: ${apiHealth.latencyMs}ms)
<b>Active Cluster:</b> ${apiHealth.online ? 'Cluster Operational' : 'Immediate attention required'}`;

    await sendTelegramMessage(chatId, apiMessage);
    cache.lastApiStatus = currentApiStatus;
    needsAlert = true;
  } else if (!cache.lastApiStatus) {
    cache.lastApiStatus = currentApiStatus;
  }

  saveCache(cache);
}

/**
 * CLI Runner
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--get-chat-id')) {
    const chatId = await getActiveChatId();
    if (chatId) {
      console.log(`Active Chat ID: ${chatId}`);
    } else {
      console.log('No chat detected. Send a message to @snpi_statusbot on Telegram first.');
    }
    return;
  }

  if (args.includes('--test')) {
    const chatId = await getActiveChatId();
    if (!chatId) {
      console.log('Cannot send test: No Chat ID found. Message @snpi_statusbot first.');
      return;
    }
    console.log(`Sending diagnostic test message to Chat ID: ${chatId}...`);
    const success = await sendTelegramMessage(
      chatId,
      `<b>[SNPI STATUS BOT TEST]</b>\nBot connection established successfully.\nMonitoring live pushes, releases, and security gates.\nTimestamp: ${new Date().toISOString()}`,
    );
    console.log(success ? 'Test message sent successfully.' : 'Failed to send test message.');
    return;
  }

  if (args.includes('--once')) {
    await runWatcherCycle({ forceAlert: true });
    return;
  }

  if (args.includes('--watch')) {
    console.log('[SNPI Telegram Watcher] Daemon active. Polling repository and API every 60s...');
    await runWatcherCycle();
    setInterval(async () => {
      try {
        await runWatcherCycle();
      } catch (err) {
        console.error('Error during watcher cycle:', err);
      }
    }, 60000);
    return;
  }

  // Default: Run once
  await runWatcherCycle();
}

main().catch((err) => {
  console.error('Fatal error in telegram watcher:', err);
  process.exit(1);
});
