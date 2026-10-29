import type { RegistrationStatus } from './registration.model';

export interface CreateRegistrationDTO {
  registrationNumber?: string;
  studentId?: string;
  referralSource?: string;
  schoolId: string;
  branchId: string;
  academicYearId: string;
  programId: string;
  firstName: string;
  lastName: string;
  khmerName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string | Date;
  phone: string;
  email?: string;
  address?: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  status?: RegistrationStatus;
  registrationDate?: string | Date;
  remarks?: string;
}

export interface UpdateRegistrationDTO {
  studentId?: string;
  referralSource?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  programId?: string;
  firstName?: string;
  lastName?: string;
  khmerName?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string | Date;
  phone?: string;
  email?: string;
  address?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  status?: RegistrationStatus;
  registrationDate?: string | Date;
  remarks?: string;
}

export interface RegistrationQueryFilters {
  authorizedBranchIds?: string[];
  page?: number;
  limit?: number;
  search?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  programId?: string;
  status?: RegistrationStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
