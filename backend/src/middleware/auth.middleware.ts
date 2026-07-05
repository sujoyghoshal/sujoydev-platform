import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AccessPayload } from '../services/token.service';
import { ApiError } from '../utils/ApiError';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AccessPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7);
  }
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.accessToken;
  return cookieToken ?? null;
}

/** Requires a valid access token. */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return next(ApiError.unauthorized());
  }
  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

/** Attaches auth if a token is present, but never rejects. */
export function authenticateOptional(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.auth = verifyAccessToken(token);
    } catch {
      // Anonymous access is allowed on these routes.
    }
  }
  next();
}

/** Requires one of the given roles (use after authenticate). */
export function authorize(...roles: AccessPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.auth.role)) {
      return next(ApiError.forbidden());
    }
    next();
  };
}
