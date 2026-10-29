import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { LevelController } from './level.controller';
import { createLevelSchema, queryLevelSchema, updateLevelSchema } from './level.validation';

const router = Router();
const controller = new LevelController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize('level.view.own_branch', 'level.view.all_branches'),
  validate(queryLevelSchema),
  controller.getLevels,
);

router.get(
  '/:id',
  authorize('level.view.own_branch', 'level.view.all_branches'),
  controller.getLevelById,
);

router.post(
  '/',
  authorize('level.create.all_branches'),
  validate(createLevelSchema),
  controller.createLevel,
);

router.patch(
  '/:id',
  authorize('level.edit.all_branches'),
  validate(updateLevelSchema),
  controller.updateLevel,
);

router.delete('/:id', authorize('level.delete.all_branches'), controller.deleteLevel);

export const levelRouter = router;
