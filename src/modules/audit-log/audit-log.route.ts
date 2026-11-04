import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AuditLogController } from './audit-log.controller';
import { queryAuditLogSchema } from './audit-log.validation';

const auditLogRouter = Router();
const controller = new AuditLogController();

auditLogRouter.use(authenticate);
auditLogRouter.use(requireAuth);

auditLogRouter.get(
  '/',
  authorize('audit.view.own_branch', 'audit.view.all_branches'),
  validate(queryAuditLogSchema),
  controller.getAuditLogs,
);

export { auditLogRouter };
