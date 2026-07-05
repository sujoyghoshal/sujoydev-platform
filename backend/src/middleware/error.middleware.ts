import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ [e.path]: e.message }));
    error = ApiError.badRequest('Validation failed', errors);
  } else if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid value for ${err.path}`);
  } else if ((err as { code?: number }).code === 11000) {
    error = ApiError.conflict('Duplicate value for a unique field');
  } else if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  } else if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  } else {
    error = ApiError.internal(env.isProd ? 'Internal server error' : err.message);
  }

  if (!error.isOperational) {
    logger.error(err.message, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors ? { errors: error.errors } : {}),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}
