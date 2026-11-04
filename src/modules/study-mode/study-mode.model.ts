import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IStudyMode extends Document {
  schoolId?: Types.ObjectId;
  code: string; // 'FT', 'PT', 'HR', 'WK', etc.
  nameEn: string;
  nameKh: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const studyModeSchema = new Schema<IStudyMode>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    nameKh: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.Mixed },
    updatedBy: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

studyModeSchema.index(
  { schoolId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
studyModeSchema.index({ sortOrder: 1, isActive: 1 });

export const StudyModeModel = model<IStudyMode>('StudyMode', studyModeSchema);
