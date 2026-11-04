import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type DepartmentStatus = 'active' | 'inactive';

export interface IDepartment extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  code: string;
  nameKh: string;
  nameEn: string;
  description?: string;
  managerId?: Types.ObjectId;
  status: DepartmentStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    nameKh: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

departmentSchema.index(
  { branchId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export const DepartmentModel = model<IDepartment>('Department', departmentSchema);
