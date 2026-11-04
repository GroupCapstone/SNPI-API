import mongoose from 'mongoose';

import { bootstrapBaseline } from './bootstrap';
import { env } from './env';
import { logger } from './logger';

mongoose.set('strictQuery', true);

export const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: isServerless ? 4_000 : 10_000,
    maxPoolSize: isServerless ? 10 : 50,
    minPoolSize: isServerless ? 0 : 5,
  });

  logger.info({ databaseState: mongoose.connection.readyState }, 'MongoDB connected');

  await bootstrapBaseline();
};

export const disconnectFromDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  }
};
