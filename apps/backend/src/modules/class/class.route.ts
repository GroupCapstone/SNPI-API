import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ClassController } from './class.controller';
import {
  classIdRequestSchema,
  createClassSchema,
  queryClassSchema,
  queryClassSummarySchema,
  updateClassSchema,
} from './class.validation';

const router = Router();
const controller = new ClassController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize('class.view.assigned_class', 'class.view.own_branch', 'class.view.all_branches'),
  validate(queryClassSchema),
  controller.getClasses,
);

router.get(
  '/summary',
  authorize('class.view.assigned_class', 'class.view.own_branch', 'class.view.all_branches'),
  validate(queryClassSummarySchema),
  controller.getClassSummary,
);

router.get(
  '/:id',
  authorize('class.view.assigned_class', 'class.view.own_branch', 'class.view.all_branches'),
  validate(classIdRequestSchema),
  controller.getClassById,
);

router.post(
  '/',
  authorize('class.create.own_branch', 'class.create.all_branches'),
  validate(createClassSchema),
  controller.createClass,
);

router.patch(
  '/:id',
  authorize('class.edit.own_branch', 'class.edit.all_branches'),
  validate(updateClassSchema),
  controller.updateClass,
);

router.delete(
  '/:id',
  authorize('class.delete.own_branch', 'class.delete.all_branches'),
  validate(classIdRequestSchema),
  controller.deleteClass,
);

export const classRouter = router;
