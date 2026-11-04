import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AssessmentModel } from '../assessment/assessment.model';
import { BranchModel } from '../branch/branch.model';
import { ClassScheduleModel } from '../class-schedule/class-schedule.model';
import { CurriculumModel } from '../curriculum/curriculum.model';
import { ScoreModel } from '../score/score.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import type { ISubject } from './subject.model';
import { SubjectRepository } from './subject.repository';
import type { CreateSubjectDto, SubjectQueryFilters, UpdateSubjectDto } from './subject.types';

export class SubjectService {
  public constructor(private readonly repository = new SubjectRepository()) {}

  public async getSubjects(
    filters: SubjectQueryFilters,
    user: AuthUser,
  ): Promise<{ data: ISubject[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to subjects in the requested branch');
    }
    const assignedSubjectFilter = checkUserPermission(user.permissions, 'subject.view.own_branch')
      ? {}
      : { _id: { $in: user.assignedSubjects ?? [] } };
    const branchFilter =
      user.branchAccess === 'all'
        ? filters.branchId
          ? { branchId: filters.branchId, ...assignedSubjectFilter }
          : assignedSubjectFilter
        : {
            ...assignedSubjectFilter,
            $or: [
              { branchId: { $in: user.branchAccess } },
              { branchId: { $exists: false } },
              { branchId: null },
            ],
          };

    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId }, branchFilter);
  }

  public async getSubjectById(id: string, user: AuthUser): Promise<ISubject> {
    const subject = await this.repository.findById(id, user.schoolId);
    if (!subject) {
      throw new NotFoundError('Subject not found');
    }
    if (subject.branchId && !checkBranchAccess(user.branchAccess, String(subject.branchId))) {
      throw new ForbiddenError('You do not have access to this subject');
    }
    if (
      !checkUserPermission(user.permissions, 'subject.view.own_branch') &&
      !(user.assignedSubjects ?? []).includes(id)
    ) {
      throw new ForbiddenError('You are not assigned to this subject');
    }
    return subject;
  }

  public async createSubject(dto: CreateSubjectDto, user: AuthUser): Promise<ISubject> {
    if (dto.branchId) {
      if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
        throw new ForbiddenError('You do not have access to create a subject in this branch');
      }
    } else if (!checkUserPermission(user.permissions, 'subject.create.all_branches')) {
      throw new ForbiddenError('Only all-branch users can create a global subject');
    }
    if (dto.branchId) {
      const branch = await BranchModel.exists({
        _id: dto.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }
    const existing = await this.repository.findByCode(dto.code, undefined, user.schoolId);
    if (existing) {
      throw new ConflictError(`Subject with code "${dto.code}" already exists`);
    }

    const subject = await this.repository.create(
      {
        ...dto,
        schoolId: dto.schoolId ?? user.schoolId,
      },
      user.userId,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'subject',
      action: 'CREATE',
      entityType: 'Subject',
      entityId: subject._id.toString(),
      newValue: subject.toObject(),
    });

    return subject;
  }

  public async updateSubject(id: string, dto: UpdateSubjectDto, user: AuthUser): Promise<ISubject> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Subject not found');
    }
    if (existing.branchId) {
      if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
        throw new ForbiddenError('You do not have access to update this subject');
      }
    } else if (!checkUserPermission(user.permissions, 'subject.edit.all_branches')) {
      throw new ForbiddenError('Only all-branch users can update a global subject');
    }
    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to the target subject branch');
    }

    if (dto.branchId) {
      const branch = await BranchModel.exists({
        _id: dto.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.repository.findByCode(dto.code, id, user.schoolId);
      if (duplicate) {
        throw new ConflictError(`Subject with code "${dto.code}" already exists`);
      }
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError('Subject not found');
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: updated.branchId?.toString(),
      module: 'subject',
      action: 'UPDATE',
      entityType: 'Subject',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteSubject(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Subject not found');
    }
    if (existing.branchId) {
      if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
        throw new ForbiddenError('You do not have access to delete this subject');
      }
    } else if (!checkUserPermission(user.permissions, 'subject.delete.all_branches')) {
      throw new ForbiddenError('Only all-branch users can delete a global subject');
    }

    const [curriculumCount, assessmentCount, scheduleCount, assignmentCount, scoreCount] =
      await Promise.all([
        CurriculumModel.countDocuments({ 'subjects.subjectId': id, isDeleted: false }),
        AssessmentModel.countDocuments({ subjectId: id, isDeleted: false }),
        ClassScheduleModel.countDocuments({ subjectId: id, isDeleted: false }),
        TeacherAssignmentModel.countDocuments({ subjectId: id, isDeleted: false }),
        ScoreModel.countDocuments({ subjectId: id, isDeleted: false }),
      ]);
    if (curriculumCount + assessmentCount + scheduleCount + assignmentCount + scoreCount > 0) {
      throw new ValidationError(
        `Cannot archive Subject because it has active dependencies (${curriculumCount} curricula, ${assessmentCount} assessments, ${scheduleCount} schedules, ${assignmentCount} teacher assignments, ${scoreCount} scores)`,
      );
    }

    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId?.toString(),
      module: 'subject',
      action: 'DELETE',
      entityType: 'Subject',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
