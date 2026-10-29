import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type MonthlyAttendanceSummaryStatus = 'open' | 'closed';

export interface IMonthlyAttendanceSummary extends Document {
  schoolId?: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  year: number;
  month: number;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  permissionCount: number;
  attendanceRate: number;
  status: MonthlyAttendanceSummaryStatus;
  calculatedAt: Date;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const monthlyAttendanceSummarySchema = new Schema<IMonthlyAttendanceSummary>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
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
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    totalSessions: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    presentCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    absentCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lateCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    permissionCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    attendanceRate: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      required: true,
      index: true,
    },
    calculatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.Mixed,
    },
    updatedBy: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

monthlyAttendanceSummarySchema.index(
  { academicYearId: 1, year: 1, month: 1, classId: 1, studentId: 1, isDeleted: 1 },
  { unique: true },
);
monthlyAttendanceSummarySchema.index({ branchId: 1, classId: 1, year: 1, month: 1, isDeleted: 1 });
monthlyAttendanceSummarySchema.index({ studentId: 1, year: 1, month: 1, isDeleted: 1 });
monthlyAttendanceSummarySchema.index({ enrollmentId: 1, year: 1, month: 1, isDeleted: 1 });
monthlyAttendanceSummarySchema.index({ academicYearId: 1, classId: 1, month: 1 });

export const MonthlyAttendanceSummaryModel = model<IMonthlyAttendanceSummary>(
  'MonthlyAttendanceSummary',
  monthlyAttendanceSummarySchema,
);
