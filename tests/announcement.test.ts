import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AnnouncementRepository } from '../src/modules/announcement/announcement.repository';
import { AnnouncementService } from '../src/modules/announcement/announcement.service';
import { BranchModel } from '../src/modules/branch/branch.model';
import { SchoolModel } from '../src/modules/school/school.model';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    findOne: vi.fn(),
  },
}));

describe('Announcement Service', () => {
  const schoolId = new Types.ObjectId().toString();
  const branchId = new Types.ObjectId().toString();
  const otherBranchId = new Types.ObjectId().toString();

  const superAdminUser: AuthUser = {
    userId: new Types.ObjectId().toString(),
    username: 'admin',
    email: 'admin@snp.edu.kh',
    schoolId,
    roles: ['super_admin'],
    permissions: ['*'],
    branchAccess: 'all',
  };

  const branchManagerUser: AuthUser = {
    userId: new Types.ObjectId().toString(),
    username: 'bm',
    email: 'bm@snp.edu.kh',
    schoolId,
    roles: ['branch_manager'],
    permissions: ['announcement.create.own_branch', 'announcement.view.own_branch'],
    branchAccess: [branchId],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAnnouncement', () => {
    it('successfully creates an announcement for authorized branch', async () => {
      vi.mocked(SchoolModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: schoolId }),
      } as never);

      vi.mocked(BranchModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: branchId }),
      } as never);

      const mockRepo = new AnnouncementRepository();
      const announcementId = new Types.ObjectId().toString();

      vi.spyOn(mockRepo, 'create').mockResolvedValue({
        _id: announcementId,
        schoolId: new Types.ObjectId(schoolId),
        branchId: new Types.ObjectId(branchId),
        title: 'Midterm Break Notice',
        content: 'School is closed.',
        category: 'holiday',
        audience: 'all',
        isPublished: true,
        isPinned: false,
      } as never);

      const service = new AnnouncementService(mockRepo);
      const result = await service.createAnnouncement(
        {
          branchId,
          title: 'Midterm Break Notice',
          content: 'School is closed.',
          category: 'holiday',
          audience: 'all',
        },
        branchManagerUser,
      );

      expect(result._id).toBe(announcementId);
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('rejects creation if user lacks access to the branch', async () => {
      const service = new AnnouncementService();

      await expect(
        service.createAnnouncement(
          {
            branchId: otherBranchId,
            title: 'Unauthorized announcement',
            content: 'Should be rejected',
          },
          branchManagerUser,
        ),
      ).rejects.toThrow('You do not have access to create announcements for this branch');
    });
  });

  describe('getAnnouncements', () => {
    it('retrieves paginated announcements within user branch scope', async () => {
      const mockRepo = new AnnouncementRepository();
      vi.spyOn(mockRepo, 'findMany').mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      } as never);

      const service = new AnnouncementService(mockRepo);
      const result = await service.getAnnouncements({ page: 1, limit: 10 }, branchManagerUser);

      expect(result.pagination.total).toBe(0);
      expect(mockRepo.findMany).toHaveBeenCalled();
    });
  });

  describe('getAnnouncementById', () => {
    it('throws NotFoundError if announcement does not exist', async () => {
      const mockRepo = new AnnouncementRepository();
      vi.spyOn(mockRepo, 'findById').mockResolvedValue(null);

      const service = new AnnouncementService(mockRepo);
      await expect(
        service.getAnnouncementById(new Types.ObjectId().toString(), superAdminUser),
      ).rejects.toThrow('Announcement not found');
    });
  });

  describe('deleteAnnouncement', () => {
    it('deletes announcement if user has access', async () => {
      const mockRepo = new AnnouncementRepository();
      const announcementId = new Types.ObjectId().toString();

      vi.spyOn(mockRepo, 'findById').mockResolvedValue({
        _id: announcementId,
        schoolId: new Types.ObjectId(schoolId),
        branchId: new Types.ObjectId(branchId),
        title: 'Notice to delete',
        content: 'Content',
      } as never);

      vi.spyOn(mockRepo, 'softDelete').mockResolvedValue({
        _id: announcementId,
        isDeleted: true,
      } as never);

      const service = new AnnouncementService(mockRepo);
      await service.deleteAnnouncement(announcementId, branchManagerUser);

      expect(mockRepo.softDelete).toHaveBeenCalledWith(announcementId, branchManagerUser.userId);
    });
  });
});
