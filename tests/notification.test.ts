import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationRepository } from '../src/modules/notification/notification.repository';
import { NotificationService } from '../src/modules/notification/notification.service';
import { StudentModel } from '../src/modules/student/student.model';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/student/student.model', () => ({
  StudentModel: {
    findById: vi.fn(),
  },
}));

describe('Notification & Parent Outreach Service', () => {
  const schoolId = new Types.ObjectId().toString();
  const branchId = new Types.ObjectId().toString();
  const otherBranchId = new Types.ObjectId().toString();

  const superAdminUser: AuthUser = {
    userId: new Types.ObjectId().toString(),
    username: 'admin',
    email: 'admin@snp.edu.kh',
    schoolId,
    roles: ['super_admin'],
    permissions: ['*'],
    branchAccess: 'all',
  };

  const branchManagerUser: AuthUser = {
    userId: new Types.ObjectId().toString(),
    username: 'bm',
    email: 'bm@snp.edu.kh',
    schoolId,
    roles: ['branch_manager'],
    permissions: ['notification.create.own_branch', 'student.edit.own_branch'],
    branchAccess: [branchId],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('successfully creates and dispatches a notification via Telegram', async () => {
      const mockRepo = new NotificationRepository();
      const notifId = new Types.ObjectId().toString();

      vi.spyOn(mockRepo, 'createNotification').mockResolvedValue({
        _id: notifId,
        schoolId: new Types.ObjectId(schoolId),
        branchId: new Types.ObjectId(branchId),
        channel: 'telegram',
        type: 'announcement',
        title: 'Midterm Break Notice',
        body: 'School will be closed next Monday.',
        status: 'pending',
      } as never);

      vi.spyOn(mockRepo, 'updateNotificationStatus').mockResolvedValue({
        _id: notifId,
        channel: 'telegram',
        title: 'Midterm Break Notice',
        status: 'sent',
        sentAt: new Date(),
      } as never);

      const service = new NotificationService(mockRepo);
      const result = await service.sendNotification(
        {
          branchId,
          channel: 'telegram',
          type: 'announcement',
          title: 'Midterm Break Notice',
          body: 'School will be closed next Monday.',
        },
        branchManagerUser,
      );

      expect(result.status).toBe('sent');
      expect(mockRepo.createNotification).toHaveBeenCalled();
      expect(mockRepo.updateNotificationStatus).toHaveBeenCalledWith(
        notifId,
        'sent',
        undefined,
        expect.any(Date),
      );
    });

    it('rejects notification dispatch if user lacks access to the branch', async () => {
      const service = new NotificationService();
      await expect(
        service.sendNotification(
          {
            branchId: otherBranchId,
            channel: 'telegram',
            title: 'Unauthorized Notice',
            body: 'Should fail',
          },
          branchManagerUser,
        ),
      ).rejects.toThrow(/You do not have permission to send notifications for this branch/);
    });
  });

  describe('triggerAbsenceAlert', () => {
    it('dispatches absence notification and records parent contact log automatically', async () => {
      const studentId = new Types.ObjectId().toString();
      const mockStudent = {
        _id: studentId,
        studentId: 'STU-000100',
        schoolId,
        branchId,
        firstName: 'Dara',
        lastName: 'Sok',
        khmerName: 'សុខ តារា',
        phone: '012999888',
        guardians: [
          {
            fullName: 'Chea Sok',
            phone: '012888777',
            relationship: 'father',
            isPrimary: true,
          },
        ],
        isDeleted: false,
      };

      vi.spyOn(StudentModel, 'findById').mockReturnValue({
        populate: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockStudent),
        }),
      } as never);

      const mockRepo = new NotificationRepository();
      const notifId = new Types.ObjectId().toString();
      const contactLogId = new Types.ObjectId().toString();

      vi.spyOn(mockRepo, 'createNotification').mockResolvedValue({
        _id: notifId,
        status: 'pending',
      } as never);

      vi.spyOn(mockRepo, 'updateNotificationStatus').mockResolvedValue({
        _id: notifId,
        status: 'sent',
      } as never);

      vi.spyOn(mockRepo, 'createContactLog').mockResolvedValue({
        _id: contactLogId,
        studentId: new Types.ObjectId(studentId),
        guardianName: 'Chea Sok',
        guardianPhone: '012888777',
        contactType: 'telegram',
        purpose: 'absence',
        outcome: 'reached',
      } as never);

      const service = new NotificationService(mockRepo);
      const result = await service.triggerAbsenceAlert(
        {
          studentId,
          consecutiveDays: 3,
          channel: 'telegram',
        },
        superAdminUser,
      );

      expect(result.notification.status).toBe('sent');
      expect(result.contactLog.guardianName).toBe('Chea Sok');
      expect(result.contactLog.purpose).toBe('absence');
      expect(mockRepo.createContactLog).toHaveBeenCalled();
    });

    it('rejects absence alert if student is not found', async () => {
      vi.spyOn(StudentModel, 'findById').mockReturnValue({
        populate: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(null),
        }),
      } as never);

      const service = new NotificationService();
      await expect(
        service.triggerAbsenceAlert(
          {
            studentId: new Types.ObjectId().toString(),
            consecutiveDays: 3,
          },
          superAdminUser,
        ),
      ).rejects.toThrow(/not found/);
    });
  });

  describe('testTelegram', () => {
    it('returns successful simulated delivery in mock mode', async () => {
      const service = new NotificationService();
      const result = await service.testTelegram('@snp_test_channel', 'Test message');
      expect(result.success).toBe(true);
      expect(result.messageId).toContain('mock-tg-');
    });
  });
});
