import { Types } from 'mongoose';

import { AttendanceRecordModel } from '../attendance/attendance-record.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { AttendanceLeaveModel, type IAttendanceLeave } from './attendance-leave.model';
import type {
  AttendanceLeaveFilters,
  CreateAttendanceLeaveDto,
  ReviewAttendanceLeaveDto,
} from './attendance-leave.types';

export class AttendanceLeaveRepository {
  public async findMany(
    schoolId: string,
    filters: AttendanceLeaveFilters,
    branchIds?: string[],
  ): Promise<{ data: IAttendanceLeave[]; total: number; page: number; limit: number }> {
    const query: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      isDeleted: false,
    };
    if (filters.branchId) query.branchId = new Types.ObjectId(filters.branchId);
    else if (branchIds) query.branchId = { $in: branchIds.map((id) => new Types.ObjectId(id)) };
    if (filters.authorizedClassIds) {
      query.classId = {
        $in: filters.authorizedClassIds.map((id) => new Types.ObjectId(id)),
      };
    } else if (filters.classId) query.classId = new Types.ObjectId(filters.classId);
    if (filters.studentId) query.studentId = new Types.ObjectId(filters.studentId);
    if (filters.status) query.status = filters.status;
    if (filters.leaveType) query.leaveType = filters.leaveType;
    if (filters.startDate || filters.endDate) {
      query.startDate = {};
      if (filters.startDate)
        (query.startDate as Record<string, unknown>).$gte = new Date(filters.startDate);
      if (filters.endDate)
        (query.startDate as Record<string, unknown>).$lte = new Date(filters.endDate);
    }
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const [data, total] = await Promise.all([
      AttendanceLeaveModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName')
        .populate('classId', 'classCode className')
        .populate('branchId', 'branchCode branchNameEn branchNameKh')
        .sort({ startDate: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      AttendanceLeaveModel.countDocuments(query).exec(),
    ]);
    return { data, total, page, limit };
  }

  public findById(id: string, schoolId: string): Promise<IAttendanceLeave | null> {
    return AttendanceLeaveModel.findOne({
      _id: new Types.ObjectId(id),
      schoolId: new Types.ObjectId(schoolId),
      isDeleted: false,
    }).exec();
  }

  public findOverlap(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IAttendanceLeave | null> {
    return AttendanceLeaveModel.findOne({
      studentId: new Types.ObjectId(studentId),
      status: { $in: ['pending', 'approved'] },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
      isDeleted: false,
    }).exec();
  }

  public create(
    schoolId: string,
    dto: CreateAttendanceLeaveDto,
    userId: string,
  ): Promise<IAttendanceLeave> {
    return AttendanceLeaveModel.create({
      ...dto,
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      studentId: new Types.ObjectId(dto.studentId),
      enrollmentId: new Types.ObjectId(dto.enrollmentId),
      classId: new Types.ObjectId(dto.classId),
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public review(
    id: string,
    schoolId: string,
    dto: ReviewAttendanceLeaveDto,
    userId: string,
  ): Promise<IAttendanceLeave | null> {
    return AttendanceLeaveModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), schoolId: new Types.ObjectId(schoolId), isDeleted: false },
      {
        $set: {
          status: dto.status,
          reviewNotes: dto.reviewNotes,
          reviewedAt: new Date(),
          reviewedBy: userId,
          updatedBy: userId,
        },
      },
      { new: true },
    ).exec();
  }

  public async applyApprovedLeaveToAttendance(
    leave: IAttendanceLeave,
    userId: string,
  ): Promise<void> {
    const sessions = await AttendanceModel.find({
      schoolId: leave.schoolId,
      branchId: leave.branchId,
      classId: leave.classId,
      date: { $gte: leave.startDate, $lte: leave.endDate },
      isDeleted: false,
    })
      .select('_id')
      .lean()
      .exec();

    if (sessions.length === 0) return;

    await AttendanceRecordModel.updateMany(
      {
        attendanceSessionId: { $in: sessions.map((session) => session._id) },
        studentId: leave.studentId,
        isDeleted: false,
      },
      {
        $set: {
          status: 'excused',
          remarks: leave.reason,
          markedBy: userId,
          markedAt: new Date(),
        },
      },
    ).exec();
  }
}
