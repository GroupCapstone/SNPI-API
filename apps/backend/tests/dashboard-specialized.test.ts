import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardRepository } from '../src/modules/dashboard/dashboard.repository';
import { DashboardService } from '../src/modules/dashboard/dashboard.service';
import type { AuthUser } from '../src/types/auth';

describe('Specialized Dashboard Pulses Service', () => {
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
    username: 'branch_head',
    email: 'branchhead@snp.edu.kh',
    schoolId,
    roles: ['branch_manager'],
    permissions: ['payment.view.own_branch', 'student.view.own_branch', 'employee.view.own_branch'],
    branchAccess: [branchId],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Finance Pulse', () => {
    it('returns today reconciliation, aging buckets, and monthly collection for branch manager', async () => {
      const mockRepo = new DashboardRepository();
      vi.spyOn(mockRepo, 'getFinancePulse').mockResolvedValue({
        today: {
          totalAmount: 1250,
          transactionCount: 5,
          splits: [
            { method: 'aba_pay', totalAmount: 800, transactionCount: 3, currency: 'USD' },
            { method: 'cash', totalAmount: 450, transactionCount: 2, currency: 'USD' },
          ],
        },
        overdueAging: [
          { label: '1 - 15 Days', range: '1-15', count: 3, totalAmount: 450 },
          { label: '16 - 30 Days', range: '16-30', count: 2, totalAmount: 300 },
          { label: '31+ Days', range: '31+', count: 1, totalAmount: 200 },
        ],
        overdueStudents: [
          {
            paymentId: new Types.ObjectId().toString(),
            studentId: new Types.ObjectId().toString(),
            studentCode: 'STU-001',
            studentName: 'Sophea Chan',
            className: 'Grade 10A',
            amountDue: 250,
            balanceRemaining: 150,
            currency: 'USD',
            dueDate: new Date('2026-08-01').toISOString(),
            daysOverdue: 35,
            guardianName: 'Dara Chan',
            guardianPhone: '012345678',
          },
        ],
        monthlyCollection: [
          {
            month: 1,
            monthNameEn: 'January',
            monthNameKh: 'មករា',
            targetAmount: 5000,
            collectedAmount: 4500,
            pendingAmount: 500,
            collectionRate: 90,
          },
        ],
      });

      const service = new DashboardService(mockRepo);
      const result = await service.getFinancePulse(branchManagerUser, {
        branchId,
        year: 2026,
        month: 8,
      });

      expect(result.today.totalAmount).toBe(1250);
      expect(result.today.splits).toHaveLength(2);
      expect(result.overdueAging).toHaveLength(3);
      expect(result.overdueStudents[0].studentName).toBe('Sophea Chan');
      expect(result.overdueStudents[0].guardianPhone).toBe('012345678');
      expect(result.monthlyCollection[0].collectionRate).toBe(90);
    });

    it('rejects finance pulse access when requesting an unauthorized branch', async () => {
      const service = new DashboardService();
      await expect(
        service.getFinancePulse(branchManagerUser, { branchId: otherBranchId }),
      ).rejects.toThrow(/You do not have access to financial data in this branch/);
    });
  });

  describe('Student Affairs Pulse', () => {
    it('returns admissions funnel, movement, at-risk absences, and birthdays', async () => {
      const mockRepo = new DashboardRepository();
      vi.spyOn(mockRepo, 'getStudentAffairsPulse').mockResolvedValue({
        funnel: [
          {
            stage: 'registered',
            labelEn: 'Inquiries & Registered',
            labelKh: 'ការចុះឈ្មោះដំបូង',
            count: 100,
            percentage: 100,
          },
          {
            stage: 'tested',
            labelEn: 'Entrance Tested',
            labelKh: 'បានធ្វើតេស្តរួច',
            count: 75,
            percentage: 75,
          },
          {
            stage: 'enrolled',
            labelEn: 'Officially Enrolled',
            labelKh: 'បានចុះឈ្មោះផ្លូវការ',
            count: 60,
            percentage: 60,
          },
        ],
        movement: {
          active: 450,
          suspended: 5,
          transferred: 3,
          withdrawn: 8,
          newEnrollmentsThisMonth: 12,
        },
        atRiskAbsences: [
          {
            studentId: new Types.ObjectId().toString(),
            studentCode: 'STU-009',
            studentName: 'Vireak Men',
            classId: new Types.ObjectId().toString(),
            className: 'Grade 9B',
            consecutiveAbsentCount: 3,
            lastAbsentDate: new Date('2026-09-04').toISOString(),
            guardianName: 'Sokha Men',
            guardianPhone: '098765432',
          },
        ],
        upcomingBirthdays: [
          {
            id: new Types.ObjectId().toString(),
            name: 'Kosal Chea',
            type: 'student',
            dateOfBirth: new Date('2012-09-07').toISOString(),
            daysUntil: 2,
            classNameOrDept: 'Grade 8A',
          },
        ],
      });

      const service = new DashboardService(mockRepo);
      const result = await service.getStudentAffairsPulse(superAdminUser);

      expect(result.funnel).toHaveLength(3);
      expect(result.movement.active).toBe(450);
      expect(result.atRiskAbsences).toHaveLength(1);
      expect(result.atRiskAbsences[0].consecutiveAbsentCount).toBe(3);
      expect(result.atRiskAbsences[0].guardianPhone).toBe('098765432');
      expect(result.upcomingBirthdays[0].daysUntil).toBe(2);
    });

    it('rejects student affairs pulse access when requesting an unauthorized branch', async () => {
      const service = new DashboardService();
      await expect(
        service.getStudentAffairsPulse(branchManagerUser, { branchId: otherBranchId }),
      ).rejects.toThrow(/You do not have access to student data in this branch/);
    });
  });

  describe('HR Pulse', () => {
    it('returns headcounts, expiring contracts radar, and teacher workloads', async () => {
      const mockRepo = new DashboardRepository();
      vi.spyOn(mockRepo, 'getHrPulse').mockResolvedValue({
        totalEmployees: 45,
        activeTeachers: 28,
        byDepartment: [
          { departmentId: new Types.ObjectId().toString(), departmentNameEn: 'Science', count: 12 },
          {
            departmentId: new Types.ObjectId().toString(),
            departmentNameEn: 'Languages',
            count: 10,
          },
        ],
        byBranch: [{ branchId, branchCode: 'MC', branchNameEn: 'Main Campus', count: 45 }],
        expiringContracts: [
          {
            employeeId: new Types.ObjectId().toString(),
            employeeCode: 'EMP-015',
            name: 'Rithy Kem',
            departmentName: 'Mathematics',
            positionName: 'Senior Teacher',
            contractEndDate: new Date('2026-09-25').toISOString(),
            daysRemaining: 20,
            phone: '011223344',
          },
        ],
        teacherWorkloads: [
          {
            employeeId: new Types.ObjectId().toString(),
            employeeCode: 'EMP-015',
            name: 'Rithy Kem',
            assignedClassCount: 4,
            totalStudents: 120,
          },
        ],
      });

      const service = new DashboardService(mockRepo);
      const result = await service.getHrPulse(superAdminUser);

      expect(result.totalEmployees).toBe(45);
      expect(result.activeTeachers).toBe(28);
      expect(result.byDepartment).toHaveLength(2);
      expect(result.expiringContracts).toHaveLength(1);
      expect(result.expiringContracts[0].daysRemaining).toBe(20);
      expect(result.teacherWorkloads[0].assignedClassCount).toBe(4);
    });

    it('rejects HR pulse access when requesting an unauthorized branch', async () => {
      const service = new DashboardService();
      await expect(
        service.getHrPulse(branchManagerUser, { branchId: otherBranchId }),
      ).rejects.toThrow(/You do not have access to HR data in this branch/);
    });
  });
});
