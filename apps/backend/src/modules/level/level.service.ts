import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { CurriculumModel } from '../curriculum/curriculum.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { TermResultModel } from '../term-result/term-result.model';
import { ProgramRepository } from '../program/program.repository';
import type { ILevel } from './level.model';
import { LevelRepository } from './level.repository';
import type { CreateLevelDto, LevelQueryFilters, UpdateLevelDto } from './level.types';

export class LevelService {
  public constructor(
    private readonly repository = new LevelRepository(),
    private readonly programRepository = new ProgramRepository(),
  ) {}

  public async getLevels(
    filters: LevelQueryFilters,
    user: AuthUser,
  ): Promise<{ data: ILevel[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to levels in the requested branch');
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? filters.branchId
          ? { branchId: filters.branchId }
          : {}
        : {
            $or: [
              { branchId: { $in: user.branchAccess } },
              { branchId: { $exists: false } },
              { branchId: null },
            ],
          };

    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId }, branchFilter);
  }

  public async getLevelById(id: string, user: AuthUser): Promise<ILevel> {
    const level = await this.repository.findById(id, user.schoolId);
    if (!level) {
      throw new NotFoundError('Level not found');
    }
    if (level.branchId && !checkBranchAccess(user.branchAccess, String(level.branchId))) {
      throw new ForbiddenError('You do not have access to this level');
    }
    return level;
  }

  public async createLevel(dto: CreateLevelDto, user: AuthUser): Promise<ILevel> {
    if (dto.branchId) {
      if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
        throw new ForbiddenError('You do not have access to create a level in this branch');
      }
    } else if (!checkUserPermission(user.permissions, 'level.create.all_branches')) {
      throw new ForbiddenError('Only all-branch users can create a global level');
    }
    if (dto.branchId) {
      const branch = await BranchModel.exists({
        _id: dto.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }
    const program = await this.programRepository.findById(dto.programId, user.schoolId);
    if (!program) {
      throw new ValidationError('Selected program does not exist', [
        { field: 'programId', message: 'Program not found' },
      ]);
    }

    const existing = await this.repository.findByProgramAndCode(
      dto.programId,
      dto.code,
      undefined,
      user.schoolId,
    );
    if (existing) {
      throw new ConflictError(
        `Level with code "${dto.code}" already exists in Program "${program.nameEn}"`,
      );
    }

    const level = await this.repository.create(
      {
        ...dto,
        schoolId: dto.schoolId ?? user.schoolId,
      },
      user.userId,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'level',
      action: 'CREATE',
      entityType: 'Level',
      entityId: level._id.toString(),
      newValue: level.toObject(),
    });

    return level;
  }

  public async updateLevel(id: string, dto: UpdateLevelDto, user: AuthUser): Promise<ILevel> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Level not found');
    }
    if (existing.branchId) {
      if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
        throw new ForbiddenError('You do not have access to update this level');
      }
    } else if (!checkUserPermission(user.permissions, 'level.edit.all_branches')) {
      throw new ForbiddenError('Only all-branch users can update a global level');
    }
    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to the target level branch');
    }

    const targetProgramId = dto.programId ?? existing.programId.toString();

    if (dto.programId && dto.programId !== existing.programId.toString()) {
      const program = await this.programRepository.findById(dto.programId, user.schoolId);
      if (!program) {
        throw new ValidationError('Selected program does not exist', [
          { field: 'programId', message: 'Program not found' },
        ]);
      }
    }

    if (dto.branchId) {
      const branch = await BranchModel.exists({
        _id: dto.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }

    const targetCode = dto.code ?? existing.code;
    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.repository.findByProgramAndCode(
        targetProgramId,
        targetCode,
        id,
        user.schoolId,
      );
      if (duplicate) {
        throw new ConflictError(`Level with code "${targetCode}" already exists in this Program`);
      }
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError('Level not found');
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: updated.branchId?.toString(),
      module: 'level',
      action: 'UPDATE',
      entityType: 'Level',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteLevel(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Level not found');
    }
    if (existing.branchId) {
      if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
        throw new ForbiddenError('You do not have access to delete this level');
      }
    } else if (!checkUserPermission(user.permissions, 'level.delete.all_branches')) {
      throw new ForbiddenError('Only all-branch users can delete a global level');
    }

    const [classCount, curriculumCount, enrollmentCount, resultCount] = await Promise.all([
      ClassModel.countDocuments({ levelId: id, isDeleted: false }),
      CurriculumModel.countDocuments({ levelId: id, isDeleted: false }),
      EnrollmentModel.countDocuments({ levelId: id, isDeleted: false }),
      TermResultModel.countDocuments({ levelId: id, isDeleted: false }),
    ]);
    if (classCount + curriculumCount + enrollmentCount + resultCount > 0) {
      throw new ValidationError(
        `Cannot archive Level because it has active dependencies (${classCount} classes, ${curriculumCount} curricula, ${enrollmentCount} enrollments, ${resultCount} results)`,
      );
    }

    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId?.toString(),
      module: 'level',
      action: 'DELETE',
      entityType: 'Level',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
