import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type StudentGender = 'male' | 'female' | 'other';
export type StudentStatus =
  'active' | 'inactive' | 'suspended' | 'graduated' | 'withdrawn' | 'transferred';
export type GuardianRelationship = 'father' | 'mother' | 'guardian' | 'other';

export interface IBirthplace {
  province?: string;
  district?: string;
  commune?: string;
  village?: string;
}

export interface ICurrentAddress {
  province?: string;
  district?: string;
  commune?: string;
  village?: string;
  street?: string;
  houseNumber?: string;
  sameAsBirthplace?: boolean;
}

export interface IGuardian {
  fullName: string;
  khmerName?: string;
  relationship: GuardianRelationship;
  phone: string;
  email?: string;
  occupation?: string;
  address?: string;
  isPrimary: boolean;
  isEmergencyContact: boolean;
}

export interface IStudentStatusHistory {
  previousStatus: StudentStatus;
  newStatus: StudentStatus;
  reason?: string;
  changedBy: Types.ObjectId | string;
  changedAt: Date;
}

export interface IStudent extends Document {
  studentId: string;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  firstName: string;
  lastName: string;
  khmerName: string;
  gender: StudentGender;
  dateOfBirth: Date;
  placeOfBirth?: string;
  birthplace?: IBirthplace;
  nationality?: string;
  phone?: string;
  email?: string;
  address?: string;
  currentAddress?: ICurrentAddress;
  photo?: string;
  nationalId?: string;
  admissionDate: Date;
  status: StudentStatus;
  statusHistory?: IStudentStatusHistory[];
  guardians: IGuardian[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const guardianSchema = new Schema<IGuardian>(
  {
    fullName: { type: String, required: true, trim: true },
    khmerName: { type: String, trim: true },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      default: 'guardian',
      required: true,
    },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    occupation: { type: String, trim: true },
    address: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
    isEmergencyContact: { type: Boolean, default: false },
  },
  { _id: false },
);

const birthplaceSchema = new Schema<IBirthplace>(
  {
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    commune: { type: String, trim: true },
    village: { type: String, trim: true },
  },
  { _id: false },
);

const currentAddressSchema = new Schema<ICurrentAddress>(
  {
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    commune: { type: String, trim: true },
    village: { type: String, trim: true },
    street: { type: String, trim: true },
    houseNumber: { type: String, trim: true },
    sameAsBirthplace: { type: Boolean, default: false },
  },
  { _id: false },
);

const studentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
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
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    khmerName: {
      type: String,
      required: true,
      trim: true,
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
    placeOfBirth: {
      type: String,
      trim: true,
    },
    birthplace: {
      type: birthplaceSchema,
      default: () => ({}),
    },
    nationality: {
      type: String,
      default: 'Cambodian',
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    currentAddress: {
      type: currentAddressSchema,
      default: () => ({}),
    },
    photo: {
      type: String,
      trim: true,
    },
    nationalId: {
      type: String,
      trim: true,
    },
    admissionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'graduated', 'withdrawn', 'transferred'],
      default: 'active',
      required: true,
      index: true,
    },
    statusHistory: {
      type: [
        {
          previousStatus: { type: String, required: true },
          newStatus: { type: String, required: true },
          reason: { type: String, trim: true },
          changedBy: { type: Schema.Types.Mixed, required: true },
          changedAt: { type: Date, default: Date.now, required: true },
        },
      ],
      default: [],
    },
    guardians: {
      type: [guardianSchema],
      default: [],
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

studentSchema.index(
  { studentId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
studentSchema.index({ branchId: 1, isDeleted: 1 });
studentSchema.index({ status: 1, isDeleted: 1 });
studentSchema.index({ lastName: 1, firstName: 1 });
studentSchema.index({ khmerName: 1, isDeleted: 1 });
studentSchema.index({ phone: 1, isDeleted: 1 });

export const StudentModel = model<IStudent>('Student', studentSchema);
