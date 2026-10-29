import type {
  EducationLevel,
  EmployeeGender,
  EmployeeStatus,
  EmploymentType,
  MaritalStatus,
} from './employee.model';

export interface BirthplaceDto {
  province?: string;
  district?: string;
  commune?: string;
  village?: string;
}

export interface CurrentAddressDto {
  province?: string;
  district?: string;
  commune?: string;
  village?: string;
  additionalAddress?: string;
}

export interface FamilyMemberDto {
  name?: string;
  age?: number;
  nationality?: string;
  ethnicity?: string;
  livingStatus?: 'living' | 'deceased';
  occupation?: string;
}

export interface EmployeeDocumentDto {
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt?: string | Date;
  uploadedBy?: string;
  description?: string;
  status?: 'active' | 'archived';
}

export interface CreateEmployeeDto {
  employeeId?: string; // If omitted, auto-generated via SequenceService
  legacyEmployeeNumber?: string;
  schoolId: string;
  branchId: string;
  departmentId: string;
  positionId: string;

  // Personal
  firstName: string;
  lastName: string;
  khmerName: string;
  gender: EmployeeGender;
  dateOfBirth: string | Date;
  nationality?: string;
  ethnicity?: string;
  nationalIdNumber?: string;
  photo?: string;
  maritalStatus?: MaritalStatus;
  numberOfChildren?: number;

  // Addresses
  birthplace?: BirthplaceDto;
  currentAddress?: CurrentAddressDto;
  address?: string;

  // Contact
  phone?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;

  // Education & Skills
  educationLevel?: EducationLevel;
  major?: string;
  foreignLanguages?: string[];
  otherSkills?: string[];
  workExperienceSummary?: string;

  // Family
  father?: FamilyMemberDto;
  mother?: FamilyMemberDto;

  // Documents
  documents?: EmployeeDocumentDto[];

  // Employment
  employmentType: EmploymentType;
  joiningDate: string | Date;
  status?: EmployeeStatus;
}

export interface UpdateEmployeeDto {
  employeeId?: string;
  schoolId?: string;
  branchId?: string;
  departmentId?: string;
  positionId?: string;
  legacyEmployeeNumber?: string;

  // Personal
  firstName?: string;
  lastName?: string;
  khmerName?: string;
  gender?: EmployeeGender;
  dateOfBirth?: string | Date;
  nationality?: string;
  ethnicity?: string;
  nationalIdNumber?: string;
  photo?: string;
  maritalStatus?: MaritalStatus;
  numberOfChildren?: number;

  // Addresses
  birthplace?: BirthplaceDto;
  currentAddress?: CurrentAddressDto;
  address?: string;

  // Contact
  phone?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;

  // Education & Skills
  educationLevel?: EducationLevel;
  major?: string;
  foreignLanguages?: string[];
  otherSkills?: string[];
  workExperienceSummary?: string;

  // Family
  father?: FamilyMemberDto;
  mother?: FamilyMemberDto;

  // Documents
  documents?: EmployeeDocumentDto[];

  // Employment
  employmentType?: EmploymentType;
  joiningDate?: string | Date;
  status?: EmployeeStatus;
}

export interface EmployeeQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  departmentId?: string;
  positionId?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  educationLevel?: EducationLevel;
  gender?: EmployeeGender;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
