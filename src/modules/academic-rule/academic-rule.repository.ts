import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import { TermResultModel } from '../term-result/term-result.model';
import type { IAcademicRule } from './academic-rule.model';
import { AcademicRuleModel } from './academic-rule.model';
import type { AcademicRuleQueryFilters, PaginatedAcademicRules } from './academic-rule.types';

export class AcademicRuleRepository {
  public async findApplicableRules(context: {
    schoolId: string;
    branchId: string;
    academicYearId: string;
    academicPeriodId?: string;
    programId: string;
    levelId: string;
    effectiveAt: Date;
  }): Promise<IAcademicRule[]> {
    const optionalScope = (field: string, value?: string) => ({
      $or: [
        ...(value ? [{ [field]: new Types.ObjectId(value) }] : []),
        { [field]: null },
        { [field]: { $exists: false } },
      ],
    });
    return AcademicRuleModel.find({
      schoolId: new Types.ObjectId(context.schoolId),
      status: 'active',
      effectiveFrom: { $lte: context.effectiveAt },
      $and: [
        {
          $or: [
            { effectiveTo: { $exists: false } },
            { effectiveTo: null },
            { effectiveTo: { $gte: context.effectiveAt } },
          ],
        },
        optionalScope('branchId', context.branchId),
        optionalScope('academicYearId', context.academicYearId),
        optionalScope('academicPeriodId', context.academicPeriodId),
        optionalScope('programId', context.programId),
        optionalScope('levelId', context.levelId),
      ],
      isDeleted: false,
    })
      .sort({ effectiveFrom: -1, version: -1 })
      .exec();
  }

  public async findById(id: string, session?: ClientSession): Promise<IAcademicRule | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return AcademicRuleModel.findOne({ _id: id, isDeleted: false }, null, { session });
  }

  public async findBySchoolCodeAndVersion(
    schoolId: string,
    ruleType: string,
    code: string,
    version: number,
    session?: ClientSession,
  ): Promise<IAcademicRule | null> {
    const query: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      ruleType,
      code: code.toUpperCase(),
      version,
      isDeleted: false,
    };
    return AcademicRuleModel.findOne(query, null, { session });
  }

  public async findLatestVersion(
    schoolId: string,
    ruleType: string,
    code: string,
    session?: ClientSession,
  ): Promise<IAcademicRule | null> {
    const query: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      ruleType,
      code: code.toUpperCase(),
      isDeleted: false,
    };
    return AcademicRuleModel.findOne(query, null, { session }).sort({ version: -1 }).exec();
  }

  public async findActiveForDate(
    schoolId: string,
    ruleType: string,
    code: string,
    date: Date,
    branchId?: string,
    session?: ClientSession,
  ): Promise<IAcademicRule | null> {
    const query: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      ruleType,
      code: code.toUpperCase(),
      status: 'active',
      effectiveFrom: { $lte: date },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: null },
        { effectiveTo: { $gte: date } },
      ],
      isDeleted: false,
    };
    if (branchId) {
      const branchRule = await AcademicRuleModel.findOne(
        { ...query, branchId: new Types.ObjectId(branchId) },
        null,
        { session },
      )
        .sort({ version: -1 })
        .exec();
      if (branchRule) return branchRule;
    }
    return AcademicRuleModel.findOne(
      { ...query, $or: [{ branchId: null }, { branchId: { $exists: false } }] },
      null,
      { session },
    )
      .sort({ version: -1 })
      .exec();
  }

  public async findMany(filters: AcademicRuleQueryFilters): Promise<PaginatedAcademicRules> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.schoolId) query.schoolId = new Types.ObjectId(filters.schoolId);
    if (filters.branchId) {
      query.branchId = new Types.ObjectId(filters.branchId);
    } else if (filters.authorizedBranchIds) {
      const validBranchIds = filters.authorizedBranchIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
      const branchCondition = {
        $or: [
          { branchId: { $in: validBranchIds } },
          { branchId: null },
          { branchId: { $exists: false } },
        ],
      };
      if (query.$and) {
        (query.$and as Record<string, unknown>[]).push(branchCondition);
      } else {
        query.$and = [branchCondition];
      }
    }

    if (filters.academicYearId) query.academicYearId = new Types.ObjectId(filters.academicYearId);
    if (filters.academicPeriodId)
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    if (filters.programId) query.programId = new Types.ObjectId(filters.programId);
    if (filters.levelId) query.levelId = new Types.ObjectId(filters.levelId);
    if (filters.ruleType) query.ruleType = filters.ruleType;
    if (filters.code) query.code = filters.code.toUpperCase();
    if (filters.status) query.status = filters.status;

    if (filters.effectiveAt) {
      const at = new Date(filters.effectiveAt);
      query.effectiveFrom = { $lte: at };
      const effectiveCondition = {
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: { $gte: at } },
        ],
      };
      if (query.$and) {
        (query.$and as Record<string, unknown>[]).push(effectiveCondition);
      } else {
        query.$and = [effectiveCondition];
      }
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AcademicRuleModel.find(query)
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name code')
        .populate('academicPeriodId', 'name code')
        .populate('programId', 'nameEn nameKh code')
        .populate('levelId', 'name code')
        .sort({ ruleType: 1, code: 1, version: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      AcademicRuleModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public async create(
    data: Partial<IAcademicRule>,
    session?: ClientSession,
  ): Promise<IAcademicRule> {
    if (session) {
      const [created] = await AcademicRuleModel.create([data], { session });
      if (!created) throw new Error('Failed to create academic rule');
      return created;
    }
    return AcademicRuleModel.create(data);
  }

  public async updateById(
    id: string,
    data: Partial<IAcademicRule>,
    session?: ClientSession,
  ): Promise<IAcademicRule | null> {
    return AcademicRuleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true, session },
    );
  }

  public async countActiveDependencies(ruleId: string): Promise<number> {
    const rule = await this.findById(ruleId);
    if (!rule) return 0;
    const snapshotField: Record<IAcademicRule['ruleType'], string> = {
      grade_scheme: 'gradingRuleSnapshot',
      assessment_scheme: 'assessmentSchemeSnapshot',
      attendance_threshold: 'attendanceRuleSnapshot',
      promotion_rule: 'promotionRuleSnapshot',
    };
    const field = snapshotField[rule.ruleType];
    return TermResultModel.countDocuments({
      schoolId: rule.schoolId,
      [`${field}.source`]: rule.code,
      [`${field}.version`]: rule.version,
      isDeleted: false,
    });
  }
}
