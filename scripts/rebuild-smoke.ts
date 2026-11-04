import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';

import { createApp } from '../src/app';
import { connectToDatabase, disconnectFromDatabase } from '../src/config/database';
import { env } from '../src/config/env';
import { AuditLogModel } from '../src/modules/audit-log/audit-log.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { PaymentModel } from '../src/modules/payment/payment.model';
import { PaymentPlanModel } from '../src/modules/payment-plan/payment-plan.model';
import { UserModel } from '../src/modules/user/user.model';
import { PasswordUtil } from '../src/utils/password';
import { runInTransaction } from '../src/utils/transaction';
import { verifyRbacSmoke } from './rbac-smoke';

const report = (message: string) => process.stdout.write(`${message}\n`);

const run = async () => {
  const databaseName = new URL(env.MONGODB_URI).pathname.slice(1);
  assert.match(databaseName, /smoke/, 'Run only against an explicitly named smoke database');
  assert.notEqual(env.NODE_ENV, 'test', 'Live smoke checks must use real authentication');
  assert.notEqual(env.NODE_ENV, 'production', 'Smoke fixtures are for local development only');
  await connectToDatabase();
  await PaymentPlanModel.init();
  const app = createApp();
  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ identifier: env.SUPER_ADMIN_USERNAME, password: env.SUPER_ADMIN_PASSWORD });
  assert.equal(login.status, 200, JSON.stringify(login.body));
  const adminToken = login.body.data.accessToken as string;
  const check = async (
    method: 'get' | 'post',
    path: string,
    body?: unknown,
    status = 200,
    token = adminToken,
  ) => {
    const req = request(app)[method](`/api/v1${path}`).set('Authorization', `Bearer ${token}`);
    const result = await (body ? req.send(body) : req);
    assert.equal(result.status, status, `${method} ${path}: ${JSON.stringify(result.body)}`);
    return result.body.data;
  };
  assert.equal((await request(app).get('/api/v1/students')).status, 401);
  assert.equal(
    (await request(app).get('/api/v1/students').set('X-User-Permissions', '*')).status,
    401,
  );
  for (const path of [
    '/auth/me',
    '/schools',
    '/branches',
    '/departments',
    '/positions',
    '/employees',
    '/students',
    '/enrollments',
    '/academic-years',
    '/academic-periods',
    '/programs',
    '/levels',
    '/classes',
    '/tuition-fees',
    '/payments',
    '/payment-plans',
    '/notifications',
    '/users',
    '/roles',
  ]) {
    await check('get', path);
  }
  report('PASS: real login, protected routes, and 19 module reads');

  const enrollment = await EnrollmentModel.findOne({
    status: { $in: ['active', 'enrolled'] },
    isDeleted: false,
  }).lean();
  assert.ok(enrollment, 'Seed demo enrollments before running the smoke checks');
  const suffix = Date.now().toString();
  const scope = {
    schoolId: String(enrollment.schoolId),
    branchId: String(enrollment.branchId),
    academicYearId: String(enrollment.academicYearId),
  };
  await verifyRbacSmoke(app, adminToken, scope, suffix);
  const fee = await check(
    'post',
    '/tuition-fees',
    {
      ...scope,
      programId: String(enrollment.programId),
      levelId: String(enrollment.levelId),
      feeName: `Smoke tuition ${suffix}`,
      feeCode: `SMOKE-${suffix}`,
      amount: 100,
      currency: 'USD',
      billingCycle: 'term',
    },
    201,
  );
  const planInput = {
    ...scope,
    enrollmentId: String(enrollment._id),
    studentId: String(enrollment.studentId),
    tuitionFeeId: fee._id,
    totalAmount: 100,
    currency: 'USD',
    installments: [
      { dueDate: '2026-09-10', amount: 40 },
      { dueDate: '2026-10-10', amount: 60 },
    ],
  };
  const plan = await check('post', '/payment-plans', planInput, 201);
  await check('post', '/payment-plans', planInput, 409);

  const cashierName = `smoke_cashier_${suffix}`;
  await UserModel.create({
    schoolId: enrollment.schoolId,
    username: cashierName,
    email: `${cashierName}@example.test`,
    passwordHash: await PasswordUtil.hash(env.SUPER_ADMIN_PASSWORD),
    roles: ['finance_officer'],
    branchAccess: [String(enrollment.branchId)],
    status: 'active',
    mustChangePassword: false,
  });
  const cashierLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ identifier: cashierName, password: env.SUPER_ADMIN_PASSWORD });
  assert.equal(cashierLogin.status, 200, JSON.stringify(cashierLogin.body));
  const cashierToken = cashierLogin.body.data.accessToken as string;
  await check('get', `/payment-plans/${plan._id}`, undefined, 200, cashierToken);
  await check(
    'get',
    `/payment-plans?branchId=${new mongoose.Types.ObjectId()}`,
    undefined,
    403,
    cashierToken,
  );
  const paymentInput = { paymentMethod: 'cash', paymentDate: '2026-09-12' };
  const first = await check(
    'post',
    `/payment-plans/${plan._id}/installments/1/pay`,
    paymentInput,
    201,
    cashierToken,
  );
  assert.equal(first.payment.balanceRemaining, 60);
  await check(
    'post',
    `/payment-plans/${plan._id}/installments/1/pay`,
    paymentInput,
    409,
    cashierToken,
  );
  const second = await check(
    'post',
    `/payment-plans/${plan._id}/installments/2/pay`,
    paymentInput,
    201,
    cashierToken,
  );
  assert.equal(second.plan.status, 'completed');
  assert.equal(second.payment.balanceRemaining, 0);
  const debt = await check('get', '/payments/debt-aging');
  assert.ok(
    !debt.items.some((item: { feeName: string }) => item.feeName === fee.feeName),
    'A paid account must not remain in debt',
  );
  await check('post', `/payments/${second.payment._id}/void`, {
    reason: 'Smoke reversal verification',
  });
  const reopened = await check('get', `/payment-plans/${plan._id}`);
  assert.equal(reopened.status, 'active');
  assert.equal(reopened.installments[1].paidAmount, 0);
  const reopenedDebt = await check('get', '/payments/debt-aging');
  assert.equal(
    reopenedDebt.items.find((item: { feeName: string }) => item.feeName === fee.feeName)
      ?.unpaidBalance,
    60,
  );
  await check('post', `/payment-plans/${plan._id}/cancel`, {
    reason: 'Smoke cancellation verification',
  });
  await check('post', `/payment-plans/${plan._id}/installments/2/pay`, paymentInput, 409);
  report(
    'PASS: branch-scoped plan creation, duplicate protection, installment receipts, completion, reversal, debt and cancellation',
  );

  const invoices = await check(
    'post',
    '/payments/monthly-invoices/generate',
    { ...scope, year: 2026, month: 9 },
    201,
  );
  const repeated = await check(
    'post',
    '/payments/monthly-invoices/generate',
    { ...scope, year: 2026, month: 9 },
    201,
  );
  assert.equal(repeated.created, 0, 'Repeated invoice generation must be idempotent');
  assert.ok(repeated.skipped >= invoices.created);
  assert.ok(await AuditLogModel.exists({ entityId: plan._id, entityType: 'PaymentPlan' }));
  report(
    `PASS: monthly invoice generation and repeat (${invoices.created} new invoices), persisted audit records`,
  );

  const before = await PaymentModel.countDocuments();
  await assert.rejects(
    runInTransaction(async (session) => {
      const source = await PaymentModel.findById(first.payment._id).lean();
      assert.ok(source);
      await PaymentModel.create(
        [
          {
            ...source,
            _id: new mongoose.Types.ObjectId(),
            receiptNumber: `ROLLBACK-${suffix}`,
            paymentNumber: `ROLLBACK-${suffix}`,
          },
        ],
        { session },
      );
      throw new Error('Intentional rollback');
    }),
    /Intentional rollback/,
  );
  assert.equal(await PaymentModel.countDocuments(), before);
  await runInTransaction(async () => {
    /* A void workflow return is valid. */
  });
  report('PASS: real MongoDB rollback and successful void-return transactions');
};

void run()
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(disconnectFromDatabase);
