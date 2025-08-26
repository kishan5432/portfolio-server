import mongoose from 'mongoose';
import { logger } from './utils/logger';
import env from './config/env';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('📦 Connected to MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('📦 Disconnected from MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB disconnection error:', error);
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during MongoDB disconnection on SIGINT:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during MongoDB disconnection on SIGTERM:', error);
    process.exit(1);
  }
});
