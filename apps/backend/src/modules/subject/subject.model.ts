import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type SubjectStatus = 'active' | 'inactive' | 'archived';
export type SubjectCategory = 'english' | 'computer' | 'general' | 'other';

export interface ISubject extends Document {
  schoolId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  code: string;
  name: string;
  category?: SubjectCategory;
  description?: string;
  status: SubjectStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: false, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['english', 'computer', 'general', 'other'],
      default: 'general',
      index: true,
    },
    description: { type: String, trim: true },
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

subjectSchema.index(
  { schoolId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const SubjectModel = model<ISubject>('Subject', subjectSchema);
