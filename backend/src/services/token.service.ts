import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { Session, ISession } from '../models/Session';
import { ApiError } from '../utils/ApiError';

export interface AccessPayload {
  sub: string;
  role: 'user' | 'admin' | 'superadmin';
  type: 'access';
}

export function signAccessToken(subjectId: string, role: AccessPayload['role']): string {
  const payload: AccessPayload = { sub: subjectId, role, type: 'access' };
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
    algorithm: 'HS256',
  } as SignOptions);
}

export function verifyAccessToken(token: string): AccessPayload {
  const decoded = jwt.verify(token, env.jwt.accessSecret, {
    algorithms: ['HS256'],
  }) as AccessPayload;
  if (decoded.type !== 'access') {
    throw ApiError.unauthorized('Invalid token type');
  }
  return decoded;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function refreshExpiryDate(): Date {
  const days = parseInt(env.jwt.refreshExpires, 10) || 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function issueRefreshToken(
  subjectId: string,
  subjectType: 'User' | 'Admin',
  meta: { userAgent?: string; ip?: string },
  family?: string,
): Promise<string> {
  const raw = crypto.randomBytes(48).toString('hex');
  await Session.create({
    subjectId,
    subjectType,
    refreshTokenHash: hashToken(raw),
    family: family ?? crypto.randomUUID(),
    userAgent: meta.userAgent,
    ip: meta.ip,
    expiresAt: refreshExpiryDate(),
  });
  return raw;
}

/**
 * Rotate a refresh token. Reuse of an already-rotated token revokes the whole
 * session family (stolen-token detection).
 */
export async function rotateRefreshToken(
  rawToken: string,
  meta: { userAgent?: string; ip?: string },
): Promise<{ session: ISession; newToken: string }> {
  const session = await Session.findOne({ refreshTokenHash: hashToken(rawToken) });
  if (!session || session.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token is invalid or expired');
  }
  if (session.revokedAt) {
    await Session.updateMany(
      { family: session.family },
      { $set: { revokedAt: new Date() } },
    );
    throw ApiError.unauthorized('Refresh token reuse detected — all sessions revoked');
  }

  session.revokedAt = new Date();
  await session.save();

  const newToken = await issueRefreshToken(
    String(session.subjectId),
    session.subjectType,
    meta,
    session.family,
  );
  return { session, newToken };
}

export async function revokeAllSessions(subjectId: string): Promise<void> {
  await Session.updateMany(
    { subjectId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}
