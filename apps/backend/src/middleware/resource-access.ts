import { Types } from 'mongoose';

import { EmployeeModel } from '../modules/employee/employee.model';
import { TeacherAssignmentModel } from '../modules/teacher-assignment/teacher-assignment.model';
import { ForbiddenError } from '../shared/errors/app-error';
import type { AuthUser } from '../types/auth';

/**
 * Validates if the authenticated user (acting as a teacher) is actively assigned
 * to the specified class (and subject if provided).
 * Callers must check action-specific branch-wide authority before invoking this
 * assignment check. Unrelated class-management permissions cannot widen it.
 */
export async function validateTeacherClassAccess(
  user: AuthUser,
  classId: string | Types.ObjectId,
  subjectId?: string | Types.ObjectId,
): Promise<boolean> {
  if (user.permissions.includes('*')) {
    return true;
  }

  if (!user.employeeId) {
    throw new ForbiddenError('A linked employee profile is required for teacher resource access');
  }

  const query: Record<string, unknown> = {
    schoolId: user.schoolId,
    ...(user.branchAccess === 'all' ? {} : { branchId: { $in: user.branchAccess } }),
    employeeId: new Types.ObjectId(user.employeeId),
    classId: new Types.ObjectId(classId.toString()),
    status: 'active',
    isDeleted: false,
    startDate: { $lte: new Date() },
    $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: new Date() } }],
  };

  if (subjectId) {
    query.subjectId = new Types.ObjectId(subjectId.toString());
  }

  const assignment = await TeacherAssignmentModel.exists(query);
  if (!assignment) {
    throw new ForbiddenError(
      'Access denied: You are not assigned as a teacher for this class or subject',
    );
  }

  return true;
}

/**
 * Validates if the user has access to a specific department based on departmentAccess or linked employee.
 */
export async function validateDepartmentAccess(
  user: AuthUser,
  targetDepartmentId: string,
): Promise<boolean> {
  if (user.permissions.includes('*')) {
    return true;
  }

  if (user.departmentAccess === 'all') {
    return true;
  }

  if (Array.isArray(user.departmentAccess) && user.departmentAccess.includes(targetDepartmentId)) {
    return true;
  }

  if (user.employeeId) {
    const employee = await EmployeeModel.findOne({
      schoolId: user.schoolId,
      _id: new Types.ObjectId(user.employeeId),
      departmentId: new Types.ObjectId(targetDepartmentId),
      isDeleted: false,
    });
    if (employee) {
      return true;
    }
  }

  throw new ForbiddenError('You do not have access to this department');
}
