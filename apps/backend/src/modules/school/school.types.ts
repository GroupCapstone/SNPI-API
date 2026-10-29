export interface CreateSchoolDto {
  code: string;
  nameKh: string;
  nameEn: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateSchoolDto {
  code?: string;
  nameKh?: string;
  nameEn?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  status?: 'active' | 'inactive';
}

export interface SchoolQueryFilters {
  search?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}
