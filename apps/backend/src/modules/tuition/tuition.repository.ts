import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { ITuitionFee } from './tuition-fee.model';
import { TuitionFeeModel } from './tuition-fee.model';
import type {
  CreateTuitionFeeDto,
  TuitionFeeQueryFilters,
  UpdateTuitionFeeDto,
} from './tuition.types';

export class TuitionRepository {
  public async findWithFilters(
    filters: TuitionFeeQueryFilters,
    branchFilter?: string[],
  ): Promise<{ data: ITuitionFee[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    } else if (branchFilter && branchFilter.length > 0) {
      query.branchId = { $in: branchFilter.map((b) => new Types.ObjectId(b)) };
    }

    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }

    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }

    if (filters.levelId && Types.ObjectId.isValid(filters.levelId)) {
      query.levelId = new Types.ObjectId(filters.levelId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ feeName: searchRegex }, { feeCode: searchRegex }];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      TuitionFeeModel.find(query)
        .populate('programId', 'nameEn nameKh code')
        .populate('levelId', 'name code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      TuitionFeeModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<ITuitionFee | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return TuitionFeeModel.findOne({ _id: new Types.ObjectId(id), isDeleted: false })
      .populate('programId', 'nameEn nameKh code')
      .populate('levelId', 'name code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name')
      .exec();
  }

  public async findByCode(
    branchId: string,
    academicYearId: string,
    feeCode: string,
    excludeId?: string,
  ): Promise<ITuitionFee | null> {
    if (!Types.ObjectId.isValid(branchId) || !Types.ObjectId.isValid(academicYearId)) return null;
    const query: Record<string, unknown> = {
      branchId: new Types.ObjectId(branchId),
      academicYearId: new Types.ObjectId(academicYearId),
      feeCode: feeCode.toUpperCase(),
      isDeleted: false,
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }
    return TuitionFeeModel.findOne(query).exec();
  }

  public async create(dto: CreateTuitionFeeDto, userId?: string): Promise<ITuitionFee> {
    const docData: Record<string, unknown> = {
      ...dto,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      programId: new Types.ObjectId(dto.programId),
      levelId: new Types.ObjectId(dto.levelId),
      feeCode: dto.feeCode.toUpperCase(),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    return TuitionFeeModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdateTuitionFeeDto,
    userId?: string,
  ): Promise<ITuitionFee | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      ...dto,
      ...(dto.feeCode ? { feeCode: dto.feeCode.toUpperCase() } : {}),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }

    return TuitionFeeModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updatePayload },
      { new: true },
    )
      .populate('programId', 'nameEn nameKh code')
      .populate('levelId', 'name code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<ITuitionFee | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      isDeleted: true,
      status: 'inactive',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }

    return TuitionFeeModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updatePayload },
      { new: true },
    ).exec();
  }
}
