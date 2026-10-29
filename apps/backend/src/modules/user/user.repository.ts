import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IUser } from './user.model';
import { UserModel } from './user.model';
import type { CreateUserDto, UpdateUserDto, UserQueryFilters } from './user.types';

export class UserRepository {
  public async findWithFilters(
    filters: UserQueryFilters,
    branchFilter: { branchId?: string | { $in: string[] } } = {},
  ): Promise<{ data: IUser[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const andClauses: Record<string, unknown>[] = [{ isDeleted: false }];

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      andClauses.push({ schoolId: new Types.ObjectId(filters.schoolId) });
    }

    if (filters.status && filters.status.trim() && filters.status.trim() !== 'all') {
      andClauses.push({ status: filters.status.trim() });
    }

    if (filters.role && filters.role.trim() && filters.role.trim() !== 'all') {
      andClauses.push({ roles: filters.role.trim() });
    }

    if (branchFilter.branchId) {
      if (typeof branchFilter.branchId === 'string') {
        andClauses.push({ branchAccess: branchFilter.branchId });
      } else if (typeof branchFilter.branchId === 'object' && '$in' in branchFilter.branchId) {
        andClauses.push({ branchAccess: { $type: 'array' } });
        andClauses.push({
          $expr: {
            $cond: [
              { $isArray: '$branchAccess' },
              { $setIsSubset: ['$branchAccess', branchFilter.branchId.$in] },
              false,
            ],
          },
        });
      }
    }

    if (filters.branchId && filters.branchId !== 'all') {
      andClauses.push({ branchAccess: filters.branchId });
    }

    if (filters.search && filters.search.trim()) {
      const regex = createSafeSearchRegex(filters.search);
      andClauses.push({
        $or: [{ username: regex }, { email: regex }],
      });
    }

    const query = andClauses.length > 1 ? { $and: andClauses } : andClauses[0];

    const [data, total] = await Promise.all([
      UserModel.find(query)
        .populate('schoolId', 'code nameEn nameKh')
        .populate('employeeId', 'employeeId firstName lastName khmerName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      UserModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('employeeId', 'employeeId firstName lastName khmerName')
      .exec();
  }

  public async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({
      username: username.trim().toLowerCase(),
      isDeleted: false,
    }).exec();
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: false,
    }).exec();
  }

  public async findByIdentifier(identifier: string): Promise<IUser | null> {
    const normalized = identifier.trim().toLowerCase();
    return UserModel.findOne({
      $or: [{ username: normalized }, { email: normalized }],
      isDeleted: false,
    })
      .select('+passwordHash +refreshTokenHash')
      .populate('schoolId', 'code nameEn nameKh')
      .populate('employeeId', 'employeeId firstName lastName khmerName')
      .exec();
  }

  public async findByIdWithSecrets(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, isDeleted: false })
      .select('+passwordHash +refreshTokenHash +previousRefreshTokenHash +tokenRotatedAt')
      .populate('schoolId', 'code nameEn nameKh')
      .populate('employeeId', 'employeeId firstName lastName khmerName')
      .exec();
  }

  public async create(
    dto: CreateUserDto & { passwordHash: string; createdBy?: string },
  ): Promise<IUser> {
    return UserModel.create(dto);
  }

  public async update(
    id: string,
    dto: UpdateUserDto & { passwordHash?: string; updatedBy?: string },
  ): Promise<IUser | null> {
    const fields = { ...dto };
    delete fields.password;
    const revokeSessions = Boolean(dto.passwordHash || (dto.status && dto.status !== 'active'));
    const update = {
      $set: {
        ...fields,
        ...(dto.passwordHash ? { mustChangePassword: true } : {}),
      },
      ...(revokeSessions
        ? {
            $inc: { tokenVersion: 1 },
            $unset: { refreshTokenHash: 1, previousRefreshTokenHash: 1, tokenRotatedAt: 1 },
          }
        : {}),
    };
    return UserModel.findOneAndUpdate({ _id: id, isDeleted: false }, update, {
      new: true,
      runValidators: true,
    })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('employeeId', 'employeeId firstName lastName khmerName')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
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
