/**
 * SNP-SMS Automated Credential Cleanup & Hygiene Script
 *
 * Identifies and removes unused credentials, purges stored credentials after use,
 * and clears unnecessary credentials from the database to ensure zero unnecessary
 * credential retention.
 *
 * Scope of Credential Hygiene:
 * 1. Post-use credentials:
 *    - Lingering previousRefreshTokenHash from completed token rotations
 *    - Expired lockout timestamps (lockedUntil <= now)
 * 2. Unused & unnecessary stored credentials:
 *    - Soft-deleted users retaining active password hashes or refresh token hashes
 *    - Inactive or suspended user accounts holding active refresh tokens
 *    - Expired refresh tokens exceeding the retention threshold
 *    - Stale unused temporary passwords exceeding the temporary password validity window
 * 3. Historical audit log sanitization:
 *    - Redacting raw passwords or sensitive credentials in legacy audit entries
 *
 * Dry-run is the default. Pass --apply to execute updates against the database.
 *
 * Usage:
 *   npx tsx src/scripts/cleanup-credentials.ts          # Dry run analysis
 *   npx tsx src/scripts/cleanup-credentials.ts --apply  # Apply credential purges
 */

/* eslint-disable no-console */
import mongoose from 'mongoose';

import { AuditLogModel } from '../modules/audit-log/audit-log.model';
import { UserModel, type UserStatus } from '../modules/user/user.model';
import { redactSensitiveData } from '../utils/redact';

export interface CredentialCleanupOptions {
  apply?: boolean;
  refreshTokenRetentionDays?: number;
  staleTemporaryPasswordDays?: number;
  rotationGraceMinutes?: number;
}

export interface CredentialCleanupSummary {
  runId: string;
  timestamp: string;
  dryRun: boolean;
  categories: {
    usedCredentialsRemoved: {
      previousRefreshTokensPurged: number;
      expiredLockoutsCleared: number;
    };
    unusedCredentialsRemoved: {
      softDeletedUserCredentialsPurged: number;
      inactiveSuspendedTokensPurged: number;
      expiredRefreshTokensPurged: number;
      staleTemporaryCredentialsRevoked: number;
    };
    unnecessaryStoredCredentialsSanitized: {
      auditLogEntriesSanitized: number;
    };
  };
  totalCredentialsProcessed: number;
  totalCredentialsRemovedOrSanitized: number;
  errors: string[];
}

const CLEANUP_SCRIPT_ID = '2026-10-v1.0-credential-hygiene';
const TOMBSTONE_PASSWORD_HASH = '*DELETED_CREDENTIAL_PURGED*';
const EXPIRED_TEMP_CREDENTIAL_HASH = '*EXPIRED_TEMP_CREDENTIAL_PURGED*';

export const runCredentialCleanup = async (
  options: CredentialCleanupOptions = {},
): Promise<CredentialCleanupSummary> => {
  const isApply = Boolean(options.apply);
  const refreshTokenRetentionDays = options.refreshTokenRetentionDays ?? 7;
  const staleTemporaryPasswordDays = options.staleTemporaryPasswordDays ?? 30;
  const rotationGraceMinutes = options.rotationGraceMinutes ?? 10;

  const now = new Date();
  const tokenExpirationCutoff = new Date(
    now.getTime() - refreshTokenRetentionDays * 24 * 60 * 60 * 1000,
  );
  const tempPasswordCutoff = new Date(
    now.getTime() - staleTemporaryPasswordDays * 24 * 60 * 60 * 1000,
  );
  const rotationGraceCutoff = new Date(now.getTime() - rotationGraceMinutes * 60 * 1000);

  const summary: CredentialCleanupSummary = {
    runId: CLEANUP_SCRIPT_ID,
    timestamp: now.toISOString(),
    dryRun: !isApply,
    categories: {
      usedCredentialsRemoved: {
        previousRefreshTokensPurged: 0,
        expiredLockoutsCleared: 0,
      },
      unusedCredentialsRemoved: {
        softDeletedUserCredentialsPurged: 0,
        inactiveSuspendedTokensPurged: 0,
        expiredRefreshTokensPurged: 0,
        staleTemporaryCredentialsRevoked: 0,
      },
      unnecessaryStoredCredentialsSanitized: {
        auditLogEntriesSanitized: 0,
      },
    },
    totalCredentialsProcessed: 0,
    totalCredentialsRemovedOrSanitized: 0,
    errors: [],
  };

  try {
    // -------------------------------------------------------------------------
    // 1. Post-use credentials: Lingering previousRefreshTokenHash
    // -------------------------------------------------------------------------
    // Tokens rotated past the grace window are fully consumed and should not be stored.
    const previousTokensQuery = {
      previousRefreshTokenHash: { $exists: true, $ne: null },
      $or: [
        { tokenRotatedAt: { $exists: false } },
        { tokenRotatedAt: null },
        { tokenRotatedAt: { $lt: rotationGraceCutoff } },
      ],
    };

    const previousTokensCount = await UserModel.countDocuments(previousTokensQuery);
    summary.categories.usedCredentialsRemoved.previousRefreshTokensPurged = previousTokensCount;

    if (isApply && previousTokensCount > 0) {
      await UserModel.updateMany(previousTokensQuery, {
        $unset: { previousRefreshTokenHash: 1, tokenRotatedAt: 1 },
      });
    }

    // -------------------------------------------------------------------------
    // 2. Post-use credentials: Clear expired lockouts
    // -------------------------------------------------------------------------
    // When lockedUntil <= now, lockout has expired and retaining it is unnecessary state.
    const expiredLockoutsQuery = {
      lockedUntil: { $exists: true, $ne: null, $lte: now },
    };

    const expiredLockoutsCount = await UserModel.countDocuments(expiredLockoutsQuery);
    summary.categories.usedCredentialsRemoved.expiredLockoutsCleared = expiredLockoutsCount;

    if (isApply && expiredLockoutsCount > 0) {
      await UserModel.updateMany(expiredLockoutsQuery, {
        $unset: { lockedUntil: 1 },
        $set: { failedLoginAttempts: 0 },
      });
      // Restore status to active if user was locked solely due to expired lockout
      await UserModel.updateMany(
        { status: 'locked' as UserStatus, lockedUntil: { $exists: false } },
        { $set: { status: 'active' as UserStatus } },
      );
    }

    // -------------------------------------------------------------------------
    // 3. Unused credentials: Soft-deleted user credentials
    // -------------------------------------------------------------------------
    // Deleted users must not retain active refresh tokens or active password hashes.
    const deletedUserQuery = {
      isDeleted: true,
      $or: [
        { refreshTokenHash: { $exists: true, $ne: null } },
        { previousRefreshTokenHash: { $exists: true, $ne: null } },
        { passwordHash: { $ne: TOMBSTONE_PASSWORD_HASH } },
      ],
    };

    const deletedUsersCount = await UserModel.countDocuments(deletedUserQuery);
    summary.categories.unusedCredentialsRemoved.softDeletedUserCredentialsPurged =
      deletedUsersCount;

    if (isApply && deletedUsersCount > 0) {
      await UserModel.updateMany(deletedUserQuery, {
        $unset: {
          refreshTokenHash: 1,
          previousRefreshTokenHash: 1,
          tokenRotatedAt: 1,
        },
        $set: {
          passwordHash: TOMBSTONE_PASSWORD_HASH,
          status: 'inactive' as UserStatus,
        },
        $inc: { tokenVersion: 1 },
      });
    }

    // -------------------------------------------------------------------------
    // 4. Unused credentials: Inactive or suspended user tokens
    // -------------------------------------------------------------------------
    // Inactive/suspended accounts cannot use refresh tokens; storing them is unnecessary.
    const inactiveSuspendedTokensQuery = {
      isDeleted: false,
      status: { $in: ['inactive', 'suspended'] as UserStatus[] },
      $or: [
        { refreshTokenHash: { $exists: true, $ne: null } },
        { previousRefreshTokenHash: { $exists: true, $ne: null } },
      ],
    };

    const inactiveSuspendedCount = await UserModel.countDocuments(inactiveSuspendedTokensQuery);
    summary.categories.unusedCredentialsRemoved.inactiveSuspendedTokensPurged =
      inactiveSuspendedCount;

    if (isApply && inactiveSuspendedCount > 0) {
      await UserModel.updateMany(inactiveSuspendedTokensQuery, {
        $unset: {
          refreshTokenHash: 1,
          previousRefreshTokenHash: 1,
          tokenRotatedAt: 1,
        },
        $inc: { tokenVersion: 1 },
      });
    }

    // -------------------------------------------------------------------------
    // 5. Unused credentials: Expired refresh tokens on active accounts
    // -------------------------------------------------------------------------
    // Tokens past the retention threshold can no longer be refreshed and should be purged.
    const expiredTokensQuery = {
      isDeleted: false,
      status: 'active' as UserStatus,
      refreshTokenHash: { $exists: true, $ne: null },
      $and: [
        {
          $or: [
            { tokenRotatedAt: { $lt: tokenExpirationCutoff } },
            { tokenRotatedAt: { $exists: false } },
            { tokenRotatedAt: null },
          ],
        },
        {
          $or: [
            { lastLoginAt: { $lt: tokenExpirationCutoff } },
            { lastLoginAt: { $exists: false } },
            { lastLoginAt: null },
          ],
        },
      ],
    };

    const expiredTokensCount = await UserModel.countDocuments(expiredTokensQuery);
    summary.categories.unusedCredentialsRemoved.expiredRefreshTokensPurged = expiredTokensCount;

    if (isApply && expiredTokensCount > 0) {
      await UserModel.updateMany(expiredTokensQuery, {
        $unset: {
          refreshTokenHash: 1,
          previousRefreshTokenHash: 1,
          tokenRotatedAt: 1,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 6. Unused credentials: Stale unused temporary passwords
    // -------------------------------------------------------------------------
    // Users with mustChangePassword: true that were never claimed within the policy window.
    const staleTempQuery = {
      isDeleted: false,
      mustChangePassword: true,
      updatedAt: { $lt: tempPasswordCutoff },
      $or: [
        { lastLoginAt: { $exists: false } },
        { lastLoginAt: null },
        { lastLoginAt: { $lt: tempPasswordCutoff } },
      ],
    };

    const staleTempCount = await UserModel.countDocuments(staleTempQuery);
    summary.categories.unusedCredentialsRemoved.staleTemporaryCredentialsRevoked = staleTempCount;

    if (isApply && staleTempCount > 0) {
      await UserModel.updateMany(staleTempQuery, {
        $set: {
          status: 'suspended' as UserStatus,
          passwordHash: EXPIRED_TEMP_CREDENTIAL_HASH,
        },
        $unset: {
          refreshTokenHash: 1,
          previousRefreshTokenHash: 1,
          tokenRotatedAt: 1,
        },
        $inc: { tokenVersion: 1 },
      });
    }

    // -------------------------------------------------------------------------
    // 7. Sanitization: Historical Audit Logs storing raw passwords or secrets
    // -------------------------------------------------------------------------
    const sensitiveAuditQuery = {
      $or: [
        { 'newValue.password': { $exists: true } },
        { 'newValue.temporaryPassword': { $exists: true } },
        { 'newValue.currentPassword': { $exists: true } },
        { 'newValue.newPassword': { $exists: true } },
        { 'oldValue.password': { $exists: true } },
        { 'oldValue.temporaryPassword': { $exists: true } },
      ],
    };

    const sensitiveLogs = await AuditLogModel.find(sensitiveAuditQuery)
      .select('_id oldValue newValue')
      .lean()
      .exec();

    summary.categories.unnecessaryStoredCredentialsSanitized.auditLogEntriesSanitized =
      sensitiveLogs.length;

    if (isApply && sensitiveLogs.length > 0) {
      for (const logEntry of sensitiveLogs) {
        const sanitizedOld = logEntry.oldValue
          ? (redactSensitiveData(logEntry.oldValue) as Record<string, unknown>)
          : undefined;
        const sanitizedNew = logEntry.newValue
          ? (redactSensitiveData(logEntry.newValue) as Record<string, unknown>)
          : undefined;

        await AuditLogModel.updateOne(
          { _id: logEntry._id },
          { $set: { oldValue: sanitizedOld, newValue: sanitizedNew } },
        );
      }
    }

    // Calculate totals
    summary.totalCredentialsRemovedOrSanitized =
      summary.categories.usedCredentialsRemoved.previousRefreshTokensPurged +
      summary.categories.usedCredentialsRemoved.expiredLockoutsCleared +
      summary.categories.unusedCredentialsRemoved.softDeletedUserCredentialsPurged +
      summary.categories.unusedCredentialsRemoved.inactiveSuspendedTokensPurged +
      summary.categories.unusedCredentialsRemoved.expiredRefreshTokensPurged +
      summary.categories.unusedCredentialsRemoved.staleTemporaryCredentialsRevoked +
      summary.categories.unnecessaryStoredCredentialsSanitized.auditLogEntriesSanitized;

    summary.totalCredentialsProcessed = await UserModel.countDocuments({});
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    summary.errors.push(errorMsg);
  }

  return summary;
};

if (require.main === module) {
  const applyChanges = process.argv.includes('--apply');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snp_sms';

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log(
        `[INFO] Starting SNP-SMS Credential Cleanup (${applyChanges ? 'APPLY' : 'DRY-RUN'})...`,
      );
      const summary = await runCredentialCleanup({ apply: applyChanges });
      console.log(JSON.stringify(summary, null, 2));
      await mongoose.disconnect();
      process.exit(summary.errors.length > 0 ? 2 : 0);
    })
    .catch((error: unknown) => {
      console.error('[ERROR] Credential cleanup execution failed:', error);
      process.exit(1);
    });
}
