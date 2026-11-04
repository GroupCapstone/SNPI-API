import type { PaginationMeta } from '../../contracts';

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  maxLimit?: number;
  defaultLimit?: number;
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

export const parsePagination = (options?: PaginationOptions): ParsedPagination => {
  const defaultLimit = options?.defaultLimit ?? 20;
  const maxLimit = options?.maxLimit ?? 100;

  const rawPage = Number(options?.page);
  const rawLimit = Number(options?.limit);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => {
  const safeTotal = Math.max(0, total);
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.ceil(safeTotal / safeLimit) || 1;
  const safePage = Math.max(1, page);

  return {
    page: safePage,
    limit: safeLimit,
    total: safeTotal,
    totalPages,
    hasMore: safePage < totalPages,
    nextCursor:
      safePage < totalPages ? Buffer.from(`page:${safePage + 1}`).toString('base64') : null,
  };
};
