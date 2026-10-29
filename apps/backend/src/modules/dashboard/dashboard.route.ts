import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { DashboardController } from './dashboard.controller';
import {
  academicHonorRollQuerySchema,
  dashboardActionItemsQuerySchema,
  dashboardPulseQuerySchema,
} from './dashboard.validation';

export const dashboardRouter = Router();
const controller = new DashboardController();

dashboardRouter.use(authenticate, requireAuth);

dashboardRouter.get(
  '/action-items',
  validate(dashboardActionItemsQuerySchema),
  controller.getActionItems,
);

dashboardRouter.get(
  '/finance-pulse',
  authorize(
    'payment.view.own_branch',
    'payment.view.all_branches',
    'tuition.view.own_branch',
    'tuition.view.all_branches',
    'report.finance.view.own_branch',
    'report.finance.view.all_branches',
  ),
  validate(dashboardPulseQuerySchema),
  controller.getFinancePulse,
);

dashboardRouter.get(
  '/student-affairs-pulse',
  authorize(
    'student.view.own_branch',
    'student.view.all_branches',
    'registration.view.own_branch',
    'registration.view.all_branches',
  ),
  validate(dashboardPulseQuerySchema),
  controller.getStudentAffairsPulse,
);

dashboardRouter.get(
  '/hr-pulse',
  authorize(
    'employee.view.own_branch',
    'employee.view.all_branches',
    'department.view.own_branch',
    'department.view.all_branches',
  ),
  validate(dashboardPulseQuerySchema),
  controller.getHrPulse,
);

dashboardRouter.get(
  '/academic-honor-roll',
  authorize(
    'score.view.own_branch',
    'score.view.all_branches',
    'score.view.assigned_subject',
    'report.academic.view.own_branch',
    'report.academic.view.all_branches',
    'class.view.own_branch',
    'class.view.all_branches',
    'class.view.assigned_class',
  ),
  validate(academicHonorRollQuerySchema),
  controller.getAcademicHonorRoll,
);
