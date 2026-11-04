import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createStudentTransferBodySchema = z
  .object({
    transferNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^TRF-\d{6}$/, 'Transfer number must follow format TRF-XXXXXX')
      .optional(),
    transferType: z.enum(['BRANCH', 'CLASS', 'PROGRAM', 'LEVEL']).default('BRANCH'),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID'),
    fromSchoolId: z.string().regex(objectIdRegex, 'Invalid Source School ID'),
    toSchoolId: z.string().regex(objectIdRegex, 'Invalid Destination School ID'),
    fromBranchId: z.string().regex(objectIdRegex, 'Invalid Source Branch ID'),
    toBranchId: z.string().regex(objectIdRegex, 'Invalid Destination Branch ID'),
    fromProgramId: z.string().regex(objectIdRegex, 'Invalid Source Program ID').optional(),
    toProgramId: z.string().regex(objectIdRegex, 'Invalid Destination Program ID').optional(),
    fromLevelId: z.string().regex(objectIdRegex, 'Invalid Source Level ID').optional(),
    toLevelId: z.string().regex(objectIdRegex, 'Invalid Destination Level ID').optional(),
    fromClassId: z
      .string()
      .regex(objectIdRegex, 'Invalid Source Class ID')
      .optional()
      .or(z.literal('')),
    toClassId: z
      .string()
      .regex(objectIdRegex, 'Invalid Destination Class ID')
      .optional()
      .or(z.literal('')),
    transferDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid transfer date')
      .optional(),
    effectiveDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid effective date')
      .optional(),
    reason: z.string().trim().min(3, 'Transfer reason is required').max(500),
    remarks: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.transferType === 'BRANCH') {
        return data.fromBranchId !== data.toBranchId;
      }
      if (data.transferType === 'CLASS' && data.fromClassId && data.toClassId) {
        return data.fromClassId !== data.toClassId;
      }
      return true;
    },
    {
      message: 'Source and destination must differ for the selected transfer type',
      path: ['toBranchId'],
    },
  );

export const createStudentTransferValidationSchema = z.object({
  body: createStudentTransferBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const processTransferBodySchema = z.object({
  status: z.enum(['approved', 'rejected', 'completed', 'cancelled']),
  toClassId: z
    .string()
    .regex(objectIdRegex, 'Invalid Destination Class ID')
    .optional()
    .or(z.literal('')),
  remarks: z.string().trim().max(500).optional(),
});

export const processTransferValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Student Transfer ID'),
  }),
  body: processTransferBodySchema,
  query: z.object({}).passthrough(),
});

export const studentTransferQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID').optional().or(z.literal('')),
    fromBranchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Source Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    toBranchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Destination Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    status: z
      .enum(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
      .optional()
      .or(z.literal('')),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export type CreateStudentTransferInput = z.infer<typeof createStudentTransferBodySchema>;
export type ProcessTransferInput = z.infer<typeof processTransferBodySchema>;
