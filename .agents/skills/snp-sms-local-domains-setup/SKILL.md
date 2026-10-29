---
name: snp-sms-local-domains-setup
description: >-
  Authoritative developer and agent guide for configuring custom local development
  domains (*.snpi.edu.kh) across macOS, Windows, and Linux. Covers instant agent-automated
  setup via osascript and PowerShell, manual developer setup via hosts file, Next.js
  subdomain middleware routing, Express CORS whitelisting, and port 80 local reverse proxying.
---

# SNP-SMS Local Custom Domains Setup Specification

This skill is the authoritative architectural specification and operational handbook for setting up, managing, and automating local custom domains (`*.snpi.edu.kh`) for all developers and AI coding agents working on the SNP-SMS platform.

---

## 1. Architectural Purpose & Rationale

Local custom domains bridge the parity gap between local development and production environments:

- **Subdomain Routing Realism**: Mirrors real-world production topology (`dashboard.`, `api.`, `docs.`, `verify.`, `portal.`).
- **Cookie & Session Scoping**: Allows testing cross-subdomain cookies (`Domain=.snpi.edu.kh`), SameSite policies, and authentication headers locally.
- **CORS & Origin Hardening**: Validates that the Express backend accurately enforces strict CORS origin checks for internal school subdomains.
- **QR Code & Public Ledger Verification**: Permits scanning and testing certificate verification URLs printed on student diplomas and transcripts.
- **Zero Emojis Policy**: All output, logs, and documentation must strictly use textual badges: `[PASSED]`, `[FAILED]`, `[INFO]`, `[COMPLETED]`.

---

## 2. Standard Subdomain Topology & Port Allocation

| Domain / Subdomain | Target Service | Local Port | Role & Feature Surface |
| :--- | :--- | :--- | :--- |
| **`snpi.edu.kh`** | Frontend Next.js | `:3000` | School Root Landing Portal & Public Information |
| **`dashboard.snpi.edu.kh`** | Frontend Next.js | `:3000` | School Management Dashboard (`/(dashboard)/*`) for Admins, Teachers, Cashiers |
| **`api.snpi.edu.kh`** | Backend Express API | `:4000` | 193 REST API endpoints, Swagger OpenAPI docs, biometric sync, health probes |
| **`docs.snpi.edu.kh`** | Frontend Next.js | `:3000` | Public Developer Documentation (`/document`) and UI Component Library |
| **`verify.snpi.edu.kh`** | Frontend Next.js | `:3000` | Public Certificate & Diploma Verification Ledger (`/verify`) |
| **`portal.snpi.edu.kh`** | Frontend Next.js | `:3000` | Student & Parent Grade / Attendance Self-Service Portal |

---

## 3. Agent Instant Automated Setup Protocol

AI agents can execute the local domain setup automatically on behalf of the user depending on their operating system.

### 3.1 macOS Agent Automated Setup
On macOS, agents invoke native privileged execution using `osascript`. This prompts the user with the standard macOS TouchID / administrator dialog:

```bash
osascript -e 'do shell script "printf \"\n# SNP-SMS Local Development Subdomains\n127.0.0.1 snpi.edu.kh\n127.0.0.1 dashboard.snpi.edu.kh\n127.0.0.1 api.snpi.edu.kh\n127.0.0.1 docs.snpi.edu.kh\n127.0.0.1 verify.snpi.edu.kh\n127.0.0.1 portal.snpi.edu.kh\n\" >> /etc/hosts && dscacheutil -flushcache && killall -HUP mDNSResponder" with administrator privileges'
```

### 3.2 Windows Agent Automated Setup
On Windows, agents invoke privileged execution using elevated PowerShell (`RunAs` verb):

```powershell
Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile', '-Command', 'Add-Content -Path "$env:SystemRoot\System32\drivers\etc\hosts" -Value "`n# SNP-SMS Local Development Subdomains`n127.0.0.1 snpi.edu.kh`n127.0.0.1 dashboard.snpi.edu.kh`n127.0.0.1 api.snpi.edu.kh`n127.0.0.1 docs.snpi.edu.kh`n127.0.0.1 verify.snpi.edu.kh`n127.0.0.1 portal.snpi.edu.kh"; Clear-DnsClientCache'
```

### 3.3 Linux Agent Automated Setup
On Ubuntu / Debian / Fedora:

```bash
sudo sh -c 'printf "\n# SNP-SMS Local Development Subdomains\n127.0.0.1 snpi.edu.kh\n127.0.0.1 dashboard.snpi.edu.kh\n127.0.0.1 api.snpi.edu.kh\n127.0.0.1 docs.snpi.edu.kh\n127.0.0.1 verify.snpi.edu.kh\n127.0.0.1 portal.snpi.edu.kh\n" >> /etc/hosts && (resolvectl flush-caches || systemd-resolve --flush-caches || true)'
```

---

## 4. Manual Human Developer Setup Protocol

Developers setting up their machines manually should follow these operating system specific instructions.

### 4.1 macOS Manual Setup

1. Open Terminal and run:
   ```bash
   sudo sh -c 'cat <<EOF >> /etc/hosts

   # ==========================================
   # SNP-SMS Local Development Subdomains
   # ==========================================
   127.0.0.1  snpi.edu.kh
   127.0.0.1  dashboard.snpi.edu.kh
   127.0.0.1  api.snpi.edu.kh
   127.0.0.1  docs.snpi.edu.kh
   127.0.0.1  verify.snpi.edu.kh
   127.0.0.1  portal.snpi.edu.kh
   EOF'
   ```
2. Flush local DNS cache:
   ```bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

### 4.2 Windows Manual Setup

1. Press `Win + S`, type `Notepad`, right-click and choose **Run as administrator**.
2. Open the file:
   `C:\Windows\System32\drivers\etc\hosts`
   *(Ensure file type dropdown is set to "All Files (*.*)")*.
3. Add the following lines to the bottom of the file:
   ```text
   # SNP-SMS Local Development Subdomains
   127.0.0.1  snpi.edu.kh
   127.0.0.1  dashboard.snpi.edu.kh
   127.0.0.1  api.snpi.edu.kh
   127.0.0.1  docs.snpi.edu.kh
   127.0.0.1  verify.snpi.edu.kh
   127.0.0.1  portal.snpi.edu.kh
   ```
4. Save the file (`Ctrl + S`).
5. Open Command Prompt or PowerShell and flush DNS:
   ```cmd
   ipconfig /flushdns
   ```

---

## 5. Development Runtime & Port Access Modes

Developers can access local domains using two runtime modes:

### Mode 1: Direct Port Mode (Zero Proxy Required)
Access services directly via their development ports:
- **Dashboard**: `http://dashboard.snpi.edu.kh:3000`
- **Developer Documentation**: `http://docs.snpi.edu.kh:3000`
- **UI Design System**: `http://docs.snpi.edu.kh:3000/design-system`
- **Certificate Verification Gateway**: `http://verify.snpi.edu.kh:3000`
- **Backend API**: `http://api.snpi.edu.kh:4000/api/v1/health`

### Mode 2: Clean URL Mode (Port 80 Local Reverse Proxy)
To access URLs without port numbers, execute the repository's built-in reverse proxy script:
```bash
# macOS / Linux
sudo npm run dev:proxy

# Windows (Elevated PowerShell)
npm run dev:proxy
```
Clean endpoints active:
- `http://dashboard.snpi.edu.kh` &rarr; proxies to `localhost:3000`
- `http://docs.snpi.edu.kh` &rarr; proxies to `localhost:3000`
- `http://verify.snpi.edu.kh` &rarr; proxies to `localhost:3000`
- `http://api.snpi.edu.kh` &rarr; proxies to `localhost:4000`

---

## 6. Monorepo Integration Specifications

### 6.1 Next.js Subdomain Middleware (`apps/frontend/middleware.ts`)
The frontend uses Next.js middleware to inspect incoming `Host` headers and perform internal rewrites:
- `docs.snpi.edu.kh` with path `/` &rarr; rewrites to `/document`
- `docs.snpi.edu.kh` with path `/design-system` &rarr; rewrites to `/document/design-system`
- `verify.snpi.edu.kh` with path `/` &rarr; rewrites to `/verify`

### 6.2 Backend CORS Whitelist (`apps/backend/src/middleware/security.ts`)
The Express backend explicitly allows local requests originating from `snpi.edu.kh`:
```typescript
// Local development / testing (localhost, 127.0.0.1, or local snpi.edu.kh subdomains)
if (/^https?:\/\/(localhost|127\.0\.0\.1|([a-z0-9-]+\.)*snpi\.edu\.kh)(:\d+)?$/.test(origin)) {
  return true;
}
```

---

## 7. Verification & Diagnostic Smoke Test

To confirm that local domain routing is operational, run the following verification checks:

```bash
# 1. Verify DNS Resolution to 127.0.0.1
ping -c 1 dashboard.snpi.edu.kh

# 2. Verify Frontend Dashboard Response (HTTP 200)
curl -s -I http://dashboard.snpi.edu.kh:3000

# 3. Verify Documentation Subdomain Rewrite (HTTP 200 with x-middleware-rewrite)
curl -s -I http://docs.snpi.edu.kh:3000

# 4. Verify Backend API Health Response (HTTP 200)
curl -s http://api.snpi.edu.kh:4000/api/v1/health
```

Expected diagnostic results:
- All queries resolve to `127.0.0.1`.
- HTTP status codes return `HTTP/1.1 200 OK`.
- `x-middleware-rewrite` header reflects correct route mapping.
