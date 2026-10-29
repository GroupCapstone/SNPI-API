import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ScoreController } from './score.controller';
import { batchScoreEntrySchema, queryScoreSchema } from './score.validation';

export const scoreRouter = Router();
const controller = new ScoreController();

scoreRouter.use(authenticate);
scoreRouter.use(requireAuth);

scoreRouter.get(
  '/',
  authorize('score.view.assigned_subject', 'score.view.own_branch', 'score.view.all_branches'),
  validate(queryScoreSchema),
  controller.getScores,
);

scoreRouter.post(
  '/batch',
  authorize(
    'score.create.assigned_subject',
    'score.create.own_branch',
    'score.create.all_branches',
  ),
  validate(batchScoreEntrySchema),
  controller.batchRecordScores,
);
