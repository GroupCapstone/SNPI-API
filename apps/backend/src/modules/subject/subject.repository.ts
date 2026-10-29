import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { ISubject } from './subject.model';
import { SubjectModel } from './subject.model';
import type { CreateSubjectDto, SubjectQueryFilters, UpdateSubjectDto } from './subject.types';

export class SubjectRepository {
  public async findWithFilters(
    filters: SubjectQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: ISubject[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      const searchFilter = { $or: [{ code: searchRegex }, { name: searchRegex }] };
      if (query.$or) {
        const scopeFilter = { $or: query.$or };
        delete query.$or;
        query.$and = [scopeFilter, searchFilter];
      } else {
        Object.assign(query, searchFilter);
      }
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SubjectModel.find(query).sort({ code: 1 }).skip(skip).limit(limit).exec(),
      SubjectModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<ISubject | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return SubjectModel.findOne({
      _id: id,
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();
  }

  public async findByCode(
    code: string,
    excludeId?: string,
    schoolId?: string,
  ): Promise<ISubject | null> {
    const subject = await SubjectModel.findOne({
      code: code.toUpperCase(),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();

    if (!subject) return null;
    if (excludeId && String(subject._id) === String(excludeId)) {
      return null;
    }
    return subject;
  }

  public async create(dto: CreateSubjectDto, userId?: string): Promise<ISubject> {
    const docData: Record<string, unknown> = {
      ...dto,
      code: dto.code.toUpperCase(),
    };

    if (dto.schoolId && Types.ObjectId.isValid(dto.schoolId)) {
      docData.schoolId = new Types.ObjectId(dto.schoolId);
    }
    if (dto.branchId && Types.ObjectId.isValid(dto.branchId)) {
      docData.branchId = new Types.ObjectId(dto.branchId);
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    return SubjectModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdateSubjectDto,
    userId?: string,
    schoolId?: string,
  ): Promise<ISubject | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const updateData: Record<string, unknown> = {
      ...dto,
    };

    delete updateData._id;
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (dto.code) {
      updateData.code = dto.code.toUpperCase();
    }
    if (dto.branchId && Types.ObjectId.isValid(dto.branchId)) {
      updateData.branchId = new Types.ObjectId(dto.branchId);
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    } else {
      delete updateData.updatedBy;
    }

    return SubjectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<ISubject | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      isDeleted: true,
      status: 'archived',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    }

    return SubjectModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }
}
