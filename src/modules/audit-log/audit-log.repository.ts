import { Types } from 'mongoose';
import { BranchModel } from '../branch/branch.model';
import { UserModel } from '../user/user.model';
import type { IAuditLog } from './audit-log.model';
import { AuditLogModel } from './audit-log.model';
import type { AuditLogFilters } from './audit-log.types';

export class AuditLogRepository {
  public async findWithFilters(
    filters: AuditLogFilters,
    branchFilter: { branchId?: string | { $in: string[] } } = {},
  ): Promise<{ data: IAuditLog[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      ...branchFilter,
    };

    if (filters.module) {
      query.module = filters.module;
    }

    if (filters.action) {
      query.action = filters.action;
    }

    if (filters.entityType) {
      query.entityType = filters.entityType;
    }

    if (filters.entityId) {
      if (Types.ObjectId.isValid(filters.entityId)) {
        query.entityId = {
          $in: [new Types.ObjectId(filters.entityId), filters.entityId],
        };
      } else {
        query.entityId = filters.entityId;
      }
    }

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.schoolId) {
      query.schoolId = filters.schoolId;
    }

    if (filters.branchId) {
      query.branchId = filters.branchId;
    }

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) {
        (query.timestamp as Record<string, unknown>).$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        (query.timestamp as Record<string, unknown>).$lte = new Date(filters.endDate);
      }
    }

    if (filters.search && filters.search.trim()) {
      const escaped = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');

      const matchingUsers = await UserModel.find({
        $or: [{ username: searchRegex }, { email: searchRegex }],
      })
        .select('_id')
        .lean();
      const userIds = matchingUsers.map((u) => u._id.toString());

      query.$or = [
        { reason: searchRegex },
        { entityType: searchRegex },
        { module: searchRegex },
        ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : []),
      ];
    }

    const [rawLogs, total] = await Promise.all([
      AuditLogModel.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean().exec(),
      AuditLogModel.countDocuments(query).exec(),
    ]);

    const userIds = [
      ...new Set(
        rawLogs
          .map((item) => (item.userId ? String(item.userId) : null))
          .filter((id): id is string => Boolean(id && Types.ObjectId.isValid(id))),
      ),
    ];
    const branchIds = [
      ...new Set(
        rawLogs
          .map((item) => (item.branchId ? String(item.branchId) : null))
          .filter((id): id is string => Boolean(id && Types.ObjectId.isValid(id))),
      ),
    ];

    const [users, branches] = await Promise.all([
      userIds.length > 0
        ? UserModel.find({ _id: { $in: userIds } })
            .select('_id username email employeeId')
            .lean()
        : [],
      branchIds.length > 0
        ? BranchModel.find({ _id: { $in: branchIds } })
            .select('_id branchCode branchNameEn branchNameKh')
            .lean()
        : [],
    ]);

    const userMap = new Map(users.map((u) => [String(u._id), u]));
    const branchMap = new Map(branches.map((b) => [String(b._id), b]));

    const populatedData = rawLogs.map((item) => {
      const populated: Record<string, unknown> = { ...item };
      if (item.userId && userMap.has(String(item.userId))) {
        populated.user = userMap.get(String(item.userId));
      }
      if (item.branchId && branchMap.has(String(item.branchId))) {
        populated.branch = branchMap.get(String(item.branchId));
      }
      return populated;
    });

    return { data: populatedData as unknown as IAuditLog[], total };
  }
}
