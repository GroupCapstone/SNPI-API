import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AcademicPeriodModel } from '../src/modules/academic-period/academic-period.model';
import { AuditLogService } from '../src/modules/audit-log/audit-log.service';
import { IntakeRepository } from '../src/modules/intake/intake.repository';
import { IntakeService } from '../src/modules/intake/intake.service';
import { LevelModel } from '../src/modules/level/level.model';
import { ProgramModel } from '../src/modules/program/program.model';
import type { AuthUser } from '../src/types/auth';

describe('Intake Service Audit Trail', () => {
  let intakeService: IntakeService;
  let mockRepository: IntakeRepository;

  const mockUser: AuthUser = {
    userId: '507f1f77bcf86cd799439001',
    email: 'admin@snp.edu.kh',
    role: 'SUPER_ADMIN',
    branchAccess: 'all',
    schoolId: '507f1f77bcf86cd799439002',
    permissions: [],
  };

  const periodId = '507f1f77bcf86cd799439010';
  const yearId = '507f1f77bcf86cd799439011';
  const progId = '507f1f77bcf86cd799439012';
  const levelId = '507f1f77bcf86cd799439013';
  const intakeId = '507f1f77bcf86cd799439014';

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = new IntakeRepository();
    intakeService = new IntakeService(mockRepository);

    vi.spyOn(AuditLogService, 'log').mockResolvedValue(null as never);

    vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
      _id: periodId,
      academicYearId: yearId,
      isDeleted: false,
    } as never);

    vi.spyOn(ProgramModel, 'findOne').mockResolvedValue({
      _id: progId,
      isDeleted: false,
    } as never);

    vi.spyOn(LevelModel, 'findOne').mockResolvedValue({
      _id: levelId,
      programId: progId,
      isDeleted: false,
    } as never);
  });

  it('records audit log when creating an intake offering', async () => {
    const dto = {
      academicYearId: yearId,
      academicPeriodId: periodId,
      programId: progId,
      levelId: levelId,
      code: 'INTAKE-2026-T1',
      name: 'Intake 2026 Term 1',
      capacity: 100,
    };

    const createdIntake = {
      _id: intakeId,
      ...dto,
      status: 'open',
      toObject: () => ({ _id: intakeId, ...dto }),
    };

    vi.spyOn(mockRepository, 'findByCode').mockResolvedValue(null);
    vi.spyOn(mockRepository, 'create').mockResolvedValue(createdIntake as never);

    await intakeService.createIntake(dto, mockUser);

    expect(AuditLogService.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        entityType: 'Intake',
        entityId: intakeId,
        userId: mockUser.userId,
      }),
    );
  });

  it('records audit log with old and new values when updating an intake offering', async () => {
    const existing = {
      _id: intakeId,
      academicPeriodId: periodId,
      programId: progId,
      levelId: levelId,
      code: 'INTAKE-2026-T1',
      name: 'Intake 2026 Term 1',
      capacity: 100,
      toObject: () => ({ _id: intakeId, capacity: 100 }),
    };

    const updated = {
      ...existing,
      capacity: 150,
      toObject: () => ({ _id: intakeId, capacity: 150 }),
    };

    vi.spyOn(mockRepository, 'findById').mockResolvedValue(existing as never);
    vi.spyOn(mockRepository, 'update').mockResolvedValue(updated as never);

    await intakeService.updateIntake(intakeId, { capacity: 150 }, mockUser);

    expect(AuditLogService.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        entityType: 'Intake',
        entityId: intakeId,
        userId: mockUser.userId,
        oldValue: expect.objectContaining({ capacity: 100 }),
        newValue: expect.objectContaining({ capacity: 150 }),
      }),
    );
  });

  it('records audit log when deleting an intake offering', async () => {
    const existing = {
      _id: intakeId,
      code: 'INTAKE-2026-T1',
      toObject: () => ({ _id: intakeId, code: 'INTAKE-2026-T1' }),
    };

    vi.spyOn(mockRepository, 'findById').mockResolvedValue(existing as never);
    vi.spyOn(mockRepository, 'softDelete').mockResolvedValue(true as never);

    await intakeService.deleteIntake(intakeId, mockUser);

    expect(AuditLogService.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETE',
        entityType: 'Intake',
        entityId: intakeId,
        userId: mockUser.userId,
      }),
    );
  });
});
