import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type AcademicRuleType =
  'grade_scheme' | 'assessment_scheme' | 'attendance_threshold' | 'promotion_rule';

export type AcademicRuleStatus = 'draft' | 'active' | 'archived';

export interface IAcademicRule extends Document {
  ruleType: AcademicRuleType;
  code: string;
  name: string;
  version: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  schoolId: Types.ObjectId;
  branchId?: Types.ObjectId;
  academicYearId?: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  programId?: Types.ObjectId;
  levelId?: Types.ObjectId;
  config: Record<string, unknown>;
  status: AcademicRuleStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const academicRuleSchema = new Schema<IAcademicRule>(
  {
    ruleType: {
      type: String,
      enum: ['grade_scheme', 'assessment_scheme', 'attendance_threshold', 'promotion_rule'],
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    effectiveFrom: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    effectiveTo: {
      type: Date,
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      index: true,
    },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      index: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      index: true,
    },
    levelId: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
      index: true,
    },
    config: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.Mixed,
    },
    updatedBy: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

academicRuleSchema.index(
  { schoolId: 1, ruleType: 1, code: 1, version: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

academicRuleSchema.index({ schoolId: 1, ruleType: 1, status: 1, effectiveFrom: -1 });

export const AcademicRuleModel = model<IAcademicRule>('AcademicRule', academicRuleSchema);
