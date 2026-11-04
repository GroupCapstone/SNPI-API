export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ScoreItemDto {
  studentId: string;
  scoreObtained: number;
  isAbsent?: boolean;
  remarks?: string;
}

export interface BatchScoreEntryDto {
  assessmentId: string;
  scores: ScoreItemDto[];
  reason?: string;
  correctionRequestId?: string;
}

export interface ScoreQueryFilters {
  authorizedClassIds?: string[];
  authorizedSubjectIds?: string[];
  assessmentId?: string;
  classId?: string;
  subjectId?: string;
  studentId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  branchId?: string;
  schoolId?: string;
  page?: number;
  limit?: number;
}

export const calculateGrade = (
  score: number,
  maxScore: number,
): { percentage: number; letterGrade: LetterGrade } => {
  if (maxScore <= 0) return { percentage: 0, letterGrade: 'F' };
  const percentage = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100 * 100) / 100));
  if (percentage >= 90) return { percentage, letterGrade: 'A' };
  if (percentage >= 80) return { percentage, letterGrade: 'B' };
  if (percentage >= 70) return { percentage, letterGrade: 'C' };
  if (percentage >= 60) return { percentage, letterGrade: 'D' };
  if (percentage >= 50) return { percentage, letterGrade: 'E' };
  return { percentage, letterGrade: 'F' };
};
