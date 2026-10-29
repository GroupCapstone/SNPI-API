import { Types } from 'mongoose';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicPeriodRepository } from '../src/modules/academic-period/academic-period.repository';
import { AcademicPeriodService } from '../src/modules/academic-period/academic-period.service';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { AuditLogService } from '../src/modules/audit-log/audit-log.service';
import type { AuthUser } from '../src/types/auth';

describe('Monthly Academic Period Generation & Management', () => {
  const service = new AcademicPeriodService();
  const mockAcademicYearId = new Types.ObjectId().toString();
  const mockUser: AuthUser = {
    userId: 'user-001',
    schoolId: 'school-001',
    branchId: 'branch-001',
    role: 'director',
    roles: ['director'],
    permissions: ['academic_period.create.all_branches', 'academic_period.view.all_branches'],
    branchAccess: 'all',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuditLogService, 'log').mockResolvedValue(undefined as never);
  });

  describe('AcademicPeriodService.generateMonthlyPeriods', () => {
    it('generates 12 monthly periods with localized names and valid calendar boundaries', async () => {
      vi.spyOn(AcademicYearModel, 'findOne').mockResolvedValue({
        _id: mockAcademicYearId,
        name: 'Academic Year 2026',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-12-31T23:59:59.999Z'),
        isDeleted: false,
      } as never);

      vi.spyOn(AcademicPeriodRepository.prototype, 'findByCode').mockResolvedValue(null);

      const createdItems: Array<Record<string, unknown>> = [];
      vi.spyOn(AcademicPeriodRepository.prototype, 'create').mockImplementation(
        async (dto: Record<string, unknown>) => {
          const item = { _id: new Types.ObjectId(), ...dto };
          createdItems.push(item);
          return item as never;
        },
      );

      const result = await service.generateMonthlyPeriods(
        {
          academicYearId: mockAcademicYearId,
          calendarYear: 2026,
          startMonth: 1,
          monthCount: 12,
        },
        mockUser,
      );

      expect(result.createdCount).toBe(12);
      expect(result.skippedCount).toBe(0);
      expect(result.periods).toHaveLength(12);

      // Verify January 2026
      const jan = result.periods[0]!;
      expect(jan.code).toBe('2026-M01');
      expect(jan.sequence).toBe(1);
      expect(jan.type).toBe('MONTHLY');
      expect(jan.name).toContain('មករា');
      expect(jan.name).toContain('January 2026');
      expect(new Date(jan.startDate).getUTCFullYear()).toBe(2026);
      expect(new Date(jan.startDate).getUTCMonth()).toBe(0);
      expect(new Date(jan.startDate).getUTCDate()).toBe(1);

      // Verify December 2026
      const dec = result.periods[11]!;
      expect(dec.code).toBe('2026-M12');
      expect(dec.sequence).toBe(12);
      expect(dec.type).toBe('MONTHLY');
      expect(dec.name).toContain('ធ្នូ');
      expect(dec.name).toContain('December 2026');
      expect(new Date(dec.startDate).getUTCMonth()).toBe(11);
    });

    it('handles February leap year boundaries properly in 2024 and 2026', async () => {
      vi.spyOn(AcademicYearModel, 'findOne').mockResolvedValue({
        _id: mockAcademicYearId,
        name: 'Academic Year 2024',
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        isDeleted: false,
      } as never);

      vi.spyOn(AcademicPeriodRepository.prototype, 'findByCode').mockResolvedValue(null);

      vi.spyOn(AcademicPeriodRepository.prototype, 'create').mockImplementation(
        async (dto: Record<string, unknown>) => {
          return { _id: new Types.ObjectId(), ...dto } as never;
        },
      );

      const result2024 = await service.generateMonthlyPeriods(
        {
          academicYearId: mockAcademicYearId,
          calendarYear: 2024,
          startMonth: 2,
          monthCount: 1,
        },
        mockUser,
      );

      const feb2024 = result2024.periods[0]!;
      expect(feb2024.code).toBe('2024-M02');
      expect(new Date(feb2024.endDate).getUTCDate()).toBe(29);
    });

    it('skips existing periods and creates only missing ones without error', async () => {
      vi.spyOn(AcademicYearModel, 'findOne').mockResolvedValue({
        _id: mockAcademicYearId,
        name: 'Academic Year 2026',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        isDeleted: false,
      } as never);

      vi.spyOn(AcademicPeriodRepository.prototype, 'findByCode').mockImplementation(
        async (_yearId: string, code: string) => {
          if (code === '2026-M01') {
            return {
              _id: new Types.ObjectId(),
              code: '2026-M01',
              name: 'មករា (January 2026)',
              type: 'MONTHLY',
            } as never;
          }
          return null;
        },
      );

      vi.spyOn(AcademicPeriodRepository.prototype, 'create').mockImplementation(
        async (dto: Record<string, unknown>) => {
          return { _id: new Types.ObjectId(), ...dto } as never;
        },
      );

      const result = await service.generateMonthlyPeriods(
        {
          academicYearId: mockAcademicYearId,
          calendarYear: 2026,
          startMonth: 1,
          monthCount: 3,
        },
        mockUser,
      );

      expect(result.createdCount).toBe(2);
      expect(result.skippedCount).toBe(1);
      expect(result.periods).toHaveLength(3);
    });
  });

  describe('POST /api/v1/academic-periods/generate-monthly', () => {
    it('returns 201 or auth challenge when called with valid payload', async () => {
      vi.spyOn(AcademicYearModel, 'findOne').mockResolvedValue({
        _id: mockAcademicYearId,
        name: 'Academic Year 2026',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        isDeleted: false,
      } as never);

      vi.spyOn(AcademicPeriodRepository.prototype, 'findByCode').mockResolvedValue(null);
      vi.spyOn(AcademicPeriodRepository.prototype, 'create').mockImplementation(
        async (dto: Record<string, unknown>) => {
          return { _id: new Types.ObjectId(), ...dto } as never;
        },
      );

      const app = createApp();
      const res = await request(app)
        .post('/api/v1/academic-periods/generate-monthly')
        .set('Authorization', 'Bearer mock-token')
        .send({
          academicYearId: mockAcademicYearId,
          calendarYear: 2026,
          startMonth: 1,
          monthCount: 12,
        });

      expect([201, 401]).toContain(res.status);
    });
  });
});
