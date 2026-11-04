import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type AcademicPeriodType = 'TERM' | 'SHORT_COURSE' | 'MONTHLY' | 'CUSTOM';
export const ACADEMIC_PERIOD_STATUSES = [
  'planned',
  'open',
  'result_processing',
  'finalized',
  'closed',
] as const;
export type AcademicPeriodStatus = (typeof ACADEMIC_PERIOD_STATUSES)[number];

export interface IAcademicPeriod extends Document {
  schoolId?: Types.ObjectId;
  programId?: Types.ObjectId;
  code: string;
  name: string;
  type: AcademicPeriodType;
  academicYearId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  sequence: number;
  status: AcademicPeriodStatus;
  openedBy?: Types.ObjectId | string;
  openedAt?: Date;
  finalizedBy?: Types.ObjectId | string;
  finalizedAt?: Date;
  closedBy?: Types.ObjectId | string;
  closedAt?: Date;
  readinessApprovedBy?: Types.ObjectId | string;
  readinessApprovedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const academicPeriodSchema = new Schema<IAcademicPeriod>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: false, index: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['TERM', 'SHORT_COURSE', 'MONTHLY', 'CUSTOM'],
      required: true,
      default: 'TERM',
      index: true,
    },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    sequence: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ACADEMIC_PERIOD_STATUSES,
      default: 'planned',
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.Mixed, required: false },
    updatedBy: { type: Schema.Types.Mixed, required: false },
    openedBy: { type: Schema.Types.Mixed },
    openedAt: { type: Date },
    finalizedBy: { type: Schema.Types.Mixed },
    finalizedAt: { type: Date },
    closedBy: { type: Schema.Types.Mixed },
    closedAt: { type: Date },
    readinessApprovedBy: { type: Schema.Types.Mixed },
    readinessApprovedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

academicPeriodSchema.index({ academicYearId: 1, code: 1, isDeleted: 1 }, { unique: true });
academicPeriodSchema.index(
  { academicYearId: 1, type: 1, sequence: 1, isDeleted: 1 },
  { unique: true },
);
academicPeriodSchema.index({ academicYearId: 1, type: 1, startDate: 1 });
academicPeriodSchema.index({ schoolId: 1, status: 1, startDate: -1, isDeleted: 1 });

export const AcademicPeriodModel = model<IAcademicPeriod>('AcademicPeriod', academicPeriodSchema);
