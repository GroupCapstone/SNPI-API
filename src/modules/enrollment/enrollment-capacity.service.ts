import type { ClientSession, Types } from 'mongoose';

import { ValidationError } from '../../shared/errors/app-error';
import { ClassModel } from '../class/class.model';
import { EnrollmentModel } from './enrollment.model';

const ACTIVE_ENROLLMENT_STATUSES = ['enrolled', 'active'] as const;

export interface ClassCapacityContext {
  classId: Types.ObjectId | string;
  className?: string;
  capacity?: number;
  schoolId?: Types.ObjectId | string;
  branchId?: Types.ObjectId | string;
}

const countActiveEnrollments = async (
  classId: Types.ObjectId | string,
  session?: ClientSession,
): Promise<number> => {
  const query = EnrollmentModel.countDocuments({
    classId,
    status: { $in: ACTIVE_ENROLLMENT_STATUSES },
    isDeleted: false,
  });
  if (typeof (query as { exec?: unknown })?.exec === 'function') {
    return session && typeof (query as { session?: unknown })?.session === 'function'
      ? (query as unknown as { session: (s: unknown) => { exec: () => Promise<number> } })
          .session(session)
          .exec()
      : (query as unknown as { exec: () => Promise<number> }).exec();
  }
  return query;
};

/**
 * Serializes capacity decisions through the class document. This must be called
 * inside the same transaction that creates the enrollment.
 */
export const reserveClassSeat = async (
  context: ClassCapacityContext,
  session?: ClientSession,
): Promise<void> => {
  if (!context.capacity || context.capacity < 1) return;

  const lockedClass = await ClassModel.findOneAndUpdate(
    {
      _id: context.classId,
      isDeleted: false,
      ...(context.schoolId ? { schoolId: context.schoolId } : {}),
      ...(context.branchId ? { branchId: context.branchId } : {}),
    },
    { $inc: { capacityRevision: 1 } },
    { session, new: true },
  );
  if (!lockedClass) {
    throw new ValidationError(
      `Class "${context.className || String(context.classId)}" is unavailable for enrollment`,
    );
  }

  const capacity = lockedClass.capacity || context.capacity;
  const activeCount = await countActiveEnrollments(context.classId, session);
  if (activeCount >= capacity) {
    throw new ValidationError(
      `Class "${context.className || lockedClass.className || String(context.classId)}" has reached its maximum capacity of ${capacity} students`,
    );
  }

  await ClassModel.updateOne(
    { _id: context.classId, isDeleted: false },
    { $set: { currentEnrollmentCount: activeCount + 1 } },
    { session },
  );
};

/** Reconciles the denormalized counter after a source enrollment is closed. */
export const reconcileClassEnrollmentCount = async (
  classId: Types.ObjectId | string,
  session?: ClientSession,
): Promise<void> => {
  const lockedClass = await ClassModel.findOneAndUpdate(
    { _id: classId, isDeleted: false },
    { $inc: { capacityRevision: 1 } },
    { session, new: true },
  );
  if (!lockedClass) return;

  const activeCount = await countActiveEnrollments(classId, session);
  await ClassModel.updateOne(
    { _id: classId, isDeleted: false },
    { $set: { currentEnrollmentCount: Math.max(0, activeCount) } },
    { session },
  );
};
