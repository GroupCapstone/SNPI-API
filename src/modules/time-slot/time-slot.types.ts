import type { SessionType } from './time-slot.model';

export interface CreateTimeSlotDto {
  schoolId?: string;
  branchId?: string;
  code: string;
  name: string;
  sessionType: SessionType;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  durationMinutes?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateTimeSlotDto {
  name?: string;
  sessionType?: SessionType;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface TimeSlotQueryFilters {
  schoolId?: string;
  branchId?: string;
  sessionType?: SessionType;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
