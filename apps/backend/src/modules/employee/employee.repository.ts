import type { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IEmployee } from './employee.model';
import { EmployeeModel } from './employee.model';
import type { CreateEmployeeDto, EmployeeQueryFilters, UpdateEmployeeDto } from './employee.types';

export class EmployeeRepository {
  public async findWithFilters(
    filters: EmployeeQueryFilters,
    branchFilter: { branchId?: string | { $in: string[] } } = {},
  ): Promise<{ data: IEmployee[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId) {
      query.schoolId = filters.schoolId;
    }

    if (filters.branchId) {
      query.branchId = filters.branchId;
    }

    if (filters.departmentId) {
      query.departmentId = filters.departmentId;
    }

    if (filters.positionId) {
      query.positionId = filters.positionId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.employmentType) {
      query.employmentType = filters.employmentType;
    }

    if (filters.educationLevel) {
      query.educationLevel = filters.educationLevel;
    }

    if (filters.gender) {
      query.gender = filters.gender;
    }

    if (filters.search) {
      const regex = createSafeSearchRegex(filters.search);
      query.$or = [
        { employeeId: regex },
        { legacyEmployeeNumber: regex },
        { firstName: regex },
        { lastName: regex },
        { khmerName: regex },
        { nationalIdNumber: regex },
        { primaryPhone: regex },
        { secondaryPhone: regex },
        { phone: regex },
        { email: regex },
      ];
    }

    const sortField = filters.sortBy ?? 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = { [sortField]: sortDirection };

    const [data, total] = await Promise.all([
      EmployeeModel.find(query)
        .populate('schoolId', 'code nameEn nameKh')
        .populate('branchId', 'branchCode branchNameEn branchNameKh')
        .populate('departmentId', 'code nameEn nameKh')
        .populate('positionId', 'code nameEn nameKh')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      EmployeeModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IEmployee | null> {
    return EmployeeModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .populate('departmentId', 'code nameEn nameKh')
      .populate('positionId', 'code nameEn nameKh')
      .exec();
  }

  public async findByEmployeeId(employeeId: string): Promise<IEmployee | null> {
    return EmployeeModel.findOne({
      employeeId: employeeId.trim().toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async findByLegacyNumber(legacyNumber: string): Promise<IEmployee | null> {
    return EmployeeModel.findOne({
      legacyEmployeeNumber: legacyNumber.trim(),
      isDeleted: false,
    }).exec();
  }

  public async findByEmail(email: string): Promise<IEmployee | null> {
    return EmployeeModel.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: false,
    }).exec();
  }

  public async create(
    dto: CreateEmployeeDto & { employeeId: string; createdBy?: Types.ObjectId | string },
  ): Promise<IEmployee> {
    return EmployeeModel.create(dto);
  }

  public async update(
    id: string,
    dto: UpdateEmployeeDto & { updatedBy?: Types.ObjectId | string },
  ): Promise<IEmployee | null> {
    return EmployeeModel.findOneAndUpdate({ _id: id, isDeleted: false }, dto, {
      new: true,
      runValidators: true,
    })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .populate('departmentId', 'code nameEn nameKh')
      .populate('positionId', 'code nameEn nameKh')
      .exec();
  }

  public async count(query: Record<string, unknown>): Promise<number> {
    return EmployeeModel.countDocuments(query).exec();
  }

  public async softDelete(id: string, userId?: Types.ObjectId | string): Promise<IEmployee | null> {
    return EmployeeModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: userId,
      },
      { new: true },
    ).exec();
  }
}
