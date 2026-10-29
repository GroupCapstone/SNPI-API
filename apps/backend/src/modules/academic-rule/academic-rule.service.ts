import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { SchoolModel } from '../school/school.model';
import { TermResultModel } from '../term-result/term-result.model';
import type { IAcademicRule } from './academic-rule.model';
import { AcademicRuleRepository } from './academic-rule.repository';
import type {
  AcademicRuleQueryFilters,
  CreateAcademicRuleDto,
  NewRuleVersionDto,
  PaginatedAcademicRules,
  UpdateAcademicRuleDto,
} from './academic-rule.types';
import { validateAcademicRuleConfig } from './academic-rule.validation';

export class AcademicRuleService {
  public constructor(private readonly repository = new AcademicRuleRepository()) {}

  private assertSchoolAccess(schoolId: string, currentUser: AuthUser): void {
    if (schoolId !== currentUser.schoolId) {
      throw new ForbiddenError('You do not have access to academic rules for this school');
    }
  }

  private assertManageScope(branchId: string | undefined, currentUser: AuthUser): void {
    if (!branchId) {
      if (
        !checkUserPermission(
          currentUser.permissions,
          'academic_rule.manage.all_branches',
          currentUser.roles,
        )
      ) {
        throw new ForbiddenError('Global academic rules require all-branches management access');
      }
      return;
    }

    if (
      !checkBranchAccess(currentUser.branchAccess, branchId) ||
      !checkUserPermission(
        currentUser.permissions,
        'academic_rule.manage.own_branch',
        currentUser.roles,
      )
    ) {
      throw new ForbiddenError('You do not have access to manage academic rules in this branch');
    }
  }

  private validateConfig(
    ruleType: IAcademicRule['ruleType'],
    config: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = validateAcademicRuleConfig(ruleType, config);
    if (!result.success) {
      throw new ValidationError(result.error.issues.map((issue) => issue.message).join('; '));
    }
    return result.data;
  }

  public async getRules(
    filters: AcademicRuleQueryFilters,
    currentUser: AuthUser,
  ): Promise<PaginatedAcademicRules> {
    if (filters.schoolId) this.assertSchoolAccess(filters.schoolId, currentUser);
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to academic rules in this branch');
    }
    const scopedFilters: AcademicRuleQueryFilters = { ...filters };
    scopedFilters.schoolId = currentUser.schoolId;
    if (!scopedFilters.branchId && currentUser.branchAccess !== 'all') {
      scopedFilters.authorizedBranchIds = Array.isArray(currentUser.branchAccess)
        ? currentUser.branchAccess
        : [];
    }
    return this.repository.findMany(scopedFilters);
  }

  public async getRuleById(id: string, currentUser: AuthUser): Promise<IAcademicRule> {
    const rule = await this.repository.findById(id);
    if (!rule) {
      throw new NotFoundError('Academic rule not found');
    }
    this.assertSchoolAccess(String(rule.schoolId), currentUser);
    if (rule.branchId && !checkBranchAccess(currentUser.branchAccess, String(rule.branchId))) {
      throw new ForbiddenError('You do not have access to this academic rule');
    }
    return rule;
  }

  public async createRule(
    dto: CreateAcademicRuleDto,
    currentUser: AuthUser,
  ): Promise<IAcademicRule> {
    this.assertSchoolAccess(dto.schoolId, currentUser);
    dto = { ...dto, config: this.validateConfig(dto.ruleType, dto.config) };
    this.assertManageScope(dto.branchId, currentUser);

    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new NotFoundError('School not found');
    }

    if (dto.branchId) {
      const branch = await BranchModel.findOne({
        _id: dto.branchId,
        schoolId: dto.schoolId,
        isDeleted: false,
      });
      if (!branch) {
        throw new NotFoundError('Branch not found or does not belong to the selected school');
      }
    }

    const normalizedCode = dto.code.trim().toUpperCase();
    const existing = await this.repository.findLatestVersion(
      dto.schoolId,
      dto.ruleType,
      normalizedCode,
    );
    if (existing) {
      throw new ConflictError(
        `Academic rule "${normalizedCode}" already exists for this rule type. Use versioning to create a new revision.`,
      );
    }

    const effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
    const effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : undefined;
    if (effectiveTo && effectiveTo <= effectiveFrom) {
      throw new ValidationError('effectiveTo must be strictly after effectiveFrom');
    }

    const created = await this.repository.create({
      ruleType: dto.ruleType,
      code: normalizedCode,
      name: dto.name.trim(),
      version: 1,
      effectiveFrom,
      effectiveTo,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : undefined,
      academicYearId: dto.academicYearId ? new Types.ObjectId(dto.academicYearId) : undefined,
      academicPeriodId: dto.academicPeriodId ? new Types.ObjectId(dto.academicPeriodId) : undefined,
      programId: dto.programId ? new Types.ObjectId(dto.programId) : undefined,
      levelId: dto.levelId ? new Types.ObjectId(dto.levelId) : undefined,
      config: dto.config,
      status: dto.status ?? 'draft',
      createdBy: currentUser.userId,
      updatedBy: currentUser.userId,
    });

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      module: 'academic_rule',
      action: 'CREATE',
      entityType: 'AcademicRule',
      entityId: String(created._id),
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async createNewVersion(
    id: string,
    dto: NewRuleVersionDto,
    currentUser: AuthUser,
  ): Promise<IAcademicRule> {
    const previousRule = await this.repository.findById(id);
    if (!previousRule) {
      throw new NotFoundError('Academic rule to version not found');
    }
    this.assertSchoolAccess(String(previousRule.schoolId), currentUser);
    this.assertManageScope(
      previousRule.branchId ? String(previousRule.branchId) : undefined,
      currentUser,
    );

    const newEffectiveFrom = new Date(dto.effectiveFrom);
    dto = { ...dto, config: this.validateConfig(previousRule.ruleType, dto.config) };
    if (newEffectiveFrom <= previousRule.effectiveFrom) {
      throw new ValidationError(
        'New rule version effectiveFrom must be after previous version effectiveFrom',
      );
    }

    const newEffectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : undefined;
    if (newEffectiveTo && newEffectiveTo <= newEffectiveFrom) {
      throw new ValidationError('effectiveTo must be after effectiveFrom');
    }

    return runInTransaction(async (session) => {
      // 1. Cap previous rule's effectiveTo if needed
      if (!previousRule.effectiveTo || previousRule.effectiveTo > newEffectiveFrom) {
        previousRule.effectiveTo = new Date(newEffectiveFrom.getTime() - 1);
        previousRule.status = 'archived';
        previousRule.updatedBy = currentUser.userId as never;
        await previousRule.save({ session });
      }

      // 2. Increment version and create new immutable rule entry
      const nextVersion = previousRule.version + 1;
      const newRuleData: Partial<IAcademicRule> = {
        ruleType: previousRule.ruleType,
        code: previousRule.code,
        name: dto.name?.trim() || previousRule.name,
        version: nextVersion,
        effectiveFrom: newEffectiveFrom,
        effectiveTo: newEffectiveTo,
        schoolId: previousRule.schoolId,
        branchId: previousRule.branchId,
        academicYearId: previousRule.academicYearId,
        academicPeriodId: previousRule.academicPeriodId,
        programId: previousRule.programId,
        levelId: previousRule.levelId,
        config: dto.config,
        status: dto.status ?? 'active',
        createdBy: currentUser.userId as never,
        updatedBy: currentUser.userId as never,
      };

      const newRule = await this.repository.create(newRuleData, session);

      await AuditLogService.log({
        userId: currentUser.userId,
        schoolId: String(previousRule.schoolId),
        branchId: previousRule.branchId ? String(previousRule.branchId) : undefined,
        module: 'academic_rule',
        action: 'CREATE',
        entityType: 'AcademicRule',
        entityId: String(newRule._id),
        reason: dto.reason,
        newValue: {
          previousVersionId: String(previousRule._id),
          version: nextVersion,
          code: previousRule.code,
        },
        session,
        required: true,
      });

      return newRule;
    });
  }

  public async updateRule(
    id: string,
    dto: UpdateAcademicRuleDto,
    currentUser: AuthUser,
  ): Promise<IAcademicRule> {
    const rule = await this.repository.findById(id);
    if (!rule) {
      throw new NotFoundError('Academic rule not found');
    }
    this.assertSchoolAccess(String(rule.schoolId), currentUser);
    this.assertManageScope(rule.branchId ? String(rule.branchId) : undefined, currentUser);

    // Check if historical finalized results depend on this rule version
    if (dto.config) {
      dto = { ...dto, config: this.validateConfig(rule.ruleType, dto.config) };
      const snapshotField: Record<IAcademicRule['ruleType'], string> = {
        grade_scheme: 'gradingRuleSnapshot',
        assessment_scheme: 'assessmentSchemeSnapshot',
        attendance_threshold: 'attendanceRuleSnapshot',
        promotion_rule: 'promotionRuleSnapshot',
      };
      const field = snapshotField[rule.ruleType];
      const dependentsCount = await TermResultModel.countDocuments({
        schoolId: rule.schoolId,
        [`${field}.source`]: rule.code,
        [`${field}.version`]: rule.version,
        isCompleted: true,
        isDeleted: false,
      });
      if (dependentsCount > 0) {
        throw new ConflictError(
          `Cannot modify configuration of rule version ${rule.version}: ${dependentsCount} finalized term results depend on this historical rule. Create a new version instead.`,
        );
      }
    }

    const updatePayload: Partial<IAcademicRule> = {
      updatedBy: currentUser.userId as never,
    };
    if (dto.name !== undefined) updatePayload.name = dto.name.trim();
    if (dto.status !== undefined) updatePayload.status = dto.status;
    if (dto.effectiveTo !== undefined) {
      updatePayload.effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : undefined;
    }
    if (dto.config !== undefined) updatePayload.config = dto.config;

    const updated = await this.repository.updateById(id, updatePayload);
    if (!updated) {
      throw new NotFoundError('Academic rule not found');
    }

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: String(rule.schoolId),
      branchId: rule.branchId ? String(rule.branchId) : undefined,
      module: 'academic_rule',
      action: 'UPDATE',
      entityType: 'AcademicRule',
      entityId: String(rule._id),
      oldValue: rule.toObject ? rule.toObject() : (rule as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async resolveRuleForDate(
    schoolId: string,
    ruleType: string,
    code: string,
    date: Date = new Date(),
    currentUser: AuthUser,
    branchId?: string,
  ): Promise<IAcademicRule | null> {
    this.assertSchoolAccess(schoolId, currentUser);
    if (branchId && !checkBranchAccess(currentUser.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to resolve academic rules in this branch');
    }
    return this.repository.findActiveForDate(schoolId, ruleType, code, date, branchId);
  }
}
