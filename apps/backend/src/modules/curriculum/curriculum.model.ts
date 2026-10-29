import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type CurriculumStatus = 'active' | 'inactive' | 'archived';

export interface ICurriculumSubject {
  subjectId: Types.ObjectId;
  weeklyHours: number;
  totalHours?: number;
  sequence: number;
  passingScore: number;
  isRequired: boolean;
}

export interface ICurriculum extends Document {
  schoolId: Types.ObjectId;
  branchId?: Types.ObjectId;
  programId: Types.ObjectId;
  levelId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  subjects: ICurriculumSubject[];
  status: CurriculumStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const curriculumSubjectSchema = new Schema<ICurriculumSubject>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    weeklyHours: { type: Number, required: true, default: 2, min: 0 },
    totalHours: { type: Number, default: 40, min: 0 },
    sequence: { type: Number, required: true, default: 1 },
    passingScore: { type: Number, required: true, default: 50, min: 0, max: 100 },
    isRequired: { type: Boolean, default: true },
  },
  { _id: false },
);

const curriculumSchema = new Schema<ICurriculum>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: false, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    levelId: { type: Schema.Types.ObjectId, ref: 'Level', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    subjects: {
      type: [curriculumSubjectSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
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

curriculumSchema.index(
  { schoolId: 1, programId: 1, levelId: 1, academicYearId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
curriculumSchema.index(
  { schoolId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const CurriculumModel = model<ICurriculum>('Curriculum', curriculumSchema);
