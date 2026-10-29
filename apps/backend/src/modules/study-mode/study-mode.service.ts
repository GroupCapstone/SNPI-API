import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ClassModel } from '../class/class.model';
import type { IStudyMode } from './study-mode.model';
import { StudyModeRepository } from './study-mode.repository';
import type {
  CreateStudyModeDto,
  StudyModeQueryFilters,
  UpdateStudyModeDto,
} from './study-mode.types';

export class StudyModeService {
  public constructor(private readonly repository = new StudyModeRepository()) {}

  public async getStudyModes(
    filters: StudyModeQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IStudyMode[]; total: number }> {
    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId });
  }

  public async getStudyModeById(id: string, user: AuthUser): Promise<IStudyMode> {
    const studyMode = await this.repository.findById(id, user.schoolId);
    if (!studyMode) {
      throw new NotFoundError(`Study mode with ID ${id} not found`);
    }
    return studyMode;
  }

  public async createStudyMode(dto: CreateStudyModeDto, user?: AuthUser): Promise<IStudyMode> {
    const existing = await this.repository.findByCode(dto.code, user?.schoolId);
    if (existing) {
      throw new ConflictError(`Study mode with code "${dto.code.toUpperCase()}" already exists`);
    }

    const created = await this.repository.create(
      { ...dto, ...(user?.schoolId ? { schoolId: user.schoolId } : {}) },
      user?.userId,
    );

    await AuditLogService.log({
      userId: user?.userId,
      schoolId: user?.schoolId,
      module: 'academic_setup',
      action: 'CREATE',
      entityType: 'StudyMode',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  public async updateStudyMode(
    id: string,
    dto: UpdateStudyModeDto,
    user: AuthUser,
  ): Promise<IStudyMode> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Study mode with ID ${id} not found`);
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError(`Study mode with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      module: 'academic_setup',
      action: 'UPDATE',
      entityType: 'StudyMode',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteStudyMode(id: string, user?: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user?.schoolId);
    if (!existing) {
      throw new NotFoundError(`Study mode with ID ${id} not found`);
    }

    // Check if any active classes reference this studyModeId
    const activeClasses = await ClassModel.countDocuments({
      studyModeId: existing._id,
      isDeleted: false,
    });
    if (activeClasses > 0) {
      throw new ValidationError(
        `Cannot delete Study Mode "${existing.nameEn}" because it is currently assigned to ${activeClasses} active class(es)`,
      );
    }

    await this.repository.softDelete(id, user?.userId, user?.schoolId);

    await AuditLogService.log({
      userId: user?.userId,
      schoolId: user?.schoolId,
      module: 'academic_setup',
      action: 'DELETE',
      entityType: 'StudyMode',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
