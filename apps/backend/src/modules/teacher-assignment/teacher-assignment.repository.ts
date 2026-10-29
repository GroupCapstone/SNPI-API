import { Types } from 'mongoose';

import { ClassModel } from '../class/class.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { MonthlyAttendanceSummaryModel } from '../attendance/monthly-attendance-summary.model';
import type { ITeacherAssignment } from './teacher-assignment.model';
import { TeacherAssignmentModel } from './teacher-assignment.model';
import type {
  TeacherRosterClassItem,
  TeacherRosterFacultyItem,
  TeacherRosterMatrixResponse,
  TeacherRosterQueryFilters,
  TeacherRosterStudentItem,
  TeacherRosterUnassignedClassItem,
  TeacherAssignmentQueryFilters,
} from './teacher-assignment.types';

export class TeacherAssignmentRepository {
  public async create(data: Partial<ITeacherAssignment>): Promise<ITeacherAssignment> {
    return TeacherAssignmentModel.create(data);
  }

  public async findById(id: string): Promise<ITeacherAssignment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TeacherAssignmentModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('employeeId', 'employeeId firstName lastName khmerName phone email')
      .populate('classId', 'className classCode shift')
      .populate('subjectId', 'nameEn nameKh code')
      .exec();
  }

  public async findDuplicate(
    academicYearId: string,
    classId: string,
    employeeId: string,
    subjectId?: string,
    excludeId?: string,
  ): Promise<ITeacherAssignment | null> {
    const query: Record<string, unknown> = {
      academicYearId: new Types.ObjectId(academicYearId),
      classId: new Types.ObjectId(classId),
      employeeId: new Types.ObjectId(employeeId),
      status: 'active',
      isDeleted: false,
    };
    if (subjectId) {
      query.subjectId = new Types.ObjectId(subjectId);
    }
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }
    return TeacherAssignmentModel.findOne(query).exec();
  }

  public async findAll(
    filters: TeacherAssignmentQueryFilters,
  ): Promise<{ data: ITeacherAssignment[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.authorizedBranchIds) {
      query.branchId = {
        $in: filters.authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }
    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }
    if (filters.employeeId && Types.ObjectId.isValid(filters.employeeId)) {
      query.employeeId = new Types.ObjectId(filters.employeeId);
    }
    if (filters.classId && Types.ObjectId.isValid(filters.classId)) {
      query.classId = new Types.ObjectId(filters.classId);
    }
    if (filters.subjectId && Types.ObjectId.isValid(filters.subjectId)) {
      query.subjectId = new Types.ObjectId(filters.subjectId);
    }
    if (filters.timeSlotId && Types.ObjectId.isValid(filters.timeSlotId)) {
      query.timeSlotId = new Types.ObjectId(filters.timeSlotId);
    }
    if (filters.roleInClass) {
      query.roleInClass = filters.roleInClass;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      TeacherAssignmentModel.find(query)
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name code isCurrent')
        .populate('employeeId', 'employeeId firstName lastName khmerName phone email')
        .populate('classId', 'className classCode shift')
        .populate('subjectId', 'nameEn nameKh code')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      TeacherAssignmentModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async updateById(
    id: string,
    updateData: Partial<ITeacherAssignment>,
  ): Promise<ITeacherAssignment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TeacherAssignmentModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('employeeId', 'employeeId firstName lastName khmerName phone email')
      .populate('classId', 'className classCode shift')
      .populate('subjectId', 'nameEn nameKh code')
      .exec();
  }

  public async softDelete(id: string, deletedBy?: string): Promise<ITeacherAssignment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TeacherAssignmentModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: deletedBy ? new Types.ObjectId(deletedBy) : undefined,
      },
      { new: true },
    ).exec();
  }

  public async findRosterMatrix(
    filters: TeacherRosterQueryFilters,
  ): Promise<TeacherRosterMatrixResponse> {
    const assignmentQuery: Record<string, unknown> = {
      isDeleted: false,
      status: 'active',
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      assignmentQuery.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.authorizedBranchIds) {
      assignmentQuery.branchId = {
        $in: filters.authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      assignmentQuery.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      assignmentQuery.academicYearId = new Types.ObjectId(filters.academicYearId);
    }

    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      assignmentQuery.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }

    if (filters.employeeId && Types.ObjectId.isValid(filters.employeeId)) {
      assignmentQuery.employeeId = new Types.ObjectId(filters.employeeId);
    }

    // 1. Fetch active assignments
    const assignments = await TeacherAssignmentModel.find(assignmentQuery)
      .populate({
        path: 'employeeId',
        select:
          'employeeId firstName lastName khmerName gender phone email photo departmentId positionId branchId',
        populate: [
          { path: 'departmentId', select: 'nameEn nameKh code' },
          { path: 'positionId', select: 'nameEn nameKh code' },
          { path: 'branchId', select: 'branchCode branchNameEn branchNameKh' },
        ],
      })
      .populate({
        path: 'classId',
        select:
          'className classCode programId levelId classroomId shift daysPattern startTime endTime capacity currentEnrollmentCount branchId academicYearId',
        populate: [
          { path: 'programId', select: 'nameEn nameKh code' },
          { path: 'levelId', select: 'name code' },
          { path: 'classroomId', select: 'code building name' },
        ],
      })
      .populate('subjectId', 'nameEn nameKh code')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .lean()
      .exec();

    // 2. Collect unique class IDs from assignments
    const assignedClassIds = [
      ...new Set(
        assignments
          .map((a) => {
            const c = a.classId as unknown as { _id?: Types.ObjectId | string } | undefined;
            return c?._id ? String(c._id) : a.classId ? String(a.classId) : null;
          })
          .filter((id): id is string => Boolean(id && Types.ObjectId.isValid(id))),
      ),
    ];

    // 3. Fetch active enrollments with populated students for these classes
    const enrollments =
      assignedClassIds.length > 0
        ? await EnrollmentModel.find({
            classId: { $in: assignedClassIds.map((id) => new Types.ObjectId(id)) },
            ...(filters.schoolId && Types.ObjectId.isValid(filters.schoolId)
              ? { schoolId: new Types.ObjectId(filters.schoolId) }
              : {}),
            status: { $in: ['enrolled', 'active'] },
            isDeleted: false,
          })
            .populate({
              path: 'studentId',
              select: 'studentId firstName lastName khmerName gender dateOfBirth photo guardians',
            })
            .lean()
            .exec()
        : [];

    // 4. Fetch attendance rates from MonthlyAttendanceSummary if available
    const attendanceSummaries =
      assignedClassIds.length > 0
        ? await MonthlyAttendanceSummaryModel.find({
            classId: { $in: assignedClassIds.map((id) => new Types.ObjectId(id)) },
            ...(filters.schoolId && Types.ObjectId.isValid(filters.schoolId)
              ? { schoolId: new Types.ObjectId(filters.schoolId) }
              : {}),
            isDeleted: false,
          })
            .select('studentId classId attendanceRate')
            .lean()
            .exec()
        : [];

    const attendanceRateMap = new Map<string, number>();
    for (const summ of attendanceSummaries) {
      if (summ.studentId && summ.classId) {
        const key = `${String(summ.classId)}_${String(summ.studentId)}`;
        attendanceRateMap.set(key, summ.attendanceRate);
      }
    }

    // Map enrollments by classId
    const classEnrollmentsMap = new Map<string, TeacherRosterStudentItem[]>();
    for (const enr of enrollments) {
      const clsId = String(enr.classId);
      const student = enr.studentId as unknown as {
        _id: Types.ObjectId | string;
        studentId?: string;
        firstName?: string;
        lastName?: string;
        khmerName?: string;
        gender?: string;
        dateOfBirth?: Date | string;
        photo?: string;
        guardians?: Array<{ fullName?: string; phone?: string; isPrimary?: boolean }>;
      } | null;

      if (!student) continue;

      const primaryGuardian =
        Array.isArray(student.guardians) && student.guardians.length > 0
          ? student.guardians.find((g) => g.isPrimary) || student.guardians[0]
          : null;

      const rateKey = `${clsId}_${String(student._id)}`;
      const attendanceRate = attendanceRateMap.get(rateKey);

      const studentItem: TeacherRosterStudentItem = {
        enrollmentId: String(enr._id),
        studentId: String(student._id),
        studentCode: student.studentId || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        khmerName: student.khmerName || '',
        gender: student.gender || 'other',
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().slice(0, 10)
          : undefined,
        photo: student.photo,
        guardianName: primaryGuardian?.fullName,
        guardianPhone: primaryGuardian?.phone,
        tuitionStatus: enr.tuitionStatus,
        status: enr.status,
        attendanceRate:
          attendanceRate !== undefined ? Math.round(attendanceRate * 10) / 10 : undefined,
      };

      if (!classEnrollmentsMap.has(clsId)) {
        classEnrollmentsMap.set(clsId, []);
      }
      classEnrollmentsMap.get(clsId)!.push(studentItem);
    }

    // 5. Group by Teacher
    const facultyMap = new Map<string, TeacherRosterFacultyItem>();
    const totalStudentIdsSet = new Set<string>();
    const assignedClassIdsSet = new Set<string>();

    for (const a of assignments) {
      const emp = a.employeeId as unknown as {
        _id: Types.ObjectId | string;
        employeeId?: string;
        firstName?: string;
        lastName?: string;
        khmerName?: string;
        gender?: string;
        phone?: string;
        email?: string;
        photo?: string;
        departmentId?: {
          _id: Types.ObjectId | string;
          nameEn?: string;
          nameKh?: string;
        };
        positionId?: {
          _id: Types.ObjectId | string;
          nameEn?: string;
          nameKh?: string;
        };
        branchId?: {
          _id: Types.ObjectId | string;
          branchCode?: string;
          branchNameEn?: string;
          branchNameKh?: string;
        };
      } | null;

      const cls = a.classId as unknown as {
        _id: Types.ObjectId | string;
        classCode?: string;
        className?: string;
        capacity?: number;
        shift?: string;
        daysPattern?: string;
        startTime?: string;
        endTime?: string;
        programId?: {
          _id: Types.ObjectId | string;
          code?: string;
          nameEn?: string;
          nameKh?: string;
        };
        levelId?: { _id: Types.ObjectId | string; code?: string; name?: string };
        classroomId?: {
          _id: Types.ObjectId | string;
          code?: string;
          name?: string;
          building?: string;
        };
      } | null;

      if (!emp || !cls) continue;

      const teacherId = String(emp._id);
      const classId = String(cls._id);
      assignedClassIdsSet.add(classId);

      const classStudents = classEnrollmentsMap.get(classId) || [];
      classStudents.forEach((s) => totalStudentIdsSet.add(s.studentId));

      const subj = a.subjectId as unknown as {
        _id: Types.ObjectId | string;
        code?: string;
        nameEn?: string;
        nameKh?: string;
      } | null;

      const classItem: TeacherRosterClassItem = {
        assignmentId: String(a._id),
        classId,
        classCode: cls.classCode || '',
        className: cls.className || '',
        roleInClass: a.roleInClass,
        program: cls.programId
          ? {
              _id: String(cls.programId._id),
              code: cls.programId.code || '',
              nameEn: cls.programId.nameEn || '',
              nameKh: cls.programId.nameKh,
            }
          : undefined,
        level: cls.levelId
          ? {
              _id: String(cls.levelId._id),
              code: cls.levelId.code || '',
              name: cls.levelId.name || '',
            }
          : undefined,
        subject: subj
          ? {
              _id: String(subj._id),
              code: subj.code || '',
              nameEn: subj.nameEn || '',
              nameKh: subj.nameKh,
            }
          : undefined,
        classroom: cls.classroomId
          ? {
              _id: String(cls.classroomId._id),
              code: cls.classroomId.code || '',
              name: cls.classroomId.name || cls.classroomId.code || '',
              building: cls.classroomId.building,
            }
          : undefined,
        shift: cls.shift,
        daysPattern: cls.daysPattern,
        startTime: cls.startTime,
        endTime: cls.endTime,
        capacity: cls.capacity || 0,
        totalStudents: classStudents.length,
        students: classStudents,
      };

      if (!facultyMap.has(teacherId)) {
        facultyMap.set(teacherId, {
          teacher: {
            _id: teacherId,
            employeeId: emp.employeeId || '',
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            khmerName: emp.khmerName,
            gender: emp.gender,
            phone: emp.phone,
            email: emp.email,
            photo: emp.photo,
            department: emp.departmentId
              ? {
                  _id: String(emp.departmentId._id),
                  departmentNameEn: emp.departmentId.nameEn || '',
                  departmentNameKh: emp.departmentId.nameKh,
                }
              : undefined,
            position: emp.positionId
              ? {
                  _id: String(emp.positionId._id),
                  positionNameEn: emp.positionId.nameEn || '',
                  positionNameKh: emp.positionId.nameKh,
                }
              : undefined,
            branch: emp.branchId
              ? {
                  _id: String(emp.branchId._id),
                  branchCode: emp.branchId.branchCode || '',
                  branchNameEn: emp.branchId.branchNameEn || '',
                  branchNameKh: emp.branchId.branchNameKh,
                }
              : undefined,
          },
          totalAssignedClasses: 0,
          totalStudents: 0,
          classes: [],
        });
      }

      const facultyRecord = facultyMap.get(teacherId)!;
      facultyRecord.classes.push(classItem);
      facultyRecord.totalAssignedClasses = facultyRecord.classes.length;
      facultyRecord.totalStudents = facultyRecord.classes.reduce(
        (sum, c) => sum + c.totalStudents,
        0,
      );
    }

    // 6. Find Unassigned Classes in authorized branch/year
    const classQuery: Record<string, unknown> = {
      isDeleted: false,
      status: { $in: ['planned', 'active'] },
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      classQuery.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.authorizedBranchIds) {
      classQuery.branchId = {
        $in: filters.authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }
    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      classQuery.branchId = new Types.ObjectId(filters.branchId);
    }
    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      classQuery.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      classQuery.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }

    if (assignedClassIdsSet.size > 0) {
      classQuery._id = {
        $nin: Array.from(assignedClassIdsSet).map((id) => new Types.ObjectId(id)),
      };
    }

    const unassignedClassesRaw = await ClassModel.find(classQuery)
      .populate('programId', 'code nameEn')
      .populate('levelId', 'code name')
      .populate('branchId', 'branchCode branchNameEn')
      .lean()
      .exec();

    const unassignedClasses: TeacherRosterUnassignedClassItem[] = unassignedClassesRaw.map(
      (cls) => {
        const p = cls.programId as unknown as { code?: string; nameEn?: string } | undefined;
        const l = cls.levelId as unknown as { code?: string; name?: string } | undefined;
        const b = cls.branchId as unknown as
          { branchCode?: string; branchNameEn?: string } | undefined;

        return {
          _id: String(cls._id),
          classCode: cls.classCode || '',
          className: cls.className || '',
          program: p ? { code: p.code || '', nameEn: p.nameEn || '' } : undefined,
          level: l ? { code: l.code || '', name: l.name || '' } : undefined,
          branch: b
            ? { branchCode: b.branchCode || '', branchNameEn: b.branchNameEn || '' }
            : undefined,
          capacity: cls.capacity || 0,
          currentEnrollmentCount: cls.currentEnrollmentCount || 0,
          shift: cls.shift,
        };
      },
    );

    let facultyList = Array.from(facultyMap.values());

    // Search filter in-memory if search keyword supplied
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      facultyList = facultyList.filter((f) => {
        const t = f.teacher;
        const matchTeacher =
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          (t.khmerName && t.khmerName.toLowerCase().includes(q)) ||
          t.employeeId.toLowerCase().includes(q) ||
          (t.department?.departmentNameEn &&
            t.department.departmentNameEn.toLowerCase().includes(q));

        const matchClass = f.classes.some(
          (c) =>
            c.className.toLowerCase().includes(q) ||
            c.classCode.toLowerCase().includes(q) ||
            (c.subject?.nameEn && c.subject.nameEn.toLowerCase().includes(q)),
        );

        return matchTeacher || matchClass;
      });
    }

    return {
      summary: {
        totalTeachers: facultyList.length,
        assignedClassesCount: assignedClassIdsSet.size,
        unassignedClassesCount: unassignedClasses.length,
        totalStudents: totalStudentIdsSet.size,
      },
      faculty: facultyList,
      unassignedClasses,
    };
  }
}
