import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type PaymentPlanStatus = 'active' | 'completed' | 'cancelled';
export type InstallmentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export interface IInstallment {
  sequence: number;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
  paymentId?: Types.ObjectId;
}

export interface IPaymentPlan extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  tuitionFeeId: Types.ObjectId;
  totalAmount: number;
  currency: 'USD' | 'KHR';
  installments: IInstallment[];
  status: PaymentPlanStatus;
  notes?: string;
  cancellationReason?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const installmentSchema = new Schema<IInstallment>(
  {
    sequence: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending',
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  { _id: false },
);

const paymentPlanSchema = new Schema<IPaymentPlan>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    tuitionFeeId: { type: Schema.Types.ObjectId, ref: 'TuitionFee', required: true, index: true },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['USD', 'KHR'], required: true },
    installments: { type: [installmentSchema], required: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 1000 },
    cancellationReason: { type: String, trim: true, maxlength: 500 },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

paymentPlanSchema.index(
  { enrollmentId: 1, tuitionFeeId: 1, academicYearId: 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { status: 'active', isDeleted: false } },
);

export const PaymentPlanModel = model<IPaymentPlan>('PaymentPlan', paymentPlanSchema);
