import type {
  ITermResult,
  PromotionStatus,
  TermResultStatus,
  TermResultWorkflowStatus,
} from './term-result.model';

export interface GenerateTermResultDto {
  enrollmentId: string;
}

export interface CalculateClassTermResultsDto {
  classId: string;
}

export interface CompleteTermDto {
  termResultId: string;
  nextPeriodId?: string;
  nextClassId?: string;
  remarks?: string;
}

export interface TransitionTermResultDto {
  status: 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
  reason?: string;
}

export interface TermResultQueryFilters {
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  classId?: string;
  studentId?: string;
  resultStatus?: TermResultStatus;
  promotionStatus?: PromotionStatus;
  isCompleted?: boolean;
  workflowStatus?: TermResultWorkflowStatus;
  page?: number;
  limit?: number;
  authorizedBranchIds?: string[];
  authorizedClassIds?: string[];
}

export interface PaginatedTermResults {
  data: ITermResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
