import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type NotificationChannel = 'telegram' | 'sms' | 'in_app';

export type NotificationType =
  | 'absence_alert'
  | 'unmarked_attendance_digest'
  | 'payment_receipt'
  | 'tuition_reminder'
  | 'announcement'
  | 'custom';

export type NotificationRecipientType = 'guardian' | 'student' | 'teacher' | 'staff' | 'broadcast';

export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface INotification extends Document {
  schoolId: Types.ObjectId;
  branchId?: Types.ObjectId;
  channel: NotificationChannel;
  type: NotificationType;
  recipientType: NotificationRecipientType;
  recipientId?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientChatId?: string;
  title: string;
  body: string;
  status: NotificationStatus;
  sentAt?: Date;
  errorDetails?: string;
  metadata?: Record<string, unknown>;
  createdBy?: Types.ObjectId | string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: false,
      index: true,
    },
    channel: {
      type: String,
      enum: ['telegram', 'sms', 'in_app'],
      default: 'telegram',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'absence_alert',
        'unmarked_attendance_digest',
        'payment_receipt',
        'tuition_reminder',
        'announcement',
        'custom',
      ],
      default: 'custom',
      required: true,
      index: true,
    },
    recipientType: {
      type: String,
      enum: ['guardian', 'student', 'teacher', 'staff', 'broadcast'],
      default: 'guardian',
      required: true,
      index: true,
    },
    recipientId: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: false,
      trim: true,
    },
    recipientPhone: {
      type: String,
      required: false,
      trim: true,
    },
    recipientChatId: {
      type: String,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      required: true,
      index: true,
    },
    sentAt: {
      type: Date,
      required: false,
    },
    errorDetails: {
      type: String,
      required: false,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
    createdBy: {
      type: Schema.Types.Mixed,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index(
  { schoolId: 1, branchId: 1, isDeleted: 1, createdAt: -1 },
  { name: 'notification_school_branch_created_idx' },
);

notificationSchema.index(
  { channel: 1, status: 1, isDeleted: 1 },
  { name: 'notification_channel_status_idx' },
);

export const NotificationModel = model<INotification>('Notification', notificationSchema);

// Parent Contact Log Model for direct guardian outreach tracking
export type ContactType = 'phone_call' | 'telegram' | 'sms' | 'in_person';
export type ContactPurpose = 'absence' | 'tuition' | 'behavior' | 'academic' | 'general';
export type ContactOutcome =
  'reached' | 'no_answer' | 'left_message' | 'callback_requested' | 'resolved';

export interface IParentContactLog extends Document {
  schoolId: Types.ObjectId;
  branchId: Types.ObjectId;
  studentId: Types.ObjectId;
  guardianName: string;
  guardianPhone?: string;
  contactType: ContactType;
  purpose: ContactPurpose;
  outcome: ContactOutcome;
  notes: string;
  contactDate: Date;
  staffId: Types.ObjectId | string;
  staffName?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const parentContactLogSchema = new Schema<IParentContactLog>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    guardianName: {
      type: String,
      required: true,
      trim: true,
    },
    guardianPhone: {
      type: String,
      required: false,
      trim: true,
    },
    contactType: {
      type: String,
      enum: ['phone_call', 'telegram', 'sms', 'in_person'],
      default: 'phone_call',
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ['absence', 'tuition', 'behavior', 'academic', 'general'],
      default: 'absence',
      required: true,
      index: true,
    },
    outcome: {
      type: String,
      enum: ['reached', 'no_answer', 'left_message', 'callback_requested', 'resolved'],
      default: 'reached',
      required: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    contactDate: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    staffId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    staffName: {
      type: String,
      required: false,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

parentContactLogSchema.index(
  { studentId: 1, contactDate: -1, isDeleted: 1 },
  { name: 'parent_contact_log_student_date_idx' },
);

export const ParentContactLogModel = model<IParentContactLog>(
  'ParentContactLog',
  parentContactLogSchema,
);
