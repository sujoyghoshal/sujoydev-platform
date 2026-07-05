import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { morganStream } from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(morgan(env.isProd ? 'combined' : 'dev', { stream: morganStream }));

  app.use(env.apiPrefix, apiLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
