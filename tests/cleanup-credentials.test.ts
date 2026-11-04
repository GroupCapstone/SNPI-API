import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuditLogModel } from '../src/modules/audit-log/audit-log.model';
import { UserModel } from '../src/modules/user/user.model';
import { runCredentialCleanup } from '../src/scripts/cleanup-credentials';

const executable = (value: unknown) => ({ exec: vi.fn().mockResolvedValue(value) });

describe('Credential Cleanup & Hygiene Script', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('dry-run execution', () => {
    it('analyzes and reports stored credentials needing cleanup without mutating data', async () => {
      // Mock countDocuments for user categories
      vi.spyOn(UserModel, 'countDocuments')
        .mockResolvedValueOnce(3 as never) // previousRefreshTokens
        .mockResolvedValueOnce(2 as never) // expiredLockouts
        .mockResolvedValueOnce(4 as never) // softDeletedUsers
        .mockResolvedValueOnce(5 as never) // inactiveSuspendedTokens
        .mockResolvedValueOnce(6 as never) // expiredRefreshTokens
        .mockResolvedValueOnce(1 as never) // staleTemporaryPasswords
        .mockResolvedValueOnce(100 as never); // total users processed

      // Mock AuditLogModel query
      const mockAuditLogs = [
        {
          _id: new Types.ObjectId(),
          oldValue: { username: 'testuser' },
          newValue: { password: 'plainPassword123' },
        },
      ];

      vi.spyOn(AuditLogModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue(executable(mockAuditLogs)),
        }),
      } as never);

      const userUpdateManySpy = vi.spyOn(UserModel, 'updateMany');
      const auditUpdateOneSpy = vi.spyOn(AuditLogModel, 'updateOne');

      const result = await runCredentialCleanup({ apply: false });

      expect(result.dryRun).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.categories.usedCredentialsRemoved.previousRefreshTokensPurged).toBe(3);
      expect(result.categories.usedCredentialsRemoved.expiredLockoutsCleared).toBe(2);
      expect(result.categories.unusedCredentialsRemoved.softDeletedUserCredentialsPurged).toBe(4);
      expect(result.categories.unusedCredentialsRemoved.inactiveSuspendedTokensPurged).toBe(5);
      expect(result.categories.unusedCredentialsRemoved.expiredRefreshTokensPurged).toBe(6);
      expect(result.categories.unusedCredentialsRemoved.staleTemporaryCredentialsRevoked).toBe(1);
      expect(result.categories.unnecessaryStoredCredentialsSanitized.auditLogEntriesSanitized).toBe(
        1,
      );
      expect(result.totalCredentialsRemovedOrSanitized).toBe(22);
      expect(result.totalCredentialsProcessed).toBe(100);

      // Verify ZERO database mutations during dry-run
      expect(userUpdateManySpy).not.toHaveBeenCalled();
      expect(auditUpdateOneSpy).not.toHaveBeenCalled();
    });
  });

  describe('apply execution', () => {
    it('applies credential purges, tombstones, and sanitizations when apply: true', async () => {
      vi.spyOn(UserModel, 'countDocuments')
        .mockResolvedValueOnce(2 as never) // previousRefreshTokens
        .mockResolvedValueOnce(1 as never) // expiredLockouts
        .mockResolvedValueOnce(1 as never) // softDeletedUsers
        .mockResolvedValueOnce(1 as never) // inactiveSuspendedTokens
        .mockResolvedValueOnce(1 as never) // expiredRefreshTokens
        .mockResolvedValueOnce(1 as never) // staleTemporaryPasswords
        .mockResolvedValueOnce(50 as never); // total users processed

      const userUpdateManySpy = vi
        .spyOn(UserModel, 'updateMany')
        .mockResolvedValue({ modifiedCount: 1 } as never);

      const logId = new Types.ObjectId();
      const mockAuditLogs = [
        {
          _id: logId,
          oldValue: { password: 'oldSecretPassword' },
          newValue: { temporaryPassword: 'tempSecretPassword99' },
        },
      ];

      vi.spyOn(AuditLogModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue(executable(mockAuditLogs)),
        }),
      } as never);

      const auditUpdateOneSpy = vi
        .spyOn(AuditLogModel, 'updateOne')
        .mockResolvedValue({ modifiedCount: 1 } as never);

      const result = await runCredentialCleanup({ apply: true });

      expect(result.dryRun).toBe(false);
      expect(result.errors).toEqual([]);
      expect(result.totalCredentialsRemovedOrSanitized).toBe(8);

      // Verify updateMany was called for each category needing updates
      expect(userUpdateManySpy).toHaveBeenCalled();
      // 1: previous tokens unset
      // 2: expired lockouts unset + failedLoginAttempts reset
      // 3: locked status restored to active
      // 4: soft deleted user credentials purged
      // 5: inactive/suspended tokens purged
      // 6: expired refresh tokens purged
      // 7: stale temp credentials revoked
      expect(userUpdateManySpy.mock.calls.length).toBeGreaterThanOrEqual(6);

      // Verify audit log sanitization called with redacted data
      expect(auditUpdateOneSpy).toHaveBeenCalledOnce();
      const auditUpdateCall = auditUpdateOneSpy.mock.calls[0];
      expect(auditUpdateCall[0]).toEqual({ _id: logId });
      expect(auditUpdateCall[1]).toEqual({
        $set: {
          oldValue: { password: '[REDACTED]' },
          newValue: { temporaryPassword: '[REDACTED]' },
        },
      });
    });

    it('skips database updates when no records match the cleanup criteria', async () => {
      vi.spyOn(UserModel, 'countDocuments')
        .mockResolvedValueOnce(0 as never)
        .mockResolvedValueOnce(0 as never)
        .mockResolvedValueOnce(0 as never)
        .mockResolvedValueOnce(0 as never)
        .mockResolvedValueOnce(0 as never)
        .mockResolvedValueOnce(0 as never)
        .mockResolvedValueOnce(10 as never);

      vi.spyOn(AuditLogModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue(executable([])),
        }),
      } as never);

      const userUpdateManySpy = vi.spyOn(UserModel, 'updateMany');
      const auditUpdateOneSpy = vi.spyOn(AuditLogModel, 'updateOne');

      const result = await runCredentialCleanup({ apply: true });

      expect(result.dryRun).toBe(false);
      expect(result.totalCredentialsRemovedOrSanitized).toBe(0);
      expect(userUpdateManySpy).not.toHaveBeenCalled();
      expect(auditUpdateOneSpy).not.toHaveBeenCalled();
    });
  });

  describe('custom retention parameters', () => {
    it('accepts custom retention thresholds and grace periods', async () => {
      vi.spyOn(UserModel, 'countDocuments').mockResolvedValue(0 as never);
      vi.spyOn(AuditLogModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue(executable([])),
        }),
      } as never);

      const result = await runCredentialCleanup({
        apply: false,
        refreshTokenRetentionDays: 14,
        staleTemporaryPasswordDays: 60,
        rotationGraceMinutes: 30,
      });

      expect(result.dryRun).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('catches and records unexpected errors gracefully without unhandled crashes', async () => {
      vi.spyOn(UserModel, 'countDocuments').mockRejectedValue(
        new Error('Database connectivity lost') as never,
      );

      const result = await runCredentialCleanup({ apply: true });

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toBe('Database connectivity lost');
      expect(result.totalCredentialsRemovedOrSanitized).toBe(0);
    });
  });
});
