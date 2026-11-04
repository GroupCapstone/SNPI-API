import { checkBranchAccess, getAuthorizedBranchFilter } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { DepartmentModel } from '../department/department.model';
import { EmployeeModel } from '../employee/employee.model';
import { SchoolModel } from '../school/school.model';
import type { IPosition } from './position.model';
import { PositionRepository } from './position.repository';
import type { CreatePositionDto, PositionQueryFilters, UpdatePositionDto } from './position.types';

export class PositionService {
  public constructor(private readonly repository = new PositionRepository()) {}

  public async getPositions(
    filters: PositionQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IPosition[]; total: number }> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);
    return this.repository.findWithFilters(filters, branchFilter);
  }

  public async getPositionById(id: string, user: AuthUser): Promise<IPosition> {
    const position = await this.repository.findById(id);
    if (!position) {
      throw new NotFoundError(`Position with ID ${id} not found`);
    }

    const branchId =
      typeof position.branchId === 'object' && position.branchId !== null
        ? String(position.branchId._id)
        : String(position.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to this position');
    }

    return position;
  }

  public async createPosition(dto: CreatePositionDto, user: AuthUser): Promise<IPosition> {
    // 1. Branch access check
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create positions in this branch');
    }

    // 2. Validate School exists & is active
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 3. Validate Branch exists & belongs to the School
    const branch = await BranchModel.findOne({ _id: dto.branchId, isDeleted: false });
    if (!branch) {
      throw new ValidationError(`Selected branch with ID ${dto.branchId} does not exist`);
    }

    if (String(branch.schoolId) !== String(dto.schoolId)) {
      throw new ValidationError('Selected branch does not belong to the selected school');
    }

    // 4. Validate Department exists & belongs to the Branch
    const department = await DepartmentModel.findOne({ _id: dto.departmentId, isDeleted: false });
    if (!department) {
      throw new ValidationError(`Selected department with ID ${dto.departmentId} does not exist`);
    }

    if (String(department.branchId) !== String(dto.branchId)) {
      throw new ValidationError('Selected department does not belong to the selected branch');
    }

    if (department.status !== 'active' && dto.status === 'active') {
      throw new ValidationError(
        `Cannot create an active position for non-active department "${department.nameEn}"`,
      );
    }

    // 5. Validate unique code within Department
    const existing = await this.repository.findByDepartmentAndCode(dto.departmentId, dto.code);
    if (existing) {
      throw new ConflictError(
        `Position code "${dto.code.toUpperCase()}" already exists in department "${department.nameEn}"`,
      );
    }

    const position = await this.repository.create(dto, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      module: 'position',
      action: 'CREATE',
      entityType: 'Position',
      entityId: String(position._id),
      newValue: position.toObject() as unknown as Record<string, unknown>,
    });

    return position;
  }

  public async updatePosition(
    id: string,
    dto: UpdatePositionDto,
    user: AuthUser,
  ): Promise<IPosition> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Position with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have permission to modify this position');
    }

    const targetSchoolId = dto.schoolId || String(existing.schoolId);
    const targetBranchId = dto.branchId || currentBranchId;
    const targetDepartmentId =
      dto.departmentId ||
      (typeof existing.departmentId === 'object' && existing.departmentId !== null
        ? String(existing.departmentId._id)
        : String(existing.departmentId));

    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to transfer position to target branch');
    }

    // Validate relationships if changed
    if (dto.schoolId || dto.branchId || dto.departmentId) {
      const branch = await BranchModel.findOne({ _id: targetBranchId, isDeleted: false });
      if (!branch) {
        throw new ValidationError(`Branch with ID ${targetBranchId} does not exist`);
      }
      if (String(branch.schoolId) !== String(targetSchoolId)) {
        throw new ValidationError('Selected branch does not belong to the selected school');
      }

      const department = await DepartmentModel.findOne({
        _id: targetDepartmentId,
        isDeleted: false,
      });
      if (!department) {
        throw new ValidationError(`Department with ID ${targetDepartmentId} does not exist`);
      }
      if (String(department.branchId) !== String(targetBranchId)) {
        throw new ValidationError('Selected department does not belong to the selected branch');
      }
    }

    if (dto.code) {
      const duplicate = await this.repository.findByDepartmentAndCode(
        targetDepartmentId,
        dto.code,
        id,
      );
      if (duplicate) {
        throw new ConflictError(
          `Position code "${dto.code.toUpperCase()}" is already in use in this department`,
        );
      }
    }

    const updated = await this.repository.update(id, dto, user.userId);
    if (!updated) {
      throw new NotFoundError(`Position with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: targetSchoolId,
      branchId: targetBranchId,
      module: 'position',
      action: 'UPDATE',
      entityType: 'Position',
      entityId: String(updated._id),
      oldValue: existing.toObject() as unknown as Record<string, unknown>,
      newValue: updated.toObject() as unknown as Record<string, unknown>,
    });

    return updated;
  }

  public async deletePosition(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Position with ID ${id} not found`);
    }

    const branchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have permission to delete this position');
    }

    const activeEmployees = await EmployeeModel.countDocuments({
      positionId: id,
      isDeleted: false,
    });
    if (activeEmployees > 0) {
      throw new ValidationError(
        `Cannot delete position "${existing.nameEn}" because ${activeEmployees} active employee(s) are assigned to it. Reassign those employees first.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId,
      module: 'position',
      action: 'DELETE',
      entityType: 'Position',
      entityId: String(existing._id),
      oldValue: existing.toObject() as unknown as Record<string, unknown>,
    });
  }
}
