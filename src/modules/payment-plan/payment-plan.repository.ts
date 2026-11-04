import { Types } from 'mongoose';
import type { ClientSession } from 'mongoose';
import { StudentModel } from '../student/student.model';
import { createSafeSearchRegex } from '../../utils/search';

import type { IPaymentPlan } from './payment-plan.model';
import { PaymentPlanModel } from './payment-plan.model';
import type { CreatePaymentPlanDto, PaymentPlanQueryFilters } from './payment-plan.types';

export class PaymentPlanRepository {
  public async findMany(
    schoolId: string,
    filters: PaymentPlanQueryFilters,
    branchFilter?: string[],
  ): Promise<{ data: IPaymentPlan[]; total: number }> {
    const query: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      isDeleted: false,
    };
    if (filters.branchId && filters.branchId !== 'all')
      query.branchId = new Types.ObjectId(filters.branchId);
    else if (branchFilter)
      query.branchId = { $in: branchFilter.map((id) => new Types.ObjectId(id)) };
    if (filters.academicYearId && filters.academicYearId !== 'all')
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    if (filters.studentId && filters.studentId !== 'all')
      query.studentId = new Types.ObjectId(filters.studentId);
    if (filters.enrollmentId && filters.enrollmentId !== 'all')
      query.enrollmentId = new Types.ObjectId(filters.enrollmentId);
    if (filters.status && filters.status !== 'all') query.status = filters.status;
    if (filters.search) {
      const pattern = createSafeSearchRegex(filters.search);
      const studentIds = await StudentModel.find({
        schoolId: new Types.ObjectId(schoolId),
        isDeleted: false,
        $or: [
          { studentId: pattern },
          { firstName: pattern },
          { lastName: pattern },
          { khmerName: pattern },
        ],
      })
        .distinct('_id')
        .exec();
      query.$and = [{ studentId: { $in: studentIds } }];
    }
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const [data, total] = await Promise.all([
      PaymentPlanModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName')
        .populate('tuitionFeeId', 'feeName feeCode amount currency')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      PaymentPlanModel.countDocuments(query).exec(),
    ]);
    return { data, total };
  }

  public findById(id: string): Promise<IPaymentPlan | null> {
    if (!Types.ObjectId.isValid(id)) return Promise.resolve(null);
    return PaymentPlanModel.findOne({ _id: new Types.ObjectId(id), isDeleted: false })
      .populate('studentId', 'studentId firstName lastName khmerName')
      .populate('tuitionFeeId', 'feeName feeCode amount currency')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .exec();
  }

  public findDuplicate(dto: CreatePaymentPlanDto): Promise<IPaymentPlan | null> {
    return PaymentPlanModel.findOne({
      enrollmentId: new Types.ObjectId(dto.enrollmentId),
      tuitionFeeId: new Types.ObjectId(dto.tuitionFeeId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      status: { $in: ['active', 'completed'] },
      isDeleted: false,
    }).exec();
  }

  public async create(
    dto: CreatePaymentPlanDto,
    userId: string,
    session?: ClientSession,
  ): Promise<IPaymentPlan> {
    const plan = new PaymentPlanModel({
      ...dto,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicYearId: new Types.ObjectId(dto.academicYearId),
      academicPeriodId: dto.academicPeriodId ? new Types.ObjectId(dto.academicPeriodId) : undefined,
      enrollmentId: new Types.ObjectId(dto.enrollmentId),
      studentId: new Types.ObjectId(dto.studentId),
      tuitionFeeId: new Types.ObjectId(dto.tuitionFeeId),
      installments: dto.installments.map((item, index) => ({
        sequence: index + 1,
        dueDate: new Date(item.dueDate),
        amount: item.amount,
        paidAmount: 0,
        status: 'pending',
      })),
      createdBy: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
      updatedBy: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
    });
    return plan.save({ session });
  }

  public cancel(
    id: string,
    userId: string,
    reason: string,
    session?: ClientSession,
  ): Promise<IPaymentPlan | null> {
    return PaymentPlanModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), status: 'active', isDeleted: false },
      {
        $set: {
          status: 'cancelled',
          cancellationReason: reason,
          updatedBy: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
        },
      },
      { new: true, session, runValidators: true },
    ).exec();
  }

  public async payInstallment(
    id: string,
    sequence: number,
    paymentId: string,
    userId: string,
    session?: ClientSession,
  ): Promise<IPaymentPlan | null> {
    const plan = await PaymentPlanModel.findOne({
      _id: id,
      status: 'active',
      isDeleted: false,
    }).session(session ?? null);
    const installment = plan?.installments.find((item) => item.sequence === sequence);
    if (!plan || !installment || installment.status === 'paid') return null;
    installment.paidAmount = installment.amount;
    installment.status = 'paid';
    installment.paymentId = new Types.ObjectId(paymentId);
    if (plan.installments.every((item) => item.status === 'paid')) plan.status = 'completed';
    plan.updatedBy = new Types.ObjectId(userId);
    return plan.save({ session });
  }

  public async reverseInstallment(
    id: string,
    sequence: number,
    paymentId: string,
    userId: string,
    session?: ClientSession,
  ): Promise<IPaymentPlan | null> {
    const plan = await PaymentPlanModel.findOne({ _id: id, isDeleted: false }).session(
      session ?? null,
    );
    const installment = plan?.installments.find(
      (item) => item.sequence === sequence && String(item.paymentId) === paymentId,
    );
    if (!plan || !installment) return null;
    installment.paidAmount = 0;
    installment.status = installment.dueDate < new Date() ? 'overdue' : 'pending';
    installment.paymentId = undefined;
    if (plan.status === 'completed') plan.status = 'active';
    plan.updatedBy = new Types.ObjectId(userId);
    return plan.save({ session });
  }
}
