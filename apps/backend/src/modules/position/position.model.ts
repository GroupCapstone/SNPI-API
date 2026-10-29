import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type PositionStatus = 'active' | 'inactive';

export interface IPosition extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  departmentId: Types.ObjectId;
  code: string;
  nameKh: string;
  nameEn: string;
  description?: string;
  status: PositionStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const positionSchema = new Schema<IPosition>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    nameKh: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

positionSchema.index(
  { departmentId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const PositionModel = model<IPosition>('Position', positionSchema);
