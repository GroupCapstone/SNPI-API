import type { AssessmentStatus, AssessmentType } from './assessment.model';

export interface CreateAssessmentDto {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  classId: string;
  subjectId: string;
  name: string;
  code: string;
  type: AssessmentType;
  maxScore: number;
  passingScore: number;
  weightPercentage: number;
  assessmentDate: string;
  startTime?: string;
  endTime?: string;
  classroomId?: string;
  proctorIds?: string[];
  seatCapacity?: number;
  description?: string;
  status?: AssessmentStatus;
}

export interface UpdateAssessmentDto {
  name?: string;
  code?: string;
  type?: AssessmentType;
  maxScore?: number;
  passingScore?: number;
  weightPercentage?: number;
  assessmentDate?: string;
  startTime?: string;
  endTime?: string;
  classroomId?: string;
  proctorIds?: string[];
  seatCapacity?: number;
  description?: string;
  status?: AssessmentStatus;
}

export interface AssessmentQueryFilters {
  authorizedClassIds?: string[];
  authorizedSubjectIds?: string[];
  search?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  classId?: string;
  subjectId?: string;
  type?: AssessmentType;
  status?: AssessmentStatus;
  page?: number;
  limit?: number;
}
