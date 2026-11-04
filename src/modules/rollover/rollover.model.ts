import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type RolloverPlanStatus =
  'draft' | 'validated' | 'approved' | 'executing' | 'completed' | 'failed' | 'cancelled';

export type RolloverStudentDecision =
  'PROMOTE' | 'CONTINUE' | 'REPEAT' | 'TRANSFER' | 'GRADUATE' | 'WITHDRAW' | 'HOLD' | 'NO_ACTION';

export type RolloverClassAction = 'CREATE_NEW' | 'MAP_EXISTING' | 'SKIP';

export interface IRolloverClassMapping {
  sourceClassId: Types.ObjectId;
  targetClassId?: Types.ObjectId;
  targetClassName: string;
  targetClassCode: string;
  targetProgramId: Types.ObjectId;
  targetLevelId: Types.ObjectId;
  targetSection: string;
  targetCapacity: number;
  action: RolloverClassAction;
}

export interface IRolloverStudentDecision {
  studentId: Types.ObjectId;
  sourceEnrollmentId: Types.ObjectId;
  systemRecommendedDecision: RolloverStudentDecision;
  finalDecision: RolloverStudentDecision;
  decision?: RolloverStudentDecision;
  targetClassId?: Types.ObjectId;
  targetLevelId?: Types.ObjectId;
  targetProgramId?: Types.ObjectId;
  targetBranchId?: Types.ObjectId;
  targetEnrollmentId?: Types.ObjectId;
  reason?: string;
  changedBy?: Types.ObjectId | string;
  approvedBy?: Types.ObjectId | string;
  changedAt?: Date;
  isProcessed: boolean;
}

export interface IRolloverValidationSummary {
  canExecute: boolean;
  checkedAt: Date;
  blockingIssues: Array<{
    type: string;
    message: string;
    entityId?: string;
    count?: number;
  }>;
  warnings: Array<{
    type: string;
    message: string;
    count?: number;
  }>;
  capacityWarnings: Array<{
    classId?: string;
    className: string;
    capacity: number;
    enrolledCount: number;
    message: string;
  }>;
  scheduleConflicts: Array<{
    type: 'TEACHER_CONFLICT' | 'ROOM_CONFLICT';
    teacherId?: string;
    classroomId?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    message: string;
  }>;
}

export interface IRolloverExecutionResult {
  classesCreated: number;
  enrollmentsCreated: number;
  studentsPromoted: number;
  studentsRepeated: number;
  studentsContinued: number;
  studentsGraduated: number;
  studentsWithdrawn: number;
  studentsTransferred: number;
  teacherAssignmentsCreated: number;
  schedulesCreated: number;
  errors: Array<{ item: string; error: string }>;
  startedAt?: Date;
  completedAt?: Date;
}

export interface IRolloverPlan extends Document {
  planCode: string;
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  programId?: Types.ObjectId;
  sourceAcademicYearId: Types.ObjectId;
  sourcePeriodId: Types.ObjectId;
  targetAcademicYearId: Types.ObjectId;
  targetPeriodId: Types.ObjectId;
  status: RolloverPlanStatus;
  options: {
    carryClasses: boolean;
    carryTeacherSuggestions: boolean;
    carryScheduleSuggestions: boolean;
    autoSectionDistribution: boolean;
  };
  classMappings: IRolloverClassMapping[];
  studentDecisions: IRolloverStudentDecision[];
  validationSummary?: IRolloverValidationSummary;
  executionResult?: IRolloverExecutionResult;
  createdBy: Types.ObjectId | string;
  reviewedBy?: Types.ObjectId | string;
  approvedBy?: Types.ObjectId | string;
  approvedAt?: Date;
  executedBy?: Types.ObjectId | string;
  executedAt?: Date;
  idempotencyKey?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const classMappingSchema = new Schema<IRolloverClassMapping>(
  {
    sourceClassId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    targetClassId: { type: Schema.Types.ObjectId, ref: 'Class' },
    targetClassName: { type: String, required: true, trim: true },
    targetClassCode: { type: String, required: true, trim: true, uppercase: true },
    targetProgramId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    targetLevelId: { type: Schema.Types.ObjectId, ref: 'Level', required: true },
    targetSection: { type: String, required: true, trim: true, uppercase: true, default: 'A' },
    targetCapacity: { type: Number, required: true, default: 30, min: 1 },
    action: {
      type: String,
      enum: ['CREATE_NEW', 'MAP_EXISTING', 'SKIP'],
      default: 'CREATE_NEW',
      required: true,
    },
  },
  { _id: false },
);

const studentDecisionSchema = new Schema<IRolloverStudentDecision>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    sourceEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    systemRecommendedDecision: {
      type: String,
      enum: [
        'PROMOTE',
        'CONTINUE',
        'REPEAT',
        'TRANSFER',
        'GRADUATE',
        'WITHDRAW',
        'HOLD',
        'NO_ACTION',
      ],
      required: true,
      default: 'CONTINUE',
    },
    finalDecision: {
      type: String,
      enum: [
        'PROMOTE',
        'CONTINUE',
        'REPEAT',
        'TRANSFER',
        'GRADUATE',
        'WITHDRAW',
        'HOLD',
        'NO_ACTION',
      ],
      required: true,
      default: 'CONTINUE',
    },
    decision: {
      type: String,
      enum: [
        'PROMOTE',
        'CONTINUE',
        'REPEAT',
        'TRANSFER',
        'GRADUATE',
        'WITHDRAW',
        'HOLD',
        'NO_ACTION',
      ],
      required: false,
    },
    targetClassId: { type: Schema.Types.ObjectId, ref: 'Class' },
    targetLevelId: { type: Schema.Types.ObjectId, ref: 'Level' },
    targetProgramId: { type: Schema.Types.ObjectId, ref: 'Program' },
    targetBranchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    targetEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
    reason: { type: String, trim: true, maxlength: 500 },
    changedBy: { type: Schema.Types.Mixed },
    approvedBy: { type: Schema.Types.Mixed },
    changedAt: { type: Date },
    isProcessed: { type: Boolean, default: false },
  },
  { _id: false },
);

const rolloverPlanSchema = new Schema<IRolloverPlan>(
  {
    planCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: false, index: true },
    sourceAcademicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    sourcePeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      required: true,
      index: true,
    },
    targetAcademicYearId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
      index: true,
    },
    targetPeriodId: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicPeriod',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'validated', 'approved', 'executing', 'completed', 'failed', 'cancelled'],
      default: 'draft',
      required: true,
      index: true,
    },
    options: {
      carryClasses: { type: Boolean, default: true },
      carryTeacherSuggestions: { type: Boolean, default: true },
      carryScheduleSuggestions: { type: Boolean, default: true },
      autoSectionDistribution: { type: Boolean, default: false },
    },
    classMappings: [classMappingSchema],
    studentDecisions: [studentDecisionSchema],
    validationSummary: {
      canExecute: { type: Boolean, default: false },
      checkedAt: { type: Date },
      blockingIssues: [
        {
          type: { type: String },
          message: { type: String },
          entityId: { type: String },
          count: { type: Number },
        },
      ],
      warnings: [
        {
          type: { type: String },
          message: { type: String },
          count: { type: Number },
        },
      ],
      capacityWarnings: [
        {
          classId: { type: String },
          className: { type: String },
          capacity: { type: Number },
          enrolledCount: { type: Number },
          message: { type: String },
        },
      ],
      scheduleConflicts: [
        {
          type: { type: String, enum: ['TEACHER_CONFLICT', 'ROOM_CONFLICT'] },
          teacherId: { type: String },
          classroomId: { type: String },
          dayOfWeek: { type: Number },
          startTime: { type: String },
          endTime: { type: String },
          message: { type: String },
        },
      ],
    },
    executionResult: {
      classesCreated: { type: Number, default: 0 },
      enrollmentsCreated: { type: Number, default: 0 },
      studentsPromoted: { type: Number, default: 0 },
      studentsRepeated: { type: Number, default: 0 },
      studentsContinued: { type: Number, default: 0 },
      studentsGraduated: { type: Number, default: 0 },
      studentsWithdrawn: { type: Number, default: 0 },
      studentsTransferred: { type: Number, default: 0 },
      teacherAssignmentsCreated: { type: Number, default: 0 },
      schedulesCreated: { type: Number, default: 0 },
      errors: [{ item: { type: String }, error: { type: String } }],
      startedAt: { type: Date },
      completedAt: { type: Date },
    },
    createdBy: { type: Schema.Types.Mixed, required: true },
    reviewedBy: { type: Schema.Types.Mixed },
    approvedBy: { type: Schema.Types.Mixed },
    approvedAt: { type: Date },
    executedBy: { type: Schema.Types.Mixed },
    executedAt: { type: Date },
    idempotencyKey: { type: String, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

rolloverPlanSchema.index(
  { branchId: 1, programId: 1, sourcePeriodId: 1, targetPeriodId: 1, isDeleted: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['draft', 'validated', 'approved'] } },
  },
);

rolloverPlanSchema.index({ schoolId: 1, branchId: 1, status: 1 });

export const AcademicRolloverPlanModel = model<IRolloverPlan>(
  'AcademicRolloverPlan',
  rolloverPlanSchema,
);
