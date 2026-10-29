import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardRepository } from '../src/modules/dashboard/dashboard.repository';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import { ScoreModel } from '../src/modules/score/score.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';
import type { AuthUser } from '../src/types/auth';

describe('Academic Honor Roll & Top Performers Leaderboard', () => {
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

  const teacherUser: AuthUser = {
    userId: new Types.ObjectId().toString(),
    username: 'teacher1',
    email: 'teacher1@snp.edu.kh',
    schoolId,
    roles: ['teacher'],
    permissions: ['score.view.own_branch', 'class.view.own_branch'],
    branchAccess: [branchId],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Service Layer: Access Control and Scoping', () => {
    it('successfully returns academic honor roll data for authorized branch', async () => {
      const mockRepo = new DashboardRepository();
      vi.spyOn(mockRepo, 'getAcademicHonorRoll').mockResolvedValue({
        summary: {
          totalEvaluatedStudents: 2,
          overallAverage: 92.5,
          overallPassingRate: 100,
          honorRollCount: 2,
        },
        topPerformers: [
          {
            id: 'tr-1',
            studentId: new Types.ObjectId().toString(),
            studentCode: 'STU-001',
            studentName: 'Dara Som',
            className: 'Grade 10A',
            programName: 'High School',
            branchName: 'Main Campus',
            averageScore: 95.0,
            totalScore: 475.0,
            gpa: 4.0,
            letterGrade: 'A',
            rank: 1,
            attendanceRate: 98.5,
          },
          {
            id: 'tr-2',
            studentId: new Types.ObjectId().toString(),
            studentCode: 'STU-002',
            studentName: 'Sophea Chan',
            className: 'Grade 10B',
            programName: 'High School',
            branchName: 'Main Campus',
            averageScore: 90.0,
            totalScore: 450.0,
            gpa: 3.8,
            letterGrade: 'A',
            rank: 2,
            attendanceRate: 96.0,
          },
        ],
        classPerformances: [
          {
            classId: 'cls-1',
            className: 'Grade 10A',
            programName: 'High School',
            studentCount: 1,
            classAverage: 95.0,
            highestScore: 95.0,
            passingRate: 100,
          },
          {
            classId: 'cls-2',
            className: 'Grade 10B',
            programName: 'High School',
            studentCount: 1,
            classAverage: 90.0,
            highestScore: 90.0,
            passingRate: 100,
          },
        ],
        gradeDistribution: [
          { grade: 'A', count: 2, percentage: 100 },
          { grade: 'B', count: 0, percentage: 0 },
          { grade: 'C', count: 0, percentage: 0 },
          { grade: 'D', count: 0, percentage: 0 },
          { grade: 'E', count: 0, percentage: 0 },
          { grade: 'F', count: 0, percentage: 0 },
        ],
      });

      const service = new DashboardService(mockRepo);
      const result = await service.getAcademicHonorRoll(teacherUser, { branchId });

      expect(result.summary.totalEvaluatedStudents).toBe(2);
      expect(result.summary.honorRollCount).toBe(2);
      expect(result.topPerformers).toHaveLength(2);
      expect(result.topPerformers[0].studentName).toBe('Dara Som');
      expect(result.topPerformers[0].rank).toBe(1);
      expect(result.classPerformances).toHaveLength(2);
    });

    it('rejects access when requesting a branch outside user branch access', async () => {
      const service = new DashboardService();
      await expect(
        service.getAcademicHonorRoll(teacherUser, { branchId: otherBranchId }),
      ).rejects.toThrow('You do not have access to academic data in this branch');
    });

    it('allows super admin to query any branch or consolidated scope', async () => {
      const mockRepo = new DashboardRepository();
      vi.spyOn(mockRepo, 'getAcademicHonorRoll').mockResolvedValue({
        summary: {
          totalEvaluatedStudents: 0,
          overallAverage: 0,
          overallPassingRate: 0,
          honorRollCount: 0,
        },
        topPerformers: [],
        classPerformances: [],
        gradeDistribution: [
          { grade: 'A', count: 0, percentage: 0 },
          { grade: 'B', count: 0, percentage: 0 },
          { grade: 'C', count: 0, percentage: 0 },
          { grade: 'D', count: 0, percentage: 0 },
          { grade: 'E', count: 0, percentage: 0 },
          { grade: 'F', count: 0, percentage: 0 },
        ],
      });

      const service = new DashboardService(mockRepo);
      const result = await service.getAcademicHonorRoll(superAdminUser, {
        branchId: otherBranchId,
      });
      expect(result.summary.totalEvaluatedStudents).toBe(0);
      expect(mockRepo.getAcademicHonorRoll).toHaveBeenCalledWith(
        expect.objectContaining({
          branchIds: [otherBranchId],
        }),
      );
    });
  });

  describe('Repository Layer: Data Aggregation and Calculation', () => {
    it('aggregates correctly from TermResultModel when records exist', async () => {
      const mockTermResults = [
        {
          _id: new Types.ObjectId(),
          studentId: {
            _id: new Types.ObjectId(),
            studentId: 'STU-101',
            firstName: 'Chann',
            lastName: 'Vireak',
          },
          classId: { _id: new Types.ObjectId(), className: 'Class 12A' },
          programId: { _id: new Types.ObjectId(), name: 'National Program' },
          branchId: { _id: new Types.ObjectId(), branchNameEn: 'Phnom Penh Branch' },
          averageScore: 92,
          totalScore: 460,
          gpa: 4.0,
          letterGrade: 'A',
          attendanceRate: 98,
          resultStatus: 'PASSED',
        },
        {
          _id: new Types.ObjectId(),
          studentId: {
            _id: new Types.ObjectId(),
            studentId: 'STU-102',
            firstName: 'Bopha',
            lastName: 'Keo',
          },
          classId: { _id: new Types.ObjectId(), className: 'Class 12B' },
          programId: { _id: new Types.ObjectId(), name: 'National Program' },
          branchId: { _id: new Types.ObjectId(), branchNameEn: 'Phnom Penh Branch' },
          averageScore: 78,
          totalScore: 390,
          gpa: 3.0,
          letterGrade: 'B',
          attendanceRate: 92,
          resultStatus: 'PASSED',
        },
      ];

      vi.spyOn(TermResultModel, 'find').mockReturnValue({
        populate: () => ({
          populate: () => ({
            populate: () => ({
              populate: () => ({
                sort: () => ({
                  lean: vi.fn().mockResolvedValue(mockTermResults as never),
                }),
              }),
            }),
          }),
        }),
      } as never);

      const repo = new DashboardRepository();
      const res = await repo.getAcademicHonorRoll({ branchIds: [branchId] });

      expect(res.summary.totalEvaluatedStudents).toBe(2);
      expect(res.summary.overallAverage).toBe(85);
      expect(res.summary.overallPassingRate).toBe(100);
      expect(res.summary.honorRollCount).toBe(1);
      expect(res.topPerformers).toHaveLength(2);
      expect(res.topPerformers[0].rank).toBe(1);
      expect(res.topPerformers[0].studentCode).toBe('STU-101');
      expect(res.topPerformers[1].rank).toBe(2);
      expect(res.topPerformers[1].studentCode).toBe('STU-102');
      expect(res.gradeDistribution.find((g) => g.grade === 'A')?.count).toBe(1);
      expect(res.gradeDistribution.find((g) => g.grade === 'B')?.count).toBe(1);
    });

    it('falls back to ScoreModel when TermResultModel has no records', async () => {
      vi.spyOn(TermResultModel, 'find').mockReturnValue({
        populate: () => ({
          populate: () => ({
            populate: () => ({
              populate: () => ({
                sort: () => ({
                  lean: vi.fn().mockResolvedValue([] as never),
                }),
              }),
            }),
          }),
        }),
      } as never);

      const studentId = new Types.ObjectId();
      const mockScores = [
        {
          _id: new Types.ObjectId(),
          studentId: {
            _id: studentId,
            studentId: 'STU-999',
            firstName: 'Srey',
            lastName: 'Pov',
          },
          classId: { _id: new Types.ObjectId(), className: 'Class 9A' },
          branchId: { _id: new Types.ObjectId(), branchNameEn: 'Main Campus' },
          percentage: 88,
          letterGrade: 'A',
          isDeleted: false,
          isAbsent: false,
        },
      ];

      vi.spyOn(ScoreModel, 'find').mockReturnValue({
        populate: () => ({
          populate: () => ({
            populate: () => ({
              lean: vi.fn().mockResolvedValue(mockScores as never),
            }),
          }),
        }),
      } as never);

      const repo = new DashboardRepository();
      const res = await repo.getAcademicHonorRoll({ branchIds: [branchId] });

      expect(res.summary.totalEvaluatedStudents).toBe(1);
      expect(res.summary.honorRollCount).toBe(1);
      expect(res.topPerformers[0].studentName).toBe('Srey Pov');
      expect(res.topPerformers[0].letterGrade).toBe('A');
      expect(res.topPerformers[0].averageScore).toBe(88);
    });

    it('returns empty structures cleanly when neither TermResults nor Scores exist', async () => {
      vi.spyOn(TermResultModel, 'find').mockReturnValue({
        populate: () => ({
          populate: () => ({
            populate: () => ({
              populate: () => ({
                sort: () => ({
                  lean: vi.fn().mockResolvedValue([] as never),
                }),
              }),
            }),
          }),
        }),
      } as never);

      vi.spyOn(ScoreModel, 'find').mockReturnValue({
        populate: () => ({
          populate: () => ({
            populate: () => ({
              lean: vi.fn().mockResolvedValue([] as never),
            }),
          }),
        }),
      } as never);

      const repo = new DashboardRepository();
      const res = await repo.getAcademicHonorRoll({ branchIds: [branchId] });

      expect(res.summary.totalEvaluatedStudents).toBe(0);
      expect(res.topPerformers).toHaveLength(0);
      expect(res.classPerformances).toHaveLength(0);
      expect(res.gradeDistribution).toHaveLength(6);
    });
  });
});
