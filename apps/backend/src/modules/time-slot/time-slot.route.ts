import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { TimeSlotController } from './time-slot.controller';
import {
  createTimeSlotRequestSchema,
  queryTimeSlotRequestSchema,
  timeSlotIdRequestSchema,
  updateTimeSlotRequestSchema,
} from './time-slot.validation';

export const timeSlotRouter = Router();
const controller = new TimeSlotController();

timeSlotRouter.use(authenticate);
timeSlotRouter.use(requireAuth);

timeSlotRouter.get(
  '/',
  authorize('class.view.own_branch', 'class.view.all_branches'),
  validate(queryTimeSlotRequestSchema),
  controller.getTimeSlots,
);

timeSlotRouter.get(
  '/:id',
  authorize('class.view.own_branch', 'class.view.all_branches'),
  validate(timeSlotIdRequestSchema),
  controller.getTimeSlotById,
);

timeSlotRouter.post(
  '/',
  authorize('class.create.own_branch', 'class.create.all_branches'),
  validate(createTimeSlotRequestSchema),
  controller.createTimeSlot,
);

timeSlotRouter.put(
  '/:id',
  authorize('class.edit.own_branch', 'class.edit.all_branches'),
  validate(updateTimeSlotRequestSchema),
  controller.updateTimeSlot,
);

timeSlotRouter.delete(
  '/:id',
  authorize('class.delete.own_branch', 'class.delete.all_branches'),
  validate(timeSlotIdRequestSchema),
  controller.deleteTimeSlot,
);
