import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { ClassroomController } from './classroom.controller';

const router = Router();
const controller = new ClassroomController();

router.use(authenticate);
router.use(requireAuth);
router.get(
  '/',
  authorize('classroom.view.own_branch', 'classroom.view.all_branches'),
  controller.getClassrooms,
);

export const classroomRouter = router;
