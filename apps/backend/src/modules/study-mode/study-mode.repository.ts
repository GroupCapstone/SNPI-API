import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IStudyMode } from './study-mode.model';
import { StudyModeModel } from './study-mode.model';
import type {
  CreateStudyModeDto,
  StudyModeQueryFilters,
  UpdateStudyModeDto,
} from './study-mode.types';

export class StudyModeRepository {
  public async findWithFilters(
    filters: StudyModeQueryFilters,
  ): Promise<{ data: IStudyMode[]; total: number }> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.search && filters.search.trim()) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ code: searchRegex }, { nameEn: searchRegex }, { nameKh: searchRegex }];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      StudyModeModel.find(query).sort({ sortOrder: 1, code: 1 }).skip(skip).limit(limit).exec(),
      StudyModeModel.countDocuments(query),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<IStudyMode | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudyModeModel.findOne({
      _id: new Types.ObjectId(id),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();
  }

  public async findByCode(code: string, schoolId?: string): Promise<IStudyMode | null> {
    return StudyModeModel.findOne({
      code: code.toUpperCase().trim(),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();
  }

  public async create(dto: CreateStudyModeDto, userId?: string): Promise<IStudyMode> {
    return StudyModeModel.create({
      ...dto,
      code: dto.code.toUpperCase().trim(),
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async update(
    id: string,
    dto: UpdateStudyModeDto,
    userId?: string,
    schoolId?: string,
  ): Promise<IStudyMode | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudyModeModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: { ...dto, updatedBy: userId } },
      { new: true, runValidators: true },
    ).exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<IStudyMode | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudyModeModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: userId } },
      { new: true },
    ).exec();
  }
}
