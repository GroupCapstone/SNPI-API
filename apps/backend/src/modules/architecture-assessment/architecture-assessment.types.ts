export type AssessmentDomain =
  | 'SCALABILITY'
  | 'RESILIENCY'
  | 'EFFICIENCY'
  | 'SIMPLICITY'
  | 'DOCUMENTATION'
  | 'DISASTER_RECOVERY'
  | 'MODULARITY'
  | 'INTEROPERABILITY'
  | 'OBSERVABILITY'
  | 'GITHUB_ENTERPRISE';

export type CheckPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type CheckStatus = 'PASSED' | 'FAILED' | 'WARNING' | 'NOT_APPLICABLE';
export type ComplianceTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'NON_COMPLIANT';

export interface AssessmentCheckItem {
  checkId: string;
  domain: AssessmentDomain;
  category: string;
  title: string;
  description: string;
  priority: CheckPriority;
  status: CheckStatus;
  score: number;
  weight: number;
  evidence?: string;
  remediation?: string;
  automated: boolean;
  verifiedAt?: string;
}

export interface TriggerEvaluationDto {
  targetName: string;
  targetType: 'MONOREPO' | 'SERVICE' | 'CONTAINER' | 'CLUSTER';
  domains?: AssessmentDomain[];
  includeGitHubEnterprise?: boolean;
  options?: {
    dryRun?: boolean;
    autoRemediate?: boolean;
  };
}

export interface EvaluationFilters {
  targetName?: string;
  status?: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  tier?: ComplianceTier;
  page?: number;
  limit?: number;
}

export interface DomainScoreSummary {
  domain: AssessmentDomain;
  score: number;
  weight: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  p0Violations: number;
}
