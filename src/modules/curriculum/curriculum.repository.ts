import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { ICurriculum } from './curriculum.model';
import { CurriculumModel } from './curriculum.model';
import type {
  CreateCurriculumDto,
  CurriculumQueryFilters,
  UpdateCurriculumDto,
} from './curriculum.types';

export class CurriculumRepository {
  public async findWithFilters(
    filters: CurriculumQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: ICurriculum[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }
    if (filters.levelId && Types.ObjectId.isValid(filters.levelId)) {
      query.levelId = new Types.ObjectId(filters.levelId);
    }
    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ code: searchRegex }, { name: searchRegex }, { description: searchRegex }];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      CurriculumModel.find(query)
        .populate('schoolId', 'code nameEn nameKh')
        .populate('programId', 'code nameEn nameKh shortName')
        .populate('levelId', 'code name sequence')
        .populate('academicYearId', 'year name isCurrent')
        .populate('subjects.subjectId', 'code name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      CurriculumModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<ICurriculum | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return CurriculumModel.findOne({ _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('programId', 'code nameEn nameKh shortName')
      .populate('levelId', 'code name sequence')
      .populate('academicYearId', 'year name isCurrent')
      .populate('subjects.subjectId', 'code name category')
      .exec();
  }

  public async findByCode(
    code: string,
    excludeId?: string,
    schoolId?: string,
  ): Promise<ICurriculum | null> {
    const curriculum = await CurriculumModel.findOne({
      code: code.toUpperCase(),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();

    if (!curriculum) return null;
    if (excludeId && String(curriculum._id) === String(excludeId)) {
      return null;
    }
    return curriculum;
  }

  public async findByProgramLevelYear(
    programId: string,
    levelId: string,
    academicYearId: string,
    excludeId?: string,
    schoolId?: string,
  ): Promise<ICurriculum | null> {
    if (
      !Types.ObjectId.isValid(programId) ||
      !Types.ObjectId.isValid(levelId) ||
      !Types.ObjectId.isValid(academicYearId)
    ) {
      return null;
    }

    const curriculum = await CurriculumModel.findOne({
      programId: new Types.ObjectId(programId),
      levelId: new Types.ObjectId(levelId),
      academicYearId: new Types.ObjectId(academicYearId),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();

    if (!curriculum) return null;
    if (excludeId && String(curriculum._id) === String(excludeId)) {
      return null;
    }
    return curriculum;
  }

  public async create(dto: CreateCurriculumDto, userId?: string): Promise<ICurriculum> {
    const docData: Record<string, unknown> = {
      ...dto,
      code: dto.code.toUpperCase(),
      programId: new Types.ObjectId(dto.programId),
      levelId: new Types.ObjectId(dto.levelId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      subjects: (dto.subjects || []).map((s) => ({
        ...s,
        subjectId: new Types.ObjectId(s.subjectId),
      })),
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

    return CurriculumModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdateCurriculumDto,
    userId?: string,
    schoolId?: string,
  ): Promise<ICurriculum | null> {
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
    if (dto.programId && Types.ObjectId.isValid(dto.programId)) {
      updateData.programId = new Types.ObjectId(dto.programId);
    }
    if (dto.levelId && Types.ObjectId.isValid(dto.levelId)) {
      updateData.levelId = new Types.ObjectId(dto.levelId);
    }
    if (dto.academicYearId && Types.ObjectId.isValid(dto.academicYearId)) {
      updateData.academicYearId = new Types.ObjectId(dto.academicYearId);
    }
    if (dto.branchId !== undefined) {
      updateData.branchId =
        dto.branchId && Types.ObjectId.isValid(dto.branchId)
          ? new Types.ObjectId(dto.branchId)
          : null;
    }
    if (dto.subjects) {
      updateData.subjects = dto.subjects.map((s) => ({
        ...s,
        subjectId: new Types.ObjectId(s.subjectId),
      }));
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    } else {
      delete updateData.updatedBy;
    }

    return CurriculumModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    )
      .populate('schoolId', 'code nameEn nameKh')
      .populate('programId', 'code nameEn nameKh shortName')
      .populate('levelId', 'code name sequence')
      .populate('academicYearId', 'year name isCurrent')
      .populate('subjects.subjectId', 'code name category')
      .exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<ICurriculum | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      isDeleted: true,
      status: 'archived',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    }

    return CurriculumModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }
}
