import { checkBranchAccess, getAuthorizedBranchFilter } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import { checkDepartmentAccess } from '../../middleware/department-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { EmployeeModel } from '../employee/employee.model';
import { PositionModel } from '../position/position.model';
import { SchoolModel } from '../school/school.model';
import type { IDepartment } from './department.model';
import { DepartmentRepository } from './department.repository';
import type {
  CreateDepartmentDto,
  DepartmentQueryFilters,
  UpdateDepartmentDto,
} from './department.types';

export class DepartmentService {
  public constructor(private readonly repository = new DepartmentRepository()) {}

  public async getDepartments(
    filters: DepartmentQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IDepartment[]; total: number }> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);
    const departmentFilter =
      checkUserPermission(user.permissions, 'department.view.own_branch') ||
      user.departmentAccess === 'all'
        ? {}
        : {
            _id: {
              $in: user.departmentAccess ?? [],
            },
          };
    return this.repository.findWithFilters(filters, { ...branchFilter, ...departmentFilter });
  }

  public async getDepartmentById(id: string, user: AuthUser): Promise<IDepartment> {
    const department = await this.repository.findById(id);
    if (!department) {
      throw new NotFoundError(`Department with ID ${id} not found`);
    }

    const branchId =
      typeof department.branchId === 'object' && department.branchId !== null
        ? String(department.branchId._id)
        : String(department.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to this department');
    }
    if (
      !checkUserPermission(user.permissions, 'department.view.own_branch') &&
      !checkDepartmentAccess(user.departmentAccess, String(department._id))
    ) {
      throw new ForbiddenError('You do not have access to this department');
    }

    return department;
  }

  public async createDepartment(dto: CreateDepartmentDto, user: AuthUser): Promise<IDepartment> {
    // 1. Branch access check
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create departments in this branch');
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

    if (branch.status !== 'active' && dto.status === 'active') {
      throw new ValidationError(
        `Cannot create an active department for non-active branch "${branch.branchNameEn}"`,
      );
    }

    // 4. Validate unique code within Branch
    const existing = await this.repository.findByBranchAndCode(dto.branchId, dto.code);
    if (existing) {
      throw new ConflictError(
        `Department code "${dto.code.toUpperCase()}" already exists in branch "${branch.branchNameEn}"`,
      );
    }

    const department = await this.repository.create(dto, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      module: 'department',
      action: 'CREATE',
      entityType: 'Department',
      entityId: String(department._id),
      newValue: department.toObject() as unknown as Record<string, unknown>,
    });

    return department;
  }

  public async updateDepartment(
    id: string,
    dto: UpdateDepartmentDto,
    user: AuthUser,
  ): Promise<IDepartment> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Department with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have permission to modify this department');
    }

    const targetSchoolId = dto.schoolId || String(existing.schoolId);
    const targetBranchId = dto.branchId || currentBranchId;

    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to transfer department to target branch');
    }

    // Validate School & Branch relationships if changed
    if (dto.schoolId || dto.branchId) {
      const branch = await BranchModel.findOne({ _id: targetBranchId, isDeleted: false });
      if (!branch) {
        throw new ValidationError(`Branch with ID ${targetBranchId} does not exist`);
      }
      if (String(branch.schoolId) !== String(targetSchoolId)) {
        throw new ValidationError('Selected branch does not belong to the selected school');
      }
    }

    if (dto.code) {
      const duplicate = await this.repository.findByBranchAndCode(targetBranchId, dto.code, id);
      if (duplicate) {
        throw new ConflictError(
          `Department code "${dto.code.toUpperCase()}" is already in use in this branch`,
        );
      }
    }

    const updated = await this.repository.update(id, dto, user.userId);
    if (!updated) {
      throw new NotFoundError(`Department with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: targetSchoolId,
      branchId: targetBranchId,
      module: 'department',
      action: 'UPDATE',
      entityType: 'Department',
      entityId: String(updated._id),
      oldValue: existing.toObject() as unknown as Record<string, unknown>,
      newValue: updated.toObject() as unknown as Record<string, unknown>,
    });

    return updated;
  }

  public async deleteDepartment(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Department with ID ${id} not found`);
    }

    const branchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have permission to delete this department');
    }

    const [activePositions, activeEmployees] = await Promise.all([
      PositionModel.countDocuments({ departmentId: id, isDeleted: false }),
      EmployeeModel.countDocuments({ departmentId: id, isDeleted: false }),
    ]);
    if (activePositions > 0 || activeEmployees > 0) {
      throw new ValidationError(
        `Cannot delete department "${existing.nameEn}" because it has active dependencies (${activePositions} positions, ${activeEmployees} employees). Reassign or archive them first.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId,
      module: 'department',
      action: 'DELETE',
      entityType: 'Department',
      entityId: String(existing._id),
      oldValue: existing.toObject() as unknown as Record<string, unknown>,
    });
  }
}
