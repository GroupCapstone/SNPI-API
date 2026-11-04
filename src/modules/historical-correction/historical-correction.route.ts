import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { requirePermission } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { HistoricalCorrectionController } from './historical-correction.controller';
import {
  applyCorrectionSchema,
  queryHistoricalCorrectionsSchema,
  requestCorrectionSchema,
  reviewCorrectionSchema,
} from './historical-correction.validation';

const router = Router();
const controller = new HistoricalCorrectionController();

router.use(authenticate);

router.get(
  '/',
  requirePermission(
    'historical_correction.view.own_branch',
    'historical_correction.view.all_branches',
  ),
  validate(queryHistoricalCorrectionsSchema),
  controller.getCorrections,
);

router.get(
  '/:id',
  requirePermission(
    'historical_correction.view.own_branch',
    'historical_correction.view.all_branches',
  ),
  controller.getCorrectionById,
);

router.post(
  '/',
  requirePermission(
    'historical_correction.request.own_branch',
    'historical_correction.request.all_branches',
  ),
  validate(requestCorrectionSchema),
  controller.requestCorrection,
);

router.post(
  '/:id/review',
  requirePermission(
    'historical_correction.review.own_branch',
    'historical_correction.review.all_branches',
  ),
  validate(reviewCorrectionSchema),
  controller.reviewCorrection,
);

router.post(
  '/:id/apply',
  requirePermission(
    'historical_correction.apply.own_branch',
    'historical_correction.apply.all_branches',
  ),
  validate(applyCorrectionSchema),
  controller.applyCorrection,
);

export const historicalCorrectionRouter = router;
