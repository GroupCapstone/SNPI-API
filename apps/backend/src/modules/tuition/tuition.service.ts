import { Types } from 'mongoose';

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
import { LevelModel } from '../level/level.model';
import { PaymentModel } from '../payment/payment.model';
import { ProgramModel } from '../program/program.model';
import type { ITuitionFee } from './tuition-fee.model';
import { TuitionRepository } from './tuition.repository';
import type {
  CreateTuitionFeeDto,
  TuitionFeeQueryFilters,
  UpdateTuitionFeeDto,
} from './tuition.types';

export class TuitionService {
  public constructor(private readonly repository = new TuitionRepository()) {}

  public async getTuitionFees(
    filters: TuitionFeeQueryFilters,
    user: AuthUser,
  ): Promise<{ data: ITuitionFee[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to tuition fees in the requested branch');
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? undefined
        : Array.isArray(user.branchAccess)
          ? user.branchAccess
          : undefined;

    return this.repository.findWithFilters(filters, branchFilter);
  }

  public async getTuitionFeeById(id: string, user: AuthUser): Promise<ITuitionFee> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }

    const fee = await this.repository.findById(id);
    if (!fee) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(fee.branchId))) {
      throw new ForbiddenError('You do not have access to this tuition fee');
    }
    return fee;
  }

  public async createTuitionFee(dto: CreateTuitionFeeDto, user: AuthUser): Promise<ITuitionFee> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create tuition fees in this branch');
    }
    const [program, level, branch] = await Promise.all([
      ProgramModel.findOne({ _id: new Types.ObjectId(dto.programId), isDeleted: false }).exec(),
      LevelModel.findOne({ _id: new Types.ObjectId(dto.levelId), isDeleted: false }).exec(),
      BranchModel.findOne({ _id: new Types.ObjectId(dto.branchId), isDeleted: false }).exec(),
    ]);

    if (!program) throw new NotFoundError('Selected program not found');
    if (!level) throw new NotFoundError('Selected level not found');
    if (!branch) throw new NotFoundError('Selected branch not found');

    if (String(branch.schoolId) !== dto.schoolId) {
      throw new ValidationError('Selected branch does not belong to the submitted school');
    }
    if (String(level.programId) !== dto.programId) {
      throw new ValidationError('Selected level does not belong to the selected program');
    }

    const duplicate = await this.repository.findByCode(
      dto.branchId,
      dto.academicYearId,
      dto.feeCode,
    );
    if (duplicate) {
      throw new ConflictError(
        `Tuition fee code "${dto.feeCode.toUpperCase()}" already exists for this branch and academic year`,
      );
    }

    const fee = await this.repository.create(dto, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(fee.schoolId),
      branchId: String(fee.branchId),
      module: 'tuition',
      action: 'CREATE',
      entityType: 'TuitionFee',
      entityId: String(fee._id),
      newValue: fee.toObject ? fee.toObject() : (fee as unknown as Record<string, unknown>),
    });

    return fee;
  }

  public async updateTuitionFee(
    id: string,
    dto: UpdateTuitionFeeDto,
    user: AuthUser,
  ): Promise<ITuitionFee> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to update this tuition fee');
    }

    if (dto.feeCode) {
      const duplicate = await this.repository.findByCode(
        String(existing.branchId._id ?? existing.branchId),
        String(existing.academicYearId._id ?? existing.academicYearId),
        dto.feeCode,
        id,
      );
      if (duplicate) {
        throw new ConflictError(
          `Tuition fee code "${dto.feeCode.toUpperCase()}" is already in use`,
        );
      }
    }

    const updated = await this.repository.update(id, dto, user.userId);
    if (!updated) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(updated.schoolId),
      branchId: String(updated.branchId),
      module: 'tuition',
      action: 'UPDATE',
      entityType: 'TuitionFee',
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

  public async deleteTuitionFee(id: string, user: AuthUser): Promise<void> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tuition fee with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to delete this tuition fee');
    }

    const paymentCount = await PaymentModel.countDocuments({
      tuitionFeeId: existing._id,
      isDeleted: false,
    });
    if (paymentCount > 0) {
      throw new ValidationError(
        `Cannot delete tuition fee "${existing.feeName}" because ${paymentCount} payment record(s) reference it. Deactivate the fee instead.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: String(existing.branchId),
      module: 'tuition',
      action: 'DELETE',
      entityType: 'TuitionFee',
      entityId: String(existing._id),
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }
}
