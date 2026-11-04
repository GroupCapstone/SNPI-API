import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CurriculumModel } from '../curriculum/curriculum.model';
import { LevelModel } from '../level/level.model';
import { ProgramModel } from '../program/program.model';
import type { IIntake } from './intake.model';
import { IntakeRepository } from './intake.repository';
import type {
  CreateIntakeDto,
  IntakeQueryFilters,
  PaginatedIntakes,
  UpdateIntakeDto,
} from './intake.types';

export class IntakeService {
  public constructor(private readonly repository = new IntakeRepository()) {}

  public async getIntakes(filters: IntakeQueryFilters = {}): Promise<PaginatedIntakes> {
    return this.repository.findMany(filters);
  }

  public async getIntakeById(id: string): Promise<IIntake> {
    const intake = await this.repository.findById(id);
    if (!intake) {
      throw new NotFoundError('Intake / Offering not found');
    }
    return intake;
  }

  public async createIntake(dto: CreateIntakeDto, currentUser: AuthUser): Promise<IIntake> {
    // 1. Verify Academic Period & parent Academic Year
    const period = await AcademicPeriodModel.findOne({
      _id: dto.academicPeriodId,
      isDeleted: false,
    });
    if (!period) {
      throw new NotFoundError('Selected Academic Period does not exist');
    }
    if (String(period.academicYearId) !== dto.academicYearId) {
      throw new BadRequestError('Academic Period does not belong to the selected Academic Year');
    }

    // 2. Verify Program
    const program = await ProgramModel.findOne({ _id: dto.programId, isDeleted: false });
    if (!program) {
      throw new NotFoundError('Selected Program does not exist');
    }

    // 3. Verify Level belongs to Program
    const level = await LevelModel.findOne({ _id: dto.levelId, isDeleted: false });
    if (!level) {
      throw new NotFoundError('Selected Level does not exist');
    }
    if (String(level.programId) !== dto.programId) {
      throw new BadRequestError('Selected Level does not belong to the selected Program');
    }

    // 4. If Curriculum is supplied, verify it matches program & level
    if (dto.curriculumId) {
      const curriculum = await CurriculumModel.findOne({
        _id: dto.curriculumId,
        isDeleted: false,
      });
      if (!curriculum) {
        throw new NotFoundError('Selected Curriculum does not exist');
      }
      if (
        String(curriculum.programId) !== dto.programId ||
        String(curriculum.levelId) !== dto.levelId
      ) {
        throw new BadRequestError('Curriculum does not match the selected Program and Level');
      }
    }

    // 5. Check uniqueness within the period
    const existing = await this.repository.findByCode(dto.academicPeriodId, dto.code);
    if (existing) {
      throw new ConflictError(
        `Offering code "${dto.code.toUpperCase()}" already exists in this Academic Period`,
      );
    }

    const created = await this.repository.create(dto, currentUser.userId);
    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: created.schoolId ? String(created.schoolId) : undefined,
      branchId: created.branchId ? String(created.branchId) : undefined,
      module: 'academic',
      action: 'CREATE',
      entityType: 'Intake',
      entityId: String(created._id),
      newValue:
        'toObject' in created && typeof created.toObject === 'function'
          ? (created.toObject() as Record<string, unknown>)
          : (created as unknown as Record<string, unknown>),
      reason: `Created intake offering ${created.code}`,
    });
    return created;
  }

  public async updateIntake(
    id: string,
    dto: UpdateIntakeDto,
    currentUser: AuthUser,
  ): Promise<IIntake> {
    const intake = await this.repository.findById(id);
    if (!intake) {
      throw new NotFoundError('Intake / Offering not found');
    }

    const periodId = dto.academicPeriodId || String(intake.academicPeriodId);
    const progId = dto.programId || String(intake.programId);
    const lvlId = dto.levelId || String(intake.levelId);

    if (dto.levelId || dto.programId) {
      const level = await LevelModel.findOne({ _id: lvlId, isDeleted: false });
      if (!level || String(level.programId) !== progId) {
        throw new BadRequestError('Selected Level does not belong to the selected Program');
      }
    }

    if (dto.code && dto.code.toUpperCase().trim() !== intake.code) {
      const duplicate = await this.repository.findByCode(periodId, dto.code);
      if (duplicate && String(duplicate._id) !== id) {
        throw new ConflictError(
          `Offering code "${dto.code.toUpperCase()}" already exists in this Academic Period`,
        );
      }
    }

    const updated = await this.repository.update(id, dto, currentUser.userId);
    if (!updated) {
      throw new NotFoundError('Intake / Offering not found');
    }

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: updated.schoolId ? String(updated.schoolId) : undefined,
      branchId: updated.branchId ? String(updated.branchId) : undefined,
      module: 'academic',
      action: 'UPDATE',
      entityType: 'Intake',
      entityId: id,
      oldValue:
        'toObject' in intake && typeof intake.toObject === 'function'
          ? (intake.toObject() as Record<string, unknown>)
          : (intake as unknown as Record<string, unknown>),
      newValue:
        'toObject' in updated && typeof updated.toObject === 'function'
          ? (updated.toObject() as Record<string, unknown>)
          : (updated as unknown as Record<string, unknown>),
      reason: `Updated intake offering ${updated.code}`,
    });

    return updated;
  }

  public async deleteIntake(id: string, currentUser: AuthUser): Promise<void> {
    const intake = await this.repository.findById(id);
    if (!intake) {
      throw new NotFoundError('Intake / Offering not found');
    }

    const deleted = await this.repository.softDelete(id, currentUser.userId);
    if (!deleted) {
      throw new NotFoundError('Intake / Offering not found');
    }

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: intake.schoolId ? String(intake.schoolId) : undefined,
      branchId: intake.branchId ? String(intake.branchId) : undefined,
      module: 'academic',
      action: 'DELETE',
      entityType: 'Intake',
      entityId: id,
      oldValue:
        'toObject' in intake && typeof intake.toObject === 'function'
          ? (intake.toObject() as Record<string, unknown>)
          : (intake as unknown as Record<string, unknown>),
      reason: `Soft-deleted intake offering ${intake.code}`,
    });
  }
}
