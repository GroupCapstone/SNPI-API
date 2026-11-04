import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import { EmployeeSkillModel, RoleSkillRequirementModel, SkillModel } from './skill.model';
import type {
  EmployeeSkillFilters,
  IEmployeeSkill,
  IRoleSkillRequirement,
  ISkill,
  RoleSkillRequirementFilters,
  SkillFilters,
} from './skill.types';

export class SkillRepository {
  // --- SKILL CATALOG ---
  public async createSkill(data: Partial<ISkill>): Promise<ISkill> {
    return SkillModel.create(data);
  }

  public async findSkillById(id: string | Types.ObjectId): Promise<ISkill | null> {
    return SkillModel.findOne({ _id: new Types.ObjectId(id.toString()), isDeleted: false }).exec();
  }

  public async findSkillByCode(code: string): Promise<ISkill | null> {
    return SkillModel.findOne({
      code: code.trim().toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async findSkills(
    filters: SkillFilters,
  ): Promise<{ data: ISkill[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ code: searchRegex }, { name: searchRegex }, { description: searchRegex }];
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.schoolId) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    const sortOption: Record<string, 1 | -1> = {};
    if (filters.sortBy) {
      sortOption[filters.sortBy] = filters.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOption.category = 1;
      sortOption.name = 1;
    }

    const [data, total] = await Promise.all([
      SkillModel.find(query).sort(sortOption).skip(skip).limit(limit).exec(),
      SkillModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async updateSkill(
    id: string | Types.ObjectId,
    data: Partial<ISkill>,
  ): Promise<ISkill | null> {
    return SkillModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), isDeleted: false },
      { $set: data },
      { new: true },
    ).exec();
  }

  public async softDeleteSkill(
    id: string | Types.ObjectId,
    deletedBy: Types.ObjectId,
  ): Promise<ISkill | null> {
    return SkillModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: deletedBy } },
      { new: true },
    ).exec();
  }

  // --- ROLE SKILL REQUIREMENTS ---
  public async createRoleRequirement(
    data: Partial<IRoleSkillRequirement>,
  ): Promise<IRoleSkillRequirement> {
    return RoleSkillRequirementModel.create(data);
  }

  public async findRoleRequirementById(
    id: string | Types.ObjectId,
  ): Promise<IRoleSkillRequirement | null> {
    return RoleSkillRequirementModel.findOne({
      _id: new Types.ObjectId(id.toString()),
      isDeleted: false,
    })
      .populate('roleId', 'code nameEn nameKh')
      .populate('skillId', 'code name category description isActive')
      .exec();
  }

  public async findRoleRequirementsByRole(
    roleId: string | Types.ObjectId,
  ): Promise<IRoleSkillRequirement[]> {
    return RoleSkillRequirementModel.find({
      roleId: new Types.ObjectId(roleId.toString()),
      isDeleted: false,
    })
      .populate('skillId', 'code name category description isActive')
      .sort({ isRequired: -1, requiredLevel: -1 })
      .exec();
  }

  public async findRoleRequirements(filters: RoleSkillRequirementFilters): Promise<{
    data: IRoleSkillRequirement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.roleId) {
      query.roleId = new Types.ObjectId(filters.roleId);
    }
    if (filters.skillId) {
      query.skillId = new Types.ObjectId(filters.skillId);
    }
    if (filters.isRequired !== undefined) {
      query.isRequired = filters.isRequired;
    }

    const [data, total] = await Promise.all([
      RoleSkillRequirementModel.find(query)
        .populate('roleId', 'code nameEn nameKh')
        .populate('skillId', 'code name category description isActive')
        .sort({ roleId: 1, isRequired: -1, requiredLevel: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      RoleSkillRequirementModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async updateRoleRequirement(
    id: string | Types.ObjectId,
    data: Partial<IRoleSkillRequirement>,
  ): Promise<IRoleSkillRequirement | null> {
    return RoleSkillRequirementModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), isDeleted: false },
      { $set: data },
      { new: true },
    )
      .populate('roleId', 'code nameEn nameKh')
      .populate('skillId', 'code name category description isActive')
      .exec();
  }

  public async softDeleteRoleRequirement(
    id: string | Types.ObjectId,
    deletedBy: Types.ObjectId,
  ): Promise<IRoleSkillRequirement | null> {
    return RoleSkillRequirementModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: deletedBy } },
      { new: true },
    ).exec();
  }

  // --- EMPLOYEE SKILLS ---
  public async createEmployeeSkill(data: Partial<IEmployeeSkill>): Promise<IEmployeeSkill> {
    return EmployeeSkillModel.create(data);
  }

  public async findEmployeeSkillById(id: string | Types.ObjectId): Promise<IEmployeeSkill | null> {
    return EmployeeSkillModel.findOne({
      _id: new Types.ObjectId(id.toString()),
      isDeleted: false,
    })
      .populate({
        path: 'employeeId',
        select: 'employeeId firstName lastName email branchId departmentId positionId',
        populate: [
          { path: 'branchId', select: 'branchCode branchNameEn' },
          { path: 'departmentId', select: 'code nameEn' },
          { path: 'positionId', select: 'code titleEn' },
        ],
      })
      .populate('skillId', 'code name category description isActive')
      .populate('verifiedBy', 'username email')
      .exec();
  }

  public async findEmployeeSkillsByEmployee(
    employeeId: string | Types.ObjectId,
  ): Promise<IEmployeeSkill[]> {
    return EmployeeSkillModel.find({
      employeeId: new Types.ObjectId(employeeId.toString()),
      isDeleted: false,
    })
      .populate('skillId', 'code name category description isActive')
      .populate('verifiedBy', 'username email')
      .sort({ proficiencyLevel: -1 })
      .exec();
  }

  public async findEmployeeSkills(filters: EmployeeSkillFilters): Promise<{
    data: IEmployeeSkill[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.employeeId) {
      query.employeeId = new Types.ObjectId(filters.employeeId);
    }
    if (filters.skillId) {
      query.skillId = new Types.ObjectId(filters.skillId);
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const [data, total] = await Promise.all([
      EmployeeSkillModel.find(query)
        .populate({
          path: 'employeeId',
          select: 'employeeId firstName lastName email branchId departmentId positionId',
          populate: [
            { path: 'branchId', select: 'branchCode branchNameEn' },
            { path: 'departmentId', select: 'code nameEn' },
            { path: 'positionId', select: 'code titleEn' },
          ],
        })
        .populate('skillId', 'code name category description isActive')
        .populate('verifiedBy', 'username email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      EmployeeSkillModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async updateEmployeeSkill(
    id: string | Types.ObjectId,
    data: Partial<IEmployeeSkill>,
  ): Promise<IEmployeeSkill | null> {
    return EmployeeSkillModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), isDeleted: false },
      { $set: data },
      { new: true },
    )
      .populate({
        path: 'employeeId',
        select: 'employeeId firstName lastName email branchId departmentId positionId',
        populate: [
          { path: 'branchId', select: 'branchCode branchNameEn' },
          { path: 'departmentId', select: 'code nameEn' },
          { path: 'positionId', select: 'code titleEn' },
        ],
      })
      .populate('skillId', 'code name category description isActive')
      .populate('verifiedBy', 'username email')
      .exec();
  }

  public async softDeleteEmployeeSkill(
    id: string | Types.ObjectId,
    deletedBy: Types.ObjectId,
  ): Promise<IEmployeeSkill | null> {
    return EmployeeSkillModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id.toString()), isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: deletedBy } },
      { new: true },
    ).exec();
  }
}
