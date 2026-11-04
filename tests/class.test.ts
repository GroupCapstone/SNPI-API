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

vi.mock('../src/modules/academic-year/academic-year.model', () => ({
  AcademicYearModel: {
    findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => {
      if (query._id === '507f1f77bcf86cd799439002') {
        return Promise.resolve({
          _id: '507f1f77bcf86cd799439002',
          code: 'AY-2026-2027',
          name: '2026-2027 Academic Year',
        });
      }
      return Promise.resolve(null);
    }),
  },
}));

vi.mock('../src/modules/program/program.model', () => ({
  ProgramModel: {
    findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => {
      if (query._id === '507f1f77bcf86cd799439011') {
        return {
          exec: vi.fn().mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            code: 'GEP',
            nameEn: 'General English Program',
          }),
        };
      }
      return { exec: vi.fn().mockResolvedValue(null) };
    }),
  },
}));

vi.mock('../src/modules/level/level.model', () => ({
  LevelModel: {
    findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => {
      if (query._id === '507f1f77bcf86cd799439022') {
        return {
          populate: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
              _id: '507f1f77bcf86cd799439022',
              programId: '507f1f77bcf86cd799439011', // belongs to GEP
              code: 'GEP-ELEM',
              name: 'Elementary',
            }),
          }),
          exec: vi.fn().mockResolvedValue({
            _id: '507f1f77bcf86cd799439022',
            programId: '507f1f77bcf86cd799439011',
            code: 'GEP-ELEM',
            name: 'Elementary',
          }),
        };
      }
      if (query._id === '507f1f77bcf86cd799439099') {
        return {
          populate: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue({
              _id: '507f1f77bcf86cd799439099',
              programId: '507f1f77bcf86cd799439888', // different program
              code: 'CEP-STA',
              name: 'Starter',
            }),
          }),
          exec: vi.fn().mockResolvedValue({
            _id: '507f1f77bcf86cd799439099',
            programId: '507f1f77bcf86cd799439888',
            code: 'CEP-STA',
            name: 'Starter',
          }),
        };
      }
      return {
        populate: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) }),
        exec: vi.fn().mockResolvedValue(null),
      };
    }),
  },
}));

vi.mock('../src/modules/classroom/classroom.model', () => ({
  ClassroomModel: {
    findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => {
      if (query._id === '507f1f77bcf86cd799439003') {
        return Promise.resolve({
          _id: '507f1f77bcf86cd799439003',
          branchId: '507f1f77bcf86cd799439001', // Main branch
          code: 'R101',
          name: 'Room 101',
        });
      }
      if (query._id === '507f1f77bcf86cd799439004') {
        return Promise.resolve({
          _id: '507f1f77bcf86cd799439004',
          branchId: '507f1f77bcf86cd799439009', // Different branch
          code: 'R201',
          name: 'Room 201',
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
    status: 'active',
    isDeleted: false,
    toObject: () => ({ _id: '507f1f77bcf86cd799439055', classCode: 'GEP-ELEM-M1' }),
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
      findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => {
        if (
          query.classCode === 'GEP-ELEM-M1' ||
          query._id === '507f1f77bcf86cd799439044' ||
          query._id === '507f1f77bcf86cd799439099'
        ) {
          return {
            populate: vi.fn().mockReturnThis(),
            sort: vi.fn().mockReturnThis(),
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            exec: vi.fn().mockResolvedValue(mockClass),
          };
        }
        return {
          populate: vi.fn().mockReturnThis(),
          sort: vi.fn().mockReturnThis(),
          skip: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue(null),
        };
      }),
      create: vi.fn().mockImplementation((data) =>
        Promise.resolve({
          ...data,
          _id: '507f1f77bcf86cd799439099',
          toObject: () => ({ ...data, _id: '507f1f77bcf86cd799439099' }),
        }),
      ),
      findOneAndUpdate: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue({
          ...mockClass,
          className: 'Updated Class Name',
        }),
      }),
    },
  };
});

describe('Class API Endpoints & Relational Business Rules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/classes returns classes for authorized branches', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/v1/classes creates a class when all relational constraints are satisfied', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.create.all_branches')
      .send({
        branchId: '507f1f77bcf86cd799439001',
        academicYearId: '507f1f77bcf86cd799439002',
        programId: '507f1f77bcf86cd799439011',
        levelId: '507f1f77bcf86cd799439022',
        classroomId: '507f1f77bcf86cd799439003',
        classCode: 'GEP-ELEM-M2',
        className: 'GEP Elementary Morning 2',
        capacity: 30,
        status: 'active',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(ClassModel.create).toHaveBeenCalled();
  });

  it('POST /api/v1/classes rejects level that does not belong to selected program', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.create.all_branches')
      .send({
        branchId: '507f1f77bcf86cd799439001',
        academicYearId: '507f1f77bcf86cd799439002',
        programId: '507f1f77bcf86cd799439011', // GEP
        levelId: '507f1f77bcf86cd799439099', // CEP level (mismatched)
        classCode: 'INVALID-RELATION',
        className: 'Mismatched Program and Level',
        capacity: 30,
      })
      .expect(422);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('does not belong to the selected program');
  });

  it('POST /api/v1/classes rejects classroom located in another branch', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.create.all_branches')
      .send({
        branchId: '507f1f77bcf86cd799439001', // Main Branch
        academicYearId: '507f1f77bcf86cd799439002',
        programId: '507f1f77bcf86cd799439011',
        levelId: '507f1f77bcf86cd799439022',
        classroomId: '507f1f77bcf86cd799439004', // Classroom belonging to another branch
        classCode: 'MISMATCH-ROOM',
        className: 'Mismatched Room Branch',
        capacity: 30,
      })
      .expect(422);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('does not belong to this branch');
  });

  it('POST /api/v1/classes blocks user trying to create class in an unauthorized branch', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000005')
      .set('X-User-Permissions', 'class.create.own_branch')
      .set('X-Branch-Access', '507f1f77bcf86cd799439999') // only has access to branch 999
      .send({
        branchId: '507f1f77bcf86cd799439001', // trying to create in branch 001
        academicYearId: '507f1f77bcf86cd799439002',
        programId: '507f1f77bcf86cd799439011',
        levelId: '507f1f77bcf86cd799439022',
        classCode: 'UNAUTHORIZED-BRANCH',
        className: 'Unauthorized Branch Class',
        capacity: 30,
      })
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('FORBIDDEN');
  });
});
