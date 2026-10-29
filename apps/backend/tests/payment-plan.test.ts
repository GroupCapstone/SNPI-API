import { Types } from 'mongoose';
import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { PaymentPlanRepository } from '../src/modules/payment-plan/payment-plan.repository';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { StudentModel } from '../src/modules/student/student.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';
import { PaymentService } from '../src/modules/payment/payment.service';
import { AuditLogService } from '../src/modules/audit-log/audit-log.service';

import { PaymentPlanService } from '../src/modules/payment-plan/payment-plan.service';
import { createPaymentPlanSchema } from '../src/modules/payment-plan/payment-plan.validation';
import type { AuthUser } from '../src/types/auth';

const id = () => new Types.ObjectId().toString();

describe('payment plan controls', () => {
  afterEach(() => vi.restoreAllMocks());
  it('requires at least two dated installments', () => {
    const result = createPaymentPlanSchema.safeParse({
      params: {},
      query: {},
      body: {
        schoolId: id(),
        branchId: id(),
        academicYearId: id(),
        enrollmentId: id(),
        studentId: id(),
        tuitionFeeId: id(),
        totalAmount: 100,
        currency: 'USD',
        installments: [{ dueDate: '2026-10-01', amount: 100 }],
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects payment-plan creation outside the caller branch scope', async () => {
    const service = new PaymentPlanService({} as never);
    const user: AuthUser = {
      userId: id(),
      username: 'cashier',
      email: 'cashier@snp.edu.kh',
      schoolId: id(),
      roles: ['finance_officer'],
      permissions: ['finance.payment.create.own_branch'],
      branchAccess: [id()],
      departmentAccess: [],
      assignedClasses: [],
      assignedSubjects: [],
      defaultBranch: null,
      isSuperAdmin: false,
      status: 'active',
      mustChangePassword: false,
    };
    await expect(
      service.create(
        {
          schoolId: user.schoolId,
          branchId: id(),
          academicYearId: id(),
          enrollmentId: id(),
          studentId: id(),
          tuitionFeeId: id(),
          totalAmount: 100,
          currency: 'USD',
          installments: [
            { dueDate: '2026-10-01', amount: 50 },
            { dueDate: '2026-11-01', amount: 50 },
          ],
        },
        user,
      ),
    ).rejects.toThrow('access');
  });

  it('allows a branch user to read a plan with populated references', async () => {
    const schoolId = id();
    const branchId = id();
    const repository = new PaymentPlanRepository();
    vi.spyOn(repository, 'findById').mockResolvedValue({
      schoolId: new Types.ObjectId(schoolId),
      branchId: { _id: new Types.ObjectId(branchId), branchNameEn: 'Main' },
    } as never);
    const user = { schoolId, branchAccess: [branchId] } as AuthUser;
    await expect(new PaymentPlanService(repository).getById(id(), user)).resolves.toBeDefined();
    await expect(
      new PaymentPlanService(repository).getById(id(), { ...user, schoolId: id() }),
    ).rejects.toThrow('access');
  });

  it.each(['academicYearId', 'programId', 'levelId'])(
    'rejects a fee with a mismatched %s',
    async (field) => {
      const schoolId = id();
      const branchId = id();
      const studentId = id();
      const academicYearId = id();
      const programId = id();
      const levelId = id();
      const chain = (value: unknown) => ({ lean: () => ({ exec: async () => value }) });
      vi.spyOn(StudentModel, 'findOne').mockReturnValue(chain({ schoolId, branchId }) as never);
      vi.spyOn(EnrollmentModel, 'findOne').mockReturnValue(
        chain({
          schoolId,
          branchId,
          studentId,
          academicYearId,
          programId,
          levelId,
          status: 'active',
        }) as never,
      );
      vi.spyOn(TuitionFeeModel, 'findOne').mockReturnValue(
        chain({
          schoolId,
          branchId,
          academicYearId,
          programId,
          levelId,
          status: 'active',
          [field]: id(),
        }) as never,
      );
      const input = {
        schoolId,
        branchId,
        studentId,
        academicYearId,
        enrollmentId: id(),
        tuitionFeeId: id(),
        totalAmount: 100,
        currency: 'USD' as const,
        installments: [
          { dueDate: '2026-09-01', amount: 50 },
          { dueDate: '2026-10-01', amount: 50 },
        ],
      };
      await expect(
        new PaymentPlanService().create(input, { schoolId, branchAccess: [branchId] } as AuthUser),
      ).rejects.toThrow('must match');
    },
  );

  it('refuses paid or out-of-order installments before creating a receipt', async () => {
    const service = new PaymentPlanService();
    const record = vi.spyOn(PaymentService.prototype, 'createPayment');
    vi.spyOn(service, 'getById').mockResolvedValue({
      status: 'active',
      installments: [
        { sequence: 1, status: 'paid' },
        { sequence: 2, status: 'pending' },
      ],
    } as never);
    await expect(
      service.payInstallment(
        id(),
        1,
        { paymentMethod: 'cash', paymentDate: '2026-09-12' },
        {} as AuthUser,
      ),
    ).rejects.toThrow('in order');
    expect(record).not.toHaveBeenCalled();
  });

  it('records the server-calculated installment and audits the plan update', async () => {
    const repository = new PaymentPlanRepository();
    const planId = id();
    const paymentId = id();
    const plan = {
      schoolId: id(),
      branchId: id(),
      studentId: id(),
      academicYearId: id(),
      enrollmentId: id(),
      tuitionFeeId: id(),
      totalAmount: 100,
      currency: 'USD',
      status: 'active',
      installments: [
        {
          sequence: 1,
          amount: 40,
          paidAmount: 0,
          status: 'pending',
          dueDate: new Date('2026-09-10'),
        },
      ],
    };
    const target = new PaymentPlanService(repository);
    vi.spyOn(target, 'getById').mockResolvedValue(plan as never);
    const create = vi
      .spyOn(PaymentService.prototype, 'createPayment')
      .mockResolvedValue({ _id: paymentId } as never);
    vi.spyOn(repository, 'payInstallment').mockResolvedValue({ status: 'active' } as never);
    vi.spyOn(AuditLogService, 'log').mockResolvedValue(undefined);
    await target.payInstallment(planId, 1, { paymentMethod: 'cash', paymentDate: '2026-09-12' }, {
      schoolId: plan.schoolId,
      userId: id(),
    } as AuthUser);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ amountPaid: 40, paymentPlanId: planId, installmentSequence: 1 }),
      expect.any(Object),
      undefined,
    );
    expect(AuditLogService.log).toHaveBeenCalledWith(
      expect.objectContaining({ required: true, entityType: 'PaymentPlan' }),
    );
  });

  it('validates installment routes and enforces finance permissions', async () => {
    const app = createApp();
    const planId = id();
    const record = vi
      .spyOn(PaymentPlanService.prototype, 'payInstallment')
      .mockResolvedValue({ plan: { status: 'active' }, payment: { _id: id() } } as never);
    const path = `/api/v1/payment-plans/${planId}/installments/1/pay`;
    const input = { paymentMethod: 'cash', paymentDate: '2026-09-12', amountPaid: 0.01 };
    const denied = await request(app)
      .post(path)
      .set('X-User-Id', id())
      .set('X-User-Permissions', 'payment.view.own_branch')
      .send(input);
    expect(denied.status).toBe(403);
    expect(record).not.toHaveBeenCalled();
    const accepted = await request(app)
      .post(path)
      .set('X-User-Id', id())
      .set('X-User-Permissions', 'finance.payment.create.all_branches')
      .send(input);
    expect(accepted.status).toBe(201);
    expect(record).toHaveBeenCalledWith(
      planId,
      1,
      { paymentMethod: 'cash', paymentDate: '2026-09-12' },
      expect.any(Object),
    );
    expect(
      (
        await request(app)
          .post(path)
          .send({ ...input, paymentDate: 'not-a-date' })
      ).status,
    ).toBe(422);
    expect(
      (await request(app).post('/api/v1/payment-plans/invalid/installments/1/pay').send(input))
        .status,
    ).toBe(422);
  });
});
