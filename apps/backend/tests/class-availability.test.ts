import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { ClassModel } from '../src/modules/class/class.model';

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => {
      if (query._id === '507f1f77bcf86cd799439001') {
        return Promise.resolve({
          _id: '507f1f77bcf86cd799439001',
          branchCode: 'MB-01',
          branchNameEn: 'Main Branch',
        });
      }
      return Promise.resolve(null);
    }),
  },
}));

vi.mock('../src/modules/class/class.model', () => {
  const mockClass = {
    _id: '507f1f77bcf86cd799439055',
    branchId: '507f1f77bcf86cd799439001',
    academicYearId: '507f1f77bcf86cd799439002',
    programId: '507f1f77bcf86cd799439011',
    levelId: '507f1f77bcf86cd799439022',
    classCode: 'GEP-ELEM-M1',
    className: 'GEP Elementary Morning 1',
    capacity: 30,
    currentEnrollmentCount: 15,
    status: 'active',
    isDeleted: false,
  };

  const populateChain = {
    populate: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue([mockClass]),
  };

  return {
    ClassModel: {
      find: vi.fn().mockReturnValue(populateChain),
      countDocuments: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      }),
      aggregate: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue([
          {
            totalClasses: 8,
            availableClasses: 5,
            nearCapacityClasses: 2,
            fullClasses: 1,
            completedOrCancelledClasses: 0,
            totalCapacity: 240,
            totalEnrolled: 180,
          },
        ]),
      }),
    },
  };
});

describe('Class Availability API & Summary Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/classes/summary returns availability and occupancy metrics', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/classes/summary?branchId=507f1f77bcf86cd799439001')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      totalClasses: 8,
      availableClasses: 5,
      nearCapacityClasses: 2,
      fullClasses: 1,
      completedOrCancelledClasses: 0,
      totalCapacity: 240,
      totalEnrolled: 180,
      occupancyRate: 75,
    });
    expect(ClassModel.aggregate).toHaveBeenCalled();
  });

  it('GET /api/v1/classes/summary enforces branch access security', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/classes/summary?branchId=507f1f77bcf86cd799439999')
      .set('X-User-Id', '000000000000000000000002')
      .set('X-User-Permissions', 'class.view.own_branch')
      .set('X-Branch-Access', '507f1f77bcf86cd799439001')
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('FORBIDDEN');
  });

  it('GET /api/v1/classes accepts availability=available filter', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/classes?availability=available')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(ClassModel.find).toHaveBeenCalled();
  });

  it('GET /api/v1/classes accepts availability=near_capacity filter', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/classes?availability=near_capacity')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(ClassModel.find).toHaveBeenCalled();
  });

  it('GET /api/v1/classes accepts availability=full filter', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/classes?availability=full')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(ClassModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        status: { $in: ['planned', 'active'] },
        $expr: {
          $and: [
            { $gt: [{ $ifNull: ['$capacity', 0] }, 0] },
            { $gte: [{ $ifNull: ['$currentEnrollmentCount', 0] }, '$capacity'] },
          ],
        },
      }),
    );
  });
});
