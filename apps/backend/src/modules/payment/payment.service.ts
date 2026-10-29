import { Types } from 'mongoose';
import type { ClientSession } from 'mongoose';

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
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { DiscountPolicyModel } from '../finance-operation/finance-operation.model';
import { SequenceService } from '../sequence/sequence.service';
import { StudentModel } from '../student/student.model';
import { TermResultModel } from '../term-result/term-result.model';
import { TuitionFeeModel } from '../tuition/tuition-fee.model';
import { PaymentModel } from './payment.model';
import type { IPayment } from './payment.model';
import { PaymentRepository } from './payment.repository';
import { PaymentPlanRepository } from '../payment-plan/payment-plan.repository';
import type {
  CreatePaymentDto,
  DebtAgingResponse,
  GenerateMonthlyInvoicesDto,
  GenerateMonthlyInvoicesResponse,
  MonthlyFinanceSummaryResponse,
  PaymentQueryFilters,
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

export class PaymentService {
  public constructor(private readonly repository = new PaymentRepository()) {}

  public async getPayments(
    filters: PaymentQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IPayment[]; total: number }> {
    if (
      filters.branchId &&
      filters.branchId !== 'all' &&
      !checkBranchAccess(user.branchAccess, filters.branchId)
    ) {
      throw new ForbiddenError('You do not have access to payments in the requested branch');
    }

    const branchFilter =
      user.branchAccess === 'all'
        ? undefined
        : Array.isArray(user.branchAccess)
          ? user.branchAccess
          : [];

    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId }, branchFilter);
  }

  public async getMonthlySummary(
    year: number,
    month: number,
    branchId: string | undefined,
    user: AuthUser,
  ): Promise<MonthlyFinanceSummaryResponse> {
    if (branchId && branchId !== 'all' && !checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError(
        'You do not have access to financial summaries for the requested branch',
      );
    }

    const branchFilter =
      user.branchAccess === 'all'
        ? undefined
        : Array.isArray(user.branchAccess)
          ? user.branchAccess
          : undefined;

    return this.repository.getMonthlyFinancialSummary(
      user.schoolId,
      branchId && branchId !== 'all' ? branchId : undefined,
      year,
      month,
      branchFilter,
    );
  }

  public async getDebtAging(
    branchId: string | undefined,
    asOfDateStr: string | undefined,
    user: AuthUser,
  ): Promise<DebtAgingResponse> {
    if (branchId && branchId !== 'all' && !checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError(
        'You do not have access to debt aging reports for the requested branch',
      );
    }

    const branchFilter =
      user.branchAccess === 'all'
        ? undefined
        : Array.isArray(user.branchAccess)
          ? user.branchAccess
          : undefined;

    const asOfDate = asOfDateStr ? new Date(asOfDateStr) : new Date();

    return this.repository.getDebtAgingReport(
      user.schoolId,
      branchId && branchId !== 'all' ? branchId : undefined,
      asOfDate,
      branchFilter,
    );
  }

  public async getPaymentById(id: string, user: AuthUser): Promise<IPayment> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }

    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }
    const branchId =
      typeof payment.branchId === 'object' && payment.branchId !== null && '_id' in payment.branchId
        ? String(payment.branchId._id)
        : String(payment.branchId);
    if (
      String(payment.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, branchId)
    ) {
      throw new ForbiddenError('You do not have access to this payment receipt');
    }
    return payment;
  }

  public async generateMonthlyInvoices(
    dto: GenerateMonthlyInvoicesDto,
    user: AuthUser,
  ): Promise<GenerateMonthlyInvoicesResponse> {
    if (dto.schoolId !== user.schoolId || !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to generate invoices in this branch');
    }
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: user.schoolId,
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!branch) throw new NotFoundError('Invoice branch not found');
    const enrollments = await EnrollmentModel.find({
      schoolId: new Types.ObjectId(user.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    })
      .lean()
      .exec();
    const dueDate = new Date(Date.UTC(dto.year, dto.month - 1, dto.dueDay ?? 10));
    return runInTransaction(async (session) => {
      const result: GenerateMonthlyInvoicesResponse = {
        year: dto.year,
        month: dto.month,
        created: 0,
        skipped: 0,
        invoices: [],
      };
      for (const enrollment of enrollments) {
        const fee = await TuitionFeeModel.findOne({
          schoolId: new Types.ObjectId(user.schoolId),
          branchId: new Types.ObjectId(dto.branchId),
          academicYearId: new Types.ObjectId(dto.academicYearId),
          programId: enrollment.programId,
          levelId: enrollment.levelId,
          billingCycle: 'monthly',
          status: 'active',
          isDeleted: false,
        })
          .session(session ?? null)
          .lean()
          .exec();
        if (!fee) continue;
        const existing = await PaymentModel.findOne({
          invoiceKey: `${enrollment._id}:${fee._id}:${dto.year}-${dto.month}`,
          isDeleted: false,
        })
          .session(session ?? null)
          .lean()
          .exec();
        if (existing) {
          result.skipped++;
          continue;
        }
        const receiptNumber = await SequenceService.getNextSequence('PAY', 'PAY', 6, session);
        const payment = await this.repository.create(
          {
            schoolId: dto.schoolId,
            branchId: dto.branchId,
            academicYearId: dto.academicYearId,
            academicPeriodId: enrollment.academicPeriodId
              ? String(enrollment.academicPeriodId)
              : undefined,
            enrollmentId: String(enrollment._id),
            studentId: String(enrollment.studentId),
            tuitionFeeId: String(fee._id),
            amountDue: fee.amount,
            amountPaid: 0,
            currency: fee.currency,
            paymentMethod: 'cash',
            paymentDate: dueDate.toISOString(),
            dueDate: dueDate.toISOString(),
            billingYear: dto.year,
            billingMonth: dto.month,
            coveragePeriodLabel: `${MONTH_NAMES_EN[dto.month - 1]} ${dto.year}`,
            invoiceKey: `${enrollment._id}:${fee._id}:${dto.year}-${dto.month}`,
            paymentType: 'tuition_monthly',
          },
          receiptNumber,
          fee.amount,
          'pending',
          user.userId,
          session,
        );
        result.created++;
        result.invoices.push(String(payment._id));
        await AuditLogService.log({
          userId: user.userId,
          schoolId: dto.schoolId,
          branchId: dto.branchId,
          module: 'payment',
          action: 'CREATE',
          entityType: 'PaymentInvoice',
          entityId: String(payment._id),
          newValue: payment.toObject(),
          session,
          required: true,
        });
      }
      return result;
    });
  }

  public async createPayment(
    dto: CreatePaymentDto,
    user: AuthUser,
    transactionSession?: ClientSession,
  ): Promise<IPayment> {
    if (dto.schoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to record payments for this school');
    }
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to record payments in this branch');
    }

    const [student, tuitionFee, branch] = await Promise.all([
      StudentModel.findOne({ _id: new Types.ObjectId(dto.studentId), isDeleted: false }).exec(),
      TuitionFeeModel.findOne({
        _id: new Types.ObjectId(dto.tuitionFeeId),
        isDeleted: false,
      }).exec(),
      BranchModel.findOne({ _id: new Types.ObjectId(dto.branchId), isDeleted: false }).exec(),
    ]);

    if (!student) throw new NotFoundError('Selected student not found');
    if (!tuitionFee) throw new NotFoundError('Selected tuition fee structure not found');
    if (!branch) throw new NotFoundError('Selected branch not found');

    const relationships = [
      [String(branch.schoolId), dto.schoolId, 'Branch does not belong to the selected school'],
      [String(student.schoolId), dto.schoolId, 'Student does not belong to the selected school'],
      [String(student.branchId), dto.branchId, 'Student does not belong to the selected branch'],
      [String(tuitionFee.schoolId), dto.schoolId, 'Tuition fee does not belong to the school'],
      [String(tuitionFee.branchId), dto.branchId, 'Tuition fee does not belong to the branch'],
      [
        String(tuitionFee.academicYearId),
        dto.academicYearId,
        'Tuition fee does not belong to the academic year',
      ],
    ] as const;

    for (const [actual, expected, message] of relationships) {
      if (actual !== expected) {
        throw new ValidationError(message);
      }
    }

    if (
      dto.amountDue !== tuitionFee.amount ||
      (dto.currency ?? tuitionFee.currency) !== tuitionFee.currency
    ) {
      throw new ValidationError(
        'Payment amount and currency must match the selected tuition fee structure',
      );
    }

    if (dto.amountPaid <= 0) {
      throw new ValidationError('Amount paid must be greater than zero');
    }

    if (tuitionFee.billingCycle === 'monthly' && !dto.dueDate) {
      throw new ValidationError('Billing month is required for monthly tuition payments');
    }

    const requestedDiscount = dto.discountAmount ?? 0;
    if (requestedDiscount > 0 || dto.discountPolicyId) {
      const canDiscount =
        checkUserPermission(user.permissions, 'finance.discount.apply.own_branch') ||
        checkUserPermission(user.permissions, 'finance.discount.apply.all_branches');
      if (!canDiscount) {
        throw new ForbiddenError('Tuition discount permission is required');
      }
    }
    if (dto.discountPolicyId) {
      const policy = await DiscountPolicyModel.findOne({
        _id: new Types.ObjectId(dto.discountPolicyId),
        schoolId: new Types.ObjectId(user.schoolId),
        branchId: new Types.ObjectId(dto.branchId),
        status: 'active',
        isDeleted: false,
        effectiveFrom: { $lte: new Date() },
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: { $gte: new Date() } },
        ],
      })
        .lean()
        .exec();
      if (!policy)
        throw new ValidationError('Selected discount policy is not active for this branch');
      await this.assertDiscountEligibility(policy, student, dto.dueDate);
      const calculated =
        policy.calculationType === 'percentage'
          ? (tuitionFee.amount * policy.value) / 100
          : policy.value;
      dto = {
        ...dto,
        discountAmount: Math.min(
          tuitionFee.amount,
          policy.maximumAmount === undefined
            ? calculated
            : Math.min(calculated, policy.maximumAmount),
        ),
        discountReason: dto.discountReason ?? `${policy.name} (${policy.code})`,
      };
    } else if (requestedDiscount > 0 && !dto.discountReason) {
      throw new ValidationError('A reason is required for a manual tuition discount');
    }

    const dueDate = new Date(dto.dueDate ?? dto.paymentDate ?? new Date());
    const billingYear = dto.billingYear ?? dueDate.getUTCFullYear();
    const billingMonth = dto.billingMonth ?? dueDate.getUTCMonth() + 1;
    const coveragePeriodLabel =
      dto.coveragePeriodLabel ?? `${MONTH_NAMES_EN[billingMonth - 1]} ${billingYear}`;
    const paymentType = dto.paymentType ?? 'tuition_monthly';

    const billingPeriod =
      tuitionFee.billingCycle === 'monthly'
        ? {
            start: new Date(Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), 1)),
            end: new Date(Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth() + 1, 1)),
          }
        : undefined;

    const recordPayment = async (session: ClientSession | undefined) => {
      const receiptNumber = await SequenceService.getNextSequence('PAY', 'PAY', 6, session);
      const discount = dto.discountAmount ?? 0;
      const accountTotals = await this.repository.getAccountTotals(
        dto.studentId,
        dto.tuitionFeeId,
        dto.academicYearId,
        billingPeriod,
        session,
      );
      const cumulativeDiscount = Math.round((accountTotals.totalDiscount + discount) * 100) / 100;
      const netPayable = Math.round((tuitionFee.amount - cumulativeDiscount) * 100) / 100;
      const cumulativePaid = Math.round((accountTotals.totalPaid + dto.amountPaid) * 100) / 100;

      if (netPayable < 0) {
        throw new ValidationError('Cumulative discount cannot exceed the tuition amount');
      }
      if (cumulativePaid > netPayable) {
        throw new ValidationError(
          `Payment exceeds the remaining balance of ${Math.max(0, netPayable - accountTotals.totalPaid)}`,
        );
      }

      const balanceRemaining = Math.round((netPayable - cumulativePaid) * 100) / 100;
      const status: 'paid' | 'partial' | 'pending' =
        balanceRemaining === 0 ? 'paid' : cumulativePaid > 0 ? 'partial' : 'pending';
      const payment = await this.repository.create(
        {
          ...dto,
          dueDate: dto.dueDate ?? dueDate.toISOString().slice(0, 10),
          billingYear,
          billingMonth,
          coveragePeriodLabel,
          paymentType,
          amountDue: tuitionFee.amount,
          currency: tuitionFee.currency,
        },
        receiptNumber,
        balanceRemaining,
        status,
        user.userId,
        session,
      );

      await AuditLogService.log({
        userId: user.userId,
        schoolId: String(payment.schoolId),
        branchId: String(payment.branchId),
        module: 'payment',
        action: 'CREATE',
        entityType: 'PaymentReceipt',
        entityId: String(payment._id),
        newValue: payment.toObject
          ? payment.toObject()
          : (payment as unknown as Record<string, unknown>),
        session,
        required: true,
      });

      return payment;
    };
    return transactionSession ? recordPayment(transactionSession) : runInTransaction(recordPayment);
  }

  public async updatePayment(id: string, dto: UpdatePaymentDto, user: AuthUser): Promise<IPayment> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }
    const existingBranchId =
      typeof existing.branchId === 'object' &&
      existing.branchId !== null &&
      '_id' in existing.branchId
        ? String(existing.branchId._id)
        : String(existing.branchId);
    if (
      String(existing.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, existingBranchId)
    ) {
      throw new ForbiddenError('You do not have access to update this payment receipt');
    }
    if (existing.status === 'voided') {
      throw new ValidationError('Voided payments are immutable');
    }
    if (
      dto.status &&
      ['paid', 'partial'].includes(existing.status) &&
      dto.status !== existing.status
    ) {
      throw new ValidationError(
        'Confirmed payment status cannot be rewritten; use the audited void workflow',
      );
    }

    const updated = await this.repository.update(id, dto, user.userId);
    if (!updated) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(updated.schoolId),
      branchId: String(updated.branchId),
      module: 'payment',
      action: 'UPDATE',
      entityType: 'PaymentReceipt',
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

  public async deletePayment(id: string, user: AuthUser): Promise<void> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Payment with ID ${id} not found`);
    }
    const existingBranchId =
      typeof existing.branchId === 'object' &&
      existing.branchId !== null &&
      '_id' in existing.branchId
        ? String(existing.branchId._id)
        : String(existing.branchId);
    if (
      String(existing.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, existingBranchId)
    ) {
      throw new ForbiddenError('You do not have access to void this payment receipt');
    }

    if (existing.status !== 'pending') {
      throw new ValidationError(
        'Confirmed payments cannot be deleted; use the audited void workflow instead',
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: String(existing.branchId),
      module: 'payment',
      action: 'DELETE',
      entityType: 'PaymentReceipt',
      entityId: String(existing._id),
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }

  public async voidPayment(id: string, reason: string, user: AuthUser): Promise<IPayment> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundError('Payment not found');
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Payment not found');
    const branchId =
      typeof existing.branchId === 'object' &&
      existing.branchId !== null &&
      '_id' in existing.branchId
        ? String(existing.branchId._id)
        : String(existing.branchId);
    if (
      String(existing.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, branchId)
    ) {
      throw new ForbiddenError('You do not have access to void this payment receipt');
    }
    if (existing.status === 'voided') throw new ValidationError('Payment is already voided');
    return runInTransaction(async (session) => {
      const voided = await this.repository.void(id, reason, user.userId, session);
      if (!voided) throw new ConflictError('Payment changed while the void was being processed');
      if (existing.paymentPlanId && existing.installmentSequence) {
        const reopened = await new PaymentPlanRepository().reverseInstallment(
          String(existing.paymentPlanId),
          existing.installmentSequence,
          id,
          user.userId,
          session,
        );
        if (!reopened)
          throw new ConflictError('Payment plan changed while the void was being processed');
      }
      await AuditLogService.log({
        userId: user.userId,
        schoolId: String(existing.schoolId),
        branchId,
        module: 'payment',
        action: 'UPDATE',
        entityType: 'PaymentReceipt',
        entityId: String(existing._id),
        reason,
        oldValue: { status: existing.status },
        newValue: { status: 'voided', voidReason: reason, voidedAt: voided.voidedAt },
        session,
        required: true,
      });
      return voided;
    });
  }

  private async assertDiscountEligibility(
    policy: {
      type: string;
      minimumGpa?: number;
      minimumSiblingCount?: number;
      paymentDaysBeforeDue?: number;
      branchId: Types.ObjectId;
    },
    student: { _id: Types.ObjectId; guardians?: Array<{ phone?: string; isPrimary?: boolean }> },
    dueDate?: string,
  ): Promise<void> {
    if (policy.type === 'merit') {
      const latest = await TermResultModel.findOne({
        studentId: student._id,
        branchId: policy.branchId,
        workflowStatus: 'FINALIZED',
        isDeleted: false,
      })
        .sort({ finalizedAt: -1 })
        .select('gpa')
        .lean();
      if (!latest || latest.gpa < (policy.minimumGpa ?? 3)) {
        throw new ValidationError(
          `Merit discount requires GPA of at least ${policy.minimumGpa ?? 3}`,
        );
      }
    }
    if (policy.type === 'sibling') {
      const phone =
        student.guardians?.find((guardian) => guardian.isPrimary)?.phone ??
        student.guardians?.[0]?.phone;
      if (!phone) throw new ValidationError('Sibling discount requires a shared guardian phone');
      const siblingCount = await StudentModel.countDocuments({
        branchId: policy.branchId,
        'guardians.phone': phone,
        status: 'active',
        isDeleted: false,
      });
      if (siblingCount < (policy.minimumSiblingCount ?? 2)) {
        throw new ValidationError(
          `Sibling discount requires at least ${policy.minimumSiblingCount ?? 2} active siblings`,
        );
      }
    }
    if (policy.type === 'early_payment') {
      if (!dueDate) throw new ValidationError('Early-payment discount requires a due date');
      const cutoff = new Date(dueDate);
      cutoff.setDate(cutoff.getDate() - (policy.paymentDaysBeforeDue ?? 0));
      if (new Date() > cutoff) {
        throw new ValidationError('The early-payment discount deadline has passed');
      }
    }
  }
}
