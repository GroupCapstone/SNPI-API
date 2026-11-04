import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { LevelModel } from '../src/modules/level/level.model';
import { ProgramModel } from '../src/modules/program/program.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';

const app = createApp();

describe('Tuition Fee Module Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/tuition-fees returns paginated list of tuition fee structures', async () => {
    vi.spyOn(TuitionFeeModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e3',
          feeName: 'GEP Beginner Term 1',
          feeCode: 'TF-BEG-T1',
          amount: 250,
          currency: 'USD',
          billingCycle: 'term',
          status: 'active',
        },
      ]),
    } as never);

    vi.spyOn(TuitionFeeModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/tuition-fees');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].feeCode).toBe('TF-BEG-T1');
  });

  it('POST /api/v1/tuition-fees creates fee structure successfully', async () => {
    vi.spyOn(ProgramModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: '6a939db4ea1f071b8b1f17a1' }),
    } as never);

    vi.spyOn(LevelModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: '6a939db4ea1f071b8b1f17b1',
        programId: '6a939db4ea1f071b8b1f17a1',
      }),
    } as never);

    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: '6a939db4ea1f071b8b1f17c1',
        schoolId: '6a939db4ea1f071b8b1f17d1',
      }),
    } as never);

    vi.spyOn(TuitionFeeModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    vi.spyOn(TuitionFeeModel, 'create').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f17e3',
      schoolId: '6a939db4ea1f071b8b1f17d1',
      branchId: '6a939db4ea1f071b8b1f17c1',
      academicYearId: '6a939db4ea1f071b8b1f17f1',
      programId: '6a939db4ea1f071b8b1f17a1',
      levelId: '6a939db4ea1f071b8b1f17b1',
      feeName: 'GEP Elementary Semester 1',
      feeCode: 'TF-ELEM-S1',
      amount: 450,
      currency: 'USD',
      billingCycle: 'semester',
      status: 'active',
      toObject: vi.fn().mockReturnValue({ _id: '6a939db4ea1f071b8b1f17e3' }),
    } as never);

    const payload = {
      schoolId: '6a939db4ea1f071b8b1f17d1',
      branchId: '6a939db4ea1f071b8b1f17c1',
      academicYearId: '6a939db4ea1f071b8b1f17f1',
      programId: '6a939db4ea1f071b8b1f17a1',
      levelId: '6a939db4ea1f071b8b1f17b1',
      feeName: 'GEP Elementary Semester 1',
      feeCode: 'TF-ELEM-S1',
      amount: 450,
      currency: 'USD',
      billingCycle: 'semester',
    };

    const res = await request(app).post('/api/v1/tuition-fees').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.feeCode).toBe('TF-ELEM-S1');
  });
});
