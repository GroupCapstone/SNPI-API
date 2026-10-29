import type {
  IBirthplace,
  ICurrentAddress,
  IGuardian,
  StudentGender,
  StudentStatus,
} from './student.model';
export type { GuardianRelationship } from './student.model';

export interface CreateStudentDTO {
  studentId?: string;
  schoolId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  khmerName: string;
  gender: StudentGender;
  dateOfBirth: string | Date;
  placeOfBirth?: string;
  birthplace?: IBirthplace;
  nationality?: string;
  phone?: string;
  email?: string;
  address?: string;
  currentAddress?: ICurrentAddress;
  photo?: string;
  nationalId?: string;
  admissionDate?: string | Date;
  status?: StudentStatus;
  guardians?: IGuardian[];
}

export interface UpdateStudentDTO {
  schoolId?: string;
  branchId?: string;
  firstName?: string;
  lastName?: string;
  khmerName?: string;
  gender?: StudentGender;
  dateOfBirth?: string | Date;
  placeOfBirth?: string;
  birthplace?: IBirthplace;
  nationality?: string;
  phone?: string;
  email?: string;
  address?: string;
  currentAddress?: ICurrentAddress;
  photo?: string;
  nationalId?: string;
  admissionDate?: string | Date;
  status?: StudentStatus;
  guardians?: IGuardian[];
}

export interface StudentQueryFilters {
  authorizedStudentIds?: string[];
  authorizedBranchIds?: string[];
  page?: number;
  limit?: number;
  search?: string;
  schoolId?: string;
  branchId?: string;
  status?: StudentStatus;
  gender?: StudentGender;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DuplicateCheckCriteria {
  khmerName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | Date;
  phone?: string;
  guardianPhone?: string;
  excludeId?: string;
}

export interface DuplicateMatchItem {
  studentId: string;
  khmerName: string;
  fullNameEn: string;
  gender: string;
  dateOfBirth: string;
  phone?: string;
  branchName?: string;
  matchReasons: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface DuplicateCheckResponse {
  hasDuplicate: boolean;
  matches: DuplicateMatchItem[];
}

export interface RawImportStudentRow {
  rowNumber?: number;
  khmerName: string;
  firstName?: string;
  lastName?: string;
  englishName?: string;
  gender?: string;
  dateOfBirth?: string | number | Date;
  phone?: string;
  email?: string;
  birthplaceProvince?: string;
  birthplaceDistrict?: string;
  birthplaceCommune?: string;
  birthplaceVillage?: string;
  currentProvince?: string;
  currentDistrict?: string;
  currentCommune?: string;
  currentVillage?: string;
  address?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
  admissionDate?: string | number | Date;
  notes?: string;
}

export interface NormalizedImportStudent {
  rowNumber: number;
  khmerName: string;
  firstName: string;
  lastName: string;
  gender: StudentGender;
  dateOfBirth: Date;
  phone?: string;
  email?: string;
  birthplace: IBirthplace;
  currentAddress: ICurrentAddress;
  guardians: IGuardian[];
  admissionDate: Date;
  status: StudentStatus;
  validationStatus: 'valid' | 'warning' | 'error' | 'duplicate';
  issues: Array<{ field: string; message: string; severity: 'error' | 'warning' | 'info' }>;
  duplicateMatch?: DuplicateMatchItem;
}

export interface ImportPreviewResponse {
  totalRows: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
  duplicateCount: number;
  rows: NormalizedImportStudent[];
}

export interface ConfirmImportPayload {
  schoolId: string;
  branchId: string;
  rows: Array<Omit<CreateStudentDTO, 'schoolId' | 'branchId'>>;
  skipDuplicates?: boolean;
}

export interface ConfirmImportResponse {
  totalProcessed: number;
  importedCount: number;
  skippedCount: number;
  errors: Array<{ rowNumber?: number; studentName?: string; reason: string }>;
  createdStudents: Array<{
    id: string;
    studentId: string;
    khmerName: string;
  }>;
}
