import { createSafeSearchRegex } from '../../utils/search';

import type { IRole } from './role.model';
import { RoleModel } from './role.model';
import type { CreateRoleDto, RoleQueryFilters, UpdateRoleDto } from './role.types';

export class RoleRepository {
  public async findWithFilters(
    filters: RoleQueryFilters,
  ): Promise<{ data: IRole[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (typeof filters.isSystem === 'boolean') {
      query.isSystem = filters.isSystem;
    }

    if (filters.search) {
      const regex = createSafeSearchRegex(filters.search);
      query.$or = [{ code: regex }, { nameEn: regex }, { nameKh: regex }];
    }

    const [data, total] = await Promise.all([
      RoleModel.find(query).sort({ isSystem: -1, createdAt: 1 }).skip(skip).limit(limit).exec(),
      RoleModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IRole | null> {
    return RoleModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  public async findByCode(code: string): Promise<IRole | null> {
    return RoleModel.findOne({
      code: code.trim().toLowerCase(),
      isDeleted: false,
    }).exec();
  }

  public async findByCodes(codes: string[]): Promise<IRole[]> {
    const normalized = codes.map((c) => c.trim().toLowerCase());
    return RoleModel.find({
      code: { $in: normalized },
      status: 'active',
      isDeleted: false,
    }).exec();
  }

  public async create(
    dto: CreateRoleDto & { createdBy?: string; isSystem?: boolean },
  ): Promise<IRole> {
    return RoleModel.create({
      ...dto,
      code: dto.code.trim().toLowerCase(),
    });
  }

  public async update(
    id: string,
    dto: UpdateRoleDto & { updatedBy?: string },
  ): Promise<IRole | null> {
    return RoleModel.findOneAndUpdate({ _id: id, isDeleted: false }, dto, {
      new: true,
      runValidators: true,
    }).exec();
  }

  public async softDelete(id: string, userId?: string): Promise<IRole | null> {
    return RoleModel.findOneAndUpdate(
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
