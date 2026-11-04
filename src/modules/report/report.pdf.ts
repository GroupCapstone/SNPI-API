import { existsSync } from 'node:fs';
import path from 'node:path';

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const NAVY = '#023e8a';
const GOLD = '#ffc300';
const SLATE = '#334155';
const LIGHT = '#e2e8f0';
const hasKhmer = (value: string): boolean => /[\u1780-\u17ff]/.test(value);

const findKhmerFont = (): string | undefined => {
  const relative = path.join(
    'node_modules',
    '@fontsource-variable',
    'noto-sans-khmer',
    'files',
    'noto-sans-khmer-khmer-standard-normal.woff2',
  );
  const candidates = [
    path.resolve(process.cwd(), relative),
    path.resolve(process.cwd(), '..', relative),
  ];
  return candidates.find(existsSync);
};

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const textValue = (value: unknown, fallback = '-'): string =>
  value === undefined || value === null || value === '' ? fallback : String(value);

export const renderOfficialDocumentPdf = async (
  type: string,
  documentNumber: string,
  generatedAt: Date,
  payload: Record<string, unknown>,
): Promise<Buffer> => {
  const doc = new PDFDocument({ size: 'A4', margin: 42, info: { CreationDate: generatedAt } });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const completion = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const khmerFont = findKhmerFont();
  if (khmerFont) doc.registerFont('Khmer', khmerFont);
  const fontFor = (value: string): string => (khmerFont && hasKhmer(value) ? 'Khmer' : 'Helvetica');
  const boldFor = (value: string): string =>
    khmerFont && hasKhmer(value) ? 'Khmer' : 'Helvetica-Bold';
  const write = (
    value: unknown,
    x?: number,
    y?: number,
    options?: PDFKit.Mixins.TextOptions,
    bold = false,
  ) => {
    const resolved = textValue(value);
    doc.font(bold ? boldFor(resolved) : fontFor(resolved)).text(resolved, x, y, options);
  };
  const field = (label: string, value: unknown, x: number, y: number, width = 240) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor(SLATE)
      .text(label.toUpperCase(), x, y, { width });
    write(value, x, y + 12, { width }, true);
  };
  const line = (y: number) => doc.moveTo(42, y).lineTo(553, y).strokeColor(LIGHT).stroke();
  const section = (title: string, y: number) => {
    doc.rect(42, y, 511, 22).fill(NAVY);
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#ffffff')
      .text(title, 50, y + 6);
    return y + 30;
  };

  const school = asRecord(payload.school);
  const branch = asRecord(payload.branch);
  doc.rect(42, 42, 511, 6).fill(GOLD);
  doc.fontSize(18).fillColor(NAVY);
  write(school.nameEn ?? 'SNP School', 42, 58, { width: 390 }, true);
  if (school.nameKh) {
    doc.fontSize(11).fillColor(SLATE);
    write(school.nameKh, 42, 82, { width: 390 });
  }
  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(NAVY)
    .text(type.replaceAll('_', ' ').toUpperCase(), 405, 60, { width: 148, align: 'right' });
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(SLATE)
    .text(documentNumber, 405, 79, { width: 148, align: 'right' });
  doc
    .fontSize(8)
    .text(textValue(branch.nameEn ?? branch.branchNameEn), 405, 92, { width: 148, align: 'right' });
  line(112);

  let y = 124;
  const student = asRecord(payload.student);
  field('Student ID', student.studentId, 42, y);
  field('Student Name', student.name ?? student.englishName ?? student.khmerName, 300, y, 253);
  y += 38;

  if (type === 'report_card') {
    const academic = asRecord(payload.academic);
    field('Academic Year', academic.academicYear, 42, y);
    field('Term / Period', academic.period, 300, y, 253);
    y += 38;
    field('Program', academic.program, 42, y);
    field(
      'Level / Class',
      `${textValue(academic.level)} / ${textValue(academic.className)}`,
      300,
      y,
      253,
    );
    y += 44;
    y = section('SUBJECT RESULTS', y);
    const subjects = asArray(payload.subjects).map(asRecord);
    doc.font('Helvetica-Bold').fontSize(8).fillColor(SLATE);
    doc.text('SUBJECT', 48, y, { width: 220 });
    doc.text('TOTAL', 300, y, { width: 55, align: 'right' });
    doc.text('AVERAGE', 365, y, { width: 65, align: 'right' });
    doc.text('GRADE', 440, y, { width: 50, align: 'right' });
    doc.text('RESULT', 500, y, { width: 48, align: 'right' });
    y += 16;
    for (const subject of subjects) {
      if (y > 710) {
        doc.addPage({ size: 'A4', margin: 42 });
        y = 50;
      }
      write(subject.name ?? subject.code, 48, y, { width: 220 });
      write(subject.total, 300, y, { width: 55, align: 'right' });
      write(subject.average, 365, y, { width: 65, align: 'right' });
      write(subject.grade, 440, y, { width: 50, align: 'right' }, true);
      write(subject.passed ? 'PASS' : 'FAIL', 500, y, { width: 48, align: 'right' }, true);
      y += 18;
      line(y - 3);
    }
    y += 8;
    const summary = asRecord(payload.summary);
    field('Overall Average', summary.average, 42, y, 120);
    field('GPA', summary.gpa, 175, y, 100);
    field('Grade', summary.grade, 290, y, 100);
    field('Result', summary.result, 405, y, 148);
    y += 42;
    const attendance = asRecord(payload.attendance);
    y = section('ATTENDANCE & APPROVAL', y);
    field('Attendance Rate', `${textValue(attendance.rate)}%`, 42, y, 125);
    field(
      'Present / Sessions',
      `${textValue(attendance.present)} / ${textValue(attendance.totalSessions)}`,
      180,
      y,
      150,
    );
    field('Class Teacher', asRecord(payload.approval).teacher, 345, y, 208);
    y += 44;
    field('Academic Approval', asRecord(payload.approval).approvedAt, 42, y, 240);
    field('Comments', asRecord(payload.approval).comments, 300, y, 253);
  } else if (type === 'certificate') {
    const academic = asRecord(payload.academic);
    const summary = asRecord(payload.summary);
    const verification = asRecord(payload.verification);
    doc
      .font('Helvetica-Bold')
      .fontSize(24)
      .fillColor(NAVY)
      .text('CERTIFICATE OF COMPLETION', 42, 155, { width: 511, align: 'center' });
    doc.font('Helvetica').fontSize(11).fillColor(SLATE).text('This certifies that', 42, 205, {
      width: 511,
      align: 'center',
    });
    doc.fontSize(20).fillColor(NAVY);
    write(student.name ?? student.khmerName, 42, 230, { width: 511, align: 'center' }, true);
    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor(SLATE)
      .text('has successfully completed', 42, 275, {
        width: 511,
        align: 'center',
      });
    doc.fontSize(16).fillColor('#0f172a');
    write(
      `${textValue(academic.program)} - ${textValue(academic.level)}`,
      42,
      302,
      { width: 511, align: 'center' },
      true,
    );
    write(`${textValue(academic.academicYear)} / ${textValue(academic.period)}`, 42, 332, {
      width: 511,
      align: 'center',
    });
    y = 385;
    field('Completion Date', payload.completionDate, 70, y, 130);
    field('GPA', summary.gpa, 220, y, 80);
    field(
      'Attendance',
      `${textValue(asRecord(payload.eligibility).minimumAttendanceRate)}% minimum`,
      315,
      y,
      170,
    );
    const verificationText = textValue(verification.path ?? verification.code);
    const qrBuffer = await QRCode.toBuffer(verificationText, { width: 150, margin: 1 });
    doc.image(qrBuffer, 226, 465, { width: 100, height: 100 });
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(NAVY)
      .text(textValue(verification.code), 42, 575, {
        width: 511,
        align: 'center',
      });
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(SLATE)
      .text('Scan to verify this official record', 42, 592, {
        width: 511,
        align: 'center',
      });
  } else if (type === 'transcript') {
    y = section('ACADEMIC HISTORY', y + 4);
    for (const resultValue of asArray(payload.results)) {
      const result = asRecord(resultValue);
      if (y > 680) {
        doc.addPage({ size: 'A4', margin: 42 });
        y = 50;
      }
      write(
        `${textValue(result.academicYear)} · ${textValue(result.period)}`,
        48,
        y,
        { width: 170 },
        true,
      );
      write(`${textValue(result.program)} · ${textValue(result.level)}`, 220, y, { width: 180 });
      write(result.average, 410, y, { width: 45, align: 'right' }, true);
      write(result.grade, 465, y, { width: 35, align: 'right' }, true);
      write(result.promotion, 505, y, { width: 43, align: 'right' });
      y += 20;
      line(y - 3);
    }
    y += 10;
    y = section('ENROLLMENT & PROGRESSION', y);
    for (const enrollmentValue of asArray(payload.enrollments)) {
      const enrollment = asRecord(enrollmentValue);
      write(enrollment.code, 48, y, { width: 105 }, true);
      write(`${textValue(enrollment.program)} / ${textValue(enrollment.level)}`, 160, y, {
        width: 210,
      });
      write(enrollment.className, 375, y, { width: 115 });
      write(enrollment.status, 495, y, { width: 53, align: 'right' });
      y += 18;
    }
  } else {
    const finance = asRecord(payload.finance);
    y = section(type === 'invoice' ? 'INVOICE DETAILS' : 'PAYMENT DETAILS', y + 4);
    const rows: Array<[string, unknown]> =
      type === 'invoice'
        ? [
            ['Invoice Number', finance.invoiceNumber],
            ['Enrollment', finance.enrollment],
            ['Fee Item', finance.feeName],
            ['Due Date', finance.dueDate],
            ['Status', finance.status],
          ]
        : [
            ['Receipt Number', finance.receiptNumber],
            ['Payment Number', finance.paymentNumber],
            ['Invoice Reference', finance.invoiceReference],
            ['Payment Method', finance.paymentMethod],
            ['Payment Date', finance.paymentDate],
            ['Collected By', finance.collectedBy],
            ['Status', finance.status],
          ];
    for (const [label, value] of rows) {
      field(label, value, 48, y, 220);
      y += 32;
    }
    y += 4;
    y = section('AMOUNTS', y);
    field('Total', finance.total ?? finance.amountDue, 48, y, 110);
    field('Paid', finance.paid ?? finance.amountPaid, 170, y, 110);
    field('Discount', finance.discount, 292, y, 110);
    field('Balance', finance.balance, 414, y, 134);
    y += 44;
    if (finance.voidReason) {
      field(
        'Void Information',
        `${textValue(finance.voidReason)} · ${textValue(finance.voidedAt)}`,
        48,
        y,
        500,
      );
    }
  }

  doc
    .font('Helvetica')
    .fontSize(7)
    .fillColor('#64748b')
    .text(
      `Official SNP-SMS record · Generated ${generatedAt.toISOString()} · ${documentNumber}`,
      42,
      800,
      { width: 511, align: 'center' },
    );
  doc.end();
  return completion;
};
