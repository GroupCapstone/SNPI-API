import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { ALL_PERMISSION_CODES, DEFAULT_CORE_ROLES } from '../src/constants/permissions';
import { checkUserPermission } from '../src/middleware/authorize';
import {
  validateDepartmentAccess,
  validateTeacherClassAccess,
} from '../src/middleware/resource-access';
import { AuditLogService } from '../src/modules/audit-log/audit-log.service';
import { ClassService } from '../src/modules/class/class.service';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { RoleModel } from '../src/modules/role/role.model';
import { RoleService } from '../src/modules/role/role.service';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/role/role.model', () => ({
  RoleModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/employee/employee.model', () => ({
  EmployeeModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/teacher-assignment/teacher-assignment.model', () => ({
  TeacherAssignmentModel: {
    exists: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
    public getAuditLogs = vi.fn().mockResolvedValue({ data: [], total: 0 });
  },
}));

describe('RBAC & Scope Security Enforcement Tests', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scope Hierarchy & Permission Engine (checkUserPermission)', () => {
    it('requires persisted wildcard authority instead of trusting the super_admin role name', () => {
      expect(checkUserPermission([], 'student.delete.all_branches', ['super_admin'])).toBe(false);
      expect(checkUserPermission(['*'], 'tuition.delete.all_branches')).toBe(true);
    });

    it('allows higher scope (all_branches) to satisfy lower scope (own_branch / assigned_class)', () => {
      const userPermissions = ['student.view.all_branches'];
      expect(checkUserPermission(userPermissions, 'student.view.own_branch')).toBe(true);
      expect(checkUserPermission(userPermissions, 'student.view.assigned_class')).toBe(true);
    });

    it('denies lower scope (own_branch) from satisfying higher scope (all_branches)', () => {
      const userPermissions = ['student.view.own_branch'];
      expect(checkUserPermission(userPermissions, 'student.view.all_branches')).toBe(false);
    });

    it('does not treat assigned_class and assigned_subject as interchangeable scopes', () => {
      expect(
        checkUserPermission(['score.view.assigned_class'], 'score.view.assigned_subject'),
      ).toBe(false);
      expect(
        checkUserPermission(['score.view.assigned_subject'], 'score.view.assigned_class'),
      ).toBe(false);
    });

    it('allows manage action to satisfy specific actions (view, create, edit, delete)', () => {
      const userPermissions = ['tuition.manage.own_branch'];
      expect(checkUserPermission(userPermissions, 'tuition.view.own_branch')).toBe(true);
      expect(checkUserPermission(userPermissions, 'tuition.create.own_branch')).toBe(true);
      expect(checkUserPermission(userPermissions, 'tuition.delete.own_branch')).toBe(true);
    });

    it('denies access when user lacks module permission', () => {
      const userPermissions = ['student_case.view.own_branch'];
      expect(checkUserPermission(userPermissions, 'payment.view.own_branch')).toBe(false);
      expect(checkUserPermission(userPermissions, 'tuition.view.own_branch')).toBe(false);
    });
  });

  describe('Resource Scope & Teacher Assignment Validation', () => {
    it('allows only assigned class records for teacher detail access', async () => {
      const classA = '507f1f77bcf86cd799439022';
      const classB = '507f1f77bcf86cd799439023';
      const branchId = '507f1f77bcf86cd799439011';
      const repository = {
        findById: vi.fn(async (id: string) => ({ _id: id, branchId })),
      };
      const service = new ClassService(repository as never);
      const teacher: AuthUser = {
        userId: 'teacher-1',
        username: 'teacher',
        email: 'teacher@snp.edu.kh',
        schoolId: 'school-1',
        roles: ['teacher'],
        permissions: ['class.view.assigned_class'],
        branchAccess: [branchId],
        assignedClasses: [classA],
      };

      await expect(service.getClassById(classA, teacher)).resolves.toMatchObject({ _id: classA });
      await expect(service.getClassById(classB, teacher)).rejects.toThrow(
        'not assigned to this class',
      );
    });

    it('allows super_admin without teacher assignment', async () => {
      const superAdminUser: AuthUser = {
        userId: 'admin-1',
        username: 'admin',
        email: 'admin@snp.edu.kh',
        schoolId: 'school-1',
        roles: ['super_admin'],
        permissions: ['*'],
        branchAccess: 'all',
      };

      const result = await validateTeacherClassAccess(superAdminUser, 'class-1', 'subject-1');
      expect(result).toBe(true);
    });

    it('allows teacher assigned to the class and subject', async () => {
      const teacherUser: AuthUser = {
        userId: 'teacher-1',
        username: 'teacher.dara',
        email: 'teacher.dara@snp.edu.kh',
        schoolId: 'school-1',
        employeeId: '507f1f77bcf86cd799439011',
        roles: ['teacher'],
        permissions: ['attendance.create.assigned_class', 'score.create.assigned_subject'],
        branchAccess: ['branch-main'],
      };

      vi.mocked(TeacherAssignmentModel.exists).mockResolvedValue(true as never);

      const result = await validateTeacherClassAccess(
        teacherUser,
        '507f1f77bcf86cd799439022',
        '507f1f77bcf86cd799439033',
      );
      expect(result).toBe(true);
      expect(TeacherAssignmentModel.exists).toHaveBeenCalledWith(
        expect.objectContaining({
          classId: expect.anything(),
          subjectId: expect.anything(),
          status: 'active',
          startDate: expect.any(Object),
          $or: expect.any(Array),
        }),
      );
    });

    it('throws ForbiddenError when teacher is not assigned to the class/subject', async () => {
      const teacherUser: AuthUser = {
        userId: 'teacher-1',
        username: 'teacher.dara',
        email: 'teacher.dara@snp.edu.kh',
        schoolId: 'school-1',
        employeeId: '507f1f77bcf86cd799439011',
        roles: ['teacher'],
        permissions: ['attendance.create.assigned_class'],
        branchAccess: ['branch-main'],
      };

      vi.mocked(TeacherAssignmentModel.exists).mockResolvedValue(null as never);

      await expect(
        validateTeacherClassAccess(teacherUser, '507f1f77bcf86cd799439099'),
      ).rejects.toThrow(
        'Access denied: You are not assigned as a teacher for this class or subject',
      );
    });
  });

  describe('Department Scope Validation', () => {
    it('allows global department access for super_admin and users with all departmentAccess', async () => {
      const adminUser: AuthUser = {
        userId: 'u1',
        username: 'admin',
        email: 'admin@snp.edu.kh',
        schoolId: 's1',
        roles: ['super_admin'],
        permissions: ['*'],
        branchAccess: 'all',
        departmentAccess: 'all',
      };
      expect(await validateDepartmentAccess(adminUser, 'dept-123')).toBe(true);
    });

    it('allows access to explicitly permitted departmentId', async () => {
      const deptHeadUser: AuthUser = {
        userId: 'u2',
        username: 'dept.head',
        email: 'head@snp.edu.kh',
        schoolId: 's1',
        roles: ['department_head'],
        permissions: ['department.view.own_branch'],
        branchAccess: ['b1'],
        departmentAccess: ['dept-123'],
      };
      expect(await validateDepartmentAccess(deptHeadUser, 'dept-123')).toBe(true);
    });

    it('allows access via linked employee department assignment fallback', async () => {
      const teacherUser: AuthUser = {
        userId: 'u3',
        username: 'teacher.dara',
        email: 'teacher.dara@snp.edu.kh',
        schoolId: 's1',
        employeeId: '507f1f77bcf86cd799439011',
        roles: ['teacher'],
        permissions: ['attendance.view.assigned_class'],
        branchAccess: ['b1'],
        departmentAccess: ['dept-abc'],
      };
      vi.mocked(EmployeeModel.findOne).mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        departmentId: '507f1f77bcf86cd799439022',
      } as never);
      expect(await validateDepartmentAccess(teacherUser, '507f1f77bcf86cd799439022')).toBe(true);
    });
  });

  describe('Branch & Role Isolation API Tests', () => {
    it('returns 403 when Branch Manager attempts to access unassigned branch', async () => {
      const response = await request(app)
        .get('/api/v1/students')
        .query({ branchId: '507f1f77bcf86cd799439099' })
        .set('X-User-Id', 'manager-mb')
        .set('X-User-Roles', 'branch_manager')
        .set('X-User-Permissions', 'student.view.own_branch')
        .set('X-Branch-Access', '507f1f77bcf86cd799439011');

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/branch/i);
    });

    it('returns 403 when Finance Officer attempts to query unauthorized branch', async () => {
      const response = await request(app)
        .get('/api/v1/tuition-fees')
        .query({ branchId: '507f1f77bcf86cd799439099' })
        .set('X-User-Id', 'finance-mb')
        .set('X-User-Roles', 'finance_officer')
        .set('X-User-Permissions', 'tuition.view.own_branch')
        .set('X-Branch-Access', '507f1f77bcf86cd799439011');

      expect(response.status).toBe(403);
    });

    it('returns 403 when Student Affairs Officer attempts to access finance payments', async () => {
      const response = await request(app)
        .get('/api/v1/payments')
        .set('X-User-Id', 'affairs-user')
        .set('X-User-Roles', 'student_affairs_officer')
        .set('X-User-Permissions', 'student_case.view.own_branch')
        .set('X-Branch-Access', '507f1f77bcf86cd799439011');

      expect(response.status).toBe(403);
    });

    it('returns 403 when Staff user attempts to delete a role or student', async () => {
      const response = await request(app)
        .delete('/api/v1/roles/507f1f77bcf86cd799439011')
        .set('X-User-Id', 'staff-user')
        .set('X-User-Roles', 'staff')
        .set('X-User-Permissions', 'branch.view.own_branch')
        .set('X-Branch-Access', 'branch-main');

      expect(response.status).toBe(403);
    });

    it('allows Director to view cross-branch records with all_branches permission', async () => {
      vi.mocked(RoleModel.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([]),
      } as never);
      vi.mocked(RoleModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(0),
      } as never);

      const response = await request(app)
        .get('/api/v1/roles')
        .set('X-User-Id', 'director-user')
        .set('X-User-Roles', 'director')
        .set('X-User-Permissions', 'role.view.all_branches')
        .set('X-Branch-Access', 'all');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('denies Director operational score edits and payment voids without explicit grants', async () => {
      const headers = {
        'X-User-Id': 'director-user',
        'X-User-Roles': 'director',
        'X-User-Permissions': 'score.view.all_branches,payment.view.all_branches',
        'X-Branch-Access': 'all',
      };

      const scoreResponse = await request(app)
        .post('/api/v1/scores/batch')
        .set(headers)
        .send({ assessmentId: '507f1f77bcf86cd799439011', scores: [] });
      const paymentResponse = await request(app)
        .post('/api/v1/payments/507f1f77bcf86cd799439011/void')
        .set(headers)
        .send({ reason: 'Not authorized' });

      expect(scoreResponse.status).toBe(403);
      expect(paymentResponse.status).toBe(403);
    });

    it('denies Staff access to finance and RBAC APIs', async () => {
      const headers = {
        'X-User-Id': 'staff-user',
        'X-User-Roles': 'staff',
        'X-User-Permissions': 'employee.view.own_record',
        'X-Branch-Access': '507f1f77bcf86cd799439011',
      };

      const [financeResponse, rbacResponse] = await Promise.all([
        request(app).get('/api/v1/payments').set(headers),
        request(app).get('/api/v1/roles').set(headers),
      ]);

      expect(financeResponse.status).toBe(403);
      expect(rbacResponse.status).toBe(403);
    });
  });

  describe('Dynamic Role Resolution (RoleService)', () => {
    it('contains all 13 defined core default roles in matrix', () => {
      expect(DEFAULT_CORE_ROLES.length).toBe(13);
      const codes = DEFAULT_CORE_ROLES.map((r) => r.code);
      expect(codes).toEqual([
        'super_admin',
        'director',
        'branch_manager',
        'administrator',
        'academic_officer',
        'teacher',
        'finance_officer',
        'student_affairs_officer',
        'hr_officer',
        'librarian',
        'inventory_officer',
        'staff',
        'department_head',
      ]);
      const catalog = new Set(ALL_PERMISSION_CODES);
      for (const role of DEFAULT_CORE_ROLES) {
        expect(
          role.permissions.filter((permission) => permission !== '*' && !catalog.has(permission)),
        ).toEqual([]);
      }

      const director = DEFAULT_CORE_ROLES.find((role) => role.code === 'director');
      expect(director?.permissions).not.toContain('score.edit.all_branches');
      expect(director?.permissions).not.toContain('payment.delete.all_branches');
      expect(director?.permissions).not.toContain('role.edit.all_branches');

      const teacher = DEFAULT_CORE_ROLES.find((role) => role.code === 'teacher');
      expect(teacher?.permissions).toContain('class.view.assigned_class');
      expect(teacher?.permissions).toContain('score.edit.assigned_subject');
      expect(teacher?.permissions.some((permission) => permission.startsWith('payment.'))).toBe(
        false,
      );

      const staff = DEFAULT_CORE_ROLES.find((role) => role.code === 'staff');
      expect(staff?.permissions).toContain('employee.view.own_record');
      expect(staff?.permissions.some((permission) => permission.startsWith('role.'))).toBe(false);
    });

    it('resolves core roles properly', async () => {
      const roleService = new RoleService();

      const mockRoleDoc = {
        code: 'administrator',
        permissions: ['student.view.own_branch', 'student.create.own_branch'],
      };
      vi.mocked(RoleModel.find).mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockRoleDoc]),
      } as never);

      const permissions = await roleService.resolvePermissionsForRoles(['administrator']);
      expect(permissions).toContain('student.view.own_branch');
      expect(permissions).toContain('student.create.own_branch');
    });

    it('returns wildcard only when the persisted super_admin role explicitly contains it', async () => {
      const roleService = new RoleService();
      vi.mocked(RoleModel.find).mockReturnValue({
        exec: vi.fn().mockResolvedValue([
          {
            code: 'super_admin',
            permissions: ['*'],
            status: 'active',
            isDeleted: false,
          },
        ]),
      } as never);
      const permissions = await roleService.resolvePermissionsForRoles(['super_admin']);
      expect(permissions).toEqual(['*']);
    });

    it('records security audit log when custom role is created', async () => {
      const roleService = new RoleService();
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(RoleModel.create).mockResolvedValue({
        _id: '507f1f77bcf86cd799439099',
        code: 'custom_role',
        nameEn: 'Custom Role',
        permissions: ['student.view.own_branch'],
        status: 'active',
      } as never);

      const creator: AuthUser = {
        userId: 'admin-1',
        username: 'admin',
        email: 'admin@snp.edu.kh',
        schoolId: 'school-1',
        roles: ['super_admin'],
        permissions: ['*'],
        branchAccess: 'all',
      };

      await roleService.createRole(
        {
          code: 'custom_role',
          nameEn: 'Custom Role',
          permissions: ['student.view.own_branch'],
          status: 'active',
        },
        creator,
      );

      expect(AuditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          module: 'role',
          action: 'CREATE',
          entityType: 'Role',
        }),
      );
    });
  });
  it('inherits the final scope of nested finance actions', () => {
    expect(
      checkUserPermission(
        ['finance.payment.create.all_branches'],
        'finance.payment.create.own_branch',
      ),
    ).toBe(true);
    expect(
      checkUserPermission(
        ['finance.payment.create.own_branch'],
        'finance.payment.create.all_branches',
      ),
    ).toBe(false);
    expect(
      checkUserPermission(['finance.void.request.all_branches'], 'finance.void.approve.own_branch'),
    ).toBe(false);
    expect(
      checkUserPermission(
        ['finance.discount.apply.all_branches'],
        'finance.payment.create.own_branch',
      ),
    ).toBe(false);
  });
});
