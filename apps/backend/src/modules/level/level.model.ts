import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type LevelStatus = 'active' | 'inactive' | 'archived';

export interface ILevel extends Document {
  schoolId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  programId: Types.ObjectId;
  code: string;
  name: string;
  description?: string;
  sequence: number;
  status: LevelStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const levelSchema = new Schema<ILevel>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: false, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sequence: { type: Number, required: true, default: 1 },
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

levelSchema.index({ programId: 1, sequence: 1 });
levelSchema.index(
  { programId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const LevelModel = model<ILevel>('Level', levelSchema);
