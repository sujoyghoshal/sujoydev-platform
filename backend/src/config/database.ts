import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongodbUri, {
      autoIndex: !env.isProd,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    throw error;
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}
