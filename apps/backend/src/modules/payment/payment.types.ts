import type { PaymentMethod, PaymentStatus, PaymentType } from './payment.model';

export type { PaymentMethod, PaymentStatus, PaymentType };

export interface CreatePaymentDto {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  enrollmentId?: string;
  paymentPlanId?: string;
  installmentSequence?: number;
  studentId: string;
  tuitionFeeId: string;
  amountDue: number;
  discountAmount?: number;
  discountPolicyId?: string;
  discountReason?: string;
  amountPaid: number;
  currency?: 'USD' | 'KHR';
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  dueDate?: string;
  billingYear?: number;
  billingMonth?: number;
  coveragePeriodLabel?: string;
  invoiceKey?: string;
  paymentType?: PaymentType;
  transactionReference?: string;
  remarks?: string;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  billingYear?: number;
  billingMonth?: number;
  coveragePeriodLabel?: string;
  paymentType?: PaymentType;
  remarks?: string;
  transactionReference?: string;
}

export interface VoidPaymentDto {
  reason: string;
}

export interface GenerateMonthlyInvoicesDto {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  year: number;
  month: number;
  dueDay?: number;
}

export interface GenerateMonthlyInvoicesResponse {
  year: number;
  month: number;
  created: number;
  skipped: number;
  invoices: string[];
}

export interface PaymentQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  enrollmentId?: string;
  studentId?: string;
  tuitionFeeId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  billingYear?: number;
  billingMonth?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MethodRevenueBreakdown {
  method: PaymentMethod;
  totalUsd: number;
  totalKhr: number;
  count: number;
}

export interface TypeRevenueBreakdown {
  type: PaymentType;
  totalUsd: number;
  totalKhr: number;
  count: number;
}

export interface MonthlyFinanceSummaryResponse {
  year: number;
  month: number;
  monthLabelEn: string;
  monthLabelKh: string;
  branchId?: string;
  totalRevenueUsd: number;
  totalRevenueKhr: number;
  totalTransactions: number;
  paidTransactions: number;
  partialTransactions: number;
  byMethod: MethodRevenueBreakdown[];
  byType: TypeRevenueBreakdown[];
}

export interface DebtAgingBucket {
  studentId: string;
  studentCode: string;
  studentNameEn: string;
  studentNameKh?: string;
  branchCode: string;
  classCode?: string;
  feeName: string;
  currency: 'USD' | 'KHR';
  unpaidBalance: number;
  dueDate?: string;
  overdueDays: number;
  agingCategory: 'current_due' | 'overdue_30' | 'overdue_60' | 'overdue_90_plus';
  parentPhone?: string;
}

export interface DebtAgingResponse {
  asOfDate: string;
  branchId?: string;
  summary: {
    totalUnpaidUsd: number;
    totalUnpaidKhr: number;
    currentDueUsd: number;
    currentDueKhr: number;
    overdue30Usd: number;
    overdue30Khr: number;
    overdue60Usd: number;
    overdue60Khr: number;
    overdue90PlusUsd: number;
    overdue90PlusKhr: number;
    totalStudentsInDebt: number;
  };
  items: DebtAgingBucket[];
}
