import type { Types } from 'mongoose';

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export type SkillCategory =
  | 'pedagogy'
  | 'technical'
  | 'leadership'
  | 'administration'
  | 'communication'
  | 'language'
  | 'domain'
  | 'general';

export type EmployeeSkillStatus = 'pending' | 'verified' | 'expired' | 'rejected';

export interface ISkill {
  _id: Types.ObjectId;
  code: string;
  name: string;
  category: SkillCategory;
  description?: string;
  isActive: boolean;
  schoolId?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoleSkillRequirement {
  _id: Types.ObjectId;
  roleId: Types.ObjectId;
  skillId: Types.ObjectId;
  requiredLevel: ProficiencyLevel;
  isRequired: boolean;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmployeeSkill {
  _id: Types.ObjectId;
  employeeId: Types.ObjectId;
  skillId: Types.ObjectId;
  proficiencyLevel: ProficiencyLevel;
  yearsExperience?: number;
  evidenceDocument?: string;
  evidenceUrl?: string;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date | null;
  expiryDate?: Date | null;
  status: EmployeeSkillStatus;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillFilters {
  search?: string;
  category?: SkillCategory;
  isActive?: boolean;
  schoolId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RoleSkillRequirementFilters {
  roleId?: string;
  skillId?: string;
  isRequired?: boolean;
  page?: number;
  limit?: number;
}

export interface EmployeeSkillFilters {
  employeeId?: string;
  skillId?: string;
  status?: EmployeeSkillStatus;
  branchId?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}

export interface SkillGapItem {
  skillId: string;
  skillCode: string;
  skillName: string;
  category: SkillCategory;
  requiredLevel: ProficiencyLevel;
  isRequired: boolean;
  employeeLevel: number; // 0 if missing
  yearsExperience?: number;
  status: 'met' | 'exceeded' | 'gap' | 'missing';
  gapSize: number; // requiredLevel - employeeLevel (clamped to >= 0)
  isVerified: boolean;
  evidenceUrl?: string;
  expiryDate?: Date | null;
}

export interface EmployeeSkillGapAnalysis {
  employeeId: string;
  employeeCode?: string;
  employeeName: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  departmentName?: string;
  targetRole: {
    roleId: string;
    roleCode: string;
    roleName: string;
  };
  totalRequiredSkills: number;
  totalAcquiredSkills: number;
  totalGaps: number;
  matchPercentage: number;
  competencyScore: number; // Average proficiency on required skills
  skills: SkillGapItem[];
}

export interface ConsolidatedSkillGapReportFilters {
  branchId?: string;
  departmentId?: string;
  roleId?: string;
  employeeId?: string;
  hasGapOnly?: boolean;
  category?: SkillCategory;
  page?: number;
  limit?: number;
}

export interface ConsolidatedSkillGapSummary {
  totalEmployeesEvaluated: number;
  averageMatchPercentage: number;
  topGapSkills: Array<{
    skillId: string;
    skillCode: string;
    skillName: string;
    category: SkillCategory;
    gapCount: number;
    averageRequiredLevel: number;
    averageCurrentLevel: number;
  }>;
  employees: EmployeeSkillGapAnalysis[];
}
