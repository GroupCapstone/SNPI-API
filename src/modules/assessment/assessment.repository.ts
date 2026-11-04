import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IAssessment } from './assessment.model';
import { AssessmentModel } from './assessment.model';
import type {
  AssessmentQueryFilters,
  CreateAssessmentDto,
  UpdateAssessmentDto,
} from './assessment.types';

export class AssessmentRepository {
  public async findWithFilters(
    filters: AssessmentQueryFilters,
    branchFilter?: string[],
  ): Promise<{ data: IAssessment[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.authorizedClassIds) {
      query.classId = {
        $in: filters.authorizedClassIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }
    if (filters.authorizedSubjectIds) {
      query.subjectId = {
        $in: filters.authorizedSubjectIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    } else if (branchFilter) {
      query.branchId = { $in: branchFilter.map((b) => new Types.ObjectId(b)) };
    }

    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }

    if (filters.classId && Types.ObjectId.isValid(filters.classId)) {
      query.classId = new Types.ObjectId(filters.classId);
    }

    if (filters.subjectId && Types.ObjectId.isValid(filters.subjectId)) {
      query.subjectId = new Types.ObjectId(filters.subjectId);
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ name: searchRegex }, { code: searchRegex }];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AssessmentModel.find(query)
        .populate('classId', 'className classCode')
        .populate('subjectId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name')
        .populate('classroomId', 'code name capacity building floor')
        .populate('proctorIds', 'employeeId firstName lastName khmerName')
        .sort({ assessmentDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      AssessmentModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<IAssessment | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return AssessmentModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
      ...(schoolId && Types.ObjectId.isValid(schoolId)
        ? { schoolId: new Types.ObjectId(schoolId) }
        : {}),
    })
      .populate('classId', 'className classCode')
      .populate('subjectId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name')
      .populate('classroomId', 'code name capacity building floor')
      .populate('proctorIds', 'employeeId firstName lastName khmerName')
      .exec();
  }

  public async findByCode(
    classId: string,
    subjectId: string,
    code: string,
    excludeId?: string,
  ): Promise<IAssessment | null> {
    if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(subjectId)) return null;
    const query: Record<string, unknown> = {
      classId: new Types.ObjectId(classId),
      subjectId: new Types.ObjectId(subjectId),
      code: code.toUpperCase(),
      isDeleted: false,
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }
    return AssessmentModel.findOne(query).exec();
  }

  public async create(dto: CreateAssessmentDto, userId?: string): Promise<IAssessment> {
    const docData: Record<string, unknown> = {
      ...dto,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      classId: new Types.ObjectId(dto.classId),
      subjectId: new Types.ObjectId(dto.subjectId),
      code: dto.code.toUpperCase(),
      assessmentDate: new Date(dto.assessmentDate),
      classroomId: dto.classroomId ? new Types.ObjectId(dto.classroomId) : undefined,
      proctorIds: (dto.proctorIds ?? []).map((id) => new Types.ObjectId(id)),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    return AssessmentModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdateAssessmentDto,
    userId?: string,
    schoolId?: string,
  ): Promise<IAssessment | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      ...dto,
      ...(dto.code ? { code: dto.code.toUpperCase() } : {}),
      ...(dto.assessmentDate ? { assessmentDate: new Date(dto.assessmentDate) } : {}),
      ...(dto.classroomId ? { classroomId: new Types.ObjectId(dto.classroomId) } : {}),
      ...(dto.proctorIds
        ? { proctorIds: dto.proctorIds.map((proctorId) => new Types.ObjectId(proctorId)) }
        : {}),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }

    return AssessmentModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        isDeleted: false,
        ...(schoolId && Types.ObjectId.isValid(schoolId)
          ? { schoolId: new Types.ObjectId(schoolId) }
          : {}),
      },
      { $set: updatePayload },
      { new: true },
    )
      .populate('classId', 'className classCode')
      .populate('subjectId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name')
      .populate('classroomId', 'code name capacity building floor')
      .populate('proctorIds', 'employeeId firstName lastName khmerName')
      .exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<IAssessment | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      isDeleted: true,
      status: 'closed',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }

    return AssessmentModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        isDeleted: false,
        ...(schoolId && Types.ObjectId.isValid(schoolId)
          ? { schoolId: new Types.ObjectId(schoolId) }
          : {}),
      },
      { $set: updatePayload },
      { new: true },
    ).exec();
  }
}
