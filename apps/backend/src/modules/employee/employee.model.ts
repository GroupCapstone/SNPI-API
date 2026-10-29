import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type EmployeeGender = 'male' | 'female' | 'other';
export type EmploymentType =
  'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary' | 'probation';
export type EmployeeStatus =
  'active' | 'inactive' | 'on_leave' | 'suspended' | 'resigned' | 'terminated';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type EducationLevel =
  'high_school' | 'associate' | 'bachelor' | 'master' | 'doctorate' | 'other';

export interface IEmployeeDocument {
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy?: Types.ObjectId | string;
  description?: string;
  status: 'active' | 'archived';
}

export interface IEmployee extends Document {
  employeeId: string;
  legacyEmployeeNumber?: string;

  // 1. Organizational Hierarchy
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  departmentId: Types.ObjectId;
  positionId: Types.ObjectId;

  // 2. Personal Information
  firstName: string;
  lastName: string;
  khmerName: string;
  gender: EmployeeGender;
  dateOfBirth: Date;
  nationality?: string;
  ethnicity?: string;
  nationalIdNumber?: string;
  photo?: string;
  maritalStatus?: MaritalStatus;
  numberOfChildren?: number;

  // 3. Birthplace
  birthplace?: {
    province?: string;
    district?: string;
    commune?: string;
    village?: string;
  };

  // 4. Current Address
  currentAddress?: {
    province?: string;
    district?: string;
    commune?: string;
    village?: string;
    additionalAddress?: string;
  };
  address?: string; // Legacy / flat address fallback

  // 5. Contact Information
  phone?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;

  // 6. Education & Skills
  educationLevel?: EducationLevel;
  major?: string;
  foreignLanguages?: string[];
  otherSkills?: string[];
  workExperienceSummary?: string;

  // 7. Family Information
  father?: {
    name?: string;
    age?: number;
    nationality?: string;
    ethnicity?: string;
    livingStatus?: 'living' | 'deceased';
    occupation?: string;
  };
  mother?: {
    name?: string;
    age?: number;
    nationality?: string;
    ethnicity?: string;
    livingStatus?: 'living' | 'deceased';
    occupation?: string;
  };

  // 8. Documents
  documents?: IEmployeeDocument[];

  // Employment Parameters
  employmentType: EmploymentType;
  joiningDate: Date;
  status: EmployeeStatus;

  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeDocumentSchema = new Schema<IEmployeeDocument>(
  {
    documentType: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { _id: true },
);

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    legacyEmployeeNumber: {
      type: String,
      trim: true,
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
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    positionId: {
      type: Schema.Types.ObjectId,
      ref: 'Position',
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
    nationality: {
      type: String,
      trim: true,
      default: 'Cambodian',
    },
    ethnicity: {
      type: String,
      trim: true,
      default: 'Khmer',
    },
    nationalIdNumber: {
      type: String,
      trim: true,
      index: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
      default: 'single',
    },
    numberOfChildren: {
      type: Number,
      default: 0,
      min: 0,
    },
    birthplace: {
      province: { type: String, trim: true },
      district: { type: String, trim: true },
      commune: { type: String, trim: true },
      village: { type: String, trim: true },
    },
    currentAddress: {
      province: { type: String, trim: true },
      district: { type: String, trim: true },
      commune: { type: String, trim: true },
      village: { type: String, trim: true },
      additionalAddress: { type: String, trim: true },
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    primaryPhone: {
      type: String,
      trim: true,
    },
    secondaryPhone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    educationLevel: {
      type: String,
      enum: ['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other'],
      default: 'bachelor',
    },
    major: {
      type: String,
      trim: true,
    },
    foreignLanguages: {
      type: [String],
      default: [],
    },
    otherSkills: {
      type: [String],
      default: [],
    },
    workExperienceSummary: {
      type: String,
      trim: true,
    },
    father: {
      name: { type: String, trim: true },
      age: { type: Number },
      nationality: { type: String, trim: true },
      ethnicity: { type: String, trim: true },
      livingStatus: { type: String, enum: ['living', 'deceased'], default: 'living' },
      occupation: { type: String, trim: true },
    },
    mother: {
      name: { type: String, trim: true },
      age: { type: Number },
      nationality: { type: String, trim: true },
      ethnicity: { type: String, trim: true },
      livingStatus: { type: String, enum: ['living', 'deceased'], default: 'living' },
      occupation: { type: String, trim: true },
    },
    documents: {
      type: [employeeDocumentSchema],
      default: [],
    },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'intern', 'temporary', 'probation'],
      default: 'full_time',
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'suspended', 'resigned', 'terminated'],
      default: 'active',
      required: true,
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

employeeSchema.index(
  { employeeId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
employeeSchema.index(
  { schoolId: 1, employeeId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
employeeSchema.index({ branchId: 1, isDeleted: 1 });
employeeSchema.index({ departmentId: 1, isDeleted: 1 });
employeeSchema.index({ positionId: 1, isDeleted: 1 });
employeeSchema.index({ primaryPhone: 1, isDeleted: 1 });
employeeSchema.index({ email: 1, isDeleted: 1 });

export const EmployeeModel = model<IEmployee>('Employee', employeeSchema);
