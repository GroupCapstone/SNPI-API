/**
 * SNP-SMS idempotent historical integrity migration.
 *
 * Dry-run is the default. Apply only during a maintenance window so enrollment
 * counters cannot change while they are being reconciled.
 *
 * Usage:
 *   npm run migrate:historical:check -w backend
 *   npm run migrate:historical:apply -w backend
 */

/* eslint-disable no-console */
import mongoose from 'mongoose';

import { AcademicPeriodModel } from '../modules/academic-period/academic-period.model';
import { ClassModel } from '../modules/class/class.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { PaymentModel } from '../modules/payment/payment.model';
import { TermResultModel } from '../modules/term-result/term-result.model';
import { TuitionFeeModel } from '../modules/tuition/tuition-fee.model';

export interface MigrationSummary {
  migrationId: string;
  dryRun: boolean;
  enrollmentsUpdated: number;
  classesUpdated: number;
  paymentsNeedingReview: number;
  termResultsUpdated: number;
  periodsChecked: number;
  termResultsChecked: number;
  integrityIssues: {
    orphanEnrollments: number;
    schoolBranchMismatches: number;
  };
  errors: string[];
}

const MIGRATION_ID = '2026-09-v1.1b-integrity';
const activeEnrollmentStatuses = ['enrolled', 'active'];

const countEnrollmentIntegrityIssues = async (): Promise<MigrationSummary['integrityIssues']> => {
  const [orphanResult, mismatchResult] = await Promise.all([
    EnrollmentModel.aggregate<{ count: number }>([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentReference',
        },
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'classReference',
        },
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'schoolId',
          foreignField: '_id',
          as: 'schoolReference',
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branchReference',
        },
      },
      {
        $match: {
          $or: [
            { studentReference: { $size: 0 } },
            { classReference: { $size: 0 } },
            { schoolReference: { $size: 0 } },
            { branchReference: { $size: 0 } },
          ],
        },
      },
      { $count: 'count' },
    ]).exec(),
    EnrollmentModel.aggregate<{ count: number }>([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branchReference',
        },
      },
      { $unwind: '$branchReference' },
      { $match: { $expr: { $ne: ['$schoolId', '$branchReference.schoolId'] } } },
      { $count: 'count' },
    ]).exec(),
  ]);

  return {
    orphanEnrollments: orphanResult[0]?.count ?? 0,
    schoolBranchMismatches: mismatchResult[0]?.count ?? 0,
  };
};

export const runHistoricalDataMigration = async (
  applyChanges = false,
): Promise<MigrationSummary> => {
  const summary: MigrationSummary = {
    migrationId: MIGRATION_ID,
    dryRun: !applyChanges,
    enrollmentsUpdated: 0,
    classesUpdated: 0,
    paymentsNeedingReview: 0,
    termResultsUpdated: 0,
    periodsChecked: 0,
    termResultsChecked: 0,
    integrityIssues: { orphanEnrollments: 0, schoolBranchMismatches: 0 },
    errors: [],
  };

  try {
    const invalidAttemptFilter = {
      isDeleted: false,
      $or: [
        { attemptNumber: { $exists: false } },
        { attemptNumber: null },
        { attemptNumber: { $lt: 1 } },
      ],
    };
    summary.enrollmentsUpdated = await EnrollmentModel.countDocuments(invalidAttemptFilter);
    if (applyChanges && summary.enrollmentsUpdated > 0) {
      await EnrollmentModel.updateMany(invalidAttemptFilter, { $set: { attemptNumber: 1 } });
    }

    const enrollmentCounts = await EnrollmentModel.aggregate<{
      _id: mongoose.Types.ObjectId;
      count: number;
    }>([
      { $match: { isDeleted: false, status: { $in: activeEnrollmentStatuses } } },
      { $group: { _id: '$classId', count: { $sum: 1 } } },
    ]).exec();
    const countsByClass = new Map(enrollmentCounts.map((item) => [String(item._id), item.count]));
    const classes = await ClassModel.find({ isDeleted: false })
      .select('_id currentEnrollmentCount')
      .lean()
      .exec();
    const classRepairs = classes
      .map((classDoc) => ({
        id: classDoc._id,
        actual: countsByClass.get(String(classDoc._id)) ?? 0,
        stored: classDoc.currentEnrollmentCount ?? 0,
      }))
      .filter((item) => item.actual !== item.stored);
    summary.classesUpdated = classRepairs.length;
    if (applyChanges && classRepairs.length > 0) {
      await ClassModel.bulkWrite(
        classRepairs.map((item) => ({
          updateOne: {
            filter: { _id: item.id, isDeleted: false },
            update: { $set: { currentEnrollmentCount: item.actual } },
          },
        })),
      );
    }

    const monthlyFees = await TuitionFeeModel.find({
      billingCycle: 'monthly',
      isDeleted: false,
    })
      .select('_id')
      .lean()
      .exec();
    const missingDueDateFilter = {
      tuitionFeeId: { $in: monthlyFees.map((fee) => fee._id) },
      paymentDate: { $type: 'date' as const },
      $or: [{ dueDate: { $exists: false } }, { dueDate: null }],
      isDeleted: false,
    };
    summary.paymentsNeedingReview = await PaymentModel.countDocuments(missingDueDateFilter);
    if (summary.paymentsNeedingReview > 0) {
      summary.errors.push(
        `${summary.paymentsNeedingReview} monthly payment records are missing a contractual due date and require manual review`,
      );
    }

    const missingHalfDayFilter = {
      isDeleted: false,
      attendanceSnapshot: { $exists: true },
      'attendanceSnapshot.halfDay': { $exists: false },
    };
    summary.termResultsUpdated = await TermResultModel.countDocuments(missingHalfDayFilter);
    if (applyChanges && summary.termResultsUpdated > 0) {
      await TermResultModel.updateMany(missingHalfDayFilter, {
        $set: { 'attendanceSnapshot.halfDay': 0 },
      });
    }

    summary.termResultsChecked = await TermResultModel.countDocuments({
      isCompleted: true,
      isDeleted: false,
    });
    const invalidSnapshots = await TermResultModel.countDocuments({
      isCompleted: true,
      isDeleted: false,
      $or: [
        { gradingRuleSnapshot: { $exists: false } },
        { gradingRuleSnapshot: null },
        { attendanceSnapshot: { $exists: false } },
        { attendanceSnapshot: null },
      ],
    });
    if (invalidSnapshots > 0) {
      summary.errors.push(
        `${invalidSnapshots} completed term results are missing immutable grading or attendance snapshots`,
      );
    }

    summary.periodsChecked = await AcademicPeriodModel.countDocuments({
      status: 'closed',
      isDeleted: false,
    });
    summary.integrityIssues = await countEnrollmentIntegrityIssues();
    if (summary.integrityIssues.orphanEnrollments > 0) {
      summary.errors.push(
        `${summary.integrityIssues.orphanEnrollments} enrollments reference missing schools, branches, students, or classes`,
      );
    }
    if (summary.integrityIssues.schoolBranchMismatches > 0) {
      summary.errors.push(
        `${summary.integrityIssues.schoolBranchMismatches} enrollments have a school/branch ownership mismatch`,
      );
    }
  } catch (error) {
    summary.errors.push(error instanceof Error ? error.message : String(error));
  }

  return summary;
};

if (require.main === module) {
  const applyChanges = process.argv.includes('--apply');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snp_sms';

  mongoose
    .connect(mongoUri)
    .then(async () => {
      const summary = await runHistoricalDataMigration(applyChanges);
      console.log(JSON.stringify(summary, null, 2));
      await mongoose.disconnect();
      process.exit(summary.errors.length > 0 ? 2 : 0);
    })
    .catch((error: unknown) => {
      console.error('Historical migration failed:', error);
      process.exit(1);
    });
}
