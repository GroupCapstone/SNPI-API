import type { DiscountCalculationType, DiscountPolicyType } from './finance-operation.model';

export interface CreateDiscountPolicyDto {
  branchId: string;
  code: string;
  name: string;
  type: DiscountPolicyType;
  calculationType: DiscountCalculationType;
  value: number;
  maximumAmount?: number;
  minimumGpa?: number;
  minimumSiblingCount?: number;
  paymentDaysBeforeDue?: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface FinanceOperationFilters {
  branchId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface OpenCashierShiftDto {
  branchId: string;
  openingCash: { USD: number; KHR: number };
  notes?: string;
}

export interface CloseCashierShiftDto {
  declaredCash: { USD: number; KHR: number };
  declaredDigital: { USD: number; KHR: number };
  notes?: string;
}
