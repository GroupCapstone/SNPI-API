import { Types } from 'mongoose';

import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import type { ISchool } from './school.model';
import { SchoolRepository } from './school.repository';
import type { CreateSchoolDto, SchoolQueryFilters, UpdateSchoolDto } from './school.types';

export class SchoolService {
  public constructor(private readonly repository = new SchoolRepository()) {}

  public async getSchools(
    filters: SchoolQueryFilters,
  ): Promise<{ data: ISchool[]; total: number }> {
    return this.repository.findWithFilters(filters);
  }

  public async getSchoolById(id: string): Promise<ISchool> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }

    const school = await this.repository.findById(id);
    if (!school) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }
    return school;
  }

  public async createSchool(dto: CreateSchoolDto, user: AuthUser): Promise<ISchool> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new ConflictError(`School code "${dto.code.toUpperCase()}" already exists`);
    }

    const school = await this.repository.create(dto, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(school._id),
      module: 'school',
      action: 'CREATE',
      entityType: 'School',
      entityId: String(school._id),
      newValue: school.toObject
        ? school.toObject()
        : (school as unknown as Record<string, unknown>),
    });

    return school;
  }

  public async updateSchool(id: string, dto: UpdateSchoolDto, user: AuthUser): Promise<ISchool> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }

    if (dto.code) {
      const duplicate = await this.repository.findByCode(dto.code, id);
      if (duplicate) {
        throw new ConflictError(`School code "${dto.code.toUpperCase()}" is already in use`);
      }
    }

    const updated = await this.repository.update(id, dto, user.userId);
    if (!updated) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(updated._id),
      module: 'school',
      action: 'UPDATE',
      entityType: 'School',
      entityId: String(updated._id),
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
      newValue: updated.toObject
        ? updated.toObject()
        : (updated as unknown as Record<string, unknown>),
    });

    return updated;
  }

  public async deleteSchool(id: string, user: AuthUser): Promise<void> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`School with ID ${id} not found`);
    }

    // Dependency check: Cannot delete school if active branches exist
    const activeBranchesCount = await BranchModel.countDocuments({
      schoolId: new Types.ObjectId(id),
      isDeleted: false,
    });
    if (activeBranchesCount > 0) {
      throw new ValidationError(
        `Cannot delete school "${existing.nameEn}" because it currently has ${activeBranchesCount} active branch(es). Deactivate or reassign them first.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing._id),
      module: 'school',
      action: 'DELETE',
      entityType: 'School',
      entityId: String(existing._id),
      oldValue: existing.toObject
        ? existing.toObject()
        : (existing as unknown as Record<string, unknown>),
    });
  }
}
