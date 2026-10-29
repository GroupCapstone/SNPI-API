import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type UserStatus = 'active' | 'inactive' | 'locked' | 'suspended';

export interface IUser extends Document {
  schoolId: Types.ObjectId;
  employeeId?: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  roles: string[];
  branchAccess: 'all' | string[];
  departmentAccess?: 'all' | string[];
  directPermissions?: string[];
  status: UserStatus;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  mustChangePassword: boolean;
  tokenVersion: number;
  refreshTokenHash?: string;
  previousRefreshTokenHash?: string;
  tokenRotatedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Never return password hash in queries unless explicitly requested via .select('+passwordHash')
    },
    roles: {
      type: [String],
      default: ['staff'],
      required: true,
    },
    branchAccess: {
      type: Schema.Types.Mixed,
      default: [],
      required: true,
    },
    departmentAccess: {
      type: Schema.Types.Mixed,
      default: [],
    },
    directPermissions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'locked', 'suspended'],
      default: 'active',
      required: true,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      required: true,
    },
    lockedUntil: {
      type: Date,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      required: true,
      select: true,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    previousRefreshTokenHash: {
      type: String,
      select: false,
    },
    tokenRotatedAt: {
      type: Date,
      select: false,
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
    toJSON: {
      transform: (_document, returnedObject) => {
        const sanitized = returnedObject as unknown as Record<string, unknown>;
        delete sanitized.passwordHash;
        delete sanitized.refreshTokenHash;
        delete sanitized.previousRefreshTokenHash;
        delete sanitized.tokenRotatedAt;
        return returnedObject;
      },
    },
    toObject: {
      transform: (_document, returnedObject) => {
        const sanitized = returnedObject as unknown as Record<string, unknown>;
        delete sanitized.passwordHash;
        delete sanitized.refreshTokenHash;
        delete sanitized.previousRefreshTokenHash;
        delete sanitized.tokenRotatedAt;
        return returnedObject;
      },
    },
  },
);

userSchema.index({ schoolId: 1, isDeleted: 1 });
userSchema.index({ employeeId: 1, isDeleted: 1 });

export const UserModel = model<IUser>('User', userSchema);
