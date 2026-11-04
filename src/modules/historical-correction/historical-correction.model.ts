import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type HistoricalCorrectionStatus =
  'pending' | 'approved' | 'rejected' | 'applied' | 'cancelled';

export type HistoricalCorrectionEntityType = 'score' | 'term_result' | 'attendance';

export interface IHistoricalCorrection extends Document {
  correctionNumber: string;
  entityType: HistoricalCorrectionEntityType;
  entityId: Types.ObjectId;
  studentId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  branchId: Types.ObjectId;
  reason: string;
  requestedBy: Types.ObjectId | string;
  reviewedBy?: Types.ObjectId | string;
  reviewedAt?: Date;
  reviewRemarks?: string;
  status: HistoricalCorrectionStatus;
  previousValue: Record<string, unknown>;
  proposedValue: Record<string, unknown>;
  appliedValue?: Record<string, unknown>;
  appliedBy?: Types.ObjectId | string;
  appliedAt?: Date;
  unlockToken?: string;
  unlockExpiresAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const historicalCorrectionSchema = new Schema<IHistoricalCorrection>(
  {
    correctionNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    entityType: {
      type: String,
      enum: ['score', 'term_result', 'attendance'],
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    requestedBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
    reviewedBy: {
      type: Schema.Types.Mixed,
    },
    reviewedAt: {
      type: Date,
    },
    reviewRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'applied', 'cancelled'],
      default: 'pending',
      required: true,
      index: true,
    },
    previousValue: {
      type: Schema.Types.Mixed,
      required: true,
    },
    proposedValue: {
      type: Schema.Types.Mixed,
      required: true,
    },
    appliedValue: {
      type: Schema.Types.Mixed,
    },
    appliedBy: {
      type: Schema.Types.Mixed,
    },
    appliedAt: {
      type: Date,
    },
    unlockToken: {
      type: String,
      index: true,
    },
    unlockExpiresAt: {
      type: Date,
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

historicalCorrectionSchema.index(
  { correctionNumber: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

historicalCorrectionSchema.index({ entityType: 1, entityId: 1, status: 1 });
historicalCorrectionSchema.index({ branchId: 1, academicYearId: 1, status: 1 });

export const HistoricalCorrectionModel = model<IHistoricalCorrection>(
  'HistoricalCorrection',
  historicalCorrectionSchema,
);
