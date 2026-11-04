import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type PaymentMethod = 'cash' | 'aba_pay' | 'bank_transfer' | 'credit_card' | 'wing';
export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'voided';
export type PaymentType =
  'tuition_monthly' | 'tuition_term' | 'registration_fee' | 'uniform' | 'books' | 'other';

export interface IPayment extends Document {
  receiptNumber: string;
  paymentNumber?: string;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  enrollmentId?: Types.ObjectId;
  paymentPlanId?: Types.ObjectId;
  installmentSequence?: number;
  studentId: Types.ObjectId;
  tuitionFeeId: Types.ObjectId;
  amountDue: number;
  discountAmount: number;
  discountPolicyId?: Types.ObjectId;
  discountReason?: string;
  amountPaid: number;
  balanceRemaining: number;
  currency: 'USD' | 'KHR';
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  dueDate?: Date;
  billingYear?: number;
  billingMonth?: number;
  coveragePeriodLabel?: string;
  invoiceKey?: string;
  paymentType?: PaymentType;
  transactionReference?: string;
  status: PaymentStatus;
  voidReason?: string;
  voidedAt?: Date;
  voidedBy?: Types.ObjectId | string;
  remarks?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    receiptNumber: { type: String, required: true, uppercase: true, trim: true },
    paymentNumber: { type: String, uppercase: true, trim: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      index: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      index: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    tuitionFeeId: { type: Schema.Types.ObjectId, ref: 'TuitionFee', required: true, index: true },
    amountDue: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, default: 0, min: 0 },
    discountPolicyId: { type: Schema.Types.ObjectId, ref: 'DiscountPolicy', index: true },
    discountReason: { type: String, trim: true, maxlength: 500 },
    amountPaid: { type: Number, required: true, min: 0 },
    balanceRemaining: { type: Number, required: true, default: 0, min: 0 },
    currency: { type: String, enum: ['USD', 'KHR'], default: 'USD' },
    paymentMethod: {
      type: String,
      enum: ['cash', 'aba_pay', 'bank_transfer', 'credit_card', 'wing'],
      default: 'cash',
    },
    paymentDate: { type: Date, default: Date.now, required: true },
    dueDate: { type: Date },
    billingYear: { type: Number, index: true },
    billingMonth: { type: Number, min: 1, max: 12, index: true },
    coveragePeriodLabel: { type: String, trim: true },
    invoiceKey: { type: String, trim: true },
    paymentPlanId: { type: Schema.Types.ObjectId, ref: 'PaymentPlan', index: true },
    installmentSequence: { type: Number, min: 1, max: 24 },
    paymentType: {
      type: String,
      enum: ['tuition_monthly', 'tuition_term', 'registration_fee', 'uniform', 'books', 'other'],
      default: 'tuition_monthly',
      index: true,
    },
    transactionReference: { type: String, trim: true },
    status: {
      type: String,
      enum: ['paid', 'partial', 'pending', 'voided'],
      default: 'paid',
    },
    voidReason: { type: String, trim: true, maxlength: 500 },
    voidedAt: { type: Date },
    voidedBy: { type: Schema.Types.Mixed },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index(
  { receiptNumber: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
paymentSchema.index({ branchId: 1, studentId: 1, isDeleted: 1 });
paymentSchema.index({ branchId: 1, paymentDate: -1, isDeleted: 1 });
paymentSchema.index({ branchId: 1, billingYear: 1, billingMonth: 1, isDeleted: 1 });
paymentSchema.index({
  branchId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  studentId: 1,
  isDeleted: 1,
});
paymentSchema.index(
  { invoiceKey: 1 },
  { unique: true, partialFilterExpression: { invoiceKey: { $type: 'string' }, isDeleted: false } },
);

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
