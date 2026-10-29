import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type StudentTransferStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type StudentTransferType = 'BRANCH' | 'CLASS' | 'PROGRAM' | 'LEVEL';

export interface IStudentTransfer extends Document {
  transferNumber: string;
  transferType: StudentTransferType;
  studentId: Types.ObjectId;
  fromSchoolId: Types.ObjectId;
  toSchoolId: Types.ObjectId;
  fromBranchId: Types.ObjectId;
  toBranchId: Types.ObjectId;
  fromProgramId?: Types.ObjectId;
  toProgramId?: Types.ObjectId;
  fromLevelId?: Types.ObjectId;
  toLevelId?: Types.ObjectId;
  fromClassId?: Types.ObjectId;
  toClassId?: Types.ObjectId;
  transferDate: Date;
  effectiveDate?: Date;
  reason: string;
  status: StudentTransferStatus;
  approvalDate?: Date;
  approvedBy?: Types.ObjectId | string;
  remarks?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const studentTransferSchema = new Schema<IStudentTransfer>(
  {
    transferNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    transferType: {
      type: String,
      enum: ['BRANCH', 'CLASS', 'PROGRAM', 'LEVEL'],
      default: 'BRANCH',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    fromSchoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    toSchoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    fromBranchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    toBranchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    fromProgramId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
    },
    toProgramId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
    },
    fromLevelId: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
    },
    toLevelId: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
    },
    fromClassId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    toClassId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    transferDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    effectiveDate: {
      type: Date,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      required: true,
      index: true,
    },
    approvalDate: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

studentTransferSchema.index({ transferNumber: 1, isDeleted: 1 });
studentTransferSchema.index({ fromBranchId: 1, toBranchId: 1, status: 1, isDeleted: 1 });
studentTransferSchema.index({ studentId: 1, transferDate: -1, isDeleted: 1 });

export const StudentTransferModel = model<IStudentTransfer>(
  'StudentTransfer',
  studentTransferSchema,
);
