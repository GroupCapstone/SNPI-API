import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { CurriculumController } from './curriculum.controller';
import {
  createCurriculumSchema,
  queryCurriculumSchema,
  updateCurriculumSchema,
} from './curriculum.validation';

const curriculumRouter = Router();
const controller = new CurriculumController();

curriculumRouter.use(authenticate);
curriculumRouter.use(requireAuth);

curriculumRouter.get(
  '/',
  authorize('curriculum.view.own_branch', 'curriculum.view.all_branches'),
  validate(queryCurriculumSchema),
  controller.getCurricula,
);

curriculumRouter.get(
  '/:id',
  authorize('curriculum.view.own_branch', 'curriculum.view.all_branches'),
  controller.getCurriculumById,
);

curriculumRouter.post(
  '/',
  authorize('curriculum.create.own_branch', 'curriculum.create.all_branches'),
  validate(createCurriculumSchema),
  controller.createCurriculum,
);

curriculumRouter.patch(
  '/:id',
  authorize('curriculum.edit.own_branch', 'curriculum.edit.all_branches'),
  validate(updateCurriculumSchema),
  controller.updateCurriculum,
);

curriculumRouter.delete(
  '/:id',
  authorize('curriculum.delete.own_branch', 'curriculum.delete.all_branches'),
  controller.deleteCurriculum,
);

export { curriculumRouter };
