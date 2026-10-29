import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AssessmentService } from '../src/modules/assessment/assessment.service';
import { AttendanceService } from '../src/modules/attendance/attendance.service';
import { PaymentService } from '../src/modules/payment/payment.service';
import { RoleService } from '../src/modules/role/role.service';
import { UserService } from '../src/modules/user/user.service';

const app = createApp();
const id = '507f1f77bcf86cd799439001';

describe('validated controller input boundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('passes assessment defaults and normalized values to the service, stripping extra fields', async () => {
    const create = vi
      .spyOn(AssessmentService.prototype, 'createAssessment')
      .mockResolvedValue({ _id: id } as never);
    const response = await request(app)
      .post('/api/v1/assessments')
      .send({
        schoolId: id,
        branchId: id,
        academicYearId: id,
        classId: id,
        subjectId: id,
        name: '  Monthly test  ',
        code: '  math-09  ',
        type: 'monthly_test',
        assessmentDate: '2026-09-05',
        isDeleted: true,
        createdBy: 'forged-user',
        $set: { status: 'closed' },
      });
    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith(
      {
        schoolId: id,
        branchId: id,
        academicYearId: id,
        classId: id,
        subjectId: id,
        name: 'Monthly test',
        code: 'MATH-09',
        type: 'monthly_test',
        assessmentDate: '2026-09-05',
        maxScore: 100,
        passingScore: 50,
        weightPercentage: 100,
        status: 'draft',
        proctorIds: [],
      },
      expect.any(Object),
    );
  });

  it('does not forward ownership or MongoDB operators through assessment updates', async () => {
    const update = vi
      .spyOn(AssessmentService.prototype, 'updateAssessment')
      .mockResolvedValue({ _id: id } as never);
    const response = await request(app)
      .patch(`/api/v1/assessments/${id}`)
      .send({
        name: '  Revised test  ',
        schoolId: 'another-school',
        branchId: 'another-branch',
        isDeleted: true,
        $unset: { schoolId: '' },
        'metadata.private': 'injected',
      });
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(id, { name: 'Revised test' }, expect.any(Object));
  });

  it('does not forward credential internals through user updates', async () => {
    const update = vi
      .spyOn(UserService.prototype, 'updateUser')
      .mockResolvedValue({ _id: id } as never);
    const response = await request(app)
      .patch(`/api/v1/users/${id}`)
      .send({
        email: '  user@snp.edu.kh  ',
        passwordHash: 'forged-hash',
        tokenVersion: 0,
        refreshTokenHash: 'forged-session',
        $set: { roles: ['super_admin'] },
      });
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(id, { email: 'user@snp.edu.kh' }, expect.any(Object));
  });

  it('honors boolean role filters and numeric pagination after query validation', async () => {
    const list = vi
      .spyOn(RoleService.prototype, 'getRoles')
      .mockResolvedValue({ data: [], total: 0 });
    const response = await request(app).get(
      '/api/v1/roles?isSystem=false&page=2&limit=5&search=%20teacher%20&isDeleted=true',
    );
    expect(response.status).toBe(200);
    expect(list).toHaveBeenCalledWith({ isSystem: false, page: 2, limit: 5, search: 'teacher' });
    expect(response.body.pagination).toMatchObject({ page: 2, limit: 5 });
  });

  it('rejects operator objects in declared fields before reaching services', async () => {
    const update = vi.spyOn(UserService.prototype, 'updateUser');
    const response = await request(app)
      .patch(`/api/v1/users/${id}`)
      .send({ email: { $ne: null } });
    expect(response.status).toBe(422);
    expect(update).not.toHaveBeenCalled();
  });

  it('strips unknown nested attendance properties and applies the session default', async () => {
    const mark = vi
      .spyOn(AttendanceService.prototype, 'markAttendance')
      .mockResolvedValue({} as never);
    const response = await request(app)
      .post('/api/v1/attendance')
      .send({
        schoolId: id,
        branchId: id,
        academicYearId: id,
        classId: id,
        date: '2026-09-05',
        records: [
          {
            studentId: id,
            status: 'present',
            remarks: '  On time  ',
            $set: { studentId: 'other' },
          },
        ],
      });
    expect(response.status).toBe(200);
    expect(mark).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionType: 'morning',
        records: [{ studentId: id, status: 'present', remarks: 'On time' }],
      }),
      expect.any(Object),
    );
  });

  it('applies payment currency and discount defaults without accepting a forged receipt status', async () => {
    const create = vi
      .spyOn(PaymentService.prototype, 'createPayment')
      .mockResolvedValue({ _id: id } as never);
    const response = await request(app).post('/api/v1/payments').send({
      schoolId: id,
      branchId: id,
      academicYearId: id,
      studentId: id,
      tuitionFeeId: id,
      amountDue: 100,
      amountPaid: 50,
      paymentMethod: 'cash',
      status: 'paid',
      isDeleted: true,
    });
    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith(
      {
        schoolId: id,
        branchId: id,
        academicYearId: id,
        studentId: id,
        tuitionFeeId: id,
        amountDue: 100,
        amountPaid: 50,
        paymentMethod: 'cash',
        currency: 'USD',
        discountAmount: 0,
        paymentType: 'tuition_monthly',
      },
      expect.any(Object),
    );
  });
});
