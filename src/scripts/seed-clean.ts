import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { DEFAULT_CORE_ROLES } from '../constants/permissions';
import { AcademicYearModel } from '../modules/academic-year/academic-year.model';
import { RoleModel } from '../modules/role/role.model';
import { SchoolModel } from '../modules/school/school.model';
import { SystemSettingModel } from '../modules/system-setting/system-setting.model';
import { UserModel } from '../modules/user/user.model';
import { PasswordUtil } from '../utils/password';

export const seedCleanFoundation = async (): Promise<void> => {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }

  logger.info('Wiping all existing database collections for fresh manual data entry...');
  const collections = await db.listCollections().toArray();
  for (const collection of collections) {
    if (!collection.name.startsWith('system.')) {
      await db.collection(collection.name).deleteMany({});
      logger.info(`Cleared collection: ${collection.name}`);
    }
  }

  logger.info('Seeding minimal foundation: 1 School, Roles & Permissions, 1 Super Admin...');

  // 1. School
  const school = await SchoolModel.create({
    code: 'SNP',
    nameEn: 'SNP International School',
    nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
    email: 'info@snp.edu.kh',
    phone: '+855 23 888 999',
    address: 'Phnom Penh, Cambodia',
    website: 'https://snp.edu.kh',
    status: 'active',
  });
  logger.info(`[PASS] Seeded primary School: ${school.nameEn} (${school.code})`);

  // 2. Roles & Permissions
  for (const r of DEFAULT_CORE_ROLES) {
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
  logger.info(`[PASS] Seeded ${DEFAULT_CORE_ROLES.length} core system roles & permissions.`);

  // 3. Super Admin User
  const passwordHash = await PasswordUtil.hash(env.SUPER_ADMIN_PASSWORD);
  const adminUser = await UserModel.create({
    schoolId: school._id,
    username: env.SUPER_ADMIN_USERNAME,
    email: env.SUPER_ADMIN_EMAIL,
    passwordHash,
    roles: ['super_admin'],
    branchAccess: 'all',
    status: 'active',
    mustChangePassword: false,
  });
  logger.info(`[PASS] Seeded Super Admin User: ${adminUser.username} (${adminUser.email})`);

  // 4. Default System Settings
  const defaultSettings = [
    {
      key: 'general.school_name',
      value: 'SNP International School',
      type: 'string' as const,
      category: 'general' as const,
      description: 'Official school name',
      isEditable: true,
    },
    {
      key: 'finance.default_currency',
      value: 'USD',
      type: 'string' as const,
      category: 'finance' as const,
      description: 'Default transaction currency',
      isEditable: true,
    },
    {
      key: 'academic.passing_average',
      value: 50,
      type: 'number' as const,
      category: 'academic' as const,
      description: 'Minimum passing score threshold (%)',
      isEditable: true,
    },
    {
      key: 'academic.minimum_attendance_rate',
      value: 80,
      type: 'number' as const,
      category: 'academic' as const,
      description: 'Minimum attendance percentage required to pass term',
      isEditable: true,
    },
    {
      key: 'academic.gpa_scale',
      value: 4.0,
      type: 'number' as const,
      category: 'academic' as const,
      description: 'Maximum GPA grading scale',
      isEditable: false,
    },
  ];

  for (const s of defaultSettings) {
    await SystemSettingModel.create({
      schoolId: school._id,
      key: s.key,
      value: s.value,
      type: s.type,
      category: s.category,
      description: s.description,
      isEditable: s.isEditable,
      auditHistory: [
        {
          oldValue: undefined,
          newValue: s.value,
          updatedBy: 'system',
          timestamp: new Date(),
        },
      ],
    });
  }
  logger.info(`[PASS] Seeded ${defaultSettings.length} baseline system settings.`);

  // 5. Default Academic Year
  const defaultYear = await AcademicYearModel.create({
    schoolId: school._id,
    name: 'Academic Year 2026-2027',
    code: '2026-2027',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2027-08-31'),
    isCurrent: true,
    status: 'active',
  });
  logger.info(
    `[PASS] Seeded default active Academic Year: ${defaultYear.name} (${defaultYear.code})`,
  );

  logger.info('========================================================================');
  logger.info('  CLEAN FOUNDATION READY: ALL MOCK DATA CLEARED!');
  logger.info(`  You can now log in as "${adminUser.username}" and start entering data manually.`);
  logger.info('========================================================================');
};

if (require.main === module) {
  seedCleanFoundation()
    .then(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    })
    .catch(async (error) => {
      logger.error({ error }, 'Clean seed failed');
      await disconnectFromDatabase();
      process.exit(1);
    });
}
