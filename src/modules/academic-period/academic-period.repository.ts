import type { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IAcademicPeriod } from './academic-period.model';
import { AcademicPeriodModel } from './academic-period.model';
import type {
  AcademicPeriodQueryFilters,
  CreateAcademicPeriodDto,
  PaginatedAcademicPeriods,
  UpdateAcademicPeriodDto,
} from './academic-period.types';

export class AcademicPeriodRepository {
  public async findById(
    id: string | Types.ObjectId,
    schoolId?: string,
  ): Promise<IAcademicPeriod | null> {
    return AcademicPeriodModel.findOne({
      _id: id,
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    })
      .populate('academicYearId', 'name code startDate endDate status')
      .exec();
  }

  public async findByCode(academicYearId: string, code: string): Promise<IAcademicPeriod | null> {
    return AcademicPeriodModel.findOne({
      academicYearId,
      code: code.toUpperCase().trim(),
      isDeleted: false,
    }).exec();
  }

  public async findMany(
    filters: AcademicPeriodQueryFilters = {},
  ): Promise<PaginatedAcademicPeriods> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.academicYearId) {
      query.academicYearId = filters.academicYearId;
    }

    if (filters.schoolId) {
      query.schoolId = filters.schoolId;
    }

    if (filters.programId) {
      query.programId = filters.programId;
    }

    if (filters.type) {
      query.type = filters.type;
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
      AcademicPeriodModel.find(query)
        .populate('academicYearId', 'name code startDate endDate status')
        .sort({ academicYearId: 1, sequence: 1, startDate: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      AcademicPeriodModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as unknown as IAcademicPeriod[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async create(dto: CreateAcademicPeriodDto, userId?: string): Promise<IAcademicPeriod> {
    const period = new AcademicPeriodModel({
      ...dto,
      code: dto.code.toUpperCase().trim(),
      createdBy: userId,
      updatedBy: userId,
    });
    return period.save();
  }

  public async update(
    id: string,
    dto: UpdateAcademicPeriodDto,
    userId?: string,
  ): Promise<IAcademicPeriod | null> {
    return AcademicPeriodModel.findOneAndUpdate(
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
      .populate('academicYearId', 'name code startDate endDate status')
      .exec();
  }

  public async softDelete(id: string, userId?: string, schoolId?: string): Promise<boolean> {
    const result = await AcademicPeriodModel.updateOne(
      { _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedBy: userId,
        },
      },
    ).exec();
    return result.modifiedCount > 0;
  }
}
