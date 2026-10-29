import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { PaymentModel } from '../payment/payment.model';
import { SchoolModel } from '../school/school.model';
import { SequenceService } from '../sequence/sequence.service';
import type { IStudent, StudentGender } from './student.model';
import { StudentRepository } from './student.repository';
import type {
  ConfirmImportPayload,
  ConfirmImportResponse,
  CreateStudentDTO,
  DuplicateCheckCriteria,
  DuplicateCheckResponse,
  DuplicateMatchItem,
  ImportPreviewResponse,
  NormalizedImportStudent,
  RawImportStudentRow,
  StudentQueryFilters,
  UpdateStudentDTO,
} from './student.types';

export class StudentService {
  public constructor(private readonly repository = new StudentRepository()) {}

  public async getStudents(
    filters: StudentQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IStudent[]; total: number }> {
    const effectiveFilters = { ...filters, schoolId: user.schoolId };

    if (!checkUserPermission(user.permissions, 'student.view.own_branch')) {
      const enrollments = await EnrollmentModel.find({
        classId: { $in: user.assignedClasses ?? [] },
        status: { $in: ['enrolled', 'active'] },
        isDeleted: false,
      })
        .select('studentId')
        .lean()
        .exec();
      effectiveFilters.authorizedStudentIds = [
        ...new Set(enrollments.map((enrollment) => String(enrollment.studentId))),
      ];
    }

    // Apply strict branch access boundaries
    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError('You do not have access to view students in this branch');
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findAll(effectiveFilters);
  }

  public async getStudentById(id: string, user: AuthUser): Promise<IStudent> {
    const student = await this.repository.findById(id);
    if (!student) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }

    const schoolId =
      typeof student.schoolId === 'object' && student.schoolId !== null
        ? String(student.schoolId._id)
        : String(student.schoolId);
    if (user.schoolId && schoolId !== user.schoolId) {
      throw new ForbiddenError('You do not have access to view this student record');
    }

    const branchId =
      typeof student.branchId === 'object' && student.branchId !== null
        ? String(student.branchId._id)
        : String(student.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view this student record');
    }
    if (!checkUserPermission(user.permissions, 'student.view.own_branch')) {
      const assignedEnrollment = await EnrollmentModel.exists({
        studentId: student._id,
        classId: { $in: user.assignedClasses ?? [] },
        status: { $in: ['enrolled', 'active'] },
        isDeleted: false,
      });
      if (!assignedEnrollment) {
        throw new ForbiddenError('You do not teach an active class for this student');
      }
    }

    return student;
  }

  public async createStudent(dto: CreateStudentDTO, user: AuthUser): Promise<IStudent> {
    // 1. Branch access check
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create students in this branch');
    }

    // 2. Validate School exists & is active
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 3. Validate Branch exists & belongs to the School
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!branch) {
      throw new ValidationError(
        `Selected branch with ID ${dto.branchId} does not exist or does not belong to school ${dto.schoolId}`,
      );
    }

    // 4. Generate or validate Student ID (STU-XXXXXX)
    let finalStudentId = dto.studentId?.trim().toUpperCase();
    if (!finalStudentId) {
      finalStudentId = await SequenceService.getNextSequence('STU', 'STU', 6);
    } else {
      const existing = await this.repository.findByStudentId(finalStudentId);
      if (existing) {
        throw new ConflictError(`Student ID "${finalStudentId}" already exists`);
      }
    }

    // 6. Format Birthplace & Current Address
    const birthplace = dto.birthplace ?? {};
    let currentAddress = dto.currentAddress ?? {};

    if (currentAddress.sameAsBirthplace) {
      currentAddress = {
        ...currentAddress,
        province: birthplace.province,
        district: birthplace.district,
        commune: birthplace.commune,
        village: birthplace.village,
      };
    }

    const placeOfBirthText =
      dto.placeOfBirth ||
      [birthplace.village, birthplace.commune, birthplace.district, birthplace.province]
        .filter(Boolean)
        .join(', ') ||
      undefined;

    const addressText =
      dto.address ||
      [
        currentAddress.houseNumber,
        currentAddress.street,
        currentAddress.village,
        currentAddress.commune,
        currentAddress.district,
        currentAddress.province,
      ]
        .filter(Boolean)
        .join(', ') ||
      undefined;

    // 6. Create student record
    const created = await this.repository.create({
      studentId: finalStudentId,
      schoolId: school._id as never,
      branchId: branch._id as never,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      khmerName: dto.khmerName.trim(),
      gender: dto.gender,
      dateOfBirth: new Date(dto.dateOfBirth),
      placeOfBirth: placeOfBirthText,
      birthplace,
      nationality: dto.nationality?.trim() || 'Cambodian',
      phone: dto.phone?.trim() || undefined,
      email: dto.email?.trim() || undefined,
      address: addressText,
      currentAddress,
      photo: dto.photo?.trim() || undefined,
      nationalId: dto.nationalId?.trim() || undefined,
      admissionDate: dto.admissionDate ? new Date(dto.admissionDate) : new Date(),
      status: dto.status ?? 'active',
      guardians: (dto.guardians ?? []).map((g) => ({
        fullName: g.fullName.trim(),
        khmerName: g.khmerName?.trim() || undefined,
        relationship: g.relationship,
        phone: g.phone.trim(),
        email: g.email?.trim() || undefined,
        occupation: g.occupation?.trim() || undefined,
        address: g.address?.trim() || undefined,
        isPrimary: Boolean(g.isPrimary),
        isEmergencyContact: Boolean(g.isEmergencyContact),
      })),
      createdBy: user.userId as never,
      updatedBy: user.userId as never,
    });

    // 8. Audit Log
    await AuditLogService.log({
      userId: user.userId,
      module: 'student',
      action: 'CREATE',
      entityType: 'Student',
      entityId: created._id.toString(),
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      newValue: created.toObject
        ? created.toObject()
        : (created as unknown as Record<string, unknown>),
    });

    return created;
  }

  public async updateStudent(id: string, dto: UpdateStudentDTO, user: AuthUser): Promise<IStudent> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }

    const currentBranchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    if (!checkBranchAccess(user.branchAccess, currentBranchId)) {
      throw new ForbiddenError('You do not have access to update students in this branch');
    }

    if (dto.branchId && dto.branchId !== currentBranchId) {
      throw new ValidationError(
        'Student branch cannot be changed from the profile editor. Use the student transfer workflow to preserve branch history.',
        [{ field: 'branchId', message: 'Use the student transfer workflow' }],
      );
    }

    const currentSchoolId =
      typeof existing.schoolId === 'object' && existing.schoolId !== null
        ? String(existing.schoolId._id)
        : String(existing.schoolId);
    if (dto.schoolId && dto.schoolId !== currentSchoolId) {
      throw new ValidationError('Student school cannot be changed after creation', [
        { field: 'schoolId', message: 'School is immutable for an existing student' },
      ]);
    }

    const updatePayload: Partial<IStudent> = {};
    if (dto.firstName) updatePayload.firstName = dto.firstName.trim();
    if (dto.lastName) updatePayload.lastName = dto.lastName.trim();
    if (dto.khmerName) updatePayload.khmerName = dto.khmerName.trim();
    if (dto.gender) updatePayload.gender = dto.gender;
    if (dto.dateOfBirth) updatePayload.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.nationality) updatePayload.nationality = dto.nationality.trim();
    if (dto.phone !== undefined) updatePayload.phone = dto.phone?.trim() || undefined;
    if (dto.email !== undefined) updatePayload.email = dto.email?.trim() || undefined;
    if (dto.photo !== undefined) updatePayload.photo = dto.photo?.trim() || undefined;
    if (dto.nationalId !== undefined)
      updatePayload.nationalId = dto.nationalId?.trim() || undefined;
    if (dto.admissionDate) updatePayload.admissionDate = new Date(dto.admissionDate);
    if (dto.status) updatePayload.status = dto.status;

    if (dto.birthplace) {
      updatePayload.birthplace = dto.birthplace;
      updatePayload.placeOfBirth =
        dto.placeOfBirth ||
        [
          dto.birthplace.village,
          dto.birthplace.commune,
          dto.birthplace.district,
          dto.birthplace.province,
        ]
          .filter(Boolean)
          .join(', ') ||
        undefined;
    } else if (dto.placeOfBirth !== undefined) {
      updatePayload.placeOfBirth = dto.placeOfBirth?.trim() || undefined;
    }

    if (dto.currentAddress) {
      let currentAddress = { ...dto.currentAddress };
      if (currentAddress.sameAsBirthplace) {
        const bp = dto.birthplace || existing.birthplace || {};
        currentAddress = {
          ...currentAddress,
          province: bp.province,
          district: bp.district,
          commune: bp.commune,
          village: bp.village,
        };
      }
      updatePayload.currentAddress = currentAddress;
      updatePayload.address =
        dto.address ||
        [
          currentAddress.houseNumber,
          currentAddress.street,
          currentAddress.village,
          currentAddress.commune,
          currentAddress.district,
          currentAddress.province,
        ]
          .filter(Boolean)
          .join(', ') ||
        undefined;
    } else if (dto.address !== undefined) {
      updatePayload.address = dto.address?.trim() || undefined;
    }

    if (dto.guardians) {
      updatePayload.guardians = dto.guardians.map((g) => ({
        fullName: g.fullName.trim(),
        khmerName: g.khmerName?.trim() || undefined,
        relationship: g.relationship,
        phone: g.phone.trim(),
        email: g.email?.trim() || undefined,
        occupation: g.occupation?.trim() || undefined,
        address: g.address?.trim() || undefined,
        isPrimary: Boolean(g.isPrimary),
        isEmergencyContact: Boolean(g.isEmergencyContact),
      }));
    }

    if (dto.status && dto.status !== existing.status) {
      updatePayload.status = dto.status;
      const historyEntry = {
        previousStatus: existing.status,
        newStatus: dto.status,
        reason: (dto as unknown as Record<string, unknown>).statusReason as string | undefined,
        changedBy: user.userId,
        changedAt: new Date(),
      };
      (updatePayload as Record<string, unknown>).$push = { statusHistory: historyEntry };
    }

    updatePayload.updatedBy = user.userId as never;

    const updated = await this.repository.updateById(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      module: 'student',
      action: 'UPDATE',
      entityType: 'Student',
      entityId: id,
      schoolId:
        typeof existing.schoolId === 'object' && existing.schoolId !== null
          ? String(existing.schoolId._id)
          : String(existing.schoolId),
      branchId: currentBranchId,
      oldValue: existing.toObject ? existing.toObject() : existing,
      newValue: updated.toObject ? updated.toObject() : updated,
    });

    return updated;
  }

  public async deleteStudent(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }

    const branchId =
      typeof existing.branchId === 'object' && existing.branchId !== null
        ? String(existing.branchId._id)
        : String(existing.branchId);

    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to delete students in this branch');
    }

    const [enrollmentCount, paymentCount] = await Promise.all([
      EnrollmentModel.countDocuments({ studentId: id, isDeleted: false }),
      PaymentModel.countDocuments({ studentId: id, isDeleted: false }),
    ]);

    if (enrollmentCount > 0 || paymentCount > 0) {
      throw new ConflictError(
        `Cannot delete student "${existing.firstName} ${existing.lastName}" because they have active dependencies (${enrollmentCount} enrollments, ${paymentCount} payment receipts). Please change status to 'archived' or 'withdrawn' instead.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      module: 'student',
      action: 'DELETE',
      entityType: 'Student',
      entityId: id,
      schoolId:
        typeof existing.schoolId === 'object' && existing.schoolId !== null
          ? String(existing.schoolId._id)
          : String(existing.schoolId),
      branchId,
      oldValue: existing.toObject ? existing.toObject() : existing,
      required: true,
    });
  }

  public async checkDuplicates(
    criteria: DuplicateCheckCriteria,
    user: AuthUser,
  ): Promise<DuplicateCheckResponse> {
    const matchedStudents = await this.repository.findPotentialDuplicates(
      criteria,
      user.branchAccess === 'all' ? undefined : user.branchAccess,
    );
    const matches: DuplicateMatchItem[] = [];

    for (const student of matchedStudents) {
      const matchReasons: string[] = [];

      if (
        criteria.phone &&
        student.phone &&
        student.phone.replace(/\D/g, '') === criteria.phone.replace(/\D/g, '')
      ) {
        matchReasons.push('Matching Student Phone number');
      }

      if (criteria.guardianPhone && student.guardians?.length) {
        const cleanGuardianPhone = criteria.guardianPhone.replace(/\D/g, '');
        const hasGuardianPhoneMatch = student.guardians.some(
          (g) => g.phone && g.phone.replace(/\D/g, '') === cleanGuardianPhone,
        );
        if (hasGuardianPhoneMatch) {
          matchReasons.push('Matching Guardian Phone number');
        }
      }

      if (criteria.khmerName && student.khmerName === criteria.khmerName.trim()) {
        if (criteria.dateOfBirth && student.dateOfBirth) {
          const d1 = new Date(criteria.dateOfBirth).toISOString().slice(0, 10);
          const d2 = new Date(student.dateOfBirth).toISOString().slice(0, 10);
          if (d1 === d2) {
            matchReasons.push('Exact Khmer Name + Date of Birth match');
          } else {
            matchReasons.push('Matching Khmer Name');
          }
        } else {
          matchReasons.push('Matching Khmer Name');
        }
      }

      if (
        criteria.firstName &&
        criteria.lastName &&
        student.firstName.toLowerCase() === criteria.firstName.trim().toLowerCase() &&
        student.lastName.toLowerCase() === criteria.lastName.trim().toLowerCase()
      ) {
        matchReasons.push('Matching English Full Name');
      }

      if (matchReasons.length > 0) {
        const confidence: 'high' | 'medium' | 'low' = matchReasons.some(
          (r) => r.includes('Exact') || r.includes('Phone'),
        )
          ? 'high'
          : 'medium';

        const branchName =
          typeof student.branchId === 'object' && student.branchId !== null
            ? (student.branchId as { branchNameEn?: string }).branchNameEn || '—'
            : '—';

        matches.push({
          studentId: student.studentId,
          khmerName: student.khmerName,
          fullNameEn: `${student.firstName} ${student.lastName}`,
          gender: student.gender,
          dateOfBirth: student.dateOfBirth
            ? new Date(student.dateOfBirth).toISOString().slice(0, 10)
            : '—',
          phone: student.phone,
          branchName,
          matchReasons,
          confidence,
        });
      }
    }

    return {
      hasDuplicate: matches.length > 0,
      matches,
    };
  }

  public async previewImport(
    payload: { schoolId: string; branchId: string; rows: RawImportStudentRow[] },
    user: AuthUser,
  ): Promise<ImportPreviewResponse> {
    if (!checkBranchAccess(user.branchAccess, payload.branchId)) {
      throw new ForbiddenError('You do not have access to import students to this branch');
    }

    const rows = payload.rows || [];
    const normalizedRows: NormalizedImportStudent[] = [];
    const seenKhmerDob = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];
      if (!raw) continue;
      const rowNumber = raw.rowNumber ?? i + 1;
      const issues: Array<{
        field: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
      }> = [];

      // Clean string helper
      const clean = (val: unknown): string => {
        if (!val) return '';
        const str = String(val).trim();
        const lower = str.toLowerCase();
        if (['n/a', 'na', 'មិនមាន', 'none', 'null', 'undefined', '-'].includes(lower)) {
          return '';
        }
        return str;
      };

      const khmerName = clean(raw.khmerName);
      let firstName = clean(raw.firstName);
      let lastName = clean(raw.lastName);

      if (!firstName && !lastName && raw.englishName) {
        const parts = clean(raw.englishName).split(' ');
        if (parts.length >= 2) {
          lastName = parts[0] || 'Unknown';
          firstName = parts.slice(1).join(' ');
        } else {
          lastName = parts[0] || 'Unknown';
          firstName = parts[0] || 'Unknown';
        }
      }

      if (!firstName && !lastName) {
        lastName = 'Student';
        firstName = khmerName || 'New';
        issues.push({
          field: 'englishName',
          message: 'English name was missing; defaulted to placeholder for review',
          severity: 'warning',
        });
      }

      // Normalize Gender
      const rawGender = clean(raw.gender).toLowerCase();
      let gender: StudentGender = 'male';
      if (['female', 'f', 'ស្រី', 'ស', 'girl', 'woman'].includes(rawGender)) {
        gender = 'female';
      } else if (['other', 'o', 'ផ្សេងៗ'].includes(rawGender)) {
        gender = 'other';
      } else if (!['male', 'm', 'ប្រុស', 'ប', 'boy', 'man'].includes(rawGender)) {
        gender = 'male';
        if (rawGender) {
          issues.push({
            field: 'gender',
            message: `Unrecognized gender "${raw.gender}"; defaulted to male`,
            severity: 'warning',
          });
        }
      }

      // Parse & Validate DOB
      let parsedDob: Date = new Date('2015-01-01');
      if (raw.dateOfBirth) {
        if (typeof raw.dateOfBirth === 'number') {
          // Excel serial date format
          parsedDob = new Date(Math.round((raw.dateOfBirth - 25569) * 86400 * 1000));
        } else {
          const dobStr = String(raw.dateOfBirth).trim();
          // Check common DD/MM/YYYY or DD-MM-YYYY format
          const dmyMatch = dobStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
          if (dmyMatch && dmyMatch[1] && dmyMatch[2] && dmyMatch[3]) {
            const day = parseInt(dmyMatch[1], 10);
            const month = parseInt(dmyMatch[2], 10) - 1;
            const year = parseInt(dmyMatch[3], 10);
            parsedDob = new Date(Date.UTC(year, month, day));
          } else {
            parsedDob = new Date(dobStr);
          }
        }
      }

      if (isNaN(parsedDob.getTime())) {
        parsedDob = new Date('2015-01-01');
        issues.push({
          field: 'dateOfBirth',
          message: `Invalid Date of Birth format "${raw.dateOfBirth}"`,
          severity: 'error',
        });
      } else if (parsedDob > new Date()) {
        issues.push({
          field: 'dateOfBirth',
          message: 'Date of Birth cannot be in the future',
          severity: 'error',
        });
      }

      if (!khmerName) {
        issues.push({
          field: 'khmerName',
          message: 'Khmer Name is required',
          severity: 'error',
        });
      }

      // Birthplace & Current Address
      const birthplace = {
        province: clean(raw.birthplaceProvince) || undefined,
        district: clean(raw.birthplaceDistrict) || undefined,
        commune: clean(raw.birthplaceCommune) || undefined,
        village: clean(raw.birthplaceVillage) || undefined,
      };

      const currentAddress = {
        province: clean(raw.currentProvince) || birthplace.province || undefined,
        district: clean(raw.currentDistrict) || birthplace.district || undefined,
        commune: clean(raw.currentCommune) || birthplace.commune || undefined,
        village: clean(raw.currentVillage) || birthplace.village || undefined,
        street: undefined,
        houseNumber: undefined,
        sameAsBirthplace: !clean(raw.currentProvince) && Boolean(birthplace.province),
      };

      // Guardians
      const guardians = [];
      const guardianName = clean(raw.guardianName);
      const guardianPhone = clean(raw.guardianPhone);
      const rawRel = clean(raw.guardianRelationship).toLowerCase();

      let relationship: 'father' | 'mother' | 'guardian' | 'other' = 'guardian';
      if (['father', 'ឪពុក', 'dad'].includes(rawRel)) relationship = 'father';
      else if (['mother', 'ម្តាយ', 'mom'].includes(rawRel)) relationship = 'mother';
      else if (['other', 'ផ្សេងៗ'].includes(rawRel)) relationship = 'other';

      if (guardianName || guardianPhone) {
        guardians.push({
          fullName: guardianName || 'Guardian',
          relationship,
          phone: guardianPhone || clean(raw.phone) || '000000000',
          occupation: clean(raw.guardianOccupation) || undefined,
          isPrimary: true,
          isEmergencyContact: true,
        });
      }

      // Duplicate Check against DB
      const dupCheck = await this.checkDuplicates(
        {
          khmerName,
          firstName,
          lastName,
          dateOfBirth: parsedDob,
          phone: clean(raw.phone),
          guardianPhone,
        },
        user,
      );

      // In-batch duplicate check
      const duplicateMatch: DuplicateMatchItem | undefined = dupCheck.matches[0];

      const batchKey = `${khmerName}|${parsedDob.toISOString().slice(0, 10)}`;
      if (khmerName && seenKhmerDob.has(batchKey)) {
        issues.push({
          field: 'khmerName',
          message: `Duplicate student "${khmerName}" with same DOB found in this file`,
          severity: 'warning',
        });
      }
      if (khmerName) seenKhmerDob.add(batchKey);

      let validationStatus: 'valid' | 'warning' | 'error' | 'duplicate' = 'valid';
      if (issues.some((iss) => iss.severity === 'error')) {
        validationStatus = 'error';
      } else if (dupCheck.hasDuplicate) {
        validationStatus = 'duplicate';
      } else if (issues.some((iss) => iss.severity === 'warning')) {
        validationStatus = 'warning';
      }

      normalizedRows.push({
        rowNumber,
        khmerName,
        firstName,
        lastName,
        gender,
        dateOfBirth: parsedDob,
        phone: clean(raw.phone) || undefined,
        email: clean(raw.email) || undefined,
        birthplace,
        currentAddress,
        guardians,
        admissionDate: raw.admissionDate ? new Date(raw.admissionDate) : new Date(),
        status: 'active',
        validationStatus,
        issues,
        duplicateMatch,
      });
    }

    return {
      totalRows: normalizedRows.length,
      validCount: normalizedRows.filter((r) => r.validationStatus === 'valid').length,
      warningCount: normalizedRows.filter((r) => r.validationStatus === 'warning').length,
      errorCount: normalizedRows.filter((r) => r.validationStatus === 'error').length,
      duplicateCount: normalizedRows.filter((r) => r.validationStatus === 'duplicate').length,
      rows: normalizedRows,
    };
  }

  public async confirmImport(
    payload: ConfirmImportPayload,
    user: AuthUser,
  ): Promise<ConfirmImportResponse> {
    if (!checkBranchAccess(user.branchAccess, payload.branchId)) {
      throw new ForbiddenError('You do not have access to import students to this branch');
    }

    const school = await SchoolModel.findOne({ _id: payload.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`School with ID ${payload.schoolId} not found`);
    }

    const branch = await BranchModel.findOne({
      _id: payload.branchId,
      schoolId: payload.schoolId,
      isDeleted: false,
    });
    if (!branch) {
      throw new ValidationError(`Branch with ID ${payload.branchId} not found`);
    }

    const createdStudents: Array<{
      id: string;
      studentId: string;
      khmerName: string;
    }> = [];
    const errors: Array<{ rowNumber?: number; studentName?: string; reason: string }> = [];
    const skippedCount = 0;

    for (let i = 0; i < payload.rows.length; i++) {
      const row = payload.rows[i];
      if (!row) continue;
      try {
        const student = await this.createStudent(
          {
            ...row,
            firstName: row.firstName || 'Student',
            lastName: row.lastName || row.khmerName || 'Student',
            khmerName: row.khmerName || 'Student',
            gender: row.gender || 'male',
            dateOfBirth: row.dateOfBirth,
            schoolId: payload.schoolId,
            branchId: payload.branchId,
          },
          user,
        );

        createdStudents.push({
          id: student._id.toString(),
          studentId: student.studentId,
          khmerName: student.khmerName,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to import student';
        errors.push({
          rowNumber: i + 1,
          studentName: row.khmerName,
          reason: errorMsg,
        });
      }
    }

    await AuditLogService.log({
      userId: user.userId,
      module: 'student',
      action: 'CREATE',
      entityType: 'Student',
      entityId: `BATCH-${Date.now()}`,
      schoolId: payload.schoolId,
      branchId: payload.branchId,
      newValue: {
        totalRows: payload.rows.length,
        importedCount: createdStudents.length,
        skippedCount,
        errorCount: errors.length,
      },
    });

    return {
      totalProcessed: payload.rows.length,
      importedCount: createdStudents.length,
      skippedCount,
      errors,
      createdStudents,
    };
  }
}
