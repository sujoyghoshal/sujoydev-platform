import path from 'path';

type NodeEnv = 'development' | 'production' | 'test';

interface EnvConfig {
  nodeEnv: NodeEnv;
  isProd: boolean;
  port: number;
  apiPrefix: string;
  corsOrigins: string[];
  mongodbUri: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpires: string;
    refreshExpires: string;
  };
  googleWebClientId: string;
  cloudinary: { cloudName: string; apiKey: string; apiSecret: string };
  firebaseServiceAccountPath: string;
  smtp: { host: string; port: number; user: string; pass: string; from: string };
  adminBootstrap: { email: string; password: string };
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

const nodeEnv = (optional('NODE_ENV', 'development') as NodeEnv) || 'development';

export const env: EnvConfig = {
  nodeEnv,
  isProd: nodeEnv === 'production',
  port: parseInt(optional('PORT', '5000'), 10),
  apiPrefix: optional('API_PREFIX', '/api/v1'),
  corsOrigins: optional('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  mongodbUri: required('MONGODB_URI'),
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpires: optional('JWT_ACCESS_EXPIRES', '15m'),
    refreshExpires: optional('JWT_REFRESH_EXPIRES', '30d'),
  },
  googleWebClientId: optional('GOOGLE_WEB_CLIENT_ID'),
  cloudinary: {
    cloudName: optional('CLOUDINARY_CLOUD_NAME'),
    apiKey: optional('CLOUDINARY_API_KEY'),
    apiSecret: optional('CLOUDINARY_API_SECRET'),
  },
  firebaseServiceAccountPath: path.resolve(
    optional('FIREBASE_SERVICE_ACCOUNT_PATH', './firebase-service-account.json'),
  ),
  smtp: {
    host: optional('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(optional('SMTP_PORT', '587'), 10),
    user: optional('SMTP_USER'),
    pass: optional('SMTP_PASS'),
    from: optional('MAIL_FROM', 'SujoyDev <no-reply@sujoydev.app>'),
  },
  adminBootstrap: {
    email: optional('ADMIN_EMAIL', 'sujoyghshal.s@gmail.com'),
    password: optional('ADMIN_PASSWORD', ''),
  },
};
