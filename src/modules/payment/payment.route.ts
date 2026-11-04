import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { PaymentController } from './payment.controller';
import {
  createPaymentSchema,
  debtAgingQuerySchema,
  monthlyFinanceSummarySchema,
  queryPaymentSchema,
  updatePaymentSchema,
  voidPaymentSchema,
  generateMonthlyInvoicesSchema,
} from './payment.validation';

export const paymentRouter = Router();
const controller = new PaymentController();

paymentRouter.use(authenticate);
paymentRouter.use(requireAuth);

paymentRouter.get(
  '/',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(queryPaymentSchema),
  controller.getPayments,
);

paymentRouter.get(
  '/monthly-summary',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(monthlyFinanceSummarySchema),
  controller.getMonthlySummary,
);

paymentRouter.get(
  '/debt-aging',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(debtAgingQuerySchema),
  controller.getDebtAging,
);

paymentRouter.post(
  '/monthly-invoices/generate',
  authorize(
    'payment.create.own_branch',
    'payment.create.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(generateMonthlyInvoicesSchema),
  controller.generateMonthlyInvoices,
);

paymentRouter.get(
  '/:id',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  controller.getPaymentById,
);

paymentRouter.post(
  '/',
  authorize(
    'payment.create.own_branch',
    'payment.create.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(createPaymentSchema),
  controller.createPayment,
);

paymentRouter.patch(
  '/:id',
  authorize('payment.edit.own_branch', 'payment.edit.all_branches'),
  validate(updatePaymentSchema),
  controller.updatePayment,
);

paymentRouter.post(
  '/:id/void',
  authorize(
    'payment.void.own_branch',
    'payment.void.all_branches',
    'finance.void.request.own_branch',
    'finance.void.request.all_branches',
  ),
  validate(voidPaymentSchema),
  controller.voidPayment,
);

paymentRouter.delete(
  '/:id',
  authorize('payment.delete.own_branch', 'payment.delete.all_branches'),
  controller.deletePayment,
);
