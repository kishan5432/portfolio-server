import mongoose from 'mongoose';
import { logger } from './logger';

export async function connectDatabase(): Promise<void> {
  try {
    const mongoUri = process.env['MONGODB_URI'];

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);

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

process.on('SIGINT', async () => {
  try {
    await disconnectDatabase();
  } catch (error) {
    logger.error('Error during MongoDB disconnection on SIGINT:', error);
  }
});

