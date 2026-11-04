import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { DepartmentController } from './department.controller';
import {
  createDepartmentSchema,
  queryDepartmentSchema,
  updateDepartmentSchema,
} from './department.validation';

export const departmentRouter = Router();
const controller = new DepartmentController();

departmentRouter.use(authenticate);
departmentRouter.use(requireAuth);

departmentRouter.get(
  '/',
  authorize(
    'department.view.own_department',
    'department.view.own_branch',
    'department.view.all_branches',
  ),
  validate(queryDepartmentSchema),
  controller.getDepartments,
);

departmentRouter.get(
  '/:id',
  authorize(
    'department.view.own_department',
    'department.view.own_branch',
    'department.view.all_branches',
  ),
  controller.getDepartmentById,
);

departmentRouter.post(
  '/',
  authorize('department.create.own_branch', 'department.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createDepartmentSchema),
  controller.createDepartment,
);

departmentRouter.patch(
  '/:id',
  authorize('department.edit.own_branch', 'department.edit.all_branches'),
  validate(updateDepartmentSchema),
  controller.updateDepartment,
);

departmentRouter.delete(
  '/:id',
  authorize('department.delete.own_branch', 'department.delete.all_branches'),
  controller.deleteDepartment,
);
