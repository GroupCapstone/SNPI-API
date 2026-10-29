import type { PaymentPlanStatus } from './payment-plan.model';
import type { PaymentMethod } from '../payment/payment.types';

export interface PayInstallmentDto {
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionReference?: string;
}

export interface PaymentPlanInstallmentDto {
  dueDate: string;
  amount: number;
}

export interface CreatePaymentPlanDto {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  enrollmentId: string;
  studentId: string;
  tuitionFeeId: string;
  totalAmount: number;
  currency: 'USD' | 'KHR';
  installments: PaymentPlanInstallmentDto[];
  notes?: string;
}

export interface PaymentPlanQueryFilters {
  search?: string;
  branchId?: string;
  academicYearId?: string;
  studentId?: string;
  enrollmentId?: string;
  status?: PaymentPlanStatus | 'all';
  page?: number;
  limit?: number;
}
