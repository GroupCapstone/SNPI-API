import { Types } from 'mongoose';
import { createSafeSearchRegex } from '../../utils/search';
import type { INotification, IParentContactLog } from './notification.model';
import { NotificationModel, ParentContactLogModel } from './notification.model';
import type {
  NotificationFilters,
  NotificationStatsResponse,
  ParentContactLogFilters,
} from './notification.types';

export class NotificationRepository {
  public async findWithFilters(
    filters: NotificationFilters,
    branchFilter: Record<string, unknown>,
  ): Promise<{ data: INotification[]; total: number; page: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.channel) query.channel = filters.channel;
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate)
        (query.createdAt as Record<string, unknown>).$gte = new Date(filters.startDate);
      if (filters.endDate)
        (query.createdAt as Record<string, unknown>).$lte = new Date(filters.endDate);
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { title: searchRegex },
        { recipientName: searchRegex },
        { recipientPhone: searchRegex },
        { recipientChatId: searchRegex },
      ];
    }

    const [data, total] = await Promise.all([
      NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      NotificationModel.countDocuments(query),
    ]);

    return {
      data: data as unknown as INotification[],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async createNotification(payload: Partial<INotification>): Promise<INotification> {
    const created = await NotificationModel.create(payload);
    return created;
  }

  public async updateNotificationStatus(
    id: string,
    status: 'sent' | 'failed',
    errorDetails?: string,
    sentAt?: Date,
  ): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          ...(errorDetails ? { errorDetails } : {}),
          ...(sentAt ? { sentAt } : {}),
        },
      },
      { new: true },
    );
  }

  public async getStats(
    schoolId: string,
    branchFilter: Record<string, unknown>,
  ): Promise<NotificationStatsResponse> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const baseQuery = {
      schoolId: new Types.ObjectId(schoolId),
      isDeleted: false,
      ...branchFilter,
    };

    const [totalSent, sentToday, failedCount, channelStats] = await Promise.all([
      NotificationModel.countDocuments({ ...baseQuery, status: 'sent' }),
      NotificationModel.countDocuments({
        ...baseQuery,
        status: 'sent',
        createdAt: { $gte: todayStart },
      }),
      NotificationModel.countDocuments({ ...baseQuery, status: 'failed' }),
      NotificationModel.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$channel', count: { $sum: 1 } } },
      ]),
    ]);

    const byChannel = {
      telegram: 0,
      sms: 0,
      in_app: 0,
    };

    for (const stat of channelStats) {
      if (stat._id === 'telegram') byChannel.telegram = stat.count;
      if (stat._id === 'sms') byChannel.sms = stat.count;
      if (stat._id === 'in_app') byChannel.in_app = stat.count;
    }

    return {
      totalSent,
      sentToday,
      failedCount,
      byChannel,
    };
  }

  // Parent Contact Log Methods
  public async findContactLogsWithFilters(
    filters: ParentContactLogFilters,
    branchFilter: Record<string, unknown>,
  ): Promise<{ data: IParentContactLog[]; total: number; page: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.studentId) query.studentId = new Types.ObjectId(filters.studentId);
    if (filters.contactType) query.contactType = filters.contactType;
    if (filters.purpose) query.purpose = filters.purpose;

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { guardianName: searchRegex },
        { guardianPhone: searchRegex },
        { notes: searchRegex },
      ];
    }

    const [data, total] = await Promise.all([
      ParentContactLogModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName')
        .sort({ contactDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ParentContactLogModel.countDocuments(query),
    ]);

    return {
      data: data as unknown as IParentContactLog[],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async createContactLog(payload: Partial<IParentContactLog>): Promise<IParentContactLog> {
    return ParentContactLogModel.create(payload);
  }
}
