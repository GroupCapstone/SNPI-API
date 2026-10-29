import { Types } from 'mongoose';
import type { ClientSession } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import {
  reconcileClassEnrollmentCount,
  reserveClassSeat,
} from '../enrollment/enrollment-capacity.service';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { SchoolModel } from '../school/school.model';
import { SequenceService } from '../sequence/sequence.service';
import { StudentModel } from '../student/student.model';
import type { IStudentTransfer } from './student-transfer.model';
import { StudentTransferRepository } from './student-transfer.repository';
import type {
  CreateStudentTransferDTO,
  ProcessTransferDTO,
  StudentTransferQueryFilters,
} from './student-transfer.types';

const idOf = (value: unknown): string => {
  if (value && typeof value === 'object' && '_id' in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value ?? '');
};

export class StudentTransferService {
  public constructor(private readonly repository = new StudentTransferRepository()) {}

  public async getTransfers(
    filters: StudentTransferQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IStudentTransfer[]; total: number }> {
    const effectiveFilters = { ...filters, schoolId: user.schoolId };

    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.fromBranchId && !allowed.includes(effectiveFilters.fromBranchId)) {
        throw new ForbiddenError('You do not have access to view transfers for this branch');
      }
      if (effectiveFilters.toBranchId && !allowed.includes(effectiveFilters.toBranchId)) {
        throw new ForbiddenError('You do not have access to view transfers for this branch');
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findAll(effectiveFilters);
  }

  public async getTransferById(id: string, user: AuthUser): Promise<IStudentTransfer> {
    const transfer = await this.repository.findById(id);
    if (!transfer) {
      throw new NotFoundError(`Student transfer record with ID ${id} not found`);
    }

    const fromSchoolId = idOf(transfer.fromSchoolId);
    const toSchoolId = idOf(transfer.toSchoolId);
    if (user.schoolId && (fromSchoolId !== user.schoolId || toSchoolId !== user.schoolId)) {
      throw new ForbiddenError('You do not have access to view this student transfer');
    }

    const fromBranchId =
      typeof transfer.fromBranchId === 'object' && transfer.fromBranchId !== null
        ? String(transfer.fromBranchId._id)
        : String(transfer.fromBranchId);

    const toBranchId =
      typeof transfer.toBranchId === 'object' && transfer.toBranchId !== null
        ? String(transfer.toBranchId._id)
        : String(transfer.toBranchId);

    if (
      !checkBranchAccess(user.branchAccess, fromBranchId) ||
      !checkBranchAccess(user.branchAccess, toBranchId)
    ) {
      throw new ForbiddenError('You do not have access to view this student transfer');
    }

    return transfer;
  }

  public async createTransfer(
    dto: CreateStudentTransferDTO,
    user: AuthUser,
  ): Promise<IStudentTransfer> {
    if (!checkBranchAccess(user.branchAccess, dto.fromBranchId)) {
      throw new ForbiddenError('You do not have access to initiate transfers from this branch');
    }
    if (!checkBranchAccess(user.branchAccess, dto.toBranchId)) {
      throw new ForbiddenError('You do not have access to the destination branch');
    }
    if (dto.fromSchoolId !== dto.toSchoolId) {
      throw new ForbiddenError('Cross-school transfers are not supported by this workflow');
    }
    if (user.schoolId && !user.permissions.includes('*') && dto.fromSchoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to transfer students outside your school');
    }

    // 1. School check
    const fromSchool = await SchoolModel.findOne({ _id: dto.fromSchoolId, isDeleted: false });
    if (!fromSchool) {
      throw new ValidationError(`Source school with ID ${dto.fromSchoolId} does not exist`);
    }

    const toSchool = await SchoolModel.findOne({ _id: dto.toSchoolId, isDeleted: false });
    if (!toSchool) {
      throw new ValidationError(`Destination school with ID ${dto.toSchoolId} does not exist`);
    }

    // 2. Branch check
    const fromBranch = await BranchModel.findOne({
      _id: dto.fromBranchId,
      schoolId: dto.fromSchoolId,
      isDeleted: false,
    });
    if (!fromBranch) {
      throw new ValidationError(`Source branch with ID ${dto.fromBranchId} does not exist`);
    }

    const toBranch = await BranchModel.findOne({
      _id: dto.toBranchId,
      schoolId: dto.toSchoolId,
      isDeleted: false,
    });
    if (!toBranch) {
      throw new ValidationError(`Destination branch with ID ${dto.toBranchId} does not exist`);
    }

    if (dto.fromBranchId === dto.toBranchId) {
      throw new ValidationError('Source branch and destination branch must be different');
    }

    // 3. Student check
    const student = await StudentModel.findOne({
      _id: dto.studentId,
      branchId: dto.fromBranchId,
      isDeleted: false,
    });
    if (!student) {
      throw new ValidationError(
        `Student with ID ${dto.studentId} does not belong to source branch ${dto.fromBranchId}`,
      );
    }

    // 4. Sequence generation
    let finalTransferNumber = dto.transferNumber?.trim().toUpperCase();
    if (!finalTransferNumber) {
      finalTransferNumber = await SequenceService.getNextSequence('TRF', 'TRF', 6);
    } else {
      const existing = await this.repository.findByTransferNumber(finalTransferNumber);
      if (existing) {
        throw new ConflictError(`Transfer number "${finalTransferNumber}" already exists`);
      }
    }

    // 5. Create transfer request
    const created = await this.repository.create({
      transferNumber: finalTransferNumber,
      transferType: dto.transferType ?? 'BRANCH',
      studentId: student._id as never,
      fromSchoolId: fromSchool._id as never,
      toSchoolId: toSchool._id as never,
      fromBranchId: fromBranch._id as never,
      toBranchId: toBranch._id as never,
      fromProgramId: dto.fromProgramId ? (dto.fromProgramId as never) : undefined,
      toProgramId: dto.toProgramId ? (dto.toProgramId as never) : undefined,
      fromLevelId: dto.fromLevelId ? (dto.fromLevelId as never) : undefined,
      toLevelId: dto.toLevelId ? (dto.toLevelId as never) : undefined,
      fromClassId: dto.fromClassId ? (dto.fromClassId as never) : undefined,
      toClassId: dto.toClassId ? (dto.toClassId as never) : undefined,
      transferDate: dto.transferDate ? new Date(dto.transferDate) : new Date(),
      effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : undefined,
      reason: dto.reason.trim(),
      status: 'pending',
      remarks: dto.remarks?.trim(),
      createdBy: user.userId as never,
      updatedBy: user.userId as never,
    });

    // 6. Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'student_transfer',
      action: 'CREATE',
      entityType: 'StudentTransfer',
      entityId: created._id.toString(),
      schoolId: dto.fromSchoolId,
      branchId: dto.fromBranchId,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async processTransfer(
    id: string,
    dto: ProcessTransferDTO,
    user: AuthUser,
  ): Promise<IStudentTransfer> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Student transfer with ID ${id} not found`);
    }

    const toBranchId =
      typeof existing.toBranchId === 'object' && existing.toBranchId !== null
        ? String(existing.toBranchId._id)
        : String(existing.toBranchId);

    const fromBranchId =
      typeof existing.fromBranchId === 'object' && existing.fromBranchId !== null
        ? String(existing.fromBranchId._id)
        : String(existing.fromBranchId);

    if (
      !checkBranchAccess(user.branchAccess, toBranchId) ||
      !checkBranchAccess(user.branchAccess, fromBranchId)
    ) {
      throw new ForbiddenError(
        'Processing a cross-branch transfer requires access to both source and destination branches',
      );
    }

    if (['rejected', 'completed', 'cancelled'].includes(existing.status)) {
      throw new ConflictError(`Transfer is already ${existing.status} and cannot be reprocessed`);
    }

    if (existing.status === dto.status) {
      throw new ConflictError(`Transfer is already ${existing.status}`);
    }

    const updateData: Partial<IStudentTransfer> = {
      status: dto.status,
      approvalDate: new Date(),
      approvedBy: user.userId as never,
      updatedBy: user.userId as never,
    };

    const requestedClassId = dto.toClassId || (existing.toClassId ? idOf(existing.toClassId) : '');
    let targetClass: Awaited<ReturnType<typeof ClassModel.findOne>> | null = null;
    if (requestedClassId) {
      const cls = await ClassModel.findOne({
        _id: requestedClassId,
        branchId: toBranchId,
        isDeleted: false,
      });
      if (!cls) {
        throw new ValidationError(
          `Target class ${requestedClassId} does not belong to destination branch`,
        );
      }
      targetClass = cls;
      updateData.toClassId = cls._id as never;
    }

    if (dto.remarks) {
      updateData.remarks = dto.remarks.trim();
    }

    const studentId =
      typeof existing.studentId === 'object' && existing.studentId !== null
        ? String(existing.studentId._id)
        : String(existing.studentId);

    if (dto.status !== 'completed') {
      return runInTransaction(async (session) => {
        const updated = await this.repository.updateById(id, updateData, session);
        if (!updated) {
          throw new ConflictError('Transfer changed while it was being processed');
        }
        await this.logTransferChange(existing, updated, user, toBranchId, dto.remarks, session);
        return updated;
      });
    }

    if (!targetClass) {
      throw new ValidationError('A destination class is required to complete a student transfer');
    }

    const activeEnrollments = await EnrollmentModel.find({
      studentId: new Types.ObjectId(studentId),
      branchId: new Types.ObjectId(fromBranchId),
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    });
    if (activeEnrollments.length === 0) {
      throw new ConflictError('Student has no active enrollment in the source branch');
    }
    if (activeEnrollments.length > 1) {
      throw new ValidationError(
        'Student has multiple active programs; resolve each enrollment before completing the branch transfer',
      );
    }

    const sourceEnrollment = activeEnrollments[0]!;
    if (existing.fromClassId && idOf(existing.fromClassId) !== idOf(sourceEnrollment.classId)) {
      throw new ConflictError('The source enrollment no longer matches this transfer request');
    }
    const transferType = existing.transferType ?? 'BRANCH';
    if (transferType === 'BRANCH' || transferType === 'CLASS') {
      if (
        idOf(targetClass.schoolId) !== idOf(existing.toSchoolId) ||
        String(targetClass.programId) !== String(sourceEnrollment.programId) ||
        String(targetClass.levelId) !== String(sourceEnrollment.levelId) ||
        String(targetClass.academicYearId) !== String(sourceEnrollment.academicYearId)
      ) {
        throw new ValidationError(
          'Destination class must match the source enrollment school, program, level, and academic year',
        );
      }
    } else if (transferType === 'PROGRAM') {
      const expectedProgramId = existing.toProgramId ? idOf(existing.toProgramId) : undefined;
      if (expectedProgramId && String(targetClass.programId) !== expectedProgramId) {
        throw new ValidationError(
          'Destination class program does not match requested target program',
        );
      }
    } else if (transferType === 'LEVEL') {
      const expectedLevelId = existing.toLevelId ? idOf(existing.toLevelId) : undefined;
      if (expectedLevelId && String(targetClass.levelId) !== expectedLevelId) {
        throw new ValidationError('Destination class level does not match requested target level');
      }
    }
    if (
      sourceEnrollment.academicPeriodId &&
      targetClass.academicPeriodId &&
      String(targetClass.academicPeriodId) !== String(sourceEnrollment.academicPeriodId)
    ) {
      throw new ValidationError('Destination class must match the current academic period');
    }

    const duplicateDestination = await EnrollmentModel.exists({
      studentId: sourceEnrollment.studentId,
      classId: targetClass._id,
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    });
    if (duplicateDestination) {
      throw new ConflictError('Student already has an active enrollment in the destination class');
    }
    return runInTransaction(async (session) => {
      await reserveClassSeat(
        {
          classId: targetClass._id,
          className: targetClass.className,
          capacity: targetClass.capacity,
          schoolId: targetClass.schoolId,
          branchId: targetClass.branchId,
        },
        session,
      );

      const enrollmentCode = await SequenceService.getNextSequence('ENR', 'ENR', 6, session);
      const updated = await this.repository.updateById(id, updateData, session);
      if (!updated) throw new ConflictError('Transfer changed while it was being completed');

      if (fromBranchId !== toBranchId) {
        const studentUpdate = await StudentModel.findOneAndUpdate(
          { _id: studentId, branchId: fromBranchId, isDeleted: false },
          { $set: { branchId: toBranchId, updatedBy: user.userId } },
          { new: true, ...(session ? { session } : {}) },
        );
        if (!studentUpdate) throw new ConflictError('Student branch changed during transfer');
      } else {
        await StudentModel.updateOne(
          { _id: studentId, isDeleted: false },
          { $set: { updatedBy: user.userId } },
          session ? { session } : undefined,
        );
      }

      const sourceUpdate = await EnrollmentModel.updateOne(
        {
          _id: sourceEnrollment._id,
          status: sourceEnrollment.status,
          isDeleted: false,
        },
        {
          $set: {
            status: 'transferred',
            endDate: existing.transferDate ?? new Date(),
            updatedBy: user.userId,
          },
        },
        session ? { session } : undefined,
      );
      if (sourceUpdate.matchedCount === 0) {
        throw new ConflictError('Source enrollment changed during transfer');
      }
      await reconcileClassEnrollmentCount(sourceEnrollment.classId, session);

      const enrollmentData = {
        enrollmentCode,
        studentId: sourceEnrollment.studentId,
        schoolId: targetClass.schoolId,
        branchId: targetClass.branchId,
        academicYearId: targetClass.academicYearId,
        academicPeriodId: targetClass.academicPeriodId ?? sourceEnrollment.academicPeriodId,
        programId: targetClass.programId,
        levelId: targetClass.levelId,
        classId: targetClass._id,
        enrollmentDate: existing.transferDate ?? new Date(),
        startDate: targetClass.startDate,
        endDate: targetClass.endDate,
        status: 'active' as const,
        tuitionStatus: sourceEnrollment.tuitionStatus,
        previousEnrollmentId: sourceEnrollment._id,
        remarks: `Created by completed transfer ${existing.transferNumber} (${transferType})`,
        createdBy: user.userId,
        updatedBy: user.userId,
      };
      const createdEnrollment = session
        ? await EnrollmentModel.create([enrollmentData], { session })
        : await EnrollmentModel.create(enrollmentData);
      const newEnrollment = Array.isArray(createdEnrollment)
        ? createdEnrollment[0]
        : createdEnrollment;
      if (!newEnrollment) throw new Error('Destination enrollment was not created');

      await this.logTransferChange(
        existing,
        updated,
        user,
        toBranchId,
        dto.remarks,
        session,
        String(newEnrollment._id),
      );
      return updated;
    });
  }

  private async logTransferChange(
    before: IStudentTransfer,
    after: IStudentTransfer,
    user: AuthUser,
    branchId: string,
    reason?: string,
    session?: ClientSession,
    destinationEnrollmentId?: string,
  ): Promise<void> {
    await AuditLogService.log({
      userId: user.userId,
      module: 'student_transfer',
      action: 'UPDATE',
      entityType: 'StudentTransfer',
      entityId: String(before._id),
      schoolId: idOf(before.fromSchoolId),
      branchId,
      reason,
      oldValue: before.toObject
        ? before.toObject()
        : (before as unknown as Record<string, unknown>),
      newValue: {
        ...(after.toObject ? after.toObject() : (after as unknown as Record<string, unknown>)),
        destinationEnrollmentId,
      },
      session,
      required: true,
    });
  }
}
