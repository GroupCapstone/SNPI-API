import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type SessionType = 'morning' | 'afternoon' | 'evening' | 'hourly' | 'custom';

export interface ITimeSlot extends Document {
  schoolId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  code: string;
  name: string;
  sessionType: SessionType;
  startTime: string; // "HH:mm" (24h format, e.g. "07:30", "17:00")
  endTime: string; // "HH:mm" (24h format, e.g. "08:25", "18:00")
  durationMinutes: number;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    sessionType: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'hourly', 'custom'],
      default: 'morning',
      required: true,
      index: true,
    },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.Mixed },
    updatedBy: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

timeSlotSchema.index(
  { schoolId: 1, branchId: 1, code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
timeSlotSchema.index({ sessionType: 1, sortOrder: 1, isActive: 1 });
timeSlotSchema.index({ branchId: 1, isActive: 1, isDeleted: 1 });

export const TimeSlotModel = model<ITimeSlot>('TimeSlot', timeSlotSchema);
