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
import { EmployeeModel } from '../employee/employee.model';
import { SchoolModel } from '../school/school.model';
import { SubjectModel } from '../subject/subject.model';
import type { ITeacherAssignment } from './teacher-assignment.model';
import { TeacherAssignmentRepository } from './teacher-assignment.repository';
import type {
  CreateTeacherAssignmentDTO,
  TeacherAssignmentQueryFilters,
  TeacherRosterMatrixResponse,
  TeacherRosterQueryFilters,
  UpdateTeacherAssignmentDTO,
} from './teacher-assignment.types';

export class TeacherAssignmentService {
  public constructor(private readonly repository = new TeacherAssignmentRepository()) {}

  public async getRosterMatrix(
    filters: TeacherRosterQueryFilters,
    user: AuthUser,
  ): Promise<TeacherRosterMatrixResponse> {
    const effectiveFilters = { ...filters };
    effectiveFilters.schoolId = user.schoolId;

    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError('You do not have access to view teacher roster in this branch');
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    const isTeacher = user.roles.includes('teacher');
    const hasBranchWideView =
      user.roles.includes('super_admin') ||
      user.roles.includes('director') ||
      user.roles.includes('branch_manager') ||
      user.roles.includes('academic_officer') ||
      user.roles.includes('administrator');

    if (isTeacher && !hasBranchWideView) {
      if (!user.employeeId) {
        throw new ForbiddenError('A linked employee record is required to view teacher roster');
      }
      effectiveFilters.employeeId = user.employeeId;
    }

    return this.repository.findRosterMatrix(effectiveFilters);
  }

  public async getTeacherAssignments(
    filters: TeacherAssignmentQueryFilters,
    user: AuthUser,
  ): Promise<{ data: ITeacherAssignment[]; total: number }> {
    const effectiveFilters = { ...filters };
    effectiveFilters.schoolId = user.schoolId;

    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError(
          'You do not have access to view teacher assignments in this branch',
        );
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findAll(effectiveFilters);
  }

  public async getTeacherAssignmentById(id: string, user: AuthUser): Promise<ITeacherAssignment> {
    const assignment = await this.repository.findById(id);
    if (!assignment) {
      throw new NotFoundError(`Teacher assignment record with ID ${id} not found`);
    }

    const schoolId =
      typeof assignment.schoolId === 'object' && assignment.schoolId !== null
        ? String(assignment.schoolId._id)
        : String(assignment.schoolId);
    if (schoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to this teacher assignment record');
    }

    const branchId =
      typeof assignment.branchId === 'object' && assignment.branchId !== null
        ? String(assignment.branchId._id)
        : String(assignment.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view this teacher assignment record');
    }

    return assignment;
  }

  public async createTeacherAssignment(
    dto: CreateTeacherAssignmentDTO,
    user: AuthUser,
  ): Promise<ITeacherAssignment> {
    if (dto.schoolId !== user.schoolId) {
      throw new ForbiddenError(
        'You do not have access to create teacher assignments for this school',
      );
    }
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError(
        'You do not have access to create teacher assignments in this branch',
      );
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

    // 3. Academic Year check
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new ValidationError(`Academic year with ID ${dto.academicYearId} does not exist`);
    }

    // 4. Employee check
    const employee = await EmployeeModel.findOne({
      _id: dto.employeeId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!employee) {
      throw new ValidationError(`Teacher employee with ID ${dto.employeeId} does not exist`);
    }
    if (employee.status !== 'active') {
      throw new ValidationError(`Teacher employee with ID ${dto.employeeId} is not active`);
    }
    if (String(employee.branchId) !== String(dto.branchId)) {
      throw new ValidationError(
        `Teacher employee does not belong to branch with ID ${dto.branchId}`,
      );
    }

    // 5. Class check
    const classDoc = await ClassModel.findOne({
      _id: dto.classId,
      branchId: dto.branchId,
      isDeleted: false,
    });
    if (!classDoc) {
      throw new ValidationError(
        `Class with ID ${dto.classId} does not exist in branch ${dto.branchId}`,
      );
    }

    // 6. Optional Subject check
    if (dto.subjectId) {
      const subject = await SubjectModel.findOne({ _id: dto.subjectId, isDeleted: false });
      if (!subject) {
        throw new ValidationError(`Subject with ID ${dto.subjectId} does not exist`);
      }
    }

    // 7. Prevent duplicate active assignment
    const duplicate = await this.repository.findDuplicate(
      dto.academicYearId,
      dto.classId,
      dto.employeeId,
      dto.subjectId,
    );
    if (duplicate) {
      throw new ConflictError(
        'An active teacher assignment already exists for this teacher, class, and subject in this academic year',
      );
    }

    // 8. Create assignment
    const created = await this.repository.create({
      schoolId: school._id as never,
      branchId: branch._id as never,
      academicYearId: academicYear._id as never,
      employeeId: employee._id as never,
      classId: classDoc._id as never,
      subjectId: dto.subjectId ? (dto.subjectId as never) : undefined,
      roleInClass: dto.roleInClass,
      status: dto.status ?? 'active',
      startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      remarks: dto.remarks?.trim(),
      createdBy: user.userId as never,
      updatedBy: user.userId as never,
    });

    // 9. Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'teacher_assignment',
      action: 'CREATE',
      entityType: 'TeacherAssignment',
      entityId: created._id.toString(),
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async updateTeacherAssignment(
    id: string,
    dto: UpdateTeacherAssignmentDTO,
    user: AuthUser,
  ): Promise<ITeacherAssignment> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Teacher assignment with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const currentSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    if (currentSchoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to edit this teacher assignment');
    }

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have access to edit this teacher assignment');
    }

    const updateData: Partial<ITeacherAssignment> = {
      updatedBy: user.userId as never,
    };

    if (dto.roleInClass) updateData.roleInClass = dto.roleInClass;
    if (dto.status) updateData.status = dto.status;
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    }
    if (dto.remarks !== undefined) updateData.remarks = dto.remarks?.trim();

    const updated = await this.repository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundError(`Teacher assignment with ID ${id} not found after update`);
    }

    // Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'teacher_assignment',
      action: 'UPDATE',
      entityType: 'TeacherAssignment',
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

  public async deleteTeacherAssignment(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Teacher assignment with ID ${id} not found`);
    }

    const branchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const schoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    if (schoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to delete this teacher assignment');
    }

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to delete this teacher assignment');
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      module: 'teacher_assignment',
      action: 'DELETE',
      entityType: 'TeacherAssignment',
      entityId: id,
      schoolId,
      branchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }
}
