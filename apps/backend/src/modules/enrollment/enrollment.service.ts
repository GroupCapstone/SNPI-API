import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { assertAcademicContextWritable } from '../academic-period/academic-context-lock.service';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { LevelModel } from '../level/level.model';
import { ProgramModel } from '../program/program.model';
import { SchoolModel } from '../school/school.model';
import { SequenceService } from '../sequence/sequence.service';
import { StudentModel } from '../student/student.model';
import { reconcileClassEnrollmentCount, reserveClassSeat } from './enrollment-capacity.service';
import type { IEnrollment } from './enrollment.model';
import { EnrollmentRepository } from './enrollment.repository';
import type {
  CreateEnrollmentDTO,
  EnrollmentQueryFilters,
  UpdateEnrollmentDTO,
} from './enrollment.types';

export class EnrollmentService {
  public constructor(private readonly repository = new EnrollmentRepository()) {}

  public async getEnrollments(
    filters: EnrollmentQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IEnrollment[]; total: number }> {
    const effectiveFilters = { ...filters, schoolId: user.schoolId };

    if (!checkUserPermission(user.permissions, 'enrollment.view.own_branch')) {
      const assignedClasses = user.assignedClasses ?? [];
      if (effectiveFilters.classId && !assignedClasses.includes(effectiveFilters.classId)) {
        throw new ForbiddenError('You are not assigned to the requested class');
      }
      effectiveFilters.authorizedClassIds = assignedClasses;
    }

    // Apply strict branch access boundaries
    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError('You do not have access to view enrollments in this branch');
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findAll(effectiveFilters);
  }

  public async getEnrollmentById(id: string, user: AuthUser): Promise<IEnrollment> {
    const enrollment = await this.repository.findById(id);
    if (!enrollment) {
      throw new NotFoundError(`Enrollment with ID ${id} not found`);
    }

    const enrollmentSchoolId =
      typeof enrollment.schoolId === 'object' && enrollment.schoolId !== null
        ? String(enrollment.schoolId._id)
        : String(enrollment.schoolId);
    if (user.schoolId && enrollmentSchoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to this enrollment record');
    }

    const branchId =
      typeof enrollment.branchId === 'object' && enrollment.branchId !== null
        ? String(enrollment.branchId._id)
        : String(enrollment.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view this enrollment record');
    }
    const classId =
      typeof enrollment.classId === 'object' && enrollment.classId !== null
        ? String(enrollment.classId._id)
        : String(enrollment.classId);
    if (
      !checkUserPermission(user.permissions, 'enrollment.view.own_branch') &&
      !(user.assignedClasses ?? []).includes(classId)
    ) {
      throw new ForbiddenError('You are not assigned to this enrollment class');
    }

    return enrollment;
  }

  public async createEnrollment(dto: CreateEnrollmentDTO, user: AuthUser): Promise<IEnrollment> {
    // 1. Branch access check
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to enroll students in this branch');
    }

    // 2. Validate Student exists & is not deleted
    const student = await StudentModel.findOne({ _id: dto.studentId, isDeleted: false });
    if (!student) {
      throw new ValidationError(`Student with ID ${dto.studentId} does not exist`);
    }
    if (String(student.schoolId) !== dto.schoolId || String(student.branchId) !== dto.branchId) {
      throw new ValidationError('Student does not belong to the selected school and branch');
    }
    if (!['active'].includes(student.status)) {
      throw new ValidationError('Only active students can be enrolled');
    }

    // 3. Validate School exists & is active
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 4. Validate Branch exists & belongs to the School
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!branch) {
      throw new ValidationError(
        `Selected branch with ID ${dto.branchId} does not belong to school ${dto.schoolId}`,
      );
    }

    // 5. Validate Academic Year exists
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new ValidationError(
        `Academic year with ID ${dto.academicYearId} does not exist or belong to this school`,
      );
    }

    // 5.1 Validate Academic Period (if provided)
    if (dto.academicPeriodId) {
      const period = await AcademicPeriodModel.findOne({
        _id: dto.academicPeriodId,
        isDeleted: false,
      });
      if (!period) {
        throw new ValidationError(`Academic period with ID ${dto.academicPeriodId} does not exist`);
      }
      if (String(period.academicYearId) !== String(dto.academicYearId)) {
        throw new ValidationError('Academic Period does not belong to the selected Academic Year');
      }
    }

    // 6. Validate Program exists & is available in branch
    const program = await ProgramModel.findOne({
      _id: dto.programId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!program) {
      throw new ValidationError(
        `Program with ID ${dto.programId} does not exist or belong to this school`,
      );
    }

    const isProgramAvailable =
      program.branchAvailability === 'all' ||
      !program.branchAvailability ||
      (Array.isArray(program.branchAvailability) &&
        program.branchAvailability.includes(dto.branchId));

    if (!isProgramAvailable) {
      throw new ValidationError(
        `Program "${program.nameEn}" is not available in the selected branch`,
      );
    }

    // 7. Validate Level exists & belongs to Program
    const level = await LevelModel.findOne({
      _id: dto.levelId,
      programId: dto.programId,
      isDeleted: false,
    });
    if (!level) {
      throw new ValidationError(
        `Level with ID ${dto.levelId} does not belong to program ${dto.programId}`,
      );
    }

    // 8. Validate Class exists & matches branch, program, and level
    const targetClass = await ClassModel.findOne({
      _id: dto.classId,
      branchId: dto.branchId,
      programId: dto.programId,
      levelId: dto.levelId,
      isDeleted: false,
    });
    if (!targetClass) {
      throw new ValidationError(
        `Class with ID ${dto.classId} does not belong to the selected branch, program, and level`,
      );
    }
    if (String(targetClass.academicYearId) !== dto.academicYearId) {
      throw new ValidationError('Class does not belong to the selected academic year');
    }
    const effectivePeriodId = dto.academicPeriodId ?? targetClass.academicPeriodId?.toString();
    if (
      dto.academicPeriodId &&
      targetClass.academicPeriodId &&
      String(targetClass.academicPeriodId) !== dto.academicPeriodId
    ) {
      throw new ValidationError('Class does not belong to the selected academic period');
    }
    await assertAcademicContextWritable({
      academicYearId: dto.academicYearId,
      academicPeriodId: effectivePeriodId,
      programId: String(targetClass.programId || dto.programId),
      operation: 'create an enrollment',
    });

    // 9. Prevent duplicate active enrollment in same class & academic year
    const existingEnrollment = await this.repository.findExistingStudentEnrollment(
      dto.studentId,
      dto.academicYearId,
      dto.classId,
    );
    if (existingEnrollment) {
      throw new ConflictError(
        `Student "${student.firstName} ${student.lastName}" is already enrolled in this class for the selected academic year`,
      );
    }

    return runInTransaction(async (session) => {
      // 10. Check and atomically reserve class capacity
      await reserveClassSeat(
        {
          classId: targetClass._id,
          className: targetClass.className,
          capacity: targetClass.capacity,
          schoolId: school._id,
          branchId: branch._id,
        },
        session,
      );

      // 11. Generate Enrollment Code
      let finalEnrollmentCode = dto.enrollmentCode?.trim().toUpperCase();
      if (!finalEnrollmentCode) {
        finalEnrollmentCode = await SequenceService.getNextSequence('ENR', 'ENR', 6, session);
      } else {
        const existing = await this.repository.findByEnrollmentCode(finalEnrollmentCode, session);
        if (existing) {
          throw new ConflictError(`Enrollment code "${finalEnrollmentCode}" already exists`);
        }
      }

      // 12. Create Enrollment Record
      const created = await this.repository.create(
        {
          enrollmentCode: finalEnrollmentCode,
          studentId: student._id as never,
          schoolId: school._id as never,
          branchId: branch._id as never,
          academicYearId: academicYear._id as never,
          academicPeriodId: effectivePeriodId as never,
          programId: program._id as never,
          levelId: level._id as never,
          classId: targetClass._id as never,
          studyModeId: (dto.studyModeId ?? targetClass.studyModeId) as never,
          attemptNumber: 1,
          enrollmentDate: dto.enrollmentDate ? new Date(dto.enrollmentDate) : new Date(),
          startDate: dto.startDate ? new Date(dto.startDate) : targetClass.startDate,
          endDate: dto.endDate ? new Date(dto.endDate) : targetClass.endDate,
          status: dto.status ?? 'active',
          tuitionStatus: dto.tuitionStatus ?? 'pending',
          remarks: dto.remarks,
          createdBy: user.userId as never,
          updatedBy: user.userId as never,
        },
        session,
      );

      // 13. Audit Log
      await AuditLogService.log({
        userId: user.userId,
        module: 'enrollment',
        action: 'CREATE',
        entityType: 'Enrollment',
        entityId: created._id.toString(),
        schoolId: dto.schoolId,
        branchId: dto.branchId,
        newValue: created.toObject
          ? created.toObject()
          : (created as unknown as Record<string, unknown>),
        session,
        required: true,
      });

      return created;
    });
  }

  public async updateEnrollment(
    id: string,
    dto: UpdateEnrollmentDTO,
    user: AuthUser,
  ): Promise<IEnrollment> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Enrollment with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const currentSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    const targetSchoolId = dto.schoolId ?? currentSchoolId;
    const targetBranchId = dto.branchId ?? currentBranchId;

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have access to edit this enrollment record');
    }

    await assertAcademicContextWritable({
      academicYearId:
        typeof existing.academicYearId === 'object' && existing.academicYearId !== null
          ? String(existing.academicYearId._id)
          : String(existing.academicYearId),
      academicPeriodId: existing.academicPeriodId
        ? typeof existing.academicPeriodId === 'object'
          ? String(existing.academicPeriodId._id)
          : String(existing.academicPeriodId)
        : undefined,
      programId: existing.programId
        ? typeof existing.programId === 'object'
          ? String(existing.programId._id)
          : String(existing.programId)
        : undefined,
      operation: 'update an enrollment',
    });
    if (
      [
        'completed',
        'promoted',
        'repeated',
        'withdrawn',
        'dropped',
        'transferred',
        'cancelled',
      ].includes(existing.status)
    ) {
      throw new ConflictError('Completed historical enrollment attempts are immutable');
    }

    const contextFields = [
      'studentId',
      'schoolId',
      'branchId',
      'academicYearId',
      'academicPeriodId',
      'programId',
      'levelId',
      'classId',
      'studyModeId',
    ] as const;
    const attemptedContextChanges = contextFields.filter((field) => dto[field] !== undefined);
    if (attemptedContextChanges.length > 0) {
      throw new ValidationError(
        `Enrollment academic context is immutable; use promotion, repeat, or transfer workflow (${attemptedContextChanges.join(', ')})`,
      );
    }
    if (dto.status && ['completed', 'promoted', 'repeated', 'transferred'].includes(dto.status)) {
      throw new ValidationError(
        'Terminal enrollment statuses must be set by their controlled workflow',
      );
    }

    if (dto.branchId && !checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to transfer enrollment to target branch');
    }

    const updateData: Partial<IEnrollment> = {
      updatedBy: user.userId as never,
    };

    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.tuitionStatus !== undefined) updateData.tuitionStatus = dto.tuitionStatus;
    if (dto.remarks !== undefined) updateData.remarks = dto.remarks;
    if (dto.enrollmentDate) updateData.enrollmentDate = new Date(dto.enrollmentDate);

    const updated = await this.repository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundError(`Enrollment with ID ${id} not found after update`);
    }

    // Reconcile class enrollment counter if status changed
    if (dto.status !== undefined && dto.status !== existing.status && existing.classId) {
      const classIdStr =
        typeof existing.classId === 'object' && existing.classId !== null
          ? String((existing.classId as { _id?: unknown })._id ?? existing.classId)
          : String(existing.classId);
      if (Types.ObjectId.isValid(classIdStr)) {
        await reconcileClassEnrollmentCount(new Types.ObjectId(classIdStr));
      }
    }

    // Audit Log
    await AuditLogService.log({
      userId: user.userId,
      module: 'enrollment',
      action: 'UPDATE',
      entityType: 'Enrollment',
      entityId: id,
      schoolId: targetSchoolId,
      branchId: targetBranchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async deleteEnrollment(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Enrollment with ID ${id} not found`);
    }

    const branchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const schoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to cancel this enrollment record');
    }
    await assertAcademicContextWritable({
      academicYearId:
        typeof existing.academicYearId === 'object' && existing.academicYearId !== null
          ? String(existing.academicYearId._id)
          : String(existing.academicYearId),
      academicPeriodId: existing.academicPeriodId
        ? typeof existing.academicPeriodId === 'object'
          ? String(existing.academicPeriodId._id)
          : String(existing.academicPeriodId)
        : undefined,
      programId: existing.programId
        ? typeof existing.programId === 'object'
          ? String(existing.programId._id)
          : String(existing.programId)
        : undefined,
      operation: 'cancel an enrollment',
    });
    if (!['pending', 'enrolled'].includes(existing.status)) {
      throw new ConflictError('Only pending or not-yet-started enrollments can be cancelled');
    }

    await runInTransaction(async (session) => {
      const cancelled = await this.repository.updateById(
        id,
        {
          status: 'cancelled',
          completionReason: 'cancelled',
          endDate: new Date(),
          updatedBy: user.userId as never,
        },
        session,
        ['pending', 'enrolled'],
      );
      if (!cancelled) {
        throw new ConflictError('Enrollment changed while cancellation was being processed');
      }

      if (existing.classId) {
        const classIdStr =
          typeof existing.classId === 'object' && existing.classId !== null
            ? String((existing.classId as { _id?: unknown })._id ?? existing.classId)
            : String(existing.classId);
        if (Types.ObjectId.isValid(classIdStr)) {
          await reconcileClassEnrollmentCount(new Types.ObjectId(classIdStr), session);
        }
      }

      await AuditLogService.log({
        userId: user.userId,
        module: 'enrollment',
        action: 'UPDATE',
        entityType: 'Enrollment',
        entityId: id,
        schoolId,
        branchId,
        oldValue: existing.toObject
          ? existing.toObject()
          : (existing as unknown as Record<string, unknown>),
        newValue: { status: 'cancelled', completionReason: 'cancelled' },
        session,
        required: true,
      });
    });
  }
}
