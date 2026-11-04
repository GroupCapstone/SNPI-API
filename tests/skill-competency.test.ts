import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AuditLogService } from '../src/modules/audit-log/audit-log.service';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { RoleModel } from '../src/modules/role/role.model';
import {
  EmployeeSkillModel,
  RoleSkillRequirementModel,
  SkillModel,
} from '../src/modules/skill/skill.model';
import { SkillService } from '../src/modules/skill/skill.service';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/skill/skill.model', () => ({
  SkillModel: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    countDocuments: vi.fn(),
  },
  RoleSkillRequirementModel: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    countDocuments: vi.fn(),
  },
  EmployeeSkillModel: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/role/role.model', () => ({
  RoleModel: {
    find: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/employee/employee.model', () => ({
  EmployeeModel: {
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

describe('Skill & Competency Management Module Tests', () => {
  const app = createApp();

  const superAdminUser: AuthUser = {
    userId: '507f1f77bcf86cd799439001',
    username: 'admin',
    email: 'admin@snp.edu.kh',
    schoolId: '507f1f77bcf86cd799439010',
    roles: ['super_admin'],
    permissions: ['*'],
    branchAccess: 'all',
  };

  const hrOfficerUser: AuthUser = {
    userId: '507f1f77bcf86cd799439002',
    username: 'hr.officer',
    email: 'hr@snp.edu.kh',
    schoolId: '507f1f77bcf86cd799439010',
    roles: ['hr_officer'],
    permissions: [
      'skill.view.all_branches',
      'skill.create.all_branches',
      'skill.edit.all_branches',
      'role_skill.view.all_branches',
      'role_skill.edit.all_branches',
      'employee_skill.view.own_branch',
      'employee_skill.create.own_branch',
      'employee_skill.edit.own_branch',
      'employee_skill.verify.own_branch',
      'employee_skill.delete.own_branch',
      'skill_gap.view.own_branch',
    ],
    branchAccess: ['507f1f77bcf86cd799439020'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Skill Catalog Service', () => {
    it('creates a new skill and creates audit log', async () => {
      const service = new SkillService();
      vi.mocked(SkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);

      vi.mocked(SkillModel.create).mockResolvedValue({
        _id: '507f1f77bcf86cd799439030',
        code: 'SKILL-PED-001',
        name: 'Teaching Methodology',
        category: 'pedagogy',
        isActive: true,
      } as never);

      const result = await service.createSkill(
        {
          code: 'skill-ped-001',
          name: 'Teaching Methodology',
          category: 'pedagogy',
        },
        superAdminUser,
      );

      expect(result.code).toBe('SKILL-PED-001');
      expect(AuditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          module: 'skill',
          action: 'CREATE',
        }),
      );
    });

    it('rejects duplicate skill code with ConflictError', async () => {
      const service = new SkillService();
      vi.mocked(SkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439030', code: 'SKILL-PED-001' }),
      } as never);

      await expect(
        service.createSkill(
          {
            code: 'SKILL-PED-001',
            name: 'Teaching Methodology',
            category: 'pedagogy',
          },
          superAdminUser,
        ),
      ).rejects.toThrow(/already exists/i);
    });

    it('blocks skill deletion if active role requirements depend on it', async () => {
      const service = new SkillService();
      vi.mocked(SkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439030',
          code: 'SKILL-PED-001',
          name: 'Teaching Methodology',
        }),
      } as never);

      vi.mocked(RoleSkillRequirementModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(2),
      } as never);

      await expect(service.deleteSkill('507f1f77bcf86cd799439030', superAdminUser)).rejects.toThrow(
        /cannot delete skill.*required by 2 role/i,
      );
    });
  });

  describe('Role Skill Requirements Configuration', () => {
    it('assigns required skills to a role with target proficiency level', async () => {
      const service = new SkillService();

      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439040',
          code: 'teacher',
          nameEn: 'Teacher',
        }),
      } as never);

      vi.mocked(SkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439030',
          code: 'SKILL-PED-001',
          name: 'Teaching Methodology',
        }),
      } as never);

      vi.mocked(RoleSkillRequirementModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(RoleSkillRequirementModel.create).mockResolvedValue({
        _id: '507f1f77bcf86cd799439050',
        roleId: '507f1f77bcf86cd799439040',
        skillId: '507f1f77bcf86cd799439030',
        requiredLevel: 4,
        isRequired: true,
      } as never);

      const result = await service.addRoleRequirement(
        {
          roleId: '507f1f77bcf86cd799439040',
          skillId: '507f1f77bcf86cd799439030',
          requiredLevel: 4,
        },
        superAdminUser,
      );

      expect(result.requiredLevel).toBe(4);
      expect(AuditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          module: 'role',
          action: 'CREATE',
        }),
      );
    });
  });

  describe('Employee Skills & Verification', () => {
    it('auto-verifies employee skill when added by HR Officer', async () => {
      const service = new SkillService();

      vi.mocked(EmployeeModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439060',
          employeeId: 'EMP-MB-001',
          firstName: 'Dara',
          lastName: 'Sok',
          branchId: '507f1f77bcf86cd799439020',
        }),
      } as never);

      vi.mocked(SkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439030',
          code: 'SKILL-PED-001',
          name: 'Teaching Methodology',
        }),
      } as never);

      vi.mocked(EmployeeSkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(EmployeeSkillModel.create).mockResolvedValue({
        _id: '507f1f77bcf86cd799439070',
        employeeId: '507f1f77bcf86cd799439060',
        skillId: '507f1f77bcf86cd799439030',
        proficiencyLevel: 4,
        status: 'verified',
      } as never);

      const result = await service.addEmployeeSkill(
        {
          employeeId: '507f1f77bcf86cd799439060',
          skillId: '507f1f77bcf86cd799439030',
          proficiencyLevel: 4,
        },
        hrOfficerUser,
      );

      expect(result.status).toBe('verified');
    });

    it('denies HR Officer from managing employee skills in unauthorized branch', async () => {
      const service = new SkillService();

      vi.mocked(EmployeeModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439060',
          employeeId: 'EMP-TK-001',
          firstName: 'Vannak',
          lastName: 'Chan',
          branchId: '507f1f77bcf86cd799439099', // Outside HR Officer's branch 507f1f77bcf86cd799439020
        }),
      } as never);

      vi.mocked(SkillModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439030',
          code: 'SKILL-PED-001',
          name: 'Teaching Methodology',
        }),
      } as never);

      await expect(
        service.addEmployeeSkill(
          {
            employeeId: '507f1f77bcf86cd799439060',
            skillId: '507f1f77bcf86cd799439030',
            proficiencyLevel: 4,
          },
          hrOfficerUser,
        ),
      ).rejects.toThrow(/access denied.*permission for this campus branch/i);
    });
  });

  describe('Skill Gap & Match Calculation Engine', () => {
    it('accurately calculates match percentage and identifies competency gaps', async () => {
      const service = new SkillService();

      vi.mocked(EmployeeModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439060',
          employeeId: 'EMP-MB-001',
          firstName: 'Dara',
          lastName: 'Sok',
          branchId: { _id: '507f1f77bcf86cd799439020', branchNameEn: 'Main Branch' },
          departmentId: { _id: '507f1f77bcf86cd799439021', nameEn: 'Primary Education' },
        }),
      } as never);

      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439040',
          code: 'teacher',
          nameEn: 'Teacher',
        }),
      } as never);

      // Requirements:
      // Teaching: 4, Classroom Management: 4, Communication: 4 (Total req sum = 12)
      const mockReqs = [
        {
          _id: 'req-1',
          skillId: {
            _id: 'skill-1',
            code: 'SKILL-PED-001',
            name: 'Teaching',
            category: 'pedagogy',
            isDeleted: false,
          },
          requiredLevel: 4,
          isRequired: true,
        },
        {
          _id: 'req-2',
          skillId: {
            _id: 'skill-2',
            code: 'SKILL-PED-002',
            name: 'Classroom Management',
            category: 'pedagogy',
            isDeleted: false,
          },
          requiredLevel: 4,
          isRequired: true,
        },
        {
          _id: 'req-3',
          skillId: {
            _id: 'skill-3',
            code: 'SKILL-COM-001',
            name: 'Communication',
            category: 'communication',
            isDeleted: false,
          },
          requiredLevel: 4,
          isRequired: true,
        },
      ];

      // Employee Skills:
      // Teaching: 4 (met, 4/4)
      // Classroom Management: 3 (gap of 1, 3/4)
      // Communication: missing (0/4)
      // Acquired sum = 4 + 3 + 0 = 7. Match % = (7 / 12) * 100 = 58%
      const mockEmpSkills = [
        {
          _id: 'es-1',
          skillId: {
            _id: 'skill-1',
            code: 'SKILL-PED-001',
            name: 'Teaching',
          },
          proficiencyLevel: 4,
          status: 'verified',
        },
        {
          _id: 'es-2',
          skillId: {
            _id: 'skill-2',
            code: 'SKILL-PED-002',
            name: 'Classroom Management',
          },
          proficiencyLevel: 3,
          status: 'verified',
        },
      ];

      vi.mocked(RoleSkillRequirementModel.find).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockReqs),
      } as never);

      vi.mocked(EmployeeSkillModel.find).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockEmpSkills),
      } as never);

      const analysis = await service.analyzeEmployeeSkillGap(
        '507f1f77bcf86cd799439060',
        '507f1f77bcf86cd799439040',
        superAdminUser,
      );

      expect(analysis.totalRequiredSkills).toBe(3);
      expect(analysis.totalAcquiredSkills).toBe(2);
      expect(analysis.totalGaps).toBe(2); // 1 gap + 1 missing
      expect(analysis.matchPercentage).toBe(58);

      const teachingSkill = analysis.skills.find((s) => s.skillCode === 'SKILL-PED-001');
      expect(teachingSkill?.status).toBe('met');

      const classMgmtSkill = analysis.skills.find((s) => s.skillCode === 'SKILL-PED-002');
      expect(classMgmtSkill?.status).toBe('gap');
      expect(classMgmtSkill?.gapSize).toBe(1);

      const commSkill = analysis.skills.find((s) => s.skillCode === 'SKILL-COM-001');
      expect(commSkill?.status).toBe('missing');
      expect(commSkill?.gapSize).toBe(4);
    });
  });

  describe('Skill HTTP Routes Security', () => {
    it('returns 403 when Staff attempts to create a skill definition', async () => {
      const response = await request(app)
        .post('/api/v1/skills')
        .send({
          code: 'SKILL-TEST-001',
          name: 'Test Skill',
          category: 'general',
        })
        .set('X-User-Id', 'staff-1')
        .set('X-User-Roles', 'staff')
        .set('X-User-Permissions', 'skill.view.own_branch')
        .set('X-Branch-Access', '507f1f77bcf86cd799439020');

      expect(response.status).toBe(403);
    });
  });
});
