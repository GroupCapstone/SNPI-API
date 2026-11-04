import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { SessionType } from '../time-slot/time-slot.model';

export type AttendanceStatus =
  'present' | 'absent' | 'excused' | 'late' | 'half_day' | 'sick' | 'permission';

export interface IAttendanceRecordItem {
  studentId: Types.ObjectId;
  enrollmentId?: Types.ObjectId;
  status: AttendanceStatus;
  remarks?: string;
}

export interface IAttendance extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  classId: Types.ObjectId;
  scheduleId?: Types.ObjectId;
  timeSlotId?: Types.ObjectId;
  sessionType: SessionType;
  date: Date;
  takenBy: Types.ObjectId | string;
  teacherId?: Types.ObjectId;
  /** Transient API compatibility projection. Records persist in attendance_records. */
  records: IAttendanceRecordItem[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSchedule',
      index: true,
    },
    timeSlotId: {
      type: Schema.Types.ObjectId,
      ref: 'TimeSlot',
      index: true,
    },
    sessionType: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'hourly', 'custom'],
      default: 'morning',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    takenBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Employee', index: true },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ classId: 1, date: 1, sessionType: 1, isDeleted: 1 }, { unique: true });
attendanceSchema.index({ branchId: 1, academicYearId: 1, academicPeriodId: 1, date: -1 });
attendanceSchema.index({ classId: 1, academicPeriodId: 1, date: -1 });
attendanceSchema.index({ branchId: 1, date: -1, isDeleted: 1 });
attendanceSchema.index({ branchId: 1, classId: 1, date: -1, isDeleted: 1 });
attendanceSchema.index({ academicYearId: 1, date: 1, isDeleted: 1 });

export const AttendanceModel = model<IAttendance>('Attendance', attendanceSchema);
