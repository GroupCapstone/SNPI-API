import fs from 'node:fs';
import path from 'node:path';

interface EndpointDef {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  tag: string;
  summary: string;
  public?: boolean;
  hasBody?: boolean;
  pathParam?: string;
}

const endpoints: EndpointDef[] = [
  {
    path: '/health',
    method: 'get',
    tag: 'System & Health',
    summary: 'System Health & MongoDB Replica Set Status',
    public: true,
  },
  {
    path: '/auth/login',
    method: 'post',
    tag: 'Authentication',
    summary: 'Staff, Teacher & Student Authentication',
    public: true,
    hasBody: true,
  },
  {
    path: '/auth/me',
    method: 'get',
    tag: 'Authentication',
    summary: 'Current Authenticated User Profile & RBAC Scopes',
  },
  {
    path: '/schools',
    method: 'get',
    tag: 'Institutional Core',
    summary: 'List Institutional School Entities',
  },
  {
    path: '/branches',
    method: 'get',
    tag: 'Institutional Core',
    summary: 'List Campus Branches & Locations',
  },
  {
    path: '/departments',
    method: 'get',
    tag: 'Institutional Core',
    summary: 'List Academic & Administrative Departments',
  },
  {
    path: '/positions',
    method: 'get',
    tag: 'Institutional Core',
    summary: 'List Organizational Staff Positions',
  },
  {
    path: '/employees',
    method: 'get',
    tag: 'Human Resources',
    summary: 'List Faculty & Administrative Employees',
  },
  {
    path: '/teacher-assignments',
    method: 'get',
    tag: 'Human Resources',
    summary: 'List Teacher Class & Subject Assignments',
  },
  {
    path: '/students',
    method: 'get',
    tag: 'Student Lifecycle',
    summary: 'List Enrolled Student Profiles',
  },
  {
    path: '/registrations',
    method: 'get',
    tag: 'Student Lifecycle',
    summary: 'List Student Intake Registrations',
  },
  {
    path: '/placement-tests',
    method: 'get',
    tag: 'Student Lifecycle',
    summary: 'List Placement Test Evaluations & Scores',
  },
  {
    path: '/enrollments',
    method: 'get',
    tag: 'Student Lifecycle',
    summary: 'List Active Class & Program Enrollments',
  },
  {
    path: '/student-transfers',
    method: 'get',
    tag: 'Student Lifecycle',
    summary: 'List Inter-Branch & Inter-Class Transfers',
  },
  {
    path: '/programs',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Academic Degree & Diploma Programs',
  },
  {
    path: '/levels',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Academic Grade & Study Levels',
  },
  {
    path: '/subjects',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Curriculum Course Subjects',
  },
  {
    path: '/curriculum',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Program Curricula & Course Mappings',
  },
  {
    path: '/study-modes',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Study Modes (Full-Time, Part-Time, Weekend)',
  },
  {
    path: '/skills',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Vocational Skills & Competencies',
  },
  {
    path: '/intakes',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Academic Cohort Intakes',
  },
  {
    path: '/academic-rules',
    method: 'get',
    tag: 'Academics & Rules',
    summary: 'List Academic Progression & Grading Rules',
  },
  {
    path: '/academic-years',
    method: 'get',
    tag: 'Scheduling & Facilities',
    summary: 'List Academic Years & Calendars',
  },
  {
    path: '/academic-periods',
    method: 'get',
    tag: 'Scheduling & Facilities',
    summary: 'List Semesters, Terms & Quarters',
  },
  {
    path: '/classrooms',
    method: 'get',
    tag: 'Scheduling & Facilities',
    summary: 'List Physical Classrooms, Labs & Facilities',
  },
  {
    path: '/classes',
    method: 'get',
    tag: 'Scheduling & Facilities',
    summary: 'List Active Class Cohorts',
  },
  {
    path: '/time-slots',
    method: 'get',
    tag: 'Scheduling & Facilities',
    summary: 'List Standard Daily Time Slots',
  },
  {
    path: '/class-schedules',
    method: 'get',
    tag: 'Scheduling & Facilities',
    summary: 'List Master Timetable Class Schedules',
  },
  {
    path: '/attendance',
    method: 'get',
    tag: 'Attendance & Leaves',
    summary: 'List Student Daily Attendance Records',
  },
  {
    path: '/attendance-leaves',
    method: 'get',
    tag: 'Attendance & Leaves',
    summary: 'List Student & Faculty Leave Requests',
  },
  {
    path: '/assessments',
    method: 'get',
    tag: 'Examinations & Grading',
    summary: 'List Examination & Assessment Schedules',
  },
  {
    path: '/scores',
    method: 'get',
    tag: 'Examinations & Grading',
    summary: 'List Assessment Scores & Grades',
  },
  {
    path: '/term-results',
    method: 'get',
    tag: 'Examinations & Grading',
    summary: 'List Final Term GPA & Evaluation Results',
  },
  {
    path: '/tuition-fees',
    method: 'get',
    tag: 'Finance & Billing',
    summary: 'List Tuition Fee Schedules & Structures',
  },
  {
    path: '/payments',
    method: 'get',
    tag: 'Finance & Billing',
    summary: 'List Student Payment Transactions & Receipts',
  },
  {
    path: '/payment-plans',
    method: 'get',
    tag: 'Finance & Billing',
    summary: 'List Installment & Scheduled Payment Plans',
  },
  {
    path: '/finance-operations/discount-policies',
    method: 'get',
    tag: 'Finance & Billing',
    summary: 'List Scholarship & Tuition Discount Policies',
  },
  {
    path: '/finance-operations/cashier-shifts',
    method: 'get',
    tag: 'Finance & Billing',
    summary: 'List Cashier Shift Logs & Reconciliation',
  },
  { path: '/users', method: 'get', tag: 'Security & RBAC', summary: 'List System User Accounts' },
  { path: '/roles', method: 'get', tag: 'Security & RBAC', summary: 'List RBAC Security Roles' },
  {
    path: '/permissions',
    method: 'get',
    tag: 'Security & RBAC',
    summary: 'List All 356 Granular Permission Codes',
  },
  {
    path: '/permissions/grouped',
    method: 'get',
    tag: 'Security & RBAC',
    summary: 'List Grouped Permissions Across 47 Domains',
  },
  {
    path: '/notifications',
    method: 'get',
    tag: 'Communications',
    summary: 'List User Push & In-App Notifications',
  },
  {
    path: '/announcements',
    method: 'get',
    tag: 'Communications',
    summary: 'List School-Wide Broadcast Announcements',
  },
  {
    path: '/audit-logs',
    method: 'get',
    tag: 'Audit & Governance',
    summary: 'List Cryptographic Audit Trail Logs',
  },
  {
    path: '/system-settings',
    method: 'get',
    tag: 'Audit & Governance',
    summary: 'List Core System Settings & Configuration',
  },
  {
    path: '/rollovers',
    method: 'get',
    tag: 'Audit & Governance',
    summary: 'List Academic Year Transition Rollovers',
  },
  {
    path: '/historical-corrections',
    method: 'get',
    tag: 'Audit & Governance',
    summary: 'List Immutable Historical Correction Records',
  },
  {
    path: '/architecture-assessment/metrics/radar',
    method: 'get',
    tag: 'Audit & Governance',
    summary: 'Architecture Assessment Radar Metrics',
  },
  {
    path: '/reports/catalog',
    method: 'get',
    tag: 'Reports & Analytics',
    summary: 'List Available Official Report Templates',
  },
  {
    path: '/reports/documents',
    method: 'get',
    tag: 'Reports & Analytics',
    summary: 'List Generated Report Artifacts & PDFs',
  },
  {
    path: '/reports/monthly-overview',
    method: 'get',
    tag: 'Reports & Analytics',
    summary: 'Generate High-Level Monthly Executive Overview',
  },
  {
    path: '/reports/certificates/verify/{code}',
    method: 'get',
    tag: 'Reports & Analytics',
    summary: 'Cryptographic Certificate Ledger Verification',
    public: true,
    pathParam: 'code',
  },
  {
    path: '/dashboard/action-items',
    method: 'get',
    tag: 'Dashboards',
    summary: 'Actionable Administrative Action Items',
  },
  {
    path: '/dashboard/finance-pulse',
    method: 'get',
    tag: 'Dashboards',
    summary: 'Real-Time Financial Revenue & Outstanding Pulse',
  },
  {
    path: '/dashboard/student-affairs-pulse',
    method: 'get',
    tag: 'Dashboards',
    summary: 'Student Enrollment, Attendance & Retention Pulse',
  },
  {
    path: '/dashboard/hr-pulse',
    method: 'get',
    tag: 'Dashboards',
    summary: 'Faculty Attendance, Staffing & Workload Pulse',
  },
  {
    path: '/dashboard/academic-honor-roll',
    method: 'get',
    tag: 'Dashboards',
    summary: 'Top Performing Academic Honor Roll Students',
  },
];

const paths: Record<string, any> = {};

for (const ep of endpoints) {
  if (!paths[ep.path]) paths[ep.path] = {};

  const operation: Record<string, any> = {
    summary: ep.summary,
    tags: [ep.tag],
    responses: {
      '200': {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Operation completed successfully' },
                data: { type: 'object' },
              },
            },
          },
        },
      },
      '401': {
        description: 'Unauthorized access',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ProblemDetails' },
          },
        },
      },
    },
  };

  if (!ep.public) {
    operation.security = [{ BearerAuth: [] }];
  }

  const parameters: any[] = [];
  if (ep.pathParam) {
    parameters.push({
      name: ep.pathParam,
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Document or entity identifier',
    });
  }

  if (ep.method === 'get' && !ep.pathParam && ep.path !== '/health') {
    parameters.push(
      {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 1 },
        description: 'Page number for pagination',
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 20 },
        description: 'Number of items per page',
      },
    );
  }

  if (parameters.length > 0) {
    operation.parameters = parameters;
  }

  if (ep.hasBody) {
    operation.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              identifier: { type: 'string', example: '<AUTHORIZED_USER_EMAIL>' },
              password: { type: 'string', example: '<SECURE_AUTHENTICATION_CREDENTIAL>' },
            },
            required: ['identifier', 'password'],
          },
        },
      },
    };
  }

  paths[ep.path][ep.method] = operation;
}

const targetPath = path.resolve(__dirname, '../src/docs/openapi.json');
const existing = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
existing.paths = paths;
fs.writeFileSync(targetPath, JSON.stringify(existing, null, 2) + '\n');
console.log(
  '[PASSED] Successfully updated openapi.json with ' + Object.keys(paths).length + ' paths.',
);
