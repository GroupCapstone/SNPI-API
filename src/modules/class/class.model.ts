import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type ClassStatus = 'planned' | 'active' | 'completed' | 'cancelled';
export type ClassShift = 'morning' | 'afternoon' | 'evening' | 'weekend' | 'hourly' | 'custom';
export type ClassDaysPattern = 'MON_FRI' | 'MON_WED_FRI' | 'TUE_THU_SAT' | 'SAT_SUN' | 'CUSTOM';

export interface IClass extends Document {
  schoolId?: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  offeringId?: Types.ObjectId;
  programId: Types.ObjectId;
  levelId: Types.ObjectId;
  studyModeId?: Types.ObjectId;
  section?: string;
  curriculumId?: Types.ObjectId;
  classroomId?: Types.ObjectId;
  defaultClassroomId?: Types.ObjectId;
  classTeacherId?: Types.ObjectId;
  classCode: string;
  className: string;
  capacity: number;
  currentEnrollmentCount: number;
  capacityRevision: number;
  shift?: ClassShift;
  daysPattern?: ClassDaysPattern;
  selectedDays?: number[];
  startTime?: string;
  endTime?: string;
  startDate?: Date;
  endDate?: Date;
  status: ClassStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      required: false,
      index: true,
    },
    offeringId: {
      type: Schema.Types.ObjectId,
      ref: 'Intake',
      required: false,
      index: true,
    },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    levelId: { type: Schema.Types.ObjectId, ref: 'Level', required: true, index: true },
    studyModeId: { type: Schema.Types.ObjectId, ref: 'StudyMode', required: false, index: true },
    section: { type: String, trim: true, uppercase: true, default: 'A' },
    curriculumId: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: false, index: true },
    classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: false, index: true },
    defaultClassroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: false,
      index: true,
    },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'Employee', required: false, index: true },
    classCode: { type: String, required: true, uppercase: true, trim: true },
    className: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1, default: 30 },
    currentEnrollmentCount: { type: Number, default: 0, min: 0 },
    capacityRevision: { type: Number, default: 0, min: 0, select: false },
    shift: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'weekend', 'hourly', 'custom'],
      default: 'morning',
      index: true,
    },
    daysPattern: {
      type: String,
      enum: ['MON_FRI', 'MON_WED_FRI', 'TUE_THU_SAT', 'SAT_SUN', 'CUSTOM'],
      default: 'MON_FRI',
      index: true,
    },
    selectedDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    startTime: { type: String, trim: true, default: '08:00' },
    endTime: { type: String, trim: true, default: '11:15' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'cancelled'],
      default: 'planned',
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.Mixed, required: false },
    updatedBy: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  },
);

classSchema.index(
  { branchId: 1, academicYearId: 1, classCode: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
classSchema.index({ programId: 1, levelId: 1 });

export const ClassModel = model<IClass>('Class', classSchema);
