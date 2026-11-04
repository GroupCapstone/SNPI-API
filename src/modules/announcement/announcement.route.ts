import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AnnouncementController } from './announcement.controller';
import {
  createAnnouncementValidationSchema,
  queryAnnouncementValidationSchema,
  updateAnnouncementValidationSchema,
} from './announcement.validation';

const router = Router();
const controller = new AnnouncementController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize('announcement.view.own_branch', 'announcement.view.all_branches'),
  validate(queryAnnouncementValidationSchema),
  controller.getAnnouncements,
);

router.get(
  '/:id',
  authorize('announcement.view.own_branch', 'announcement.view.all_branches'),
  controller.getAnnouncementById,
);

router.post(
  '/',
  authorize('announcement.create.own_branch', 'announcement.create.all_branches'),
  validate(createAnnouncementValidationSchema),
  controller.createAnnouncement,
);

router.patch(
  '/:id',
  authorize('announcement.edit.own_branch', 'announcement.edit.all_branches'),
  validate(updateAnnouncementValidationSchema),
  controller.updateAnnouncement,
);

router.delete(
  '/:id',
  authorize('announcement.delete.own_branch', 'announcement.delete.all_branches'),
  controller.deleteAnnouncement,
);

export const announcementRouter = router;
