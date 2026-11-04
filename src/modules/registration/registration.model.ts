import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type RegistrationStatus =
  | 'draft'
  | 'registered'
  | 'placement_pending'
  | 'placement_completed'
  | 'enrollment_pending'
  | 'enrolled'
  | 'cancelled';

export interface IRegistration extends Document {
  registrationNumber: string;
  studentId?: Types.ObjectId;
  referralSource?: string;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  programId: Types.ObjectId;
  firstName: string;
  lastName: string;
  khmerName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  phone: string;
  email?: string;
  address?: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  status: RegistrationStatus;
  registrationDate: Date;
  remarks?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    referralSource: {
      type: String,
      trim: true,
      maxlength: 150,
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
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    khmerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    guardianName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    guardianRelationship: {
      type: String,
      required: true,
      trim: true,
    },
    guardianPhone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'draft',
        'registered',
        'placement_pending',
        'placement_completed',
        'enrollment_pending',
        'enrolled',
        'cancelled',
      ],
      default: 'registered',
      required: true,
      index: true,
    },
    registrationDate: {
      type: Date,
      required: true,
      default: Date.now,
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

registrationSchema.index({ registrationNumber: 1, isDeleted: 1 });
registrationSchema.index({ branchId: 1, status: 1, isDeleted: 1 });

export const RegistrationModel = model<IRegistration>('Registration', registrationSchema);
