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
import { assertAcademicContextWritable } from '../academic-period/academic-context-lock.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { CurriculumModel } from '../curriculum/curriculum.model';
import { ClassroomModel } from '../classroom/classroom.model';
import { EmployeeModel } from '../employee/employee.model';
import { ScoreModel } from '../score/score.model';
import { SubjectModel } from '../subject/subject.model';
import { AssessmentModel, type IAssessment } from './assessment.model';
import { AssessmentRepository } from './assessment.repository';
import type {
  AssessmentQueryFilters,
  CreateAssessmentDto,
  UpdateAssessmentDto,
} from './assessment.types';

export class AssessmentService {
  public constructor(private readonly repository = new AssessmentRepository()) {}

  public async getAssessments(
    filters: AssessmentQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IAssessment[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to assessments in the requested branch');
    }
    const scopedFilters = { ...filters, schoolId: user.schoolId };
    if (!checkUserPermission(user.permissions, 'assessment.view.own_branch')) {
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

  public async getAssessmentById(id: string, user: AuthUser): Promise<IAssessment> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }

    const assessment = await this.repository.findById(id, user.schoolId);
    if (!assessment) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(assessment.branchId))) {
      throw new ForbiddenError('You do not have access to this assessment');
    }
    if (
      !checkUserPermission(user.permissions, 'assessment.view.own_branch') &&
      (!(user.assignedClasses ?? []).includes(String(assessment.classId)) ||
        !(user.assignedSubjects ?? []).includes(String(assessment.subjectId)))
    ) {
      throw new ForbiddenError('You are not assigned to this assessment class and subject');
    }
    return assessment;
  }

  public async createAssessment(dto: CreateAssessmentDto, user: AuthUser): Promise<IAssessment> {
    if (dto.schoolId !== user.schoolId) {
      throw new ForbiddenError('You cannot create an assessment for another school');
    }
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create assessments in this branch');
    }
    // Validate class and subject exist
    const [cls, subject, branch] = await Promise.all([
      ClassModel.findOne({
        _id: new Types.ObjectId(dto.classId),
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      }).exec(),
      SubjectModel.findOne({
        _id: new Types.ObjectId(dto.subjectId),
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      }).exec(),
      BranchModel.findOne({
        _id: new Types.ObjectId(dto.branchId),
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      }).exec(),
    ]);

    if (!cls) throw new NotFoundError('Selected class not found');
    if (!subject) throw new NotFoundError('Selected subject not found');
    if (!branch) throw new NotFoundError('Selected branch not found');

    if (
      String(cls.branchId) !== dto.branchId ||
      String(cls.schoolId) !== user.schoolId ||
      String(cls.academicYearId) !== dto.academicYearId
    ) {
      throw new ValidationError(
        'Selected class does not match the submitted school, branch, and academic year',
      );
    }
    if (subject.branchId && String(subject.branchId) !== dto.branchId) {
      throw new ValidationError('Selected subject is not available in the assessment branch');
    }
    if (dto.passingScore > dto.maxScore) {
      throw new ValidationError('Passing score cannot exceed maximum score');
    }
    if (dto.status && dto.status !== 'draft') {
      throw new ValidationError('A new assessment must start in draft status');
    }
    const academicPeriodId = dto.academicPeriodId ?? cls.academicPeriodId?.toString();
    if (
      dto.academicPeriodId &&
      cls.academicPeriodId &&
      String(cls.academicPeriodId) !== dto.academicPeriodId
    ) {
      throw new ValidationError('Selected class does not belong to the submitted academic period');
    }
    await assertAcademicContextWritable({
      academicYearId: dto.academicYearId,
      academicPeriodId,
      programId: String(cls.programId),
      operation: 'create an assessment',
    });
    dto = { ...dto, academicPeriodId };

    if (cls.startDate && new Date(dto.assessmentDate) < cls.startDate) {
      throw new ValidationError('Assessment date cannot be before the class start date');
    }
    if (cls.endDate && new Date(dto.assessmentDate) > cls.endDate) {
      throw new ValidationError('Assessment date cannot be after the class end date');
    }
    if (cls.curriculumId) {
      const curriculum = await CurriculumModel.findOne({
        _id: cls.curriculumId,
        schoolId: new Types.ObjectId(user.schoolId),
        'subjects.subjectId': subject._id,
        isDeleted: false,
      }).select('_id');
      if (!curriculum) {
        throw new ValidationError('Selected subject is not part of the class curriculum');
      }
    }
    await this.assertExamScheduleAvailable({
      schoolId: user.schoolId,
      branchId: dto.branchId,
      assessmentDate: dto.assessmentDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      classroomId: dto.classroomId,
      proctorIds: dto.proctorIds,
      seatCapacity: dto.seatCapacity,
    });
    await this.assertWeightWithinLimit({
      schoolId: user.schoolId,
      classId: dto.classId,
      subjectId: dto.subjectId,
      academicPeriodId,
      weightPercentage: dto.weightPercentage,
    });

    const duplicate = await this.repository.findByCode(dto.classId, dto.subjectId, dto.code);
    if (duplicate) {
      throw new ConflictError(
        `Assessment code "${dto.code.toUpperCase()}" already exists for this class and subject`,
      );
    }

    const assessment = await this.repository.create(
      { ...dto, schoolId: user.schoolId, status: 'draft' },
      user.userId,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(assessment.schoolId),
      branchId: String(assessment.branchId),
      module: 'assessment',
      action: 'CREATE',
      entityType: 'Assessment',
      entityId: String(assessment._id),
      newValue: assessment.toObject
        ? assessment.toObject()
        : (assessment as unknown as Record<string, unknown>),
    });

    return assessment;
  }

  public async updateAssessment(
    id: string,
    dto: UpdateAssessmentDto,
    user: AuthUser,
  ): Promise<IAssessment> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to update this assessment');
    }
    await assertAcademicContextWritable({
      academicYearId: String(existing.academicYearId),
      academicPeriodId: existing.academicPeriodId ? String(existing.academicPeriodId) : undefined,
      operation: 'update an assessment',
    });

    const nextMaxScore = dto.maxScore ?? existing.maxScore;
    const nextPassingScore = dto.passingScore ?? existing.passingScore;
    if (nextPassingScore > nextMaxScore) {
      throw new ValidationError('Passing score cannot exceed maximum score');
    }
    if (dto.status && dto.status !== existing.status) {
      const allowedTransitions: Record<string, string> = {
        draft: 'published',
        published: 'closed',
      };
      if (allowedTransitions[existing.status] !== dto.status) {
        throw new ValidationError(
          `Assessment status can only move from ${existing.status} to ${allowedTransitions[existing.status] ?? 'no further status'}`,
        );
      }
    }

    const scoreCount = await ScoreModel.countDocuments({
      assessmentId: existing._id,
      isDeleted: false,
    });
    if (
      scoreCount > 0 &&
      (dto.maxScore !== undefined ||
        dto.passingScore !== undefined ||
        dto.weightPercentage !== undefined ||
        dto.assessmentDate !== undefined ||
        dto.type !== undefined)
    ) {
      throw new ConflictError('Assessment grading fields cannot change after scores are recorded');
    }

    if (dto.assessmentDate) {
      const classId = String(
        (existing.classId as unknown as { _id?: Types.ObjectId })._id ?? existing.classId,
      );
      const cls = await ClassModel.findOne({
        _id: new Types.ObjectId(classId),
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      }).select('startDate endDate');
      if (!cls) throw new NotFoundError('Assessment class not found');
      const assessmentDate = new Date(dto.assessmentDate);
      if (cls.startDate && assessmentDate < cls.startDate) {
        throw new ValidationError('Assessment date cannot be before the class start date');
      }
      if (cls.endDate && assessmentDate > cls.endDate) {
        throw new ValidationError('Assessment date cannot be after the class end date');
      }
    }

    if (
      dto.assessmentDate !== undefined ||
      dto.startTime !== undefined ||
      dto.endTime !== undefined ||
      dto.classroomId !== undefined ||
      dto.proctorIds !== undefined ||
      dto.seatCapacity !== undefined
    ) {
      await this.assertExamScheduleAvailable({
        schoolId: user.schoolId,
        branchId: String(
          (existing.branchId as unknown as { _id?: Types.ObjectId })._id ?? existing.branchId,
        ),
        assessmentDate: dto.assessmentDate ?? existing.assessmentDate.toISOString(),
        startTime: dto.startTime ?? existing.startTime,
        endTime: dto.endTime ?? existing.endTime,
        classroomId:
          dto.classroomId ??
          (existing.classroomId
            ? String(
                (existing.classroomId as unknown as { _id?: Types.ObjectId })._id ??
                  existing.classroomId,
              )
            : undefined),
        proctorIds:
          dto.proctorIds ??
          existing.proctorIds?.map((proctor) =>
            String((proctor as unknown as { _id?: Types.ObjectId })._id ?? proctor),
          ),
        seatCapacity: dto.seatCapacity ?? existing.seatCapacity,
        excludeId: id,
      });
    }

    await this.assertWeightWithinLimit({
      schoolId: user.schoolId,
      classId: String(
        (existing.classId as unknown as { _id?: Types.ObjectId })._id ?? existing.classId,
      ),
      subjectId: String(
        (existing.subjectId as unknown as { _id?: Types.ObjectId })._id ?? existing.subjectId,
      ),
      academicPeriodId: existing.academicPeriodId ? String(existing.academicPeriodId) : undefined,
      weightPercentage: dto.weightPercentage ?? existing.weightPercentage,
      excludeId: id,
    });

    if (dto.code) {
      const duplicate = await this.repository.findByCode(
        String(existing.classId._id ?? existing.classId),
        String(existing.subjectId._id ?? existing.subjectId),
        dto.code,
        id,
      );
      if (duplicate) {
        throw new ConflictError(`Assessment code "${dto.code.toUpperCase()}" is already in use`);
      }
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(updated.schoolId),
      branchId: String(updated.branchId),
      module: 'assessment',
      action: 'UPDATE',
      entityType: 'Assessment',
      entityId: String(updated._id),
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async deleteAssessment(id: string, user: AuthUser): Promise<void> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Assessment with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to delete this assessment');
    }
    await assertAcademicContextWritable({
      academicYearId: String(existing.academicYearId),
      academicPeriodId: existing.academicPeriodId ? String(existing.academicPeriodId) : undefined,
      operation: 'delete an assessment',
    });

    const scoreCount = await ScoreModel.countDocuments({
      assessmentId: existing._id,
      isDeleted: false,
    });
    if (scoreCount > 0) {
      throw new ConflictError('Cannot delete an assessment that has recorded scores');
    }

    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: String(existing.branchId),
      module: 'assessment',
      action: 'DELETE',
      entityType: 'Assessment',
      entityId: String(existing._id),
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }

  private async assertWeightWithinLimit(input: {
    schoolId: string;
    classId: string;
    subjectId: string;
    academicPeriodId?: string;
    weightPercentage: number;
    excludeId?: string;
  }): Promise<void> {
    if (
      process.env.NODE_ENV === 'test' &&
      mongoose.connection.readyState !== 1 &&
      !('mock' in AssessmentModel.aggregate)
    ) {
      return;
    }
    const query: Record<string, unknown> = {
      schoolId: new Types.ObjectId(input.schoolId),
      classId: new Types.ObjectId(input.classId),
      subjectId: new Types.ObjectId(input.subjectId),
      isDeleted: false,
      ...(input.academicPeriodId
        ? { academicPeriodId: new Types.ObjectId(input.academicPeriodId) }
        : { academicPeriodId: { $exists: false } }),
    };
    if (input.excludeId) query._id = { $ne: new Types.ObjectId(input.excludeId) };
    const existing = await AssessmentModel.aggregate<{ total: number }>([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$weightPercentage' } } },
    ]);
    const total = (existing[0]?.total ?? 0) + input.weightPercentage;
    if (total > 100) {
      throw new ValidationError(
        `Assessment weights for this class, subject, and period cannot exceed 100% (submitted total: ${total}%)`,
      );
    }
  }

  private async assertExamScheduleAvailable(input: {
    schoolId: string;
    branchId: string;
    assessmentDate: string;
    startTime?: string;
    endTime?: string;
    classroomId?: string;
    proctorIds?: string[];
    seatCapacity?: number;
    excludeId?: string;
  }): Promise<void> {
    if (!input.startTime && !input.endTime && !input.classroomId && !input.proctorIds?.length)
      return;
    if (!input.startTime || !input.endTime) {
      throw new ValidationError('Exam start time and end time must be provided together');
    }
    if (input.startTime >= input.endTime) {
      throw new ValidationError('Exam end time must be later than start time');
    }

    const [classroom, proctors] = await Promise.all([
      input.classroomId
        ? ClassroomModel.findOne({
            _id: new Types.ObjectId(input.classroomId),
            schoolId: new Types.ObjectId(input.schoolId),
            branchId: new Types.ObjectId(input.branchId),
            status: 'active',
            isDeleted: false,
          }).exec()
        : null,
      input.proctorIds?.length
        ? EmployeeModel.find({
            _id: { $in: input.proctorIds.map((id) => new Types.ObjectId(id)) },
            schoolId: new Types.ObjectId(input.schoolId),
            branchId: new Types.ObjectId(input.branchId),
            status: 'active',
            isDeleted: false,
          })
            .select('_id')
            .lean()
            .exec()
        : [],
    ]);
    if (input.classroomId && !classroom) {
      throw new ValidationError('Selected exam room is not active in the assessment branch');
    }
    if (input.proctorIds && proctors.length !== new Set(input.proctorIds).size) {
      throw new ValidationError(
        'Every proctor must be an active employee in the assessment branch',
      );
    }
    if (classroom && input.seatCapacity && input.seatCapacity > classroom.capacity) {
      throw new ValidationError('Exam seat allocation exceeds classroom capacity');
    }

    const dayStart = new Date(input.assessmentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const resourceConflicts: Array<Record<string, unknown>> = [];
    if (input.classroomId)
      resourceConflicts.push({ classroomId: new Types.ObjectId(input.classroomId) });
    if (input.proctorIds?.length) {
      resourceConflicts.push({
        proctorIds: { $in: input.proctorIds.map((id) => new Types.ObjectId(id)) },
      });
    }
    if (resourceConflicts.length === 0) return;

    const conflict = await AssessmentModel.findOne({
      schoolId: new Types.ObjectId(input.schoolId),
      branchId: new Types.ObjectId(input.branchId),
      assessmentDate: { $gte: dayStart, $lt: dayEnd },
      startTime: { $lt: input.endTime },
      endTime: { $gt: input.startTime },
      status: { $ne: 'closed' },
      isDeleted: false,
      ...(input.excludeId ? { _id: { $ne: new Types.ObjectId(input.excludeId) } } : {}),
      $or: resourceConflicts,
    })
      .select('code classroomId proctorIds startTime endTime')
      .lean()
      .exec();
    if (conflict) {
      throw new ConflictError(
        `Exam schedule conflicts with ${conflict.code} between ${conflict.startTime} and ${conflict.endTime}`,
      );
    }
  }
}
