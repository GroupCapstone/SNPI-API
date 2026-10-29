# SNP-SMS Backup and Disaster Recovery Runbook

**Document Version:** 1.0.0  
**Target Database:** MongoDB 7.0+ / 8.0  
**Classification:** Operational Security & Disaster Recovery

---

## 1. Overview & Strategy

The SNP Integrated Multi-Branch School Management System (SNP-SMS) uses an atomic snapshot strategy for daily operational recovery and point-in-time restoration.

- **Snapshot Engine**: Native MongoDB `mongodump` & `mongorestore` utilities with BSON compression (`--gzip`).
- **Backup Frequency**: Scheduled daily backup + 6-hour differential snapshots.
- **Retention Policy**:
  - Daily snapshots: 7 days
  - Weekly snapshots: 4 weeks
  - Monthly archives: 12 months
- **Target Collections**: All 27 core database collections including RBAC, audit logs, student master, billing ledger, and sequence state.

---

## 2. Backup Execution Procedure

### 2.1 Online Production Backup Command

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_ROOT="/var/backups/snp_sms"
BACKUP_TARGET="${BACKUP_ROOT}/${BACKUP_DATE}"
ARCHIVE_FILE="${BACKUP_ROOT}/snp_sms_${BACKUP_DATE}.tar.gz"

mkdir -p "${BACKUP_TARGET}"

echo "[$(date)] Starting MongoDB backup for SNP-SMS..."

# Execute mongodump with gzip compression
mongodump \
  --uri="${MONGODB_URI}" \
  --out="${BACKUP_TARGET}" \
  --gzip

# Create compressed tarball
tar -czf "${ARCHIVE_FILE}" -C "${BACKUP_ROOT}" "${BACKUP_DATE}"
rm -rf "${BACKUP_TARGET}"

echo "[$(date)] Backup completed successfully: ${ARCHIVE_FILE}"

# Optional: Upload to offsite encrypted storage (S3 / R2)
if command -v aws &> /dev/null; then
  aws s3 cp "${ARCHIVE_FILE}" "s3://${BACKUP_S3_BUCKET}/daily/$(basename "${ARCHIVE_FILE}")" --sse AES256
  echo "[$(date)] Offsite sync complete."
fi
```

---

## 3. Restoration & Disaster Recovery Procedure

### 3.1 Step-by-Step Restoration

1. **Prepare Restore Environment**: Ensure the destination MongoDB instance is reachable and authorized.
2. **Extract Archive**:
   ```bash
   tar -xzf /path/to/snp_sms_YYYYMMDD_HHMMSS.tar.gz -C /tmp/restore/
   ```
3. **Execute Restore**:
   ```bash
   mongorestore \
     --uri="${MONGODB_URI}" \
     --nsInclude="snp_sms.*" \
     --drop \
     --gzip \
     /tmp/restore/YYYYMMDD_HHMMSS/snp_sms
   ```
4. **Clean Up Temporary Artifacts**:
   ```bash
   rm -rf /tmp/restore
   ```

---

## 4. Post-Restore Verification Checklist

After restoring the database, execute the verification pipeline before directing user traffic:

1. **Document Count Verification**: Ensure document counts in all 27 collections match the source metadata.
2. **User Authentication Check**: Authenticate with the configured production administrator to verify password hashing and token signing.
3. **Multi-Branch Isolation Check**: Confirm Main Branch (`MB-01`) and Toul Kork (`TK-02`) records maintain their foreign key relationships.
4. **Sequence State Check**: Verify sequence counters (`STU`, `EMP`, `REG`, `TEST`, `ENR`, `TRF`, `PAY`) match the highest issued document identifiers.
5. **Ledger Balance Integrity**: Confirm all payment receipts maintain balance calculations ($Paid + Balance = Due - Discount$).

---

## 5. Authorized Personnel & Escalation

| Role                       | Primary Contact        | Escalation Contact    |
| :------------------------- | :--------------------- | :-------------------- |
| **DevOps Lead**            | `devops@snp.edu.kh`    | `security@snp.edu.kh` |
| **Database Administrator** | `dba@snp.edu.kh`       | `techlead@snp.edu.kh` |
| **System Architect**       | `architect@snp.edu.kh` | `director@snp.edu.kh` |
