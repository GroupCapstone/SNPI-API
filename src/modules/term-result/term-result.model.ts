import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type TermResultStatus = 'PASSED' | 'FAILED';
export type PromotionStatus = 'PROMOTED' | 'REPEAT' | 'CONTINUE' | 'COMPLETED';
export type TermResultWorkflowStatus =
  'CALCULATED' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'FINALIZED' | 'CORRECTED';

export interface ITermResultAssessmentSnapshot {
  assessmentId: Types.ObjectId;
  code: string;
  name: string;
  scoreObtained: number;
  maxScore: number;
  percentage: number;
  weightPercentage: number;
  isAbsent: boolean;
}

export interface ITermResultSubjectSnapshot {
  subjectId: Types.ObjectId;
  code: string;
  name: string;
  assessments: ITermResultAssessmentSnapshot[];
  total: number;
  average: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  passed: boolean;
}

export interface ITermResultAttendanceSnapshot {
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  excused: number;
  permission: number;
  rate: number;
}

export interface ITermResult extends Document {
  schoolId?: Types.ObjectId;
  branchId: Types.ObjectId;
  academicYearId: Types.ObjectId;
  academicPeriodId: Types.ObjectId;
  programId: Types.ObjectId;
  levelId: Types.ObjectId;
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  enrollmentId: Types.ObjectId;
  totalScore: number;
  averageScore: number;
  gpa: number;
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  attendanceRate: number;
  subjectResults: ITermResultSubjectSnapshot[];
  attendanceSnapshot: ITermResultAttendanceSnapshot;
  calculationPolicy: {
    passingAverage: number;
    minimumAttendanceRate: number;
    gpaScale: number;
  };
  gradingRuleSnapshot: Record<string, unknown>;
  assessmentSchemeSnapshot: Record<string, unknown>;
  attendanceRuleSnapshot: Record<string, unknown>;
  promotionRuleSnapshot: Record<string, unknown>;
  snapshotVersion: number;
  workflowStatus: TermResultWorkflowStatus;
  submittedAt?: Date;
  submittedBy?: Types.ObjectId | string;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId | string;
  approvedAt?: Date;
  approvedBy?: Types.ObjectId | string;
  finalizedAt?: Date;
  finalizedBy?: Types.ObjectId | string;
  lockedAt?: Date;
  lockedBy?: Types.ObjectId | string;
  resultStatus: TermResultStatus;
  promotionStatus: PromotionStatus;
  nextLevelId?: Types.ObjectId;
  nextPeriodId?: Types.ObjectId;
  nextEnrollmentId?: Types.ObjectId;
  isCompleted: boolean;
  completionDate?: Date;
  remarks?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const termResultSchema = new Schema<ITermResult>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: false, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
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
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    totalScore: { type: Number, required: true, default: 0 },
    averageScore: { type: Number, required: true, default: 0 },
    gpa: { type: Number, required: true, default: 0 },
    letterGrade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
      default: 'F',
      required: true,
    },
    attendanceRate: { type: Number, required: true, default: 100, min: 0, max: 100 },
    subjectResults: {
      type: [
        new Schema(
          {
            subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
            code: { type: String, required: true },
            name: { type: String, required: true },
            assessments: {
              type: [
                new Schema(
                  {
                    assessmentId: {
                      type: Schema.Types.ObjectId,
                      ref: 'Assessment',
                      required: true,
                    },
                    code: { type: String, required: true },
                    name: { type: String, required: true },
                    scoreObtained: { type: Number, required: true },
                    maxScore: { type: Number, required: true },
                    percentage: { type: Number, required: true },
                    weightPercentage: { type: Number, required: true },
                    isAbsent: { type: Boolean, required: true },
                  },
                  { _id: false },
                ),
              ],
              default: [],
            },
            total: { type: Number, required: true },
            average: { type: Number, required: true },
            grade: { type: String, enum: ['A', 'B', 'C', 'D', 'E', 'F'], required: true },
            passed: { type: Boolean, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    attendanceSnapshot: {
      type: new Schema(
        {
          totalSessions: { type: Number, required: true, default: 0 },
          present: { type: Number, required: true, default: 0 },
          absent: { type: Number, required: true, default: 0 },
          late: { type: Number, required: true, default: 0 },
          halfDay: { type: Number, required: true, default: 0 },
          excused: { type: Number, required: true, default: 0 },
          permission: { type: Number, required: true, default: 0 },
          rate: { type: Number, required: true, default: 100 },
        },
        { _id: false },
      ),
      default: () => ({
        totalSessions: 0,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        excused: 0,
        permission: 0,
        rate: 100,
      }),
    },
    calculationPolicy: {
      type: new Schema(
        {
          passingAverage: { type: Number, required: true, default: 50 },
          minimumAttendanceRate: { type: Number, required: true, default: 70 },
          gpaScale: { type: Number, required: true, default: 4 },
        },
        { _id: false },
      ),
      default: () => ({ passingAverage: 50, minimumAttendanceRate: 70, gpaScale: 4 }),
    },
    gradingRuleSnapshot: { type: Schema.Types.Mixed, required: true, default: () => ({}) },
    assessmentSchemeSnapshot: { type: Schema.Types.Mixed, required: true, default: () => ({}) },
    attendanceRuleSnapshot: { type: Schema.Types.Mixed, required: true, default: () => ({}) },
    promotionRuleSnapshot: { type: Schema.Types.Mixed, required: true, default: () => ({}) },
    snapshotVersion: { type: Number, required: true, default: 1, min: 1 },
    workflowStatus: {
      type: String,
      enum: ['CALCULATED', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'FINALIZED', 'CORRECTED'],
      default: 'CALCULATED',
      index: true,
    },
    submittedAt: { type: Date },
    submittedBy: { type: Schema.Types.Mixed },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.Mixed },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.Mixed },
    finalizedAt: { type: Date },
    finalizedBy: { type: Schema.Types.Mixed },
    lockedAt: { type: Date },
    lockedBy: { type: Schema.Types.Mixed },
    resultStatus: {
      type: String,
      enum: ['PASSED', 'FAILED'],
      default: 'PASSED',
      index: true,
    },
    promotionStatus: {
      type: String,
      enum: ['PROMOTED', 'REPEAT', 'CONTINUE', 'COMPLETED'],
      default: 'PROMOTED',
      index: true,
    },
    nextLevelId: { type: Schema.Types.ObjectId, ref: 'Level', required: false },
    nextPeriodId: { type: Schema.Types.ObjectId, ref: 'AcademicPeriod', required: false },
    nextEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: false },
    isCompleted: { type: Boolean, default: false, index: true },
    completionDate: { type: Date },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.Mixed, required: false },
    updatedBy: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  },
);

termResultSchema.index(
  { academicPeriodId: 1, classId: 1, studentId: 1, isDeleted: 1 },
  { unique: true },
);
termResultSchema.index({ branchId: 1, studentId: 1, isDeleted: 1 });
termResultSchema.index({
  branchId: 1,
  academicYearId: 1,
  academicPeriodId: 1,
  classId: 1,
  workflowStatus: 1,
});
termResultSchema.index({ studentId: 1, academicYearId: -1, academicPeriodId: -1 });

export const TermResultModel = model<ITermResult>('TermResult', termResultSchema);
