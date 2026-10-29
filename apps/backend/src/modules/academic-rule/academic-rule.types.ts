import type { AcademicRuleStatus, AcademicRuleType, IAcademicRule } from './academic-rule.model';

export interface CreateAcademicRuleDto {
  ruleType: AcademicRuleType;
  code: string;
  name: string;
  effectiveFrom?: string | Date;
  effectiveTo?: string | Date;
  schoolId: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  config: Record<string, unknown>;
  status?: AcademicRuleStatus;
}

export interface UpdateAcademicRuleDto {
  name?: string;
  effectiveTo?: string | Date | null;
  status?: AcademicRuleStatus;
  config?: Record<string, unknown>;
}

export interface NewRuleVersionDto {
  name?: string;
  effectiveFrom: string | Date;
  effectiveTo?: string | Date;
  config: Record<string, unknown>;
  status?: AcademicRuleStatus;
  reason?: string;
}

export interface AcademicRuleQueryFilters {
  ruleType?: AcademicRuleType;
  code?: string;
  schoolId?: string;
  branchId?: string;
  authorizedBranchIds?: string[];
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  status?: AcademicRuleStatus;
  effectiveAt?: string | Date;
  page?: number;
  limit?: number;
}

export interface PaginatedAcademicRules {
  data: IAcademicRule[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
