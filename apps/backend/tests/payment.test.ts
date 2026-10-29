import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { PaymentModel } from '../src/modules/payment/payment.model';
import { SequenceService } from '../src/modules/sequence/sequence.service';
import { StudentModel } from '../src/modules/student/student.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';

const app = createApp();

describe('Payment & Receipt Module Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/payments returns paginated payment receipts', async () => {
    vi.spyOn(PaymentModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e4',
          receiptNumber: 'PAY-000001',
          amountDue: 250,
          amountPaid: 250,
          balanceRemaining: 0,
          status: 'paid',
          paymentMethod: 'aba_pay',
        },
      ]),
    } as never);

    vi.spyOn(PaymentModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/payments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].receiptNumber).toBe('PAY-000001');
  });

  it('POST /api/v1/payments preserves receipts and calculates cumulative balances', async () => {
    const schoolId = '6a939db4ea1f071b8b1f17d1';
    const branchId = '6a939db4ea1f071b8b1f17c1';
    const academicYearId = '6a939db4ea1f071b8b1f17f1';
    const studentId = '6a939db4ea1f071b8b1f1701';
    const tuitionFeeId = '6a939db4ea1f071b8b1f1702';

    vi.spyOn(StudentModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: studentId,
        schoolId,
        branchId,
      }),
    } as never);

    vi.spyOn(TuitionFeeModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: tuitionFeeId,
        schoolId,
        branchId,
        academicYearId,
        amount: 250,
        currency: 'USD',
      }),
    } as never);

    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: branchId, schoolId }),
    } as never);

    vi.spyOn(SequenceService, 'getNextSequence')
      .mockResolvedValueOnce('PAY-000002')
      .mockResolvedValueOnce('PAY-000003');

    vi.spyOn(PaymentModel, 'aggregate')
      .mockReturnValueOnce({ exec: vi.fn().mockResolvedValue([]) } as never)
      .mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue([{ totalPaid: 100, totalDiscount: 0 }]),
      } as never);

    const createSpy = vi
      .spyOn(PaymentModel, 'create')
      .mockResolvedValueOnce({
        _id: '6a939db4ea1f071b8b1f17e4',
        receiptNumber: 'PAY-000002',
        schoolId,
        branchId,
        academicYearId,
        studentId,
        tuitionFeeId,
        amountDue: 250,
        discountAmount: 0,
        amountPaid: 100,
        balanceRemaining: 150,
        status: 'partial',
        paymentMethod: 'cash',
        toObject: vi.fn().mockReturnValue({ receiptNumber: 'PAY-000002' }),
      } as never)
      .mockResolvedValueOnce({
        _id: '6a939db4ea1f071b8b1f17e5',
        receiptNumber: 'PAY-000003',
        schoolId,
        branchId,
        academicYearId,
        studentId,
        tuitionFeeId,
        amountDue: 250,
        discountAmount: 0,
        amountPaid: 150,
        balanceRemaining: 0,
        status: 'paid',
        paymentMethod: 'cash',
        toObject: vi.fn().mockReturnValue({ receiptNumber: 'PAY-000003' }),
      } as never);

    const basePayload = {
      schoolId,
      branchId,
      academicYearId,
      studentId,
      tuitionFeeId,
      amountDue: 250,
      discountAmount: 0,
      paymentMethod: 'cash',
    };

    const first = await request(app)
      .post('/api/v1/payments')
      .set('X-School-Id', schoolId)
      .send({ ...basePayload, amountPaid: 100 });
    expect(first.status).toBe(201);
    expect(first.body.data).toMatchObject({
      receiptNumber: 'PAY-000002',
      amountPaid: 100,
      balanceRemaining: 150,
      status: 'partial',
    });

    const second = await request(app)
      .post('/api/v1/payments')
      .set('X-School-Id', schoolId)
      .send({ ...basePayload, amountPaid: 150 });
    expect(second.status).toBe(201);
    expect(second.body.data).toMatchObject({
      receiptNumber: 'PAY-000003',
      amountPaid: 150,
      balanceRemaining: 0,
      status: 'paid',
    });

    expect(createSpy).toHaveBeenCalledTimes(2);
    expect(createSpy.mock.calls[0]?.[0]).toMatchObject({
      balanceRemaining: 150,
      status: 'partial',
    });
    expect(createSpy.mock.calls[1]?.[0]).toMatchObject({ balanceRemaining: 0, status: 'paid' });
  });

  it('GET /api/v1/payments/monthly-summary returns aggregated revenue and breakdown', async () => {
    vi.spyOn(PaymentModel, 'aggregate').mockReturnValue({
      exec: vi.fn().mockResolvedValue([
        {
          overall: [
            {
              totalRevenueUsd: 500,
              totalRevenueKhr: 400000,
              totalTransactions: 5,
              paidTransactions: 4,
              partialTransactions: 1,
            },
          ],
          byMethod: [
            { _id: 'aba_pay', totalUsd: 300, totalKhr: 0, count: 3 },
            { _id: 'cash', totalUsd: 200, totalKhr: 400000, count: 2 },
          ],
          byType: [{ _id: 'tuition_monthly', totalUsd: 500, totalKhr: 400000, count: 5 }],
        },
      ]),
    } as never);

    const res = await request(app).get('/api/v1/payments/monthly-summary?year=2026&month=1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      year: 2026,
      month: 1,
      monthLabelEn: 'January',
      monthLabelKh: 'មករា',
      totalRevenueUsd: 500,
      totalRevenueKhr: 400000,
      totalTransactions: 5,
      paidTransactions: 4,
      partialTransactions: 1,
    });
    expect(res.body.data.byMethod).toHaveLength(2);
    expect(res.body.data.byType).toHaveLength(1);
  });

  it('GET /api/v1/payments/debt-aging returns aging categorization and debt totals', async () => {
    vi.spyOn(PaymentModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e4',
          studentId: {
            _id: '6a939db4ea1f071b8b1f1701',
            studentId: 'STU-000001',
            firstName: 'Dara',
            lastName: 'Sok',
            phone: '012345678',
          },
          branchId: { branchCode: 'TK' },
          tuitionFeeId: { feeName: 'English Level 1', currency: 'USD' },
          currency: 'USD',
          balanceRemaining: 50,
          paymentDate: new Date('2026-01-01'),
          dueDate: new Date('2026-01-01'),
          status: 'partial',
        },
      ]),
    } as never);

    vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    } as never);

    const res = await request(app).get('/api/v1/payments/debt-aging?asOfDate=2026-01-15');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.totalUnpaidUsd).toBe(50);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0]).toMatchObject({
      studentCode: 'STU-000001',
      studentNameEn: 'Dara Sok',
      unpaidBalance: 50,
      agingCategory: 'overdue_30',
    });
  });
});
