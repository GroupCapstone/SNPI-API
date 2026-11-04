import type { SessionType } from '../time-slot/time-slot.model';
import type { ClassDaysPattern, ClassShift, ClassStatus } from './class.model';

export interface CreateClassDto {
  schoolId?: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  offeringId?: string;
  programId: string;
  levelId: string;
  studyModeId?: string;
  section?: string;
  curriculumId?: string;
  classroomId?: string;
  defaultClassroomId?: string;
  classTeacherId?: string;
  classCode?: string; // Optional if auto-generated
  className?: string; // Optional if auto-generated
  capacity?: number;
  shift?: ClassShift;
  daysPattern?: ClassDaysPattern;
  selectedDays?: number[];
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  status?: ClassStatus;
}

export interface UpdateClassDto {
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string | null;
  offeringId?: string | null;
  programId?: string;
  levelId?: string;
  studyModeId?: string | null;
  section?: string;
  curriculumId?: string | null;
  classroomId?: string | null;
  defaultClassroomId?: string | null;
  classTeacherId?: string | null;
  classCode?: string;
  className?: string;
  capacity?: number;
  shift?: ClassShift;
  daysPattern?: ClassDaysPattern;
  selectedDays?: number[];
  startTime?: string;
  endTime?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: ClassStatus;
}

export interface ClassQueryFilters {
  schoolId?: string;
  authorizedClassIds?: string[];
  search?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  offeringId?: string;
  programId?: string;
  levelId?: string;
  studyModeId?: string;
  shift?: ClassShift;
  sessionType?: SessionType;
  timeSlotId?: string;
  classTeacherId?: string;
  curriculumId?: string;
  status?: ClassStatus;
  availability?: 'all' | 'available' | 'near_capacity' | 'full' | 'closed';
  page?: number;
  limit?: number;
}

export interface ClassAvailabilitySummary {
  totalClasses: number;
  availableClasses: number;
  nearCapacityClasses: number;
  fullClasses: number;
  completedOrCancelledClasses: number;
  totalCapacity: number;
  totalEnrolled: number;
  occupancyRate: number;
}
