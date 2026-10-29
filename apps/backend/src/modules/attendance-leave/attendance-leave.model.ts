import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type AttendanceLeaveType = 'medical' | 'family' | 'personal' | 'school_activity' | 'other';
export type AttendanceLeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface IAttendanceLeave extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  studentId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  classId: Types.ObjectId;
  leaveType: AttendanceLeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  documentUrl?: string;
  documentName?: string;
  status: AttendanceLeaveStatus;
  reviewNotes?: string;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId | string;
  createdBy: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceLeaveSchema = new Schema<IAttendanceLeave>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    leaveType: {
      type: String,
      enum: ['medical', 'family', 'personal', 'school_activity', 'other'],
      required: true,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    documentUrl: { type: String, trim: true },
    documentName: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    reviewNotes: { type: String, trim: true, maxlength: 1000 },
    reviewedAt: Date,
    reviewedBy: Schema.Types.Mixed,
    createdBy: { type: Schema.Types.Mixed, required: true },
    updatedBy: Schema.Types.Mixed,
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

attendanceLeaveSchema.index({ branchId: 1, status: 1, startDate: -1, isDeleted: 1 });
attendanceLeaveSchema.index({ studentId: 1, startDate: 1, endDate: 1, isDeleted: 1 });
attendanceLeaveSchema.index({ classId: 1, startDate: 1, status: 1, isDeleted: 1 });

export const AttendanceLeaveModel = model<IAttendanceLeave>(
  'AttendanceLeave',
  attendanceLeaveSchema,
);
