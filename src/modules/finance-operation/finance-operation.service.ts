import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { ConflictError, ForbiddenError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { SequenceService } from '../sequence/sequence.service';
import type { ICashierShift, IDiscountPolicy } from './finance-operation.model';
import { FinanceOperationRepository } from './finance-operation.repository';
import type {
  CloseCashierShiftDto,
  CreateDiscountPolicyDto,
  FinanceOperationFilters,
  OpenCashierShiftDto,
} from './finance-operation.types';

export class FinanceOperationService {
  public constructor(private readonly repository = new FinanceOperationRepository()) {}

  private scope(filters: FinanceOperationFilters, user: AuthUser) {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to finance operations in this branch');
    }
    return user.branchAccess === 'all' ? undefined : user.branchAccess;
  }

  public listPolicies(filters: FinanceOperationFilters, user: AuthUser) {
    return this.repository.listPolicies(user.schoolId, filters, this.scope(filters, user));
  }

  public async createPolicy(
    dto: CreateDiscountPolicyDto,
    user: AuthUser,
  ): Promise<IDiscountPolicy> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId))
      throw new ForbiddenError('Branch access denied');
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: user.schoolId,
      isDeleted: false,
    }).lean();
    if (!branch) throw new NotFoundError('Finance policy branch not found');
    const created = await this.repository.createPolicy(user.schoolId, dto, user.userId);
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'finance',
      action: 'CREATE',
      entityType: 'DiscountPolicy',
      entityId: String(created._id),
      newValue: created.toObject(),
    });
    return created;
  }

  public listShifts(filters: FinanceOperationFilters, user: AuthUser) {
    return this.repository.listShifts(user.schoolId, filters, this.scope(filters, user));
  }

  public async openShift(dto: OpenCashierShiftDto, user: AuthUser): Promise<ICashierShift> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId))
      throw new ForbiddenError('Branch access denied');
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: user.schoolId,
      isDeleted: false,
    }).lean();
    if (!branch) throw new NotFoundError('Cashier branch not found');
    if (await this.repository.findOpenShift(user.schoolId, dto.branchId, user.userId)) {
      throw new ConflictError('Cashier already has an open shift in this branch');
    }
    const shiftNumber = await SequenceService.getNextSequence('CASHIER_SHIFT', 'CSH', 8);
    const shift = await this.repository.createShift({
      shiftNumber,
      schoolId: new Types.ObjectId(user.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      cashierId: user.userId,
      openedAt: new Date(),
      openingCash: dto.openingCash,
      notes: dto.notes,
      status: 'open',
      isDeleted: false,
    });
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'finance',
      action: 'CREATE',
      entityType: 'CashierShift',
      entityId: String(shift._id),
      newValue: shift.toObject(),
    });
    return shift;
  }

  public async closeShift(
    id: string,
    dto: CloseCashierShiftDto,
    user: AuthUser,
  ): Promise<ICashierShift> {
    const shift = await this.repository.findShift(id, user.schoolId);
    if (!shift) throw new NotFoundError('Cashier shift not found');
    if (!checkBranchAccess(user.branchAccess, String(shift.branchId)))
      throw new ForbiddenError('Branch access denied');
    if (String(shift.cashierId) !== user.userId)
      throw new ForbiddenError('Only the opening cashier can submit this shift');
    if (shift.status !== 'open') throw new ConflictError('Only open shifts can be submitted');
    const closedAt = new Date();
    const expected = await this.repository.calculateCollections(shift, closedAt);
    shift.closedAt = closedAt;
    shift.expectedCash = expected.cash;
    shift.expectedDigital = expected.digital;
    shift.declaredCash = dto.declaredCash;
    shift.declaredDigital = dto.declaredDigital;
    shift.cashVariance = {
      USD: dto.declaredCash.USD - expected.cash.USD,
      KHR: dto.declaredCash.KHR - expected.cash.KHR,
    };
    shift.digitalVariance = {
      USD: dto.declaredDigital.USD - expected.digital.USD,
      KHR: dto.declaredDigital.KHR - expected.digital.KHR,
    };
    shift.notes = dto.notes ?? shift.notes;
    shift.status = 'submitted';
    await shift.save();
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: String(shift.branchId),
      module: 'finance',
      action: 'UPDATE',
      entityType: 'CashierShift',
      entityId: id,
      newValue: shift.toObject(),
      required: true,
    });
    return shift;
  }

  public async approveShift(id: string, user: AuthUser): Promise<ICashierShift> {
    const shift = await this.repository.findShift(id, user.schoolId);
    if (!shift) throw new NotFoundError('Cashier shift not found');
    if (!checkBranchAccess(user.branchAccess, String(shift.branchId)))
      throw new ForbiddenError('Branch access denied');
    if (shift.status !== 'submitted')
      throw new ConflictError('Only submitted shifts can be approved');
    shift.status = 'approved';
    shift.approvedAt = new Date();
    shift.approvedBy = user.userId;
    await shift.save();
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: String(shift.branchId),
      module: 'finance',
      action: 'UPDATE',
      entityType: 'CashierShift',
      entityId: id,
      newValue: { status: 'approved', approvedAt: shift.approvedAt },
      required: true,
    });
    return shift;
  }
}
