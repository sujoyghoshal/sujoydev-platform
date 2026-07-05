import rateLimit from 'express-rate-limit';

const standardOptions = {
  standardHeaders: true as const,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  ...standardOptions,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  ...standardOptions,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  ...standardOptions,
});
