import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type ProgramStatus = 'active' | 'inactive' | 'archived';

export type ResultCalculationType =
  'total_score' | 'average' | 'percentage' | 'letter_grade' | 'gpa' | 'credit_gpa';

export interface IProgram extends Document {
  schoolId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  branchAvailability: 'all' | string[];
  code: string;
  nameKh: string;
  nameEn: string;
  shortName?: string;
  description?: string;
  displayOrder?: number;
  resultCalculationType?: ResultCalculationType;
  status: ProgramStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: false, index: true },
    branchAvailability: { type: Schema.Types.Mixed, default: 'all' },
    code: { type: String, required: true, uppercase: true, trim: true },
    nameKh: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true },
    description: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    resultCalculationType: {
      type: String,
      enum: ['total_score', 'average', 'percentage', 'letter_grade', 'gpa', 'credit_gpa'],
      default: 'average',
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

programSchema.index(
  { schoolId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
programSchema.index({ branchId: 1, status: 1 });

export const ProgramModel = model<IProgram>('Program', programSchema);
