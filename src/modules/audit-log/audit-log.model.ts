import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type AuditAction =
  | 'LOGIN'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'MFA_CHALLENGE_ISSUED'
  | 'TWO_FACTOR_ENABLED'
  | 'TWO_FACTOR_DISABLED'
  | 'MFA_FAILED'
  | 'ADMIN_TWO_FACTOR_RESET'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'USER_ACTIVATED'
  | 'USER_DEACTIVATED'
  | 'ROLE_ASSIGN'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED'
  | 'BRANCH_ACCESS_CHANGED'
  | 'DEPARTMENT_ACCESS_CHANGED'
  | 'PERMISSION_CHANGE'
  | 'WORKFLOW_TRANSITION'
  | 'FINALIZE'
  | 'UNLOCK'
  | 'RELOCK'
  | 'ARCHIVE';

export interface IAuditLog extends Document {
  userId?: Types.ObjectId | string;
  schoolId?: Types.ObjectId | string;
  branchId?: Types.ObjectId | string;
  module: string;
  action: AuditAction;
  entityType: string;
  entityId: Types.ObjectId | string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  changedFields?: string[];
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.Mixed, required: false },
    schoolId: { type: Schema.Types.Mixed, required: false },
    branchId: { type: Schema.Types.Mixed, required: false },
    module: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.Mixed, required: true, index: true },
    oldValue: { type: Schema.Types.Mixed, required: false },
    newValue: { type: Schema.Types.Mixed, required: false },
    changedFields: { type: [String], required: false, default: undefined },
    reason: { type: String, required: false, trim: true, maxlength: 500 },
    ipAddress: { type: String, required: false },
    userAgent: { type: String, required: false },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ branchId: 1, module: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });

export const AuditLogModel = model<IAuditLog>('AuditLog', auditLogSchema);
