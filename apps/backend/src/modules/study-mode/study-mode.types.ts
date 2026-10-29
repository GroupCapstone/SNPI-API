export interface CreateStudyModeDto {
  schoolId?: string;
  code: string;
  nameEn: string;
  nameKh: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateStudyModeDto {
  nameEn?: string;
  nameKh?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface StudyModeQueryFilters {
  schoolId?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
