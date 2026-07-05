import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function ok<T>(res: Response, data: T, message = 'Success', meta?: PaginationMeta) {
  return res.status(200).json({ success: true, message, data, ...(meta ? { meta } : {}) });
}

export function created<T>(res: Response, data: T, message = 'Created successfully') {
  return res.status(201).json({ success: true, message, data });
}

export function noContent(res: Response) {
  return res.status(204).send();
}

export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
