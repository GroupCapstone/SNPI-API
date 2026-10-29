import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';
import { EnrollmentModel } from '../enrollment/enrollment.model';

import type { IPayment } from './payment.model';
import { PaymentModel } from './payment.model';
import { outstandingPaymentAccounts } from './payment-account';
import type {
  CreatePaymentDto,
  DebtAgingBucket,
  DebtAgingResponse,
  MonthlyFinanceSummaryResponse,
  PaymentMethod,
  PaymentQueryFilters,
  PaymentType,
  UpdatePaymentDto,
} from './payment.types';

const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NAMES_KH = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
];

export class PaymentRepository {
  public async getAccountTotals(
    studentId: string,
    tuitionFeeId: string,
    academicYearId: string,
    billingPeriod?: { start: Date; end: Date },
    session?: ClientSession,
  ): Promise<{ totalPaid: number; totalDiscount: number }> {
    const match: Record<string, unknown> = {
      studentId: new Types.ObjectId(studentId),
      tuitionFeeId: new Types.ObjectId(tuitionFeeId),
      academicYearId: new Types.ObjectId(academicYearId),
      status: { $ne: 'voided' },
      isDeleted: false,
    };
    if (billingPeriod) {
      match.$or = [
        { dueDate: { $gte: billingPeriod.start, $lt: billingPeriod.end } },
        {
          dueDate: { $exists: false },
          paymentDate: { $gte: billingPeriod.start, $lt: billingPeriod.end },
        },
      ];
    }
    const aggregation = PaymentModel.aggregate<{
      totalPaid: number;
      totalDiscount: number;
    }>([
      {
        $match: {
          ...match,
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$amountPaid' },
          totalDiscount: { $sum: '$discountAmount' },
        },
      },
    ]);
    if (session) aggregation.session(session);
    const [totals] = await aggregation.exec();

    return {
      totalPaid: totals?.totalPaid ?? 0,
      totalDiscount: totals?.totalDiscount ?? 0,
    };
  }

  public async findWithFilters(
    filters: PaymentQueryFilters,
    branchFilter?: string[],
  ): Promise<{ data: IPayment[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    } else if (branchFilter) {
      query.branchId = { $in: branchFilter.map((b) => new Types.ObjectId(b)) };
    }

    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }

    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }

    if (filters.enrollmentId && Types.ObjectId.isValid(filters.enrollmentId)) {
      query.enrollmentId = new Types.ObjectId(filters.enrollmentId);
    }

    if (filters.studentId && Types.ObjectId.isValid(filters.studentId)) {
      query.studentId = new Types.ObjectId(filters.studentId);
    }

    if (filters.tuitionFeeId && Types.ObjectId.isValid(filters.tuitionFeeId)) {
      query.tuitionFeeId = new Types.ObjectId(filters.tuitionFeeId);
    }

    if (filters.status && (filters.status as string) !== 'all') {
      query.status = filters.status;
    }

    if (filters.paymentMethod && (filters.paymentMethod as string) !== 'all') {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters.paymentType && (filters.paymentType as string) !== 'all') {
      query.paymentType = filters.paymentType;
    }

    if (filters.billingYear) {
      query.billingYear = filters.billingYear;
    }

    if (filters.billingMonth) {
      query.billingMonth = filters.billingMonth;
    }

    if (filters.startDate || filters.endDate) {
      query.paymentDate = {};
      if (filters.startDate) {
        (query.paymentDate as Record<string, unknown>).$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        (query.paymentDate as Record<string, unknown>).$lte = new Date(filters.endDate);
      }
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ receiptNumber: searchRegex }, { transactionReference: searchRegex }];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PaymentModel.find(query)
        .populate(
          'studentId',
          'studentId firstName lastName khmerName phone email gender guardians',
        )
        .populate('tuitionFeeId', 'feeName feeCode amount currency billingCycle')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name')
        .sort({ paymentDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      PaymentModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IPayment | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return PaymentModel.findOne({ _id: new Types.ObjectId(id), isDeleted: false })
      .populate('studentId', 'studentId firstName lastName khmerName phone email gender guardians')
      .populate('tuitionFeeId', 'feeName feeCode amount currency billingCycle')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name')
      .exec();
  }

  public async findByReceiptNumber(receiptNumber: string): Promise<IPayment | null> {
    return PaymentModel.findOne({
      receiptNumber: receiptNumber.toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async create(
    dto: CreatePaymentDto,
    receiptNumber: string,
    balanceRemaining: number,
    status: 'paid' | 'partial' | 'pending',
    userId?: string,
    session?: ClientSession,
  ): Promise<IPayment> {
    const docData: Record<string, unknown> = {
      ...dto,
      receiptNumber,
      paymentNumber: receiptNumber,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      academicPeriodId:
        dto.academicPeriodId && Types.ObjectId.isValid(dto.academicPeriodId)
          ? new Types.ObjectId(dto.academicPeriodId)
          : undefined,
      enrollmentId:
        dto.enrollmentId && Types.ObjectId.isValid(dto.enrollmentId)
          ? new Types.ObjectId(dto.enrollmentId)
          : undefined,
      studentId: new Types.ObjectId(dto.studentId),
      tuitionFeeId: new Types.ObjectId(dto.tuitionFeeId),
      discountPolicyId:
        dto.discountPolicyId && Types.ObjectId.isValid(dto.discountPolicyId)
          ? new Types.ObjectId(dto.discountPolicyId)
          : undefined,
      balanceRemaining,
      status,
      paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    if (session) {
      const [created] = await PaymentModel.create([docData], { session });
      if (!created) throw new Error('Payment record was not created');
      return created;
    }
    return PaymentModel.create(docData);
  }

  public async update(
    id: string,
    dto: UpdatePaymentDto,
    userId?: string,
  ): Promise<IPayment | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      ...dto,
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }

    return PaymentModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updatePayload },
      { new: true },
    )
      .populate('studentId', 'studentId firstName lastName khmerName phone email gender guardians')
      .populate('tuitionFeeId', 'feeName feeCode amount currency billingCycle')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<IPayment | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;

    const updatePayload: Record<string, unknown> = {
      isDeleted: true,
      status: 'voided',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }

    return PaymentModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updatePayload },
      { new: true },
    ).exec();
  }

  public async void(
    id: string,
    reason: string,
    userId: string,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PaymentModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false, status: { $ne: 'voided' } },
      {
        $set: {
          status: 'voided',
          voidReason: reason,
          voidedAt: new Date(),
          voidedBy: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId,
          updatedBy: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
        },
      },
      { new: true, ...(session ? { session } : {}) },
    ).exec();
  }

  public async getMonthlyFinancialSummary(
    schoolId: string,
    branchId: string | undefined,
    year: number,
    month: number,
    branchFilter?: string[],
  ): Promise<MonthlyFinanceSummaryResponse> {
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    const match: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      isDeleted: false,
      status: { $ne: 'voided' },
      $or: [
        { billingYear: year, billingMonth: month },
        {
          $and: [
            { $or: [{ billingYear: { $exists: false } }, { billingYear: null }] },
            { paymentDate: { $gte: startOfMonth, $lt: endOfMonth } },
          ],
        },
      ],
    };

    if (branchId && Types.ObjectId.isValid(branchId)) {
      match.branchId = new Types.ObjectId(branchId);
    } else if (branchFilter) {
      match.branchId = { $in: branchFilter.map((b) => new Types.ObjectId(b)) };
    }

    const [result] = await PaymentModel.aggregate<{
      overall: Array<{
        totalRevenueUsd: number;
        totalRevenueKhr: number;
        totalTransactions: number;
        paidTransactions: number;
        partialTransactions: number;
      }>;
      byMethod: Array<{
        _id: PaymentMethod;
        totalUsd: number;
        totalKhr: number;
        count: number;
      }>;
      byType: Array<{
        _id: PaymentType;
        totalUsd: number;
        totalKhr: number;
        count: number;
      }>;
    }>([
      { $match: match },
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                totalRevenueUsd: {
                  $sum: { $cond: [{ $eq: ['$currency', 'USD'] }, '$amountPaid', 0] },
                },
                totalRevenueKhr: {
                  $sum: { $cond: [{ $eq: ['$currency', 'KHR'] }, '$amountPaid', 0] },
                },
                totalTransactions: { $sum: 1 },
                paidTransactions: {
                  $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] },
                },
                partialTransactions: {
                  $sum: { $cond: [{ $eq: ['$status', 'partial'] }, 1, 0] },
                },
              },
            },
          ],
          byMethod: [
            {
              $group: {
                _id: '$paymentMethod',
                totalUsd: {
                  $sum: { $cond: [{ $eq: ['$currency', 'USD'] }, '$amountPaid', 0] },
                },
                totalKhr: {
                  $sum: { $cond: [{ $eq: ['$currency', 'KHR'] }, '$amountPaid', 0] },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { totalUsd: -1, count: -1 } },
          ],
          byType: [
            {
              $group: {
                _id: { $ifNull: ['$paymentType', 'tuition_monthly'] },
                totalUsd: {
                  $sum: { $cond: [{ $eq: ['$currency', 'USD'] }, '$amountPaid', 0] },
                },
                totalKhr: {
                  $sum: { $cond: [{ $eq: ['$currency', 'KHR'] }, '$amountPaid', 0] },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { totalUsd: -1, count: -1 } },
          ],
        },
      },
    ]).exec();

    const overall = result?.overall?.[0] ?? {
      totalRevenueUsd: 0,
      totalRevenueKhr: 0,
      totalTransactions: 0,
      paidTransactions: 0,
      partialTransactions: 0,
    };

    const byMethod = (result?.byMethod ?? []).map((m) => ({
      method: m._id,
      totalUsd: m.totalUsd,
      totalKhr: m.totalKhr,
      count: m.count,
    }));

    const byType = (result?.byType ?? []).map((t) => ({
      type: t._id,
      totalUsd: t.totalUsd,
      totalKhr: t.totalKhr,
      count: t.count,
    }));

    return {
      year,
      month,
      monthLabelEn: MONTH_NAMES_EN[month - 1] ?? `Month ${month}`,
      monthLabelKh: MONTH_NAMES_KH[month - 1] ?? `ខែ ${month}`,
      branchId,
      totalRevenueUsd: overall.totalRevenueUsd,
      totalRevenueKhr: overall.totalRevenueKhr,
      totalTransactions: overall.totalTransactions,
      paidTransactions: overall.paidTransactions,
      partialTransactions: overall.partialTransactions,
      byMethod,
      byType,
    };
  }

  public async getDebtAgingReport(
    schoolId: string,
    branchId?: string,
    asOfDate: Date = new Date(),
    branchFilter?: string[],
  ): Promise<DebtAgingResponse> {
    const match: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      isDeleted: false,
      status: { $ne: 'voided' },
    };

    if (branchId && Types.ObjectId.isValid(branchId)) {
      match.branchId = new Types.ObjectId(branchId);
    } else if (branchFilter) {
      match.branchId = { $in: branchFilter.map((b) => new Types.ObjectId(b)) };
    }

    const receipts = await PaymentModel.find(match)
      .populate('studentId', 'studentId firstName lastName khmerName phone guardians')
      .populate('tuitionFeeId', 'feeName feeCode amount currency billingCycle')
      .populate('branchId', 'branchCode branchNameEn')
      .sort({ dueDate: 1, paymentDate: 1 })
      .lean()
      .exec();

    const payments = outstandingPaymentAccounts(receipts);

    const studentIds = payments
      .map((p) => {
        const s = p.studentId as unknown as { _id?: Types.ObjectId };
        return s?._id;
      })
      .filter((id): id is Types.ObjectId => Boolean(id));

    const enrollments = await EnrollmentModel.find({
      studentId: { $in: studentIds },
      isDeleted: false,
      status: { $in: ['enrolled', 'active'] },
    })
      .populate('classId', 'classCode className')
      .lean()
      .exec();

    const classMap = new Map<string, string>();
    for (const enr of enrollments) {
      const sId = String(enr.studentId);
      if (enr.classId && typeof enr.classId === 'object' && 'classCode' in enr.classId) {
        classMap.set(sId, (enr.classId as { classCode: string }).classCode);
      }
    }

    const items: DebtAgingBucket[] = [];
    const summary = {
      totalUnpaidUsd: 0,
      totalUnpaidKhr: 0,
      currentDueUsd: 0,
      currentDueKhr: 0,
      overdue30Usd: 0,
      overdue30Khr: 0,
      overdue60Usd: 0,
      overdue60Khr: 0,
      overdue90PlusUsd: 0,
      overdue90PlusKhr: 0,
      totalStudentsInDebt: 0,
    };

    const uniqueStudentIds = new Set<string>();

    for (const p of payments) {
      const student = p.studentId as unknown as {
        _id: Types.ObjectId;
        studentId: string;
        firstName: string;
        lastName: string;
        khmerName?: string;
        phone?: string;
        guardians?: Array<{ phone?: string; isPrimary?: boolean }>;
      } | null;

      const branch = p.branchId as unknown as { branchCode: string } | null;
      const fee = p.tuitionFeeId as unknown as { feeName: string; currency: 'USD' | 'KHR' } | null;

      if (!student || !fee) continue;

      const sId = String(student._id);
      uniqueStudentIds.add(sId);

      const effectiveDueDate = p.dueDate ? new Date(p.dueDate) : new Date(p.paymentDate);
      const diffTime = asOfDate.getTime() - effectiveDueDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const overdueDays = Math.max(0, diffDays);

      let agingCategory: 'current_due' | 'overdue_30' | 'overdue_60' | 'overdue_90_plus';
      if (overdueDays <= 0) {
        agingCategory = 'current_due';
      } else if (overdueDays <= 30) {
        agingCategory = 'overdue_30';
      } else if (overdueDays <= 60) {
        agingCategory = 'overdue_60';
      } else {
        agingCategory = 'overdue_90_plus';
      }

      const parentPhone =
        student.guardians?.find((g) => g.isPrimary)?.phone ??
        student.guardians?.[0]?.phone ??
        student.phone;

      const item: DebtAgingBucket = {
        studentId: sId,
        studentCode: student.studentId,
        studentNameEn: `${student.firstName} ${student.lastName}`.trim(),
        studentNameKh: student.khmerName,
        branchCode: branch?.branchCode || 'BR',
        classCode: classMap.get(sId) || undefined,
        feeName: fee.feeName,
        currency: (p.currency as 'USD' | 'KHR') || fee.currency || 'USD',
        unpaidBalance: p.balanceRemaining,
        dueDate: p.dueDate ? new Date(p.dueDate).toISOString().slice(0, 10) : undefined,
        overdueDays,
        agingCategory,
        parentPhone,
      };

      items.push(item);

      if (item.currency === 'USD') {
        summary.totalUnpaidUsd += item.unpaidBalance;
        if (agingCategory === 'current_due') summary.currentDueUsd += item.unpaidBalance;
        else if (agingCategory === 'overdue_30') summary.overdue30Usd += item.unpaidBalance;
        else if (agingCategory === 'overdue_60') summary.overdue60Usd += item.unpaidBalance;
        else summary.overdue90PlusUsd += item.unpaidBalance;
      } else {
        summary.totalUnpaidKhr += item.unpaidBalance;
        if (agingCategory === 'current_due') summary.currentDueKhr += item.unpaidBalance;
        else if (agingCategory === 'overdue_30') summary.overdue30Khr += item.unpaidBalance;
        else if (agingCategory === 'overdue_60') summary.overdue60Khr += item.unpaidBalance;
        else summary.overdue90PlusKhr += item.unpaidBalance;
      }
    }

    summary.totalStudentsInDebt = uniqueStudentIds.size;

    return {
      asOfDate: asOfDate.toISOString().slice(0, 10),
      branchId,
      summary,
      items,
    };
  }
}
