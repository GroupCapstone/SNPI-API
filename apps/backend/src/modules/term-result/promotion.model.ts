import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IPromotion extends Document {
  studentId: Types.ObjectId;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId: Types.ObjectId;
  termResultId: Types.ObjectId;
  fromEnrollmentId: Types.ObjectId;
  toEnrollmentId?: Types.ObjectId;
  fromLevelId: Types.ObjectId;
  toLevelId?: Types.ObjectId;
  decision: 'promoted' | 'repeated' | 'continued' | 'completed';
  decisionReason?: string;
  processedBy: Types.ObjectId | string;
  processedAt: Date;
  isDeleted: boolean;
}

const promotionSchema = new Schema<IPromotion>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      required: true,
      index: true,
    },
    termResultId: { type: Schema.Types.ObjectId, ref: 'TermResult', required: true, unique: true },
    fromEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    toEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
    fromLevelId: { type: Schema.Types.ObjectId, ref: 'Level', required: true },
    toLevelId: { type: Schema.Types.ObjectId, ref: 'Level' },
    decision: {
      type: String,
      enum: ['promoted', 'repeated', 'continued', 'completed'],
      required: true,
      index: true,
    },
    decisionReason: { type: String, trim: true, maxlength: 500 },
    processedBy: { type: Schema.Types.Mixed, required: true },
    processedAt: { type: Date, required: true, default: Date.now },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

promotionSchema.index({ studentId: 1, academicYearId: -1, academicPeriodId: -1 });
promotionSchema.index({ branchId: 1, academicYearId: 1, academicPeriodId: 1, decision: 1 });

export const PromotionModel = model<IPromotion>('Promotion', promotionSchema);
