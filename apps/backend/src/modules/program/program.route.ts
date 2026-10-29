import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ProgramController } from './program.controller';
import { createProgramSchema, queryProgramSchema, updateProgramSchema } from './program.validation';

const router = Router();
const controller = new ProgramController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize('program.view.own_branch', 'program.view.all_branches'),
  validate(queryProgramSchema),
  controller.getPrograms,
);

router.get(
  '/:id',
  authorize('program.view.own_branch', 'program.view.all_branches'),
  controller.getProgramById,
);

router.post(
  '/',
  authorize('program.create.all_branches'),
  validate(createProgramSchema),
  controller.createProgram,
);

router.patch(
  '/:id',
  authorize('program.edit.all_branches'),
  validate(updateProgramSchema),
  controller.updateProgram,
);

router.delete('/:id', authorize('program.delete.all_branches'), controller.deleteProgram);

export const programRouter = router;
