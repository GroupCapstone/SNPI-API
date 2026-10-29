import { checkBranchAccess, getAuthorizedBranchFilter } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  checkDepartmentAccess,
  getAuthorizedDepartmentFilter,
} from '../../middleware/department-access';
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
import { PositionModel } from '../position/position.model';
import { SchoolModel } from '../school/school.model';
import { SequenceService } from '../sequence/sequence.service';
import type { IEmployee } from './employee.model';
import { EmployeeRepository } from './employee.repository';
import type { CreateEmployeeDto, EmployeeQueryFilters, UpdateEmployeeDto } from './employee.types';

export class EmployeeService {
  public constructor(private readonly repository = new EmployeeRepository()) {}

  public async getEmployees(
    filters: EmployeeQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IEmployee[]; total: number }> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);
    const departmentFilter = checkUserPermission(user.permissions, 'employee.view.own_branch')
      ? {}
      : getAuthorizedDepartmentFilter(user.departmentAccess, filters.departmentId);
    return this.repository.findWithFilters(filters, { ...branchFilter, ...departmentFilter });
  }

  public async getEmployeeById(id: string, user: AuthUser): Promise<IEmployee> {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    const branchId =
      typeof employee.branchId === 'object' && employee.branchId !== null
        ? String(employee.branchId._id)
        : String(employee.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view this employee record');
    }
    const departmentId =
      typeof employee.departmentId === 'object' && employee.departmentId !== null
        ? String(employee.departmentId._id)
        : String(employee.departmentId);
    if (!checkUserPermission(user.permissions, 'employee.view.own_branch')) {
      if (checkUserPermission(user.permissions, 'employee.view.own_department')) {
        if (!checkDepartmentAccess(user.departmentAccess, departmentId)) {
          throw new ForbiddenError('You do not have access to this employee department');
        }
      } else if (
        checkUserPermission(user.permissions, 'employee.view.own_record') &&
        user.employeeId === id
      ) {
        return employee;
      } else {
        throw new ForbiddenError('You may only view your own employment record');
      }
    }

    return employee;
  }

  public async createEmployee(dto: CreateEmployeeDto, user: AuthUser): Promise<IEmployee> {
    // 1. Branch access check
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create employees in this branch');
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
    if (branch.schoolId.toString() !== dto.schoolId) {
      throw new ValidationError(
        `Selected branch does not belong to the selected school organization`,
      );
    }

    // 4. Validate Department exists & belongs to the Branch & School
    const department = await DepartmentModel.findOne({ _id: dto.departmentId, isDeleted: false });
    if (!department) {
      throw new ValidationError(`Selected department with ID ${dto.departmentId} does not exist`);
    }
    if (department.branchId.toString() !== dto.branchId) {
      throw new ValidationError(
        `Selected department does not belong to branch [${branch.branchCode}]`,
      );
    }
    if (department.schoolId.toString() !== dto.schoolId) {
      throw new ValidationError(`Selected department does not belong to the selected school`);
    }

    // 5. Validate Position exists & belongs to the Department, Branch & School
    const position = await PositionModel.findOne({ _id: dto.positionId, isDeleted: false });
    if (!position) {
      throw new ValidationError(`Selected position with ID ${dto.positionId} does not exist`);
    }
    if (position.departmentId.toString() !== dto.departmentId) {
      throw new ValidationError(
        `Selected position does not belong to department [${department.code}]`,
      );
    }
    if (position.branchId.toString() !== dto.branchId) {
      throw new ValidationError(`Selected position does not belong to the selected branch`);
    }
    if (position.schoolId.toString() !== dto.schoolId) {
      throw new ValidationError(`Selected position does not belong to the selected school`);
    }

    // 6. Generate or Validate Employee ID
    let finalEmployeeId = dto.employeeId?.trim().toUpperCase();
    if (finalEmployeeId) {
      const existingEmployee = await this.repository.findByEmployeeId(finalEmployeeId);
      if (existingEmployee) {
        throw new ConflictError(`Employee with ID "${finalEmployeeId}" already exists`);
      }
    } else {
      finalEmployeeId = await SequenceService.getNextSequence('EMP', 'EMP', 6);
    }

    // 7. Check legacy employee number uniqueness if provided
    if (dto.legacyEmployeeNumber?.trim()) {
      const existingLegacy = await this.repository.findByLegacyNumber(dto.legacyEmployeeNumber);
      if (existingLegacy) {
        throw new ConflictError(
          `Employee with legacy employee number "${dto.legacyEmployeeNumber}" already exists`,
        );
      }
    }

    // 8. Validate unique email if provided
    if (dto.email && dto.email.trim()) {
      const existingEmail = await this.repository.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictError(`Employee with email "${dto.email}" already exists`);
      }
    }

    // 9. Normalize contact phone fields
    const primaryPhone = dto.primaryPhone?.trim() || dto.phone?.trim() || undefined;

    // 10. Create Employee
    const created = await this.repository.create({
      ...dto,
      employeeId: finalEmployeeId,
      phone: primaryPhone,
      primaryPhone,
      secondaryPhone: dto.secondaryPhone?.trim() || undefined,
      email: dto.email ? dto.email.trim().toLowerCase() : undefined,
      createdBy: user.userId,
    });

    // 11. Audit Logging
    await AuditLogService.log({
      userId: user.userId,
      module: 'employee',
      action: 'CREATE',
      entityType: 'Employee',
      entityId: created._id.toString(),
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async updateEmployee(
    id: string,
    dto: UpdateEmployeeDto,
    user: AuthUser,
  ): Promise<IEmployee> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const currentSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    const targetSchoolId = dto.schoolId ?? currentSchoolId;
    const targetBranchId = dto.branchId ?? currentBranchId;

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have access to edit this employee record');
    }

    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to transfer employee to this target branch');
    }

    // Validate relationships if any structural component changes
    if (dto.schoolId || dto.branchId || dto.departmentId || dto.positionId) {
      const school = await SchoolModel.findOne({ _id: targetSchoolId, isDeleted: false });
      if (!school) {
        throw new ValidationError(`Selected school does not exist`);
      }

      const branch = await BranchModel.findOne({ _id: targetBranchId, isDeleted: false });
      if (!branch || branch.schoolId.toString() !== targetSchoolId) {
        throw new ValidationError(
          `Selected branch does not belong to the selected school organization`,
        );
      }

      const targetDeptId =
        dto.departmentId ??
        (typeof existing.departmentId === 'object' && existing.departmentId !== null
          ? String(existing.departmentId._id)
          : String(existing.departmentId));

      const department = await DepartmentModel.findOne({ _id: targetDeptId, isDeleted: false });
      if (
        !department ||
        department.branchId.toString() !== targetBranchId ||
        department.schoolId.toString() !== targetSchoolId
      ) {
        throw new ValidationError(`Selected department does not belong to the selected branch`);
      }

      const targetPosId =
        dto.positionId ??
        (typeof existing.positionId === 'object' && existing.positionId !== null
          ? String(existing.positionId._id)
          : String(existing.positionId));

      const position = await PositionModel.findOne({ _id: targetPosId, isDeleted: false });
      if (
        !position ||
        position.departmentId.toString() !== targetDeptId ||
        position.branchId.toString() !== targetBranchId ||
        position.schoolId.toString() !== targetSchoolId
      ) {
        throw new ValidationError(`Selected position does not belong to the selected department`);
      }
    }

    // Check employee ID uniqueness if changing
    if (dto.employeeId?.trim()) {
      const formattedEmpId = dto.employeeId.trim().toUpperCase();
      const existingEmp = await this.repository.findByEmployeeId(formattedEmpId);
      if (existingEmp && existingEmp._id.toString() !== id) {
        throw new ConflictError(`Employee with ID "${formattedEmpId}" already exists`);
      }
    }

    // Check legacy employee number uniqueness
    if (dto.legacyEmployeeNumber?.trim()) {
      const legacyConflict = await this.repository.findByLegacyNumber(dto.legacyEmployeeNumber);
      if (legacyConflict && legacyConflict._id.toString() !== id) {
        throw new ConflictError(
          `Employee with legacy employee number "${dto.legacyEmployeeNumber}" already exists`,
        );
      }
    }

    // Check unique email conflict
    if (dto.email && dto.email.trim()) {
      const emailConflict = await this.repository.findByEmail(dto.email);
      if (emailConflict && emailConflict._id.toString() !== id) {
        throw new ConflictError(`Employee with email "${dto.email}" already exists`);
      }
    }

    const primaryPhone =
      dto.primaryPhone !== undefined
        ? dto.primaryPhone?.trim() || undefined
        : dto.phone !== undefined
          ? dto.phone?.trim() || undefined
          : undefined;

    const updated = await this.repository.update(id, {
      ...dto,
      ...(primaryPhone !== undefined ? { phone: primaryPhone, primaryPhone } : {}),
      ...(dto.secondaryPhone !== undefined
        ? { secondaryPhone: dto.secondaryPhone?.trim() || undefined }
        : {}),
      email: dto.email ? dto.email.trim().toLowerCase() : undefined,
      updatedBy: user.userId,
    });

    if (!updated) {
      throw new NotFoundError(`Failed to update employee with ID ${id}`);
    }

    // Audit Logging
    await AuditLogService.log({
      userId: user.userId,
      module: 'employee',
      action: 'UPDATE',
      entityType: 'Employee',
      entityId: id,
      schoolId: targetSchoolId,
      branchId: targetBranchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async deleteEmployee(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} not found`);
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
      throw new ForbiddenError('You do not have access to delete this employee record');
    }

    await this.repository.softDelete(id, user.userId);

    // Audit Logging
    await AuditLogService.log({
      userId: user.userId,
      module: 'employee',
      action: 'DELETE',
      entityType: 'Employee',
      entityId: id,
      schoolId,
      branchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }
}
