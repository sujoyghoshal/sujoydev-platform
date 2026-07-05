import winston from 'winston';
import path from 'path';

const logDir = path.resolve(process.cwd(), 'logs');
const isProd = process.env.NODE_ENV === 'production';

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${rest}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      dirname: logDir,
      filename: 'error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      dirname: logDir,
      filename: 'combined.log',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

export const morganStream = {
  write: (message: string) => logger.http?.(message.trim()) ?? logger.info(message.trim()),
};
