import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type DiscountPolicyType = 'sibling' | 'merit' | 'early_payment' | 'scholarship';
export type DiscountCalculationType = 'percentage' | 'fixed';

export interface IDiscountPolicy extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  code: string;
  name: string;
  type: DiscountPolicyType;
  calculationType: DiscountCalculationType;
  value: number;
  maximumAmount?: number;
  minimumGpa?: number;
  minimumSiblingCount?: number;
  paymentDaysBeforeDue?: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const discountPolicySchema = new Schema<IDiscountPolicy>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['sibling', 'merit', 'early_payment', 'scholarship'],
      required: true,
      index: true,
    },
    calculationType: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    maximumAmount: { type: Number, min: 0 },
    minimumGpa: { type: Number, min: 0, max: 4 },
    minimumSiblingCount: { type: Number, min: 2, default: 2 },
    paymentDaysBeforeDue: { type: Number, min: 0 },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: Date,
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: Schema.Types.Mixed,
    updatedBy: Schema.Types.Mixed,
  },
  { timestamps: true },
);
discountPolicySchema.index(
  { branchId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export interface ICurrencyTotals {
  USD: number;
  KHR: number;
}

export interface ICashierShift extends Document {
  shiftNumber: string;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  cashierId: Types.ObjectId | string;
  openedAt: Date;
  closedAt?: Date;
  openingCash: ICurrencyTotals;
  expectedCash: ICurrencyTotals;
  expectedDigital: ICurrencyTotals;
  declaredCash: ICurrencyTotals;
  declaredDigital: ICurrencyTotals;
  cashVariance: ICurrencyTotals;
  digitalVariance: ICurrencyTotals;
  notes?: string;
  status: 'open' | 'submitted' | 'approved';
  approvedAt?: Date;
  approvedBy?: Types.ObjectId | string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const currencyTotalsSchema = new Schema<ICurrencyTotals>(
  { USD: { type: Number, default: 0 }, KHR: { type: Number, default: 0 } },
  { _id: false },
);

const cashierShiftSchema = new Schema<ICashierShift>(
  {
    shiftNumber: { type: String, required: true, uppercase: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    cashierId: { type: Schema.Types.Mixed, required: true, index: true },
    openedAt: { type: Date, required: true, default: Date.now },
    closedAt: Date,
    openingCash: { type: currencyTotalsSchema, default: () => ({}) },
    expectedCash: { type: currencyTotalsSchema, default: () => ({}) },
    expectedDigital: { type: currencyTotalsSchema, default: () => ({}) },
    declaredCash: { type: currencyTotalsSchema, default: () => ({}) },
    declaredDigital: { type: currencyTotalsSchema, default: () => ({}) },
    cashVariance: { type: currencyTotalsSchema, default: () => ({}) },
    digitalVariance: { type: currencyTotalsSchema, default: () => ({}) },
    notes: { type: String, trim: true, maxlength: 1000 },
    status: { type: String, enum: ['open', 'submitted', 'approved'], default: 'open', index: true },
    approvedAt: Date,
    approvedBy: Schema.Types.Mixed,
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);
cashierShiftSchema.index({ branchId: 1, openedAt: -1, status: 1, isDeleted: 1 });
cashierShiftSchema.index({ cashierId: 1, status: 1, isDeleted: 1 });

export const DiscountPolicyModel = model<IDiscountPolicy>('DiscountPolicy', discountPolicySchema);
export const CashierShiftModel = model<ICashierShift>('CashierShift', cashierShiftSchema);
