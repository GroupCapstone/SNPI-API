import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authenticate } from '../src/middleware/authenticate';
import { AcademicRuleService } from '../src/modules/academic-rule/academic-rule.service';
import { validateAcademicRuleConfig } from '../src/modules/academic-rule/academic-rule.validation';
import { BranchModel } from '../src/modules/branch/branch.model';
import { PaymentService } from '../src/modules/payment/payment.service';
import { StudentModel } from '../src/modules/student/student.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

vi.mock('../src/modules/sequence/sequence.service', () => ({
  SequenceService: {
    getNextSequence: vi.fn().mockResolvedValue('PAY-000001'),
  },
}));

const schoolId = new Types.ObjectId().toString();
const branchId = new Types.ObjectId().toString();
const academicYearId = new Types.ObjectId().toString();
const studentId = new Types.ObjectId().toString();
const tuitionFeeId = new Types.ObjectId().toString();
const user: AuthUser = {
  userId: new Types.ObjectId().toString(),
  username: 'manager',
  email: 'manager@snp.edu.kh',
  schoolId,
  roles: ['branch_manager'],
  permissions: [],
  branchAccess: [branchId],
};

describe('management data integrity controls', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('centrally rejects a request body targeting another school', async () => {
    const foreignSchoolId = new Types.ObjectId().toString();
    const request = {
      body: { schoolId: foreignSchoolId },
      query: {},
      header: (name: string) =>
        ({
          'X-User-Id': user.userId,
          'X-School-Id': schoolId,
          'X-Branch-Access': 'all',
        })[name],
    };
    const next = vi.fn();

    await authenticate(request as never, {} as never, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('centrally rejects a request body targeting an unauthorized branch', async () => {
    const request = {
      body: { schoolId, branchId: new Types.ObjectId().toString() },
      query: {},
      header: (name: string) =>
        ({
          'X-User-Id': user.userId,
          'X-School-Id': schoolId,
          'X-Branch-Access': branchId,
        })[name],
    };
    const next = vi.fn();

    await authenticate(request as never, {} as never, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('rejects academic-rule access for a caller-supplied foreign school', async () => {
    const repository = { findMany: vi.fn() };
    const service = new AcademicRuleService(repository as never);

    await expect(
      service.getRules({ schoolId: new Types.ObjectId().toString() }, user),
    ).rejects.toThrow('this school');
    expect(repository.findMany).not.toHaveBeenCalled();
  });

  it('rejects malformed academic business rules before they can be stored', () => {
    expect(
      validateAcademicRuleConfig('grade_scheme', {
        bands: [{ minimum: 50, grade: 'E', gpa: 1 }],
      }).success,
    ).toBe(false);
    expect(
      validateAcademicRuleConfig('promotion_rule', {
        passingAverage: 50,
        minimumAttendanceRate: 101,
      }).success,
    ).toBe(false);
  });

  it('scopes rule resolution to the authenticated school and authorized branch', async () => {
    const repository = { findActiveForDate: vi.fn().mockResolvedValue(null) };
    const service = new AcademicRuleService(repository as never);
    const effectiveAt = new Date('2026-09-01T00:00:00.000Z');

    await service.resolveRuleForDate(
      schoolId,
      'grade_scheme',
      'STANDARD',
      effectiveAt,
      user,
      branchId,
    );
    expect(repository.findActiveForDate).toHaveBeenCalledWith(
      schoolId,
      'grade_scheme',
      'STANDARD',
      effectiveAt,
      branchId,
    );
  });

  it('requires a billing month for recurring monthly tuition', async () => {
    vi.spyOn(StudentModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ schoolId, branchId }),
    } as never);
    vi.spyOn(TuitionFeeModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        schoolId,
        branchId,
        academicYearId,
        amount: 100,
        currency: 'USD',
        billingCycle: 'monthly',
      }),
    } as never);
    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ schoolId }),
    } as never);
    const repository = { getAccountTotals: vi.fn(), create: vi.fn() };
    const service = new PaymentService(repository as never);

    await expect(
      service.createPayment(
        {
          schoolId,
          branchId,
          academicYearId,
          studentId,
          tuitionFeeId,
          amountDue: 100,
          amountPaid: 50,
          currency: 'USD',
          paymentMethod: 'cash',
        },
        user,
      ),
    ).rejects.toThrow('Billing month is required');
    expect(repository.getAccountTotals).not.toHaveBeenCalled();
  });

  it('calculates monthly balances inside the selected billing period', async () => {
    vi.spyOn(StudentModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ schoolId, branchId }),
    } as never);
    vi.spyOn(TuitionFeeModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        schoolId,
        branchId,
        academicYearId,
        amount: 100,
        currency: 'USD',
        billingCycle: 'monthly',
      }),
    } as never);
    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ schoolId }),
    } as never);
    const repository = {
      getAccountTotals: vi.fn().mockResolvedValue({ totalPaid: 25, totalDiscount: 0 }),
      create: vi.fn().mockResolvedValue({
        _id: new Types.ObjectId(),
        schoolId,
        branchId,
        amountPaid: 75,
      }),
    };
    const service = new PaymentService(repository as never);

    await service.createPayment(
      {
        schoolId,
        branchId,
        academicYearId,
        studentId,
        tuitionFeeId,
        amountDue: 100,
        amountPaid: 75,
        currency: 'USD',
        paymentMethod: 'cash',
        dueDate: '2026-09-15',
      },
      user,
    );
    expect(repository.getAccountTotals).toHaveBeenCalledWith(
      studentId,
      tuitionFeeId,
      academicYearId,
      {
        start: new Date('2026-09-01T00:00:00.000Z'),
        end: new Date('2026-10-01T00:00:00.000Z'),
      },
      undefined,
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ dueDate: '2026-09-15' }),
      'PAY-000001',
      0,
      'paid',
      user.userId,
      undefined,
    );
  });
});
