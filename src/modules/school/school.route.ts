import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { SchoolController } from './school.controller';
import { createSchoolSchema, querySchoolSchema, updateSchoolSchema } from './school.validation';

export const schoolRouter = Router();
const controller = new SchoolController();

schoolRouter.use(authenticate);
schoolRouter.use(requireAuth);

schoolRouter.get(
  '/',
  authorize('school.view.all_branches'),
  validate(querySchoolSchema),
  controller.getSchools,
);

schoolRouter.get('/:id', authorize('school.view.all_branches'), controller.getSchoolById);

schoolRouter.post(
  '/',
  authorize('school.create.all_branches'),
  validate(createSchoolSchema),
  controller.createSchool,
);

schoolRouter.patch(
  '/:id',
  authorize('school.edit.all_branches'),
  validate(updateSchoolSchema),
  controller.updateSchool,
);

schoolRouter.delete('/:id', authorize('school.delete.all_branches'), controller.deleteSchool);
