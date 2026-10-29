import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IScoreRevision extends Document {
  scoreId: Types.ObjectId;
  studentId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  assessmentId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  branchId: Types.ObjectId;
  oldScore: number;
  newScore: number;
  oldAbsent: boolean;
  newAbsent: boolean;
  reason: string;
  changedBy: Types.ObjectId | string;
  changedAt: Date;
  approvedBy?: Types.ObjectId | string;
  correctionRequestId?: Types.ObjectId;
}

const scoreRevisionSchema = new Schema<IScoreRevision>(
  {
    scoreId: { type: Schema.Types.ObjectId, ref: 'Score', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    oldScore: { type: Number, required: true },
    newScore: { type: Number, required: true },
    oldAbsent: { type: Boolean, required: true },
    newAbsent: { type: Boolean, required: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    changedBy: { type: Schema.Types.Mixed, required: true },
    changedAt: { type: Date, required: true, default: Date.now },
    approvedBy: { type: Schema.Types.Mixed },
    correctionRequestId: { type: Schema.Types.ObjectId, ref: 'HistoricalCorrection' },
  },
  { versionKey: false },
);

scoreRevisionSchema.index({ scoreId: 1, changedAt: -1 });
scoreRevisionSchema.index({ studentId: 1, academicYearId: 1, academicPeriodId: 1, changedAt: -1 });
scoreRevisionSchema.index({ branchId: 1, changedAt: -1 });

export const ScoreRevisionModel = model<IScoreRevision>('ScoreRevision', scoreRevisionSchema);
