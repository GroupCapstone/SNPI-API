import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IScore extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  assessmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  scoreObtained: number;
  percentage: number;
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  isAbsent: boolean;
  remarks?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const scoreSchema = new Schema<IScore>(
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
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    scoreObtained: { type: Number, required: true, default: 0, min: 0 },
    percentage: { type: Number, required: true, default: 0, min: 0, max: 100 },
    letterGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
      default: 'F',
      required: true,
    },
    isAbsent: { type: Boolean, default: false },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

scoreSchema.index({ assessmentId: 1, studentId: 1, isDeleted: 1 }, { unique: true });
scoreSchema.index({ classId: 1, subjectId: 1, academicPeriodId: 1, isDeleted: 1 });
scoreSchema.index({ classId: 1, academicPeriodId: 1, isDeleted: 1 });
scoreSchema.index({ studentId: 1, academicYearId: 1, academicPeriodId: 1, subjectId: 1 });
scoreSchema.index({ branchId: 1, academicYearId: 1, academicPeriodId: 1, isDeleted: 1 });
scoreSchema.index({ enrollmentId: 1, assessmentId: 1 });
scoreSchema.index({ studentId: 1, isDeleted: 1 });

export const ScoreModel = model<IScore>('Score', scoreSchema);
