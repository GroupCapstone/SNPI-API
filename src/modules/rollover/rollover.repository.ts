import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import type { IRolloverPlan } from './rollover.model';
import { AcademicRolloverPlanModel } from './rollover.model';
import type { PaginatedRolloverPlans, RolloverPlanQueryFilters } from './rollover.types';

export class RolloverRepository {
  public async findById(id: string, session?: ClientSession): Promise<IRolloverPlan | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return AcademicRolloverPlanModel.findOne({ _id: id, isDeleted: false }, null, {
      session,
    })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('programId', 'nameEn nameKh code')
      .populate('sourceAcademicYearId', 'name code')
      .populate('sourcePeriodId', 'name code sequence status')
      .populate('targetAcademicYearId', 'name code')
      .populate('targetPeriodId', 'name code sequence status')
      .populate('classMappings.sourceClassId', 'classCode className capacity')
      .populate('classMappings.targetClassId', 'classCode className capacity')
      .populate('studentDecisions.studentId', 'studentId firstName lastName khmerName gender')
      .populate('studentDecisions.targetClassId', 'classCode className capacity')
      .exec();
  }

  public async findByPlanCode(
    planCode: string,
    session?: ClientSession,
  ): Promise<IRolloverPlan | null> {
    return AcademicRolloverPlanModel.findOne(
      { planCode: planCode.toUpperCase(), isDeleted: false },
      null,
      { session },
    );
  }

  public async findActivePlanForContext(
    branchId: string,
    sourcePeriodId: string,
    targetPeriodId: string,
    programId?: string,
    session?: ClientSession,
  ): Promise<IRolloverPlan | null> {
    const query: Record<string, unknown> = {
      branchId: new Types.ObjectId(branchId),
      sourcePeriodId: new Types.ObjectId(sourcePeriodId),
      targetPeriodId: new Types.ObjectId(targetPeriodId),
      status: { $in: ['draft', 'validated', 'approved'] },
      isDeleted: false,
    };
    if (programId) {
      query.programId = new Types.ObjectId(programId);
    }
    return AcademicRolloverPlanModel.findOne(query, null, { session });
  }

  public async findMany(
    filters: RolloverPlanQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<PaginatedRolloverPlans> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId) query.schoolId = new Types.ObjectId(filters.schoolId);
    if (filters.branchId) query.branchId = new Types.ObjectId(filters.branchId);
    if (filters.programId) query.programId = new Types.ObjectId(filters.programId);
    if (filters.sourcePeriodId) query.sourcePeriodId = new Types.ObjectId(filters.sourcePeriodId);
    if (filters.targetPeriodId) query.targetPeriodId = new Types.ObjectId(filters.targetPeriodId);
    if (filters.status) query.status = filters.status;

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AcademicRolloverPlanModel.find(query)
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('programId', 'nameEn nameKh code')
        .populate('sourceAcademicYearId', 'name code')
        .populate('sourcePeriodId', 'name code sequence status')
        .populate('targetAcademicYearId', 'name code')
        .populate('targetPeriodId', 'name code sequence status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      AcademicRolloverPlanModel.countDocuments(query).exec(),
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
    data: Partial<IRolloverPlan>,
    session?: ClientSession,
  ): Promise<IRolloverPlan> {
    if (session) {
      const [created] = await AcademicRolloverPlanModel.create([data], { session });
      if (!created) throw new Error('Failed to create rollover plan');
      return created;
    }
    return AcademicRolloverPlanModel.create(data);
  }

  public async updateById(
    id: string,
    data: Partial<IRolloverPlan>,
    session?: ClientSession,
  ): Promise<IRolloverPlan | null> {
    return AcademicRolloverPlanModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true, session },
    );
  }
}
