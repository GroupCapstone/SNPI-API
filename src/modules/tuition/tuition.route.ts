import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { TuitionController } from './tuition.controller';
import {
  createTuitionFeeSchema,
  queryTuitionFeeSchema,
  updateTuitionFeeSchema,
} from './tuition.validation';

export const tuitionRouter = Router();
const controller = new TuitionController();

tuitionRouter.use(authenticate);
tuitionRouter.use(requireAuth);

tuitionRouter.get(
  '/',
  authorize(
    'tuition.view.own_branch',
    'tuition.view.all_branches',
    'finance.fee_structure.manage.own_branch',
    'finance.fee_structure.manage.all_branches',
  ),
  validate(queryTuitionFeeSchema),
  controller.getTuitionFees,
);

tuitionRouter.get(
  '/:id',
  authorize(
    'tuition.view.own_branch',
    'tuition.view.all_branches',
    'finance.fee_structure.manage.own_branch',
    'finance.fee_structure.manage.all_branches',
  ),
  controller.getTuitionFeeById,
);

tuitionRouter.post(
  '/',
  authorize(
    'tuition.create.own_branch',
    'tuition.create.all_branches',
    'finance.fee_structure.manage.own_branch',
    'finance.fee_structure.manage.all_branches',
  ),
  validate(createTuitionFeeSchema),
  controller.createTuitionFee,
);

tuitionRouter.patch(
  '/:id',
  authorize(
    'tuition.edit.own_branch',
    'tuition.edit.all_branches',
    'finance.fee_structure.manage.own_branch',
    'finance.fee_structure.manage.all_branches',
  ),
  validate(updateTuitionFeeSchema),
  controller.updateTuitionFee,
);

tuitionRouter.delete(
  '/:id',
  authorize(
    'tuition.delete.own_branch',
    'tuition.delete.all_branches',
    'finance.fee_structure.manage.own_branch',
    'finance.fee_structure.manage.all_branches',
  ),
  controller.deleteTuitionFee,
);
