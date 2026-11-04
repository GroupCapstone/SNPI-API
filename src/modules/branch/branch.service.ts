import type { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ClassModel } from '../class/class.model';
import { DepartmentModel } from '../department/department.model';
import { EmployeeModel } from '../employee/employee.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { SchoolModel } from '../school/school.model';
import { StudentModel } from '../student/student.model';
import type { IBranch } from './branch.model';
import { BranchRepository } from './branch.repository';
import type { BranchQueryFilters, CreateBranchDto, UpdateBranchDto } from './branch.types';

export class BranchService {
  public constructor(private readonly repository = new BranchRepository()) {}

  public async getBranches(
    filters: BranchQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IBranch[]; total: number }> {
    // If user is restricted to certain branches, scope to _id
    const scopedFilter: Record<string, unknown> = {};
    if (user.branchAccess !== 'all') {
      scopedFilter._id = { $in: user.branchAccess };
    }

    return this.repository.findWithFilters(filters, scopedFilter);
  }

  public async getBranchById(id: string, user: AuthUser): Promise<IBranch> {
    if (!checkBranchAccess(user.branchAccess, id)) {
      throw new ForbiddenError('You do not have access to this branch');
    }

    const branch = await this.repository.findById(id);
    if (!branch) {
      throw new NotFoundError(`Branch with ID ${id} not found`);
    }
    return branch;
  }

  public async createBranch(dto: CreateBranchDto, user: AuthUser): Promise<IBranch> {
    // 1. Validate School exists & is active
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }
    if (school.status === 'inactive' && dto.status === 'active') {
      throw new ValidationError(
        `Cannot create an active branch for inactive school "${school.nameEn}"`,
      );
    }

    // 2. Validate unique branchCode within School
    const existing = await this.repository.findBySchoolAndCode(dto.schoolId, dto.branchCode);
    if (existing) {
      throw new ConflictError(
        `Branch code "${dto.branchCode.toUpperCase()}" already exists in school "${school.nameEn}"`,
      );
    }

    const branch = await this.repository.create(dto, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: dto.schoolId,
      branchId: String(branch._id),
      module: 'branch',
      action: 'CREATE',
      entityType: 'Branch',
      entityId: String(branch._id),
      newValue: branch.toObject() as unknown as Record<string, unknown>,
    });

    return branch;
  }

  public async updateBranch(id: string, dto: UpdateBranchDto, user: AuthUser): Promise<IBranch> {
    if (!checkBranchAccess(user.branchAccess, id)) {
      throw new ForbiddenError('You do not have permission to modify this branch');
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Branch with ID ${id} not found`);
    }

    const existingSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String((existing.schoolId as unknown as { _id: Types.ObjectId })._id)
        : String(existing.schoolId);

    const targetSchoolId = dto.schoolId || existingSchoolId;

    if (dto.schoolId) {
      const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
      if (!school) {
        throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
      }
    }

    if (dto.branchCode) {
      const duplicate = await this.repository.findBySchoolAndCode(
        targetSchoolId,
        dto.branchCode,
        id,
      );
      if (duplicate) {
        throw new ConflictError(
          `Branch code "${dto.branchCode.toUpperCase()}" is already in use in this school`,
        );
      }
    }

    const updated = await this.repository.update(id, dto, user.userId);
    if (!updated) {
      throw new NotFoundError(`Branch with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: targetSchoolId,
      branchId: String(updated._id),
      module: 'branch',
      action: 'UPDATE',
      entityType: 'Branch',
      entityId: String(updated._id),
      oldValue: existing.toObject() as unknown as Record<string, unknown>,
      newValue: updated.toObject() as unknown as Record<string, unknown>,
    });

    return updated;
  }

  public async deleteBranch(id: string, user: AuthUser): Promise<void> {
    if (!checkBranchAccess(user.branchAccess, id)) {
      throw new ForbiddenError('You do not have permission to delete this branch');
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Branch with ID ${id} not found`);
    }

    const [activeDepartments, activeClasses, activeStudents, activeEmployees, activeEnrollments] =
      await Promise.all([
        DepartmentModel.countDocuments({ branchId: id, isDeleted: false }),
        ClassModel.countDocuments({ branchId: id, isDeleted: false }),
        StudentModel.countDocuments({ branchId: id, isDeleted: false }),
        EmployeeModel.countDocuments({ branchId: id, isDeleted: false }),
        EnrollmentModel.countDocuments({ branchId: id, isDeleted: false }),
      ]);

    const totalDependencies =
      activeDepartments + activeClasses + activeStudents + activeEmployees + activeEnrollments;

    if (totalDependencies > 0) {
      throw new ValidationError(
        `Cannot delete branch "${existing.branchNameEn}" because it has active dependencies (${activeDepartments} departments, ${activeClasses} classes, ${activeStudents} students, ${activeEmployees} employees, ${activeEnrollments} enrollments). Reassign or archive the dependencies first.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: String(existing._id),
      module: 'branch',
      action: 'DELETE',
      entityType: 'Branch',
      entityId: String(existing._id),
      oldValue: existing.toObject() as unknown as Record<string, unknown>,
      required: true,
    });
  }
}
