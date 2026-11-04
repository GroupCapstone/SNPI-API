import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
export type TeacherRoleInClass =
  'class_teacher' | 'primary_teacher' | 'assistant_teacher' | 'subject_teacher';
export type TeacherAssignmentStatus = 'active' | 'inactive';
export interface ITeacherAssignment extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  employeeId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId?: Types.ObjectId;
  timeSlotId?: Types.ObjectId;
  roleInClass: TeacherRoleInClass;
  status: TeacherAssignmentStatus;
  startDate: Date;
  endDate?: Date;
  remarks?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}
const teacherAssignmentSchema = new Schema<ITeacherAssignment>(
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
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      index: true,
    },
    timeSlotId: {
      type: Schema.Types.ObjectId,
      ref: 'TimeSlot',
      index: true,
    },
    roleInClass: {
      type: String,
      enum: ['class_teacher', 'primary_teacher', 'assistant_teacher', 'subject_teacher'],
      default: 'subject_teacher',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },
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
teacherAssignmentSchema.index({ classId: 1, employeeId: 1, subjectId: 1, isDeleted: 1 });
teacherAssignmentSchema.index({ branchId: 1, academicYearId: 1, status: 1, isDeleted: 1 });
export const TeacherAssignmentModel = model<ITeacherAssignment>(
  'TeacherAssignment',
  teacherAssignmentSchema,
);
