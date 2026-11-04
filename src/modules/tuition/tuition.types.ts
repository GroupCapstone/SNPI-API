import type { BillingCycle } from './tuition-fee.model';

export interface CreateTuitionFeeDto {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  programId: string;
  levelId: string;
  feeName: string;
  feeCode: string;
  amount: number;
  currency?: 'USD' | 'KHR';
  billingCycle: BillingCycle;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateTuitionFeeDto {
  feeName?: string;
  feeCode?: string;
  amount?: number;
  currency?: 'USD' | 'KHR';
  billingCycle?: BillingCycle;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface TuitionFeeQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  programId?: string;
  levelId?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}
