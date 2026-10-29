import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { requirePermission } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AcademicRuleController } from './academic-rule.controller';
import {
  createAcademicRuleSchema,
  newRuleVersionSchema,
  queryAcademicRulesSchema,
  resolveAcademicRuleSchema,
  updateAcademicRuleSchema,
} from './academic-rule.validation';

const router = Router();
const controller = new AcademicRuleController();

router.use(authenticate);

router.get(
  '/',
  requirePermission('academic_rule.view.own_branch', 'academic_rule.view.all_branches'),
  validate(queryAcademicRulesSchema),
  controller.getRules,
);

router.get(
  '/resolve',
  requirePermission('academic_rule.view.own_branch', 'academic_rule.view.all_branches'),
  validate(resolveAcademicRuleSchema),
  controller.resolveActiveRule,
);

router.get(
  '/:id',
  requirePermission('academic_rule.view.own_branch', 'academic_rule.view.all_branches'),
  controller.getRuleById,
);

router.post(
  '/',
  requirePermission('academic_rule.manage.own_branch', 'academic_rule.manage.all_branches'),
  validate(createAcademicRuleSchema),
  controller.createRule,
);

router.post(
  '/:id/version',
  requirePermission('academic_rule.manage.own_branch', 'academic_rule.manage.all_branches'),
  validate(newRuleVersionSchema),
  controller.createNewVersion,
);

router.patch(
  '/:id',
  requirePermission('academic_rule.manage.own_branch', 'academic_rule.manage.all_branches'),
  validate(updateAcademicRuleSchema),
  controller.updateRule,
);

export const academicRuleRouter = router;
