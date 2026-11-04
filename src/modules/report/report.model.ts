import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export const OFFICIAL_DOCUMENT_TYPES = [
  'report_card',
  'transcript',
  'certificate',
  'payment_receipt',
  'invoice',
] as const;

export type OfficialDocumentType = (typeof OFFICIAL_DOCUMENT_TYPES)[number];

export interface IOfficialDocument extends Document {
  documentNumber: string;
  type: OfficialDocumentType;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId?: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  studentId?: Types.ObjectId;
  sourceId: Types.ObjectId;
  sourceUpdatedAt?: Date;
  payload: Record<string, unknown>;
  contentHash: string;
  generatedBy: Types.ObjectId | string;
  generatedAt: Date;
  status: 'active' | 'voided';
  voidReason?: string;
  voidedAt?: Date;
  voidedBy?: Types.ObjectId | string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const officialDocumentSchema = new Schema<IOfficialDocument>(
  {
    documentNumber: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: OFFICIAL_DOCUMENT_TYPES, required: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', index: true },
    academicPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', index: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, index: true },
    sourceUpdatedAt: { type: Date },
    payload: { type: Schema.Types.Mixed, required: true },
    contentHash: { type: String, required: true, index: true },
    generatedBy: { type: Schema.Types.Mixed, required: true },
    generatedAt: { type: Date, required: true, default: Date.now, index: true },
    status: { type: String, enum: ['active', 'voided'], default: 'active', index: true },
    voidReason: { type: String, trim: true, maxlength: 500 },
    voidedAt: { type: Date },
    voidedBy: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

officialDocumentSchema.index(
  { documentNumber: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
officialDocumentSchema.index({ type: 1, sourceId: 1, contentHash: 1, isDeleted: 1 });
officialDocumentSchema.index({ branchId: 1, generatedAt: -1, type: 1, isDeleted: 1 });
officialDocumentSchema.index({ documentNumber: 1, type: 1, status: 1, isDeleted: 1 });
officialDocumentSchema.index({
  branchId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  studentId: 1,
  isDeleted: 1,
});

export const OfficialDocumentModel = model<IOfficialDocument>(
  'OfficialDocument',
  officialDocumentSchema,
);
