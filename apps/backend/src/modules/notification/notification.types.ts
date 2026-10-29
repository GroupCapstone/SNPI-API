import type {
  ContactOutcome,
  ContactPurpose,
  ContactType,
  NotificationChannel,
  NotificationRecipientType,
  NotificationStatus,
  NotificationType,
} from './notification.model';

export interface SendNotificationDTO {
  schoolId?: string;
  branchId?: string;
  channel: NotificationChannel;
  type?: NotificationType;
  recipientType?: NotificationRecipientType;
  recipientId?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientChatId?: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  branchId?: string;
  channel?: NotificationChannel;
  type?: NotificationType;
  status?: NotificationStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface NotificationStatsResponse {
  totalSent: number;
  sentToday: number;
  failedCount: number;
  byChannel: {
    telegram: number;
    sms: number;
    in_app: number;
  };
}

export interface TriggerAbsenceAlertDTO {
  studentId: string;
  guardianPhone?: string;
  consecutiveDays: number;
  channel?: NotificationChannel;
  notes?: string;
}

export interface TriggerTuitionReminderDTO {
  paymentId: string;
  channel?: NotificationChannel;
  notes?: string;
}

export interface CreateParentContactLogDTO {
  studentId: string;
  guardianName: string;
  guardianPhone?: string;
  contactType: ContactType;
  purpose: ContactPurpose;
  outcome: ContactOutcome;
  notes: string;
  contactDate?: string;
}

export interface ParentContactLogFilters {
  page?: number;
  limit?: number;
  studentId?: string;
  branchId?: string;
  contactType?: ContactType;
  purpose?: ContactPurpose;
  search?: string;
}
