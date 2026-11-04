import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type AssessmentType = 'quiz' | 'assignment' | 'monthly_test' | 'midterm' | 'final';
export type AssessmentStatus = 'draft' | 'published' | 'closed';

export interface IAssessment extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  assessmentSchemeId?: Types.ObjectId;
  assessmentSchemeVersion?: number;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  name: string;
  code: string;
  type: AssessmentType;
  maxScore: number;
  passingScore: number;
  weightPercentage: number;
  assessmentDate: Date;
  startTime?: string;
  endTime?: string;
  classroomId?: Types.ObjectId;
  proctorIds: Types.ObjectId[];
  seatCapacity?: number;
  description?: string;
  status: AssessmentStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', index: true },
    assessmentSchemeId: { type: Schema.Types.ObjectId, ref: 'AcademicRule', index: true },
    assessmentSchemeVersion: { type: Number, min: 1 },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    type: {
      type: String,
      enum: ['quiz', 'assignment', 'monthly_test', 'midterm', 'final'],
      default: 'monthly_test',
    },
    maxScore: { type: Number, required: true, default: 100, min: 1 },
    passingScore: { type: Number, required: true, default: 50, min: 0 },
    weightPercentage: { type: Number, required: true, default: 100, min: 0, max: 100 },
    assessmentDate: { type: Date, required: true },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', index: true },
    proctorIds: [{ type: Schema.Types.ObjectId, ref: 'Employee', index: true }],
    seatCapacity: { type: Number, min: 1 },
    description: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'published', 'closed'], default: 'published' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

assessmentSchema.index({ classId: 1, subjectId: 1, code: 1, isDeleted: 1 });
assessmentSchema.index({
  branchId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  classId: 1,
  status: 1,
});
assessmentSchema.index({ branchId: 1, assessmentDate: 1, classroomId: 1, isDeleted: 1 });
assessmentSchema.index({ branchId: 1, assessmentDate: 1, proctorIds: 1, isDeleted: 1 });

export const AssessmentModel = model<IAssessment>('Assessment', assessmentSchema);
