/**
 * Backfills tenant ownership for legacy records and reconciles tenant-aware
 * indexes. Dry-run is the default; pass --apply during a maintenance window.
 */
/* eslint-disable no-console */
import mongoose from 'mongoose';

import { AcademicPeriodModel } from '../modules/academic-period/academic-period.model';
import { AssessmentModel } from '../modules/assessment/assessment.model';
import { BranchModel } from '../modules/branch/branch.model';
import { ClassModel } from '../modules/class/class.model';
import { ClassScheduleModel } from '../modules/class-schedule/class-schedule.model';
import { ClassroomModel } from '../modules/classroom/classroom.model';
import { CurriculumModel } from '../modules/curriculum/curriculum.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { IntakeModel } from '../modules/intake/intake.model';
import { ProgramModel } from '../modules/program/program.model';
import { ScoreModel } from '../modules/score/score.model';
import { SubjectModel } from '../modules/subject/subject.model';
import { TermResultModel } from '../modules/term-result/term-result.model';
import { TimeSlotModel } from '../modules/time-slot/time-slot.model';

type LegacyDocument = {
  _id: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  academicYearId?: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  classId?: mongoose.Types.ObjectId;
  enrollmentId?: mongoose.Types.ObjectId;
  assessmentId?: mongoose.Types.ObjectId;
};

const migrationId = '2026-09-v1.2-tenant-scope';
const applyChanges = process.argv.includes('--apply');

const legacyModel = (model: unknown) => model as mongoose.Model<LegacyDocument>;

const backfill = async (
  name: string,
  model: mongoose.Model<LegacyDocument>,
  resolveSchoolId: (document: LegacyDocument) => Promise<mongoose.Types.ObjectId | undefined>,
) => {
  const candidates = await model.find({ isDeleted: false, schoolId: { $exists: false } }).lean();
  let updated = 0;
  let unresolved = 0;
  for (const document of candidates) {
    const schoolId = await resolveSchoolId(document);
    if (!schoolId) {
      unresolved++;
      continue;
    }
    updated++;
    if (applyChanges) await model.updateOne({ _id: document._id }, { $set: { schoolId } });
  }
  return { name, candidates: candidates.length, updated, unresolved };
};

const run = async () => {
  const branchSchool = async (document: LegacyDocument) => {
    if (!document.branchId) return undefined;
    const branch = await BranchModel.findOne({ _id: document.branchId, isDeleted: false })
      .select('schoolId')
      .lean();
    return branch?.schoolId;
  };
  const classSchool = async (document: LegacyDocument) => {
    if (!document.classId) return undefined;
    const item = await ClassModel.findOne({ _id: document.classId, isDeleted: false })
      .select('schoolId')
      .lean();
    return item?.schoolId;
  };
  const assessmentSchool = async (document: LegacyDocument) => {
    if (!document.assessmentId) return undefined;
    const item = await AssessmentModel.findOne({ _id: document.assessmentId, isDeleted: false })
      .select('schoolId')
      .lean();
    return item?.schoolId;
  };
  const enrollmentSchool = async (document: LegacyDocument) => {
    if (!document.enrollmentId) return undefined;
    const item = await EnrollmentModel.findOne({ _id: document.enrollmentId, isDeleted: false })
      .select('schoolId')
      .lean();
    return item?.schoolId;
  };
  const academicYearSchool = async (document: LegacyDocument) => {
    if (!document.academicYearId) return undefined;
    const item = await mongoose.connection.db
      ?.collection('academicyears')
      .findOne({ _id: document.academicYearId }, { projection: { schoolId: 1 } });
    return item?.schoolId as mongoose.Types.ObjectId | undefined;
  };
  const results = [
    await backfill('classes', legacyModel(ClassModel), branchSchool),
    await backfill('class_schedules', legacyModel(ClassScheduleModel), branchSchool),
    await backfill('classrooms', legacyModel(ClassroomModel), branchSchool),
    await backfill('subjects', legacyModel(SubjectModel), branchSchool),
    await backfill('time_slots', legacyModel(TimeSlotModel), branchSchool),
    await backfill('programs', legacyModel(ProgramModel), branchSchool),
    await backfill('intakes', legacyModel(IntakeModel), branchSchool),
    await backfill('enrollments', legacyModel(EnrollmentModel), branchSchool),
    await backfill('academic_periods', legacyModel(AcademicPeriodModel), academicYearSchool),
    await backfill('curricula', legacyModel(CurriculumModel), branchSchool),
    await backfill('assessments', legacyModel(AssessmentModel), classSchool),
    await backfill('scores', legacyModel(ScoreModel), assessmentSchool),
    await backfill('term_results', legacyModel(TermResultModel), enrollmentSchool),
  ];

  if (applyChanges) {
    for (const model of [ProgramModel, SubjectModel, CurriculumModel, TimeSlotModel]) {
      await model.syncIndexes();
    }
  }
  console.log(JSON.stringify({ migrationId, dryRun: !applyChanges, results }, null, 2));
  if (results.some((item) => item.unresolved > 0)) process.exitCode = 2;
};

if (require.main === module) {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snp_sms';
  mongoose
    .connect(mongoUri)
    .then(run)
    .then(() => mongoose.disconnect())
    .catch(async (error: unknown) => {
      console.error('Tenant scope migration failed:', error);
      await mongoose.disconnect();
      process.exitCode = 1;
    });
}

export { run as runTenantScopeMigration };
