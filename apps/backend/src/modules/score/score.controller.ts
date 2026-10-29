import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ScoreService } from './score.service';
import type { BatchScoreEntryDto, ScoreQueryFilters } from './score.types';

import type { queryScoreSchema, batchScoreEntrySchema } from './score.validation';

export class ScoreController {
  public constructor(private readonly service = new ScoreService()) {}

  public getScores = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryScoreSchema>>(response)
        .query as unknown as ScoreQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 50);

      const result = await this.service.getScores(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Scores retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public batchRecordScores = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof batchScoreEntrySchema>>(response)
        .body as BatchScoreEntryDto;
      const scores = await this.service.batchRecordScores(dto, request.user!);
      sendSuccess(response, scores, 'Student scores recorded successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
