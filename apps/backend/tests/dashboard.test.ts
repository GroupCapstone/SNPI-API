import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardRepository } from '../src/modules/dashboard/dashboard.repository';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: {
    find: vi.fn(),
  },
}));

vi.mock('../src/modules/attendance/attendance.model', () => ({
  AttendanceModel: {
    find: vi.fn(),
  },
}));

vi.mock('../src/modules/assessment/assessment.model', () => ({
  AssessmentModel: {
    find: vi.fn(),
  },
}));

vi.mock('../src/modules/payment/payment.model', () => ({
  PaymentModel: {
    find: vi.fn(),
  },
}));

vi.mock('../src/modules/historical-correction/historical-correction.model', () => ({
  HistoricalCorrectionModel: {
    find: vi.fn(),
  },
}));

describe('Dashboard Action Items Service', () => {
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
    permissions: ['dashboard.view.own_branch'],
    branchAccess: [branchId],
  };

  const teacherUser: AuthUser = {
    userId: new Types.ObjectId().toString(),
    username: 'teacher',
    email: 'teacher@snp.edu.kh',
    schoolId,
    roles: ['teacher'],
    permissions: ['attendance.view.own_branch', 'score.view.own_branch'],
    branchAccess: [branchId],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aggregates all 5 task queues for super_admin', async () => {
    const classId = new Types.ObjectId();
    const assessmentId = new Types.ObjectId();
    const paymentId = new Types.ObjectId();
    const correctionId = new Types.ObjectId();
    const nearCapClassId = new Types.ObjectId();

    const mockRepo = new DashboardRepository();
    vi.spyOn(mockRepo, 'findUnmarkedAttendanceClasses').mockResolvedValue([
      {
        _id: classId,
        className: 'Class 1A',
        branchId: { _id: branchId, branchNameEn: 'Main Campus' },
      } as never,
    ]);

    vi.spyOn(mockRepo, 'findUnsubmittedAssessments').mockResolvedValue([
      {
        _id: assessmentId,
        name: 'Midterm Exam',
        code: 'MID-01',
        assessmentDate: new Date('2026-08-01'),
        classId: { className: 'Class 1A' },
        subjectId: { subjectNameEn: 'Mathematics' },
        branchId: { branchNameEn: 'Main Campus' },
      } as never,
    ]);

    vi.spyOn(mockRepo, 'findOverdueDebts').mockResolvedValue([
      {
        _id: paymentId,
        receiptNumber: 'REC-001',
        studentId: { firstName: 'Dara', lastName: 'Sok' },
        amountDue: 500,
        balanceRemaining: 200,
        currency: 'USD',
        dueDate: new Date('2026-08-10'),
        branchId: { branchNameEn: 'Main Campus' },
      } as never,
    ]);

    vi.spyOn(mockRepo, 'findPendingApprovals').mockResolvedValue([
      {
        _id: correctionId,
        correctionNumber: 'COR-001',
        entityType: 'score',
        reason: 'Typo in score',
        studentId: { firstName: 'Dara', lastName: 'Sok' },
        branchId: { branchNameEn: 'Main Campus' },
      } as never,
    ]);

    vi.spyOn(mockRepo, 'findNearCapacityClasses').mockResolvedValue([
      {
        _id: nearCapClassId,
        className: 'Class 2B',
        capacity: 30,
        currentEnrollmentCount: 29,
        branchId: { branchNameEn: 'Main Campus' },
      } as never,
    ]);

    const service = new DashboardService(mockRepo);
    const result = await service.getActionItems(superAdminUser);

    expect(result.summary.totalActionItems).toBe(5);
    expect(result.summary.unmarkedAttendanceCount).toBe(1);
    expect(result.summary.unsubmittedScoresCount).toBe(1);
    expect(result.summary.overdueDebtsCount).toBe(1);
    expect(result.summary.pendingApprovalsCount).toBe(1);
    expect(result.summary.nearCapacityClassesCount).toBe(1);

    expect(result.queues.unmarkedAttendance[0].className).toBe('Class 1A');
    expect(result.queues.unsubmittedScores[0].assessmentName).toBe('Midterm Exam');
    expect(result.queues.overdueDebts[0].studentName).toBe('Dara Sok');
    expect(result.queues.pendingApprovals[0].correctionNumber).toBe('COR-001');
    expect(result.queues.nearCapacityClasses[0].occupancyRate).toBe(97);
  });

  it('restricts teacher from viewing finance and approvals queues', async () => {
    const mockRepo = new DashboardRepository();
    vi.spyOn(mockRepo, 'findUnmarkedAttendanceClasses').mockResolvedValue([]);
    vi.spyOn(mockRepo, 'findUnsubmittedAssessments').mockResolvedValue([]);
    const debtSpy = vi.spyOn(mockRepo, 'findOverdueDebts');
    const approvalSpy = vi.spyOn(mockRepo, 'findPendingApprovals');

    const service = new DashboardService(mockRepo);
    const result = await service.getActionItems(teacherUser);

    expect(debtSpy).not.toHaveBeenCalled();
    expect(approvalSpy).not.toHaveBeenCalled();
    expect(result.queues.overdueDebts).toHaveLength(0);
    expect(result.queues.pendingApprovals).toHaveLength(0);
  });

  it('does not grant action queues from a role label without permissions', async () => {
    const mockRepo = new DashboardRepository();
    const attendanceSpy = vi.spyOn(mockRepo, 'findUnmarkedAttendanceClasses');
    const assessmentSpy = vi.spyOn(mockRepo, 'findUnsubmittedAssessments');
    const debtSpy = vi.spyOn(mockRepo, 'findOverdueDebts');
    const approvalSpy = vi.spyOn(mockRepo, 'findPendingApprovals');
    const capacitySpy = vi.spyOn(mockRepo, 'findNearCapacityClasses');

    const service = new DashboardService(mockRepo);
    const result = await service.getActionItems({
      ...branchManagerUser,
      permissions: [],
      isSuperAdmin: true,
    });

    expect(result.summary.totalActionItems).toBe(0);
    expect(attendanceSpy).not.toHaveBeenCalled();
    expect(assessmentSpy).not.toHaveBeenCalled();
    expect(debtSpy).not.toHaveBeenCalled();
    expect(approvalSpy).not.toHaveBeenCalled();
    expect(capacitySpy).not.toHaveBeenCalled();
  });

  it('rejects access when requesting a branch outside user scope', async () => {
    const service = new DashboardService();
    await expect(
      service.getActionItems(branchManagerUser, { branchId: otherBranchId }),
    ).rejects.toThrow(/You do not have access to data in this branch/);
  });
});
