import { describe, expect, it } from 'vitest';

import { createAssessmentSchema } from '../src/modules/assessment/assessment.validation';
import { batchScoreEntrySchema } from '../src/modules/score/score.validation';

const id = '507f1f77bcf86cd799439011';

const assessment = {
  schoolId: id,
  branchId: id,
  academicYearId: id,
  classId: id,
  subjectId: id,
  name: 'Monthly test',
  code: 'MT-01',
  type: 'monthly_test' as const,
  maxScore: 100,
  passingScore: 50,
  weightPercentage: 50,
  assessmentDate: '2026-03-15',
};

describe('academic hardening validation', () => {
  it('rejects an assessment passing score above its maximum', () => {
    const result = createAssessmentSchema.safeParse({
      body: { ...assessment, passingScore: 101 },
      params: {},
      query: {},
    });
    expect(result.success).toBe(false);
  });

  it('defaults a new assessment to draft status', () => {
    const result = createAssessmentSchema.parse({ body: assessment, params: {}, query: {} });
    expect(result.body.status).toBe('draft');
  });

  it('rejects an invalid assessment identifier', () => {
    const result = createAssessmentSchema.safeParse({
      body: { ...assessment, classId: 'not-an-object-id' },
      params: {},
      query: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate students in a score batch', () => {
    const result = batchScoreEntrySchema.safeParse({
      body: {
        assessmentId: id,
        scores: [
          { studentId: id, scoreObtained: 80 },
          { studentId: id, scoreObtained: 70 },
        ],
      },
      params: {},
      query: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-zero score for an absent student', () => {
    const result = batchScoreEntrySchema.safeParse({
      body: {
        assessmentId: id,
        scores: [{ studentId: id, scoreObtained: 1, isAbsent: true }],
      },
      params: {},
      query: {},
    });
    expect(result.success).toBe(false);
  });

  it('accepts a zero score for an absent student', () => {
    const result = batchScoreEntrySchema.safeParse({
      body: {
        assessmentId: id,
        scores: [{ studentId: id, scoreObtained: 0, isAbsent: true }],
      },
      params: {},
      query: {},
    });
    expect(result.success).toBe(true);
  });
});
