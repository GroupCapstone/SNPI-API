import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { AttendanceStatus } from './attendance.model';

export interface IAttendanceRecord extends Document {
  attendanceSessionId: Types.ObjectId;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: Types.ObjectId | string;
  markedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    attendanceSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Attendance',
      required: true,
      index: true,
    },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', index: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused', 'late', 'half_day', 'sick', 'permission'],
      required: true,
      default: 'present',
      index: true,
    },
    remarks: { type: String, trim: true, maxlength: 200 },
    markedBy: { type: Schema.Types.Mixed, required: true },
    markedAt: { type: Date, required: true, default: Date.now },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

attendanceRecordSchema.index(
  { attendanceSessionId: 1, studentId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
attendanceRecordSchema.index({
  studentId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  markedAt: -1,
});
attendanceRecordSchema.index({
  branchId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  classId: 1,
  status: 1,
});
attendanceRecordSchema.index({ enrollmentId: 1, markedAt: -1 });
attendanceRecordSchema.index({ classId: 1, markedAt: -1, isDeleted: 1 });
attendanceRecordSchema.index({ studentId: 1, classId: 1, markedAt: -1 });
attendanceRecordSchema.index({ attendanceSessionId: 1, status: 1, isDeleted: 1 });

export const AttendanceRecordModel = model<IAttendanceRecord>(
  'AttendanceRecord',
  attendanceRecordSchema,
);
