import { Types } from 'mongoose';
import { describe, expect, it } from 'vitest';

import { resolveEffectiveScope } from '../src/middleware/authorize';
import { ForbiddenError } from '../src/shared/errors/app-error';
import type { AuthUser } from '../src/types/auth';
import { assertTenantAccess, buildTenantScopeFilter } from '../src/utils/scoped-filter';

describe('Hybrid Scoped RBAC + Contextual ABAC Engine', () => {
  const schoolId = '507f1f77bcf86cd799439011';
  const branch1Id = '507f1f77bcf86cd799439012';
  const branch2Id = '507f1f77bcf86cd799439013';
  const class1Id = '507f1f77bcf86cd799439014';
  const class2Id = '507f1f77bcf86cd799439015';
  const userId = '507f1f77bcf86cd799439016';
  const otherUserId = '507f1f77bcf86cd799439017';

  const superAdminUser: AuthUser = {
    userId,
    username: 'superadmin',
    email: 'superadmin@snp.edu.kh',
    schoolId,
    roles: ['super_admin'],
    permissions: ['*'],
    branchAccess: 'all',
    isSuperAdmin: true,
  };

  const branchPrincipalUser: AuthUser = {
    userId,
    username: 'principal',
    email: 'principal@snp.edu.kh',
    schoolId,
    roles: ['principal'],
    permissions: ['student.view.own_branch', 'student.edit.own_branch'],
    branchAccess: [branch1Id],
    defaultBranch: branch1Id,
  };

  const teacherUser: AuthUser = {
    userId,
    username: 'teacher',
    email: 'teacher@snp.edu.kh',
    schoolId,
    roles: ['teacher'],
    permissions: ['student.view.assigned_class', 'grade.edit.assigned_class'],
    branchAccess: [branch1Id],
    assignedClasses: [class1Id],
  };

  const studentUser: AuthUser = {
    userId,
    username: 'student',
    email: 'student@snp.edu.kh',
    schoolId,
    roles: ['student'],
    permissions: ['student.view.own_record'],
    branchAccess: [branch1Id],
  };

  describe('resolveEffectiveScope', () => {
    it('should resolve all_branches for super admin with wildcard permission', () => {
      const scope = resolveEffectiveScope(superAdminUser.permissions, 'student', 'view');
      expect(scope).toBe('all_branches');
    });

    it('should resolve own_branch for principal with own_branch permission', () => {
      const scope = resolveEffectiveScope(branchPrincipalUser.permissions, 'student', 'view');
      expect(scope).toBe('own_branch');
    });

    it('should resolve assigned_class for teacher', () => {
      const scope = resolveEffectiveScope(teacherUser.permissions, 'student', 'view');
      expect(scope).toBe('assigned_class');
    });

    it('should resolve own_record for student', () => {
      const scope = resolveEffectiveScope(studentUser.permissions, 'student', 'view');
      expect(scope).toBe('own_record');
    });

    it('should return null when user lacks permission for module', () => {
      const scope = resolveEffectiveScope(studentUser.permissions, 'payroll', 'view');
      expect(scope).toBeNull();
    });
  });

  describe('buildTenantScopeFilter', () => {
    it('should allow Super Admin to query all branches or target a specific branch', () => {
      const allFilter = buildTenantScopeFilter(superAdminUser);
      expect(allFilter.schoolId).toEqual(new Types.ObjectId(schoolId));
      expect(allFilter.branchId).toBeUndefined();

      const targetFilter = buildTenantScopeFilter(superAdminUser, { targetBranchId: branch2Id });
      expect(targetFilter.branchId).toEqual(new Types.ObjectId(branch2Id));
    });

    it('should restrict Branch Principal to authorized branches', () => {
      const filter = buildTenantScopeFilter(branchPrincipalUser);
      expect(filter.schoolId).toEqual(new Types.ObjectId(schoolId));
      expect(filter.branchId).toEqual({ $in: [new Types.ObjectId(branch1Id)] });
    });

    it('should throw ForbiddenError when Branch Principal targets an unauthorized branch', () => {
      expect(() => {
        buildTenantScopeFilter(branchPrincipalUser, { targetBranchId: branch2Id });
      }).toThrowError(ForbiddenError);
    });

    it('should restrict Teacher to assigned classes', () => {
      const filter = buildTenantScopeFilter(teacherUser, { scope: 'assigned_class' });
      expect(filter.schoolId).toEqual(new Types.ObjectId(schoolId));
      expect(filter.branchId).toEqual({ $in: [new Types.ObjectId(branch1Id)] });
      expect(filter.classId).toEqual({ $in: [new Types.ObjectId(class1Id)] });
    });

    it('should throw ForbiddenError when Teacher attempts to query unassigned class', () => {
      expect(() => {
        buildTenantScopeFilter(teacherUser, {
          scope: 'assigned_class',
          targetClassId: class2Id,
        });
      }).toThrowError(ForbiddenError);
    });

    it('should restrict Student to own record', () => {
      const filter = buildTenantScopeFilter(studentUser, { scope: 'own_record' });
      expect(filter.schoolId).toEqual(new Types.ObjectId(schoolId));
      expect(filter.userId).toEqual(new Types.ObjectId(userId));
    });
  });

  describe('assertTenantAccess (BOLA / IDOR Defense)', () => {
    it('should allow Super Admin to access any resource', () => {
      expect(() => {
        assertTenantAccess(superAdminUser, {
          schoolId,
          branchId: branch2Id,
          classId: class2Id,
        });
      }).not.toThrow();
    });

    it('should block cross-school access for ordinary users', () => {
      expect(() => {
        assertTenantAccess(branchPrincipalUser, {
          schoolId: '507f1f77bcf86cd799439099', // Different school
          branchId: branch1Id,
        });
      }).toThrowError(ForbiddenError);
    });

    it('should block cross-branch access for branch-scoped users', () => {
      expect(() => {
        assertTenantAccess(branchPrincipalUser, {
          schoolId,
          branchId: branch2Id, // Unauthorized branch
        });
      }).toThrowError(ForbiddenError);
    });

    it('should block cross-class access for teachers under assigned_class scope', () => {
      expect(() => {
        assertTenantAccess(
          teacherUser,
          { schoolId, branchId: branch1Id, classId: class2Id },
          { scope: 'assigned_class' },
        );
      }).toThrowError(ForbiddenError);
    });

    it('should block cross-user access under own_record scope', () => {
      expect(() => {
        assertTenantAccess(
          studentUser,
          { schoolId, branchId: branch1Id, userId: otherUserId },
          { scope: 'own_record' },
        );
      }).toThrowError(ForbiddenError);
    });
  });
});
