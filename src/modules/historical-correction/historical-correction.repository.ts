import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import type { IHistoricalCorrection } from './historical-correction.model';
import { HistoricalCorrectionModel } from './historical-correction.model';
import type {
  HistoricalCorrectionQueryFilters,
  PaginatedHistoricalCorrections,
} from './historical-correction.types';

export class HistoricalCorrectionRepository {
  public async findById(
    id: string,
    session?: ClientSession,
  ): Promise<IHistoricalCorrection | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return HistoricalCorrectionModel.findOne({ _id: id, isDeleted: false }, null, { session });
  }

  public async findByCorrectionNumber(
    correctionNumber: string,
    session?: ClientSession,
  ): Promise<IHistoricalCorrection | null> {
    return HistoricalCorrectionModel.findOne(
      { correctionNumber: correctionNumber.toUpperCase(), isDeleted: false },
      null,
      { session },
    );
  }

  public async findActiveUnlock(
    entityType: string,
    entityId: string,
    token: string,
    session?: ClientSession,
  ): Promise<IHistoricalCorrection | null> {
    const now = new Date();
    const query: Record<string, unknown> = {
      entityType,
      entityId: new Types.ObjectId(entityId),
      unlockToken: token,
      status: 'approved',
      unlockExpiresAt: { $gt: now },
      isDeleted: false,
    };
    return HistoricalCorrectionModel.findOne(query, null, { session });
  }

  public async findMany(
    filters: HistoricalCorrectionQueryFilters,
  ): Promise<PaginatedHistoricalCorrections> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.entityType) query.entityType = filters.entityType;
    if (filters.entityId) query.entityId = new Types.ObjectId(filters.entityId);
    if (filters.studentId) query.studentId = new Types.ObjectId(filters.studentId);
    if (filters.branchId) query.branchId = new Types.ObjectId(filters.branchId);
    else if (filters.authorizedBranchIds) {
      query.branchId = { $in: filters.authorizedBranchIds.map((id) => new Types.ObjectId(id)) };
    }
    if (filters.academicYearId) query.academicYearId = new Types.ObjectId(filters.academicYearId);
    if (filters.academicPeriodId)
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    if (filters.status) query.status = filters.status;

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      HistoricalCorrectionModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name code')
        .populate('academicPeriodId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      HistoricalCorrectionModel.countDocuments(query).exec(),
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
    data: Partial<IHistoricalCorrection>,
    session?: ClientSession,
  ): Promise<IHistoricalCorrection> {
    if (session) {
      const [created] = await HistoricalCorrectionModel.create([data], { session });
      if (!created) throw new Error('Failed to create historical correction');
      return created;
    }
    return HistoricalCorrectionModel.create(data);
  }

  public async updateById(
    id: string,
    data: Partial<IHistoricalCorrection>,
    session?: ClientSession,
    expectedState?: Record<string, unknown>,
  ): Promise<IHistoricalCorrection | null> {
    return HistoricalCorrectionModel.findOneAndUpdate(
      { ...expectedState, _id: id, isDeleted: false },
      {
        $set: data,
        ...(data.status === 'applied' ? { $unset: { unlockToken: 1, unlockExpiresAt: 1 } } : {}),
      },
      { new: true, session },
    );
  }
}
