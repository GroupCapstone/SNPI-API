import crypto from 'crypto';
import { isDeepStrictEqual } from 'node:util';
import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { AssessmentModel } from '../assessment/assessment.model';
import { AttendanceRecordModel } from '../attendance/attendance-record.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ScoreRevisionModel } from '../score/score-revision.model';
import { ScoreModel } from '../score/score.model';
import { calculateGrade } from '../score/score.types';
import { SequenceService } from '../sequence/sequence.service';
import { TermResultModel } from '../term-result/term-result.model';
import type { IHistoricalCorrection } from './historical-correction.model';
import { HistoricalCorrectionRepository } from './historical-correction.repository';
import type {
  ApplyCorrectionDto,
  HistoricalCorrectionQueryFilters,
  PaginatedHistoricalCorrections,
  RequestCorrectionDto,
  ReviewCorrectionDto,
} from './historical-correction.types';
import { validateCorrectionValue } from './historical-correction.validation';

export class HistoricalCorrectionService {
  public constructor(private readonly repository = new HistoricalCorrectionRepository()) {}

  public async getCorrections(
    filters: HistoricalCorrectionQueryFilters,
    currentUser: AuthUser,
  ): Promise<PaginatedHistoricalCorrections> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to corrections in this branch');
    }
    const scopedFilters = { ...filters };
    if (!scopedFilters.branchId && currentUser.branchAccess !== 'all') {
      scopedFilters.authorizedBranchIds = currentUser.branchAccess;
    }
    return this.repository.findMany(scopedFilters);
  }

  public async getCorrectionById(
    id: string,
    currentUser: AuthUser,
  ): Promise<IHistoricalCorrection> {
    const correction = await this.repository.findById(id);
    if (!correction) {
      throw new NotFoundError('Historical correction request not found');
    }
    if (!checkBranchAccess(currentUser.branchAccess, String(correction.branchId))) {
      throw new ForbiddenError('You do not have access to this correction request');
    }
    return correction;
  }

  public async requestCorrection(
    dto: RequestCorrectionDto,
    currentUser: AuthUser,
  ): Promise<IHistoricalCorrection> {
    const proposed = validateCorrectionValue(dto.entityType, dto.proposedValue);
    if (!proposed.success) {
      throw new ValidationError(
        proposed.error.issues.map((issue: { message: string }) => issue.message).join('; '),
      );
    }
    dto = { ...dto, proposedValue: proposed.data };
    let studentId: Types.ObjectId;
    let academicYearId: Types.ObjectId;
    let academicPeriodId: Types.ObjectId | undefined;
    let branchId: Types.ObjectId;
    let previousValue: Record<string, unknown>;

    if (dto.entityType === 'score') {
      const score = await ScoreModel.findOne({ _id: dto.entityId, isDeleted: false });
      if (!score) throw new NotFoundError('Target score record not found');

      if (dto.proposedValue.scoreObtained !== undefined) {
        const proposedScore = Number(dto.proposedValue.scoreObtained);
        if (Number.isNaN(proposedScore) || proposedScore < 0) {
          throw new ValidationError('Proposed score obtained must be a non-negative number');
        }
        const assessment = await AssessmentModel.findOne({
          _id: score.assessmentId,
          isDeleted: false,
        });
        if (assessment && proposedScore > assessment.maxScore) {
          throw new ValidationError(
            `Proposed score (${proposedScore}) cannot exceed assessment maximum score of ${assessment.maxScore}`,
          );
        }
      }

      studentId = score.studentId;
      academicYearId = score.academicYearId;
      academicPeriodId = score.academicPeriodId;
      branchId = score.branchId;
      previousValue = {
        scoreObtained: score.scoreObtained,
        percentage: score.percentage,
        letterGrade: score.letterGrade,
        isAbsent: score.isAbsent,
        remarks: score.remarks,
      };
    } else if (dto.entityType === 'term_result') {
      const termResult = await TermResultModel.findOne({ _id: dto.entityId, isDeleted: false });
      if (!termResult) throw new NotFoundError('Target term result record not found');
      studentId = termResult.studentId;
      academicYearId = termResult.academicYearId;
      academicPeriodId = termResult.academicPeriodId;
      branchId = termResult.branchId;
      previousValue = {
        totalScore: termResult.totalScore,
        averageScore: termResult.averageScore,
        gpa: termResult.gpa,
        letterGrade: termResult.letterGrade,
        resultStatus: termResult.resultStatus,
        promotionStatus: termResult.promotionStatus,
      };
    } else {
      const attendance = await AttendanceRecordModel.findOne({ _id: dto.entityId });
      if (!attendance) throw new NotFoundError('Target attendance record not found');
      studentId = attendance.studentId;
      branchId = attendance.branchId;
      academicYearId = attendance.academicYearId;
      academicPeriodId = attendance.academicPeriodId;
      previousValue = {
        status: attendance.status,
        remarks: attendance.remarks,
      };
    }

    if (!checkBranchAccess(currentUser.branchAccess, String(branchId))) {
      throw new ForbiddenError('You do not have access to request corrections for this branch');
    }

    const correctionNumber = await SequenceService.getNextSequence('HC', 'HC', 6);

    const created = await this.repository.create({
      correctionNumber,
      entityType: dto.entityType,
      entityId: new Types.ObjectId(dto.entityId),
      studentId,
      academicYearId,
      academicPeriodId,
      branchId,
      reason: dto.reason.trim(),
      requestedBy: currentUser.userId,
      status: 'pending',
      previousValue,
      proposedValue: dto.proposedValue,
      createdBy: currentUser.userId,
      updatedBy: currentUser.userId,
    });

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: currentUser.schoolId,
      branchId: String(branchId),
      module: 'historical_correction',
      action: 'CREATE',
      entityType: 'HistoricalCorrection',
      entityId: String(created._id),
      reason: dto.reason,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async reviewCorrection(
    id: string,
    dto: ReviewCorrectionDto,
    currentUser: AuthUser,
  ): Promise<IHistoricalCorrection> {
    const correction = await this.repository.findById(id);
    if (!correction) throw new NotFoundError('Historical correction not found');

    if (!checkBranchAccess(currentUser.branchAccess, String(correction.branchId))) {
      throw new ForbiddenError('You do not have access to review this correction');
    }

    if (correction.status !== 'pending') {
      throw new ConflictError(
        `Correction is already ${correction.status} and cannot be reviewed again`,
      );
    }

    if (dto.status === 'approved' && String(correction.requestedBy) === currentUser.userId) {
      throw new ForbiddenError(
        'Correction requests must be approved by another authorized reviewer',
      );
    }

    const now = new Date();
    const updateData: Partial<IHistoricalCorrection> = {
      status: dto.status,
      reviewedBy: currentUser.userId,
      reviewedAt: now,
      reviewRemarks: dto.reviewRemarks?.trim(),
      updatedBy: currentUser.userId,
    };

    if (dto.status === 'approved') {
      const unlockDuration = (dto.unlockDurationMinutes ?? 60) * 60 * 1000;
      updateData.unlockToken = crypto.randomBytes(24).toString('hex');
      updateData.unlockExpiresAt = new Date(now.getTime() + unlockDuration);
    }

    const updated = await this.repository.updateById(id, updateData, undefined, {
      status: 'pending',
    });
    if (!updated) throw new ConflictError('Correction has already been reviewed');

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: currentUser.schoolId,
      branchId: String(correction.branchId),
      module: 'historical_correction',
      action: 'UPDATE',
      entityType: 'HistoricalCorrection',
      entityId: String(correction._id),
      reason: dto.reviewRemarks,
      newValue: {
        status: dto.status,
        unlockExpiresAt: updateData.unlockExpiresAt,
      },
    });

    return updated;
  }

  public async applyCorrection(
    id: string,
    dto: ApplyCorrectionDto,
    currentUser: AuthUser,
  ): Promise<IHistoricalCorrection> {
    const correction = await this.repository.findById(id);
    if (!correction) throw new NotFoundError('Historical correction not found');

    if (!checkBranchAccess(currentUser.branchAccess, String(correction.branchId))) {
      throw new ForbiddenError('You do not have access to apply this correction');
    }

    if (correction.status !== 'approved') {
      throw new ConflictError(
        `Correction must be in approved status (currently ${correction.status})`,
      );
    }

    if (!correction.unlockToken || correction.unlockToken !== dto.unlockToken) {
      throw new ForbiddenError('Invalid correction unlock token');
    }

    if (!correction.unlockExpiresAt || new Date() > correction.unlockExpiresAt) {
      throw new ConflictError('Correction unlock token has expired. Request a new review.');
    }

    const corrected = validateCorrectionValue(correction.entityType, dto.correctedValue);
    const proposed = validateCorrectionValue(correction.entityType, correction.proposedValue);
    if (!corrected.success || !proposed.success) {
      throw new ValidationError('Correction contains invalid or unsupported values');
    }
    if (!isDeepStrictEqual(corrected.data, proposed.data)) {
      throw new ValidationError('Applied values must exactly match the approved proposed values');
    }
    dto = { ...dto, correctedValue: corrected.data };

    return runInTransaction(async (session) => {
      const now = new Date();
      // Claim the approval inside the same transaction as the record and audit writes.
      // Concurrent applications cannot both consume the same unlock token.
      const updated = await this.repository.updateById(
        id,
        {
          status: 'applied',
          appliedValue: dto.correctedValue,
          appliedBy: currentUser.userId,
          appliedAt: now,
          updatedBy: currentUser.userId,
        },
        session,
        { status: 'approved', unlockToken: dto.unlockToken, unlockExpiresAt: { $gt: now } },
      );
      if (!updated) throw new ConflictError('Correction approval has expired or already been used');

      if (correction.entityType === 'score') {
        const score = await ScoreModel.findOne(
          { _id: correction.entityId, isDeleted: false },
          null,
          { session },
        );
        if (!score) throw new NotFoundError('Target score record not found');

        const assessment = await AssessmentModel.findOne(
          { _id: score.assessmentId, isDeleted: false },
          null,
          { session },
        );
        if (!assessment) throw new NotFoundError('Associated assessment not found');

        const oldScore = score.scoreObtained;
        const oldAbsent = score.isAbsent;
        const newScore = Number(dto.correctedValue.scoreObtained ?? oldScore);
        const newAbsent =
          dto.correctedValue.isAbsent !== undefined
            ? Boolean(dto.correctedValue.isAbsent)
            : score.isAbsent;

        if (newScore < 0) {
          throw new ValidationError('Score obtained cannot be negative');
        }
        if (newScore > assessment.maxScore) {
          throw new ValidationError(
            `Score obtained (${newScore}) cannot exceed assessment maximum score of ${assessment.maxScore}`,
          );
        }

        score.scoreObtained = newAbsent ? 0 : newScore;
        score.isAbsent = newAbsent;
        if (newAbsent) {
          score.percentage = 0;
          score.letterGrade = 'F';
        } else {
          const { percentage, letterGrade } = calculateGrade(newScore, assessment.maxScore);
          score.percentage = percentage;
          score.letterGrade = letterGrade;
        }

        if (dto.correctedValue.remarks !== undefined) {
          score.remarks = String(dto.correctedValue.remarks);
        }
        score.updatedBy = currentUser.userId as never;
        await score.save({ session });

        // Record ScoreRevision linking back to this correction request with all required fields
        const revision = {
          scoreId: score._id,
          studentId: score.studentId,
          enrollmentId: score.enrollmentId,
          assessmentId: score.assessmentId,
          academicYearId: score.academicYearId,
          academicPeriodId: score.academicPeriodId,
          branchId: score.branchId,
          oldScore,
          newScore: score.scoreObtained,
          oldAbsent,
          newAbsent: score.isAbsent,
          reason: correction.reason,
          correctionRequestId: correction._id,
          changedBy: currentUser.userId,
          changedAt: now,
          approvedBy: correction.reviewedBy ?? currentUser.userId,
        };
        await ScoreRevisionModel.create([revision], { session });
      } else if (correction.entityType === 'attendance') {
        const attendanceRecord = await AttendanceRecordModel.findOne(
          { _id: correction.entityId, isDeleted: false },
          null,
          { session },
        );
        if (!attendanceRecord) throw new NotFoundError('Target attendance record not found');

        if (dto.correctedValue.status !== undefined) {
          attendanceRecord.status = dto.correctedValue.status as never;
        }
        if (dto.correctedValue.remarks !== undefined) {
          attendanceRecord.remarks = String(dto.correctedValue.remarks);
        }
        attendanceRecord.markedBy = currentUser.userId as never;
        attendanceRecord.markedAt = now;
        await attendanceRecord.save({ session });

        // Update transient projection in parent attendance session if present
        await AttendanceModel.updateOne(
          {
            _id: attendanceRecord.attendanceSessionId,
            'records.studentId': attendanceRecord.studentId,
          },
          {
            $set: {
              'records.$.status': attendanceRecord.status,
              'records.$.remarks': attendanceRecord.remarks,
              updatedBy: currentUser.userId,
            },
          },
          { session },
        );
      } else if (correction.entityType === 'term_result') {
        const termResult = await TermResultModel.findOne(
          { _id: correction.entityId, isDeleted: false },
          null,
          { session },
        );
        if (!termResult) throw new NotFoundError('Target term result record not found');

        if (dto.correctedValue.totalScore !== undefined) {
          termResult.totalScore = Number(dto.correctedValue.totalScore);
        }
        if (dto.correctedValue.averageScore !== undefined) {
          termResult.averageScore = Number(dto.correctedValue.averageScore);
        }
        if (dto.correctedValue.gpa !== undefined) {
          termResult.gpa = Number(dto.correctedValue.gpa);
        }
        if (dto.correctedValue.letterGrade !== undefined) {
          termResult.letterGrade = dto.correctedValue.letterGrade as never;
        }
        if (dto.correctedValue.resultStatus !== undefined) {
          termResult.resultStatus = dto.correctedValue.resultStatus as never;
        }
        if (dto.correctedValue.promotionStatus !== undefined) {
          termResult.promotionStatus = dto.correctedValue.promotionStatus as never;
        }
        if (dto.correctedValue.remarks !== undefined) {
          termResult.remarks = String(dto.correctedValue.remarks);
        }
        termResult.workflowStatus = 'CORRECTED';
        termResult.updatedBy = currentUser.userId as never;
        await termResult.save({ session });
      }

      await AuditLogService.log({
        userId: currentUser.userId,
        schoolId: currentUser.schoolId,
        branchId: String(correction.branchId),
        module: 'historical_correction',
        action: 'UPDATE',
        entityType: 'HistoricalCorrection',
        entityId: String(correction._id),
        reason: dto.remarks ?? correction.reason,
        session,
        required: true,
      });

      return updated;
    });
  }
}
