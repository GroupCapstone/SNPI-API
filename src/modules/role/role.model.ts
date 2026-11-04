import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type RoleStatus = 'active' | 'inactive';

export interface IRole extends Document {
  code: string;
  nameEn: string;
  nameKh?: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  status: RoleStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
    },
    nameKh: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
      required: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
      index: true,
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

roleSchema.index({ code: 1, isDeleted: 1 });

export const RoleModel = model<IRole>('Role', roleSchema);
