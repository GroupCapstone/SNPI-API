import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import { AttendanceRecordModel } from './attendance-record.model';
import type { AttendanceStatus, IAttendance } from './attendance.model';
import { AttendanceModel } from './attendance.model';
import type { AttendanceQueryFilters } from './attendance.types';
import '../user/user.model';

export class AttendanceRepository {
  public async upsertAttendance(
    classId: string,
    date: Date,
    sessionType: string = 'morning',
    data: Partial<IAttendance>,
    session?: ClientSession,
  ): Promise<IAttendance> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const sessionData = { ...data };
    delete sessionData.records;
    return AttendanceModel.findOneAndUpdate(
      {
        classId: new Types.ObjectId(classId),
        date: startOfDay,
        sessionType,
        isDeleted: false,
      } as Record<string, unknown>,
      {
        ...sessionData,
        classId: new Types.ObjectId(classId),
        date: startOfDay,
        sessionType,
        isDeleted: false,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        ...(session ? { session } : {}),
      },
    )
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('classId', 'className classCode')
      .populate('takenBy', 'username email')
      .exec() as unknown as Promise<IAttendance>;
  }

  public async replaceRecords(
    attendance: IAttendance,
    records: Array<{
      studentId: Types.ObjectId;
      enrollmentId: Types.ObjectId;
      status: AttendanceStatus;
      remarks?: string;
    }>,
    userId: string,
    session?: ClientSession,
  ): Promise<void> {
    const attendanceSessionId = attendance._id as Types.ObjectId;
    const submittedStudentIds = records.map((record) => record.studentId);
    await AttendanceRecordModel.updateMany(
      {
        attendanceSessionId,
        studentId: { $nin: submittedStudentIds },
        isDeleted: false,
      },
      { $set: { isDeleted: true } },
      session ? { session } : undefined,
    );

    if (records.length === 0) return;
    await AttendanceRecordModel.bulkWrite(
      records.map((record) => ({
        updateOne: {
          filter: { attendanceSessionId, studentId: record.studentId },
          update: {
            $set: {
              schoolId: attendance.schoolId,
              branchId: attendance.branchId,
              academicYearId: attendance.academicYearId,
              academicPeriodId: attendance.academicPeriodId,
              classId: attendance.classId,
              enrollmentId: record.enrollmentId,
              status: record.status,
              remarks: record.remarks,
              markedBy: userId,
              markedAt: new Date(),
              isDeleted: false,
            },
            $setOnInsert: {
              attendanceSessionId,
              studentId: record.studentId,
            },
          },
          upsert: true,
        },
      })),
      session ? { session } : undefined,
    );
  }

  private async hydrateRecords(attendances: IAttendance[]): Promise<IAttendance[]> {
    if (attendances.length === 0) return attendances;
    const sessionIds = attendances.map((attendance) => attendance._id);
    const records = await AttendanceRecordModel.find({
      attendanceSessionId: { $in: sessionIds },
      isDeleted: false,
    })
      .populate('studentId', 'studentId firstName lastName khmerName gender')
      .sort({ studentId: 1 })
      .lean()
      .exec();
    const grouped = new Map<string, unknown[]>();
    for (const record of records) {
      const key = String(record.attendanceSessionId);
      grouped.set(key, [...(grouped.get(key) ?? []), record]);
    }
    for (const attendance of attendances) {
      const recs = grouped.get(String(attendance._id)) ?? [];
      if (
        typeof (attendance as unknown as { set?: (...args: unknown[]) => unknown }).set ===
        'function'
      ) {
        attendance.set('records', recs, { strict: false });
      } else {
        (attendance as unknown as { records: unknown[] }).records = recs;
      }
    }
    return attendances;
  }

  public async findByClassAndDate(
    classId: string,
    date: Date,
    sessionType?: string,
  ): Promise<IAttendance | null> {
    if (!Types.ObjectId.isValid(classId)) return null;

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const query: Record<string, unknown> = {
      classId: new Types.ObjectId(classId),
      date: startOfDay,
      isDeleted: false,
    };
    if (sessionType) {
      query.sessionType = sessionType;
    }

    const attendance = await AttendanceModel.findOne(query)
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('classId', 'className classCode')
      .populate('takenBy', 'username email')
      .exec();
    if (!attendance) return null;
    return (await this.hydrateRecords([attendance]))[0] ?? null;
  }

  public async findById(id: string): Promise<IAttendance | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const attendance = await AttendanceModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('classId', 'className classCode')
      .populate('takenBy', 'username email')
      .exec();
    if (!attendance) return null;
    return (await this.hydrateRecords([attendance]))[0] ?? null;
  }

  public async findAll(
    filters: AttendanceQueryFilters,
  ): Promise<{ data: IAttendance[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.authorizedClassIds) {
      query.classId = {
        $in: filters.authorizedClassIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }
    if (filters.authorizedBranchIds) {
      query.branchId = {
        $in: filters.authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
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
    if (filters.classId && Types.ObjectId.isValid(filters.classId)) {
      query.classId = new Types.ObjectId(filters.classId);
    }
    if (filters.scheduleId && Types.ObjectId.isValid(filters.scheduleId)) {
      query.scheduleId = new Types.ObjectId(filters.scheduleId);
    }
    if (filters.sessionType) {
      query.sessionType = filters.sessionType;
    }
    if (filters.date) {
      const d = new Date(filters.date);
      d.setUTCHours(0, 0, 0, 0);
      query.date = d;
    } else if (filters.startDate || filters.endDate) {
      const dateRange: Record<string, Date> = {};
      if (filters.startDate) {
        const sd = new Date(filters.startDate);
        sd.setUTCHours(0, 0, 0, 0);
        dateRange.$gte = sd;
      }
      if (filters.endDate) {
        const ed = new Date(filters.endDate);
        ed.setUTCHours(23, 59, 59, 999);
        dateRange.$lte = ed;
      }
      query.date = dateRange;
    }
    if (filters.studentId && Types.ObjectId.isValid(filters.studentId)) {
      const sessionIds = await AttendanceRecordModel.distinct('attendanceSessionId', {
        studentId: new Types.ObjectId(filters.studentId),
        ...(filters.status ? { status: filters.status } : {}),
        isDeleted: false,
      });
      query._id = { $in: sessionIds };
    } else if (filters.status) {
      const sessionIds = await AttendanceRecordModel.distinct('attendanceSessionId', {
        status: filters.status,
        isDeleted: false,
      });
      query._id = { $in: sessionIds };
    }

    const [data, total] = await Promise.all([
      AttendanceModel.find(query)
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name code isCurrent')
        .populate('classId', 'className classCode')
        .populate('takenBy', 'username email')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      AttendanceModel.countDocuments(query).exec(),
    ]);

    return { data: await this.hydrateRecords(data), total };
  }
}
