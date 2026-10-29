import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type BillingCycle = 'monthly' | 'term' | 'semester' | 'annual';

export interface ITuitionFee extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  programId: Types.ObjectId;
  levelId: Types.ObjectId;
  feeName: string;
  feeCode: string;
  amount: number;
  currency: 'USD' | 'KHR';
  billingCycle: BillingCycle;
  description?: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tuitionFeeSchema = new Schema<ITuitionFee>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    levelId: { type: Schema.Types.ObjectId, ref: 'Level', required: true, index: true },
    feeName: { type: String, required: true, trim: true },
    feeCode: { type: String, required: true, uppercase: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['USD', 'KHR'], default: 'USD' },
    billingCycle: {
      type: String,
      enum: ['monthly', 'term', 'semester', 'annual'],
      default: 'term',
    },
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

tuitionFeeSchema.index(
  { branchId: 1, academicYearId: 1, feeCode: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const TuitionFeeModel = model<ITuitionFee>('TuitionFee', tuitionFeeSchema);
