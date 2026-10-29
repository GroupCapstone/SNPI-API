import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { LevelModel } from '../level/level.model';
import { ProgramModel } from '../program/program.model';
import { SubjectModel } from '../subject/subject.model';
import type { ICurriculum } from './curriculum.model';
import { CurriculumRepository } from './curriculum.repository';
import type {
  CreateCurriculumDto,
  CurriculumQueryFilters,
  UpdateCurriculumDto,
} from './curriculum.types';

export class CurriculumService {
  public constructor(private readonly repository = new CurriculumRepository()) {}

  public async getCurricula(
    filters: CurriculumQueryFilters,
    user: AuthUser,
  ): Promise<{ data: ICurriculum[]; total: number }> {
    const branchFilter =
      user.branchAccess === 'all'
        ? filters.branchId
          ? { branchId: filters.branchId }
          : {}
        : { branchId: { $in: user.branchAccess } };

    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId }, branchFilter);
  }

  public async getCurriculumById(id: string, user: AuthUser): Promise<ICurriculum> {
    const curriculum = await this.repository.findById(id, user.schoolId);
    if (!curriculum) {
      throw new NotFoundError('Curriculum not found');
    }

    if (curriculum.branchId && !checkBranchAccess(user.branchAccess, String(curriculum.branchId))) {
      throw new ForbiddenError('You do not have access to view this curriculum');
    }

    return curriculum;
  }

  public async createCurriculum(dto: CreateCurriculumDto, user: AuthUser): Promise<ICurriculum> {
    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have permission to create a curriculum for this branch');
    }

    if (dto.branchId) {
      const branch = await BranchModel.exists({
        _id: dto.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }

    // 1. Validate Program
    const program = await ProgramModel.findOne({
      _id: dto.programId,
      schoolId: user.schoolId,
      isDeleted: false,
    });
    if (!program) {
      throw new ValidationError(`Program with ID ${dto.programId} does not exist`);
    }

    // 2. Validate Level belongs to Program
    const level = await LevelModel.findOne({
      _id: dto.levelId,
      schoolId: user.schoolId,
      isDeleted: false,
    });
    if (!level) {
      throw new ValidationError(`Level with ID ${dto.levelId} does not exist`);
    }
    if (level.programId.toString() !== dto.programId) {
      throw new ValidationError(
        `Selected Level "${level.name}" does not belong to Program "${program.nameEn}"`,
      );
    }

    // 3. Validate Academic Year
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: user.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new ValidationError(`Academic Year with ID ${dto.academicYearId} does not exist`);
    }

    // 4. Validate Code Uniqueness
    const duplicateCode = await this.repository.findByCode(dto.code, undefined, user.schoolId);
    if (duplicateCode) {
      throw new ConflictError(`Curriculum with code "${dto.code}" already exists`);
    }

    // 5. Validate duplicate (Program + Level + Year)
    const duplicateCombo = await this.repository.findByProgramLevelYear(
      dto.programId,
      dto.levelId,
      dto.academicYearId,
      undefined,
      user.schoolId,
    );
    if (duplicateCombo) {
      throw new ConflictError(
        `A curriculum already exists for ${program.nameEn} - ${level.name} in academic year ${academicYear.name}`,
      );
    }

    // 6. Validate Subjects if provided
    if (dto.subjects && dto.subjects.length > 0) {
      const subjectIds = dto.subjects.map((s) => s.subjectId);
      if (new Set(subjectIds).size !== subjectIds.length) {
        throw new ValidationError('A curriculum cannot contain the same subject more than once');
      }
      const subjectsCount = await SubjectModel.countDocuments({
        _id: { $in: subjectIds.map((id) => new Types.ObjectId(id)) },
        schoolId: user.schoolId,
        ...(dto.branchId
          ? {
              $or: [
                { branchId: dto.branchId },
                { branchId: null },
                { branchId: { $exists: false } },
              ],
            }
          : {}),
        isDeleted: false,
      });
      if (subjectsCount !== subjectIds.length) {
        throw new ValidationError('One or more selected subjects do not exist');
      }
    }

    const curriculum = await this.repository.create(
      {
        ...dto,
        schoolId: user.schoolId,
      },
      user.userId,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'curriculum',
      action: 'CREATE',
      entityType: 'Curriculum',
      entityId: curriculum._id.toString(),
      newValue: curriculum.toObject(),
    });

    return curriculum;
  }

  public async updateCurriculum(
    id: string,
    dto: UpdateCurriculumDto,
    user: AuthUser,
  ): Promise<ICurriculum> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Curriculum not found');
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have permission to modify this curriculum');
    }

    const targetProgramId =
      dto.programId ||
      String((existing.programId as unknown as { _id: Types.ObjectId })?._id || existing.programId);
    const targetLevelId =
      dto.levelId ||
      String((existing.levelId as unknown as { _id: Types.ObjectId })?._id || existing.levelId);
    const targetYearId =
      dto.academicYearId ||
      String(
        (existing.academicYearId as unknown as { _id: Types.ObjectId })?._id ||
          existing.academicYearId,
      );

    const targetBranchId =
      dto.branchId ?? (existing.branchId ? String(existing.branchId) : undefined);
    if (targetBranchId) {
      const branch = await BranchModel.exists({
        _id: targetBranchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }

    const [program, academicYear] = await Promise.all([
      ProgramModel.findOne({ _id: targetProgramId, schoolId: user.schoolId, isDeleted: false }),
      AcademicYearModel.findOne({ _id: targetYearId, schoolId: user.schoolId, isDeleted: false }),
    ]);
    if (!program) throw new ValidationError('Selected program does not belong to your school');
    if (!academicYear) {
      throw new ValidationError('Selected academic year does not belong to your school');
    }

    if (dto.programId || dto.levelId) {
      const level = await LevelModel.findOne({
        _id: targetLevelId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!level) {
        throw new ValidationError(`Level with ID ${targetLevelId} does not exist`);
      }
      if (level.programId.toString() !== targetProgramId) {
        throw new ValidationError(
          `Selected Level "${level.name}" does not belong to the selected Program`,
        );
      }
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.repository.findByCode(dto.code, id, user.schoolId);
      if (duplicate) {
        throw new ConflictError(`Curriculum with code "${dto.code}" already exists`);
      }
    }

    if (dto.programId || dto.levelId || dto.academicYearId) {
      const duplicateCombo = await this.repository.findByProgramLevelYear(
        targetProgramId,
        targetLevelId,
        targetYearId,
        id,
        user.schoolId,
      );
      if (duplicateCombo) {
        throw new ConflictError('A curriculum already exists for this Program, Level, and Year');
      }
    }

    if (dto.subjects && dto.subjects.length > 0) {
      const subjectIds = dto.subjects.map((s) => s.subjectId);
      if (new Set(subjectIds).size !== subjectIds.length) {
        throw new ValidationError('A curriculum cannot contain the same subject more than once');
      }
      const subjectsCount = await SubjectModel.countDocuments({
        _id: { $in: subjectIds.map((sid) => new Types.ObjectId(sid)) },
        schoolId: user.schoolId,
        ...(targetBranchId
          ? {
              $or: [
                { branchId: targetBranchId },
                { branchId: null },
                { branchId: { $exists: false } },
              ],
            }
          : {}),
        isDeleted: false,
      });
      if (subjectsCount !== subjectIds.length) {
        throw new ValidationError('One or more selected subjects do not exist');
      }
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError('Curriculum not found');
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: updated.branchId?.toString(),
      module: 'curriculum',
      action: 'UPDATE',
      entityType: 'Curriculum',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteCurriculum(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Curriculum not found');
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have permission to delete this curriculum');
    }

    const activeClasses = await ClassModel.countDocuments({
      curriculumId: id,
      isDeleted: false,
    });

    if (activeClasses > 0) {
      throw new ValidationError(
        `Cannot delete curriculum because it is linked to ${activeClasses} active classes`,
      );
    }

    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId?.toString(),
      module: 'curriculum',
      action: 'DELETE',
      entityType: 'Curriculum',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
