import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { DEFAULT_CORE_ROLES } from '../src/constants/permissions';
import { AttendanceLeaveRepository } from '../src/modules/attendance-leave/attendance-leave.repository';
import { AuditLogService } from '../src/modules/audit-log/audit-log.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { UserModel } from '../src/modules/user/user.model';
import { TokenUtil } from '../src/utils/token';

const schoolId = '507f1f77bcf86cd799439001';
const branchId = '507f1f77bcf86cd799439002';
const classId = '507f1f77bcf86cd799439003';
const leaveId = '507f1f77bcf86cd799439004';
const userId = '507f1f77bcf86cd799439005';
const otherId = '507f1f77bcf86cd799439006';
const teacherPermissions = DEFAULT_CORE_ROLES.find((role) => role.code === 'teacher')!.permissions;

describe('attendance leave review with authenticated scope', () => {
  const app = createApp();
  let authorization: {
    permissions: string[];
    branchAccess: string[];
    assignedClasses: string[];
    assignedSubjects: string[];
    departmentAccess: string[];
    defaultBranch: string;
    isSuperAdmin: boolean;
  };
  const record = () => ({
    _id: leaveId,
    schoolId,
    branchId,
    classId,
    status: 'pending',
    toObject: () => ({}),
  });

  beforeEach(() => {
    authorization = {
      permissions: [...teacherPermissions],
      branchAccess: [branchId],
      assignedClasses: [classId],
      assignedSubjects: [],
      departmentAccess: [],
      defaultBranch: branchId,
      isSuperAdmin: false,
    };
    vi.spyOn(UserModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: userId,
        schoolId,
        username: 'teacher',
        email: 'teacher@example.test',
        roles: ['teacher'],
        status: 'active',
        tokenVersion: 0,
      }),
    } as never);
    vi.spyOn(AuthService.prototype, 'buildAuthorizationContext').mockImplementation(
      async () => authorization as never,
    );
    vi.spyOn(AttendanceLeaveRepository.prototype, 'findById').mockResolvedValue(record() as never);
    vi.spyOn(AttendanceLeaveRepository.prototype, 'review').mockImplementation(
      async (_id, _school, dto) => ({ ...record(), status: dto.status }) as never,
    );
    vi.spyOn(
      AttendanceLeaveRepository.prototype,
      'applyApprovedLeaveToAttendance',
    ).mockResolvedValue(undefined);
    vi.spyOn(AuditLogService, 'log').mockResolvedValue(undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  const review = (
    status: string,
    token = TokenUtil.generateAccessToken({ userId, tokenVersion: 0 }),
  ) =>
    request(app)
      .patch(`/api/v1/attendance-leaves/${leaveId}/review`)
      .set('Authorization', `Bearer ${token}`)
      // Never allow the test-only default administrator to mask an invalid JWT.
      .set('X-No-Auth', 'true')
      .send({ status });

  it('allows teachers to cancel a pending request in their assigned class', async () => {
    const response = await review('cancelled');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('cancelled');
    expect(AuditLogService.log).toHaveBeenCalledOnce();
  });

  it.each([{ assignedClasses: [otherId] }, { assignedClasses: [] }])(
    'rejects cancellation outside current assignments: $assignedClasses',
    async ({ assignedClasses }) => {
      authorization.assignedClasses = assignedClasses;
      expect((await review('cancelled')).status).toBe(403);
      expect(AttendanceLeaveRepository.prototype.review).not.toHaveBeenCalled();
      expect(AuditLogService.log).not.toHaveBeenCalled();
    },
  );

  it('rejects cancellation outside the authorized branch', async () => {
    authorization.branchAccess = [otherId];
    expect((await review('cancelled')).status).toBe(403);
    expect(AttendanceLeaveRepository.prototype.review).not.toHaveBeenCalled();
  });

  it.each(['approved', 'rejected'])(
    'does not allow a teacher to mark a request %s',
    async (status) => {
      expect((await review(status)).status).toBe(403);
      expect(AttendanceLeaveRepository.prototype.review).not.toHaveBeenCalled();
    },
  );

  it.each(['cancelled', 'approved', 'rejected'])(
    'allows branch attendance editors to mark a request %s',
    async (status) => {
      authorization.permissions = ['attendance.edit.own_branch'];
      authorization.assignedClasses = [];
      expect((await review(status)).status).toBe(200);
      expect(AttendanceLeaveRepository.prototype.review).toHaveBeenCalledOnce();
    },
  );

  it('rejects a read-only teacher at the route', async () => {
    authorization.permissions = ['attendance.view.assigned_class'];
    expect((await review('cancelled')).status).toBe(403);
    expect(AttendanceLeaveRepository.prototype.findById).not.toHaveBeenCalled();
  });

  it('rejects invalid authentication without falling back to the test administrator', async () => {
    expect((await review('cancelled', 'invalid-token')).status).toBe(401);
    expect(AttendanceLeaveRepository.prototype.findById).not.toHaveBeenCalled();
  });
});
