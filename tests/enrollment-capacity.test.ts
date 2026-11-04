import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidationError } from '../src/shared/errors/app-error';
import { ClassModel } from '../src/modules/class/class.model';
import {
  reconcileClassEnrollmentCount,
  reserveClassSeat,
} from '../src/modules/enrollment/enrollment-capacity.service';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: {
    findOneAndUpdate: vi.fn(),
    updateOne: vi.fn(),
  },
}));

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    countDocuments: vi.fn(),
  },
}));

describe('enrollment capacity control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reserves a seat and reconciles the denormalized class counter', async () => {
    vi.mocked(ClassModel.findOneAndUpdate).mockResolvedValue({
      _id: 'class-1',
      className: 'Grade 1A',
      capacity: 30,
    } as never);
    vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(12),
    } as never);
    vi.mocked(ClassModel.updateOne).mockResolvedValue({ acknowledged: true } as never);

    await reserveClassSeat({ classId: 'class-1', className: 'Grade 1A', capacity: 30 });

    expect(ClassModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'class-1', isDeleted: false },
      { $inc: { capacityRevision: 1 } },
      { session: undefined, new: true },
    );
    expect(ClassModel.updateOne).toHaveBeenCalledWith(
      { _id: 'class-1', isDeleted: false },
      { $set: { currentEnrollmentCount: 13 } },
      { session: undefined },
    );
  });

  it('rejects a reservation when the live enrollment count reaches capacity', async () => {
    vi.mocked(ClassModel.findOneAndUpdate).mockResolvedValue({
      _id: 'class-1',
      className: 'Grade 1A',
      capacity: 20,
    } as never);
    vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(20),
    } as never);

    await expect(
      reserveClassSeat({ classId: 'class-1', className: 'Grade 1A', capacity: 20 }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(ClassModel.updateOne).not.toHaveBeenCalled();
  });

  it('reconciles a class counter after an enrollment is closed', async () => {
    vi.mocked(ClassModel.findOneAndUpdate).mockResolvedValue({ _id: 'class-1' } as never);
    vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(8),
    } as never);

    await reconcileClassEnrollmentCount('class-1');

    expect(ClassModel.updateOne).toHaveBeenCalledWith(
      { _id: 'class-1', isDeleted: false },
      { $set: { currentEnrollmentCount: 8 } },
      { session: undefined },
    );
  });
});
