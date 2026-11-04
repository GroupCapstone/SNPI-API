import type { Response } from 'express';
import type { PaginationMeta, SuccessResponse, PaginatedResponse } from '../../contracts';

export type { PaginationMeta, SuccessResponse, PaginatedResponse };
export { buildPaginationMeta, parsePagination } from '../utils/pagination';

export const sendSuccess = <T>(
  response: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200,
): Response<SuccessResponse<T>> => {
  if (statusCode === 201 && !response.getHeader('Location')) {
    const resourceId =
      data && typeof data === 'object' && ('_id' in data || 'id' in data)
        ? String(
            (data as { id?: unknown; _id?: unknown }).id ||
              (data as { id?: unknown; _id?: unknown })._id,
          )
        : undefined;
    if (resourceId && response.req) {
      const basePath = response.req.baseUrl || response.req.originalUrl?.split('?')[0];
      if (basePath) {
        response.setHeader('Location', `${basePath}/${resourceId}`);
      }
    }
  }
  return response.status(statusCode).json({ success: true, message, data });
};

export const sendCreated = <T>(
  response: Response,
  data: T,
  locationOrMessage?: string,
  message = 'Resource created successfully',
): Response<SuccessResponse<T>> => {
  let resolvedMessage = message;
  if (locationOrMessage) {
    if (locationOrMessage.startsWith('/') || locationOrMessage.startsWith('http')) {
      response.setHeader('Location', locationOrMessage);
    } else {
      resolvedMessage = locationOrMessage;
    }
  }
  if (!response.getHeader('Location')) {
    const resourceId =
      data && typeof data === 'object' && ('_id' in data || 'id' in data)
        ? String(
            (data as { id?: unknown; _id?: unknown }).id ||
              (data as { id?: unknown; _id?: unknown })._id,
          )
        : undefined;
    if (resourceId && response.req) {
      const basePath = response.req.baseUrl || response.req.originalUrl?.split('?')[0];
      if (basePath) {
        response.setHeader('Location', `${basePath}/${resourceId}`);
      }
    }
  }
  return response.status(201).json({ success: true, message: resolvedMessage, data });
};

export const sendAccepted = <T>(
  response: Response,
  data: T,
  message = 'Request accepted for processing',
): Response<SuccessResponse<T>> => response.status(202).json({ success: true, message, data });

export const sendNoContent = (response: Response): Response => response.status(204).end();

export const sendPaginated = <T>(
  response: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Operation successful',
): Response<PaginatedResponse<T>> => {
  const resolvedPagination: PaginationMeta = {
    ...pagination,
    hasMore: pagination.hasMore ?? pagination.page < pagination.totalPages,
  };

  return response.status(200).json({
    success: true,
    message,
    data,
    pagination: resolvedPagination,
    meta: resolvedPagination,
  });
};
