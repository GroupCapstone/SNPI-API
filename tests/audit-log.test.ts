import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AuditLogModel } from '../src/modules/audit-log/audit-log.model';

vi.mock('../src/modules/audit-log/audit-log.model', () => ({
  AuditLogModel: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../src/modules/user/user.model', () => ({
  UserModel: {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          {
            _id: '507f1f77bcf86cd799439006',
            username: 'admin',
            email: 'admin@snp.edu.kh',
          },
        ]),
      }),
    }),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      }),
    }),
  },
}));

describe('Audit Log API Tests', () => {
  const app = createApp();

  const mockAuditEntry = {
    _id: '507f1f77bcf86cd799439090',
    module: 'employee',
    action: 'CREATE',
    entityType: 'Employee',
    entityId: '507f1f77bcf86cd799439005',
    userId: '507f1f77bcf86cd799439006',
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/audit-logs', () => {
    it('returns a paginated stream of audit log entries', async () => {
      const mockQuery = {
        sort: vi.fn().mockImplementation(() => mockQuery),
        skip: vi.fn().mockImplementation(() => mockQuery),
        limit: vi.fn().mockImplementation(() => mockQuery),
        lean: vi.fn().mockImplementation(() => mockQuery),
        exec: vi.fn().mockImplementation(() => Promise.resolve([mockAuditEntry])),
      };

      vi.mocked(AuditLogModel.find).mockImplementation(() => mockQuery as never);
      vi.mocked(AuditLogModel.countDocuments).mockImplementation(
        () =>
          ({
            exec: vi.fn().mockImplementation(() => Promise.resolve(1)),
          }) as never,
      );

      const response = await request(app).get('/api/v1/audit-logs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.total).toBe(1);
      expect(response.body.data[0].user.username).toBe('admin');
    });

    it('filters audit logs by search keyword across reason, module, and user', async () => {
      const mockQuery = {
        sort: vi.fn().mockImplementation(() => mockQuery),
        skip: vi.fn().mockImplementation(() => mockQuery),
        limit: vi.fn().mockImplementation(() => mockQuery),
        lean: vi.fn().mockImplementation(() => mockQuery),
        exec: vi.fn().mockImplementation(() => Promise.resolve([mockAuditEntry])),
      };

      vi.mocked(AuditLogModel.find).mockImplementation(() => mockQuery as never);
      vi.mocked(AuditLogModel.countDocuments).mockImplementation(
        () =>
          ({
            exec: vi.fn().mockImplementation(() => Promise.resolve(1)),
          }) as never,
      );

      const response = await request(app).get('/api/v1/audit-logs?search=admin&action=CREATE');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('accepts expanded audit actions such as USER_ACTIVATED and WORKFLOW_TRANSITION', async () => {
      const mockQuery = {
        sort: vi.fn().mockImplementation(() => mockQuery),
        skip: vi.fn().mockImplementation(() => mockQuery),
        limit: vi.fn().mockImplementation(() => mockQuery),
        lean: vi.fn().mockImplementation(() => mockQuery),
        exec: vi
          .fn()
          .mockImplementation(() =>
            Promise.resolve([{ ...mockAuditEntry, action: 'USER_ACTIVATED' }]),
          ),
      };

      vi.mocked(AuditLogModel.find).mockImplementation(() => mockQuery as never);
      vi.mocked(AuditLogModel.countDocuments).mockImplementation(
        () =>
          ({
            exec: vi.fn().mockImplementation(() => Promise.resolve(1)),
          }) as never,
      );

      const response = await request(app).get('/api/v1/audit-logs?action=USER_ACTIVATED');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].action).toBe('USER_ACTIVATED');
    });

    it('filters audit logs by entityType and entityId', async () => {
      const mockQuery = {
        sort: vi.fn().mockImplementation(() => mockQuery),
        skip: vi.fn().mockImplementation(() => mockQuery),
        limit: vi.fn().mockImplementation(() => mockQuery),
        lean: vi.fn().mockImplementation(() => mockQuery),
        exec: vi.fn().mockImplementation(() => Promise.resolve([mockAuditEntry])),
      };

      vi.mocked(AuditLogModel.find).mockImplementation(() => mockQuery as never);
      vi.mocked(AuditLogModel.countDocuments).mockImplementation(
        () =>
          ({
            exec: vi.fn().mockImplementation(() => Promise.resolve(1)),
          }) as never,
      );

      const response = await request(app).get(
        '/api/v1/audit-logs?entityType=Employee&entityId=507f1f77bcf86cd799439005',
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(AuditLogModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: 'Employee',
          entityId: expect.objectContaining({
            $in: expect.arrayContaining(['507f1f77bcf86cd799439005']),
          }),
        }),
      );
    });
  });
});
