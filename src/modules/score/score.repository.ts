import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import type { IScore } from './score.model';
import { ScoreModel } from './score.model';
import type { BatchScoreEntryDto, ScoreQueryFilters } from './score.types';
import { calculateGrade } from './score.types';

export class ScoreRepository {
  public async findWithFilters(
    filters: ScoreQueryFilters,
    branchFilter?: string[],
  ): Promise<{ data: IScore[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.authorizedClassIds) {
      query.classId = {
        $in: filters.authorizedClassIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }
    if (filters.authorizedSubjectIds) {
      query.subjectId = {
        $in: filters.authorizedSubjectIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.assessmentId && Types.ObjectId.isValid(filters.assessmentId)) {
      query.assessmentId = new Types.ObjectId(filters.assessmentId);
    }

    if (filters.classId && Types.ObjectId.isValid(filters.classId)) {
      query.classId = new Types.ObjectId(filters.classId);
    }

    if (filters.subjectId && Types.ObjectId.isValid(filters.subjectId)) {
      query.subjectId = new Types.ObjectId(filters.subjectId);
    }

    if (filters.studentId && Types.ObjectId.isValid(filters.studentId)) {
      query.studentId = new Types.ObjectId(filters.studentId);
    }
    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    } else if (branchFilter) {
      query.branchId = { $in: branchFilter.map((b) => new Types.ObjectId(b)) };
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ScoreModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName gender')
        .populate('assessmentId', 'name code type maxScore passingScore')
        .populate('classId', 'className classCode')
        .populate('subjectId', 'nameEn nameKh code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ScoreModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async batchUpsertScores(
    assessmentMeta: {
      assessmentId: string;
      schoolId: string;
      branchId: string;
      academicYearId: string;
      academicPeriodId?: string;
      classId: string;
      subjectId: string;
      maxScore: number;
      enrollmentByStudentId: Map<string, string>;
    },
    dto: BatchScoreEntryDto,
    userId?: string,
    session?: ClientSession,
  ): Promise<IScore[]> {
    const operations = dto.scores.map((scoreItem) => {
      const normalizedScore = scoreItem.isAbsent ? 0 : scoreItem.scoreObtained;
      const { percentage, letterGrade } = calculateGrade(normalizedScore, assessmentMeta.maxScore);

      const filter = {
        assessmentId: new Types.ObjectId(dto.assessmentId),
        studentId: new Types.ObjectId(scoreItem.studentId),
      };

      const update = {
        $set: {
          schoolId: new Types.ObjectId(assessmentMeta.schoolId),
          branchId: new Types.ObjectId(assessmentMeta.branchId),
          academicYearId: new Types.ObjectId(assessmentMeta.academicYearId),
          academicPeriodId: assessmentMeta.academicPeriodId
            ? new Types.ObjectId(assessmentMeta.academicPeriodId)
            : undefined,
          classId: new Types.ObjectId(assessmentMeta.classId),
          subjectId: new Types.ObjectId(assessmentMeta.subjectId),
          enrollmentId:
            assessmentMeta.enrollmentByStudentId.get(scoreItem.studentId) &&
            Types.ObjectId.isValid(assessmentMeta.enrollmentByStudentId.get(scoreItem.studentId)!)
              ? new Types.ObjectId(assessmentMeta.enrollmentByStudentId.get(scoreItem.studentId)!)
              : undefined,
          scoreObtained: normalizedScore,
          percentage,
          letterGrade,
          isAbsent: Boolean(scoreItem.isAbsent),
          remarks: scoreItem.remarks ?? '',
          isDeleted: false,
          ...(userId && Types.ObjectId.isValid(userId)
            ? { updatedBy: new Types.ObjectId(userId) }
            : {}),
        },
        $setOnInsert: {
          ...(userId && Types.ObjectId.isValid(userId)
            ? { createdBy: new Types.ObjectId(userId) }
            : {}),
        },
      };

      return {
        updateOne: {
          filter,
          update,
          upsert: true,
        },
      };
    });

    if (operations.length > 0) {
      await ScoreModel.bulkWrite(operations, session ? { session } : undefined);
    }

    const query = ScoreModel.find({
      assessmentId: new Types.ObjectId(dto.assessmentId),
      isDeleted: false,
    }).populate('studentId', 'studentId firstName lastName khmerName gender');
    if (session) query.session(session);
    return query.exec();
  }
}
