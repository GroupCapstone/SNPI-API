import { Types } from 'mongoose';
import mongoose from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { assertAcademicContextWritable } from '../academic-period/academic-context-lock.service';
import { AssessmentModel } from '../assessment/assessment.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import { ScoreRevisionModel } from './score-revision.model';
import { ScoreModel } from './score.model';
import type { IScore } from './score.model';
import { ScoreRepository } from './score.repository';
import type { BatchScoreEntryDto, ScoreQueryFilters } from './score.types';
import { TermResultModel } from '../term-result/term-result.model';

export class ScoreService {
  public constructor(private readonly repository = new ScoreRepository()) {}

  public async getScores(
    filters: ScoreQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IScore[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to scores in the requested branch');
    }
    const scopedFilters = { ...filters, schoolId: user.schoolId };
    if (!checkUserPermission(user.permissions, 'score.view.own_branch')) {
      if (filters.classId && !(user.assignedClasses ?? []).includes(filters.classId)) {
        throw new ForbiddenError('You are not assigned to the requested class');
      }
      if (filters.subjectId && !(user.assignedSubjects ?? []).includes(filters.subjectId)) {
        throw new ForbiddenError('You are not assigned to the requested subject');
      }
      scopedFilters.authorizedClassIds = user.assignedClasses ?? [];
      scopedFilters.authorizedSubjectIds = user.assignedSubjects ?? [];
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? undefined
        : Array.isArray(user.branchAccess)
          ? user.branchAccess
          : undefined;

    return this.repository.findWithFilters(scopedFilters, branchFilter);
  }

  public async batchRecordScores(dto: BatchScoreEntryDto, user: AuthUser): Promise<IScore[]> {
    if (!dto.assessmentId || !Types.ObjectId.isValid(dto.assessmentId)) {
      throw new NotFoundError('Invalid Assessment ID');
    }

    const assessment = await AssessmentModel.findOne({
      _id: new Types.ObjectId(dto.assessmentId),
      schoolId: new Types.ObjectId(user.schoolId),
      isDeleted: false,
    }).exec();

    if (!assessment) {
      throw new NotFoundError('Assessment not found');
    }

    if (assessment.status !== 'published') {
      throw new ValidationError('Scores can only be recorded for a published assessment');
    }

    const uniqueStudentIds = new Set(dto.scores.map((item) => item.studentId));
    if (uniqueStudentIds.size !== dto.scores.length) {
      throw new ValidationError('Each student may appear only once in a score batch');
    }

    if (!checkBranchAccess(user.branchAccess, String(assessment.branchId))) {
      throw new ForbiddenError('You do not have access to record scores for this assessment');
    }
    await assertAcademicContextWritable({
      academicYearId: String(assessment.academicYearId),
      academicPeriodId: assessment.academicPeriodId
        ? String(assessment.academicPeriodId)
        : undefined,
      operation: 'record scores',
    });

    if (mongoose.connection.readyState === 1 && assessment.academicPeriodId) {
      const lockedResult = await TermResultModel.exists({
        schoolId: assessment.schoolId,
        branchId: assessment.branchId,
        classId: assessment.classId,
        academicPeriodId: assessment.academicPeriodId,
        workflowStatus: { $in: ['APPROVED', 'FINALIZED'] },
        isDeleted: false,
      });
      if (lockedResult) {
        throw new ConflictError('Scores are locked because this term result was approved');
      }
    }

    const canManageAllClasses = checkUserPermission(user.permissions, 'score.create.own_branch');
    if (!canManageAllClasses) {
      if (!user.employeeId) {
        throw new ForbiddenError('A linked employee record is required for teacher score entry');
      }
      const assignment = await TeacherAssignmentModel.exists({
        employeeId: user.employeeId,
        branchId: assessment.branchId,
        classId: assessment.classId,
        subjectId: assessment.subjectId,
        status: 'active',
        isDeleted: false,
        startDate: { $lte: new Date() },
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: new Date() } },
        ],
      });
      if (!assignment) {
        throw new ForbiddenError('You are not assigned to teach this class and subject');
      }
    }

    const submittedStudentIds = dto.scores.map((item) => new Types.ObjectId(item.studentId));
    const enrolledStudents = await EnrollmentModel.find({
      classId: assessment.classId,
      studentId: { $in: submittedStudentIds },
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    }).select('_id studentId');
    const enrolledIds = new Set(enrolledStudents.map((enrollment) => String(enrollment.studentId)));
    const enrollmentByStudentId = new Map(
      enrolledStudents.map((enrollment) => [String(enrollment.studentId), String(enrollment._id)]),
    );
    for (const item of dto.scores) {
      if (!enrolledIds.has(item.studentId)) {
        throw new ValidationError(
          `Student with ID ${item.studentId} is not actively enrolled in the assessment class`,
        );
      }
    }

    for (const item of dto.scores) {
      if (item.isAbsent && item.scoreObtained !== 0) {
        throw new ValidationError('An absent student must have a score of zero');
      }
      if (!item.isAbsent && item.scoreObtained > assessment.maxScore) {
        throw new ValidationError(
          `Score obtained (${item.scoreObtained}) cannot exceed assessment maximum score (${assessment.maxScore})`,
        );
      }
    }

    return runInTransaction(async (session) => {
      const previousScores =
        mongoose.connection.readyState === 1
          ? await ScoreModel.find({
              assessmentId: assessment._id,
              studentId: { $in: submittedStudentIds },
              isDeleted: false,
            })
              .session(session ?? null)
              .lean()
              .exec()
          : [];
      const previousByStudentId = new Map(
        previousScores.map((score) => [String(score.studentId), score]),
      );
      const changedItems = dto.scores.filter((item) => {
        const previous = previousByStudentId.get(item.studentId);
        return (
          previous &&
          (previous.scoreObtained !== item.scoreObtained ||
            previous.isAbsent !== Boolean(item.isAbsent))
        );
      });
      if (changedItems.length > 0 && !dto.reason?.trim()) {
        throw new ValidationError('A reason is required when revising an existing score');
      }

      const savedScores = await this.repository.batchUpsertScores(
        {
          assessmentId: String(assessment._id),
          schoolId: String(assessment.schoolId),
          branchId: String(assessment.branchId),
          academicYearId: String(assessment.academicYearId),
          academicPeriodId: assessment.academicPeriodId
            ? String(assessment.academicPeriodId)
            : undefined,
          classId: String(assessment.classId),
          subjectId: String(assessment.subjectId),
          maxScore: assessment.maxScore,
          enrollmentByStudentId,
        },
        dto,
        user.userId,
        session,
      );

      if (changedItems.length > 0) {
        const savedByStudentId = new Map(
          savedScores.map((score) => [String(score.studentId), score]),
        );
        const revisions = changedItems.map((item) => {
          const previous = previousByStudentId.get(item.studentId)!;
          const saved = savedByStudentId.get(item.studentId)!;
          return {
            scoreId: saved._id,
            studentId: previous.studentId,
            enrollmentId:
              previous.enrollmentId ??
              new Types.ObjectId(enrollmentByStudentId.get(item.studentId)),
            assessmentId: assessment._id,
            academicYearId: assessment.academicYearId,
            academicPeriodId: assessment.academicPeriodId,
            branchId: assessment.branchId,
            oldScore: previous.scoreObtained,
            newScore: item.scoreObtained,
            oldAbsent: previous.isAbsent,
            newAbsent: Boolean(item.isAbsent),
            reason: dto.reason!.trim(),
            changedBy: user.userId,
            changedAt: new Date(),
            correctionRequestId: dto.correctionRequestId
              ? new Types.ObjectId(dto.correctionRequestId)
              : undefined,
          };
        });
        await ScoreRevisionModel.insertMany(revisions, session ? { session } : {});
      }

      await AuditLogService.log({
        userId: user.userId,
        schoolId: String(assessment.schoolId),
        branchId: String(assessment.branchId),
        module: 'score',
        action: 'UPDATE',
        entityType: 'AssessmentScore',
        entityId: String(assessment._id),
        reason: dto.reason,
        newValue: {
          assessmentId: String(assessment._id),
          recordedCount: dto.scores.length,
          revisedCount: changedItems.length,
        },
        session,
        required: true,
      });

      return savedScores;
    });
  }
}
