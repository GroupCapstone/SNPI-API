import { Types } from 'mongoose';

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
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { StudentModel } from '../student/student.model';
import type { IAttendanceLeave } from './attendance-leave.model';
import { AttendanceLeaveRepository } from './attendance-leave.repository';
import type {
  AttendanceLeaveFilters,
  CreateAttendanceLeaveDto,
  ReviewAttendanceLeaveDto,
} from './attendance-leave.types';

export class AttendanceLeaveService {
  public constructor(private readonly repository = new AttendanceLeaveRepository()) {}

  public async getLeaves(filters: AttendanceLeaveFilters, user: AuthUser) {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to leave records in this branch');
    }
    const branchWide =
      checkUserPermission(user.permissions, 'attendance.view.own_branch') ||
      checkUserPermission(user.permissions, 'attendance.view.all_branches');
    const scoped = { ...filters };
    if (!branchWide) {
      if (filters.classId && !(user.assignedClasses ?? []).includes(filters.classId)) {
        throw new ForbiddenError('You are not assigned to this class');
      }
      scoped.authorizedClassIds = user.assignedClasses ?? [];
    }
    return this.repository.findMany(
      user.schoolId,
      scoped,
      user.branchAccess === 'all' ? undefined : user.branchAccess,
    );
  }

  public async createLeave(
    dto: CreateAttendanceLeaveDto,
    user: AuthUser,
  ): Promise<IAttendanceLeave> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create leave records in this branch');
    }
    const branchWide =
      checkUserPermission(user.permissions, 'attendance.create.own_branch') ||
      checkUserPermission(user.permissions, 'attendance.create.all_branches');
    if (!branchWide && !(user.assignedClasses ?? []).includes(dto.classId)) {
      throw new ForbiddenError('You are not assigned to this class');
    }
    const [branch, student, classDoc, enrollment] = await Promise.all([
      BranchModel.findOne({ _id: dto.branchId, schoolId: user.schoolId, isDeleted: false }).lean(),
      StudentModel.findOne({
        _id: dto.studentId,
        schoolId: user.schoolId,
        isDeleted: false,
      }).lean(),
      ClassModel.findOne({ _id: dto.classId, schoolId: user.schoolId, isDeleted: false }).lean(),
      EnrollmentModel.findOne({
        _id: dto.enrollmentId,
        schoolId: user.schoolId,
        isDeleted: false,
        status: { $in: ['enrolled', 'active'] },
      }).lean(),
    ]);
    if (!branch || !student || !classDoc || !enrollment) {
      throw new NotFoundError('Branch, student, class, or active enrollment was not found');
    }
    if (
      String(student.branchId) !== dto.branchId ||
      String(classDoc.branchId) !== dto.branchId ||
      String(enrollment.branchId) !== dto.branchId ||
      String(enrollment.studentId) !== dto.studentId ||
      String(enrollment.classId) !== dto.classId
    ) {
      throw new ValidationError(
        'Leave request relationships do not belong to the same branch and enrollment',
      );
    }
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) throw new ValidationError('End date cannot be before start date');
    if (await this.repository.findOverlap(dto.studentId, startDate, endDate)) {
      throw new ConflictError('Student already has a pending or approved leave in this date range');
    }
    const created = await this.repository.create(user.schoolId, dto, user.userId);
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'attendance',
      action: 'CREATE',
      entityType: 'AttendanceLeave',
      entityId: String(created._id),
      newValue: created.toObject(),
    });
    return created;
  }

  public async reviewLeave(
    id: string,
    dto: ReviewAttendanceLeaveDto,
    user: AuthUser,
  ): Promise<IAttendanceLeave> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundError('Leave request not found');
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) throw new NotFoundError('Leave request not found');
    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to this leave request');
    }
    const canApprove =
      checkUserPermission(user.permissions, 'attendance.edit.own_branch') ||
      checkUserPermission(user.permissions, 'attendance.edit.all_branches');
    if (!canApprove && !(user.assignedClasses ?? []).includes(String(existing.classId))) {
      throw new ForbiddenError('You are not assigned to this class');
    }
    if (dto.status !== 'cancelled' && !canApprove) {
      throw new ForbiddenError(
        'Branch-wide attendance edit permission is required to approve leave',
      );
    }
    if (existing.status !== 'pending') {
      throw new ConflictError('Only pending leave requests can be reviewed');
    }
    const updated = await this.repository.review(id, user.schoolId, dto, user.userId);
    if (!updated) throw new ConflictError('Leave request changed during review');
    if (updated.status === 'approved') {
      await this.repository.applyApprovedLeaveToAttendance(updated, user.userId);
    }
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: String(existing.branchId),
      module: 'attendance',
      action: 'UPDATE',
      entityType: 'AttendanceLeave',
      entityId: id,
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
      reason: dto.reviewNotes,
    });
    return updated;
  }
}
