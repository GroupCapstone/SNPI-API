import path from 'node:path';

import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env';
import { etagMiddleware } from './middleware/etag';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { createHttpsOnlyMiddleware } from './middleware/https-only';
import { idempotencyMiddleware } from './middleware/idempotency';
import { requestLogger } from './middleware/request-logger';
import { apiRateLimiter, corsMiddleware, mutationRateLimiter } from './middleware/security';
import { academicPeriodRouter } from './modules/academic-period/academic-period.route';
import { academicRuleRouter } from './modules/academic-rule/academic-rule.route';
import { academicYearRouter } from './modules/academic-year/academic-year.route';
import { announcementRouter } from './modules/announcement/announcement.route';
import { assessmentRouter } from './modules/assessment/assessment.route';
import { attendanceRouter } from './modules/attendance/attendance.route';
import { attendanceLeaveRouter } from './modules/attendance-leave/attendance-leave.route';
import { auditLogRouter } from './modules/audit-log/audit-log.route';
import { authRouter } from './modules/auth/auth.route';
import { branchRouter } from './modules/branch/branch.route';
import { classRouter } from './modules/class/class.route';
import { classScheduleRouter } from './modules/class-schedule/class-schedule.route';
import { classroomRouter } from './modules/classroom/classroom.route';
import { curriculumRouter } from './modules/curriculum/curriculum.route';
import { dashboardRouter } from './modules/dashboard/dashboard.route';
import { departmentRouter } from './modules/department/department.route';
import { employeeRouter } from './modules/employee/employee.route';
import { financeOperationRouter } from './modules/finance-operation/finance-operation.route';
import { enrollmentRouter } from './modules/enrollment/enrollment.route';
import { healthRouter } from './modules/health/health.route';
import { historicalCorrectionRouter } from './modules/historical-correction/historical-correction.route';
import { intakeRouter } from './modules/intake/intake.route';
import { levelRouter } from './modules/level/level.route';
import { notificationRouter } from './modules/notification/notification.route';
import { paymentRouter } from './modules/payment/payment.route';
import { paymentPlanRouter } from './modules/payment-plan/payment-plan.route';
import { permissionRouter } from './modules/permission/permission.route';
import { placementTestRouter } from './modules/placement-test/placement-test.route';
import { positionRouter } from './modules/position/position.route';
import { programRouter } from './modules/program/program.route';
import { registrationRouter } from './modules/registration/registration.route';
import { reportRouter } from './modules/report/report.route';
import { roleRouter } from './modules/role/role.route';
import { rolloverRouter } from './modules/rollover/rollover.route';
import { schoolRouter } from './modules/school/school.route';
import { scoreRouter } from './modules/score/score.route';
import { skillRouter } from './modules/skill/skill.route';
import { studentTransferRouter } from './modules/student-transfer/student-transfer.route';
import { studentRouter } from './modules/student/student.route';
import { studyModeRouter } from './modules/study-mode/study-mode.route';
import { subjectRouter } from './modules/subject/subject.route';
import { systemSettingRouter } from './modules/system-setting/system-setting.route';
import { teacherAssignmentRouter } from './modules/teacher-assignment/teacher-assignment.route';
import { termResultRouter } from './modules/term-result/term-result.route';
import { timeSlotRouter } from './modules/time-slot/time-slot.route';
import { tuitionRouter } from './modules/tuition/tuition.route';
import { userRouter } from './modules/user/user.route';

export const createApp = (): express.Express => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false);

  app.use(requestLogger);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: { policy: 'no-referrer' },
      hsts:
        env.NODE_ENV === 'production'
          ? { maxAge: 31_536_000, includeSubDomains: false, preload: false }
          : false,
    }),
  );
  app.use(corsMiddleware);
  app.use('/api/v1', (_request, response, next) => {
    response.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use('/api/v1', createHttpsOnlyMiddleware(env.NODE_ENV === 'production'));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use('/api/v1', idempotencyMiddleware);
  app.use('/api/v1', etagMiddleware);
  app.use('/api/v1', apiRateLimiter);
  app.use('/api/v1', mutationRateLimiter);

  // OpenAPI 3.1 Specification and Interactive Explorer
  app.get('/api/v1/docs/openapi.json', (_request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.sendFile(path.resolve(__dirname, 'docs/openapi.json'));
  });

  app.get('/api/v1/docs', (_request, response) => {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SNP-SMS Enterprise API Documentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #1e293b; margin: 0; padding: 2.5rem; line-height: 1.6; }
    .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    .title { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.5rem; }
    .endpoint { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; }
    .method { font-weight: 700; color: #2563eb; font-size: 0.875rem; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #ffffff; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875rem; border: 1px solid #cbd5e1; }
    a { color: #2563eb; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">SNP-SMS Enterprise Modular Monolith REST API</h1>
    <p>Version 0.1.0 &middot; OpenAPI 3.1 Standard &middot; Cryptographic Ledger Verification</p>
    <div class="badge-container">
      <span class="badge">OpenAPI 3.1</span>
      <span class="badge">RFC 7807 Problem Details</span>
      <span class="badge">Idempotency-Key Support</span>
      <span class="badge">SHA-256 HMAC Signatures</span>
      <span class="badge">RFC 7232 ETags</span>
    </div>
  </div>

  <div class="card">
    <h3>Machine-Readable API Contract</h3>
    <p>The authoritative OpenAPI 3.1 JSON specification is accessible at: <a href="/api/v1/docs/openapi.json"><code>/api/v1/docs/openapi.json</code></a></p>
  </div>

  <h3>Core Architectural Endpoints</h3>
  <div class="endpoint">
    <span class="method">GET</span> <code>/api/v1/health</code> &mdash; Cluster & MongoDB Replica Set status
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/api/v1/reports/certificates/verify/:code</code> &mdash; Cryptographic ledger verification
  </div>
  <div class="endpoint">
    <span class="method">POST</span> <code>/api/v1/auth/login</code> &mdash; Staff, teacher, student authentication
  </div>
</body>
</html>`);
  });

  app.get('/', (_request, response) => {
    response.status(200).json({
      success: true,
      message: 'SNP-SMS Backend API',
      version: '0.1.0',
      apiBase: '/api/v1',
      health: '/api/v1/health',
    });
  });

  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/schools', schoolRouter);
  app.use('/api/v1/branches', branchRouter);
  app.use('/api/v1/departments', departmentRouter);
  app.use('/api/v1/positions', positionRouter);
  app.use('/api/v1/employees', employeeRouter);
  app.use('/api/v1/students', studentRouter);
  app.use('/api/v1/registrations', registrationRouter);
  app.use('/api/v1/reports', reportRouter);
  app.use('/api/v1/placement-tests', placementTestRouter);
  app.use('/api/v1/enrollments', enrollmentRouter);
  app.use('/api/v1/teacher-assignments', teacherAssignmentRouter);
  app.use('/api/v1/attendance', attendanceRouter);
  app.use('/api/v1/attendance-leaves', attendanceLeaveRouter);
  app.use('/api/v1/student-transfers', studentTransferRouter);
  app.use('/api/v1/assessments', assessmentRouter);
  app.use('/api/v1/scores', scoreRouter);
  app.use('/api/v1/term-results', termResultRouter);
  app.use('/api/v1/tuition-fees', tuitionRouter);
  app.use('/api/v1/payments', paymentRouter);
  app.use('/api/v1/payment-plans', paymentPlanRouter);
  app.use('/api/v1/finance-operations', financeOperationRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/roles', roleRouter);
  app.use('/api/v1/permissions', permissionRouter);
  app.use('/api/v1/programs', programRouter);
  app.use('/api/v1/levels', levelRouter);
  app.use('/api/v1/subjects', subjectRouter);
  app.use('/api/v1/system-settings', systemSettingRouter);
  app.use('/api/v1/curriculum', curriculumRouter);
  app.use('/api/v1/curricula', curriculumRouter);
  app.use('/api/v1/classes', classRouter);
  app.use('/api/v1/study-modes', studyModeRouter);
  app.use('/api/v1/time-slots', timeSlotRouter);
  app.use('/api/v1/class-schedules', classScheduleRouter);
  app.use('/api/v1/academic-years', academicYearRouter);
  app.use('/api/v1/academic-periods', academicPeriodRouter);
  app.use('/api/v1/intakes', intakeRouter);
  app.use('/api/v1/classrooms', classroomRouter);
  app.use('/api/v1/academic-rules', academicRuleRouter);
  app.use('/api/v1/rollovers', rolloverRouter);
  app.use('/api/v1/historical-corrections', historicalCorrectionRouter);
  app.use('/api/v1/skills', skillRouter);
  app.use('/api/v1/audit-logs', auditLogRouter);
  app.use('/api/v1/dashboard', dashboardRouter);
  app.use('/api/v1/announcements', announcementRouter);
  app.use('/api/v1/notifications', notificationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
