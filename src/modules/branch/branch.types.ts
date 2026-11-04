import type { BranchStatus } from './branch.model';

export interface CreateBranchDto {
  schoolId: string;
  branchCode: string;
  branchNameKh: string;
  branchNameEn: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  openingDate?: string;
  status?: BranchStatus;
}

export interface UpdateBranchDto {
  schoolId?: string;
  branchCode?: string;
  branchNameKh?: string;
  branchNameEn?: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  openingDate?: string;
  status?: BranchStatus;
}

export interface BranchQueryFilters {
  search?: string;
  schoolId?: string;
  status?: BranchStatus;
  page?: number;
  limit?: number;
}
