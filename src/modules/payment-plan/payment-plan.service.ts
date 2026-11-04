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
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { StudentModel } from '../student/student.model';
import { PaymentService } from '../payment/payment.service';
import { PaymentRepository } from '../payment/payment.repository';
import { TuitionFeeModel } from '../tuition/tuition-fee.model';
import type { IPaymentPlan } from './payment-plan.model';
import { PaymentPlanRepository } from './payment-plan.repository';
import type {
  CreatePaymentPlanDto,
  PaymentPlanQueryFilters,
  PayInstallmentDto,
} from './payment-plan.types';

const referenceId = (value: unknown): string =>
  value && typeof value === 'object' && '_id' in value ? String(value._id) : String(value);

export class PaymentPlanService {
  public constructor(private readonly repository = new PaymentPlanRepository()) {}

  public list(filters: PaymentPlanQueryFilters, user: AuthUser) {
    if (
      filters.branchId &&
      filters.branchId !== 'all' &&
      !checkBranchAccess(user.branchAccess, filters.branchId)
    ) {
      throw new ForbiddenError('You do not have access to payment plans in this branch');
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? undefined
        : Array.isArray(user.branchAccess)
          ? user.branchAccess
          : [];
    return this.repository.findMany(user.schoolId, filters, branchFilter);
  }

  public async getById(id: string, user: AuthUser): Promise<IPaymentPlan> {
    const plan = await this.repository.findById(id);
    if (!plan) throw new NotFoundError('Payment plan not found');
    if (
      referenceId(plan.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, referenceId(plan.branchId))
    ) {
      throw new ForbiddenError('You do not have access to this payment plan');
    }
    return plan;
  }

  public async create(dto: CreatePaymentPlanDto, user: AuthUser): Promise<IPaymentPlan> {
    if (dto.schoolId !== user.schoolId || !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create a payment plan in this branch');
    }
    const [student, enrollment, fee] = await Promise.all([
      StudentModel.findOne({ _id: dto.studentId, schoolId: user.schoolId, isDeleted: false })
        .lean()
        .exec(),
      EnrollmentModel.findOne({ _id: dto.enrollmentId, schoolId: user.schoolId, isDeleted: false })
        .lean()
        .exec(),
      TuitionFeeModel.findOne({ _id: dto.tuitionFeeId, schoolId: user.schoolId, isDeleted: false })
        .lean()
        .exec(),
    ]);
    if (!student || !enrollment || !fee)
      throw new NotFoundError('Payment plan relationship not found');
    if (
      String(student.branchId) !== dto.branchId ||
      String(enrollment.branchId) !== dto.branchId ||
      String(fee.branchId) !== dto.branchId
    ) {
      throw new ValidationError('Payment plan records must belong to the selected branch');
    }
    if (
      String(enrollment.studentId) !== dto.studentId ||
      String(enrollment.academicYearId) !== dto.academicYearId ||
      String(fee.academicYearId) !== dto.academicYearId ||
      String(fee.programId) !== String(enrollment.programId) ||
      String(fee.levelId) !== String(enrollment.levelId)
    ) {
      throw new ValidationError(
        'Fee and enrollment must match the student, academic year, program and level',
      );
    }
    if (!['enrolled', 'active'].includes(enrollment.status) || fee.status !== 'active') {
      throw new ValidationError('Payment plans require an active enrollment and tuition fee');
    }
    if (dto.academicPeriodId) {
      const period = await AcademicPeriodModel.findOne({
        _id: dto.academicPeriodId,
        schoolId: user.schoolId,
        academicYearId: dto.academicYearId,
        isDeleted: false,
      })
        .lean()
        .exec();
      if (
        !period ||
        (period.programId && String(period.programId) !== String(enrollment.programId)) ||
        (enrollment.academicPeriodId &&
          String(enrollment.academicPeriodId) !== dto.academicPeriodId)
      ) {
        throw new ValidationError('Academic period does not match the payment plan enrollment');
      }
    }
    if (fee.currency !== dto.currency || Math.abs(fee.amount - dto.totalAmount) > 0.005) {
      throw new ValidationError('Payment plan total and currency must match the tuition fee');
    }
    const installmentTotal = dto.installments.reduce((sum, item) => sum + item.amount, 0);
    if (Math.abs(installmentTotal - dto.totalAmount) > 0.005) {
      throw new ValidationError('Installment amounts must equal the plan total');
    }
    if (
      dto.installments.some(
        (item, index, all) => index > 0 && item.dueDate < all[index - 1]!.dueDate,
      )
    ) {
      throw new ValidationError('Installments must be ordered by due date');
    }
    if (await this.repository.findDuplicate(dto))
      throw new ConflictError('An active payment plan already exists for this enrollment and fee');
    return runInTransaction(async (session) => {
      const firstDueDate = new Date(dto.installments[0]!.dueDate);
      const totals = await new PaymentRepository().getAccountTotals(
        dto.studentId,
        dto.tuitionFeeId,
        dto.academicYearId,
        fee.billingCycle === 'monthly'
          ? {
              start: new Date(
                Date.UTC(firstDueDate.getUTCFullYear(), firstDueDate.getUTCMonth(), 1),
              ),
              end: new Date(
                Date.UTC(firstDueDate.getUTCFullYear(), firstDueDate.getUTCMonth() + 1, 1),
              ),
            }
          : undefined,
        session,
      );
      if (totals.totalPaid > 0 || totals.totalDiscount > 0) {
        throw new ConflictError(
          'Create an installment plan before recording payments or discounts for this fee',
        );
      }
      const plan = await this.repository.create(dto, user.userId, session);
      await AuditLogService.log({
        userId: user.userId,
        schoolId: user.schoolId,
        branchId: dto.branchId,
        module: 'finance',
        action: 'CREATE',
        entityType: 'PaymentPlan',
        entityId: String(plan._id),
        newValue: plan.toObject(),
        session,
        required: true,
      });
      return plan;
    });
  }

  public async cancel(id: string, reason: string, user: AuthUser): Promise<IPaymentPlan> {
    const plan = await this.getById(id, user);
    const canCancel =
      checkUserPermission(user.permissions, 'payment.void.own_branch') ||
      checkUserPermission(user.permissions, 'payment.void.all_branches') ||
      checkUserPermission(user.permissions, 'finance.void.request.own_branch') ||
      checkUserPermission(user.permissions, 'finance.void.request.all_branches');
    if (!canCancel) throw new ForbiddenError('Payment-plan cancellation permission is required');
    return runInTransaction(async (session) => {
      const cancelled = await this.repository.cancel(id, user.userId, reason, session);
      if (!cancelled) throw new ConflictError('Payment plan is no longer active');
      await AuditLogService.log({
        userId: user.userId,
        schoolId: user.schoolId,
        branchId: referenceId(plan.branchId),
        module: 'finance',
        action: 'UPDATE',
        entityType: 'PaymentPlan',
        entityId: id,
        reason,
        oldValue: { status: plan.status },
        newValue: { status: 'cancelled' },
        required: true,
        session,
      });
      return cancelled;
    });
  }

  public async payInstallment(
    id: string,
    sequence: number,
    dto: PayInstallmentDto,
    user: AuthUser,
  ) {
    const plan = await this.getById(id, user);
    if (plan.status !== 'active')
      throw new ConflictError('Only active payment plans accept payments');
    const installment = plan.installments.find((item) => item.status !== 'paid');
    if (!installment || installment.sequence !== sequence) {
      throw new ConflictError('Record each unpaid installment in order');
    }
    return runInTransaction(async (session) => {
      const payment = await new PaymentService().createPayment(
        {
          schoolId: user.schoolId,
          branchId: referenceId(plan.branchId),
          academicYearId: referenceId(plan.academicYearId),
          academicPeriodId: plan.academicPeriodId ? referenceId(plan.academicPeriodId) : undefined,
          enrollmentId: referenceId(plan.enrollmentId),
          studentId: referenceId(plan.studentId),
          tuitionFeeId: referenceId(plan.tuitionFeeId),
          paymentPlanId: id,
          installmentSequence: sequence,
          amountDue: plan.totalAmount,
          amountPaid: Math.round((installment.amount - installment.paidAmount) * 100) / 100,
          currency: plan.currency,
          dueDate: plan.installments[0]!.dueDate.toISOString().slice(0, 10),
          paymentMethod: dto.paymentMethod,
          paymentDate: dto.paymentDate,
          transactionReference: dto.transactionReference,
        },
        user,
        session,
      );
      const updated = await this.repository.payInstallment(
        id,
        sequence,
        String(payment._id),
        user.userId,
        session,
      );
      if (!updated) throw new ConflictError('Installment changed while payment was being recorded');
      await AuditLogService.log({
        userId: user.userId,
        schoolId: user.schoolId,
        branchId: referenceId(plan.branchId),
        module: 'finance',
        action: 'UPDATE',
        entityType: 'PaymentPlan',
        entityId: id,
        newValue: { sequence, paymentId: String(payment._id), status: updated.status },
        session,
        required: true,
      });
      return { plan: updated, payment };
    });
  }
}
