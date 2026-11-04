import { Router } from 'express';

import { getHealth, getLiveness, getReadiness } from './health.controller';

export const healthRouter = Router();

healthRouter.get('/', getHealth);
healthRouter.get('/readiness', getReadiness);
healthRouter.get('/liveness', getLiveness);
