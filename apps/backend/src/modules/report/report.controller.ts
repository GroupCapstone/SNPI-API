import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ReportService } from './report.service';
import type { MonthlyReportQuery, ReportQueryFilters } from './report.types';

import type { monthlyReportQueryValidationSchema } from './report.validation';

export class ReportController {
  public constructor(private readonly service = new ReportService()) {}

  public catalog = (req: AuthenticatedRequest, res: Response): void => {
    sendSuccess(
      res,
      this.service.getCatalog(req.user),
      'Report Center catalog retrieved successfully',
    );
  };

  public documents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getDocuments(
        getValidatedInput<{ query: ReportQueryFilters }>(res).query,
        req.user!,
      );
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Official documents retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public monthlyOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getMonthlyOverview(
        getValidatedInput<z.infer<typeof monthlyReportQueryValidationSchema>>(res)
          .query as unknown as MonthlyReportQuery,
        req.user!,
      );
      sendSuccess(res, result, 'Monthly management overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public reportCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getReportCardPreview(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Report card preview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public generateReportCard = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.service.generateReportCard(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Official report card generated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public reportCardPdf = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const document = await this.service.generateReportCard(String(req.params.id), req.user!);
      const pdf = await this.service.renderPdf(document, req.user!);
      this.sendPdf(res, pdf, document.documentNumber);
    } catch (error) {
      next(error);
    }
  };

  public transcript = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getTranscriptPreview(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Transcript preview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public certificate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getCertificatePreview(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Certificate preview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public generateCertificate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.service.generateCertificate(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Official certificate generated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public certificatePdf = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const document = await this.service.generateCertificate(String(req.params.id), req.user!);
      const pdf = await this.service.renderPdf(document, req.user!);
      this.sendPdf(res, pdf, document.documentNumber);
    } catch (error) {
      next(error);
    }
  };

  public verifyCertificate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Check if caller is an authorized internal backend service (Fabric Operator / System Admin)
      const serviceToken = req.headers['x-service-token'];
      const isInternalService =
        (typeof serviceToken === 'string' &&
          serviceToken.length > 0 &&
          serviceToken === process.env.INTERNAL_SERVICE_TOKEN) ||
        Boolean(req.user?.roles?.includes('SUPER_ADMIN'));

      const result = isInternalService
        ? await this.service.verifyCertificate(String(req.params.code), true)
        : await this.service.verifyCertificate(String(req.params.code));

      // GitHub-inspired API headers
      res.setHeader('X-Verification-Engine', 'SNP-Fabric-SHA256');
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // Support pretty-printed JSON display (e.g., ?pretty=true)
      if (req.query.pretty === 'true' || req.query.format === 'pretty') {
        const prettyPayload = {
          success: true,
          message: 'Certificate verification completed',
          data: result,
        };
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(200).send(JSON.stringify(prettyPayload, null, 2));
        return;
      }

      sendSuccess(res, result, 'Certificate verification completed');
    } catch (error) {
      next(error);
    }
  };

  public generateTranscript = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.service.generateTranscript(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Official transcript generated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public transcriptPdf = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const document = await this.service.generateTranscript(String(req.params.id), req.user!);
      const pdf = await this.service.renderPdf(document, req.user!);
      this.sendPdf(res, pdf, document.documentNumber);
    } catch (error) {
      next(error);
    }
  };

  public receipt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getReceiptPreview(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Payment receipt preview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public receiptPdf = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const document = await this.service.generateReceipt(String(req.params.id), req.user!);
      const pdf = await this.service.renderPdf(document, req.user!);
      this.sendPdf(res, pdf, document.documentNumber);
    } catch (error) {
      next(error);
    }
  };

  public invoice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getInvoicePreview(String(req.params.id), req.user!);
      sendSuccess(res, result, 'Invoice preview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public invoicePdf = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const document = await this.service.generateInvoice(String(req.params.id), req.user!);
      const pdf = await this.service.renderPdf(document, req.user!);
      this.sendPdf(res, pdf, document.documentNumber);
    } catch (error) {
      next(error);
    }
  };

  private sendPdf(res: Response, pdf: Buffer, documentNumber: string): void {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${documentNumber}.pdf"`);
    res.setHeader('Content-Length', pdf.length);
    res.status(200).send(pdf);
  }
}
