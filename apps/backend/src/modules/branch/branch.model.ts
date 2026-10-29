import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type BranchStatus = 'active' | 'inactive' | 'closed';

export interface IBranch extends Document {
  schoolId: Types.ObjectId;
  branchCode: string;
  branchNameKh: string;
  branchNameEn: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: Types.ObjectId;
  openingDate?: Date;
  status: BranchStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchCode: { type: String, required: true, uppercase: true, trim: true },
    branchNameKh: { type: String, required: true, trim: true },
    branchNameEn: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    openingDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

branchSchema.index(
  { schoolId: 1, branchCode: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
branchSchema.index({ schoolId: 1, isDeleted: 1 });

export const BranchModel = model<IBranch>('Branch', branchSchema);
