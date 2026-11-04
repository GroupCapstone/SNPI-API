import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type AnnouncementCategory =
  'general' | 'academic' | 'finance' | 'attendance' | 'event' | 'urgent';

export type AnnouncementAudience = 'all' | 'students' | 'parents' | 'staff' | 'teachers';

export interface IAnnouncement extends Document {
  schoolId: Types.ObjectId;
  branchId?: Types.ObjectId;
  title: string;
  content: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  isPublished: boolean;
  isPinned: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  isDeleted: boolean;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
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
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ['general', 'academic', 'finance', 'attendance', 'event', 'urgent'],
      default: 'general',
      required: true,
      index: true,
    },
    audience: {
      type: String,
      enum: ['all', 'students', 'parents', 'staff', 'teachers'],
      default: 'all',
      required: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.Mixed,
      required: false,
    },
    updatedBy: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

announcementSchema.index(
  { schoolId: 1, branchId: 1, isDeleted: 1, isPublished: 1, publishedAt: -1 },
  { name: 'announcement_school_branch_published_index' },
);

export const AnnouncementModel = model<IAnnouncement>('Announcement', announcementSchema);
