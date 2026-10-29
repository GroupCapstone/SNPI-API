import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { EmployeeController } from './employee.controller';
import {
  createEmployeeSchema,
  queryEmployeeSchema,
  updateEmployeeSchema,
} from './employee.validation';

const employeeRouter = Router();
const controller = new EmployeeController();

employeeRouter.use(authenticate);
employeeRouter.use(requireAuth);

employeeRouter.get(
  '/',
  authorize(
    'employee.view.own_department',
    'employee.view.own_branch',
    'employee.view.all_branches',
  ),
  validate(queryEmployeeSchema),
  controller.getEmployees,
);

employeeRouter.get(
  '/:id',
  authorize(
    'employee.view.own_record',
    'employee.view.own_department',
    'employee.view.own_branch',
    'employee.view.all_branches',
  ),
  controller.getEmployeeById,
);

employeeRouter.post(
  '/',
  authorize('employee.create.own_branch', 'employee.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createEmployeeSchema),
  controller.createEmployee,
);

employeeRouter.patch(
  '/:id',
  authorize('employee.edit.own_branch', 'employee.edit.all_branches'),
  validate(updateEmployeeSchema),
  controller.updateEmployee,
);

employeeRouter.delete(
  '/:id',
  authorize('employee.delete.own_branch', 'employee.delete.all_branches'),
  controller.deleteEmployee,
);

export { employeeRouter };
