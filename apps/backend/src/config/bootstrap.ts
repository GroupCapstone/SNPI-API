import { DEFAULT_CORE_ROLES } from '../constants/permissions';
import { AcademicYearModel } from '../modules/academic-year/academic-year.model';
import { BranchModel } from '../modules/branch/branch.model';
import { RoleModel } from '../modules/role/role.model';
import { SchoolModel } from '../modules/school/school.model';
import { UserModel } from '../modules/user/user.model';
import { PasswordUtil } from '../utils/password';
import { env } from './env';
import { logger } from './logger';

export const bootstrapBaseline = async (): Promise<void> => {
  if (env.NODE_ENV === 'test') {
    return;
  }

  try {
    // 1. Ensure primary school exists
    let school = await SchoolModel.findOne({ code: 'SNP', isDeleted: false });
    if (!school) {
      school = await SchoolModel.create({
        code: 'SNP',
        nameEn: 'SNP International School',
        nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
        email: 'info@snp.edu.kh',
        phone: '+855 23 888 999',
        address: 'Phnom Penh, Cambodia',
        website: 'https://snp.edu.kh',
        status: 'active',
      });
      logger.info(`[Bootstrap] Created school: ${school.nameEn} (${school.code})`);
    }

    // 2. Ensure main branch exists
    let mainBranch = await BranchModel.findOne({ schoolId: school._id, branchCode: 'MB-01' });
    if (!mainBranch) {
      mainBranch = await BranchModel.create({
        schoolId: school._id,
        branchCode: 'MB-01',
        branchNameEn: 'Main Branch (Phnom Penh)',
        branchNameKh: 'សាខាធំ (រាជធានីភ្នំពេញ)',
        phone: '+855 23 888 101',
        email: 'main@snp.edu.kh',
        address: 'Street 271, Phnom Penh',
        status: 'active',
        isDeleted: false,
      });
      logger.info(`[Bootstrap] Created main branch: ${mainBranch.branchNameEn}`);
    }

    // 3. Ensure academic year exists
    const academicYear = await AcademicYearModel.findOne({
      schoolId: school._id,
      code: '2026-2027',
    });
    if (!academicYear) {
      await AcademicYearModel.create({
        schoolId: school._id,
        name: 'Academic Year 2026-2027',
        code: '2026-2027',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2027-08-31'),
        isCurrent: true,
        status: 'active',
      });
      logger.info('[Bootstrap] Created default academic year 2026-2027');
    }

    // 4. Ensure core system roles exist
    for (const r of DEFAULT_CORE_ROLES) {
      const existingRole = await RoleModel.findOne({ code: r.code });
      if (!existingRole) {
        await RoleModel.create({
          code: r.code,
          nameEn: r.nameEn,
          nameKh: r.nameKh,
          description: r.description,
          permissions: r.permissions,
          isSystem: true,
          status: 'active',
        });
      }
    }

    // 5. Ensure Super Admin exists with configured credentials
    const adminUser = await UserModel.findOne({
      $or: [{ username: env.SUPER_ADMIN_USERNAME }, { email: env.SUPER_ADMIN_EMAIL }],
    }).select('+passwordHash');

    if (!adminUser) {
      const passwordHash = await PasswordUtil.hash(env.SUPER_ADMIN_PASSWORD);
      await UserModel.create({
        schoolId: school._id,
        username: env.SUPER_ADMIN_USERNAME,
        email: env.SUPER_ADMIN_EMAIL,
        passwordHash,
        roles: ['super_admin'],
        branchAccess: 'all',
        status: 'active',
        mustChangePassword: false,
      });
      logger.info(
        `[Bootstrap] Created Super Admin user: ${env.SUPER_ADMIN_USERNAME} (${env.SUPER_ADMIN_EMAIL})`,
      );
    } else {
      // Keep password synced with current env if configured
      const isMatch = await PasswordUtil.compare(env.SUPER_ADMIN_PASSWORD, adminUser.passwordHash);
      if (!isMatch) {
        adminUser.passwordHash = await PasswordUtil.hash(env.SUPER_ADMIN_PASSWORD);
        adminUser.status = 'active';
        await adminUser.save();
        logger.info(`[Bootstrap] Updated Super Admin password to match configured environment`);
      }
    }
  } catch (error) {
    logger.error({ error }, '[Bootstrap] Failed to bootstrap database foundation');
  }
};
