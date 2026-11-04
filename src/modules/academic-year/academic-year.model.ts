import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export const ACADEMIC_YEAR_STATUSES = [
  'planned',
  'active',
  'closing',
  'closed',
  'archived',
] as const;
export type AcademicYearStatus = (typeof ACADEMIC_YEAR_STATUSES)[number];

export interface IAcademicYear extends Document {
  schoolId?: Types.ObjectId;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  status: AcademicYearStatus;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  closedBy?: Types.ObjectId | string;
  closedAt?: Date;
  archivedBy?: Types.ObjectId | string;
  archivedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const academicYearSchema = new Schema<IAcademicYear>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
    status: { type: String, enum: ACADEMIC_YEAR_STATUSES, default: 'planned', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.Mixed },
    updatedBy: { type: Schema.Types.Mixed },
    closedBy: { type: Schema.Types.Mixed },
    closedAt: { type: Date },
    archivedBy: { type: Schema.Types.Mixed },
    archivedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

academicYearSchema.index({ schoolId: 1, code: 1, isDeleted: 1 }, { unique: true });
academicYearSchema.index({ schoolId: 1, status: 1, startDate: -1, isDeleted: 1 });
academicYearSchema.index(
  { schoolId: 1, isCurrent: 1 },
  {
    unique: true,
    partialFilterExpression: { isCurrent: true, isDeleted: false },
  },
);

export const AcademicYearModel = model<IAcademicYear>('AcademicYear', academicYearSchema);
