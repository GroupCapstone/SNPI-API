import { Types } from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_CORE_ROLES } from '../src/constants/permissions';
import { checkUserPermission } from '../src/middleware/authorize';
import { BranchModel } from '../src/modules/branch/branch.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { PaymentModel } from '../src/modules/payment/payment.model';
import type { OfficialDocumentType } from '../src/modules/report/report.model';
import { renderOfficialDocumentPdf } from '../src/modules/report/report.pdf';
import { ReportService } from '../src/modules/report/report.service';
import { SchoolModel } from '../src/modules/school/school.model';
import { StudentTransferModel } from '../src/modules/student-transfer/student-transfer.model';
import { StudentModel } from '../src/modules/student/student.model';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

const id = () => new Types.ObjectId();
const schoolId = id();
const branchId = id();
const studentId = id();
const sourceId = id();
const user: AuthUser = {
  userId: id().toString(),
  username: 'director',
  email: 'director@snp.edu.kh',
  schoolId: schoolId.toString(),
  roles: ['director'],
  permissions: ['report.view.all_branches', 'report_card.view.all_branches'],
  branchAccess: 'all',
};

const lean = (value: unknown) =>
  ({ lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(value) }) }) as never;

const populatedList = (value: unknown) => {
  const query: Record<string, ReturnType<typeof vi.fn>> = {};
  query.populate = vi.fn().mockReturnValue(query);
  query.sort = vi.fn().mockReturnValue(query);
  query.lean = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(value) });
  return query as never;
};

describe('V1.1A official reports and PDF documents', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('assigns report permissions to the approved roles and keeps teacher assigned-class scope', () => {
    const teacher = DEFAULT_CORE_ROLES.find((role) => role.code === 'teacher');
    const academic = DEFAULT_CORE_ROLES.find((role) => role.code === 'academic_officer');
    const finance = DEFAULT_CORE_ROLES.find((role) => role.code === 'finance_officer');
    const director = DEFAULT_CORE_ROLES.find((role) => role.code === 'director');
    expect(teacher?.permissions).toContain('report_card.view.assigned_class');
    expect(academic?.permissions).toContain('transcript.generate.own_branch');
    expect(finance?.permissions).toContain('receipt.print.own_branch');
    expect(director?.permissions).toContain('report.finance.view.all_branches');
    expect(
      checkUserPermission(teacher?.permissions ?? [], 'report_card.view.own_branch', ['teacher']),
    ).toBe(false);
  });

  it('denies cross-branch access to an existing official report', async () => {
    const repository = {
      findLatestBySource: vi.fn().mockResolvedValue({
        schoolId,
        branchId,
        payload: { classId: id().toString() },
      }),
    };
    const service = new ReportService(repository as never);
    const restricted = { ...user, branchAccess: [id().toString()] };
    await expect(service.getReportCardPreview(sourceId.toString(), restricted)).rejects.toThrow(
      'report branch',
    );
  });

  it('enforces teacher assigned-class access for report cards', async () => {
    const classId = id();
    const repository = {
      findLatestBySource: vi.fn().mockResolvedValue({
        schoolId,
        branchId,
        payload: { classId: classId.toString(), frozen: true },
      }),
    };
    const service = new ReportService(repository as never);
    const teacher: AuthUser = {
      ...user,
      employeeId: id().toString(),
      roles: ['teacher'],
      permissions: ['report_card.view.assigned_class'],
      branchAccess: [branchId.toString()],
    };
    vi.spyOn(TeacherAssignmentModel, 'exists').mockResolvedValue(null);
    await expect(service.getReportCardPreview(sourceId.toString(), teacher)).rejects.toThrow(
      'not assigned',
    );
  });

  it('returns the frozen official payload instead of recalculating historical data', async () => {
    const frozenPayload = { classId: id().toString(), summary: { average: 88 }, finalized: true };
    const document = { schoolId, branchId, payload: frozenPayload };
    const repository = { findLatestBySource: vi.fn().mockResolvedValue(document) };
    const termResultSpy = vi.spyOn(TermResultModel, 'findOne');
    const service = new ReportService(repository as never);
    const result = await service.getReportCardPreview(sourceId.toString(), user);
    expect(result).toMatchObject({
      document,
      payload: frozenPayload,
      snapshotSource: 'official_document',
    });
    expect(termResultSpy).not.toHaveBeenCalled();
  });

  it.each([
    'getReportCardPreview',
    'getCertificatePreview',
    'getReceiptPreview',
    'getInvoicePreview',
  ] as const)(
    'rejects foreign-school snapshots even with all-branch access: %s',
    async (method) => {
      const repository = {
        findLatestBySource: vi.fn().mockResolvedValue({ schoolId: id(), branchId, payload: {} }),
      };
      await expect(
        new ReportService(repository as never)[method](sourceId.toString(), user),
      ).rejects.toThrow('report school');
    },
  );

  it('does not combine branch-wide view permission with assigned-class generation', async () => {
    const repository = {
      findLatestBySource: vi
        .fn()
        .mockResolvedValue({ schoolId, branchId, payload: { classId: id().toString() } }),
    };
    const actor = {
      ...user,
      employeeId: id().toString(),
      permissions: ['report_card.view.all_branches', 'report_card.generate.assigned_class'],
    };
    vi.spyOn(TeacherAssignmentModel, 'exists').mockResolvedValue(null);
    await expect(
      new ReportService(repository as never).generateReportCard(sourceId.toString(), actor),
    ).rejects.toThrow('not assigned');
  });

  it('does not widen report access using unrelated class-edit permission', async () => {
    const repository = {
      findLatestBySource: vi
        .fn()
        .mockResolvedValue({ schoolId, branchId, payload: { classId: id().toString() } }),
    };
    const actor = {
      ...user,
      employeeId: id().toString(),
      permissions: ['class.edit.own_branch', 'report_card.view.assigned_class'],
      branchAccess: [branchId.toString()],
    };
    const assignments = vi.spyOn(TeacherAssignmentModel, 'exists').mockResolvedValue(null);
    await expect(
      new ReportService(repository as never).getReportCardPreview(sourceId.toString(), actor),
    ).rejects.toThrow('not assigned');
    expect(assignments).toHaveBeenCalledWith(
      expect.objectContaining({ schoolId: user.schoolId, branchId: { $in: actor.branchAccess } }),
    );
  });

  it('allows branch-wide generators without a separate view permission', async () => {
    const document = { schoolId, branchId, payload: { classId: id().toString() } };
    const repository = { findLatestBySource: vi.fn().mockResolvedValue(document) };
    await expect(
      new ReportService(repository as never).generateReportCard(sourceId.toString(), {
        ...user,
        permissions: ['report_card.generate.all_branches'],
      }),
    ).resolves.toEqual(document);
  });

  it('builds receipt values from preserved payment history', async () => {
    const paymentId = id();
    const feeId = id();
    vi.spyOn(PaymentModel, 'findOne').mockReturnValue(
      lean({
        _id: paymentId,
        receiptNumber: 'PAY-000123',
        schoolId,
        branchId,
        academicYearId: id(),
        studentId,
        tuitionFeeId: feeId,
        amountDue: 250,
        amountPaid: 100,
        discountAmount: 20,
        balanceRemaining: 130,
        currency: 'USD',
        paymentMethod: 'cash',
        paymentDate: new Date('2026-08-01'),
        status: 'partial',
        updatedAt: new Date('2026-08-01'),
      }),
    );
    vi.spyOn(SchoolModel, 'findOne').mockReturnValue(
      lean({ _id: schoolId, nameEn: 'SNP School', nameKh: 'សាលា' }),
    );
    vi.spyOn(BranchModel, 'findOne').mockReturnValue(
      lean({ _id: branchId, branchCode: 'MB', branchNameEn: 'Main Branch' }),
    );
    vi.spyOn(StudentModel, 'findOne').mockReturnValue(
      lean({ _id: studentId, studentId: 'STU-000001', firstName: 'Dara', lastName: 'Chan' }),
    );
    vi.spyOn(TuitionFeeModel, 'findOne').mockReturnValue(
      lean({ _id: feeId, feeCode: 'FEE-01', feeName: 'Term Tuition' }),
    );
    const enrollmentQuery = {
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue({ enrollmentCode: 'ENR-000001' }),
        }),
      }),
    };
    vi.spyOn(EnrollmentModel, 'findOne').mockReturnValue(enrollmentQuery as never);
    const repository = { findLatestBySource: vi.fn().mockResolvedValue(null) };
    const result = await new ReportService(repository as never).getReceiptPreview(
      paymentId.toString(),
      user,
    );
    expect(result.payload.finance).toMatchObject({
      receiptNumber: 'PAY-000123',
      invoiceReference: 'INV-000123',
      amountDue: 250,
      amountPaid: 100,
      total: 230,
      paid: 100,
      discount: 20,
      balance: 130,
      status: 'partial',
    });
  });

  it('builds transcript history from enrollments, term results, and promotion records', async () => {
    const academicYear = { _id: id(), name: '2026' };
    const period = { _id: id(), name: 'Term 1' };
    const program = { _id: id(), nameEn: 'English' };
    const level = { _id: id(), name: 'Elementary' };
    const classDoc = { _id: id(), className: 'E1' };
    vi.spyOn(StudentModel, 'findOne').mockReturnValue(
      lean({
        _id: studentId,
        schoolId,
        branchId,
        studentId: 'STU-000001',
        firstName: 'Dara',
        lastName: 'Chan',
        khmerName: 'ដារ៉ា',
        dateOfBirth: new Date('2010-01-01'),
        admissionDate: new Date('2026-01-01'),
      }),
    );
    vi.spyOn(SchoolModel, 'findOne').mockReturnValue(
      lean({ _id: schoolId, nameEn: 'SNP School', nameKh: 'សាលា' }),
    );
    vi.spyOn(BranchModel, 'findOne').mockReturnValue(
      lean({ _id: branchId, branchCode: 'MB', branchNameEn: 'Main Branch' }),
    );
    vi.spyOn(EnrollmentModel, 'find').mockReturnValue(
      populatedList([
        {
          enrollmentCode: 'ENR-1',
          academicYearId: academicYear,
          academicPeriodId: period,
          programId: program,
          levelId: level,
          classId: classDoc,
          branchId: { branchNameEn: 'Main Branch' },
          status: 'completed',
          enrollmentDate: new Date('2026-01-01'),
        },
      ]),
    );
    vi.spyOn(TermResultModel, 'find').mockReturnValue(
      populatedList([
        {
          academicYearId: academicYear,
          academicPeriodId: period,
          programId: program,
          levelId: level,
          classId: classDoc,
          averageScore: 88,
          gpa: 3,
          letterGrade: 'B',
          resultStatus: 'PASSED',
          promotionStatus: 'PROMOTED',
          isCompleted: true,
          subjectResults: [{ name: 'English', average: 88 }],
        },
      ]),
    );
    vi.spyOn(StudentTransferModel, 'find').mockReturnValue(populatedList([]));
    const result = await new ReportService({} as never).getTranscriptPreview(
      studentId.toString(),
      user,
    );
    expect(result.payload.enrollments).toEqual([
      expect.objectContaining({ code: 'ENR-1', level: 'Elementary', status: 'completed' }),
    ]);
    expect(result.payload.results).toEqual([
      expect.objectContaining({ average: 88, grade: 'B', promotion: 'PROMOTED' }),
    ]);
    expect(result.payload.promotionHistory).toEqual([
      expect.objectContaining({ status: 'PROMOTED', fromLevel: 'Elementary' }),
    ]);
  });

  it('rejects invalid report source IDs safely', async () => {
    const service = new ReportService({} as never);
    await expect(service.getReportCardPreview('invalid', user)).rejects.toThrow('not found');
    await expect(service.getTranscriptPreview('invalid', user)).rejects.toThrow('not found');
    await expect(service.getReceiptPreview('invalid', user)).rejects.toThrow('not found');
  });

  it('passes authorized branch filters into official document history queries', async () => {
    const repository = {
      findDocuments: vi
        .fn()
        .mockResolvedValue({ data: [], total: 0, page: 1, limit: 20, totalPages: 1 }),
    };
    const restricted = { ...user, branchAccess: [branchId.toString()] };
    await new ReportService(repository as never).getDocuments({}, restricted);
    expect(repository.findDocuments).toHaveBeenCalledWith(
      expect.objectContaining({ authorizedBranchIds: [branchId.toString()] }),
    );
  });

  it('builds branch-scoped 12-month attendance, ranking, tuition, and trend controls', async () => {
    const secondStudentId = id();
    const enrollmentId = id();
    const secondEnrollmentId = id();
    const classId = id();
    const academicYearId = id();
    const programId = id();
    const levelId = id();
    const sessionId = id();
    const assessmentId = id();
    const feeId = id();
    const repository = {
      getMonthlySources: vi.fn().mockResolvedValue({
        studentIds: [studentId.toString(), secondStudentId.toString()],
        page: 1,
        limit: 100,
        enrollments: [
          {
            _id: enrollmentId,
            studentId,
            branchId,
            academicYearId,
            programId,
            levelId,
            classId,
            enrollmentDate: new Date('2020-01-02'),
          },
          {
            _id: secondEnrollmentId,
            studentId: secondStudentId,
            branchId,
            academicYearId,
            programId,
            levelId,
            classId,
            enrollmentDate: new Date('2020-01-03'),
          },
        ],
        students: [
          {
            _id: studentId,
            studentId: 'STU-000001',
            firstName: 'Dara',
            lastName: 'Chan',
            khmerName: 'ដារ៉ា',
          },
        ],
        sessions: [{ _id: sessionId, date: new Date('2020-01-10') }],
        attendanceRecords: [
          { attendanceSessionId: sessionId, studentId, status: 'late' },
          { attendanceSessionId: sessionId, studentId, status: 'absent' },
        ],
        assessments: [{ _id: assessmentId, assessmentDate: new Date('2020-01-20') }],
        scores: [{ assessmentId, studentId, percentage: 88, isAbsent: false }],
        tuitionFees: [
          {
            _id: feeId,
            branchId,
            academicYearId,
            programId,
            levelId,
            amount: 100,
            currency: 'USD',
          },
        ],
        payments: [
          {
            studentId,
            tuitionFeeId: feeId,
            paymentDate: new Date('2020-01-05'),
            amountPaid: 60,
            receiptNumber: 'RCT-001',
            currency: 'USD',
          },
        ],
        admissions: [{ admissionDate: new Date('2020-01-02') }],
        newEnrollments: [{ enrollmentDate: new Date('2020-01-02') }],
        transfers: [{ transferDate: new Date('2020-01-25') }],
        dropouts: [{ endDate: new Date('2020-01-27') }],
      }),
    };

    const result = await new ReportService(repository as never).getMonthlyOverview(
      { year: 2020, branchId: branchId.toString() },
      user,
    );

    expect(repository.getMonthlySources).toHaveBeenCalledWith(
      expect.objectContaining({ schoolId: user.schoolId, branchId: branchId.toString() }),
    );
    expect(result.attendance.months).toHaveLength(12);
    expect(result.attendance.months[0]).toMatchObject({ late: 1, absent: 1, rate: 50 });
    expect(result.rankings[0]?.cells[0]).toMatchObject({ average: 88, rank: 1 });
    expect(result.payments[0]?.cells[0]).toMatchObject({
      status: 'partial',
      expected: 100,
      paid: 60,
      balance: 40,
    });
    expect(result.trends[0]).toMatchObject({
      revenueUsd: 60,
      admissions: 1,
      enrollments: 1,
      transfers: 1,
      dropouts: 1,
    });
    expect(result.payments).toHaveLength(1);
    expect(result.summary).toMatchObject({ students: 2, overdueAccounts: 2 });

    const monthResult = await new ReportService(repository as never).getMonthlyOverview(
      { year: 2020, month: 1, branchId: branchId.toString() },
      user,
    );
    expect(monthResult.selectedMonth).toBe(1);
    expect(monthResult.selectedMonthSummary).toMatchObject({
      month: 1,
      monthName: 'January',
      monthNameKh: 'មករា',
      attendanceRate: 50,
      averageScore: 88,
      totalRevenueUsd: 60,
      partialCount: 1,
    });
  });

  it('denies a monthly report requested for an unauthorized branch', async () => {
    const repository = { getMonthlySources: vi.fn() };
    const restricted = { ...user, branchAccess: [branchId.toString()] };
    await expect(
      new ReportService(repository as never).getMonthlyOverview(
        { year: 2026, branchId: id().toString() },
        restricted,
      ),
    ).rejects.toThrow('monthly reports');
    expect(repository.getMonthlySources).not.toHaveBeenCalled();
  });

  it.each<OfficialDocumentType>(['report_card', 'transcript', 'payment_receipt', 'invoice'])(
    'generates a valid A4 PDF for %s',
    async (type) => {
      const pdf = await renderOfficialDocumentPdf(type, 'DOC-000001', new Date('2026-08-31'), {
        school: { nameEn: 'SNP School', nameKh: 'សាលាអេសអិនភី' },
        branch: { nameEn: 'Main Branch' },
        student: { studentId: 'STU-1', name: 'Dara Chan' },
        academic: {
          academicYear: '2026',
          period: 'Term 1',
          program: 'English',
          level: 'E1',
          className: 'A',
        },
        subjects: [
          { code: 'ENG', name: 'English', total: 88, average: 88, grade: 'B', passed: true },
        ],
        summary: { average: 88, gpa: 3, grade: 'B', result: 'PASSED' },
        attendance: { rate: 95, present: 19, totalSessions: 20 },
        approval: { teacher: 'Teacher Dara' },
        results: [
          {
            academicYear: '2026',
            period: 'Term 1',
            level: 'E1',
            average: 88,
            grade: 'B',
            promotion: 'PROMOTED',
          },
        ],
        enrollments: [],
        finance: {
          receiptNumber: 'PAY-1',
          invoiceNumber: 'INV-1',
          amountDue: 250,
          amountPaid: 250,
          balance: 0,
          status: 'paid',
        },
      });
      expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
      expect(pdf.length).toBeGreaterThan(1_000);
    },
  );
});
