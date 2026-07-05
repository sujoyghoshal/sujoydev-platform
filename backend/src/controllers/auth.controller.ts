import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import { User } from '../models/User';
import { Admin } from '../models/Admin';
import { ApiError } from '../utils/ApiError';
import { ok } from '../utils/ApiResponse';
import {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeAllSessions,
} from '../services/token.service';

const googleClient = new OAuth2Client(env.googleWebClientId);

const REFRESH_COOKIE = 'refreshToken';
const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: 'strict' as const,
  path: `${env.apiPrefix}/auth`,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function clientMeta(req: Request) {
  return { userAgent: req.headers['user-agent'], ip: req.ip };
}

/** POST /auth/google — mobile Google Sign-In (ID token exchange). */
export async function googleLogin(req: Request, res: Response) {
  const { idToken, fcmToken } = req.body as { idToken?: string; fcmToken?: string };
  if (!idToken) {
    throw ApiError.badRequest('idToken is required');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleWebClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw ApiError.unauthorized('Google token could not be verified');
  }

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      $set: {
        name: payload.name ?? payload.email.split('@')[0],
        photoUrl: payload.picture,
        provider: 'google',
        googleId: payload.sub,
        lastLoginAt: new Date(),
      },
      ...(fcmToken ? { $addToSet: { fcmTokens: fcmToken } } : {}),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  if (user.isBanned || user.isDeleted) {
    throw ApiError.forbidden('This account is disabled');
  }

  const accessToken = signAccessToken(String(user._id), 'user');
  const refreshToken = await issueRefreshToken(String(user._id), 'User', clientMeta(req));

  return ok(res, {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      phone: user.phone,
    },
  }, 'Signed in with Google');
}

/** POST /auth/admin/login — admin dashboard email/password login. */
export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const accessToken = signAccessToken(String(admin._id), admin.role);
  const refreshToken = await issueRefreshToken(String(admin._id), 'Admin', clientMeta(req));

  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
  return ok(res, {
    accessToken,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  }, 'Signed in');
}

/** POST /auth/refresh — rotate refresh token (body for mobile, cookie for web). */
export async function refresh(req: Request, res: Response) {
  const raw =
    (req.body as { refreshToken?: string }).refreshToken ??
    (req.cookies as Record<string, string>)[REFRESH_COOKIE];
  if (!raw) {
    throw ApiError.unauthorized('Refresh token missing');
  }

  const { session, newToken } = await rotateRefreshToken(raw, clientMeta(req));

  let role: 'user' | 'admin' | 'superadmin' = 'user';
  if (session.subjectType === 'Admin') {
    const admin = await Admin.findById(session.subjectId);
    if (!admin || !admin.isActive) {
      throw ApiError.unauthorized('Account is no longer active');
    }
    role = admin.role;
    res.cookie(REFRESH_COOKIE, newToken, refreshCookieOptions);
  }

  const accessToken = signAccessToken(String(session.subjectId), role);
  return ok(res, { accessToken, refreshToken: newToken }, 'Token refreshed');
}

/** POST /auth/logout — revoke all sessions for the authenticated subject. */
export async function logout(req: Request, res: Response) {
  if (req.auth) {
    await revokeAllSessions(req.auth.sub);
  }
  res.clearCookie(REFRESH_COOKIE, { path: refreshCookieOptions.path });
  return ok(res, null, 'Signed out');
}
