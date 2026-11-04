import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { ISchool } from './school.model';
import { SchoolModel } from './school.model';
import type { CreateSchoolDto, SchoolQueryFilters, UpdateSchoolDto } from './school.types';

export class SchoolRepository {
  public async findWithFilters(
    filters: SchoolQueryFilters,
  ): Promise<{ data: ISchool[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { code: searchRegex },
        { nameEn: searchRegex },
        { nameKh: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SchoolModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      SchoolModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<ISchool | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return SchoolModel.findOne({ _id: new Types.ObjectId(id), isDeleted: false }).exec();
  }

  public async findByCode(code: string, excludeId?: string): Promise<ISchool | null> {
    const school = await SchoolModel.findOne({
      code: code.toUpperCase(),
      isDeleted: false,
    }).exec();

    if (!school) {
      return null;
    }

    if (excludeId && String(school._id) === String(excludeId)) {
      return null;
    }

    return school;
  }

  public async create(dto: CreateSchoolDto, userId?: string): Promise<ISchool> {
    const docData: Record<string, unknown> = {
      ...dto,
      code: dto.code.toUpperCase(),
    };
    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    return SchoolModel.create(docData);
  }

  public async update(id: string, dto: UpdateSchoolDto, userId?: string): Promise<ISchool | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      ...dto,
      ...(dto.code ? { code: dto.code.toUpperCase() } : {}),
    };

    delete updatePayload._id;
    delete updatePayload.id;
    delete updatePayload.createdAt;
    delete updatePayload.updatedAt;

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    } else {
      delete updatePayload.updatedBy;
    }

    return SchoolModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updatePayload },
      { returnDocument: 'after' },
    ).exec();
  }

  public async softDelete(id: string, userId?: string): Promise<ISchool | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      isDeleted: true,
      status: 'inactive',
    };

    delete updatePayload._id;
    delete updatePayload.id;

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    } else {
      delete updatePayload.updatedBy;
    }

    return SchoolModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updatePayload },
      { new: true },
    ).exec();
  }
}
