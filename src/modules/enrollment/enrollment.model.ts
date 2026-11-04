import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type EnrollmentStatus =
  | 'pending'
  | 'enrolled'
  | 'active'
  | 'completed'
  | 'promoted'
  | 'repeated'
  | 'suspended'
  | 'withdrawn'
  | 'dropped'
  | 'transferred'
  | 'cancelled';

export type TuitionPaymentStatus = 'pending' | 'partially_paid' | 'paid' | 'waived';

export interface IEnrollment extends Document {
  enrollmentCode: string;
  studentId: Types.ObjectId;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId?: Types.ObjectId;
  programId: Types.ObjectId;
  levelId: Types.ObjectId;
  classId: Types.ObjectId;
  studyModeId?: Types.ObjectId;
  attemptNumber: number;
  previousEnrollmentId?: Types.ObjectId;
  completionReason?:
    'completed' | 'promoted' | 'repeated' | 'transferred' | 'withdrawn' | 'cancelled';
  enrollmentDate: Date;
  startDate?: Date;
  endDate?: Date;
  status: EnrollmentStatus;
  tuitionStatus: TuitionPaymentStatus;
  remarks?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    enrollmentCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
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
      required: false,
      index: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    levelId: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    studyModeId: {
      type: Schema.Types.ObjectId,
      ref: 'StudyMode',
      index: true,
    },
    attemptNumber: { type: Number, required: true, default: 1, min: 1 },
    previousEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', index: true },
    completionReason: {
      type: String,
      enum: ['completed', 'promoted', 'repeated', 'transferred', 'withdrawn', 'cancelled'],
    },
    enrollmentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'enrolled',
        'active',
        'completed',
        'promoted',
        'repeated',
        'suspended',
        'withdrawn',
        'dropped',
        'transferred',
        'cancelled',
      ],
      default: 'active',
      required: true,
      index: true,
    },
    tuitionStatus: {
      type: String,
      enum: ['pending', 'partially_paid', 'paid', 'waived'],
      default: 'pending',
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
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
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

enrollmentSchema.index({ enrollmentCode: 1, isDeleted: 1 });
enrollmentSchema.index({ studentId: 1, academicYearId: 1, classId: 1, isDeleted: 1 });
enrollmentSchema.index({ studentId: 1, academicYearId: -1, academicPeriodId: -1, createdAt: -1 });
enrollmentSchema.index({
  branchId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  classId: 1,
  status: 1,
});
enrollmentSchema.index({ status: 1, isDeleted: 1 });
enrollmentSchema.index({ classId: 1, status: 1, isDeleted: 1 });
enrollmentSchema.index({ branchId: 1, academicYearId: 1, status: 1, isDeleted: 1 });
enrollmentSchema.index(
  { studentId: 1, classId: 1, academicPeriodId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['enrolled', 'active'] }, isDeleted: false },
  },
);

export const EnrollmentModel = model<IEnrollment>('Enrollment', enrollmentSchema);
