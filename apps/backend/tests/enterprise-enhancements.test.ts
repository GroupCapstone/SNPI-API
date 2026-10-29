import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AttendanceLeaveService } from '../src/modules/attendance-leave/attendance-leave.service';
import { FinanceOperationService } from '../src/modules/finance-operation/finance-operation.service';
import { NotificationService } from '../src/modules/notification/notification.service';
import { ReportService } from '../src/modules/report/report.service';

const app = createApp();
const id = '507f1f77bcf86cd799439011';
const headers = (permissions: string) => ({
  'X-User-Id': 'test-user',
  'X-User-Permissions': permissions,
});

describe('enterprise enhancement routes', () => {
  afterEach(() => vi.restoreAllMocks());

  it('creates a branch-scoped attendance leave request after validation', async () => {
    const create = vi
      .spyOn(AttendanceLeaveService.prototype, 'createLeave')
      .mockResolvedValue({ _id: id } as never);
    const response = await request(app)
      .post('/api/v1/attendance-leaves')
      .set(headers('attendance.create.all_branches'))
      .send({
        branchId: id,
        studentId: id,
        enrollmentId: id,
        classId: id,
        leaveType: 'medical',
        startDate: '2026-09-10',
        endDate: '2026-09-11',
        reason: 'Medical appointment',
      });

    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ leaveType: 'medical', startDate: '2026-09-10' }),
      expect.any(Object),
    );
  });

  it('rejects an invalid attendance leave payload before the service', async () => {
    const create = vi.spyOn(AttendanceLeaveService.prototype, 'createLeave');
    const response = await request(app)
      .post('/api/v1/attendance-leaves')
      .set(headers('attendance.create.all_branches'))
      .send({ branchId: id, leaveType: 'medical' });

    expect(response.status).toBe(422);
    expect(create).not.toHaveBeenCalled();
  });

  it('creates a discount policy and opens a cashier shift through finance operations', async () => {
    const createPolicy = vi
      .spyOn(FinanceOperationService.prototype, 'createPolicy')
      .mockResolvedValue({ _id: id } as never);
    const openShift = vi
      .spyOn(FinanceOperationService.prototype, 'openShift')
      .mockResolvedValue({ _id: id } as never);

    const policyResponse = await request(app)
      .post('/api/v1/finance-operations/discount-policies')
      .set(headers('finance.discount.apply.all_branches'))
      .send({
        branchId: id,
        code: 'SIBLING-05',
        name: 'Sibling discount',
        type: 'sibling',
        calculationType: 'percentage',
        value: 5,
        effectiveFrom: '2026-09-01',
      });
    const shiftResponse = await request(app)
      .post('/api/v1/finance-operations/cashier-shifts/open')
      .set(headers('payment.create.all_branches'))
      .send({ branchId: id, openingCash: { USD: 100, KHR: 0 } });

    expect(policyResponse.status).toBe(201);
    expect(shiftResponse.status).toBe(201);
    expect(createPolicy).toHaveBeenCalled();
    expect(openShift).toHaveBeenCalled();
  });

  it('triggers a tuition reminder using the notification route', async () => {
    const trigger = vi
      .spyOn(NotificationService.prototype, 'triggerTuitionReminder')
      .mockResolvedValue({ notification: { _id: id }, contactLog: { _id: id } } as never);
    const response = await request(app)
      .post('/api/v1/notifications/tuition-reminder')
      .set(headers('notification.create.all_branches'))
      .send({ paymentId: id, channel: 'sms', notes: 'Follow up today' });

    expect(response.status).toBe(201);
    expect(trigger).toHaveBeenCalledWith(
      { paymentId: id, channel: 'sms', notes: 'Follow up today' },
      expect.any(Object),
    );
  });

  it('keeps certificate verification public while validating the code format', async () => {
    const verify = vi
      .spyOn(ReportService.prototype, 'verifyCertificate')
      .mockResolvedValue({ valid: true, documentNumber: 'CRT-12345678' });
    const response = await request(app).get('/api/v1/reports/certificates/verify/CRT-12345678');

    expect(response.status).toBe(200);
    expect(verify).toHaveBeenCalledWith('CRT-12345678');

    const invalid = await request(app).get('/api/v1/reports/certificates/verify/not-a-code');
    expect(invalid.status).toBe(422);
  });
});
