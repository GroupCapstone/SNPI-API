import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest, AuthUser } from '../../types/auth';
import { AcademicRuleService } from './academic-rule.service';

import type {
  queryAcademicRulesSchema,
  resolveAcademicRuleSchema,
  createAcademicRuleSchema,
  newRuleVersionSchema,
  updateAcademicRuleSchema,
} from './academic-rule.validation';

export class AcademicRuleController {
  public constructor(private readonly service = new AcademicRuleService()) {}

  public getRules = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const result = await this.service.getRules(
        getValidatedInput<z.infer<typeof queryAcademicRulesSchema>>(res).query as never,
        user,
      );
      sendPaginated(res, result.data, result.pagination, 'Academic rules retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getRuleById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const rule = await this.service.getRuleById(String(req.params.id), user);
      sendSuccess(res, rule, 'Academic rule retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createRule = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const created = await this.service.createRule(
        getValidatedInput<z.infer<typeof createAcademicRuleSchema>>(res).body,
        user,
      );
      sendSuccess(res, created, 'Academic rule created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public createNewVersion = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const versioned = await this.service.createNewVersion(
        String(req.params.id),
        getValidatedInput<z.infer<typeof newRuleVersionSchema>>(res).body,
        user,
      );
      sendSuccess(res, versioned, 'New academic rule version created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateRule = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const updated = await this.service.updateRule(
        String(req.params.id),
        getValidatedInput<z.infer<typeof updateAcademicRuleSchema>>(res).body,
        user,
      );
      sendSuccess(res, updated, 'Academic rule updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public resolveActiveRule = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { schoolId, branchId, ruleType, code, date } =
        getValidatedInput<z.infer<typeof resolveAcademicRuleSchema>>(res).query;
      const resolved = await this.service.resolveRuleForDate(
        schoolId,
        ruleType,
        code,
        date ? new Date(String(date)) : new Date(),
        req.user as AuthUser,
        branchId,
      );
      sendSuccess(res, resolved, 'Active academic rule resolved successfully');
    } catch (error) {
      next(error);
    }
  };
}
