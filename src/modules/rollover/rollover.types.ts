import type {
  IRolloverClassMapping,
  IRolloverExecutionResult,
  IRolloverPlan,
  IRolloverStudentDecision,
  IRolloverValidationSummary,
  RolloverClassAction,
  RolloverPlanStatus,
  RolloverStudentDecision,
} from './rollover.model';

export interface CreateRolloverPlanDto {
  schoolId?: string;
  branchId: string;
  programId?: string;
  sourceAcademicYearId: string;
  sourcePeriodId: string;
  targetAcademicYearId: string;
  targetPeriodId: string;
  options?: {
    carryClasses?: boolean;
    carryTeacherSuggestions?: boolean;
    carryScheduleSuggestions?: boolean;
    autoSectionDistribution?: boolean;
  };
  classMappings?: Array<{
    sourceClassId: string;
    targetClassId?: string;
    targetClassName: string;
    targetClassCode: string;
    targetProgramId: string;
    targetLevelId: string;
    targetSection: string;
    targetCapacity?: number;
    action?: RolloverClassAction;
  }>;
  studentDecisions?: Array<{
    studentId: string;
    sourceEnrollmentId: string;
    systemRecommendedDecision?: RolloverStudentDecision;
    finalDecision?: RolloverStudentDecision;
    decision?: RolloverStudentDecision;
    targetClassId?: string;
    targetLevelId?: string;
    targetProgramId?: string;
    targetBranchId?: string;
    reason?: string;
  }>;
}

export interface UpdateRolloverPlanDto {
  options?: {
    carryClasses?: boolean;
    carryTeacherSuggestions?: boolean;
    carryScheduleSuggestions?: boolean;
    autoSectionDistribution?: boolean;
  };
  classMappings?: Array<{
    sourceClassId: string;
    targetClassId?: string;
    targetClassName: string;
    targetClassCode: string;
    targetProgramId: string;
    targetLevelId: string;
    targetSection: string;
    targetCapacity?: number;
    action?: RolloverClassAction;
  }>;
  studentDecisions?: Array<{
    studentId: string;
    sourceEnrollmentId?: string;
    systemRecommendedDecision?: RolloverStudentDecision;
    finalDecision?: RolloverStudentDecision;
    decision?: RolloverStudentDecision;
    targetClassId?: string;
    targetLevelId?: string;
    targetProgramId?: string;
    targetBranchId?: string;
    reason?: string;
  }>;
}

export interface ExecuteRolloverDto {
  idempotencyKey?: string;
  closeSourcePeriod?: boolean;
}

export interface RolloverPlanQueryFilters {
  schoolId?: string;
  branchId?: string;
  programId?: string;
  sourcePeriodId?: string;
  targetPeriodId?: string;
  status?: RolloverPlanStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedRolloverPlans {
  data: IRolloverPlan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TargetPeriodReadinessDto {
  targetPeriodId: string;
  targetPeriodName: string;
  status: string;
  isReadyToOpen: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  checkedAt: Date;
  checks: {
    classes: {
      passed: boolean;
      classesCount: number;
      message: string;
    };
    students: {
      passed: boolean;
      enrolledCount: number;
      message: string;
    };
    capacity: {
      passed: boolean;
      overCapacityCount: number;
      message: string;
    };
    teacherAssignments: {
      passed: boolean;
      unassignedClassesCount: number;
      message: string;
    };
    timetableConflicts: {
      passed: boolean;
      conflictsCount: number;
      message: string;
    };
    academicRules: {
      passed: boolean;
      activeRulesCount: number;
      message: string;
    };
    feeSetup: {
      passed: boolean;
      configuredFeesCount: number;
      message: string;
    };
  };
  metrics: {
    classesCount: number;
    enrolledStudentsCount: number;
    assignedTeachersCount: number;
    schedulesCount: number;
    scheduleConflictsCount: number;
    unresolvedRulesCount: number;
    activeFeesCount?: number;
  };
  blockingIssues: string[];
  warnings: string[];
}

export type {
  IRolloverClassMapping,
  IRolloverExecutionResult,
  IRolloverPlan,
  IRolloverStudentDecision,
  IRolloverValidationSummary,
  RolloverClassAction,
  RolloverPlanStatus,
  RolloverStudentDecision,
};
