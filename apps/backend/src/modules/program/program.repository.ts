import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IProgram } from './program.model';
import { ProgramModel } from './program.model';
import type { CreateProgramDto, ProgramQueryFilters, UpdateProgramDto } from './program.types';

export class ProgramRepository {
  public async findWithFilters(
    filters: ProgramQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: IProgram[]; total: number }> {
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
      const searchFilter = {
        $or: [{ code: searchRegex }, { nameEn: searchRegex }, { nameKh: searchRegex }],
      };
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
      ProgramModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ProgramModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<IProgram | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ProgramModel.findOne({
      _id: id,
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();
  }

  public async findByCode(
    code: string,
    excludeId?: string,
    schoolId?: string,
  ): Promise<IProgram | null> {
    const program = await ProgramModel.findOne({
      code: code.toUpperCase(),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();

    if (!program) return null;
    if (excludeId && String(program._id) === String(excludeId)) {
      return null;
    }
    return program;
  }

  public async create(dto: CreateProgramDto, userId?: string): Promise<IProgram> {
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

    return ProgramModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdateProgramDto,
    userId?: string,
    schoolId?: string,
  ): Promise<IProgram | null> {
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

    return ProgramModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<IProgram | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      isDeleted: true,
      status: 'archived',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    }

    return ProgramModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }
}
