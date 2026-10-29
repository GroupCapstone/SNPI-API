import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { SessionType } from '../time-slot/time-slot.model';

export type ScheduleStatus = 'active' | 'cancelled';

export interface IClassSchedule extends Document {
  classId: Types.ObjectId;
  schoolId?: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday, 7 = Sunday
  timeSlotId?: Types.ObjectId;
  sessionType: SessionType;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  subjectId?: Types.ObjectId;
  teacherId?: Types.ObjectId; // Employee reference
  teacherAssignmentId?: Types.ObjectId;
  classroomId?: Types.ObjectId;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  status: ScheduleStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const classScheduleSchema = new Schema<IClassSchedule>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', index: true },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
      index: true,
    },
    timeSlotId: { type: Schema.Types.ObjectId, ref: 'TimeSlot', index: true },
    sessionType: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'hourly', 'custom'],
      default: 'morning',
      required: true,
      index: true,
    },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Employee', index: true },
    teacherAssignmentId: { type: Schema.Types.ObjectId, ref: 'TeacherAssignment', index: true },
    classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', index: true },
    effectiveFrom: { type: Date },
    effectiveTo: { type: Date },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.Mixed },
    updatedBy: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

classScheduleSchema.index({ classId: 1, dayOfWeek: 1, startTime: 1, isDeleted: 1 });
classScheduleSchema.index({ teacherId: 1, dayOfWeek: 1, status: 1, isDeleted: 1 });
classScheduleSchema.index({ classroomId: 1, dayOfWeek: 1, status: 1, isDeleted: 1 });
classScheduleSchema.index({ branchId: 1, academicYearId: 1, status: 1, isDeleted: 1 });
classScheduleSchema.index({ branchId: 1, academicPeriodId: 1, dayOfWeek: 1, status: 1 });

export const ClassScheduleModel = model<IClassSchedule>('ClassSchedule', classScheduleSchema);
