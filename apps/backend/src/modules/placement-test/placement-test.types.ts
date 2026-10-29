import type { PlacementTestStatus } from './placement-test.model';

export interface CreatePlacementTestDTO {
  testNumber?: string;
  registrationId?: string;
  studentId?: string;
  studentName: string;
  schoolId: string;
  branchId: string;
  programId: string;
  recommendedLevelId: string;
  testDate?: string | Date;
  score: number;
  maxScore?: number;
  examinerName?: string;
  status?: PlacementTestStatus;
  comments?: string;
}

export interface UpdatePlacementTestDTO {
  registrationId?: string;
  studentId?: string;
  studentName?: string;
  schoolId?: string;
  branchId?: string;
  programId?: string;
  recommendedLevelId?: string;
  testDate?: string | Date;
  score?: number;
  maxScore?: number;
  examinerName?: string;
  status?: PlacementTestStatus;
  comments?: string;
}

export interface PlacementTestQueryFilters {
  authorizedBranchIds?: string[];
  page?: number;
  limit?: number;
  search?: string;
  registrationId?: string;
  studentId?: string;
  schoolId?: string;
  branchId?: string;
  programId?: string;
  recommendedLevelId?: string;
  status?: PlacementTestStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
