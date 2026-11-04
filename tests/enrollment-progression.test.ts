import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { EnrollmentRepository } from '../src/modules/enrollment/enrollment.repository';
import { StudentModel } from '../src/modules/student/student.model';

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/student/student.model', () => ({
  StudentModel: {
    find: vi.fn(),
  },
}));

describe('Enrollment Progression & Retention Repository', () => {
  let repository: EnrollmentRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new EnrollmentRepository();
  });

  const setupMockQuery = (docs: unknown[] = [], total = 0) => {
    const mockQuery = {
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(docs),
    };
    vi.mocked(EnrollmentModel.find).mockReturnValue(mockQuery as never);
    vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(total),
    } as never);
    return mockQuery;
  };

  it('filters by statusGroup "continuing" with active and enrolled statuses', async () => {
    setupMockQuery();

    await repository.findAll({ statusGroup: 'continuing' });

    expect(EnrollmentModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        status: { $in: ['active', 'enrolled'] },
      }),
    );
  });

  it('filters by statusGroup "completed" with completed and promoted statuses', async () => {
    setupMockQuery();

    await repository.findAll({ statusGroup: 'completed' });

    expect(EnrollmentModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        status: { $in: ['completed', 'promoted'] },
      }),
    );
  });

  it('filters by statusGroup "dropped" with dropped, suspended, withdrawn, and cancelled statuses', async () => {
    setupMockQuery();

    await repository.findAll({ statusGroup: 'dropped' });

    expect(EnrollmentModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        status: { $in: ['dropped', 'suspended', 'withdrawn', 'cancelled'] },
      }),
    );
  });

  it('filters by year and month on enrollmentDate', async () => {
    setupMockQuery();

    await repository.findAll({ year: 2026, month: 8 });

    expect(EnrollmentModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        enrollmentDate: {
          $gte: new Date(2026, 7, 1),
          $lte: new Date(2026, 8, 0, 23, 59, 59, 999),
        },
      }),
    );
  });

  it('searches matching students by name and includes their IDs in $or alongside enrollmentCode', async () => {
    setupMockQuery();
    const studentId1 = new Types.ObjectId();
    const studentId2 = new Types.ObjectId();

    vi.mocked(StudentModel.find).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([{ _id: studentId1 }, { _id: studentId2 }]),
    } as never);

    await repository.findAll({ search: 'Dara' });

    expect(StudentModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        isDeleted: false,
        $or: expect.arrayContaining([
          expect.objectContaining({ firstName: expect.any(RegExp) }),
          expect.objectContaining({ lastName: expect.any(RegExp) }),
          expect.objectContaining({ khmerName: expect.any(RegExp) }),
        ]),
      }),
    );

    expect(EnrollmentModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { enrollmentCode: expect.any(RegExp) },
          { studentId: { $in: [studentId1, studentId2] } },
        ],
      }),
    );
  });
});
