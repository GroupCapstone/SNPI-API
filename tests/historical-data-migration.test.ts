import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AcademicPeriodModel } from '../src/modules/academic-period/academic-period.model';
import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { PaymentModel } from '../src/modules/payment/payment.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';
import { runHistoricalDataMigration } from '../src/scripts/historical-data-migration';

const executable = (value: unknown) => ({ exec: vi.fn().mockResolvedValue(value) });

describe('historical data integrity migration', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('reports and applies only deterministic, idempotent repairs', async () => {
    const classId = new Types.ObjectId();
    const feeId = new Types.ObjectId();
    vi.spyOn(EnrollmentModel, 'countDocuments').mockResolvedValue(2 as never);
    vi.spyOn(EnrollmentModel, 'updateMany').mockResolvedValue({ modifiedCount: 2 } as never);
    vi.spyOn(EnrollmentModel, 'aggregate')
      .mockReturnValueOnce(executable([{ _id: classId, count: 12 }]) as never)
      .mockReturnValueOnce(executable([]) as never)
      .mockReturnValueOnce(executable([]) as never);
    vi.spyOn(ClassModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue(executable([{ _id: classId, currentEnrollmentCount: 9 }])),
      }),
    } as never);
    vi.spyOn(ClassModel, 'bulkWrite').mockResolvedValue({ modifiedCount: 1 } as never);
    vi.spyOn(TuitionFeeModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue(executable([{ _id: feeId }])),
      }),
    } as never);
    vi.spyOn(PaymentModel, 'countDocuments').mockResolvedValue(3 as never);
    vi.spyOn(TermResultModel, 'countDocuments')
      .mockResolvedValueOnce(4 as never)
      .mockResolvedValueOnce(20 as never)
      .mockResolvedValueOnce(0 as never);
    vi.spyOn(TermResultModel, 'updateMany').mockResolvedValue({ modifiedCount: 4 } as never);
    vi.spyOn(AcademicPeriodModel, 'countDocuments').mockResolvedValue(6 as never);

    const result = await runHistoricalDataMigration(true);

    expect(result).toMatchObject({
      migrationId: '2026-09-v1.1b-integrity',
      dryRun: false,
      enrollmentsUpdated: 2,
      classesUpdated: 1,
      paymentsNeedingReview: 3,
      termResultsUpdated: 4,
      periodsChecked: 6,
      termResultsChecked: 20,
      integrityIssues: { orphanEnrollments: 0, schoolBranchMismatches: 0 },
      errors: [
        '3 monthly payment records are missing a contractual due date and require manual review',
      ],
    });
    expect(EnrollmentModel.updateMany).toHaveBeenCalledOnce();
    expect(ClassModel.bulkWrite).toHaveBeenCalledOnce();
    expect(TermResultModel.updateMany).toHaveBeenCalledOnce();
  });

  it('does not mutate data during the default dry-run', async () => {
    vi.spyOn(EnrollmentModel, 'updateMany').mockResolvedValue({ modifiedCount: 0 } as never);
    vi.spyOn(ClassModel, 'bulkWrite').mockResolvedValue({ modifiedCount: 0 } as never);
    vi.spyOn(TermResultModel, 'updateMany').mockResolvedValue({ modifiedCount: 0 } as never);
    vi.spyOn(EnrollmentModel, 'countDocuments').mockResolvedValue(0 as never);
    vi.spyOn(EnrollmentModel, 'aggregate')
      .mockReturnValueOnce(executable([]) as never)
      .mockReturnValueOnce(executable([{ count: 2 }]) as never)
      .mockReturnValueOnce(executable([{ count: 1 }]) as never);
    vi.spyOn(ClassModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({ lean: vi.fn().mockReturnValue(executable([])) }),
    } as never);
    vi.spyOn(TuitionFeeModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({ lean: vi.fn().mockReturnValue(executable([])) }),
    } as never);
    vi.spyOn(PaymentModel, 'countDocuments').mockResolvedValue(0 as never);
    vi.spyOn(TermResultModel, 'countDocuments').mockResolvedValue(0 as never);
    vi.spyOn(AcademicPeriodModel, 'countDocuments').mockResolvedValue(0 as never);

    const result = await runHistoricalDataMigration();

    expect(result.dryRun).toBe(true);
    expect(result.integrityIssues).toEqual({
      orphanEnrollments: 2,
      schoolBranchMismatches: 1,
    });
    expect(result.errors).toHaveLength(2);
    expect(EnrollmentModel.updateMany).not.toHaveBeenCalled();
    expect(ClassModel.bulkWrite).not.toHaveBeenCalled();
    expect(TermResultModel.updateMany).not.toHaveBeenCalled();
  });
});
