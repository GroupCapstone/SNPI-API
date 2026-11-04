import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { publicVerificationRateLimiter } from '../../middleware/security';
import { validate } from '../../middleware/validate';
import { ReportController } from './report.controller';
import {
  monthlyReportQueryValidationSchema,
  certificateVerificationValidationSchema,
  reportQueryValidationSchema,
  reportResourceValidationSchema,
} from './report.validation';

export const reportRouter = Router();
const controller = new ReportController();

reportRouter.get(
  '/certificates/verify/:code',
  publicVerificationRateLimiter,
  validate(certificateVerificationValidationSchema),
  controller.verifyCertificate,
);

const reportCenterPermissions = [
  'report.view.own_branch',
  'report.view.all_branches',
  'report.student.view.own_branch',
  'report.student.view.all_branches',
  'report.academic.view.own_branch',
  'report.academic.view.all_branches',
  'report.finance.view.own_branch',
  'report.finance.view.all_branches',
] as const;

reportRouter.use(authenticate, requireAuth);
reportRouter.get('/catalog', authorize(...reportCenterPermissions), controller.catalog);
reportRouter.get(
  '/documents',
  authorize(...reportCenterPermissions),
  validate(reportQueryValidationSchema),
  controller.documents,
);
reportRouter.get(
  '/monthly-overview',
  authorize(...reportCenterPermissions),
  validate(monthlyReportQueryValidationSchema),
  controller.monthlyOverview,
);

reportRouter.get(
  '/report-cards/:id',
  authorize(
    'report_card.view.assigned_class',
    'report_card.view.own_branch',
    'report_card.view.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.reportCard,
);
reportRouter.post(
  '/report-cards/:id/generate',
  authorize(
    'report_card.generate.assigned_class',
    'report_card.generate.own_branch',
    'report_card.generate.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.generateReportCard,
);
reportRouter.get(
  '/report-cards/:id/pdf',
  authorize(
    'report_card.generate.assigned_class',
    'report_card.generate.own_branch',
    'report_card.generate.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.reportCardPdf,
);

reportRouter.get(
  '/transcripts/:id',
  authorize('transcript.view.own_branch', 'transcript.view.all_branches'),
  validate(reportResourceValidationSchema),
  controller.transcript,
);

reportRouter.get(
  '/certificates/:id',
  authorize('report_card.view.own_branch', 'report_card.view.all_branches'),
  validate(reportResourceValidationSchema),
  controller.certificate,
);
reportRouter.post(
  '/certificates/:id/generate',
  authorize('report_card.generate.own_branch', 'report_card.generate.all_branches'),
  validate(reportResourceValidationSchema),
  controller.generateCertificate,
);
reportRouter.get(
  '/certificates/:id/pdf',
  authorize('report_card.generate.own_branch', 'report_card.generate.all_branches'),
  validate(reportResourceValidationSchema),
  controller.certificatePdf,
);
reportRouter.post(
  '/transcripts/:id/generate',
  authorize('transcript.generate.own_branch', 'transcript.generate.all_branches'),
  validate(reportResourceValidationSchema),
  controller.generateTranscript,
);
reportRouter.get(
  '/transcripts/:id/pdf',
  authorize('transcript.generate.own_branch', 'transcript.generate.all_branches'),
  validate(reportResourceValidationSchema),
  controller.transcriptPdf,
);

reportRouter.get(
  '/receipts/:id',
  authorize(
    'receipt.print.own_branch',
    'receipt.print.all_branches',
    'finance.receipt.print.own_branch',
    'finance.receipt.print.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.receipt,
);
reportRouter.get(
  '/receipts/:id/pdf',
  authorize(
    'receipt.print.own_branch',
    'receipt.print.all_branches',
    'finance.receipt.print.own_branch',
    'finance.receipt.print.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.receiptPdf,
);
reportRouter.get(
  '/invoices/:id',
  authorize(
    'invoice.print.own_branch',
    'invoice.print.all_branches',
    'finance.receipt.print.own_branch',
    'finance.receipt.print.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.invoice,
);
reportRouter.get(
  '/invoices/:id/pdf',
  authorize(
    'invoice.print.own_branch',
    'invoice.print.all_branches',
    'finance.receipt.print.own_branch',
    'finance.receipt.print.all_branches',
  ),
  validate(reportResourceValidationSchema),
  controller.invoicePdf,
);
