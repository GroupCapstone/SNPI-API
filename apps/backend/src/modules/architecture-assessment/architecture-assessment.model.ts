import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type {
  AssessmentCheckItem,
  AssessmentDomain,
  ComplianceTier,
} from './architecture-assessment.types';

export interface IArchitectureEvaluation extends Document {
  targetName: string;
  targetType: 'MONOREPO' | 'SERVICE' | 'CONTAINER' | 'CLUSTER';
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  overallScore: number;
  tier: ComplianceTier;
  domainScores: Record<AssessmentDomain, number>;
  p0ViolationsCount: number;
  p1ViolationsCount: number;
  items: AssessmentCheckItem[];
  triggeredBy?: Types.ObjectId | string;
  createdAt: Date;
  completedAt?: Date;
}

const checkItemSchema = new Schema<AssessmentCheckItem>(
  {
    checkId: { type: String, required: true },
    domain: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['P0', 'P1', 'P2', 'P3'], required: true },
    status: {
      type: String,
      enum: ['PASSED', 'FAILED', 'WARNING', 'NOT_APPLICABLE'],
      required: true,
    },
    score: { type: Number, required: true, min: 0, max: 100 },
    weight: { type: Number, required: true, min: 0, max: 1 },
    evidence: { type: String },
    remediation: { type: String },
    automated: { type: Boolean, default: true },
    verifiedAt: { type: String },
  },
  { _id: false },
);

const architectureEvaluationSchema = new Schema<IArchitectureEvaluation>(
  {
    targetName: { type: String, required: true, trim: true, index: true },
    targetType: {
      type: String,
      enum: ['MONOREPO', 'SERVICE', 'CONTAINER', 'CLUSTER'],
      default: 'MONOREPO',
    },
    status: {
      type: String,
      enum: ['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
      default: 'QUEUED',
      index: true,
    },
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    tier: {
      type: String,
      enum: ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'NON_COMPLIANT'],
      default: 'NON_COMPLIANT',
    },
    domainScores: { type: Schema.Types.Mixed, default: {} },
    p0ViolationsCount: { type: Number, default: 0 },
    p1ViolationsCount: { type: Number, default: 0 },
    items: [checkItemSchema],
    triggeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'architecture_evaluations',
  },
);

architectureEvaluationSchema.index({ targetName: 1, createdAt: -1 });
architectureEvaluationSchema.index({ status: 1, createdAt: -1 });

export const ArchitectureEvaluationModel = model<IArchitectureEvaluation>(
  'ArchitectureEvaluation',
  architectureEvaluationSchema,
);
