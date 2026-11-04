# SNP Integrated Multi-Branch School Management System (SNP-SMS)

## Production Deployment & Operations Runbook

**Document Version:** 1.0.0  
**Target Environment:** Staging & Production  
**Last Updated:** August 30, 2026

---

## 1. System Architecture & Prerequisites

### 1.1 Technology Stack

- **Backend**: Node.js $\ge$ 22.0.0, TypeScript 6, Express 5, Mongoose 9, Pino HTTP Logger, Zod validation, JWT authentication.
- **Frontend**: Next.js 16 (App Router & Turbopack), React 19, Tailwind CSS 4, TanStack Query 5, React Hook Form, Sonner.
- **Database**: MongoDB 7.0+ / 8.0 (Replica Set or sharded deployment required for critical financial and academic transactions; standalone MongoDB is not supported for those workflows).
- **Process Manager**: Docker Compose / PM2 / Kubernetes.
- **Reverse Proxy**: NGINX / Cloudflare with SSL/TLS Termination.

### 1.2 Infrastructure Requirements

| Component          | Minimum Specification | Recommended Production           |
| :----------------- | :-------------------- | :------------------------------- |
| **App Server CPU** | 2 vCPU                | 4 vCPU                           |
| **App Server RAM** | 4 GB                  | 8 GB                             |
| **MongoDB CPU**    | 2 vCPU                | 4 vCPU                           |
| **MongoDB RAM**    | 4 GB                  | 16 GB (WiredTiger Cache)         |
| **Storage (SSD)**  | 50 GB NVMe            | 200 GB+ NVMe with auto-expansion |
| **Network**        | 100 Mbps              | 1 Gbps with internal VPC         |

---

## 2. Environment Configuration & Secret Management

> [!CRITICAL]
> **Zero-Leak Policy**: Production secrets must **never** be committed to Git. Store secrets in environment management systems (e.g. AWS Secrets Manager, Vault, or secure server environment variables).

### 2.1 Production Environment Variables

Provide the following values through the deployment platform's secret manager. Do not copy credential values into this runbook, Git, Docker build arguments, or public frontend variables:

- `NODE_ENV`, `PORT`, `MONGODB_URI`, `FRONTEND_URL`, and `LOG_LEVEL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`
- `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_EMAIL`, and `SUPER_ADMIN_PASSWORD`

Generate three independent high-entropy secrets. Use an HTTPS frontend origin, a TLS-enabled MongoDB URI, and a unique administrator password of at least 16 characters. Production startup rejects missing or placeholder authentication secrets and rejects non-TLS frontend or database configuration.

---

## 3. Production Build & Deployment Pipeline

### 3.1 Step-by-Step Deployment

```bash
# 1. Clone repository & checkout target tag
git clone https://github.com/snp-school/snp-sms.git /opt/snp-sms
cd /opt/snp-sms
git checkout tags/v1.0.0 -b release-v1.0.0

# 2. Install production dependencies
npm ci

# 3. Execute Verification Quality Gate
npm run typecheck
npm run lint
npm run test
npm run format:check

# 4. Compile Backend & Frontend bundles
npm run build

# 5. Start Backend Process (via PM2)
cd /opt/snp-sms/backend
NODE_ENV=production pm2 start dist/server.js --name "snp-sms-api" -i max --time

# 6. Start Frontend Next.js Server
cd /opt/snp-sms/frontend
NODE_ENV=production pm2 start "npm run start" --name "snp-sms-web" --time
```

### 3.2 Docker Deployment (Alternative)

```bash
# Build and run containers via Docker Compose
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

---

## 4. Super Admin Provisioning & Test Credential Removal

1. **Initial Bootstrap**: Run the initial setup script once to create the primary Super Admin account and essential system roles (`super_admin`, `branch_manager`, `academic_officer`, `teacher`, `finance_officer`, `hr_officer`, `staff`).
2. **Purge Test Credentials**:
   - Ensure development-only seed accounts are never deployed to production; use unique production administrator credentials from the secret manager.
3. **Single Super Admin Constraint**:
   - The backend enforces a strict single Super Admin limit.
   - Deletion, deactivation, and self-removal of the Super Admin are blocked at the service and controller layers.

---

## 5. Database Backup, Restore, and Disaster Recovery

### 5.1 Automated Daily Backup Strategy

- **Frequency**: Every 6 hours with daily full snapshots.
- **Retention**: Keep 7 daily backups, 4 weekly backups, and 12 monthly archives.
- **Storage**: Offsite encrypted AWS S3 / Cloudflare R2 bucket.

### 5.2 Backup Command

```bash
#!/bin/bash
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/snp_sms/${BACKUP_DATE}"
mkdir -p "${BACKUP_DIR}"

mongodump \
  --uri="${MONGODB_URI}" \
  --out="${BACKUP_DIR}" \
  --gzip

# Create encrypted tarball
tar -czvf "/var/backups/snp_sms/snp_sms_${BACKUP_DATE}.tar.gz" -C "/var/backups/snp_sms" "${BACKUP_DATE}"
rm -rf "${BACKUP_DIR}"

# Upload to offsite storage
aws s3 cp "/var/backups/snp_sms/snp_sms_${BACKUP_DATE}.tar.gz" "s3://snp-sms-backups/daily/"
```

### 5.3 Restore Command & Disaster Recovery

```bash
#!/bin/bash
# 1. Download target backup
aws s3 cp "s3://snp-sms-backups/daily/snp_sms_YYYYMMDD_HHMMSS.tar.gz" /tmp/

# 2. Extract backup archive
tar -xzvf /tmp/snp_sms_YYYYMMDD_HHMMSS.tar.gz -C /tmp/

# 3. Restore into staging / emergency target database
mongorestore \
  --uri="${MONGODB_URI}" \
  --nsInclude="snp_sms.*" \
  --drop \
  --gzip \
  /tmp/YYYYMMDD_HHMMSS/snp_sms
```

---

## 6. Historical Data Integrity Migration

The integrity migration is idempotent and runs in dry-run mode unless `--apply` is supplied. It repairs only deterministic legacy gaps: invalid enrollment attempt numbers, stale class enrollment counters, and missing half-day attendance snapshot values. Missing monthly payment due dates, orphan references, and school/branch ownership mismatches are reported for manual review and are never guessed. A payment date must not be substituted for a contractual due date.

Run this sequence for staging first, then production:

1. Stop enrollment, transfer, rollover, term-completion, and payment writes by placing the application in a maintenance window.
2. Create a complete MongoDB backup and prove that it restores successfully to an isolated database by following [backup-restore.md](./backup-restore.md).
3. Run the read-only inspection:

   ```bash
   MONGODB_URI="mongodb://.../snp_sms" npm run migrate:historical:check -w @snp-sms/backend
   ```

4. Review the JSON summary. Resolve every item in `errors` manually. Exit code `2` means unresolved integrity defects were found.
5. Apply deterministic repairs only after the dry run is accepted:

   ```bash
   MONGODB_URI="mongodb://.../snp_sms" npm run migrate:historical:apply -w @snp-sms/backend
   ```

6. Run the dry-run command again. It must report zero planned updates and an empty `errors` list before user traffic is restored.
7. Run the application verification pipeline and retain the backup identifier, both migration summaries, operator name, and timestamp in the deployment record.

Never run the apply command against production without a verified backup and active maintenance window.

## 7. Health Checks, Monitoring & Troubleshooting

### 7.1 Health Check Endpoints

- **Liveness / Readiness**: `GET /api/v1/health`
  - Expected Response: `200 OK`
  - Payload:
    ```json
    {
      "success": true,
      "message": "SNP-SMS API service is healthy",
      "data": {
        "status": "ok",
        "timestamp": "2026-08-30T13:30:00.000Z",
        "service": "snp-sms-api",
        "version": "0.1.0",
        "uptimeSeconds": 1420
      }
    }
    ```

### 7.2 Common Troubleshooting Scenarios

| Issue / Symptom                 | Probable Cause                                                 | Corrective Action                                                                              |
| :------------------------------ | :------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **502 Bad Gateway**             | Node.js process crashed or stopped                             | Check `pm2 logs snp-sms-api` or Docker container status. Restart process.                      |
| **401 Unauthorized Replay**     | Access token expired or refresh token revoked                  | Client should call `/api/v1/auth/refresh` with HttpOnly cookie. Check user lock status.        |
| **403 Branch Access Forbidden** | User attempting action outside authorized `branchAccess` scope | Verify user's assigned branch in User Management. Super Admin has `branchAccess: 'all'`.       |
| **MongoDB Replica Lag**         | Secondary members falling behind primary                       | Inspect `rs.status()` and disk I/O metrics on database cluster.                                |
| **High Memory Usage**           | Node.js garbage collection or unindexed queries                | Review MongoDB index metrics; ensure max connection pools and pagination limit caps $\le 200$. |
