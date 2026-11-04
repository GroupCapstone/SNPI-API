import type { Response } from 'express';
import type { PaginationMeta, SuccessResponse, PaginatedResponse } from '../../contracts';

export type { PaginationMeta, SuccessResponse, PaginatedResponse };

export const sendSuccess = <T>(
  response: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200,
): Response<SuccessResponse<T>> =>
  response.status(statusCode).json({ success: true, message, data });

export const sendPaginated = <T>(
  response: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Operation successful',
): Response<PaginatedResponse<T>> =>
  response.status(200).json({ success: true, message, data, pagination });
