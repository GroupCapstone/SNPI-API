import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface ISchool extends Document {
  nameKh: string;
  nameEn: string;
  code: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    nameKh: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    logo: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    website: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

schoolSchema.index({ code: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

export const SchoolModel = model<ISchool>('School', schoolSchema);
