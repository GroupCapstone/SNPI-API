import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { requirePermission } from '../../middleware/authorize';
import { SkillController } from './skill.controller';

const router = Router();
const controller = new SkillController();

router.use(authenticate);

// Skill Gap Analytics (defined before parameterized routes)
router.get(
  '/gap-analysis',
  requirePermission('skill_gap.view.own_branch'),
  controller.getConsolidatedSkillGapReport,
);

router.get(
  '/gap-analysis/employee/:employeeId',
  requirePermission('skill_gap.view.own_record'),
  controller.analyzeEmployeeSkillGap,
);

// Role Skill Requirements
router.get(
  '/role-requirements/:roleId',
  requirePermission('role_skill.view.all_branches'),
  controller.getRoleRequirementsByRole,
);

router.post(
  '/role-requirements/:roleId/batch',
  requirePermission('role_skill.edit.all_branches'),
  controller.batchConfigureRoleRequirements,
);

router.post(
  '/role-requirements',
  requirePermission('role_skill.edit.all_branches'),
  controller.addRoleRequirement,
);

router.delete(
  '/role-requirements/:id',
  requirePermission('role_skill.edit.all_branches'),
  controller.deleteRoleRequirement,
);

// Employee Skills
router.get(
  '/employee-skills',
  requirePermission('employee_skill.view.own_branch'),
  controller.getEmployeeSkills,
);

router.get(
  '/employee-skills/employee/:employeeId',
  requirePermission('employee_skill.view.own_record'),
  controller.getEmployeeSkillsByEmployee,
);

router.post(
  '/employee-skills',
  requirePermission('employee_skill.create.own_branch'),
  controller.addEmployeeSkill,
);

router.patch(
  '/employee-skills/:id',
  requirePermission('employee_skill.edit.own_branch'),
  controller.updateEmployeeSkill,
);

router.patch(
  '/employee-skills/:id/verify',
  requirePermission('employee_skill.verify.own_branch'),
  controller.verifyEmployeeSkill,
);

router.delete(
  '/employee-skills/:id',
  requirePermission('employee_skill.delete.own_branch'),
  controller.deleteEmployeeSkill,
);

// Skills Catalog
router.get('/', requirePermission('skill.view.own_branch'), controller.getSkills);

router.get('/:id', requirePermission('skill.view.own_branch'), controller.getSkillById);

router.post('/', requirePermission('skill.create.all_branches'), controller.createSkill);

router.patch('/:id', requirePermission('skill.edit.all_branches'), controller.updateSkill);

router.delete('/:id', requirePermission('skill.delete.all_branches'), controller.deleteSkill);

export { router as skillRouter };
