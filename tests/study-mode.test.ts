import { Types } from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClassModel } from '../src/modules/class/class.model';
import { StudyModeService } from '../src/modules/study-mode/study-mode.service';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('Study Mode Master Data', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('creates study mode with uppercase code', async () => {
    const repository = {
      findByCode: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(async (dto) => ({
        _id: new Types.ObjectId(),
        ...dto,
        code: dto.code.toUpperCase(),
        toObject: () => dto,
      })),
    };
    const service = new StudyModeService(repository as never);
    const result = await service.createStudyMode({
      code: 'ft',
      nameEn: 'Full-Time',
      nameKh: 'ពេញម៉ោង',
      sortOrder: 1,
    });

    expect(result.code).toBe('FT');
    expect(repository.create).toHaveBeenCalled();
  });

  it('rejects duplicate study mode code', async () => {
    const repository = {
      findByCode: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(), code: 'FT' }),
    };
    const service = new StudyModeService(repository as never);
    await expect(
      service.createStudyMode({
        code: 'FT',
        nameEn: 'Full-Time',
        nameKh: 'ពេញម៉ោង',
      }),
    ).rejects.toThrow('already exists');
  });

  it('blocks deletion if active classes reference the study mode', async () => {
    const studyModeId = new Types.ObjectId();
    const repository = {
      findById: vi.fn().mockResolvedValue({
        _id: studyModeId,
        nameEn: 'Full-Time',
        code: 'FT',
        toObject: () => ({ nameEn: 'Full-Time' }),
      }),
    };
    vi.spyOn(ClassModel, 'countDocuments').mockResolvedValue(3 as never);

    const service = new StudyModeService(repository as never);
    await expect(service.deleteStudyMode(studyModeId.toString())).rejects.toThrow(
      'Cannot delete Study Mode "Full-Time" because it is currently assigned to 3 active class(es)',
    );
  });
});
