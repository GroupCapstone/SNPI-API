import type { StudentTransferStatus, StudentTransferType } from './student-transfer.model';

export interface CreateStudentTransferDTO {
  transferNumber?: string;
  transferType?: StudentTransferType;
  studentId: string;
  fromSchoolId: string;
  toSchoolId: string;
  fromBranchId: string;
  toBranchId: string;
  fromProgramId?: string;
  toProgramId?: string;
  fromLevelId?: string;
  toLevelId?: string;
  fromClassId?: string;
  toClassId?: string;
  transferDate?: string | Date;
  effectiveDate?: string | Date;
  reason: string;
  remarks?: string;
}

export interface ProcessTransferDTO {
  status: 'approved' | 'rejected' | 'completed' | 'cancelled';
  toClassId?: string;
  remarks?: string;
}

export interface StudentTransferQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  studentId?: string;
  schoolId?: string;
  fromBranchId?: string;
  toBranchId?: string;
  status?: StudentTransferStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  authorizedBranchIds?: string[];
}
