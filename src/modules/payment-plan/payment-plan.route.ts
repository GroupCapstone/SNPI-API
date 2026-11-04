import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { PaymentPlanController } from './payment-plan.controller';
import {
  cancelPaymentPlanSchema,
  createPaymentPlanSchema,
  queryPaymentPlanSchema,
  payInstallmentSchema,
} from './payment-plan.validation';

export const paymentPlanRouter = Router();
const controller = new PaymentPlanController();
paymentPlanRouter.use(authenticate, requireAuth);

const viewPermissions = [
  'payment.view.own_branch',
  'payment.view.all_branches',
  'finance.payment.create.own_branch',
  'finance.payment.create.all_branches',
] as const;
const managePermissions = [
  'payment.create.own_branch',
  'payment.create.all_branches',
  'finance.payment.create.own_branch',
  'finance.payment.create.all_branches',
] as const;

paymentPlanRouter.get(
  '/',
  authorize(...viewPermissions),
  validate(queryPaymentPlanSchema),
  controller.list,
);
paymentPlanRouter.get('/:id', authorize(...viewPermissions), controller.getById);
paymentPlanRouter.post(
  '/',
  authorize(...managePermissions),
  validate(createPaymentPlanSchema),
  controller.create,
);
paymentPlanRouter.post(
  '/:id/installments/:sequence/pay',
  authorize(...managePermissions),
  validate(payInstallmentSchema),
  controller.payInstallment,
);
paymentPlanRouter.post(
  '/:id/cancel',
  authorize(
    'payment.void.own_branch',
    'payment.void.all_branches',
    'finance.void.request.own_branch',
    'finance.void.request.all_branches',
  ),
  validate(cancelPaymentPlanSchema),
  controller.cancel,
);
