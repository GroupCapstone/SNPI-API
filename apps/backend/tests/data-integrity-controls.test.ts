import { describe, expect, it, vi } from 'vitest';

import { ClassModel } from '../src/modules/class/class.model';
import { DepartmentModel } from '../src/modules/department/department.model';
import { DepartmentService } from '../src/modules/department/department.service';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { LevelModel } from '../src/modules/level/level.model';
import { PaymentModel } from '../src/modules/payment/payment.model';
import { PositionModel } from '../src/modules/position/position.model';
import { PositionService } from '../src/modules/position/position.service';
import { ProgramModel } from '../src/modules/program/program.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';
import { TuitionService } from '../src/modules/tuition/tuition.service';
import type { AuthUser } from '../src/types/auth';

const adminUser: AuthUser = {
  userId: '507f1f77bcf86cd799439011',
  username: 'integrity_admin',
  email: 'integrity.admin@snp.edu.kh',
  schoolId: '507f1f77bcf86cd799439001',
  roles: ['super_admin'],
  permissions: ['*'],
  branchAccess: 'all',
};

const hasActiveUniqueIndex = (
  indexes: ReturnType<typeof SchoolModel.schema.indexes>,
  expectedFields: string[],
): boolean =>
  indexes.some(([fields, options]) => {
    const actualFields = Object.keys(fields);
    return (
      expectedFields.every((field) => actualFields.includes(field)) &&
      actualFields.length === expectedFields.length &&
      options.unique === true &&
      options.partialFilterExpression?.isDeleted === false
    );
  });

describe('database integrity controls', () => {
  it.each([
    ['school code', SchoolModel.schema.indexes(), ['code']],
    ['department code per branch', DepartmentModel.schema.indexes(), ['branchId', 'code']],
    ['position code per department', PositionModel.schema.indexes(), ['departmentId', 'code']],
    ['program code', ProgramModel.schema.indexes(), ['schoolId', 'code']],
    ['level code per program', LevelModel.schema.indexes(), ['programId', 'code']],
    [
      'class code per branch and academic year',
      ClassModel.schema.indexes(),
      ['branchId', 'academicYearId', 'classCode'],
    ],
    [
      'tuition fee code per branch and academic year',
      TuitionFeeModel.schema.indexes(),
      ['branchId', 'academicYearId', 'feeCode'],
    ],
  ])('enforces active-record uniqueness for %s', (_label, indexes, expectedFields) => {
    expect(hasActiveUniqueIndex(indexes, expectedFields)).toBe(true);
  });
});

describe('soft-delete dependency controls', () => {
  it('blocks deleting a position assigned to active employees', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439004',
        schoolId: '507f1f77bcf86cd799439001',
        branchId: '507f1f77bcf86cd799439002',
        nameEn: 'Teacher',
      }),
      softDelete: vi.fn(),
    };
    vi.spyOn(EmployeeModel, 'countDocuments').mockResolvedValueOnce(2);

    const service = new PositionService(repository as never);

    await expect(service.deletePosition('507f1f77bcf86cd799439004', adminUser)).rejects.toThrow(
      '2 active employee(s) are assigned',
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('blocks deleting a department with active employees even when it has no positions', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439003',
        schoolId: '507f1f77bcf86cd799439001',
        branchId: '507f1f77bcf86cd799439002',
        nameEn: 'Academic',
      }),
      softDelete: vi.fn(),
    };
    vi.spyOn(PositionModel, 'countDocuments').mockResolvedValueOnce(0);
    vi.spyOn(EmployeeModel, 'countDocuments').mockResolvedValueOnce(3);

    const service = new DepartmentService(repository as never);

    await expect(service.deleteDepartment('507f1f77bcf86cd799439003', adminUser)).rejects.toThrow(
      '0 positions, 3 employees',
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('blocks deleting a tuition fee referenced by payment history', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue({
        _id: '6a939db4ea1f071b8b1f17e3',
        schoolId: '6a939db4ea1f071b8b1f17d1',
        branchId: '6a939db4ea1f071b8b1f17c1',
        feeName: 'Semester tuition',
      }),
      softDelete: vi.fn(),
    };
    vi.spyOn(PaymentModel, 'countDocuments').mockResolvedValueOnce(1);

    const service = new TuitionService(repository as never);

    await expect(service.deleteTuitionFee('6a939db4ea1f071b8b1f17e3', adminUser)).rejects.toThrow(
      '1 payment record(s) reference it',
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
