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
import { LevelModel } from '../level/level.model';
import type { IProgram } from './program.model';
import { ProgramRepository } from './program.repository';
import type { CreateProgramDto, ProgramQueryFilters, UpdateProgramDto } from './program.types';

export class ProgramService {
  public constructor(private readonly repository = new ProgramRepository()) {}

  private async validateBranchScope(
    branchId: string | undefined,
    branchAvailability: 'all' | string[] | undefined,
    user: AuthUser,
  ): Promise<void> {
    const branchIds = [
      ...(branchId ? [branchId] : []),
      ...(Array.isArray(branchAvailability) ? branchAvailability : []),
    ];
    if (branchIds.length === 0) return;
    const uniqueIds = [...new Set(branchIds)];
    const count = await BranchModel.countDocuments({
      _id: { $in: uniqueIds },
      schoolId: user.schoolId,
      isDeleted: false,
    });
    if (count !== uniqueIds.length) {
      throw new ValidationError('One or more selected branches do not belong to your school');
    }
  }

  public async getPrograms(
    filters: ProgramQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IProgram[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to programs in the requested branch');
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

  public async getProgramById(id: string, user: AuthUser): Promise<IProgram> {
    const program = await this.repository.findById(id, user.schoolId);
    if (!program) {
      throw new NotFoundError('Program not found');
    }
    if (program.branchId && !checkBranchAccess(user.branchAccess, String(program.branchId))) {
      throw new ForbiddenError('You do not have access to this program');
    }
    return program;
  }

  public async createProgram(dto: CreateProgramDto, user: AuthUser): Promise<IProgram> {
    if (dto.branchId) {
      if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
        throw new ForbiddenError('You do not have access to create a program in this branch');
      }
    } else if (!checkUserPermission(user.permissions, 'program.create.all_branches')) {
      throw new ForbiddenError('Only all-branch users can create a global program');
    }
    await this.validateBranchScope(dto.branchId, dto.branchAvailability, user);
    const existing = await this.repository.findByCode(dto.code, undefined, user.schoolId);
    if (existing) {
      throw new ConflictError(`Program with code "${dto.code}" already exists`);
    }

    const program = await this.repository.create(
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
      module: 'program',
      action: 'CREATE',
      entityType: 'Program',
      entityId: program._id.toString(),
      newValue: program.toObject(),
    });

    return program;
  }

  public async updateProgram(id: string, dto: UpdateProgramDto, user: AuthUser): Promise<IProgram> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Program not found');
    }
    if (existing.branchId) {
      if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
        throw new ForbiddenError('You do not have access to update this program');
      }
    } else if (!checkUserPermission(user.permissions, 'program.edit.all_branches')) {
      throw new ForbiddenError('Only all-branch users can update a global program');
    }
    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to the target program branch');
    }

    await this.validateBranchScope(dto.branchId, dto.branchAvailability, user);

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.repository.findByCode(dto.code, id, user.schoolId);
      if (duplicate) {
        throw new ConflictError(`Program with code "${dto.code}" already exists`);
      }
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError('Program not found');
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: updated.branchId?.toString(),
      module: 'program',
      action: 'UPDATE',
      entityType: 'Program',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteProgram(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Program not found');
    }
    if (existing.branchId) {
      if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
        throw new ForbiddenError('You do not have access to delete this program');
      }
    } else if (!checkUserPermission(user.permissions, 'program.delete.all_branches')) {
      throw new ForbiddenError('Only all-branch users can delete a global program');
    }

    const [levelCount, classCount] = await Promise.all([
      LevelModel.countDocuments({ programId: id, isDeleted: false }),
      ClassModel.countDocuments({ programId: id, isDeleted: false }),
    ]);

    if (levelCount > 0 || classCount > 0) {
      throw new ValidationError(
        `Cannot archive Program because it has active dependencies (${levelCount} levels, ${classCount} classes)`,
      );
    }

    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId?.toString(),
      module: 'program',
      action: 'DELETE',
      entityType: 'Program',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
