import { Types } from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClassModel } from '../src/modules/class/class.model';
import { ClassroomModel } from '../src/modules/classroom/classroom.model';
import { ClassScheduleService } from '../src/modules/class-schedule/class-schedule.service';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { StudentModel } from '../src/modules/student/student.model';
import { SubjectModel } from '../src/modules/subject/subject.model';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

const schoolId = new Types.ObjectId().toString();
const branchId = new Types.ObjectId().toString();
const mockUser: AuthUser = {
  userId: new Types.ObjectId().toString(),
  username: 'super_admin',
  email: 'admin@snp.edu.kh',
  schoolId,
  roles: ['super_admin'],
  permissions: ['*'],
  branchAccess: 'all',
};

describe('Class Schedule & Conflict Detection Architecture', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('creates full-time class schedule across morning and afternoon without conflict', async () => {
    const classId = new Types.ObjectId().toString();
    const teacherId = new Types.ObjectId().toString();
    const classroomId = new Types.ObjectId().toString();

    vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(classId),
      branchId: new Types.ObjectId(branchId),
      academicYearId: new Types.ObjectId(),
      isDeleted: false,
    } as never);
    vi.spyOn(EmployeeModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(teacherId),
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(branchId),
      status: 'active',
      isDeleted: false,
    } as never);
    vi.spyOn(ClassroomModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(classroomId),
      branchId: new Types.ObjectId(branchId),
      isDeleted: false,
    } as never);
    vi.spyOn(SubjectModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(),
      isDeleted: false,
    } as never);

    const repository = {
      findActiveOverlaps: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation(async (dto) => ({
        _id: new Types.ObjectId(),
        ...dto,
        toObject: () => dto,
      })),
      findById: vi.fn().mockImplementation(async (id) => ({ _id: id })),
    };

    const service = new ClassScheduleService(repository as never);

    // 1. Morning Slot
    const morningSchedule = await service.createSchedule(
      {
        classId,
        branchId,
        dayOfWeek: 1, // Monday
        startTime: '07:30',
        endTime: '10:20',
        sessionType: 'morning',
        teacherId,
        classroomId,
      },
      mockUser,
    );
    expect(morningSchedule).toBeDefined();

    // 2. Afternoon Slot
    const afternoonSchedule = await service.createSchedule(
      {
        classId,
        branchId,
        dayOfWeek: 1, // Monday
        startTime: '13:00',
        endTime: '16:00',
        sessionType: 'afternoon',
        teacherId,
        classroomId,
      },
      mockUser,
    );
    expect(afternoonSchedule).toBeDefined();
  });

  it('rejects overlapping schedule for the same teacher (Teacher Conflict)', async () => {
    const classId = new Types.ObjectId().toString();
    const teacherId = new Types.ObjectId().toString();

    vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(classId),
      branchId: new Types.ObjectId(branchId),
      academicYearId: new Types.ObjectId(),
      isDeleted: false,
    } as never);
    vi.spyOn(EmployeeModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(teacherId),
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(branchId),
      status: 'active',
      isDeleted: false,
    } as never);

    const repository = {
      findActiveOverlaps: vi.fn().mockResolvedValue([
        {
          _id: new Types.ObjectId(),
          dayOfWeek: 1,
          startTime: '17:00',
          endTime: '18:00',
          teacherId: { _id: new Types.ObjectId(teacherId), firstName: 'Dara', lastName: 'Chan' },
        },
      ]),
    };

    const service = new ClassScheduleService(repository as never);

    await expect(
      service.createSchedule(
        {
          classId,
          branchId,
          dayOfWeek: 1,
          startTime: '17:30',
          endTime: '18:30',
          teacherId,
        },
        mockUser,
      ),
    ).rejects.toThrow('Dara Chan is already scheduled on day 1 from 17:00 to 18:00');
  });

  it('rejects overlapping schedule for the same classroom (Classroom Conflict)', async () => {
    const classId = new Types.ObjectId().toString();
    const classroomId = new Types.ObjectId().toString();

    vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(classId),
      branchId: new Types.ObjectId(branchId),
      academicYearId: new Types.ObjectId(),
      isDeleted: false,
    } as never);
    vi.spyOn(ClassroomModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(classroomId),
      branchId: new Types.ObjectId(branchId),
      isDeleted: false,
    } as never);

    const repository = {
      findActiveOverlaps: vi.fn().mockResolvedValue([
        {
          _id: new Types.ObjectId(),
          dayOfWeek: 2,
          startTime: '13:00',
          endTime: '16:00',
          classroomId: { _id: new Types.ObjectId(classroomId), name: 'Room 101' },
        },
      ]),
    };

    const service = new ClassScheduleService(repository as never);

    await expect(
      service.createSchedule(
        {
          classId,
          branchId,
          dayOfWeek: 2,
          startTime: '14:00',
          endTime: '15:00',
          classroomId,
        },
        mockUser,
      ),
    ).rejects.toThrow('Classroom Room 101 is already booked on day 2 from 13:00 to 16:00');
  });

  it('detects student parallel multi-program schedule conflicts', async () => {
    const studentId = new Types.ObjectId().toString();
    const classAId = new Types.ObjectId();
    const classBId = new Types.ObjectId();

    vi.spyOn(StudentModel, 'findOne').mockReturnValue({
      select: vi.fn().mockResolvedValue({ branchId: new Types.ObjectId(branchId) }),
    } as never);
    vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
      select: vi.fn().mockResolvedValue([{ classId: classAId }, { classId: classBId }]),
    } as never);

    const repository = {
      findWithFilters: vi.fn().mockResolvedValue({
        data: [
          {
            _id: new Types.ObjectId(),
            classId: classAId,
            dayOfWeek: 1,
            startTime: '17:00',
            endTime: '18:00',
          },
          {
            _id: new Types.ObjectId(),
            classId: classBId,
            dayOfWeek: 1,
            startTime: '17:30',
            endTime: '18:30',
          },
        ],
        total: 2,
      }),
    };

    const service = new ClassScheduleService(repository as never);
    const result = await service.checkStudentConflicts(studentId, mockUser);

    expect(result.hasConflict).toBe(true);
    expect(result.conflicts[0].type).toBe('STUDENT_CONFLICT');
  });

  it('rejects a schedule branch that disagrees with the selected class', async () => {
    const classId = new Types.ObjectId().toString();
    vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(classId),
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(branchId),
      academicYearId: new Types.ObjectId(),
      isDeleted: false,
    } as never);
    const service = new ClassScheduleService({} as never);

    await expect(
      service.createSchedule(
        {
          classId,
          branchId: new Types.ObjectId().toString(),
          dayOfWeek: 1,
          startTime: '08:00',
          endTime: '09:00',
        },
        mockUser,
      ),
    ).rejects.toThrow('must match');
  });
});
