import { Types } from 'mongoose';

import type { IClassSchedule } from './class-schedule.model';
import { ClassScheduleModel } from './class-schedule.model';
import type {
  ClassScheduleQueryFilters,
  CreateClassScheduleDto,
  ScheduleConflictCheckParams,
  UpdateClassScheduleDto,
} from './class-schedule.types';

export class ClassScheduleRepository {
  public async findWithFilters(
    filters: ClassScheduleQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: IClassSchedule[]; total: number }> {
    const query: Record<string, unknown> = { isDeleted: false, ...branchFilter };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.classId && Types.ObjectId.isValid(filters.classId)) {
      query.classId = new Types.ObjectId(filters.classId);
    }
    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }
    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }
    if (filters.dayOfWeek !== undefined) {
      query.dayOfWeek = filters.dayOfWeek;
    }
    if (filters.sessionType) {
      query.sessionType = filters.sessionType;
    }
    if (filters.teacherId && Types.ObjectId.isValid(filters.teacherId)) {
      query.teacherId = new Types.ObjectId(filters.teacherId);
    }
    if (filters.classroomId && Types.ObjectId.isValid(filters.classroomId)) {
      query.classroomId = new Types.ObjectId(filters.classroomId);
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ClassScheduleModel.find(query)
        .populate('classId', 'classCode className capacity programId levelId studyModeId section')
        .populate('subjectId', 'code name')
        .populate('teacherId', 'employeeId firstName lastName khmerName')
        .populate('classroomId', 'code name building floor capacity')
        .populate('timeSlotId', 'code name startTime endTime sessionType')
        .sort({ dayOfWeek: 1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ClassScheduleModel.countDocuments(query),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<IClassSchedule | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ClassScheduleModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
      ...(schoolId && Types.ObjectId.isValid(schoolId)
        ? { schoolId: new Types.ObjectId(schoolId) }
        : {}),
    })
      .populate('classId')
      .populate('subjectId')
      .populate('teacherId')
      .populate('classroomId')
      .populate('timeSlotId')
      .exec();
  }

  public async findByClassId(classId: string, schoolId?: string): Promise<IClassSchedule[]> {
    if (!Types.ObjectId.isValid(classId)) return [];
    return ClassScheduleModel.find({
      classId: new Types.ObjectId(classId),
      isDeleted: false,
      ...(schoolId && Types.ObjectId.isValid(schoolId)
        ? { schoolId: new Types.ObjectId(schoolId) }
        : {}),
    })
      .populate('subjectId', 'code name')
      .populate('teacherId', 'employeeId firstName lastName khmerName')
      .populate('classroomId', 'code name building floor capacity')
      .populate('timeSlotId', 'code name startTime endTime sessionType')
      .sort({ dayOfWeek: 1, startTime: 1 })
      .exec();
  }

  public async findActiveOverlaps(params: ScheduleConflictCheckParams): Promise<IClassSchedule[]> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      status: 'active',
      dayOfWeek: params.dayOfWeek,
      startTime: { $lt: params.endTime },
      endTime: { $gt: params.startTime },
    };

    if (params.branchId && Types.ObjectId.isValid(params.branchId)) {
      query.branchId = new Types.ObjectId(params.branchId);
    }
    if (params.academicYearId && Types.ObjectId.isValid(params.academicYearId)) {
      query.academicYearId = new Types.ObjectId(params.academicYearId);
    }
    if (params.academicPeriodId && Types.ObjectId.isValid(params.academicPeriodId)) {
      query.$and = [
        {
          $or: [
            { academicPeriodId: new Types.ObjectId(params.academicPeriodId) },
            { academicPeriodId: { $exists: false } },
            { academicPeriodId: null },
          ],
        },
      ];
    }

    if (params.effectiveFrom || params.effectiveTo) {
      const activeRange = (query.$and as Record<string, unknown>[] | undefined) ?? [];
      const proposedStart = params.effectiveFrom ? new Date(params.effectiveFrom) : undefined;
      const proposedEnd = params.effectiveTo ? new Date(params.effectiveTo) : undefined;
      if (proposedEnd) {
        activeRange.push({
          $or: [
            { effectiveFrom: { $exists: false } },
            { effectiveFrom: null },
            { effectiveFrom: { $lte: proposedEnd } },
          ],
        });
      }
      if (proposedStart) {
        activeRange.push({
          $or: [
            { effectiveTo: { $exists: false } },
            { effectiveTo: null },
            { effectiveTo: { $gte: proposedStart } },
          ],
        });
      }
      if (activeRange.length > 0) query.$and = activeRange;
    }

    if (params.excludeScheduleId && Types.ObjectId.isValid(params.excludeScheduleId)) {
      query._id = { $ne: new Types.ObjectId(params.excludeScheduleId) };
    }

    const orConditions: Array<Record<string, unknown>> = [];
    if (params.teacherId && Types.ObjectId.isValid(params.teacherId)) {
      orConditions.push({ teacherId: new Types.ObjectId(params.teacherId) });
    }
    if (params.classroomId && Types.ObjectId.isValid(params.classroomId)) {
      orConditions.push({ classroomId: new Types.ObjectId(params.classroomId) });
    }
    if (params.classId && Types.ObjectId.isValid(params.classId)) {
      orConditions.push({ classId: new Types.ObjectId(params.classId) });
    }

    if (orConditions.length === 0) return [];
    query.$or = orConditions;

    return ClassScheduleModel.find(query)
      .populate('classId', 'classCode className')
      .populate('teacherId', 'employeeId firstName lastName')
      .populate('classroomId', 'code name')
      .exec();
  }

  public async create(dto: CreateClassScheduleDto, userId?: string): Promise<IClassSchedule> {
    return ClassScheduleModel.create({
      ...dto,
      schoolId: dto.schoolId ? new Types.ObjectId(dto.schoolId) : undefined,
      classId: new Types.ObjectId(dto.classId),
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : undefined,
      academicYearId: dto.academicYearId ? new Types.ObjectId(dto.academicYearId) : undefined,
      academicPeriodId: dto.academicPeriodId ? new Types.ObjectId(dto.academicPeriodId) : undefined,
      timeSlotId: dto.timeSlotId ? new Types.ObjectId(dto.timeSlotId) : undefined,
      subjectId: dto.subjectId ? new Types.ObjectId(dto.subjectId) : undefined,
      teacherId: dto.teacherId ? new Types.ObjectId(dto.teacherId) : undefined,
      teacherAssignmentId: dto.teacherAssignmentId
        ? new Types.ObjectId(dto.teacherAssignmentId)
        : undefined,
      classroomId: dto.classroomId ? new Types.ObjectId(dto.classroomId) : undefined,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async update(
    id: string,
    dto: UpdateClassScheduleDto,
    userId?: string,
    schoolId?: string,
  ): Promise<IClassSchedule | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const updateSet: Record<string, unknown> = { updatedBy: userId };
    if (dto.dayOfWeek !== undefined) updateSet.dayOfWeek = dto.dayOfWeek;
    if (dto.timeSlotId !== undefined) {
      updateSet.timeSlotId = dto.timeSlotId ? new Types.ObjectId(dto.timeSlotId) : null;
    }
    if (dto.sessionType !== undefined) updateSet.sessionType = dto.sessionType;
    if (dto.startTime !== undefined) updateSet.startTime = dto.startTime;
    if (dto.endTime !== undefined) updateSet.endTime = dto.endTime;
    if (dto.subjectId !== undefined) {
      updateSet.subjectId = dto.subjectId ? new Types.ObjectId(dto.subjectId) : null;
    }
    if (dto.teacherId !== undefined) {
      updateSet.teacherId = dto.teacherId ? new Types.ObjectId(dto.teacherId) : null;
    }
    if (dto.teacherAssignmentId !== undefined) {
      updateSet.teacherAssignmentId = dto.teacherAssignmentId
        ? new Types.ObjectId(dto.teacherAssignmentId)
        : null;
    }
    if (dto.classroomId !== undefined) {
      updateSet.classroomId = dto.classroomId ? new Types.ObjectId(dto.classroomId) : null;
    }
    if (dto.effectiveFrom !== undefined)
      updateSet.effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : null;
    if (dto.effectiveTo !== undefined)
      updateSet.effectiveTo = dto.effectiveTo ? new Date(dto.effectiveTo) : null;
    if (dto.status !== undefined) updateSet.status = dto.status;

    return ClassScheduleModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        isDeleted: false,
        ...(schoolId && Types.ObjectId.isValid(schoolId)
          ? { schoolId: new Types.ObjectId(schoolId) }
          : {}),
      },
      { $set: updateSet },
      { new: true, runValidators: true },
    )
      .populate('classId')
      .populate('subjectId')
      .populate('teacherId')
      .populate('classroomId')
      .populate('timeSlotId')
      .exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<IClassSchedule | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ClassScheduleModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        isDeleted: false,
        ...(schoolId && Types.ObjectId.isValid(schoolId)
          ? { schoolId: new Types.ObjectId(schoolId) }
          : {}),
      },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: userId } },
      { new: true },
    ).exec();
  }
}
