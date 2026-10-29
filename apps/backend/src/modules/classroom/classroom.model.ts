import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IClassroom extends Document {
  schoolId?: Types.ObjectId;
  branchId: Types.ObjectId;
  code: string;
  name: string;
  building?: string;
  floor?: string;
  capacity: number;
  description?: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classroomSchema = new Schema<IClassroom>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    building: { type: String },
    floor: { type: String },
    capacity: { type: Number, required: true, min: 1, default: 30 },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

classroomSchema.index({ branchId: 1, code: 1, isDeleted: 1 }, { unique: true });

export const ClassroomModel = model<IClassroom>('Classroom', classroomSchema);
