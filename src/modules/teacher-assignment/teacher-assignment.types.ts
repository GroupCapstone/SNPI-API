import type { TeacherAssignmentStatus, TeacherRoleInClass } from './teacher-assignment.model';
export interface CreateTeacherAssignmentDTO {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  employeeId: string;
  classId: string;
  subjectId?: string;
  timeSlotId?: string;
  roleInClass: TeacherRoleInClass;
  status?: TeacherAssignmentStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  remarks?: string;
}
export interface UpdateTeacherAssignmentDTO {
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string | null;
  employeeId?: string;
  classId?: string;
  subjectId?: string;
  timeSlotId?: string | null;
  roleInClass?: TeacherRoleInClass;
  status?: TeacherAssignmentStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  remarks?: string;
}
export interface TeacherAssignmentQueryFilters {
  authorizedBranchIds?: string[];
  page?: number;
  limit?: number;
  search?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  employeeId?: string;
  classId?: string;
  subjectId?: string;
  timeSlotId?: string;
  roleInClass?: TeacherRoleInClass;
  status?: TeacherAssignmentStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TeacherRosterQueryFilters {
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  employeeId?: string;
  search?: string;
  authorizedBranchIds?: string[];
}

export interface TeacherRosterStudentItem {
  enrollmentId: string;
  studentId: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  khmerName?: string;
  gender: string;
  dateOfBirth?: string;
  photo?: string;
  guardianName?: string;
  guardianPhone?: string;
  tuitionStatus?: string;
  status: string;
  attendanceRate?: number;
}

export interface TeacherRosterClassItem {
  assignmentId: string;
  classId: string;
  classCode: string;
  className: string;
  roleInClass: TeacherRoleInClass;
  program?: { _id: string; code: string; nameEn: string; nameKh?: string };
  level?: { _id: string; code: string; name: string };
  subject?: { _id: string; code: string; nameEn: string; nameKh?: string };
  classroom?: { _id: string; code: string; name: string; building?: string };
  shift?: string;
  daysPattern?: string;
  startTime?: string;
  endTime?: string;
  capacity: number;
  totalStudents: number;
  students: TeacherRosterStudentItem[];
}

export interface TeacherRosterFacultyItem {
  teacher: {
    _id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    khmerName?: string;
    gender?: string;
    phone?: string;
    email?: string;
    photo?: string;
    department?: { _id: string; departmentNameEn: string; departmentNameKh?: string };
    position?: { _id: string; positionNameEn: string; positionNameKh?: string };
    branch?: { _id: string; branchCode: string; branchNameEn: string; branchNameKh?: string };
  };
  totalAssignedClasses: number;
  totalStudents: number;
  classes: TeacherRosterClassItem[];
}

export interface TeacherRosterUnassignedClassItem {
  _id: string;
  classCode: string;
  className: string;
  program?: { code: string; nameEn: string };
  level?: { code: string; name: string };
  branch?: { branchCode: string; branchNameEn: string };
  capacity: number;
  currentEnrollmentCount: number;
  shift?: string;
}

export interface TeacherRosterMatrixResponse {
  summary: {
    totalTeachers: number;
    assignedClassesCount: number;
    unassignedClassesCount: number;
    totalStudents: number;
  };
  faculty: TeacherRosterFacultyItem[];
  unassignedClasses: TeacherRosterUnassignedClassItem[];
}
