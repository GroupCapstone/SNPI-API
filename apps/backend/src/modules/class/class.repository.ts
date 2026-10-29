import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import { ClassScheduleModel } from '../class-schedule/class-schedule.model';
import type { IClass } from './class.model';
import { ClassModel } from './class.model';
import type {
  ClassAvailabilitySummary,
  ClassQueryFilters,
  CreateClassDto,
  UpdateClassDto,
} from './class.types';

export class ClassRepository {
  public async findWithFilters(
    filters: ClassQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: IClass[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.authorizedClassIds) {
      query._id = {
        $in: filters.authorizedClassIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
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

    if (filters.offeringId && Types.ObjectId.isValid(filters.offeringId)) {
      query.offeringId = new Types.ObjectId(filters.offeringId);
    }

    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }

    if (filters.levelId && Types.ObjectId.isValid(filters.levelId)) {
      query.levelId = new Types.ObjectId(filters.levelId);
    }

    if (filters.curriculumId && Types.ObjectId.isValid(filters.curriculumId)) {
      query.curriculumId = new Types.ObjectId(filters.curriculumId);
    }

    if (filters.studyModeId && Types.ObjectId.isValid(filters.studyModeId)) {
      query.studyModeId = new Types.ObjectId(filters.studyModeId);
    }
    if (filters.sessionType) {
      const scheduleMatches = await ClassScheduleModel.find({
        ...(filters.schoolId && Types.ObjectId.isValid(filters.schoolId)
          ? { schoolId: new Types.ObjectId(filters.schoolId) }
          : {}),
        isDeleted: false,
        status: 'active',
        sessionType: filters.sessionType,
      })
        .select('classId')
        .lean()
        .exec();
      const classIds = [...new Set(scheduleMatches.map((item) => String(item.classId)))];
      if (classIds.length === 0) {
        return { data: [], total: 0 };
      }
      query._id = { $in: classIds.map((id) => new Types.ObjectId(id)) };
    }
    if (filters.classTeacherId && Types.ObjectId.isValid(filters.classTeacherId)) {
      query.classTeacherId = new Types.ObjectId(filters.classTeacherId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.shift) {
      query.shift = filters.shift;
    }

    if (filters.availability && filters.availability !== 'all') {
      if (filters.availability === 'available') {
        if (!filters.status) {
          query.status = { $in: ['planned', 'active'] };
        }
        query.$expr = {
          $lt: [{ $ifNull: ['$currentEnrollmentCount', 0] }, '$capacity'],
        };
      } else if (filters.availability === 'near_capacity') {
        if (!filters.status) {
          query.status = { $in: ['planned', 'active'] };
        }
        query.$expr = {
          $and: [
            { $gt: [{ $ifNull: ['$currentEnrollmentCount', 0] }, 0] },
            { $lt: [{ $ifNull: ['$currentEnrollmentCount', 0] }, '$capacity'] },
            {
              $or: [
                {
                  $gte: [
                    {
                      $divide: [
                        { $ifNull: ['$currentEnrollmentCount', 0] },
                        { $cond: [{ $gt: ['$capacity', 0] }, '$capacity', 1] },
                      ],
                    },
                    0.8,
                  ],
                },
                {
                  $lte: [
                    {
                      $subtract: [
                        { $ifNull: ['$capacity', 0] },
                        { $ifNull: ['$currentEnrollmentCount', 0] },
                      ],
                    },
                    3,
                  ],
                },
              ],
            },
          ],
        };
      } else if (filters.availability === 'full') {
        if (!filters.status) {
          query.status = { $in: ['planned', 'active'] };
        }
        query.$expr = {
          $and: [
            { $gt: [{ $ifNull: ['$capacity', 0] }, 0] },
            { $gte: [{ $ifNull: ['$currentEnrollmentCount', 0] }, '$capacity'] },
          ],
        };
      } else if (filters.availability === 'closed') {
        query.status = { $in: ['completed', 'cancelled'] };
      }
    }

    if (filters.timeSlotId && Types.ObjectId.isValid(filters.timeSlotId)) {
      const scheduleMatches = await ClassScheduleModel.find({
        ...(filters.schoolId && Types.ObjectId.isValid(filters.schoolId)
          ? { schoolId: new Types.ObjectId(filters.schoolId) }
          : {}),
        isDeleted: false,
        status: 'active',
        timeSlotId: new Types.ObjectId(filters.timeSlotId),
      })
        .select('classId')
        .lean()
        .exec();
      const classIds = [...new Set(scheduleMatches.map((item) => String(item.classId)))];
      if (classIds.length === 0) {
        return { data: [], total: 0 };
      }
      query._id = { $in: classIds.map((id) => new Types.ObjectId(id)) };
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ classCode: searchRegex }, { className: searchRegex }];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ClassModel.find(query)
        .populate('branchId', 'branchCode branchNameEn branchNameKh')
        .populate('academicYearId', 'name code isCurrent')
        .populate('academicPeriodId', 'code name type startDate endDate')
        .populate('offeringId', 'code name status')
        .populate('programId', 'code nameEn nameKh shortName')
        .populate('levelId', 'code name sequence')
        .populate('studyModeId', 'code nameEn nameKh')
        .populate('classTeacherId', 'employeeId firstName lastName khmerName')
        .populate('curriculumId', 'code name status')
        .populate('classroomId', 'code name building floor capacity')
        .populate('defaultClassroomId', 'code name building floor capacity')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ClassModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<IClass | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return ClassModel.findOne({
      _id: id,
      isDeleted: false,
      ...(schoolId && Types.ObjectId.isValid(schoolId)
        ? { schoolId: new Types.ObjectId(schoolId) }
        : {}),
    })
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .populate('academicYearId', 'name code isCurrent')
      .populate('academicPeriodId', 'code name type startDate endDate')
      .populate('offeringId', 'code name status')
      .populate('programId', 'code nameEn nameKh shortName')
      .populate('levelId', 'code name sequence')
      .populate('studyModeId', 'code nameEn nameKh')
      .populate('classTeacherId', 'employeeId firstName lastName khmerName')
      .populate('curriculumId', 'code name status')
      .populate('classroomId', 'code name building floor capacity')
      .populate('defaultClassroomId', 'code name building floor capacity')
      .exec();
  }

  public async findByBranchYearAndCode(
    branchId: string,
    academicYearId: string,
    classCode: string,
    excludeId?: string,
  ): Promise<IClass | null> {
    if (!Types.ObjectId.isValid(branchId) || !Types.ObjectId.isValid(academicYearId)) return null;
    const item = await ClassModel.findOne({
      branchId: new Types.ObjectId(branchId),
      academicYearId: new Types.ObjectId(academicYearId),
      classCode: classCode.toUpperCase(),
      isDeleted: false,
    }).exec();

    if (!item) return null;
    if (excludeId && String(item._id) === String(excludeId)) {
      return null;
    }
    return item;
  }

  public async create(dto: CreateClassDto, userId?: string): Promise<IClass> {
    const docData: Record<string, unknown> = {
      capacity: dto.capacity ?? 30,
      shift: dto.shift ?? 'morning',
      daysPattern: dto.daysPattern ?? 'MON_FRI',
      status: dto.status ?? 'planned',
      branchId: new Types.ObjectId(dto.branchId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      programId: new Types.ObjectId(dto.programId),
      levelId: new Types.ObjectId(dto.levelId),
      classCode: dto.classCode ? dto.classCode.toUpperCase() : '',
      className: dto.className ?? '',
      section: dto.section ? dto.section.toUpperCase().trim() : 'A',
    };

    if (dto.selectedDays && Array.isArray(dto.selectedDays)) {
      docData.selectedDays = dto.selectedDays;
    }
    if (dto.startTime && typeof dto.startTime === 'string' && dto.startTime.trim()) {
      docData.startTime = dto.startTime.trim();
    }
    if (dto.endTime && typeof dto.endTime === 'string' && dto.endTime.trim()) {
      docData.endTime = dto.endTime.trim();
    }
    if (dto.studyModeId && Types.ObjectId.isValid(dto.studyModeId)) {
      docData.studyModeId = new Types.ObjectId(dto.studyModeId);
    }
    if (dto.defaultClassroomId && Types.ObjectId.isValid(dto.defaultClassroomId)) {
      docData.defaultClassroomId = new Types.ObjectId(dto.defaultClassroomId);
    }
    if (dto.classTeacherId && Types.ObjectId.isValid(dto.classTeacherId)) {
      docData.classTeacherId = new Types.ObjectId(dto.classTeacherId);
    }
    if (dto.schoolId && Types.ObjectId.isValid(dto.schoolId)) {
      docData.schoolId = new Types.ObjectId(dto.schoolId);
    }
    if (dto.academicPeriodId && Types.ObjectId.isValid(dto.academicPeriodId)) {
      docData.academicPeriodId = new Types.ObjectId(dto.academicPeriodId);
    }
    if (dto.offeringId && Types.ObjectId.isValid(dto.offeringId)) {
      docData.offeringId = new Types.ObjectId(dto.offeringId);
    }
    if (dto.curriculumId && Types.ObjectId.isValid(dto.curriculumId)) {
      docData.curriculumId = new Types.ObjectId(dto.curriculumId);
    }
    if (dto.classroomId && Types.ObjectId.isValid(dto.classroomId)) {
      docData.classroomId = new Types.ObjectId(dto.classroomId);
    }
    if (dto.startDate) {
      const d = new Date(dto.startDate);
      if (!isNaN(d.getTime())) docData.startDate = d;
    }
    if (dto.endDate) {
      const d = new Date(dto.endDate);
      if (!isNaN(d.getTime())) docData.endDate = d;
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    return ClassModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdateClassDto,
    userId?: string,
    schoolId?: string,
  ): Promise<IClass | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {};

    if (dto.branchId && Types.ObjectId.isValid(dto.branchId)) {
      updateData.branchId = new Types.ObjectId(dto.branchId);
    }
    if (dto.academicYearId && Types.ObjectId.isValid(dto.academicYearId)) {
      updateData.academicYearId = new Types.ObjectId(dto.academicYearId);
    }
    if (dto.programId && Types.ObjectId.isValid(dto.programId)) {
      updateData.programId = new Types.ObjectId(dto.programId);
    }
    if (dto.levelId && Types.ObjectId.isValid(dto.levelId)) {
      updateData.levelId = new Types.ObjectId(dto.levelId);
    }
    if (dto.classCode) {
      updateData.classCode = dto.classCode.toUpperCase().trim();
    }
    if (dto.className !== undefined) {
      updateData.className = dto.className.trim();
    }
    if (dto.capacity !== undefined) {
      updateData.capacity = dto.capacity;
    }
    if (dto.shift !== undefined) {
      updateData.shift = dto.shift;
    }
    if (dto.daysPattern !== undefined) {
      updateData.daysPattern = dto.daysPattern;
    }
    if (dto.selectedDays !== undefined && Array.isArray(dto.selectedDays)) {
      updateData.selectedDays = dto.selectedDays;
    }
    if (dto.startTime !== undefined) {
      updateData.startTime = dto.startTime && dto.startTime.trim() ? dto.startTime.trim() : null;
    }
    if (dto.endTime !== undefined) {
      updateData.endTime = dto.endTime && dto.endTime.trim() ? dto.endTime.trim() : null;
    }
    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }
    if (dto.academicPeriodId !== undefined) {
      updateData.academicPeriodId =
        dto.academicPeriodId && Types.ObjectId.isValid(dto.academicPeriodId)
          ? new Types.ObjectId(dto.academicPeriodId)
          : null;
    }
    if (dto.offeringId !== undefined) {
      updateData.offeringId =
        dto.offeringId && Types.ObjectId.isValid(dto.offeringId)
          ? new Types.ObjectId(dto.offeringId)
          : null;
    }
    if (dto.studyModeId !== undefined) {
      updateData.studyModeId =
        dto.studyModeId && Types.ObjectId.isValid(dto.studyModeId)
          ? new Types.ObjectId(dto.studyModeId)
          : null;
    }
    if (dto.section !== undefined) {
      updateData.section = dto.section ? dto.section.toUpperCase().trim() : 'A';
    }
    if (dto.defaultClassroomId !== undefined) {
      updateData.defaultClassroomId =
        dto.defaultClassroomId && Types.ObjectId.isValid(dto.defaultClassroomId)
          ? new Types.ObjectId(dto.defaultClassroomId)
          : null;
    }
    if (dto.classTeacherId !== undefined) {
      updateData.classTeacherId =
        dto.classTeacherId && Types.ObjectId.isValid(dto.classTeacherId)
          ? new Types.ObjectId(dto.classTeacherId)
          : null;
    }
    if (dto.curriculumId !== undefined) {
      updateData.curriculumId =
        dto.curriculumId && Types.ObjectId.isValid(dto.curriculumId)
          ? new Types.ObjectId(dto.curriculumId)
          : null;
    }
    if (dto.classroomId !== undefined) {
      updateData.classroomId =
        dto.classroomId && Types.ObjectId.isValid(dto.classroomId)
          ? new Types.ObjectId(dto.classroomId)
          : null;
    }
    if (dto.startDate !== undefined) {
      if (dto.startDate) {
        const d = new Date(dto.startDate);
        updateData.startDate = !isNaN(d.getTime()) ? d : null;
      } else {
        updateData.startDate = null;
      }
    }
    if (dto.endDate !== undefined) {
      if (dto.endDate) {
        const d = new Date(dto.endDate);
        updateData.endDate = !isNaN(d.getTime()) ? d : null;
      } else {
        updateData.endDate = null;
      }
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    } else {
      delete updateData.updatedBy;
    }

    return ClassModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        isDeleted: false,
        ...(schoolId && Types.ObjectId.isValid(schoolId)
          ? { schoolId: new Types.ObjectId(schoolId) }
          : {}),
      },
      { $set: updateData },
      { returnDocument: 'after' },
    )
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .populate('academicYearId', 'name code isCurrent')
      .populate('academicPeriodId', 'code name type startDate endDate')
      .populate('offeringId', 'code name status')
      .populate('programId', 'code nameEn nameKh shortName')
      .populate('levelId', 'code name sequence')
      .populate('studyModeId', 'code nameEn nameKh')
      .populate('classTeacherId', 'employeeId firstName lastName khmerName')
      .populate('curriculumId', 'code name status')
      .populate('classroomId', 'code name building floor capacity')
      .populate('defaultClassroomId', 'code name building floor capacity')
      .exec();
  }

  public async softDelete(id: string, userId?: string, schoolId?: string): Promise<IClass | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      isDeleted: true,
      status: 'cancelled',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    }

    return ClassModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        isDeleted: false,
        ...(schoolId && Types.ObjectId.isValid(schoolId)
          ? { schoolId: new Types.ObjectId(schoolId) }
          : {}),
      },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }

  public async getAvailabilitySummary(
    filters: ClassQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<ClassAvailabilitySummary> {
    const matchQuery: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      matchQuery.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.authorizedClassIds) {
      matchQuery._id = {
        $in: filters.authorizedClassIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      matchQuery.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      matchQuery.academicYearId = new Types.ObjectId(filters.academicYearId);
    }

    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      matchQuery.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }

    if (filters.offeringId && Types.ObjectId.isValid(filters.offeringId)) {
      matchQuery.offeringId = new Types.ObjectId(filters.offeringId);
    }

    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      matchQuery.programId = new Types.ObjectId(filters.programId);
    }

    if (filters.levelId && Types.ObjectId.isValid(filters.levelId)) {
      matchQuery.levelId = new Types.ObjectId(filters.levelId);
    }

    if (filters.studyModeId && Types.ObjectId.isValid(filters.studyModeId)) {
      matchQuery.studyModeId = new Types.ObjectId(filters.studyModeId);
    }

    if (filters.shift) {
      matchQuery.shift = filters.shift;
    }

    if (filters.status) {
      matchQuery.status = filters.status;
    }

    const summaryResults = await ClassModel.aggregate([
      { $match: matchQuery },
      {
        $project: {
          status: 1,
          capacity: { $ifNull: ['$capacity', 0] },
          currentEnrollmentCount: { $ifNull: ['$currentEnrollmentCount', 0] },
          isFull: {
            $and: [
              { $in: ['$status', ['planned', 'active']] },
              { $gt: [{ $ifNull: ['$capacity', 0] }, 0] },
              {
                $gte: [{ $ifNull: ['$currentEnrollmentCount', 0] }, { $ifNull: ['$capacity', 0] }],
              },
            ],
          },
          isAvailable: {
            $and: [
              { $in: ['$status', ['planned', 'active']] },
              { $lt: [{ $ifNull: ['$currentEnrollmentCount', 0] }, { $ifNull: ['$capacity', 0] }] },
            ],
          },
          isNearCapacity: {
            $and: [
              { $in: ['$status', ['planned', 'active']] },
              { $gt: [{ $ifNull: ['$currentEnrollmentCount', 0] }, 0] },
              { $lt: [{ $ifNull: ['$currentEnrollmentCount', 0] }, { $ifNull: ['$capacity', 0] }] },
              {
                $or: [
                  {
                    $gte: [
                      {
                        $divide: [
                          { $ifNull: ['$currentEnrollmentCount', 0] },
                          { $cond: [{ $gt: ['$capacity', 0] }, '$capacity', 1] },
                        ],
                      },
                      0.8,
                    ],
                  },
                  {
                    $lte: [
                      {
                        $subtract: [
                          { $ifNull: ['$capacity', 0] },
                          { $ifNull: ['$currentEnrollmentCount', 0] },
                        ],
                      },
                      3,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalClasses: { $sum: 1 },
          availableClasses: { $sum: { $cond: ['$isAvailable', 1, 0] } },
          nearCapacityClasses: { $sum: { $cond: ['$isNearCapacity', 1, 0] } },
          fullClasses: { $sum: { $cond: ['$isFull', 1, 0] } },
          completedOrCancelledClasses: {
            $sum: { $cond: [{ $in: ['$status', ['completed', 'cancelled']] }, 1, 0] },
          },
          totalCapacity: {
            $sum: {
              $cond: [{ $in: ['$status', ['planned', 'active']] }, '$capacity', 0],
            },
          },
          totalEnrolled: {
            $sum: {
              $cond: [{ $in: ['$status', ['planned', 'active']] }, '$currentEnrollmentCount', 0],
            },
          },
        },
      },
    ]).exec();

    const row = summaryResults[0] ?? {
      totalClasses: 0,
      availableClasses: 0,
      nearCapacityClasses: 0,
      fullClasses: 0,
      completedOrCancelledClasses: 0,
      totalCapacity: 0,
      totalEnrolled: 0,
    };

    const occupancyRate =
      row.totalCapacity > 0 ? Math.round((row.totalEnrolled / row.totalCapacity) * 1000) / 10 : 0;

    return {
      totalClasses: row.totalClasses,
      availableClasses: row.availableClasses,
      nearCapacityClasses: row.nearCapacityClasses,
      fullClasses: row.fullClasses,
      completedOrCancelledClasses: row.completedOrCancelledClasses,
      totalCapacity: row.totalCapacity,
      totalEnrolled: row.totalEnrolled,
      occupancyRate,
    };
  }
}
