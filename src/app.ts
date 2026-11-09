import path from 'node:path';

import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { APP_VERSION } from './contracts';

import { env } from './config/env';
import { verifyTrustedClient } from './middleware/client-auth';
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
import { architectureAssessmentRouter } from './modules/architecture-assessment/architecture-assessment.route';
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
  app.set('json spaces', 2);

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
    response.setHeader('Vary', 'Accept, Origin');
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
  app.use('/api/v1', verifyTrustedClient);

  // OpenAPI 3.1 Specification and Interactive REST API Explorer (Local Development Only)
  if (env.NODE_ENV !== 'production') {
    const serveOpenApiJson = (_request: express.Request, response: express.Response) => {
      response.setHeader('Content-Type', 'application/json');
      response.sendFile(path.resolve(__dirname, 'docs/openapi.json'));
    };

    const serveDocsExplorer = (_request: express.Request, response: express.Response) => {
      response.removeHeader('Content-Security-Policy');
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.sendFile(path.resolve(__dirname, 'docs/explorer.html'));
    };

    app.get(['/api/v1/docs/openapi.json', '/docs/openapi.json'], serveOpenApiJson);
    app.get(['/api/v1/docs', '/docs', '/api-docs', '/document'], serveDocsExplorer);
  }

  app.get('/', (request, response) => {
    const baseUrl = `${request.protocol}://${request.get('host') ?? 'localhost'}`;

    response.status(200).json({
      success: true,
      message: 'SNPI API',
      status: 'online',
      code: 200,
      version: APP_VERSION,
      apiBase: '/api/v1',
      health_url: `${baseUrl}/api/v1/health`,
      repository_url: 'https://github.com/GroupCapstone/SNPI-API',
      credits: 'shiliaiwei, Tan-Saphea, madeincambodia',
      documentation_url: `${baseUrl}/document`,
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
  app.use('/api/v1/architecture-assessment', architectureAssessmentRouter);
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
