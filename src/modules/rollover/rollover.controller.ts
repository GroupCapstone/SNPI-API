import type { z } from 'zod';
import type { Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { NotFoundError } from '../../shared/errors/app-error';
import type { AuthenticatedRequest } from '../../types/auth';
import { RolloverService } from './rollover.service';

import type {
  queryRolloverPlansSchema,
  createRolloverPlanSchema,
  updateRolloverPlanSchema,
  executeRolloverPlanSchema,
} from './rollover.validation';

export class RolloverController {
  public constructor(private readonly service = new RolloverService()) {}

  public getPlans = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const result = await this.service.getPlans(
      getValidatedInput<z.infer<typeof queryRolloverPlansSchema>>(res).query,
      req.user,
    );
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  };

  public getPlanById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const plan = await this.service.getPlanById(String(req.params.id), req.user);
    res.status(200).json({
      success: true,
      data: plan,
    });
  };

  public createPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const plan = await this.service.createPlan(
      getValidatedInput<z.infer<typeof createRolloverPlanSchema>>(res).body,
      req.user,
    );
    res.status(201).json({
      success: true,
      data: plan,
      message: 'Academic rollover plan created successfully',
    });
  };

  public updatePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const plan = await this.service.updatePlan(
      String(req.params.id),
      getValidatedInput<z.infer<typeof updateRolloverPlanSchema>>(res).body,
      req.user,
    );
    res.status(200).json({
      success: true,
      data: plan,
      message: 'Academic rollover plan updated successfully',
    });
  };

  public validatePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const summary = await this.service.validatePlan(String(req.params.id), req.user);
    res.status(200).json({
      success: true,
      data: summary,
      message: 'Academic rollover plan validated successfully',
    });
  };

  public approvePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const plan = await this.service.approvePlan(String(req.params.id), req.user);
    res.status(200).json({
      success: true,
      data: plan,
      message: 'Academic rollover plan approved successfully',
    });
  };

  public executePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const result = await this.service.executePlan(
      String(req.params.id),
      getValidatedInput<z.infer<typeof executeRolloverPlanSchema>>(res).body,
      req.user,
    );
    res.status(200).json({
      success: true,
      data: result.plan,
      executionResult: result.executionResult,
      message: result.message,
    });
  };

  public getTargetPeriodReadiness = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const readiness = await this.service.validateTargetPeriodReadiness(
      String(req.params.targetPeriodId),
      req.user,
    );
    res.status(200).json({
      success: true,
      data: readiness,
    });
  };

  public approveTargetPeriodReadiness = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const readiness = await this.service.approveTargetPeriodReadiness(
      String(req.params.targetPeriodId),
      req.user,
    );
    res.status(200).json({
      success: true,
      data: readiness,
      message: 'Target academic period readiness approved successfully',
    });
  };

  public openTargetPeriod = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) throw new NotFoundError('User not authenticated');
    const period = await this.service.openTargetPeriod(String(req.params.targetPeriodId), req.user);
    res.status(200).json({
      success: true,
      data: period,
      message: 'Target academic period opened successfully',
    });
  };
}
