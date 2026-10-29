import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import type { AuthUser } from '../../types/auth';
import { assertAcademicContextWritable } from '../academic-period/academic-context-lock.service';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AssessmentModel } from '../assessment/assessment.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassroomModel } from '../classroom/classroom.model';
import { CurriculumModel } from '../curriculum/curriculum.model';
import { EmployeeModel } from '../employee/employee.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { IntakeModel } from '../intake/intake.model';
import { LevelRepository } from '../level/level.repository';
import { ProgramRepository } from '../program/program.repository';
import { StudyModeModel } from '../study-mode/study-mode.model';
import type { IClass } from './class.model';
import { ClassRepository } from './class.repository';
import type {
  ClassAvailabilitySummary,
  ClassQueryFilters,
  CreateClassDto,
  UpdateClassDto,
} from './class.types';

const idOf = (value: unknown): string => {
  if (value && typeof value === 'object' && '_id' in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value ?? '');
};

export class ClassService {
  public constructor(
    private readonly repository = new ClassRepository(),
    private readonly programRepository = new ProgramRepository(),
    private readonly levelRepository = new LevelRepository(),
  ) {}

  public async getClasses(
    filters: ClassQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IClass[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to classes in the requested branch');
    }
    const hasBranchWideView = checkUserPermission(user.permissions, 'class.view.own_branch');
    if (!hasBranchWideView) {
      const assignedClasses = user.assignedClasses ?? [];
      if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
        throw new ForbiddenError('You do not have access to classes in the requested branch');
      }
      return this.repository.findWithFilters(
        { ...filters, schoolId: user.schoolId, authorizedClassIds: assignedClasses },
        user.branchAccess === 'all' ? {} : { branchId: { $in: user.branchAccess } },
      );
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? filters.branchId
          ? { branchId: filters.branchId }
          : {}
        : { branchId: { $in: user.branchAccess } };

    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId }, branchFilter);
  }

  public async getClassSummary(
    filters: ClassQueryFilters,
    user: AuthUser,
  ): Promise<ClassAvailabilitySummary> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to classes in the requested branch');
    }
    const hasBranchWideView = checkUserPermission(user.permissions, 'class.view.own_branch');
    if (!hasBranchWideView) {
      const assignedClasses = user.assignedClasses ?? [];
      if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
        throw new ForbiddenError('You do not have access to classes in the requested branch');
      }
      return this.repository.getAvailabilitySummary(
        { ...filters, schoolId: user.schoolId, authorizedClassIds: assignedClasses },
        user.branchAccess === 'all' ? {} : { branchId: { $in: user.branchAccess } },
      );
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? filters.branchId
          ? { branchId: filters.branchId }
          : {}
        : { branchId: { $in: user.branchAccess } };

    return this.repository.getAvailabilitySummary(
      { ...filters, schoolId: user.schoolId },
      branchFilter,
    );
  }

  public async getClassById(id: string, user: AuthUser): Promise<IClass> {
    const classEntity = await this.repository.findById(id, user.schoolId);
    if (!classEntity) {
      throw new NotFoundError('Class not found');
    }
    if (!checkBranchAccess(user.branchAccess, String(classEntity.branchId))) {
      throw new ForbiddenError('You do not have access to this class');
    }
    if (
      !checkUserPermission(user.permissions, 'class.view.own_branch') &&
      !(user.assignedClasses ?? []).includes(id)
    ) {
      throw new ForbiddenError('You are not assigned to this class');
    }
    return classEntity;
  }

  public async createClass(dto: CreateClassDto, user: AuthUser): Promise<IClass> {
    if (dto.schoolId && dto.schoolId !== user.schoolId) {
      throw new ForbiddenError('You cannot create a class for another school');
    }
    // 1. Check branch access
    if (user.branchAccess !== 'all' && !user.branchAccess.includes(dto.branchId)) {
      throw new ForbiddenError('You do not have access to create a class in this branch');
    }

    // 2. Validate Branch
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: user.schoolId,
      isDeleted: false,
    });
    if (!branch) {
      throw new ValidationError('Selected branch does not exist', [
        { field: 'branchId', message: 'Branch not found' },
      ]);
    }

    // 3. Validate Academic Year
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: user.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new ValidationError('Selected academic year does not exist', [
        { field: 'academicYearId', message: 'Academic Year not found' },
      ]);
    }

    // 4. Validate Program & Branch Availability
    const program = await this.programRepository.findById(dto.programId, user.schoolId);
    if (!program) {
      throw new ValidationError('Selected program does not exist', [
        { field: 'programId', message: 'Program not found' },
      ]);
    }

    const isProgramAvailable =
      program.branchAvailability === 'all' ||
      !program.branchAvailability ||
      (Array.isArray(program.branchAvailability) &&
        program.branchAvailability.includes(dto.branchId));

    if (!isProgramAvailable) {
      throw new ValidationError(
        `Program "${program.nameEn}" is not available in the selected branch`,
        [{ field: 'programId', message: 'Program not available in branch' }],
      );
    }

    // 5. Validate Level & Program dependency
    const level = await this.levelRepository.findById(dto.levelId, user.schoolId);
    if (!level) {
      throw new ValidationError('Selected level does not exist', [
        { field: 'levelId', message: 'Level not found' },
      ]);
    }

    const levelProgramId =
      (level.programId as { _id?: unknown })?._id?.toString() ?? level.programId.toString();
    if (levelProgramId !== dto.programId) {
      throw new ValidationError('Selected level does not belong to the selected program', [
        {
          field: 'levelId',
          message: `Level "${level.name}" does not belong to Program "${program.nameEn}"`,
        },
      ]);
    }

    // 6. Validate Curriculum (if provided)
    if (dto.curriculumId) {
      const curriculum = await CurriculumModel.findOne({
        _id: dto.curriculumId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!curriculum) {
        throw new ValidationError('Selected curriculum does not exist', [
          { field: 'curriculumId', message: 'Curriculum not found' },
        ]);
      }
      if (curriculum.programId.toString() !== dto.programId) {
        throw new ValidationError('Curriculum does not match selected Program', [
          { field: 'curriculumId', message: 'Curriculum belongs to a different Program' },
        ]);
      }
      if (curriculum.levelId.toString() !== dto.levelId) {
        throw new ValidationError('Curriculum does not match selected Level', [
          { field: 'curriculumId', message: 'Curriculum belongs to a different Level' },
        ]);
      }
    }

    // 7. Validate Classroom (if provided)
    if (dto.classroomId) {
      const classroom = await ClassroomModel.findOne({
        _id: dto.classroomId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!classroom) {
        throw new ValidationError('Selected classroom does not exist', [
          { field: 'classroomId', message: 'Classroom not found' },
        ]);
      }
      if (classroom.branchId.toString() !== dto.branchId) {
        throw new ValidationError('Selected classroom does not belong to this branch', [
          { field: 'classroomId', message: 'Classroom is located in a different branch' },
        ]);
      }
    }

    // 8. Validate Academic Period (if provided)
    if (dto.academicPeriodId) {
      const period = await AcademicPeriodModel.findOne({
        _id: dto.academicPeriodId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!period) {
        throw new ValidationError('Selected academic period does not exist', [
          { field: 'academicPeriodId', message: 'Academic Period not found' },
        ]);
      }
      if (period.academicYearId.toString() !== dto.academicYearId) {
        throw new ValidationError('Academic Period does not belong to the selected Academic Year', [
          { field: 'academicPeriodId', message: 'Period does not belong to Academic Year' },
        ]);
      }
    }

    // 9. Validate Intake / Offering (if provided)
    if (dto.offeringId) {
      const offering = await IntakeModel.findOne({
        _id: dto.offeringId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!offering) {
        throw new ValidationError('Selected intake offering does not exist', [
          { field: 'offeringId', message: 'Intake Offering not found' },
        ]);
      }
      if (offering.programId.toString() !== dto.programId) {
        throw new ValidationError('Intake Offering does not match selected Program', [
          { field: 'offeringId', message: 'Offering belongs to a different Program' },
        ]);
      }
      if (offering.levelId.toString() !== dto.levelId) {
        throw new ValidationError('Intake Offering does not match selected Level', [
          { field: 'offeringId', message: 'Offering belongs to a different Level' },
        ]);
      }
    }

    // 10. Validate Study Mode (if provided)
    let studyModeCode = 'FT';
    if (dto.studyModeId) {
      const studyMode = await StudyModeModel.findOne({
        _id: dto.studyModeId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!studyMode) {
        throw new ValidationError('Selected study mode does not exist', [
          { field: 'studyModeId', message: 'Study Mode not found' },
        ]);
      }
      studyModeCode = studyMode.code;
    }

    // 11. Validate Class Teacher (if provided)
    if (dto.classTeacherId) {
      const teacher = await EmployeeModel.findOne({
        _id: dto.classTeacherId,
        schoolId: user.schoolId,
        branchId: dto.branchId,
        isDeleted: false,
      });
      if (!teacher) {
        throw new ValidationError('Selected class teacher does not exist', [
          { field: 'classTeacherId', message: 'Class Teacher not found' },
        ]);
      }
    }

    // 12. Validate Default Classroom (if provided)
    if (dto.defaultClassroomId) {
      const defaultRoom = await ClassroomModel.findOne({
        _id: dto.defaultClassroomId,
        schoolId: user.schoolId,
        branchId: dto.branchId,
        isDeleted: false,
      });
      if (!defaultRoom) {
        throw new ValidationError(
          'Selected default classroom does not exist or does not belong to this branch',
          [{ field: 'defaultClassroomId', message: 'Default Classroom not found in branch' }],
        );
      }
    }

    // 13. Auto-generate Class Code and Name if omitted
    const section = dto.section ? dto.section.toUpperCase().trim() : 'A';
    const classCode =
      dto.classCode?.trim() ||
      `${program.code}-${level.code}-${studyModeCode}-${section}`.toUpperCase();

    const className =
      dto.className?.trim() ||
      `${program.nameEn} ${level.name} - ${studyModeCode} - Section ${section}`;

    // 14. Prevent duplicate Class Code in same branch + academic year
    const existing = await this.repository.findByBranchYearAndCode(
      dto.branchId,
      dto.academicYearId,
      classCode,
    );
    if (existing) {
      throw new ConflictError(
        `Class with code "${classCode}" already exists for this branch and academic year`,
      );
    }

    if (dto.startDate && dto.endDate && new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new ValidationError('Class start date must be before the end date');
    }
    if (dto.startDate && new Date(dto.startDate) < academicYear.startDate) {
      throw new ValidationError('Class start date must be inside the academic year');
    }
    if (dto.endDate && new Date(dto.endDate) > academicYear.endDate) {
      throw new ValidationError('Class end date must be inside the academic year');
    }
    await assertAcademicContextWritable({
      academicYearId: dto.academicYearId,
      academicPeriodId: dto.academicPeriodId,
      programId: dto.programId,
      operation: 'create a class',
    });

    const createdClass = await this.repository.create(
      {
        ...dto,
        classCode,
        className,
        section,
        schoolId: user.schoolId,
      },
      user.userId,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: dto.branchId,
      module: 'class',
      action: 'CREATE',
      entityType: 'Class',
      entityId: createdClass._id.toString(),
      newValue: createdClass.toObject(),
    });

    const populated = await this.repository.findById(createdClass._id.toString(), user.schoolId);
    return populated ?? createdClass;
  }

  public async updateClass(id: string, dto: UpdateClassDto, user: AuthUser): Promise<IClass> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Class not found');
    }

    const targetBranchId = dto.branchId ?? existing.branchId.toString();
    if (!checkBranchAccess(user.branchAccess, existing.branchId.toString())) {
      throw new ForbiddenError('You do not have access to update this class');
    }
    const targetAcademicYearId = dto.academicYearId ?? existing.academicYearId.toString();
    const targetProgramId =
      dto.programId ??
      (existing.programId as { _id?: unknown })?._id?.toString() ??
      existing.programId.toString();
    const targetLevelId =
      dto.levelId ??
      (existing.levelId as { _id?: unknown })?._id?.toString() ??
      existing.levelId.toString();

    const targetPeriodId =
      dto.academicPeriodId !== undefined
        ? (dto.academicPeriodId ?? undefined)
        : existing.academicPeriodId
          ? idOf(existing.academicPeriodId)
          : undefined;

    // Check branch access
    if (user.branchAccess !== 'all' && !user.branchAccess.includes(targetBranchId)) {
      throw new ForbiddenError('You do not have access to this branch');
    }

    // If Program or Level changed, re-validate dependency
    if (dto.programId || dto.levelId) {
      const level = await this.levelRepository.findById(targetLevelId, user.schoolId);
      if (!level) {
        throw new ValidationError('Selected level does not exist', [
          { field: 'levelId', message: 'Level not found' },
        ]);
      }
      const levelProgramId =
        (level.programId as { _id?: unknown })?._id?.toString() ?? level.programId.toString();
      if (levelProgramId !== targetProgramId) {
        throw new ValidationError('Selected level does not belong to the selected program', [
          { field: 'levelId', message: 'Level does not belong to selected Program' },
        ]);
      }
    }

    const [branch, academicYear, program, level] = await Promise.all([
      BranchModel.findOne({ _id: targetBranchId, schoolId: user.schoolId, isDeleted: false }),
      AcademicYearModel.findOne({
        _id: targetAcademicYearId,
        schoolId: user.schoolId,
        isDeleted: false,
      }),
      this.programRepository.findById(targetProgramId, user.schoolId),
      this.levelRepository.findById(targetLevelId, user.schoolId),
    ]);
    if (!branch || !academicYear || !program || !level) {
      throw new ValidationError('Class academic and organizational references are invalid');
    }
    const isProgramAvailable =
      program.branchAvailability === 'all' ||
      !program.branchAvailability ||
      (Array.isArray(program.branchAvailability) &&
        program.branchAvailability.includes(targetBranchId));
    if (!isProgramAvailable)
      throw new ValidationError('Program is not available in the target branch');
    await assertAcademicContextWritable({
      academicYearId: targetAcademicYearId,
      academicPeriodId: targetPeriodId,
      programId: targetProgramId,
      operation: 'update a class',
    });

    // If curriculum updated, validate match
    if (dto.curriculumId) {
      const curriculum = await CurriculumModel.findOne({
        _id: dto.curriculumId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!curriculum) {
        throw new ValidationError('Selected curriculum does not exist', [
          { field: 'curriculumId', message: 'Curriculum not found' },
        ]);
      }
      if (curriculum.programId.toString() !== targetProgramId) {
        throw new ValidationError('Curriculum does not match selected Program', [
          { field: 'curriculumId', message: 'Curriculum belongs to a different Program' },
        ]);
      }
      if (curriculum.levelId.toString() !== targetLevelId) {
        throw new ValidationError('Curriculum does not match selected Level', [
          { field: 'curriculumId', message: 'Curriculum belongs to a different Level' },
        ]);
      }
    }

    // If classroom updated, validate branch match
    if (dto.classroomId) {
      const classroom = await ClassroomModel.findOne({
        _id: dto.classroomId,
        schoolId: user.schoolId,
        isDeleted: false,
      });
      if (!classroom) {
        throw new ValidationError('Selected classroom does not exist', [
          { field: 'classroomId', message: 'Classroom not found' },
        ]);
      }
      if (classroom.branchId.toString() !== targetBranchId) {
        throw new ValidationError('Classroom does not belong to target branch', [
          { field: 'classroomId', message: 'Classroom is located in a different branch' },
        ]);
      }
    }

    if (dto.defaultClassroomId) {
      const defaultClassroom = await ClassroomModel.findOne({
        _id: dto.defaultClassroomId,
        schoolId: user.schoolId,
        branchId: targetBranchId,
        isDeleted: false,
      });
      if (!defaultClassroom) throw new ValidationError('Default classroom is invalid');
    }
    if (dto.classTeacherId) {
      const teacher = await EmployeeModel.findOne({
        _id: dto.classTeacherId,
        schoolId: user.schoolId,
        branchId: targetBranchId,
        status: 'active',
        isDeleted: false,
      });
      if (!teacher) throw new ValidationError('Class teacher is invalid');
    }
    if (dto.academicPeriodId) {
      const period = await AcademicPeriodModel.findOne({
        _id: dto.academicPeriodId,
        schoolId: user.schoolId,
        academicYearId: targetAcademicYearId,
        isDeleted: false,
      });
      if (!period) throw new ValidationError('Academic period is invalid for this school and year');
    }
    if (dto.capacity !== undefined) {
      const activeEnrollmentCount = await EnrollmentModel.countDocuments({
        classId: id,
        status: { $in: ['enrolled', 'active'] },
        isDeleted: false,
      });
      if (dto.capacity < activeEnrollmentCount) {
        throw new ValidationError(
          `Capacity cannot be lower than the ${activeEnrollmentCount} active enrollments`,
        );
      }
    }
    const targetStartDate =
      dto.startDate === undefined
        ? existing.startDate
        : dto.startDate
          ? new Date(dto.startDate)
          : undefined;
    const targetEndDate =
      dto.endDate === undefined
        ? existing.endDate
        : dto.endDate
          ? new Date(dto.endDate)
          : undefined;
    if (targetStartDate && targetEndDate && targetStartDate > targetEndDate) {
      throw new ValidationError('Class start date must be before the end date');
    }
    if (targetStartDate && targetStartDate < academicYear.startDate) {
      throw new ValidationError('Class start date must be inside the academic year');
    }
    if (targetEndDate && targetEndDate > academicYear.endDate) {
      throw new ValidationError('Class end date must be inside the academic year');
    }
    if (dto.status && dto.status !== existing.status) {
      const transitions: Record<string, string[]> = {
        planned: ['active', 'cancelled'],
        active: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };
      if (!transitions[existing.status]?.includes(dto.status)) {
        throw new ValidationError(
          `Class status cannot move from ${existing.status} to ${dto.status}`,
        );
      }
    }

    // Check code duplicate if code, branch, or year changed
    const targetCode = dto.classCode ?? existing.classCode;
    if (dto.classCode || dto.branchId || dto.academicYearId) {
      const duplicate = await this.repository.findByBranchYearAndCode(
        targetBranchId,
        targetAcademicYearId,
        targetCode,
        id,
      );
      if (duplicate) {
        throw new ConflictError(
          `Class with code "${targetCode}" already exists for this branch and academic year`,
        );
      }
    }

    const updated = await this.repository.update(id, dto, user.userId, user.schoolId);
    if (!updated) {
      throw new NotFoundError('Class not found');
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: updated.branchId.toString(),
      module: 'class',
      action: 'UPDATE',
      entityType: 'Class',
      entityId: updated._id.toString(),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteClass(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Class not found');
    }
    if (!checkBranchAccess(user.branchAccess, existing.branchId.toString())) {
      throw new ForbiddenError('You do not have access to delete this class');
    }

    const [activeEnrollments, attendanceCount, assessmentCount] = await Promise.all([
      EnrollmentModel.countDocuments({
        classId: id,
        schoolId: user.schoolId,
        isDeleted: false,
      }),
      AttendanceModel.countDocuments({
        classId: id,
        schoolId: user.schoolId,
        isDeleted: false,
      }),
      AssessmentModel.countDocuments({
        classId: id,
        schoolId: user.schoolId,
        isDeleted: false,
      }),
    ]);

    if (activeEnrollments > 0 || attendanceCount > 0 || assessmentCount > 0) {
      const reasons: string[] = [];
      if (activeEnrollments > 0) reasons.push(`${activeEnrollments} active enrollments`);
      if (attendanceCount > 0) reasons.push(`${attendanceCount} attendance sessions`);
      if (assessmentCount > 0) reasons.push(`${assessmentCount} assessments`);
      throw new ValidationError(
        `Cannot cancel or delete Class because it has dependent records (${reasons.join(', ')}). Archive or close the class instead.`,
      );
    }

    await assertAcademicContextWritable({
      academicYearId: idOf(existing.academicYearId),
      academicPeriodId: existing.academicPeriodId ? idOf(existing.academicPeriodId) : undefined,
      programId: idOf(existing.programId),
      operation: 'delete a class',
    });
    await this.repository.softDelete(id, user.userId, user.schoolId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: existing.branchId.toString(),
      module: 'class',
      action: 'DELETE',
      entityType: 'Class',
      entityId: existing._id.toString(),
      oldValue: existing.toObject(),
    });
  }
}
