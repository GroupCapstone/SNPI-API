import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../src/modules/auth/auth.service';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';

const schoolId = '507f1f77bcf86cd799439001';
const branchId = '507f1f77bcf86cd799439002';
const employeeId = '507f1f77bcf86cd799439003';
const departmentId = '507f1f77bcf86cd799439004';
const query = (value: unknown) => ({
  select: vi.fn().mockReturnThis(),
  lean: vi.fn().mockReturnThis(),
  exec: vi.fn().mockResolvedValue(value),
});

describe('resolved authentication resource scope', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([schoolId, { _id: schoolId }])(
    'scopes linked employee and teaching assignments to the authenticated school: %j',
    async (school) => {
      const employee = vi
        .spyOn(EmployeeModel, 'findOne')
        .mockReturnValue(query({ branchId, departmentId }) as never);
      const assignments = vi.spyOn(TeacherAssignmentModel, 'find').mockReturnValue(
        query([
          { branchId, classId: 'assigned-class', subjectId: 'assigned-subject' },
          {
            branchId: 'another-branch',
            classId: 'forbidden-class',
            subjectId: 'forbidden-subject',
          },
        ]) as never,
      );
      const service = new AuthService(undefined, {
        resolvePermissionsForRoles: vi.fn().mockResolvedValue(['score.view.assigned_subject']),
      } as never);
      const context = await service.buildAuthorizationContext({
        _id: 'user',
        schoolId: school,
        employeeId,
        username: 'teacher',
        email: 'teacher@example.test',
        roles: ['teacher'],
        branchAccess: [branchId],
        departmentAccess: [],
        directPermissions: ['*', 'invalid.permission', 'attendance.view.assigned_class'],
        status: 'active',
      } as never);
      expect(employee).toHaveBeenCalledWith({ _id: employeeId, schoolId, isDeleted: false });
      expect(assignments).toHaveBeenCalledWith(
        expect.objectContaining({
          schoolId,
          status: 'active',
          isDeleted: false,
          startDate: expect.any(Object),
          $or: expect.any(Array),
        }),
      );
      expect(context.assignedClasses).toEqual(['assigned-class']);
      expect(context.assignedSubjects).toEqual(['assigned-subject']);
      expect(context.departmentAccess).toEqual([departmentId]);
      expect(context.permissions).toEqual([
        'score.view.assigned_subject',
        'attendance.view.assigned_class',
      ]);
      expect(context.isSuperAdmin).toBe(false);
    },
  );
});
