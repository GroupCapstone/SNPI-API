import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassScheduleModel } from '../class-schedule/class-schedule.model';
import type { ITimeSlot } from './time-slot.model';
import { TimeSlotRepository } from './time-slot.repository';
import type { CreateTimeSlotDto, TimeSlotQueryFilters, UpdateTimeSlotDto } from './time-slot.types';

export class TimeSlotService {
  public constructor(private readonly repository = new TimeSlotRepository()) {}

  public async getTimeSlots(
    filters: TimeSlotQueryFilters,
    user: AuthUser,
  ): Promise<{ data: ITimeSlot[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to time slots in this branch');
    }
    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId });
  }

  public async getTimeSlotById(id: string, user: AuthUser): Promise<ITimeSlot> {
    const timeSlot = await this.repository.findById(id, user.schoolId);
    if (!timeSlot) {
      throw new NotFoundError(`Time slot with ID ${id} not found`);
    }
    if (timeSlot.branchId && !checkBranchAccess(user.branchAccess, String(timeSlot.branchId))) {
      throw new ForbiddenError('You do not have access to this time slot');
    }
    return timeSlot;
  }

  public async createTimeSlot(dto: CreateTimeSlotDto, user?: AuthUser): Promise<ITimeSlot> {
    if (dto.branchId && user && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create a time slot in this branch');
    }
    if (dto.branchId && user?.schoolId) {
      const branch = await BranchModel.exists({
        _id: dto.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!branch) throw new ValidationError('Selected branch does not belong to your school');
    }
    const existing = await this.repository.findByCode(dto.code, user?.schoolId, dto.branchId);
    if (existing) {
      throw new ConflictError(`Time slot with code "${dto.code.toUpperCase()}" already exists`);
    }

    const created = await this.repository.create(
      { ...dto, ...(user?.schoolId ? { schoolId: user.schoolId } : {}) },
      user?.userId,
    );

    await AuditLogService.log({
      userId: user?.userId,
      schoolId: user?.schoolId,
      branchId: dto.branchId,
      module: 'academic_setup',
      action: 'CREATE',
      entityType: 'TimeSlot',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    return created;
  }

  public async updateTimeSlot(
    id: string,
    dto: UpdateTimeSlotDto,
    user: AuthUser,
  ): Promise<ITimeSlot> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Time slot with ID ${id} not found`);
    }
    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to update this time slot');
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError(`Time slot with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId ? String(existing.branchId) : undefined,
      module: 'academic_setup',
      action: 'UPDATE',
      entityType: 'TimeSlot',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteTimeSlot(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Time slot with ID ${id} not found`);
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to delete this time slot');
    }
    const scheduleCount = await ClassScheduleModel.countDocuments({
      timeSlotId: existing._id,
      isDeleted: false,
    });
    if (scheduleCount > 0) {
      throw new ValidationError(
        `Cannot delete Time Slot because it is used by ${scheduleCount} active schedule(s)`,
      );
    }

    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId ? String(existing.branchId) : undefined,
      module: 'academic_setup',
      action: 'DELETE',
      entityType: 'TimeSlot',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
