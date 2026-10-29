import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ProgramModel } from '../program/program.model';
import { SchoolModel } from '../school/school.model';
import { SequenceService } from '../sequence/sequence.service';
import type { IRegistration } from './registration.model';
import { RegistrationRepository } from './registration.repository';
import type {
  CreateRegistrationDTO,
  RegistrationQueryFilters,
  UpdateRegistrationDTO,
} from './registration.types';

export class RegistrationService {
  public constructor(private readonly repository = new RegistrationRepository()) {}

  public async getRegistrations(
    filters: RegistrationQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IRegistration[]; total: number }> {
    const effectiveFilters = { ...filters };

    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError('You do not have access to view registrations in this branch');
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findAll(effectiveFilters);
  }

  public async getRegistrationById(id: string, user: AuthUser): Promise<IRegistration> {
    const registration = await this.repository.findById(id);
    if (!registration) {
      throw new NotFoundError(`Registration application with ID ${id} not found`);
    }

    const branchId =
      typeof registration.branchId === 'object' && registration.branchId !== null
        ? String(registration.branchId._id)
        : String(registration.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view this registration record');
    }

    return registration;
  }

  public async createRegistration(
    dto: CreateRegistrationDTO,
    user: AuthUser,
  ): Promise<IRegistration> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to register applicants in this branch');
    }

    // 1. School check
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 2. Branch check
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

    // 3. Academic Year check
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new ValidationError(`Academic year with ID ${dto.academicYearId} does not exist`);
    }

    // 4. Program check
    const program = await ProgramModel.findOne({
      _id: dto.programId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!program) {
      throw new ValidationError(`Program with ID ${dto.programId} does not exist`);
    }

    // 5. Sequence generation
    let finalRegNumber = dto.registrationNumber?.trim().toUpperCase();
    if (!finalRegNumber) {
      finalRegNumber = await SequenceService.getNextSequence('REG', 'REG', 6);
    } else {
      const existing = await this.repository.findByRegistrationNumber(finalRegNumber);
      if (existing) {
        throw new ConflictError(`Registration number "${finalRegNumber}" already exists`);
      }
    }

    // 6. Create record
    const created = await this.repository.create({
      registrationNumber: finalRegNumber,
      schoolId: school._id as never,
      branchId: branch._id as never,
      academicYearId: academicYear._id as never,
      programId: program._id as never,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      khmerName: dto.khmerName.trim(),
      gender: dto.gender,
      dateOfBirth: new Date(dto.dateOfBirth),
      phone: dto.phone.trim(),
      email: dto.email?.trim().toLowerCase(),
      address: dto.address?.trim(),
      guardianName: dto.guardianName.trim(),
      guardianRelationship: dto.guardianRelationship.trim(),
      guardianPhone: dto.guardianPhone.trim(),
      status: dto.status ?? 'registered',
      registrationDate: dto.registrationDate ? new Date(dto.registrationDate) : new Date(),
      remarks: dto.remarks?.trim(),
      createdBy: user.userId as never,
      updatedBy: user.userId as never,
    });

    // 7. Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'registration',
      action: 'CREATE',
      entityType: 'Registration',
      entityId: created._id.toString(),
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async updateRegistration(
    id: string,
    dto: UpdateRegistrationDTO,
    user: AuthUser,
  ): Promise<IRegistration> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Registration application with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    const currentSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have access to edit this registration application');
    }

    const updateData: Partial<IRegistration> = {
      updatedBy: user.userId as never,
    };

    if (dto.firstName) updateData.firstName = dto.firstName.trim();
    if (dto.lastName) updateData.lastName = dto.lastName.trim();
    if (dto.khmerName) updateData.khmerName = dto.khmerName.trim();
    if (dto.gender) updateData.gender = dto.gender;
    if (dto.dateOfBirth) updateData.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.phone) updateData.phone = dto.phone.trim();
    if (dto.email !== undefined) updateData.email = dto.email?.trim().toLowerCase();
    if (dto.address !== undefined) updateData.address = dto.address?.trim();
    if (dto.guardianName) updateData.guardianName = dto.guardianName.trim();
    if (dto.guardianRelationship) updateData.guardianRelationship = dto.guardianRelationship.trim();
    if (dto.guardianPhone) updateData.guardianPhone = dto.guardianPhone.trim();
    if (dto.status) updateData.status = dto.status;
    if (dto.remarks !== undefined) updateData.remarks = dto.remarks?.trim();
    if (dto.registrationDate) updateData.registrationDate = new Date(dto.registrationDate);

    const updated = await this.repository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundError(`Registration application with ID ${id} not found after update`);
    }

    // Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'registration',
      action: 'UPDATE',
      entityType: 'Registration',
      entityId: id,
      schoolId: currentSchoolId,
      branchId: currentBranchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async deleteRegistration(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Registration with ID ${id} not found`);
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
      throw new ForbiddenError('You do not have access to delete this registration record');
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      module: 'registration',
      action: 'DELETE',
      entityType: 'Registration',
      entityId: id,
      schoolId,
      branchId,
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }
}
