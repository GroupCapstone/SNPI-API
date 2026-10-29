import { Types } from 'mongoose';

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { EmployeeModel } from '../employee/employee.model';
import { RoleModel } from '../role/role.model';
import { EmployeeSkillModel, RoleSkillRequirementModel } from './skill.model';
import { SkillRepository } from './skill.repository';
import type {
  ConsolidatedSkillGapReportFilters,
  ConsolidatedSkillGapSummary,
  EmployeeSkillFilters,
  EmployeeSkillGapAnalysis,
  IEmployeeSkill,
  IRoleSkillRequirement,
  ISkill,
  ProficiencyLevel,
  RoleSkillRequirementFilters,
  SkillCategory,
  SkillFilters,
  SkillGapItem,
} from './skill.types';

export class SkillService {
  private repository: SkillRepository;

  constructor() {
    this.repository = new SkillRepository();
  }

  // --- 1. SKILL CATALOG ---
  public async createSkill(
    data: {
      code: string;
      name: string;
      category: SkillCategory;
      description?: string;
      isActive?: boolean;
      schoolId?: string;
    },
    user: AuthUser,
  ): Promise<ISkill> {
    const existing = await this.repository.findSkillByCode(data.code);
    if (existing) {
      throw new ConflictError(`Skill with code "${data.code}" already exists`);
    }

    const skill = await this.repository.createSkill({
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      category: data.category,
      description: data.description?.trim(),
      isActive: data.isActive !== undefined ? data.isActive : true,
      schoolId: data.schoolId
        ? new Types.ObjectId(data.schoolId)
        : new Types.ObjectId(user.schoolId),
      createdBy: new Types.ObjectId(user.userId),
      updatedBy: new Types.ObjectId(user.userId),
    });

    await AuditLogService.log({
      schoolId: user.schoolId,
      userId: user.userId,
      action: 'CREATE',
      module: 'skill',
      entityId: skill._id.toString(),
      entityType: 'Skill',
      newValue: { code: skill.code, name: skill.name, category: skill.category },
    });

    return skill;
  }

  public async getSkills(filters: SkillFilters) {
    return this.repository.findSkills(filters);
  }

  public async getSkillById(id: string): Promise<ISkill> {
    const skill = await this.repository.findSkillById(id);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }
    return skill;
  }

  public async updateSkill(
    id: string,
    data: {
      name?: string;
      category?: SkillCategory;
      description?: string;
      isActive?: boolean;
    },
    user: AuthUser,
  ): Promise<ISkill> {
    const existing = await this.getSkillById(id);

    const updated = await this.repository.updateSkill(id, {
      ...data,
      updatedBy: new Types.ObjectId(user.userId),
    });

    if (!updated) {
      throw new NotFoundError('Skill not found');
    }

    await AuditLogService.log({
      schoolId: user.schoolId,
      userId: user.userId,
      action: 'UPDATE',
      module: 'skill',
      entityId: id,
      entityType: 'Skill',
      oldValue: { name: existing.name, category: existing.category, isActive: existing.isActive },
      newValue: { name: updated.name, category: updated.category, isActive: updated.isActive },
    });

    return updated;
  }

  public async deleteSkill(id: string, user: AuthUser): Promise<void> {
    const skill = await this.getSkillById(id);

    // Check if skill is required by active roles
    const activeRequirementsCount = await RoleSkillRequirementModel.countDocuments({
      skillId: new Types.ObjectId(id),
      isDeleted: false,
    }).exec();

    if (activeRequirementsCount > 0) {
      throw new BadRequestError(
        `Cannot delete skill "${skill.name}" because it is required by ${activeRequirementsCount} role(s). Remove requirements first or deactivate the skill.`,
      );
    }

    await this.repository.softDeleteSkill(id, new Types.ObjectId(user.userId));

    await AuditLogService.log({
      schoolId: user.schoolId,
      userId: user.userId,
      action: 'DELETE',
      module: 'skill',
      entityId: id,
      entityType: 'Skill',
      oldValue: { code: skill.code, name: skill.name },
    });
  }

  // --- 2. ROLE SKILL REQUIREMENTS ---
  public async addRoleRequirement(
    data: {
      roleId: string;
      skillId: string;
      requiredLevel: number;
      isRequired?: boolean;
      notes?: string;
    },
    user: AuthUser,
  ): Promise<IRoleSkillRequirement> {
    const [role] = await Promise.all([
      RoleModel.findOne({ _id: new Types.ObjectId(data.roleId), isDeleted: false }).exec(),
      this.getSkillById(data.skillId),
    ]);

    if (!role) {
      throw new NotFoundError('Target Role not found');
    }

    const existingReq = await RoleSkillRequirementModel.findOne({
      roleId: new Types.ObjectId(data.roleId),
      skillId: new Types.ObjectId(data.skillId),
      isDeleted: false,
    }).exec();

    if (existingReq) {
      existingReq.requiredLevel = data.requiredLevel as ProficiencyLevel;
      existingReq.isRequired = data.isRequired !== undefined ? data.isRequired : true;
      existingReq.notes = data.notes?.trim();
      existingReq.updatedBy = new Types.ObjectId(user.userId);
      await existingReq.save();
      return existingReq;
    }

    const requirement = await this.repository.createRoleRequirement({
      roleId: new Types.ObjectId(data.roleId),
      skillId: new Types.ObjectId(data.skillId),
      requiredLevel: data.requiredLevel as ProficiencyLevel,
      isRequired: data.isRequired !== undefined ? data.isRequired : true,
      notes: data.notes?.trim(),
      createdBy: new Types.ObjectId(user.userId),
      updatedBy: new Types.ObjectId(user.userId),
    });

    await AuditLogService.log({
      schoolId: user.schoolId,
      userId: user.userId,
      action: 'CREATE',
      module: 'role',
      entityId: requirement._id.toString(),
      entityType: 'RoleSkillRequirement',
      newValue: {
        roleId: data.roleId,
        skillId: data.skillId,
        requiredLevel: data.requiredLevel,
      },
    });

    return requirement;
  }

  public async getRoleRequirementsByRole(roleId: string): Promise<IRoleSkillRequirement[]> {
    return this.repository.findRoleRequirementsByRole(roleId);
  }

  public async getRoleRequirements(filters: RoleSkillRequirementFilters) {
    return this.repository.findRoleRequirements(filters);
  }

  public async batchConfigureRoleRequirements(
    roleId: string,
    requirements: Array<{
      skillId: string;
      requiredLevel: number;
      isRequired?: boolean;
      notes?: string;
    }>,
    user: AuthUser,
  ): Promise<IRoleSkillRequirement[]> {
    const role = await RoleModel.findOne({
      _id: new Types.ObjectId(roleId),
      isDeleted: false,
    }).exec();
    if (!role) {
      throw new NotFoundError('Target Role not found');
    }

    const results: IRoleSkillRequirement[] = [];

    for (const req of requirements) {
      const saved = await this.addRoleRequirement(
        {
          roleId,
          skillId: req.skillId,
          requiredLevel: req.requiredLevel,
          isRequired: req.isRequired,
          notes: req.notes,
        },
        user,
      );
      results.push(saved);
    }

    await AuditLogService.log({
      schoolId: user.schoolId,
      userId: user.userId,
      action: 'UPDATE',
      module: 'role',
      entityId: roleId,
      entityType: 'Role',
      newValue: { configuredRequirementsCount: requirements.length },
    });

    return results;
  }

  public async deleteRoleRequirement(id: string, user: AuthUser): Promise<void> {
    const req = await this.repository.findRoleRequirementById(id);
    if (!req) {
      throw new NotFoundError('Role skill requirement not found');
    }

    await this.repository.softDeleteRoleRequirement(id, new Types.ObjectId(user.userId));

    await AuditLogService.log({
      schoolId: user.schoolId,
      userId: user.userId,
      action: 'DELETE',
      module: 'role',
      entityId: id,
      entityType: 'RoleSkillRequirement',
      oldValue: { roleId: req.roleId.toString(), skillId: req.skillId.toString() },
    });
  }

  // --- 3. EMPLOYEE SKILLS ---
  public async addEmployeeSkill(
    data: {
      employeeId: string;
      skillId: string;
      proficiencyLevel: number;
      yearsExperience?: number;
      evidenceDocument?: string;
      evidenceUrl?: string;
      expiryDate?: string | null;
      notes?: string;
    },
    user: AuthUser,
  ): Promise<IEmployeeSkill> {
    const [employee] = await Promise.all([
      EmployeeModel.findOne({ _id: new Types.ObjectId(data.employeeId), isDeleted: false }).exec(),
      this.getSkillById(data.skillId),
    ]);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Branch Authorization Check
    const rawBranch = employee.branchId as unknown;
    const branchIdStr =
      rawBranch && typeof rawBranch === 'object' && '_id' in rawBranch
        ? String((rawBranch as { _id: Types.ObjectId })._id)
        : String(rawBranch ?? '');

    this.assertEmployeeBranchAccess(user, branchIdStr);

    // Auto-verify if created directly by HR Officer or Super Admin
    const isHrOrAdmin =
      user.permissions.includes('*') ||
      user.permissions.includes('employee_skill.verify.own_branch') ||
      user.permissions.includes('employee_skill.verify.all_branches');

    const existing = await EmployeeSkillModel.findOne({
      employeeId: new Types.ObjectId(data.employeeId),
      skillId: new Types.ObjectId(data.skillId),
      isDeleted: false,
    }).exec();

    if (existing) {
      existing.proficiencyLevel = data.proficiencyLevel as ProficiencyLevel;
      existing.yearsExperience = data.yearsExperience ?? existing.yearsExperience;
      existing.evidenceDocument = data.evidenceDocument ?? existing.evidenceDocument;
      existing.evidenceUrl = data.evidenceUrl ?? existing.evidenceUrl;
      existing.expiryDate = data.expiryDate ? new Date(data.expiryDate) : existing.expiryDate;
      existing.notes = data.notes?.trim() ?? existing.notes;
      if (isHrOrAdmin) {
        existing.status = 'verified';
        existing.verifiedBy = new Types.ObjectId(user.userId);
        existing.verifiedAt = new Date();
      }
      existing.updatedBy = new Types.ObjectId(user.userId);
      await existing.save();
      return existing;
    }

    const employeeSkill = await this.repository.createEmployeeSkill({
      employeeId: new Types.ObjectId(data.employeeId),
      skillId: new Types.ObjectId(data.skillId),
      proficiencyLevel: data.proficiencyLevel as ProficiencyLevel,
      yearsExperience: data.yearsExperience ?? 0,
      evidenceDocument: data.evidenceDocument?.trim(),
      evidenceUrl: data.evidenceUrl?.trim(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      status: isHrOrAdmin ? 'verified' : 'pending',
      verifiedBy: isHrOrAdmin ? new Types.ObjectId(user.userId) : undefined,
      verifiedAt: isHrOrAdmin ? new Date() : null,
      notes: data.notes?.trim(),
      createdBy: new Types.ObjectId(user.userId),
      updatedBy: new Types.ObjectId(user.userId),
    });

    await AuditLogService.log({
      schoolId: user.schoolId,
      branchId: branchIdStr,
      userId: user.userId,
      action: 'CREATE',
      module: 'employee',
      entityId: employeeSkill._id.toString(),
      entityType: 'EmployeeSkill',
      newValue: {
        employeeId: data.employeeId,
        skillId: data.skillId,
        proficiencyLevel: data.proficiencyLevel,
        status: employeeSkill.status,
      },
    });

    return employeeSkill;
  }

  public async getEmployeeSkillsByEmployee(
    employeeId: string,
    user: AuthUser,
  ): Promise<IEmployeeSkill[]> {
    const employee = await EmployeeModel.findOne({
      _id: new Types.ObjectId(employeeId),
      isDeleted: false,
    }).exec();
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Check if user is self, or has branch access
    const isSelf = user.employeeId === employeeId;
    if (!isSelf) {
      const rawBranch = employee.branchId as unknown;
      const branchIdStr =
        rawBranch && typeof rawBranch === 'object' && '_id' in rawBranch
          ? String((rawBranch as { _id: Types.ObjectId })._id)
          : String(rawBranch ?? '');
      this.assertEmployeeBranchAccess(user, branchIdStr);
    }

    return this.repository.findEmployeeSkillsByEmployee(employeeId);
  }

  public async getEmployeeSkills(filters: EmployeeSkillFilters, user: AuthUser) {
    if (
      user.branchAccess !== 'all' &&
      !filters.branchId &&
      Array.isArray(user.branchAccess) &&
      user.branchAccess.length === 1
    ) {
      filters.branchId = user.branchAccess[0];
    }
    return this.repository.findEmployeeSkills(filters);
  }

  public async updateEmployeeSkill(
    id: string,
    data: {
      proficiencyLevel?: number;
      yearsExperience?: number;
      evidenceDocument?: string;
      evidenceUrl?: string;
      expiryDate?: string | null;
      notes?: string;
    },
    user: AuthUser,
  ): Promise<IEmployeeSkill> {
    const existing = await this.repository.findEmployeeSkillById(id);
    if (!existing) {
      throw new NotFoundError('Employee skill not found');
    }

    const empObj = existing.employeeId as unknown as {
      branchId?: { _id?: Types.ObjectId } | Types.ObjectId;
      _id: Types.ObjectId;
    };
    const empBranchId =
      typeof empObj.branchId === 'object' && empObj.branchId !== null && '_id' in empObj.branchId
        ? empObj.branchId._id?.toString()
        : empObj.branchId?.toString();

    if (empBranchId) {
      this.assertEmployeeBranchAccess(user, empBranchId);
    }

    const updated = await this.repository.updateEmployeeSkill(id, {
      proficiencyLevel: data.proficiencyLevel as ProficiencyLevel | undefined,
      yearsExperience: data.yearsExperience,
      evidenceDocument: data.evidenceDocument,
      evidenceUrl: data.evidenceUrl,
      expiryDate:
        data.expiryDate !== undefined
          ? data.expiryDate
            ? new Date(data.expiryDate)
            : null
          : undefined,
      notes: data.notes,
      updatedBy: new Types.ObjectId(user.userId),
    });

    if (!updated) {
      throw new NotFoundError('Employee skill not found');
    }

    await AuditLogService.log({
      schoolId: user.schoolId,
      branchId: empBranchId,
      userId: user.userId,
      action: 'UPDATE',
      module: 'employee',
      entityId: id,
      entityType: 'EmployeeSkill',
      oldValue: { proficiencyLevel: existing.proficiencyLevel, status: existing.status },
      newValue: { proficiencyLevel: updated.proficiencyLevel, status: updated.status },
    });

    return updated;
  }

  public async verifyEmployeeSkill(
    id: string,
    status: 'verified' | 'rejected' | 'pending',
    notes: string | undefined,
    user: AuthUser,
  ): Promise<IEmployeeSkill> {
    const existing = await this.repository.findEmployeeSkillById(id);
    if (!existing) {
      throw new NotFoundError('Employee skill not found');
    }

    const empObj = existing.employeeId as unknown as {
      branchId?: { _id?: Types.ObjectId } | Types.ObjectId;
      _id: Types.ObjectId;
    };
    const empBranchId =
      typeof empObj.branchId === 'object' && empObj.branchId !== null && '_id' in empObj.branchId
        ? empObj.branchId._id?.toString()
        : empObj.branchId?.toString();

    if (empBranchId) {
      this.assertEmployeeBranchAccess(user, empBranchId);
    }

    const updated = await this.repository.updateEmployeeSkill(id, {
      status,
      verifiedBy: status === 'verified' ? new Types.ObjectId(user.userId) : undefined,
      verifiedAt: status === 'verified' ? new Date() : null,
      notes: notes ? notes.trim() : existing.notes,
      updatedBy: new Types.ObjectId(user.userId),
    });

    if (!updated) {
      throw new NotFoundError('Employee skill not found');
    }

    await AuditLogService.log({
      schoolId: user.schoolId,
      branchId: empBranchId,
      userId: user.userId,
      action: 'UPDATE',
      module: 'employee',
      entityId: id,
      entityType: 'EmployeeSkill',
      newValue: { status, verifiedBy: user.username },
    });

    return updated;
  }

  public async deleteEmployeeSkill(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findEmployeeSkillById(id);
    if (!existing) {
      throw new NotFoundError('Employee skill not found');
    }

    const empObj = existing.employeeId as unknown as {
      branchId?: { _id?: Types.ObjectId } | Types.ObjectId;
      _id: Types.ObjectId;
    };
    const empBranchId =
      typeof empObj.branchId === 'object' && empObj.branchId !== null && '_id' in empObj.branchId
        ? empObj.branchId._id?.toString()
        : empObj.branchId?.toString();

    if (empBranchId) {
      this.assertEmployeeBranchAccess(user, empBranchId);
    }

    await this.repository.softDeleteEmployeeSkill(id, new Types.ObjectId(user.userId));

    await AuditLogService.log({
      schoolId: user.schoolId,
      branchId: empBranchId,
      userId: user.userId,
      action: 'DELETE',
      module: 'employee',
      entityId: id,
      entityType: 'EmployeeSkill',
      oldValue: {
        employeeId: existing.employeeId.toString(),
        skillId: existing.skillId.toString(),
      },
    });
  }

  // --- 4. SKILL GAP & COMPETENCY ANALYSIS ENGINE ---
  public async analyzeEmployeeSkillGap(
    employeeId: string,
    roleId: string,
    user: AuthUser,
  ): Promise<EmployeeSkillGapAnalysis> {
    const [employee, targetRole] = await Promise.all([
      EmployeeModel.findOne({ _id: new Types.ObjectId(employeeId), isDeleted: false })
        .populate('branchId', 'branchCode branchNameEn')
        .populate('departmentId', 'code nameEn')
        .populate('positionId', 'code titleEn')
        .exec(),
      RoleModel.findOne({ _id: new Types.ObjectId(roleId), isDeleted: false }).exec(),
    ]);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    if (!targetRole) {
      throw new NotFoundError('Target Role not found');
    }

    // Access check: allow self or branch-authorized viewer
    const isSelf = user.employeeId === employeeId;
    const rawBranch = employee.branchId as unknown;
    const branchIdStr =
      rawBranch && typeof rawBranch === 'object' && '_id' in rawBranch
        ? String((rawBranch as { _id: Types.ObjectId })._id)
        : String(rawBranch ?? '');

    if (!isSelf) {
      this.assertEmployeeBranchAccess(user, branchIdStr);
    }

    const [requirements, employeeSkills] = await Promise.all([
      RoleSkillRequirementModel.find({
        roleId: targetRole._id,
        isDeleted: false,
      })
        .populate('skillId', 'code name category description isActive')
        .exec(),
      EmployeeSkillModel.find({
        employeeId: employee._id,
        isDeleted: false,
      })
        .populate('skillId', 'code name category description isActive')
        .exec(),
    ]);

    const employeeSkillMap = new Map<string, IEmployeeSkill>();
    for (const es of employeeSkills) {
      const skillId =
        typeof es.skillId === 'object' && es.skillId !== null
          ? (es.skillId as { _id: Types.ObjectId })._id.toString()
          : String(es.skillId);
      employeeSkillMap.set(skillId, es);
    }

    const gapItems: SkillGapItem[] = [];
    let sumWeightedRequired = 0;
    let sumWeightedAcquired = 0;
    let totalGaps = 0;
    let totalAcquiredSkills = 0;

    for (const req of requirements) {
      const skillObj = req.skillId as unknown as ISkill;
      if (!skillObj || skillObj.isDeleted) continue;

      const skillId = skillObj._id.toString();
      const requiredLevel = req.requiredLevel;
      const isRequired = req.isRequired;

      sumWeightedRequired += requiredLevel;

      const empSkill = employeeSkillMap.get(skillId);
      const empLevel = empSkill ? empSkill.proficiencyLevel : 0;
      const isVerified = empSkill ? empSkill.status === 'verified' : false;

      sumWeightedAcquired += Math.min(empLevel, requiredLevel);

      let status: 'met' | 'exceeded' | 'gap' | 'missing' = 'missing';
      let gapSize: number = requiredLevel;

      if (!empSkill || empLevel === 0) {
        status = 'missing';
        gapSize = requiredLevel;
        totalGaps++;
      } else if (empLevel < requiredLevel) {
        status = 'gap';
        gapSize = requiredLevel - empLevel;
        totalGaps++;
        totalAcquiredSkills++;
      } else if (empLevel === requiredLevel) {
        status = 'met';
        gapSize = 0;
        totalAcquiredSkills++;
      } else {
        status = 'exceeded';
        gapSize = 0;
        totalAcquiredSkills++;
      }

      gapItems.push({
        skillId,
        skillCode: skillObj.code,
        skillName: skillObj.name,
        category: skillObj.category,
        requiredLevel,
        isRequired,
        employeeLevel: empLevel,
        yearsExperience: empSkill?.yearsExperience,
        status,
        gapSize,
        isVerified,
        evidenceUrl: empSkill?.evidenceUrl,
        expiryDate: empSkill?.expiryDate,
      });
    }

    const totalRequiredSkills = requirements.length;
    const matchPercentage =
      sumWeightedRequired > 0 ? Math.round((sumWeightedAcquired / sumWeightedRequired) * 100) : 100;

    const competencyScore =
      totalRequiredSkills > 0
        ? Number(
            (
              gapItems.reduce((acc, curr) => acc + curr.employeeLevel, 0) / totalRequiredSkills
            ).toFixed(1),
          )
        : 0;

    const branchName =
      typeof employee.branchId === 'object' && employee.branchId !== null
        ? (employee.branchId as { branchNameEn?: string }).branchNameEn
        : undefined;

    const departmentName =
      typeof employee.departmentId === 'object' && employee.departmentId !== null
        ? (employee.departmentId as { nameEn?: string }).nameEn
        : undefined;

    return {
      employeeId: employee._id.toString(),
      employeeCode: employee.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      branchId: branchIdStr,
      branchName,
      departmentId: employee.departmentId
        ? typeof employee.departmentId === 'object' && '_id' in employee.departmentId
          ? String((employee.departmentId as { _id: Types.ObjectId })._id)
          : String(employee.departmentId)
        : undefined,
      departmentName,
      targetRole: {
        roleId: targetRole._id.toString(),
        roleCode: targetRole.code,
        roleName: targetRole.nameEn,
      },
      totalRequiredSkills,
      totalAcquiredSkills,
      totalGaps,
      matchPercentage,
      competencyScore,
      skills: gapItems,
    };
  }

  public async getConsolidatedSkillGapReport(
    filters: ConsolidatedSkillGapReportFilters,
    user: AuthUser,
  ): Promise<ConsolidatedSkillGapSummary> {
    const empQuery: Record<string, unknown> = { isDeleted: false, status: 'active' };

    if (filters.branchId) {
      this.assertEmployeeBranchAccess(user, filters.branchId);
      empQuery.branchId = new Types.ObjectId(filters.branchId);
    } else if (user.branchAccess !== 'all' && Array.isArray(user.branchAccess)) {
      empQuery.branchId = { $in: user.branchAccess.map((b) => new Types.ObjectId(b)) };
    }

    if (filters.departmentId) {
      empQuery.departmentId = new Types.ObjectId(filters.departmentId);
    }

    if (filters.employeeId) {
      empQuery._id = new Types.ObjectId(filters.employeeId);
    }

    const employees = await EmployeeModel.find(empQuery)
      .populate('branchId', 'branchCode branchNameEn')
      .populate('departmentId', 'code nameEn')
      .populate('positionId', 'code titleEn')
      .sort({ lastName: 1 })
      .exec();

    // Fetch target roles
    let targetRoles = await RoleModel.find({ isDeleted: false }).exec();
    if (filters.roleId) {
      targetRoles = targetRoles.filter((r) => r._id.toString() === filters.roleId);
    }

    const defaultTeacherRole = targetRoles.find((r) => r.code === 'teacher');
    const defaultStaffRole = targetRoles.find((r) => r.code === 'staff') ?? targetRoles[0];

    const evaluations: EmployeeSkillGapAnalysis[] = [];
    const skillGapAggregation = new Map<
      string,
      {
        skillId: string;
        skillCode: string;
        skillName: string;
        category: SkillCategory;
        gapCount: number;
        sumRequired: number;
        sumCurrent: number;
      }
    >();

    for (const emp of employees) {
      // Determine relevant role for employee
      let roleToEvaluate = targetRoles[0];
      if (filters.roleId) {
        roleToEvaluate =
          targetRoles.find((r) => r._id.toString() === filters.roleId) ?? targetRoles[0];
      } else {
        const posCode =
          typeof emp.positionId === 'object' && emp.positionId !== null
            ? (emp.positionId as { code?: string }).code?.toLowerCase()
            : '';
        if (posCode?.includes('teach') || posCode?.includes('inst') || posCode?.includes('tchr')) {
          roleToEvaluate = defaultTeacherRole ?? defaultStaffRole;
        } else {
          roleToEvaluate = defaultStaffRole;
        }
      }

      if (!roleToEvaluate) continue;

      const analysis = await this.analyzeEmployeeSkillGap(
        emp._id.toString(),
        roleToEvaluate._id.toString(),
        user,
      );

      if (filters.category) {
        analysis.skills = analysis.skills.filter((s) => s.category === filters.category);
      }

      if (filters.hasGapOnly && analysis.totalGaps === 0) {
        continue;
      }

      evaluations.push(analysis);

      // Track top gap skills
      for (const s of analysis.skills) {
        if (s.status === 'gap' || s.status === 'missing') {
          const current = skillGapAggregation.get(s.skillId) ?? {
            skillId: s.skillId,
            skillCode: s.skillCode,
            skillName: s.skillName,
            category: s.category,
            gapCount: 0,
            sumRequired: 0,
            sumCurrent: 0,
          };
          current.gapCount += 1;
          current.sumRequired += s.requiredLevel;
          current.sumCurrent += s.employeeLevel;
          skillGapAggregation.set(s.skillId, current);
        }
      }
    }

    const totalEvaluated = evaluations.length;
    const avgMatch =
      totalEvaluated > 0
        ? Math.round(
            evaluations.reduce((acc, curr) => acc + curr.matchPercentage, 0) / totalEvaluated,
          )
        : 100;

    const topGapSkills = Array.from(skillGapAggregation.values())
      .map((item) => ({
        skillId: item.skillId,
        skillCode: item.skillCode,
        skillName: item.skillName,
        category: item.category,
        gapCount: item.gapCount,
        averageRequiredLevel: Number((item.sumRequired / item.gapCount).toFixed(1)),
        averageCurrentLevel: Number((item.sumCurrent / item.gapCount).toFixed(1)),
      }))
      .sort((a, b) => b.gapCount - a.gapCount)
      .slice(0, 10);

    return {
      totalEmployeesEvaluated: totalEvaluated,
      averageMatchPercentage: avgMatch,
      topGapSkills,
      employees: evaluations,
    };
  }

  // --- HELPER: BRANCH ISOLATION ENFORCEMENT ---
  private assertEmployeeBranchAccess(user: AuthUser, branchId: string): void {
    if (user.permissions.includes('*')) {
      return;
    }
    if (user.branchAccess === 'all') {
      return;
    }
    if (Array.isArray(user.branchAccess) && user.branchAccess.includes(branchId)) {
      return;
    }
    throw new ForbiddenError('Access denied: You do not have permission for this campus branch');
  }
}
