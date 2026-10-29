import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type SettingType = 'string' | 'number' | 'boolean' | 'json';
export type SettingCategory =
  | 'general'
  | 'academic'
  | 'finance'
  | 'student'
  | 'employee'
  | 'security'
  | 'notification'
  | 'document'
  | 'sequence';

export interface ISettingAuditHistory {
  oldValue?: unknown;
  newValue?: unknown;
  updatedBy: string;
  timestamp: Date;
}

export interface ISystemSetting extends Document {
  key: string;
  value: unknown;
  type: SettingType;
  category: SettingCategory;
  schoolId: Types.ObjectId;
  branchId?: Types.ObjectId;
  description?: string;
  isEditable: boolean;
  isDeleted: boolean;
  auditHistory: ISettingAuditHistory[];
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const systemSettingSchema = new Schema<ISystemSetting>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'json'],
      default: 'string',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'general',
        'academic',
        'finance',
        'student',
        'employee',
        'security',
        'notification',
        'document',
        'sequence',
      ],
      default: 'general',
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
      required: false,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    auditHistory: {
      type: [
        new Schema(
          {
            oldValue: { type: Schema.Types.Mixed },
            newValue: { type: Schema.Types.Mixed },
            updatedBy: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    createdBy: {
      type: Schema.Types.Mixed,
      required: false,
    },
    updatedBy: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

systemSettingSchema.index({ schoolId: 1, key: 1, branchId: 1, isDeleted: 1 }, { unique: true });

export const SystemSettingModel = model<ISystemSetting>('SystemSetting', systemSettingSchema);
