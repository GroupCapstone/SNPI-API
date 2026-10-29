import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ClassModel } from '../class/class.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { TermResultModel } from '../term-result/term-result.model';
import type { IAcademicYear } from './academic-year.model';
import { AcademicYearModel } from './academic-year.model';
import { AcademicYearRepository } from './academic-year.repository';
import type {
  AcademicYearQueryFilters,
  AcademicYearClosingChecklist,
  AcademicYearTransitionDto,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from './academic-year.types';

export class AcademicYearService {
  public constructor(private readonly repository = new AcademicYearRepository()) {}

  public async getAcademicYears(
    filters: AcademicYearQueryFilters = {},
    user: AuthUser,
  ): Promise<IAcademicYear[]> {
    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId });
  }

  public async getAcademicYearById(id: string, user: AuthUser): Promise<IAcademicYear> {
    const year = await this.repository.findById(id, user.schoolId);
    if (!year) {
      throw new NotFoundError(`Academic year with ID "${id}" not found`);
    }
    return year;
  }

  public async createAcademicYear(
    dto: CreateAcademicYearDto,
    user: AuthUser,
  ): Promise<IAcademicYear> {
    const existing = await this.repository.findByCode(dto.code, user.schoolId);
    if (existing) {
      throw new ConflictError(`Academic year with code "${dto.code}" already exists`);
    }

    const schoolId = user.schoolId;
    const requestedStatus = dto.status;
    const requestedCurrent = dto.isCurrent;
    if (requestedStatus && !['planned', 'active'].includes(requestedStatus)) {
      throw new ValidationError('New academic years must start in planned or active status');
    }
    let created = await this.repository.create({
      ...dto,
      schoolId,
      status: 'planned',
      isCurrent: false,
    });

    if (requestedStatus === 'active' || requestedCurrent) {
      created = await this.transitionAcademicYear(
        created._id.toString(),
        { status: 'active' },
        user,
      );
    }

    await AuditLogService.log({
      userId: user.userId,
      module: 'academic_year',
      action: 'CREATE',
      entityType: 'AcademicYear',
      entityId: created._id.toString(),
      schoolId,
      newValue: {
        code: created.code,
        name: created.name,
        startDate: created.startDate,
        endDate: created.endDate,
        isCurrent: created.isCurrent,
        status: created.status,
      },
    });

    return created;
  }

  public async updateAcademicYear(
    id: string,
    dto: UpdateAcademicYearDto,
    user: AuthUser,
  ): Promise<IAcademicYear> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Academic year with ID "${id}" not found`);
    }

    if (dto.code && dto.code.trim().toUpperCase() !== existing.code) {
      const duplicate = await this.repository.findByCode(dto.code, user.schoolId);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new ConflictError(`Academic year with code "${dto.code}" already exists`);
      }
    }

    if (dto.status && dto.status !== existing.status) {
      await this.transitionAcademicYear(id, { status: dto.status }, user);
      const remaining = { ...dto };
      delete remaining.status;
      if (Object.keys(remaining).length === 0) return this.getAcademicYearById(id, user);
      dto = remaining;
    }

    if (dto.schoolId && dto.schoolId !== user.schoolId) {
      throw new ValidationError('Academic year school cannot be changed');
    }
    delete dto.schoolId;

    const nextStart = dto.startDate ? new Date(dto.startDate) : existing.startDate;
    const nextEnd = dto.endDate ? new Date(dto.endDate) : existing.endDate;
    if (
      Number.isNaN(nextStart.getTime()) ||
      Number.isNaN(nextEnd.getTime()) ||
      nextStart >= nextEnd
    ) {
      throw new ValidationError('Academic year start date must be before end date');
    }
    if (dto.isCurrent !== undefined && dto.isCurrent !== (existing.status === 'active')) {
      throw new ValidationError(
        'Use the academic year lifecycle transition to change current status',
      );
    }
    delete dto.isCurrent;

    const updated = await this.repository.update(id, dto, user.schoolId);
    if (!updated) {
      throw new NotFoundError(`Failed to update academic year with ID "${id}"`);
    }

    await AuditLogService.log({
      userId: user.userId,
      module: 'academic_year',
      action: 'UPDATE',
      entityType: 'AcademicYear',
      entityId: id,
      schoolId: existing.schoolId?.toString() || user.schoolId,
      oldValue: {
        code: existing.code,
        name: existing.name,
        startDate: existing.startDate,
        endDate: existing.endDate,
        isCurrent: existing.isCurrent,
        status: existing.status,
      },
      newValue: {
        code: updated.code,
        name: updated.name,
        startDate: updated.startDate,
        endDate: updated.endDate,
        isCurrent: updated.isCurrent,
        status: updated.status,
      },
    });

    return updated;
  }

  public async getClosingChecklist(
    id: string,
    user?: AuthUser,
  ): Promise<AcademicYearClosingChecklist> {
    const year = await this.repository.findById(id, user?.schoolId);
    if (!year) throw new NotFoundError(`Academic year with ID "${id}" not found`);
    const [periods, activeEnrollments, unlockedResults] = await Promise.all([
      AcademicPeriodModel.find({ academicYearId: id, isDeleted: false }).select('status').lean(),
      EnrollmentModel.countDocuments({
        academicYearId: id,
        status: { $in: ['pending', 'enrolled', 'active'] },
        isDeleted: false,
      }),
      TermResultModel.countDocuments({
        academicYearId: id,
        workflowStatus: { $ne: 'FINALIZED' },
        isDeleted: false,
      }),
    ]);
    const nonClosedPeriods = periods.filter((period) => period.status !== 'closed').length;
    const problems: string[] = [];
    if (nonClosedPeriods > 0)
      problems.push(`${nonClosedPeriods} academic period(s) are not closed`);
    if (activeEnrollments > 0) problems.push(`${activeEnrollments} enrollment(s) remain active`);
    if (unlockedResults > 0) problems.push(`${unlockedResults} term result(s) are not finalized`);
    return {
      academicYearId: id,
      canClose: problems.length === 0,
      checkedAt: new Date(),
      counts: {
        periods: periods.length,
        nonClosedPeriods,
        activeEnrollments,
        unlockedResults,
      },
      problems,
    };
  }

  public async transitionAcademicYear(
    id: string,
    dto: AcademicYearTransitionDto,
    user: AuthUser,
  ): Promise<IAcademicYear> {
    const year = await this.repository.findById(id, user.schoolId);
    if (!year) throw new NotFoundError(`Academic year with ID "${id}" not found`);
    const legacyStatus = year.status === ('inactive' as never) ? 'planned' : year.status;
    if (legacyStatus === dto.status) return year;
    const allowed: Record<string, string> = {
      planned: 'active',
      active: 'closing',
      closing: 'closed',
      closed: 'archived',
    };
    if (allowed[legacyStatus] !== dto.status) {
      throw new ConflictError(
        `Cannot transition academic year from ${legacyStatus} to ${dto.status}`,
      );
    }
    if (dto.status === 'closed') {
      const checklist = await this.getClosingChecklist(id, user);
      if (!checklist.canClose) {
        throw new ConflictError(
          `Cannot close ${year.name}. Problems: ${checklist.problems.join('; ')}`,
        );
      }
    }
    if (dto.status === 'active') {
      await AcademicYearModel.updateMany(
        { _id: { $ne: year._id }, schoolId: year.schoolId, isDeleted: false },
        { $set: { isCurrent: false } },
      );
    }
    const now = new Date();
    const metadata: Record<string, unknown> = {};
    if (dto.status === 'closed') Object.assign(metadata, { closedAt: now, closedBy: user.userId });
    if (dto.status === 'archived')
      Object.assign(metadata, { archivedAt: now, archivedBy: user.userId });
    const updated = await AcademicYearModel.findOneAndUpdate(
      { _id: id, status: year.status, isDeleted: false },
      {
        $set: {
          status: dto.status,
          isCurrent: dto.status === 'active',
          ...metadata,
          updatedBy: user.userId,
        },
      },
      { new: true, runValidators: true },
    );
    if (!updated) throw new ConflictError('Academic year changed while transitioning');
    await AuditLogService.log({
      userId: user.userId,
      schoolId: year.schoolId?.toString() || user.schoolId,
      module: 'academic_year',
      action: dto.status === 'archived' ? 'ARCHIVE' : 'WORKFLOW_TRANSITION',
      entityType: 'AcademicYear',
      entityId: id,
      reason: dto.reason,
      oldValue: { status: legacyStatus },
      newValue: { status: dto.status, ...metadata },
    });
    return updated;
  }

  public async deleteAcademicYear(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Academic year with ID "${id}" not found`);
    }
    if (['closed', 'archived'].includes(existing.status)) {
      throw new ConflictError('Closed or archived academic years cannot be deleted');
    }

    // Dependency check: Cannot delete if academic periods or classes exist
    const linkedPeriods = await AcademicPeriodModel.countDocuments({
      academicYearId: id,
      isDeleted: false,
    });
    if (linkedPeriods > 0) {
      throw new ValidationError(
        `Cannot delete academic year: ${linkedPeriods} academic term(s)/period(s) are linked to it.`,
      );
    }

    const linkedClasses = await ClassModel.countDocuments({
      academicYearId: id,
      isDeleted: false,
    });
    if (linkedClasses > 0) {
      throw new ValidationError(
        `Cannot delete academic year: ${linkedClasses} class(es) are linked to it.`,
      );
    }

    await this.repository.softDelete(id, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      module: 'academic_year',
      action: 'DELETE',
      entityType: 'AcademicYear',
      entityId: id,
      schoolId: existing.schoolId?.toString() || user.schoolId,
      oldValue: {
        code: existing.code,
        name: existing.name,
        startDate: existing.startDate,
        endDate: existing.endDate,
      },
    });
  }
}
