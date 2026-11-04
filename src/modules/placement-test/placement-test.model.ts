import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type PlacementTestStatus = 'scheduled' | 'completed' | 'passed' | 'failed';

export interface IPlacementTest extends Document {
  testNumber: string;
  registrationId?: Types.ObjectId;
  studentId?: Types.ObjectId;
  studentName: string;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  programId: Types.ObjectId;
  recommendedLevelId: Types.ObjectId;
  testDate: Date;
  score: number;
  maxScore: number;
  examinerName?: string;
  status: PlacementTestStatus;
  comments?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const placementTestSchema = new Schema<IPlacementTest>(
  {
    testNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    studentName: {
      type: String,
      required: true,
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
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    recommendedLevelId: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
      index: true,
    },
    testDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      default: 100,
      min: 1,
    },
    examinerName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'passed', 'failed'],
      default: 'completed',
      required: true,
      index: true,
    },
    comments: {
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

placementTestSchema.index({ testNumber: 1, isDeleted: 1 });
placementTestSchema.index({ branchId: 1, programId: 1, isDeleted: 1 });

export const PlacementTestModel = model<IPlacementTest>('PlacementTest', placementTestSchema);
