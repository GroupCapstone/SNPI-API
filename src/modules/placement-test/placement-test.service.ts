import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { LevelModel } from '../level/level.model';
import { ProgramModel } from '../program/program.model';
import { RegistrationModel } from '../registration/registration.model';
import { SchoolModel } from '../school/school.model';
import { SequenceService } from '../sequence/sequence.service';
import { StudentModel } from '../student/student.model';
import type { IPlacementTest } from './placement-test.model';
import { PlacementTestRepository } from './placement-test.repository';
import type {
  CreatePlacementTestDTO,
  PlacementTestQueryFilters,
  UpdatePlacementTestDTO,
} from './placement-test.types';

export class PlacementTestService {
  public constructor(private readonly repository = new PlacementTestRepository()) {}

  public async getPlacementTests(
    filters: PlacementTestQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IPlacementTest[]; total: number }> {
    const effectiveFilters = { ...filters };

    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError('You do not have access to view placement tests in this branch');
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findAll(effectiveFilters);
  }

  public async getPlacementTestById(id: string, user: AuthUser): Promise<IPlacementTest> {
    const test = await this.repository.findById(id);
    if (!test) {
      throw new NotFoundError(`Placement test record with ID ${id} not found`);
    }

    const branchId =
      typeof test.branchId === 'object' && test.branchId !== null
        ? String(test.branchId._id)
        : String(test.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view this placement test record');
    }

    return test;
  }

  public async createPlacementTest(
    dto: CreatePlacementTestDTO,
    user: AuthUser,
  ): Promise<IPlacementTest> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to record placement tests in this branch');
    }

    // 1. School check
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 2. Branch check
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!branch) {
      throw new ValidationError(
        `Selected branch with ID ${dto.branchId} does not belong to school ${dto.schoolId}`,
      );
    }

    // 3. Program check
    const program = await ProgramModel.findOne({
      _id: dto.programId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!program) {
      throw new ValidationError(`Program with ID ${dto.programId} does not exist`);
    }

    // 4. Recommended Level check (belongs to program)
    const level = await LevelModel.findOne({
      _id: dto.recommendedLevelId,
      programId: dto.programId,
      isDeleted: false,
    });
    if (!level) {
      throw new ValidationError(
        `Recommended level with ID ${dto.recommendedLevelId} does not belong to program ${dto.programId}`,
      );
    }

    // 5. Optional Registration check
    if (dto.registrationId) {
      const reg = await RegistrationModel.findOne({ _id: dto.registrationId, isDeleted: false });
      if (!reg) {
        throw new ValidationError(`Registration with ID ${dto.registrationId} does not exist`);
      }
      if (String(reg.branchId) !== String(dto.branchId)) {
        throw new ValidationError(`Registration does not belong to branch with ID ${dto.branchId}`);
      }
      if (String(reg.schoolId) !== dto.schoolId || String(reg.programId) !== dto.programId) {
        throw new ValidationError(
          'Registration does not match the selected school and academic program',
        );
      }
      if (dto.studentId && reg.studentId && String(reg.studentId) !== dto.studentId) {
        throw new ValidationError('Registration belongs to a different student');
      }
      // Update registration status
      await RegistrationModel.findByIdAndUpdate(dto.registrationId, {
        status: 'placement_completed',
      });
    }

    // 6. Optional Student check
    if (dto.studentId) {
      const stu = await StudentModel.findOne({ _id: dto.studentId, isDeleted: false });
      if (!stu) {
        throw new ValidationError(`Student with ID ${dto.studentId} does not exist`);
      }
      if (String(stu.branchId) !== String(dto.branchId)) {
        throw new ValidationError(`Student does not belong to branch with ID ${dto.branchId}`);
      }
    }

    // 7. Sequence generation
    let finalTestNumber = dto.testNumber?.trim().toUpperCase();
    if (!finalTestNumber) {
      finalTestNumber = await SequenceService.getNextSequence('TEST', 'TEST', 6);
    } else {
      const existing = await this.repository.findByTestNumber(finalTestNumber);
      if (existing) {
        throw new ConflictError(`Placement test number "${finalTestNumber}" already exists`);
      }
    }

    // 8. Create record
    const created = await this.repository.create({
      testNumber: finalTestNumber,
      registrationId: dto.registrationId as never,
      studentId: dto.studentId as never,
      studentName: dto.studentName.trim(),
      schoolId: school._id as never,
      branchId: branch._id as never,
      programId: program._id as never,
      recommendedLevelId: level._id as never,
      testDate: dto.testDate ? new Date(dto.testDate) : new Date(),
      score: dto.score,
      maxScore: dto.maxScore ?? 100,
      examinerName: dto.examinerName?.trim(),
      status: dto.status ?? 'completed',
      comments: dto.comments?.trim(),
      createdBy: user.userId as never,
      updatedBy: user.userId as never,
    });

    // 9. Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'placement_test',
      action: 'CREATE',
      entityType: 'PlacementTest',
      entityId: created._id.toString(),
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async updatePlacementTest(
    id: string,
    dto: UpdatePlacementTestDTO,
    user: AuthUser,
  ): Promise<IPlacementTest> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Placement test record with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const currentSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have access to edit this placement test record');
    }

    const updateData: Partial<IPlacementTest> = {
      updatedBy: user.userId as never,
    };

    if (dto.studentName) updateData.studentName = dto.studentName.trim();
    if (dto.score !== undefined) updateData.score = dto.score;
    if (dto.maxScore !== undefined) updateData.maxScore = dto.maxScore;
    if (dto.examinerName !== undefined) updateData.examinerName = dto.examinerName.trim();
    if (dto.status) updateData.status = dto.status;
    if (dto.comments !== undefined) updateData.comments = dto.comments.trim();
    if (dto.testDate) updateData.testDate = new Date(dto.testDate);

    if (dto.recommendedLevelId) {
      const progId =
        dto.programId ??
        (typeof existing.programId === 'object' ? existing.programId._id : existing.programId);
      const level = await LevelModel.findOne({
        _id: dto.recommendedLevelId,
        programId: progId,
        isDeleted: false,
      });
      if (!level) {
        throw new ValidationError(
          `Recommended level ${dto.recommendedLevelId} is not valid for this program`,
        );
      }
      updateData.recommendedLevelId = level._id as never;
    }

    const updated = await this.repository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundError(`Placement test with ID ${id} not found after update`);
    }

    // Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'placement_test',
      action: 'UPDATE',
      entityType: 'PlacementTest',
      entityId: id,
      schoolId: currentSchoolId,
      branchId: currentBranchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async deletePlacementTest(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Placement test with ID ${id} not found`);
    }

    const branchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const schoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to delete this placement test record');
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      module: 'placement_test',
      action: 'DELETE',
      entityType: 'PlacementTest',
      entityId: id,
      schoolId,
      branchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }
}
