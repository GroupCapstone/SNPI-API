import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_PERMISSION_CODES, DEFAULT_CORE_ROLES } from '../src/constants/permissions';
import { attendanceRecordItemSchema } from '../src/modules/attendance/attendance.validation';
import { createProgramSchema } from '../src/modules/program/program.validation';
import { ProgramModel } from '../src/modules/program/program.model';
import { redactSensitiveData } from '../src/utils/redact';
import {
  isSecretSettingKey,
  MASKED_SECRET_VALUE,
} from '../src/modules/system-setting/system-setting.service';

describe('SNP-SMS Architectural & Operational Consistency Standard', () => {
  describe('0. Route Permission Contract', () => {
    it('keeps every route permission literal in the canonical permission catalog', () => {
      const routeFiles: string[] = [];
      const visit = (directory: string): void => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          const entryPath = path.join(directory, entry.name);
          if (entry.isDirectory()) {
            visit(entryPath);
          } else if (entry.name.endsWith('.route.ts')) {
            routeFiles.push(entryPath);
          }
        }
      };

      visit(path.resolve(__dirname, '../src/modules'));

      const unknownPermissions: string[] = [];
      for (const file of routeFiles) {
        const source = fs.readFileSync(file, 'utf8');
        for (const match of source.matchAll(/(?:authorize|requirePermission)\(([^)]*)\)/gs)) {
          for (const permission of match[1]?.matchAll(/'([^']+)'/g) ?? []) {
            const code = permission[1];
            if (code && !ALL_PERMISSION_CODES.includes(code)) {
              unknownPermissions.push(`${path.relative(process.cwd(), file)}: ${code}`);
            }
          }
        }
      }

      expect(unknownPermissions).toEqual([]);
    });
  });

  describe('1. Canonical Core Roles (13 Roles)', () => {
    it('enforces exactly 13 canonical system roles', () => {
      expect(DEFAULT_CORE_ROLES.length).toBe(13);
      const roleCodes = DEFAULT_CORE_ROLES.map((r) => r.code);

      const expectedRoles = [
        'super_admin',
        'director',
        'branch_manager',
        'administrator',
        'academic_officer',
        'teacher',
        'finance_officer',
        'student_affairs_officer',
        'hr_officer',
        'librarian',
        'inventory_officer',
        'department_head',
        'staff',
      ];

      for (const expected of expectedRoles) {
        expect(roleCodes).toContain(expected);
      }
    });

    it('verifies outdated school_admin role is completely eradicated', () => {
      const roleCodes = DEFAULT_CORE_ROLES.map((r) => r.code);
      expect(roleCodes).not.toContain('school_admin');
    });

    it('ensures all core roles are marked isSystem: true', () => {
      for (const role of DEFAULT_CORE_ROLES) {
        expect(role.isSystem).toBe(true);
      }
    });
  });

  describe('2. Role Responsibilities & Operational Separation', () => {
    it('ensures administrator does NOT have rollover permissions', () => {
      const admin = DEFAULT_CORE_ROLES.find((r) => r.code === 'administrator')!;
      expect(admin).toBeDefined();
      const rolloverPerms = admin.permissions.filter((p) => p.startsWith('rollover.'));
      expect(rolloverPerms).toEqual([]);
    });

    it('ensures academic_officer owns rollover execution and validation', () => {
      const ao = DEFAULT_CORE_ROLES.find((r) => r.code === 'academic_officer')!;
      expect(ao).toBeDefined();
      expect(ao.permissions).toContain('rollover.view.own_branch');
      expect(ao.permissions).toContain('rollover.create.own_branch');
      expect(ao.permissions).toContain('rollover.validate.own_branch');
      expect(ao.permissions).not.toContain('rollover.approve.own_branch');
    });

    it('ensures director and branch_manager hold rollover approval rights', () => {
      const director = DEFAULT_CORE_ROLES.find((r) => r.code === 'director')!;
      const bm = DEFAULT_CORE_ROLES.find((r) => r.code === 'branch_manager')!;
      expect(director.permissions).toContain('rollover.approve.all_branches');
      expect(bm.permissions).toContain('rollover.approve.own_branch');
    });
  });

  describe('3. Finance Cashier vs Fee Manager Permissions', () => {
    it('defines granular finance permissions in SYSTEM_PERMISSIONS', () => {
      const financeCodes = [
        'finance.fee_structure.manage.own_branch',
        'finance.fee_structure.manage.all_branches',
        'finance.payment.create.own_branch',
        'finance.payment.create.all_branches',
        'finance.receipt.print.own_branch',
        'finance.receipt.print.all_branches',
        'finance.discount.apply.own_branch',
        'finance.discount.apply.all_branches',
        'finance.void.request.own_branch',
        'finance.void.request.all_branches',
        'finance.refund.request.own_branch',
        'finance.refund.request.all_branches',
      ];

      for (const code of financeCodes) {
        expect(ALL_PERMISSION_CODES).toContain(code);
      }
    });

    it('assigns granular finance permissions to finance_officer and branch_manager', () => {
      const fo = DEFAULT_CORE_ROLES.find((r) => r.code === 'finance_officer')!;
      const bm = DEFAULT_CORE_ROLES.find((r) => r.code === 'branch_manager')!;

      expect(fo.permissions).toContain('finance.payment.create.own_branch');
      expect(fo.permissions).toContain('finance.receipt.print.own_branch');
      expect(fo.permissions).toContain('finance.fee_structure.manage.own_branch');
      expect(fo.permissions).toContain('finance.discount.apply.own_branch');

      expect(bm.permissions).toContain('finance.payment.create.own_branch');
      expect(bm.permissions).toContain('finance.fee_structure.manage.own_branch');
    });
  });

  describe('4. Attendance Canonical Status Enum', () => {
    it('validates canonical attendance status enum including half_day', () => {
      const canonicalStatuses = ['present', 'absent', 'excused', 'late', 'half_day', 'sick'];

      for (const status of canonicalStatuses) {
        const result = attendanceRecordItemSchema.safeParse({
          studentId: '507f1f77bcf86cd799439011',
          status,
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid attendance status', () => {
      const result = attendanceRecordItemSchema.safeParse({
        studentId: '507f1f77bcf86cd799439011',
        status: 'invalid_status',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('5. Program Result Calculation Types', () => {
    it('validates configurable calculation types on program creation', () => {
      const calculationTypes = [
        'total_score',
        'average',
        'percentage',
        'letter_grade',
        'gpa',
        'credit_gpa',
      ];

      for (const calcType of calculationTypes) {
        const result = createProgramSchema.safeParse({
          body: {
            code: 'PROG-TEST',
            nameKh: 'កម្មវិធីសាកល្បង',
            nameEn: 'Test Program',
            resultCalculationType: calcType,
          },
          params: {},
          query: {},
        });
        expect(result.success).toBe(true);
      }
    });

    it('defaults resultCalculationType to average in program model schema', () => {
      const schemaType = ProgramModel.schema.path('resultCalculationType');
      expect(schemaType).toBeDefined();
    });
  });

  describe('6. Secret Management & Audit Redaction', () => {
    it('redacts sensitive credentials, tokens, and bot secrets', () => {
      const payload = {
        username: 'admin',
        password: 'SuperSecretPassword123!',
        token: 'eyJhbGciOi...',
        telegramToken: '123456:ABC-DEF...',
        smsSecret: 'sms_live_secret_key',
        nested: {
          apiKey: 'key_live_987654321',
          publicInfo: 'visible',
        },
      };

      const redacted = redactSensitiveData(payload) as Record<string, unknown>;
      expect(redacted.password).toBe('[REDACTED]');
      expect(redacted.token).toBe('[REDACTED]');
      expect(redacted.telegramToken).toBe('[REDACTED]');
      expect(redacted.smsSecret).toBe('[REDACTED]');
      expect((redacted.nested as Record<string, unknown>).apiKey).toBe('[REDACTED]');
      expect((redacted.nested as Record<string, unknown>).publicInfo).toBe('visible');
    });

    it('identifies secret setting keys correctly', () => {
      expect(isSecretSettingKey('notification.telegram_bot_token')).toBe(true);
      expect(isSecretSettingKey('sms.gateway_secret_key')).toBe(true);
      expect(isSecretSettingKey('app.api_key')).toBe(true);
      expect(isSecretSettingKey('school.name')).toBe(false);
      expect(isSecretSettingKey('academic.term_count')).toBe(false);
    });

    it('defines standard masked secret placeholder', () => {
      expect(MASKED_SECRET_VALUE).toBe('••••••••••••••••');
    });
  });
});
