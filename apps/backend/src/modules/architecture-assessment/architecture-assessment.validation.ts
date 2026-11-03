import { z } from 'zod';

export const assessmentDomainEnum = z.enum([
  'SCALABILITY',
  'RESILIENCY',
  'EFFICIENCY',
  'SIMPLICITY',
  'DOCUMENTATION',
  'DISASTER_RECOVERY',
  'MODULARITY',
  'INTEROPERABILITY',
  'OBSERVABILITY',
  'GITHUB_ENTERPRISE',
]);

export const checkPriorityEnum = z.enum(['P0', 'P1', 'P2', 'P3']);
export const checkStatusEnum = z.enum(['PASSED', 'FAILED', 'WARNING', 'NOT_APPLICABLE']);
export const complianceTierEnum = z.enum([
  'PLATINUM',
  'GOLD',
  'SILVER',
  'BRONZE',
  'NON_COMPLIANT',
]);

export const triggerEvaluationSchema = z.object({
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  body: z.object({
    targetName: z.string().trim().min(1).default('SNP-SMS-Monorepo'),
    targetType: z.enum(['MONOREPO', 'SERVICE', 'CONTAINER', 'CLUSTER']).default('MONOREPO'),
    domains: z.array(assessmentDomainEnum).optional(),
    includeGitHubEnterprise: z.boolean().default(false),
    options: z
      .object({
        dryRun: z.boolean().default(false),
        autoRemediate: z.boolean().default(false),
      })
      .optional(),
  }),
});

export const queryEvaluationsSchema = z.object({
  query: z.object({
    targetName: z.string().trim().optional(),
    status: z.enum(['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
    tier: complianceTierEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const evaluationIdParamSchema = z.object({
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  body: z.object({}).passthrough(),
});

export const updateCheckItemSchema = z.object({
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().trim().min(1),
    checkId: z.string().trim().min(3),
  }),
  body: z.object({
    status: checkStatusEnum,
    score: z.number().min(0).max(100).optional(),
    evidence: z.string().trim().optional(),
    remediation: z.string().trim().optional(),
  }),
});
