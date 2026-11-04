import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type IntakeStatus = 'planned' | 'open' | 'closed' | 'archived';

export interface IIntake extends Document {
  schoolId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId: Types.ObjectId;
  programId: Types.ObjectId;
  levelId: Types.ObjectId;
  curriculumId?: Types.ObjectId;
  code: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  capacity: number;
  status: IntakeStatus;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const intakeSchema = new Schema<IIntake>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: false, index: true },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    academicPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      required: true,
      index: true,
    },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    levelId: { type: Schema.Types.ObjectId, ref: 'Level', required: true, index: true },
    curriculumId: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: false, index: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    capacity: { type: Number, required: true, default: 100, min: 1 },
    status: {
      type: String,
      enum: ['planned', 'open', 'closed', 'archived'],
      default: 'open',
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.Mixed, required: false },
    updatedBy: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  },
);

intakeSchema.index({ academicPeriodId: 1, code: 1, isDeleted: 1 });
intakeSchema.index({ programId: 1, levelId: 1 });

export const IntakeModel = model<IIntake>('Intake', intakeSchema);
