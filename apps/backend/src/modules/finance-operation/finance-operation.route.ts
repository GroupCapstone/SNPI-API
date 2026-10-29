import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { FinanceOperationController } from './finance-operation.controller';
import {
  approveCashierShiftSchema,
  closeCashierShiftSchema,
  createDiscountPolicySchema,
  financeOperationQuerySchema,
  openCashierShiftSchema,
} from './finance-operation.validation';

export const financeOperationRouter = Router();
const controller = new FinanceOperationController();
financeOperationRouter.use(authenticate, requireAuth);
financeOperationRouter.get(
  '/discount-policies',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'finance.discount.apply.own_branch',
    'finance.discount.apply.all_branches',
  ),
  validate(financeOperationQuerySchema),
  controller.policies,
);
financeOperationRouter.post(
  '/discount-policies',
  authorize('finance.discount.apply.own_branch', 'finance.discount.apply.all_branches'),
  validate(createDiscountPolicySchema),
  controller.createPolicy,
);
financeOperationRouter.get(
  '/cashier-shifts',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
    'finance.receipt.print.own_branch',
    'finance.receipt.print.all_branches',
  ),
  validate(financeOperationQuerySchema),
  controller.shifts,
);
financeOperationRouter.post(
  '/cashier-shifts/open',
  authorize(
    'payment.create.own_branch',
    'payment.create.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(openCashierShiftSchema),
  controller.openShift,
);
financeOperationRouter.post(
  '/cashier-shifts/:id/close',
  authorize(
    'payment.create.own_branch',
    'payment.create.all_branches',
    'finance.payment.create.own_branch',
    'finance.payment.create.all_branches',
  ),
  validate(closeCashierShiftSchema),
  controller.closeShift,
);
financeOperationRouter.post(
  '/cashier-shifts/:id/approve',
  authorize(
    'finance.discount.apply.own_branch',
    'finance.discount.apply.all_branches',
    'approval.approve.own_branch',
    'approval.approve.all_branches',
  ),
  validate(approveCashierShiftSchema),
  controller.approveShift,
);
