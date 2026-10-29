import { AssessmentModel } from '../assessment/assessment.model';
import { AttendanceRecordModel } from '../attendance/attendance-record.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { ClassModel } from '../class/class.model';
import { EmployeeModel } from '../employee/employee.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { HistoricalCorrectionModel } from '../historical-correction/historical-correction.model';
import { PaymentModel } from '../payment/payment.model';
import { outstandingPaymentAccounts } from '../payment/payment-account';
import { PlacementTestModel } from '../placement-test/placement-test.model';
import { RegistrationModel } from '../registration/registration.model';
import { ScoreModel } from '../score/score.model';
import { StudentModel } from '../student/student.model';
import { SystemSettingModel } from '../system-setting/system-setting.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import { TermResultModel } from '../term-result/term-result.model';
import type {
  AcademicHonorRollResponse,
  ClassPerformanceItem,
  GradeDistributionBucket,
  HonorRollStudentItem,
} from './dashboard.types';

export class DashboardRepository {
  public async findUnmarkedAttendanceClasses(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
  }) {
    const classFilter: Record<string, unknown> = {
      status: 'active',
      isDeleted: false,
    };
    if (params.schoolId) classFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      classFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) classFilter.academicYearId = params.academicYearId;

    const classes = await ClassModel.find(classFilter)
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .lean();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const attendanceFilter: Record<string, unknown> = {
      date: { $gte: startOfToday, $lte: endOfToday },
      isDeleted: false,
    };
    if (params.schoolId) attendanceFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      attendanceFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) attendanceFilter.academicYearId = params.academicYearId;

    const takenToday = await AttendanceModel.find(attendanceFilter).distinct('classId');
    const markedClassIds = new Set(takenToday.map((id) => String(id)));
    const unmarkedClasses = classes.filter((cls) => !markedClassIds.has(String(cls._id)));
    const unmarkedClassIds = unmarkedClasses.map((cls) => cls._id);

    const assignments =
      unmarkedClassIds.length > 0
        ? await TeacherAssignmentModel.find({
            classId: { $in: unmarkedClassIds },
            ...(params.schoolId ? { schoolId: params.schoolId } : {}),
            status: 'active',
            isDeleted: false,
          })
            .populate('employeeId', 'firstName lastName khmerName phone')
            .lean()
        : [];

    const teacherMap = new Map<string, string>();
    for (const a of assignments) {
      const clsId = String(a.classId);
      const emp = a.employeeId as unknown as {
        firstName?: string;
        lastName?: string;
        khmerName?: string;
        phone?: string;
      } | null;
      if (emp && !teacherMap.has(clsId)) {
        const name =
          [emp.firstName, emp.lastName].filter(Boolean).join(' ') || emp.khmerName || 'Teacher';
        teacherMap.set(clsId, `${name}${emp.phone ? ` (${emp.phone})` : ''}`);
      }
    }

    return unmarkedClasses.map((cls) => ({
      ...cls,
      teacherName: teacherMap.get(String(cls._id)),
    }));
  }

  public async findUnsubmittedAssessments(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
  }) {
    const now = new Date();
    const assessmentFilter: Record<string, unknown> = {
      status: { $in: ['draft', 'published'] },
      isDeleted: false,
      assessmentDate: { $lte: now },
    };
    if (params.schoolId) assessmentFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      assessmentFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) assessmentFilter.academicYearId = params.academicYearId;

    return AssessmentModel.find(assessmentFilter)
      .populate('classId', 'className')
      .populate('subjectId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .sort({ assessmentDate: 1 })
      .limit(20)
      .lean();
  }

  public async findOverdueDebts(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
  }) {
    const now = new Date();
    const paymentFilter: Record<string, unknown> = {
      status: { $ne: 'voided' },
      isDeleted: false,
    };
    if (params.schoolId) paymentFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      paymentFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) paymentFilter.academicYearId = params.academicYearId;

    const receipts = await PaymentModel.find(paymentFilter)
      .populate('studentId', 'studentId firstName lastName khmerName')
      .populate('tuitionFeeId', 'billingCycle')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .sort({ dueDate: 1 })
      .lean();
    return outstandingPaymentAccounts(receipts)
      .filter((payment) => payment.dueDate && new Date(payment.dueDate) < now)
      .slice(0, 20);
  }

  public async findPendingApprovals(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
  }) {
    const correctionFilter: Record<string, unknown> = {
      status: 'pending',
      isDeleted: false,
    };
    if (params.schoolId) correctionFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      correctionFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) correctionFilter.academicYearId = params.academicYearId;

    return HistoricalCorrectionModel.find(correctionFilter)
      .populate('studentId', 'studentId firstName lastName khmerName')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();
  }

  public async findNearCapacityClasses(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
  }) {
    const classFilter: Record<string, unknown> = {
      status: 'active',
      isDeleted: false,
      capacity: { $gt: 0 },
      $expr: {
        $gte: [{ $ifNull: ['$currentEnrollmentCount', 0] }, { $multiply: ['$capacity', 0.9] }],
      },
    };
    if (params.schoolId) classFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      classFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) classFilter.academicYearId = params.academicYearId;

    return ClassModel.find(classFilter)
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .sort({ currentEnrollmentCount: -1 })
      .limit(20)
      .lean();
  }

  public async getFinancePulse(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
    year?: number;
    month?: number;
  }) {
    const now = new Date();
    const currentYear = params.year || now.getFullYear();
    const selectedMonth = params.month || now.getMonth() + 1;
    const currencyCodes = ['USD', 'KHR'] as const;
    type CurrencyCode = (typeof currencyCodes)[number];
    const normalizeCurrency = (value: unknown): CurrencyCode => (value === 'KHR' ? 'KHR' : 'USD');
    const roundMoney = (value: number) => Math.round(value * 100) / 100;
    const addCurrencyAmount = (
      map: Map<CurrencyCode, { amount: number; transactionCount: number }>,
      currency: CurrencyCode,
      amount: number,
      transactionCount = 0,
    ) => {
      const existing = map.get(currency) || { amount: 0, transactionCount: 0 };
      existing.amount += amount;
      existing.transactionCount += transactionCount;
      map.set(currency, existing);
    };
    const toCurrencySummary = (
      map: Map<CurrencyCode, { amount: number; transactionCount: number }>,
    ) =>
      currencyCodes
        .map((currency) => {
          const value = map.get(currency);
          return value
            ? {
                currency,
                amount: roundMoney(value.amount),
                transactionCount: value.transactionCount || undefined,
              }
            : null;
        })
        .filter((value): value is NonNullable<typeof value> => value !== null);

    // 1. Today's Reconciliation
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayFilter: Record<string, unknown> = {
      paymentDate: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'voided' },
      isDeleted: false,
    };
    if (params.schoolId) todayFilter.schoolId = params.schoolId;
    if (params.academicYearId) todayFilter.academicYearId = params.academicYearId;
    if (params.branchIds) {
      todayFilter.branchId = { $in: params.branchIds };
    }

    const todayPayments = await PaymentModel.find(todayFilter).lean();
    let todayTotal = 0;
    const splitMap = new Map<
      string,
      { method: string; currency: CurrencyCode; total: number; count: number }
    >();
    const todayCurrencyMap = new Map<CurrencyCode, { amount: number; transactionCount: number }>();
    for (const p of todayPayments) {
      const amt = Number(p.amountPaid || 0);
      const currency = normalizeCurrency(p.currency);
      // Keep the legacy total field comparable for existing USD consumers.
      // The authoritative multi-currency totals are returned in totalsByCurrency.
      if (currency === 'USD') todayTotal += amt;
      const rawMethod = String(p.paymentMethod || 'cash').toLowerCase();
      const method = rawMethod === 'aba_pay' ? 'aba' : rawMethod;
      const key = `${method}:${currency}`;
      const existing = splitMap.get(key) || { method, currency, total: 0, count: 0 };
      existing.total += amt;
      existing.count += 1;
      splitMap.set(key, existing);
      addCurrencyAmount(todayCurrencyMap, currency, amt, 1);
    }

    const todaySplits = Array.from(splitMap.values()).map((data) => ({
      method: data.method,
      totalAmount: roundMoney(data.total),
      transactionCount: data.count,
      currency: data.currency,
    }));

    // 2. Overdue Aging Buckets
    const overdueFilter: Record<string, unknown> = {
      status: { $ne: 'voided' },
      isDeleted: false,
    };
    if (params.schoolId) overdueFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      overdueFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) overdueFilter.academicYearId = params.academicYearId;

    const accountReceipts = await PaymentModel.find(overdueFilter)
      .populate('studentId', 'studentId firstName lastName khmerName guardians')
      .populate('tuitionFeeId', 'feeName feeCode billingCycle')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .sort({ dueDate: 1 })
      .lean();

    const overduePayments = outstandingPaymentAccounts(accountReceipts).filter(
      (payment) => payment.dueDate && new Date(payment.dueDate) < now,
    );

    const overdueStudentIds = overduePayments
      .map((payment) => {
        const student = payment.studentId as { _id?: unknown } | undefined;
        return student?._id ? String(student._id) : undefined;
      })
      .filter((id): id is string => Boolean(id));
    const currentEnrollments =
      overdueStudentIds.length > 0
        ? await EnrollmentModel.find({
            studentId: { $in: overdueStudentIds },
            ...(params.schoolId ? { schoolId: params.schoolId } : {}),
            ...(params.branchIds ? { branchId: { $in: params.branchIds } } : {}),
            isDeleted: false,
            status: { $in: ['enrolled', 'active'] },
            ...(params.academicYearId ? { academicYearId: params.academicYearId } : {}),
          })
            .populate('classId', 'className classCode')
            .sort({ createdAt: -1 })
            .lean()
        : [];
    const classByStudentId = new Map<string, string>();
    for (const enrollment of currentEnrollments) {
      const studentId = String(enrollment.studentId);
      if (classByStudentId.has(studentId)) continue;
      const currentClass = enrollment.classId as
        { className?: string; classCode?: string } | undefined;
      const classLabel = currentClass?.className || currentClass?.classCode;
      if (classLabel) classByStudentId.set(studentId, classLabel);
    }

    let b1Count = 0;
    let b1Amount = 0;
    let b2Count = 0;
    let b2Amount = 0;
    let b3Count = 0;
    let b3Amount = 0;
    const overdueCurrencyMaps = [
      new Map<CurrencyCode, { amount: number; transactionCount: number }>(),
      new Map<CurrencyCode, { amount: number; transactionCount: number }>(),
      new Map<CurrencyCode, { amount: number; transactionCount: number }>(),
    ];
    const overdueTotalByCurrency = new Map<
      CurrencyCode,
      { amount: number; transactionCount: number }
    >();

    const overdueStudentsList = [];

    for (const p of overduePayments) {
      const due = p.dueDate ? new Date(p.dueDate) : now;
      const daysOverdue = Math.max(
        1,
        Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)),
      );
      const balance = Number(p.balanceRemaining || 0);
      const currency = normalizeCurrency(p.currency);
      const bucketIndex = daysOverdue <= 15 ? 0 : daysOverdue <= 30 ? 1 : 2;
      addCurrencyAmount(overdueCurrencyMaps[bucketIndex]!, currency, balance, 1);
      addCurrencyAmount(overdueTotalByCurrency, currency, balance, 1);

      if (daysOverdue <= 15) {
        b1Count++;
        if (currency === 'USD') b1Amount += balance;
      } else if (daysOverdue <= 30) {
        b2Count++;
        if (currency === 'USD') b2Amount += balance;
      } else {
        b3Count++;
        if (currency === 'USD') b3Amount += balance;
      }

      if (overdueStudentsList.length < 15) {
        const student = p.studentId as
          | {
              _id?: unknown;
              studentId?: string;
              firstName?: string;
              lastName?: string;
              khmerName?: string;
              guardians?: Array<{ fullName?: string; phone?: string; isPrimary?: boolean }>;
            }
          | undefined;

        const branch = p.branchId as { branchNameEn?: string } | undefined;
        const fee = p.tuitionFeeId as { feeName?: string; feeCode?: string } | undefined;
        const populatedStudentId = student?._id ? String(student._id) : '';
        const primaryG =
          Array.isArray(student?.guardians) && student?.guardians.length > 0
            ? student.guardians.find((g) => g.isPrimary) || student.guardians[0]
            : undefined;

        overdueStudentsList.push({
          paymentId: String(p._id),
          studentId: p.studentId
            ? String((p.studentId as { _id?: unknown })._id ?? p.studentId)
            : '',
          studentCode: student?.studentId || 'STU-000',
          studentName:
            [student?.firstName, student?.lastName].filter(Boolean).join(' ') ||
            student?.khmerName ||
            'Student',
          className:
            classByStudentId.get(populatedStudentId) ||
            fee?.feeName ||
            fee?.feeCode ||
            'Unassigned class',
          branchName: branch?.branchNameEn,
          amountDue: Number(p.amountDue || 0),
          balanceRemaining: balance,
          currency: (p.currency as string) || 'USD',
          dueDate: due.toISOString().slice(0, 10),
          daysOverdue,
          guardianName: primaryG?.fullName,
          guardianPhone: primaryG?.phone,
        });
      }
    }

    const overdueAging = [
      {
        label: '1–15 Days Overdue',
        range: '1-15',
        count: b1Count,
        totalAmount: roundMoney(b1Amount),
        amountsByCurrency: toCurrencySummary(overdueCurrencyMaps[0]!),
      },
      {
        label: '16–30 Days Overdue',
        range: '16-30',
        count: b2Count,
        totalAmount: roundMoney(b2Amount),
        amountsByCurrency: toCurrencySummary(overdueCurrencyMaps[1]!),
      },
      {
        label: '31+ Days Overdue',
        range: '31+',
        count: b3Count,
        totalAmount: roundMoney(b3Amount),
        amountsByCurrency: toCurrencySummary(overdueCurrencyMaps[2]!),
      },
    ];

    // 3. 12-Month Collection Progress
    const monthNames = [
      { month: 1, en: 'January', kh: 'មករា' },
      { month: 2, en: 'February', kh: 'កុម្ភៈ' },
      { month: 3, en: 'March', kh: 'មីនា' },
      { month: 4, en: 'April', kh: 'មេសា' },
      { month: 5, en: 'May', kh: 'ឧសភា' },
      { month: 6, en: 'June', kh: 'មិថុនា' },
      { month: 7, en: 'July', kh: 'កក្កដា' },
      { month: 8, en: 'August', kh: 'សីហា' },
      { month: 9, en: 'September', kh: 'កញ្ញា' },
      { month: 10, en: 'October', kh: 'តុលា' },
      { month: 11, en: 'November', kh: 'វិច្ឆិកា' },
      { month: 12, en: 'December', kh: 'ធ្នូ' },
    ];

    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const yearPaymentFilter: Record<string, unknown> = {
      $or: [
        { paymentDate: { $gte: yearStart, $lte: yearEnd } },
        { dueDate: { $gte: yearStart, $lte: yearEnd } },
      ],
      status: { $ne: 'voided' },
      isDeleted: false,
    };
    if (params.schoolId) yearPaymentFilter.schoolId = params.schoolId;
    if (params.academicYearId) yearPaymentFilter.academicYearId = params.academicYearId;
    if (params.branchIds) {
      yearPaymentFilter.branchId = { $in: params.branchIds };
    }

    const yearPayments = await PaymentModel.find(yearPaymentFilter)
      .select(
        'paymentDate amountPaid amountDue discountAmount balanceRemaining currency dueDate studentId tuitionFeeId',
      )
      .lean();

    const monthlyCollectedMap = new Map<
      number,
      Map<CurrencyCode, { amount: number; transactionCount: number }>
    >();
    const monthlyScheduledMap = new Map<number, Map<CurrencyCode, number>>();
    const scheduledAccountKeys = new Set<string>();
    for (const p of yearPayments) {
      const currency = normalizeCurrency(p.currency);
      const paymentDate = p.paymentDate ? new Date(p.paymentDate) : undefined;
      if (paymentDate) {
        const month = paymentDate.getMonth() + 1;
        const monthMap = monthlyCollectedMap.get(month) || new Map();
        addCurrencyAmount(monthMap, currency, Number(p.amountPaid || 0), 1);
        monthlyCollectedMap.set(month, monthMap);
      }

      const dueDate = p.dueDate ? new Date(p.dueDate) : paymentDate;
      if (dueDate) {
        const month = dueDate.getMonth() + 1;
        const monthMap = monthlyScheduledMap.get(month) || new Map<CurrencyCode, number>();
        const accountKey = [
          String(p.studentId || ''),
          String(p.tuitionFeeId || ''),
          dueDate.toISOString().slice(0, 10),
          currency,
        ].join(':');
        if (!scheduledAccountKeys.has(accountKey)) {
          const scheduled = Math.max(0, Number(p.amountDue || 0) - Number(p.discountAmount || 0));
          monthMap.set(currency, (monthMap.get(currency) || 0) + scheduled);
          scheduledAccountKeys.add(accountKey);
        }
        monthlyScheduledMap.set(month, monthMap);
      }
    }

    const monthlyCollection = monthNames.map((m) => {
      const collectedMap = monthlyCollectedMap.get(m.month) || new Map();
      const scheduledMap = monthlyScheduledMap.get(m.month) || new Map<CurrencyCode, number>();
      const currencies = currencyCodes.filter(
        (currency) => collectedMap.has(currency) || scheduledMap.has(currency),
      );
      const currencyBreakdown = currencies.map((currency) => {
        const collected = roundMoney(collectedMap.get(currency)?.amount || 0);
        const target = roundMoney(scheduledMap.get(currency) || 0);
        const pending = Math.max(0, roundMoney(target - collected));
        return {
          currency,
          targetAmount: target,
          collectedAmount: collected,
          pendingAmount: pending,
          collectionRate: target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0,
        };
      });
      const usd = currencyBreakdown.find((item) => item.currency === 'USD');
      return {
        month: m.month,
        monthNameEn: m.en,
        monthNameKh: m.kh,
        targetAmount: usd?.targetAmount || 0,
        collectedAmount: usd?.collectedAmount || 0,
        pendingAmount: usd?.pendingAmount || 0,
        collectionRate: usd?.collectionRate || 0,
        currencyBreakdown,
      };
    });

    const selectedCollected = monthlyCollectedMap.get(selectedMonth) || new Map();
    const selectedScheduled =
      monthlyScheduledMap.get(selectedMonth) || new Map<CurrencyCode, number>();
    const selectedCollectedByCurrency = toCurrencySummary(selectedCollected);
    const selectedScheduledByCurrency = currencyCodes
      .filter((currency) => selectedScheduled.has(currency))
      .map((currency) => ({ currency, amount: roundMoney(selectedScheduled.get(currency) || 0) }));
    const selectedOutstandingByCurrency = currencyCodes
      .filter((currency) => selectedScheduled.has(currency) || selectedCollected.has(currency))
      .map((currency) => ({
        currency,
        amount: Math.max(
          0,
          roundMoney(
            (selectedScheduled.get(currency) || 0) - (selectedCollected.get(currency)?.amount || 0),
          ),
        ),
      }));
    const yearToDateMap = new Map<CurrencyCode, { amount: number; transactionCount: number }>();
    for (const [month, values] of monthlyCollectedMap) {
      if (month <= selectedMonth) {
        for (const [currency, value] of values) {
          addCurrencyAmount(yearToDateMap, currency, value.amount, value.transactionCount);
        }
      }
    }

    return {
      today: {
        totalAmount: roundMoney(todayTotal),
        transactionCount: todayPayments.length,
        splits: todaySplits,
        totalsByCurrency: toCurrencySummary(todayCurrencyMap),
      },
      overdueAging,
      overdueStudents: overdueStudentsList,
      monthlyCollection,
      summary: {
        selectedPeriod: {
          year: currentYear,
          month: selectedMonth,
          collectedByCurrency: selectedCollectedByCurrency,
          scheduledByCurrency: selectedScheduledByCurrency,
          outstandingByCurrency: selectedOutstandingByCurrency,
          transactionCount: selectedCollectedByCurrency.reduce(
            (total, item) => total + (item.transactionCount || 0),
            0,
          ),
        },
        yearToDate: {
          collectedByCurrency: toCurrencySummary(yearToDateMap),
          transactionCount: Array.from(yearToDateMap.values()).reduce(
            (total, item) => total + item.transactionCount,
            0,
          ),
        },
        overdue: {
          accountCount: overduePayments.length,
          balanceByCurrency: toCurrencySummary(overdueTotalByCurrency),
        },
      },
    };
  }

  public async getStudentAffairsPulse(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
  }) {
    const filter: Record<string, unknown> = { isDeleted: false };
    if (params.schoolId) filter.schoolId = params.schoolId;
    if (params.branchIds) {
      filter.branchId = { $in: params.branchIds };
    }

    // 1. Admissions Funnel
    const [regCount, testCount, enrCount] = await Promise.all([
      RegistrationModel.countDocuments({ ...filter, status: { $ne: 'draft' } }),
      PlacementTestModel.countDocuments({ ...filter, status: { $in: ['completed', 'passed'] } }),
      EnrollmentModel.countDocuments({ ...filter, status: 'enrolled' }),
    ]);

    const maxFunnel = Math.max(regCount, 1);
    const funnel = [
      {
        stage: 'registered' as const,
        labelEn: 'Registered Applicants',
        labelKh: 'ពាក្យស្នើសុំចុះឈ្មោះ',
        count: regCount,
        percentage: 100,
      },
      {
        stage: 'tested' as const,
        labelEn: 'Placement Tests Taken',
        labelKh: 'បានធ្វើតេស្តវាស់កម្រិត',
        count: testCount,
        percentage: Math.min(100, Math.round((testCount / maxFunnel) * 100)),
      },
      {
        stage: 'enrolled' as const,
        labelEn: 'Enrolled in Class',
        labelKh: 'បានចុះឈ្មោះចូលរៀន',
        count: enrCount,
        percentage: Math.min(100, Math.round((enrCount / maxFunnel) * 100)),
      },
    ];

    // 2. Student Movement Stats
    const studentFilter: Record<string, unknown> = { isDeleted: false };
    if (params.schoolId) studentFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      studentFilter.branchId = { $in: params.branchIds };
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [activeCount, suspendedCount, transferredCount, withdrawnCount, newEnrollments] =
      await Promise.all([
        StudentModel.countDocuments({ ...studentFilter, status: 'active' }),
        StudentModel.countDocuments({ ...studentFilter, status: 'suspended' }),
        StudentModel.countDocuments({ ...studentFilter, status: 'transferred' }),
        StudentModel.countDocuments({ ...studentFilter, status: 'withdrawn' }),
        EnrollmentModel.countDocuments({
          ...filter,
          status: 'enrolled',
          createdAt: { $gte: startOfMonth },
        }),
      ]);

    const movement = {
      active: activeCount,
      suspended: suspendedCount,
      transferred: transferredCount,
      withdrawn: withdrawnCount,
      newEnrollmentsThisMonth: newEnrollments,
    };

    // 3. At-Risk Consecutive Absences (configurable threshold from system settings, defaults to 3)
    let absenceThreshold = 3;
    try {
      const setting = await SystemSettingModel.findOne({
        key: 'academic.attendance.consecutive_absence_threshold',
        isDeleted: false,
      }).lean();
      if (setting && typeof setting.value === 'number' && setting.value > 0) {
        absenceThreshold = setting.value;
      } else if (setting && typeof setting.value === 'string' && !isNaN(Number(setting.value))) {
        absenceThreshold = Number(setting.value);
      }
    } catch {
      absenceThreshold = 3;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attRecFilter: Record<string, unknown> = {
      isDeleted: false,
      markedAt: { $gte: thirtyDaysAgo },
    };
    if (params.branchIds) {
      attRecFilter.branchId = { $in: params.branchIds };
    }

    const recentRecords = await AttendanceRecordModel.find(attRecFilter)
      .populate('studentId', 'studentId firstName lastName khmerName guardians')
      .populate('classId', 'className')
      .populate('branchId', 'branchNameEn')
      .sort({ markedAt: -1 })
      .lean();

    // Group records by student and detect consecutive unexcused absences exceeding threshold
    const studentRecordsMap = new Map<string, typeof recentRecords>();
    for (const r of recentRecords) {
      const sId = String(r.studentId?._id ?? r.studentId);
      if (!studentRecordsMap.has(sId)) {
        studentRecordsMap.set(sId, []);
      }
      studentRecordsMap.get(sId)!.push(r);
    }

    const atRiskAbsences = [];
    for (const [, records] of studentRecordsMap) {
      // records are sorted by markedAt desc
      let consecutiveAbsent = 0;
      let lastAbsentDate = '';

      for (const rec of records) {
        if (rec.status === 'absent') {
          consecutiveAbsent++;
          if (!lastAbsentDate && rec.markedAt) {
            lastAbsentDate = new Date(rec.markedAt).toISOString().slice(0, 10);
          }
        } else if (rec.status === 'present' || rec.status === 'late') {
          break; // broke the consecutive streak
        }
      }

      if (consecutiveAbsent >= absenceThreshold && records[0]) {
        const student = records[0].studentId as unknown as {
          _id: unknown;
          studentId?: string;
          firstName?: string;
          lastName?: string;
          khmerName?: string;
          guardians?: Array<{ fullName?: string; phone?: string; isPrimary?: boolean }>;
        } | null;

        const cls = records[0].classId as unknown as { className?: string } | null;
        const branch = records[0].branchId as unknown as { branchNameEn?: string } | null;

        const primaryG =
          Array.isArray(student?.guardians) && student?.guardians.length > 0
            ? student.guardians.find((g) => g.isPrimary) || student.guardians[0]
            : undefined;

        atRiskAbsences.push({
          studentId: String(student?._id ?? ''),
          studentCode: student?.studentId || 'STU-000',
          studentName:
            [student?.firstName, student?.lastName].filter(Boolean).join(' ') ||
            student?.khmerName ||
            'Student',
          classId: String(records[0].classId?._id ?? records[0].classId),
          className: cls?.className || 'Class',
          branchName: branch?.branchNameEn,
          consecutiveAbsentCount: consecutiveAbsent,
          lastAbsentDate: lastAbsentDate || new Date().toISOString().slice(0, 10),
          guardianName: primaryG?.fullName,
          guardianPhone: primaryG?.phone,
        });

        if (atRiskAbsences.length >= 15) break;
      }
    }

    // 4. Upcoming Birthdays (Next 7 days)
    const activeStudents = await StudentModel.find({
      ...studentFilter,
      status: 'active',
      dateOfBirth: { $exists: true, $ne: null },
    })
      .select('studentId firstName lastName khmerName dateOfBirth photo')
      .limit(100)
      .lean();

    const upcomingBirthdays = [];
    const today = new Date();

    for (const s of activeStudents) {
      if (!s.dateOfBirth) continue;
      const dob = new Date(s.dateOfBirth);
      const dobMonth = dob.getMonth();
      const dobDate = dob.getDate();

      // Calculate days until birthday in current year
      const bdayThisYear = new Date(today.getFullYear(), dobMonth, dobDate);
      if (bdayThisYear < today) {
        bdayThisYear.setFullYear(today.getFullYear() + 1);
      }
      const diffDays = Math.ceil(
        (bdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays >= 0 && diffDays <= 7) {
        upcomingBirthdays.push({
          id: String(s._id),
          name: [s.firstName, s.lastName].filter(Boolean).join(' ') || s.khmerName || 'Student',
          type: 'student' as const,
          dateOfBirth: dob.toISOString().slice(0, 10),
          daysUntil: diffDays,
          photo: s.photo,
        });
      }
      if (upcomingBirthdays.length >= 10) break;
    }

    return {
      funnel,
      movement,
      atRiskAbsences,
      upcomingBirthdays,
    };
  }

  public async getHrPulse(params: { schoolId?: string; branchIds?: string[] }) {
    const empFilter: Record<string, unknown> = {
      isDeleted: false,
      status: 'active',
    };
    if (params.schoolId) empFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      empFilter.branchId = { $in: params.branchIds };
    }

    const totalEmployees = await EmployeeModel.countDocuments(empFilter);

    // Active teachers count
    const teacherAssignments = await TeacherAssignmentModel.find({
      status: 'active',
      isDeleted: false,
      ...(params.branchIds ? { branchId: { $in: params.branchIds } } : {}),
    }).distinct('employeeId');
    const activeTeachers = teacherAssignments.length;

    // Headcount by Department
    const employees = await EmployeeModel.find(empFilter)
      .populate('departmentId', 'nameEn nameKh code')
      .populate('branchId', 'branchCode branchNameEn')
      .populate('positionId', 'nameEn nameKh')
      .lean();

    const deptMap = new Map<string, { en: string; kh?: string; count: number }>();
    const branchMap = new Map<string, { code: string; name: string; count: number }>();

    for (const e of employees) {
      const dept = e.departmentId as unknown as {
        _id: unknown;
        nameEn?: string;
        nameKh?: string;
      } | null;
      if (dept && dept._id) {
        const dId = String(dept._id);
        const existing = deptMap.get(dId) || {
          en: dept.nameEn || 'General',
          kh: dept.nameKh,
          count: 0,
        };
        existing.count++;
        deptMap.set(dId, existing);
      }

      const br = e.branchId as unknown as {
        _id: unknown;
        branchCode?: string;
        branchNameEn?: string;
      } | null;
      if (br && br._id) {
        const bId = String(br._id);
        const existing = branchMap.get(bId) || {
          code: br.branchCode || 'BR',
          name: br.branchNameEn || 'Branch',
          count: 0,
        };
        existing.count++;
        branchMap.set(bId, existing);
      }
    }

    const byDepartment = Array.from(deptMap.entries()).map(([dId, data]) => ({
      departmentId: dId,
      departmentNameEn: data.en,
      departmentNameKh: data.kh,
      count: data.count,
    }));

    const byBranch = Array.from(branchMap.entries()).map(([bId, data]) => ({
      branchId: bId,
      branchCode: data.code,
      branchNameEn: data.name,
      count: data.count,
    }));

    // Expiring Contracts in next 60 days
    const now = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);

    const expiringContracts = employees
      .filter((e) => {
        const doc = e as unknown as { contractEndDate?: Date };
        if (!doc.contractEndDate) return false;
        const end = new Date(doc.contractEndDate);
        return end >= now && end <= sixtyDaysLater;
      })
      .map((e) => {
        const doc = e as unknown as {
          contractEndDate: Date;
          departmentId?: { nameEn?: string };
          positionId?: { nameEn?: string };
          branchId?: { branchNameEn?: string };
        };
        const end = new Date(doc.contractEndDate);
        const daysRemaining = Math.max(
          0,
          Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        );
        return {
          employeeId: String(e._id),
          employeeCode: e.employeeId || 'EMP-000',
          name: [e.firstName, e.lastName].filter(Boolean).join(' ') || e.khmerName || 'Employee',
          departmentName: doc.departmentId?.nameEn,
          positionName: doc.positionId?.nameEn,
          branchName: doc.branchId?.branchNameEn,
          contractEndDate: end.toISOString().slice(0, 10),
          daysRemaining,
          phone: e.phone,
        };
      })
      .slice(0, 15);

    // Teacher Workload items
    const activeAssignments = await TeacherAssignmentModel.find({
      status: 'active',
      isDeleted: false,
      ...(params.branchIds ? { branchId: { $in: params.branchIds } } : {}),
    })
      .populate('employeeId', 'employeeId firstName lastName khmerName')
      .populate('classId', 'currentEnrollmentCount')
      .populate('branchId', 'branchNameEn')
      .lean();

    const workloadMap = new Map<
      string,
      { code: string; name: string; branch?: string; classIds: Set<string>; totalStudents: number }
    >();
    for (const a of activeAssignments) {
      const emp = a.employeeId as unknown as {
        _id: unknown;
        employeeId?: string;
        firstName?: string;
        lastName?: string;
        khmerName?: string;
      } | null;
      if (emp && emp._id) {
        const empId = String(emp._id);
        const br = a.branchId as unknown as { branchNameEn?: string } | null;
        const assignedClass = a.classId as unknown as {
          _id?: unknown;
          currentEnrollmentCount?: number;
        } | null;
        const existing = workloadMap.get(empId) || {
          code: emp.employeeId || 'EMP',
          name:
            [emp.firstName, emp.lastName].filter(Boolean).join(' ') || emp.khmerName || 'Teacher',
          branch: br?.branchNameEn,
          classIds: new Set<string>(),
          totalStudents: 0,
        };
        const classId = assignedClass?._id ? String(assignedClass._id) : '';
        if (classId && !existing.classIds.has(classId)) {
          existing.classIds.add(classId);
          existing.totalStudents += Number(assignedClass?.currentEnrollmentCount || 0);
        }
        workloadMap.set(empId, existing);
      }
    }

    const teacherWorkloads = Array.from(workloadMap.entries())
      .map(([empId, data]) => ({
        employeeId: empId,
        employeeCode: data.code,
        name: data.name,
        assignedClassCount: data.classIds.size,
        totalStudents: data.totalStudents,
        branchName: data.branch,
      }))
      .slice(0, 15);

    return {
      totalEmployees,
      activeTeachers,
      byDepartment,
      byBranch,
      expiringContracts,
      teacherWorkloads,
    };
  }

  public async getAcademicHonorRoll(params: {
    schoolId?: string;
    branchIds?: string[];
    academicYearId?: string;
    academicPeriodId?: string;
    classId?: string;
    limit?: number;
  }): Promise<AcademicHonorRollResponse> {
    const termFilter: Record<string, unknown> = { isDeleted: false };
    if (params.schoolId) termFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      termFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) termFilter.academicYearId = params.academicYearId;
    if (params.academicPeriodId) termFilter.academicPeriodId = params.academicPeriodId;
    if (params.classId) termFilter.classId = params.classId;

    const termResults = await TermResultModel.find(termFilter)
      .populate('studentId', 'studentId firstName lastName khmerName')
      .populate('classId', 'className')
      .populate('programId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn')
      .sort({ gpa: -1, averageScore: -1 })
      .lean();

    const emptyGradeDistribution: GradeDistributionBucket[] = [
      { grade: 'A', count: 0, percentage: 0 },
      { grade: 'B', count: 0, percentage: 0 },
      { grade: 'C', count: 0, percentage: 0 },
      { grade: 'D', count: 0, percentage: 0 },
      { grade: 'E', count: 0, percentage: 0 },
      { grade: 'F', count: 0, percentage: 0 },
    ];

    if (termResults.length > 0) {
      const limit = params.limit ?? 10;
      let currentRank = 1;
      let prevScore: number | null = null;
      const topPerformers: HonorRollStudentItem[] = [];

      for (let i = 0; i < termResults.length; i++) {
        const tr = termResults[i]!;
        const student = tr.studentId as unknown as {
          _id?: unknown;
          studentId?: string;
          firstName?: string;
          lastName?: string;
          khmerName?: string;
        } | null;
        const cls = tr.classId as unknown as { _id?: unknown; className?: string } | null;
        const prog = tr.programId as unknown as { _id?: unknown; nameEn?: string } | null;
        const br = tr.branchId as unknown as { _id?: unknown; branchNameEn?: string } | null;

        const sName =
          [student?.firstName, student?.lastName].filter(Boolean).join(' ') ||
          student?.khmerName ||
          'Student';

        if (prevScore !== null && tr.averageScore < prevScore) {
          currentRank = i + 1;
        }
        prevScore = tr.averageScore;

        if (topPerformers.length < limit) {
          topPerformers.push({
            id: String(tr._id),
            studentId: String(student?._id ?? tr.studentId),
            studentCode: student?.studentId ?? 'STU',
            studentName: sName,
            className: cls?.className ?? 'Class',
            programName: prog?.nameEn,
            branchName: br?.branchNameEn,
            averageScore: Math.round(tr.averageScore * 10) / 10,
            totalScore: Math.round(tr.totalScore * 10) / 10,
            gpa: Math.round(tr.gpa * 100) / 100,
            letterGrade: tr.letterGrade,
            rank: currentRank,
            attendanceRate: Math.round((tr.attendanceRate ?? 100) * 10) / 10,
          });
        }
      }

      const classMap = new Map<
        string,
        {
          classId: string;
          className: string;
          programName?: string;
          scores: number[];
          passedCount: number;
          highestScore: number;
        }
      >();

      const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      let totalScoreSum = 0;
      let totalPassed = 0;
      let honorRollCount = 0;

      for (const tr of termResults) {
        totalScoreSum += tr.averageScore;
        if (
          tr.resultStatus === 'PASSED' ||
          tr.averageScore >= (tr.calculationPolicy?.passingAverage ?? 50)
        ) {
          totalPassed++;
        }
        if (tr.letterGrade === 'A' || tr.gpa >= 3.5) {
          honorRollCount++;
        }

        const gradeKey = tr.letterGrade || 'F';
        gradeCounts[gradeKey] = (gradeCounts[gradeKey] || 0) + 1;

        const cls = tr.classId as unknown as { _id?: unknown; className?: string } | null;
        const prog = tr.programId as unknown as { _id?: unknown; nameEn?: string } | null;
        const cId = String(cls?._id ?? tr.classId);

        const existing = classMap.get(cId) || {
          classId: cId,
          className: cls?.className ?? 'Class',
          programName: prog?.nameEn,
          scores: [],
          passedCount: 0,
          highestScore: 0,
        };
        existing.scores.push(tr.averageScore);
        if (
          tr.resultStatus === 'PASSED' ||
          tr.averageScore >= (tr.calculationPolicy?.passingAverage ?? 50)
        ) {
          existing.passedCount++;
        }
        if (tr.averageScore > existing.highestScore) {
          existing.highestScore = tr.averageScore;
        }
        classMap.set(cId, existing);
      }

      const classPerformances: ClassPerformanceItem[] = Array.from(classMap.values())
        .map((c) => {
          const total = c.scores.length;
          const sum = c.scores.reduce((a, b) => a + b, 0);
          return {
            classId: c.classId,
            className: c.className,
            programName: c.programName,
            studentCount: total,
            classAverage: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
            highestScore: Math.round(c.highestScore * 10) / 10,
            passingRate: total > 0 ? Math.round((c.passedCount / total) * 100) : 0,
          };
        })
        .sort((a, b) => b.classAverage - a.classAverage);

      const totalCount = termResults.length;
      const gradeDistribution: GradeDistributionBucket[] = (
        ['A', 'B', 'C', 'D', 'E', 'F'] as const
      ).map((grade) => {
        const count = gradeCounts[grade] || 0;
        return {
          grade,
          count,
          percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
        };
      });

      return {
        summary: {
          totalEvaluatedStudents: totalCount,
          overallAverage: totalCount > 0 ? Math.round((totalScoreSum / totalCount) * 10) / 10 : 0,
          overallPassingRate: totalCount > 0 ? Math.round((totalPassed / totalCount) * 100) : 0,
          honorRollCount,
        },
        topPerformers,
        classPerformances,
        gradeDistribution,
      };
    }

    // Fallback: Aggregate from ScoreModel if TermResult has not yet been compiled
    const scoreFilter: Record<string, unknown> = { isDeleted: false, isAbsent: false };
    if (params.schoolId) scoreFilter.schoolId = params.schoolId;
    if (params.branchIds) {
      scoreFilter.branchId = { $in: params.branchIds };
    }
    if (params.academicYearId) scoreFilter.academicYearId = params.academicYearId;
    if (params.academicPeriodId) scoreFilter.academicPeriodId = params.academicPeriodId;
    if (params.classId) scoreFilter.classId = params.classId;

    const scores = await ScoreModel.find(scoreFilter)
      .populate('studentId', 'studentId firstName lastName khmerName')
      .populate('classId', 'className')
      .populate('branchId', 'branchNameEn')
      .lean();

    if (scores.length === 0) {
      return {
        summary: {
          totalEvaluatedStudents: 0,
          overallAverage: 0,
          overallPassingRate: 0,
          honorRollCount: 0,
        },
        topPerformers: [],
        classPerformances: [],
        gradeDistribution: emptyGradeDistribution,
      };
    }

    const studentScoreMap = new Map<
      string,
      {
        studentId: string;
        studentCode: string;
        studentName: string;
        className: string;
        branchName?: string;
        percentages: number[];
      }
    >();

    for (const sc of scores) {
      const student = sc.studentId as unknown as {
        _id?: unknown;
        studentId?: string;
        firstName?: string;
        lastName?: string;
        khmerName?: string;
      } | null;
      const cls = sc.classId as unknown as { className?: string } | null;
      const br = sc.branchId as unknown as { branchNameEn?: string } | null;
      const sId = String(student?._id ?? sc.studentId);

      const existing = studentScoreMap.get(sId) || {
        studentId: sId,
        studentCode: student?.studentId ?? 'STU',
        studentName:
          [student?.firstName, student?.lastName].filter(Boolean).join(' ') ||
          student?.khmerName ||
          'Student',
        className: cls?.className ?? 'Class',
        branchName: br?.branchNameEn,
        percentages: [],
      };
      existing.percentages.push(sc.percentage);
      studentScoreMap.set(sId, existing);
    }

    const calculatedStudents = Array.from(studentScoreMap.values()).map((s) => {
      const count = s.percentages.length;
      const avg = count > 0 ? s.percentages.reduce((a, b) => a + b, 0) / count : 0;
      let grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'F';
      let gpa = 0.0;
      if (avg >= 85) {
        grade = 'A';
        gpa = 4.0;
      } else if (avg >= 75) {
        grade = 'B';
        gpa = 3.0;
      } else if (avg >= 65) {
        grade = 'C';
        gpa = 2.0;
      } else if (avg >= 50) {
        grade = 'D';
        gpa = 1.0;
      } else if (avg >= 40) {
        grade = 'E';
        gpa = 0.5;
      }
      return {
        ...s,
        averageScore: Math.round(avg * 10) / 10,
        totalScore: Math.round(s.percentages.reduce((a, b) => a + b, 0) * 10) / 10,
        gpa,
        letterGrade: grade,
      };
    });

    calculatedStudents.sort((a, b) => b.averageScore - a.averageScore);

    const limit = params.limit ?? 10;
    let currentRank = 1;
    let prevScore: number | null = null;
    const topPerformers: HonorRollStudentItem[] = [];

    for (let i = 0; i < calculatedStudents.length; i++) {
      const cs = calculatedStudents[i]!;
      if (prevScore !== null && cs.averageScore < prevScore) {
        currentRank = i + 1;
      }
      prevScore = cs.averageScore;

      if (topPerformers.length < limit) {
        topPerformers.push({
          id: `score-${cs.studentId}`,
          studentId: cs.studentId,
          studentCode: cs.studentCode,
          studentName: cs.studentName,
          className: cs.className,
          branchName: cs.branchName,
          averageScore: cs.averageScore,
          totalScore: cs.totalScore,
          gpa: cs.gpa,
          letterGrade: cs.letterGrade,
          rank: currentRank,
          attendanceRate: 100,
        });
      }
    }

    const classMap = new Map<
      string,
      {
        className: string;
        scores: number[];
        passedCount: number;
        highestScore: number;
      }
    >();

    const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    let totalScoreSum = 0;
    let totalPassed = 0;
    let honorRollCount = 0;

    for (const cs of calculatedStudents) {
      totalScoreSum += cs.averageScore;
      if (cs.averageScore >= 50) totalPassed++;
      if (cs.letterGrade === 'A' || cs.gpa >= 3.5) honorRollCount++;
      gradeCounts[cs.letterGrade] = (gradeCounts[cs.letterGrade] || 0) + 1;

      const existing = classMap.get(cs.className) || {
        className: cs.className,
        scores: [],
        passedCount: 0,
        highestScore: 0,
      };
      existing.scores.push(cs.averageScore);
      if (cs.averageScore >= 50) existing.passedCount++;
      if (cs.averageScore > existing.highestScore) existing.highestScore = cs.averageScore;
      classMap.set(cs.className, existing);
    }

    const classPerformances: ClassPerformanceItem[] = Array.from(classMap.entries())
      .map(([className, c], index) => {
        const total = c.scores.length;
        const sum = c.scores.reduce((a, b) => a + b, 0);
        return {
          classId: `cls-${index}`,
          className,
          studentCount: total,
          classAverage: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
          highestScore: Math.round(c.highestScore * 10) / 10,
          passingRate: total > 0 ? Math.round((c.passedCount / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.classAverage - a.classAverage);

    const totalCount = calculatedStudents.length;
    const gradeDistribution: GradeDistributionBucket[] = (
      ['A', 'B', 'C', 'D', 'E', 'F'] as const
    ).map((grade) => {
      const count = gradeCounts[grade] || 0;
      return {
        grade,
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      };
    });

    return {
      summary: {
        totalEvaluatedStudents: totalCount,
        overallAverage: totalCount > 0 ? Math.round((totalScoreSum / totalCount) * 10) / 10 : 0,
        overallPassingRate: totalCount > 0 ? Math.round((totalPassed / totalCount) * 100) : 0,
        honorRollCount,
      },
      topPerformers,
      classPerformances,
      gradeDistribution,
    };
  }
}
