import type { ProgramStatus, ResultCalculationType } from './program.model';

export type { ResultCalculationType };

export interface CreateProgramDto {
  schoolId?: string;
  branchId?: string;
  branchAvailability?: 'all' | string[];
  code: string;
  nameKh: string;
  nameEn: string;
  shortName?: string;
  description?: string;
  displayOrder?: number;
  resultCalculationType?: ResultCalculationType;
  status?: ProgramStatus;
}

export interface UpdateProgramDto {
  branchId?: string;
  branchAvailability?: 'all' | string[];
  code?: string;
  nameKh?: string;
  nameEn?: string;
  shortName?: string;
  description?: string;
  displayOrder?: number;
  resultCalculationType?: ResultCalculationType;
  status?: ProgramStatus;
}

export interface ProgramQueryFilters {
  schoolId?: string;
  search?: string;
  branchId?: string;
  status?: ProgramStatus;
  page?: number;
  limit?: number;
}
