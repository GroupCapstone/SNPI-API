import { Types } from 'mongoose';

import { PaymentModel } from '../payment/payment.model';
import {
  CashierShiftModel,
  DiscountPolicyModel,
  type ICashierShift,
  type IDiscountPolicy,
  type ICurrencyTotals,
} from './finance-operation.model';
import type { CreateDiscountPolicyDto, FinanceOperationFilters } from './finance-operation.types';

const pageValues = (filters: FinanceOperationFilters) => ({
  page: filters.page ?? 1,
  limit: filters.limit ?? 20,
});

export class FinanceOperationRepository {
  public async listPolicies(
    schoolId: string,
    filters: FinanceOperationFilters,
    branchIds?: string[],
  ) {
    const query: Record<string, unknown> = { schoolId, isDeleted: false };
    if (filters.branchId) query.branchId = filters.branchId;
    else if (branchIds) query.branchId = { $in: branchIds };
    if (filters.status) query.status = filters.status;
    const { page, limit } = pageValues(filters);
    const [data, total] = await Promise.all([
      DiscountPolicyModel.find(query)
        .populate('branchId', 'branchCode branchNameEn')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      DiscountPolicyModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  public createPolicy(
    schoolId: string,
    dto: CreateDiscountPolicyDto,
    userId: string,
  ): Promise<IDiscountPolicy> {
    return DiscountPolicyModel.create({
      ...dto,
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      effectiveFrom: new Date(dto.effectiveFrom),
      effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public findOpenShift(
    schoolId: string,
    branchId: string,
    cashierId: string,
  ): Promise<ICashierShift | null> {
    return CashierShiftModel.findOne({
      schoolId,
      branchId,
      cashierId,
      status: 'open',
      isDeleted: false,
    }).exec();
  }

  public async listShifts(
    schoolId: string,
    filters: FinanceOperationFilters,
    branchIds?: string[],
  ) {
    const query: Record<string, unknown> = { schoolId, isDeleted: false };
    if (filters.branchId) query.branchId = filters.branchId;
    else if (branchIds) query.branchId = { $in: branchIds };
    if (filters.status) query.status = filters.status;
    const { page, limit } = pageValues(filters);
    const [data, total] = await Promise.all([
      CashierShiftModel.find(query)
        .populate('branchId', 'branchCode branchNameEn')
        .sort({ openedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      CashierShiftModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  public findShift(id: string, schoolId: string): Promise<ICashierShift | null> {
    return CashierShiftModel.findOne({ _id: id, schoolId, isDeleted: false }).exec();
  }

  public createShift(data: Partial<ICashierShift>): Promise<ICashierShift> {
    return CashierShiftModel.create(data);
  }

  public async calculateCollections(
    shift: ICashierShift,
    closedAt: Date,
  ): Promise<{ cash: ICurrencyTotals; digital: ICurrencyTotals }> {
    const payments = await PaymentModel.find({
      schoolId: shift.schoolId,
      branchId: shift.branchId,
      createdBy: shift.cashierId,
      paymentDate: { $gte: shift.openedAt, $lte: closedAt },
      status: { $in: ['paid', 'partial'] },
      isDeleted: false,
    })
      .select('amountPaid currency paymentMethod')
      .lean();
    const cash = { USD: shift.openingCash.USD, KHR: shift.openingCash.KHR };
    const digital = { USD: 0, KHR: 0 };
    for (const payment of payments) {
      const target = payment.paymentMethod === 'cash' ? cash : digital;
      target[payment.currency] += payment.amountPaid;
    }
    return { cash, digital };
  }
}
