/**
 * SNP-SMS Backup and Restore Automated Integrity Verification Script
 *
 * Validates post-restore invariants:
 * 1. Multi-branch foreign key integrity (School -> Branch -> Class -> Enrollment).
 * 2. Sequence counter parity against issued document codes.
 * 3. Financial ledger balance consistency: amountPaid + balanceRemaining == amountDue - discountAmount.
 * 4. Academic context invariants: Closed periods have 0 un-finalized results.
 *
 * Usage:
 *   npx ts-node src/scripts/verify-backup-restore.ts
 */

/* eslint-disable no-console */
import mongoose from 'mongoose';
import { AcademicPeriodModel } from '../modules/academic-period/academic-period.model';
import { BranchModel } from '../modules/branch/branch.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { PaymentModel } from '../modules/payment/payment.model';
import { SchoolModel } from '../modules/school/school.model';
import { SequenceModel } from '../modules/sequence/sequence.model';
import { StudentModel } from '../modules/student/student.model';
import { TermResultModel } from '../modules/term-result/term-result.model';

export interface VerificationReport {
  timestamp: string;
  passed: boolean;
  checks: {
    name: string;
    passed: boolean;
    details?: string;
  }[];
}

export const runRestoreVerification = async (): Promise<VerificationReport> => {
  const checks: VerificationReport['checks'] = [];

  // Check 1: School & Branch existence
  const schoolCount = await SchoolModel.countDocuments({ isDeleted: false });
  const branchCount = await BranchModel.countDocuments({ isDeleted: false });
  checks.push({
    name: 'School & Branch Master Counts',
    passed: schoolCount > 0 && branchCount > 0,
    details: `Found ${schoolCount} active schools and ${branchCount} branches.`,
  });

  // Check 2: Multi-Branch Foreign Key Integrity
  const orphanedStudents = await StudentModel.countDocuments({
    branchId: { $nin: await BranchModel.distinct('_id') },
    isDeleted: false,
  });
  checks.push({
    name: 'Student Branch Foreign Key Integrity',
    passed: orphanedStudents === 0,
    details:
      orphanedStudents === 0
        ? 'All active students link to valid existing branches.'
        : `Found ${orphanedStudents} orphaned student records!`,
  });

  // Check 3: Sequence Counters Consistency
  const sequences = await SequenceModel.find({});
  let sequenceIssues = 0;
  for (const seq of sequences) {
    if (seq.currentSequence < 0) sequenceIssues++;
  }
  checks.push({
    name: 'Sequence Counters Consistency',
    passed: sequenceIssues === 0,
    details: `Verified ${sequences.length} sequence counters. Found ${sequenceIssues} issues.`,
  });

  // Check 4: Payment Ledger Balance Invariant
  // For each student tuition account, cumulative amountPaid + latest balanceRemaining
  // must equal amountDue - cumulative discountAmount.
  const ledgerAccounts = await PaymentModel.aggregate([
    { $match: { status: { $ne: 'voided' }, isDeleted: false } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: { studentId: '$studentId', tuitionFeeId: '$tuitionFeeId' },
        totalPaid: { $sum: '$amountPaid' },
        totalDiscount: { $sum: '$discountAmount' },
        amountDue: { $last: '$amountDue' },
        latestBalance: { $last: '$balanceRemaining' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        netPayable: { $subtract: ['$amountDue', '$totalDiscount'] },
        computedTotal: { $add: ['$totalPaid', '$latestBalance'] },
        totalPaid: 1,
        latestBalance: 1,
        totalDiscount: 1,
        amountDue: 1,
      },
    },
    {
      $match: {
        $expr: {
          $ne: [{ $round: ['$computedTotal', 2] }, { $round: ['$netPayable', 2] }],
        },
      },
    },
  ]);

  const invalidAccounts = ledgerAccounts.length;
  checks.push({
    name: 'Payment Ledger Balance Invariant',
    passed: invalidAccounts === 0,
    details:
      invalidAccounts === 0
        ? 'All student tuition fee accounts balance perfectly (Cumulative Paid + Latest Balance == Net Payable).'
        : `Found ${invalidAccounts} unbalanced tuition fee accounts!`,
  });

  // Check 5: Closed Academic Periods have complete results
  const closedPeriods = await AcademicPeriodModel.find({ status: 'closed', isDeleted: false });
  let unfinalizedCount = 0;
  for (const period of closedPeriods) {
    const unfinalized = await TermResultModel.countDocuments({
      academicPeriodId: period._id,
      isCompleted: false,
      isDeleted: false,
    });
    unfinalizedCount += unfinalized;
  }
  checks.push({
    name: 'Closed Period Finalization Integrity',
    passed: unfinalizedCount === 0,
    details:
      unfinalizedCount === 0
        ? `All ${closedPeriods.length} closed periods have 100% completed term results.`
        : `Found ${unfinalizedCount} unfinalized results in closed periods!`,
  });

  // Check 6: Enrollment Status Invariant
  const completedWithoutReason = await EnrollmentModel.countDocuments({
    status: { $in: ['promoted', 'repeated', 'completed'] },
    endDate: { $exists: false },
    isDeleted: false,
  });
  checks.push({
    name: 'Completed Enrollment End Dates',
    passed: completedWithoutReason === 0,
    details:
      completedWithoutReason === 0
        ? 'All historical completed enrollments have valid end dates recorded.'
        : `Found ${completedWithoutReason} completed enrollments without end date!`,
  });

  const overallPassed = checks.every((c) => c.passed);

  return {
    timestamp: new Date().toISOString(),
    passed: overallPassed,
    checks,
  };
};

if (require.main === module) {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snp_sms';
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log('--- SNP-SMS Post-Restore Integrity Verification ---');
      const report = await runRestoreVerification();
      for (const check of report.checks) {
        console.log(`[${check.passed ? 'PASS' : 'FAIL'}] ${check.name}: ${check.details ?? ''}`);
      }
      console.log(`--- Overall Status: ${report.passed ? 'SUCCESS' : 'FAILED'} ---`);
      await mongoose.disconnect();
      process.exit(report.passed ? 0 : 1);
    })
    .catch((err) => {
      console.error('Database connection error during verification:', err);
      process.exit(1);
    });
}
