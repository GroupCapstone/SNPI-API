import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { SystemSettingController } from './system-setting.controller';
import {
  createSystemSettingValidationSchema,
  querySystemSettingValidationSchema,
  updateSystemSettingValidationSchema,
} from './system-setting.validation';

const systemSettingRouter = Router();
const controller = new SystemSettingController();

systemSettingRouter.use(authenticate);
systemSettingRouter.use(requireAuth);

systemSettingRouter.get(
  '/',
  authorize('setting.view.all_branches'),
  validate(querySystemSettingValidationSchema),
  controller.getSettings,
);

systemSettingRouter.get('/:id', authorize('setting.view.all_branches'), controller.getSettingById);

systemSettingRouter.post(
  '/',
  authorize('setting.edit.all_branches'),
  validate(createSystemSettingValidationSchema),
  controller.createSetting,
);

systemSettingRouter.patch(
  '/:id',
  authorize('setting.edit.all_branches'),
  validate(updateSystemSettingValidationSchema),
  controller.updateSetting,
);

systemSettingRouter.delete(
  '/:id',
  authorize('setting.edit.all_branches'),
  controller.deleteSetting,
);

export { systemSettingRouter };
