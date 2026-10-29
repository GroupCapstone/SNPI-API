import type { NextFunction, Response } from 'express';

import { UnauthorizedError } from '../../shared/errors/app-error';
import type { AuthenticatedRequest } from '../../types/auth';
import { SkillService } from './skill.service';
import {
  batchRoleSkillRequirementsSchema,
  createEmployeeSkillSchema,
  createRoleSkillRequirementSchema,
  createSkillSchema,
  employeeSkillQuerySchema,
  skillGapQuerySchema,
  skillQuerySchema,
  updateEmployeeSkillSchema,
  updateSkillSchema,
  verifyEmployeeSkillSchema,
} from './skill.validation';

export class SkillController {
  private service: SkillService;

  constructor() {
    this.service = new SkillService();
  }

  // --- SKILL CATALOG ---
  public createSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const validated = createSkillSchema.parse(req.body);
      const skill = await this.service.createSkill(validated, req.user);
      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data: skill,
      });
    } catch (err) {
      next(err);
    }
  };

  public getSkills = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = skillQuerySchema.parse(req.query);
      const result = await this.service.getSkills(filters);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  public getSkillById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const skill = await this.service.getSkillById(id);
      res.status(200).json({
        success: true,
        data: skill,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = String(req.params.id);
      const validated = updateSkillSchema.parse(req.body);
      const skill = await this.service.updateSkill(id, validated, req.user);
      res.status(200).json({
        success: true,
        message: 'Skill updated successfully',
        data: skill,
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = String(req.params.id);
      await this.service.deleteSkill(id, req.user);
      res.status(200).json({
        success: true,
        message: 'Skill deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // --- ROLE SKILL REQUIREMENTS ---
  public addRoleRequirement = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const validated = createRoleSkillRequirementSchema.parse(req.body);
      const requirement = await this.service.addRoleRequirement(validated, req.user);
      res.status(201).json({
        success: true,
        message: 'Role skill requirement assigned successfully',
        data: requirement,
      });
    } catch (err) {
      next(err);
    }
  };

  public getRoleRequirementsByRole = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const roleId = String(req.params.roleId);
      const requirements = await this.service.getRoleRequirementsByRole(roleId);
      res.status(200).json({
        success: true,
        data: requirements,
      });
    } catch (err) {
      next(err);
    }
  };

  public batchConfigureRoleRequirements = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const roleId = String(req.params.roleId);
      const { requirements } = batchRoleSkillRequirementsSchema.parse(req.body);
      const result = await this.service.batchConfigureRoleRequirements(
        roleId,
        requirements,
        req.user,
      );
      res.status(200).json({
        success: true,
        message: 'Role skill requirements configured successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteRoleRequirement = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = String(req.params.id);
      await this.service.deleteRoleRequirement(id, req.user);
      res.status(200).json({
        success: true,
        message: 'Role skill requirement removed successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // --- EMPLOYEE SKILLS ---
  public addEmployeeSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const validated = createEmployeeSkillSchema.parse(req.body);
      const employeeSkill = await this.service.addEmployeeSkill(validated, req.user);
      res.status(201).json({
        success: true,
        message: 'Employee skill logged successfully',
        data: employeeSkill,
      });
    } catch (err) {
      next(err);
    }
  };

  public getEmployeeSkills = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const filters = employeeSkillQuerySchema.parse(req.query);
      const result = await this.service.getEmployeeSkills(filters, req.user);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  public getEmployeeSkillsByEmployee = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const employeeId = String(req.params.employeeId);
      const skills = await this.service.getEmployeeSkillsByEmployee(employeeId, req.user);
      res.status(200).json({
        success: true,
        data: skills,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateEmployeeSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = String(req.params.id);
      const validated = updateEmployeeSkillSchema.parse(req.body);
      const updated = await this.service.updateEmployeeSkill(id, validated, req.user);
      res.status(200).json({
        success: true,
        message: 'Employee skill updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  };

  public verifyEmployeeSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = String(req.params.id);
      const { status, notes } = verifyEmployeeSkillSchema.parse(req.body);
      const verified = await this.service.verifyEmployeeSkill(id, status, notes, req.user);
      res.status(200).json({
        success: true,
        message: `Employee skill status updated to ${status}`,
        data: verified,
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteEmployeeSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = String(req.params.id);
      await this.service.deleteEmployeeSkill(id, req.user);
      res.status(200).json({
        success: true,
        message: 'Employee skill record removed successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // --- 4. SKILL GAP ANALYTICS ---
  public analyzeEmployeeSkillGap = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const employeeId = String(req.params.employeeId);
      const roleId = String(req.query.roleId || '');
      if (!roleId) {
        res
          .status(400)
          .json({ success: false, message: 'Target roleId query parameter is required' });
        return;
      }
      const analysis = await this.service.analyzeEmployeeSkillGap(employeeId, roleId, req.user);
      res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (err) {
      next(err);
    }
  };

  public getConsolidatedSkillGapReport = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError();
      const filters = skillGapQuerySchema.parse(req.query);
      const report = await this.service.getConsolidatedSkillGapReport(filters, req.user);
      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  };
}
