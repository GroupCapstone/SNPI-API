import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { StudyModeController } from './study-mode.controller';
import {
  createStudyModeRequestSchema,
  queryStudyModeRequestSchema,
  studyModeIdRequestSchema,
  updateStudyModeRequestSchema,
} from './study-mode.validation';

export const studyModeRouter = Router();
const controller = new StudyModeController();

studyModeRouter.use(authenticate);
studyModeRouter.use(requireAuth);

studyModeRouter.get(
  '/',
  authorize('study_mode.view.all_branches'),
  validate(queryStudyModeRequestSchema),
  controller.getStudyModes,
);

studyModeRouter.get(
  '/:id',
  authorize('study_mode.view.all_branches'),
  validate(studyModeIdRequestSchema),
  controller.getStudyModeById,
);

studyModeRouter.post(
  '/',
  authorize('study_mode.create.all_branches'),
  validate(createStudyModeRequestSchema),
  controller.createStudyMode,
);

studyModeRouter.put(
  '/:id',
  authorize('study_mode.edit.all_branches'),
  validate(updateStudyModeRequestSchema),
  controller.updateStudyMode,
);

studyModeRouter.delete(
  '/:id',
  authorize('study_mode.delete.all_branches'),
  validate(studyModeIdRequestSchema),
  controller.deleteStudyMode,
);
