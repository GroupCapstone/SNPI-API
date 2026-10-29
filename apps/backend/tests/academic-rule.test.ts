import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicRuleModel } from '../src/modules/academic-rule/academic-rule.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';
import { AcademicRuleService } from '../src/modules/academic-rule/academic-rule.service';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

vi.mock('../src/utils/transaction', () => ({
  runInTransaction: vi.fn((cb) => cb(null)),
}));

const app = createApp();

describe('Academic Rule Engine & Versioning API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects global rule creation for an own-branch manager', async () => {
    const service = new AcademicRuleService();
    await expect(
      service.createRule(
        {
          ruleType: 'grade_scheme',
          code: 'GLOBAL_GRADE',
          name: 'Global Grade Scheme',
          schoolId: '6a939db4ea1f071b8b1f1703',
          config: {
            bands: [
              { minimum: 50, grade: 'E', gpa: 1 },
              { minimum: 0, grade: 'F', gpa: 0 },
            ],
          },
        },
        {
          userId: '6a939db4ea1f071b8b1f1709',
          username: 'academic-officer',
          email: 'academic@example.com',
          schoolId: '6a939db4ea1f071b8b1f1703',
          roles: ['academic_officer'],
          permissions: ['academic_rule.manage.own_branch'],
          branchAccess: ['6a939db4ea1f071b8b1f1704'],
        },
      ),
    ).rejects.toThrow(/Global academic rules require all-branches management access/);
  });

  const mockRule = {
    _id: '6a939db4ea1f071b8b1f1801',
    ruleType: 'grade_scheme',
    code: 'STANDARD_GRADING',
    name: 'Standard Secondary Grading Scheme',
    version: 1,
    effectiveFrom: new Date('2025-01-01'),
    schoolId: '6a939db4ea1f071b8b1f1703',
    config: {
      bands: [
        { minimum: 90, grade: 'A', gpa: 4.0 },
        { minimum: 80, grade: 'B', gpa: 3.0 },
        { minimum: 50, grade: 'E', gpa: 1.0 },
        { minimum: 0, grade: 'F', gpa: 0.0 },
      ],
    },
    status: 'active',
    isDeleted: false,
  };

  it('GET /api/v1/academic-rules returns paginated versioned rules', async () => {
    vi.spyOn(AcademicRuleModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockRule]),
    } as never);

    vi.spyOn(AcademicRuleModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/academic-rules');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].code).toBe('STANDARD_GRADING');
    expect(res.body.data[0].version).toBe(1);
  });

  it('POST /api/v1/academic-rules creates a new version 1 rule', async () => {
    vi.spyOn(SchoolModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1703',
      isDeleted: false,
    } as never);
    vi.spyOn(AcademicRuleModel, 'findOne').mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    } as never);
    vi.spyOn(AcademicRuleModel, 'create').mockResolvedValue(mockRule as never);

    const payload = {
      ruleType: 'grade_scheme',
      code: 'STANDARD_GRADING',
      name: 'Standard Secondary Grading Scheme',
      schoolId: '6a939db4ea1f071b8b1f1703',
      config: {
        bands: [
          { minimum: 50, grade: 'E', gpa: 1 },
          { minimum: 0, grade: 'F', gpa: 0 },
        ],
      },
      status: 'active',
    };

    const res = await request(app)
      .post('/api/v1/academic-rules')
      .set('X-School-Id', payload.schoolId)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.version).toBe(1);
  });

  it('POST /api/v1/academic-rules/:id/version creates v2 and preserves historical v1', async () => {
    const mockSave = vi.fn().mockResolvedValue(undefined);
    const existingV1 = {
      ...mockRule,
      save: mockSave,
    };

    vi.spyOn(AcademicRuleModel, 'findOne').mockResolvedValue(existingV1 as never);
    vi.spyOn(AcademicRuleModel, 'create').mockResolvedValue({
      ...mockRule,
      _id: '6a939db4ea1f071b8b1f1802',
      version: 2,
      effectiveFrom: new Date('2026-09-01'),
    } as never);

    const res = await request(app)
      .post(`/api/v1/academic-rules/${mockRule._id}/version`)
      .set('X-School-Id', String(mockRule.schoolId))
      .send({
        effectiveFrom: '2026-09-01T00:00:00.000Z',
        config: {
          bands: [
            { minimum: 60, grade: 'E', gpa: 1 },
            { minimum: 0, grade: 'F', gpa: 0 },
          ],
        },
        reason: 'Curriculum standard revision for 2026',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.version).toBe(2);
    expect(mockSave).toHaveBeenCalled();
  });

  it('PATCH /api/v1/academic-rules/:id blocks modifying config if historical results depend on it', async () => {
    vi.spyOn(AcademicRuleModel, 'findOne').mockResolvedValue(mockRule as never);
    vi.spyOn(TermResultModel, 'countDocuments').mockResolvedValue(15 as never);

    const res = await request(app)
      .patch(`/api/v1/academic-rules/${mockRule._id}`)
      .set('X-School-Id', String(mockRule.schoolId))
      .send({
        config: {
          bands: [
            { minimum: 60, grade: 'E', gpa: 1 },
            { minimum: 0, grade: 'F', gpa: 0 },
          ],
        },
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toContain('finalized term results depend on this historical rule');
  });
});
