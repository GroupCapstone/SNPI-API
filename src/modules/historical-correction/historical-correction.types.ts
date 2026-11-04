import type {
  HistoricalCorrectionEntityType,
  HistoricalCorrectionStatus,
  IHistoricalCorrection,
} from './historical-correction.model';

export interface RequestCorrectionDto {
  entityType: HistoricalCorrectionEntityType;
  entityId: string;
  reason: string;
  proposedValue: Record<string, unknown>;
}

export interface ReviewCorrectionDto {
  status: 'approved' | 'rejected' | 'cancelled';
  reviewRemarks?: string;
  unlockDurationMinutes?: number; // Defaults to 60 mins if approved
}

export interface ApplyCorrectionDto {
  unlockToken: string;
  correctedValue: Record<string, unknown>;
  remarks?: string;
}

export interface HistoricalCorrectionQueryFilters {
  entityType?: HistoricalCorrectionEntityType;
  entityId?: string;
  studentId?: string;
  branchId?: string;
  authorizedBranchIds?: string[];
  academicYearId?: string;
  academicPeriodId?: string;
  status?: HistoricalCorrectionStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedHistoricalCorrections {
  data: IHistoricalCorrection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
