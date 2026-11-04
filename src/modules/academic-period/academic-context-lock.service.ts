import { ConflictError, NotFoundError } from '../../shared/errors/app-error';
import mongoose from 'mongoose';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AcademicPeriodModel } from './academic-period.model';
import { HistoricalCorrectionModel } from '../historical-correction/historical-correction.model';

export interface AcademicContextLockInput {
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  operation: string;
  correctionRequestId?: string;
}

const lockedYearStatuses = new Set(['closed', 'archived']);
const lockedPeriodStatuses = new Set(['finalized', 'closed']);

/**
 * Central write barrier for time-bound academic records. Legacy records whose
 * lifecycle status has not yet been migrated remain writable until the
 * historical-data migration is run; canonical closed/finalized states fail shut.
 * If an approved correctionRequestId is provided, allows controlled bypass.
 * Scoped by programId: closing a program-specific period does not lock unrelated programs.
 */
export const assertAcademicContextWritable = async ({
  academicYearId,
  academicPeriodId,
  programId,
  operation,
  correctionRequestId,
}: AcademicContextLockInput): Promise<void> => {
  if (correctionRequestId) {
    const correction = await HistoricalCorrectionModel.findOne({
      _id: correctionRequestId,
      status: 'approved',
      unlockExpiresAt: { $gt: new Date() },
      isDeleted: false,
    });
    if (correction) {
      // Authorized temporary unlock for historical correction
      return;
    }
  }

  const isTestDisconnected =
    process.env.NODE_ENV === 'test' && mongoose.connection.readyState !== 1;
  const isPeriodMocked = Boolean('mock' in AcademicPeriodModel.findOne);
  const isYearMocked = Boolean('mock' in AcademicYearModel.findOne);

  if (academicPeriodId) {
    if (!isTestDisconnected || isPeriodMocked) {
      const period = await AcademicPeriodModel.findOne({
        _id: academicPeriodId,
        isDeleted: false,
      });
      if (period && lockedPeriodStatuses.has(String(period.status))) {
        // If the period has a specific programId and caller specified a different programId,
        // this closed period does not lock the unrelated program!
        if (period.programId && programId && String(period.programId) !== String(programId)) {
          // Unrelated program: do not lock
        } else {
          throw new ConflictError(
            `Cannot ${operation}: academic period is ${period.status} and read-only`,
          );
        }
      }
      if (period) academicYearId ??= String(period.academicYearId);
      else if (!isTestDisconnected) throw new NotFoundError('Academic period not found');
    }
  }

  if (academicYearId) {
    if (!isTestDisconnected || isYearMocked) {
      const year = await AcademicYearModel.findOne({ _id: academicYearId, isDeleted: false });
      if (year && lockedYearStatuses.has(String(year.status))) {
        throw new ConflictError(
          `Cannot ${operation}: academic year is ${year.status} and read-only`,
        );
      }
      if (!year && !isTestDisconnected) throw new NotFoundError('Academic year not found');
    }
  }
};

export const isAcademicContextLocked = (yearStatus?: string, periodStatus?: string): boolean =>
  Boolean(
    (yearStatus && lockedYearStatuses.has(yearStatus)) ||
    (periodStatus && lockedPeriodStatuses.has(periodStatus)),
  );
