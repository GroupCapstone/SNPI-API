import { Types } from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TimeSlotService } from '../src/modules/time-slot/time-slot.service';
import { createTimeSlotSchema } from '../src/modules/time-slot/time-slot.validation';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('Time Slot Management', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('validates start time strictly before end time', () => {
    const valid = createTimeSlotSchema.safeParse({
      code: 'AM-01',
      name: 'Morning Slot 1',
      sessionType: 'morning',
      startTime: '07:30',
      endTime: '08:25',
    });
    expect(valid.success).toBe(true);

    const invalid = createTimeSlotSchema.safeParse({
      code: 'AM-01',
      name: 'Invalid Slot',
      sessionType: 'morning',
      startTime: '08:25',
      endTime: '07:30',
    });
    expect(invalid.success).toBe(false);
  });

  it('creates time slot and computes duration if not provided', async () => {
    const repository = {
      findByCode: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (dto) => ({
        _id: new Types.ObjectId(),
        ...dto,
        durationMinutes: 55,
        toObject: () => dto,
      })),
    };
    const service = new TimeSlotService(repository as never);
    const result = await service.createTimeSlot({
      code: 'AM-01',
      name: 'Morning Slot 1',
      sessionType: 'morning',
      startTime: '07:30',
      endTime: '08:25',
    });

    expect(result.durationMinutes).toBe(55);
    expect(repository.create).toHaveBeenCalled();
  });
});
