import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IAcademicYear } from './academic-year.model';
import { AcademicYearModel } from './academic-year.model';
import type {
  AcademicYearQueryFilters,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from './academic-year.types';

export class AcademicYearRepository {
  public async findWithFilters(filters: AcademicYearQueryFilters = {}): Promise<IAcademicYear[]> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.isCurrent !== undefined) {
      query.isCurrent = filters.isCurrent;
    }

    if (filters.search && filters.search.trim()) {
      const regex = createSafeSearchRegex(filters.search);
      query.$or = [{ name: regex }, { code: regex }];
    }

    return AcademicYearModel.find(query).sort({ isCurrent: -1, startDate: -1 }).exec();
  }

  public async findById(id: string, schoolId?: string): Promise<IAcademicYear | null> {
    return AcademicYearModel.findOne({
      _id: id,
      ...(schoolId && Types.ObjectId.isValid(schoolId)
        ? { schoolId: new Types.ObjectId(schoolId) }
        : {}),
      isDeleted: false,
    }).exec();
  }

  public async findByCode(code: string, schoolId?: string): Promise<IAcademicYear | null> {
    return AcademicYearModel.findOne({
      code: code.trim().toUpperCase(),
      ...(schoolId && Types.ObjectId.isValid(schoolId)
        ? { schoolId: new Types.ObjectId(schoolId) }
        : {}),
      isDeleted: false,
    }).exec();
  }

  public async create(dto: CreateAcademicYearDto): Promise<IAcademicYear> {
    if (dto.isCurrent) {
      await AcademicYearModel.updateMany(
        { schoolId: dto.schoolId, isDeleted: false },
        { isCurrent: false },
      );
    }
    return AcademicYearModel.create({
      ...dto,
      code: dto.code.trim().toUpperCase(),
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  public async update(
    id: string,
    dto: UpdateAcademicYearDto,
    schoolId?: string,
  ): Promise<IAcademicYear | null> {
    if (dto.isCurrent) {
      await AcademicYearModel.updateMany(
        { _id: { $ne: id }, ...(schoolId ? { schoolId } : {}), isDeleted: false },
        { isCurrent: false },
      );
    }

    const updatePayload: Record<string, unknown> = { ...dto };
    if (dto.code) {
      updatePayload.code = dto.code.trim().toUpperCase();
    }
    if (dto.startDate) {
      updatePayload.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      updatePayload.endDate = new Date(dto.endDate);
    }

    return AcademicYearModel.findOneAndUpdate(
      { _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false },
      updatePayload,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    ).exec();
  }

  public async softDelete(id: string, schoolId?: string): Promise<IAcademicYear | null> {
    return AcademicYearModel.findOneAndUpdate(
      { _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { isDeleted: true },
      { returnDocument: 'after' },
    ).exec();
  }
}
