import type { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IIntake } from './intake.model';
import { IntakeModel } from './intake.model';
import type {
  CreateIntakeDto,
  IntakeQueryFilters,
  PaginatedIntakes,
  UpdateIntakeDto,
} from './intake.types';

export class IntakeRepository {
  public async findById(id: string | Types.ObjectId): Promise<IIntake | null> {
    return IntakeModel.findOne({ _id: id, isDeleted: false })
      .populate('academicPeriodId', 'code name type startDate endDate')
      .populate('academicYearId', 'code name')
      .populate('programId', 'code nameEn nameKh')
      .populate('levelId', 'code name sequence')
      .populate('curriculumId', 'code name')
      .exec();
  }

  public async findByCode(academicPeriodId: string, code: string): Promise<IIntake | null> {
    return IntakeModel.findOne({
      academicPeriodId,
      code: code.toUpperCase().trim(),
      isDeleted: false,
    }).exec();
  }

  public async findMany(filters: IntakeQueryFilters = {}): Promise<PaginatedIntakes> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.branchId) {
      query.branchId = filters.branchId;
    }
    if (filters.academicYearId) {
      query.academicYearId = filters.academicYearId;
    }
    if (filters.academicPeriodId) {
      query.academicPeriodId = filters.academicPeriodId;
    }
    if (filters.programId) {
      query.programId = filters.programId;
    }
    if (filters.levelId) {
      query.levelId = filters.levelId;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ code: searchRegex }, { name: searchRegex }];
    }

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filters.limit || 50)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      IntakeModel.find(query)
        .populate('academicYearId', 'name code startDate endDate')
        .populate('academicPeriodId', 'name code type startDate endDate')
        .populate('programId', 'nameEn nameKh code')
        .populate('levelId', 'name code sequence')
        .populate('curriculumId', 'name code')
        .sort({ academicPeriodId: 1, code: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      IntakeModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as unknown as IIntake[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async create(dto: CreateIntakeDto, userId?: string): Promise<IIntake> {
    const intake = new IntakeModel({
      ...dto,
      code: dto.code.toUpperCase().trim(),
      createdBy: userId,
      updatedBy: userId,
    });
    return intake.save();
  }

  public async update(id: string, dto: UpdateIntakeDto, userId?: string): Promise<IIntake | null> {
    return IntakeModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          ...dto,
          ...(dto.code ? { code: dto.code.toUpperCase().trim() } : {}),
          updatedBy: userId,
        },
      },
      { new: true },
    )
      .populate('academicYearId', 'name code startDate endDate')
      .populate('academicPeriodId', 'name code type startDate endDate')
      .populate('programId', 'nameEn nameKh code')
      .populate('levelId', 'name code sequence')
      .populate('curriculumId', 'name code')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<boolean> {
    const result = await IntakeModel.updateOne(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          status: 'archived',
          updatedBy: userId,
        },
      },
    ).exec();
    return result.modifiedCount > 0;
  }
}
