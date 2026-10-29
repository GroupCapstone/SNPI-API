import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { ITimeSlot } from './time-slot.model';
import { TimeSlotModel } from './time-slot.model';
import type { CreateTimeSlotDto, TimeSlotQueryFilters, UpdateTimeSlotDto } from './time-slot.types';

export class TimeSlotRepository {
  public async findWithFilters(
    filters: TimeSlotQueryFilters,
  ): Promise<{ data: ITimeSlot[]; total: number }> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.$and = [
        {
          $or: [
            { branchId: new Types.ObjectId(filters.branchId) },
            { branchId: { $exists: false } },
            { branchId: null },
          ],
        },
      ];
    }
    if (filters.sessionType) {
      query.sessionType = filters.sessionType;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.search && filters.search.trim()) {
      const searchRegex = createSafeSearchRegex(filters.search);
      const searchCondition = { $or: [{ code: searchRegex }, { name: searchRegex }] };
      if (query.$and) (query.$and as Record<string, unknown>[]).push(searchCondition);
      else query.$and = [searchCondition];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      TimeSlotModel.find(query)
        .sort({ sessionType: 1, sortOrder: 1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      TimeSlotModel.countDocuments(query),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<ITimeSlot | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TimeSlotModel.findOne({
      _id: new Types.ObjectId(id),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    }).exec();
  }

  public async findByCode(
    code: string,
    schoolId?: string,
    branchId?: string,
  ): Promise<ITimeSlot | null> {
    return TimeSlotModel.findOne({
      code: code.toUpperCase().trim(),
      ...(schoolId ? { schoolId } : {}),
      ...(branchId ? { branchId } : {}),
      isDeleted: false,
    }).exec();
  }

  public async create(dto: CreateTimeSlotDto, userId?: string): Promise<ITimeSlot> {
    let duration = dto.durationMinutes;
    if (!duration) {
      const [startH = 0, startM = 0] = dto.startTime.split(':').map(Number);
      const [endH = 0, endM = 0] = dto.endTime.split(':').map(Number);
      duration = endH * 60 + endM - (startH * 60 + startM);
    }

    return TimeSlotModel.create({
      ...dto,
      code: dto.code.toUpperCase().trim(),
      durationMinutes: duration,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async update(
    id: string,
    dto: UpdateTimeSlotDto,
    userId?: string,
    schoolId?: string,
  ): Promise<ITimeSlot | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const existing = await this.findById(id, schoolId);
    if (!existing) return null;

    const startTime = dto.startTime ?? existing.startTime;
    const endTime = dto.endTime ?? existing.endTime;

    let duration = dto.durationMinutes;
    if (!duration && (dto.startTime || dto.endTime)) {
      const [startH = 0, startM = 0] = startTime.split(':').map(Number);
      const [endH = 0, endM = 0] = endTime.split(':').map(Number);
      duration = endH * 60 + endM - (startH * 60 + startM);
    }

    return TimeSlotModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: { ...dto, ...(duration ? { durationMinutes: duration } : {}), updatedBy: userId } },
      { new: true, runValidators: true },
    ).exec();
  }

  public async softDelete(
    id: string,
    userId?: string,
    schoolId?: string,
  ): Promise<ITimeSlot | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TimeSlotModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: userId } },
      { new: true },
    ).exec();
  }
}
