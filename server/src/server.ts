import { app } from './app';
import { connectDatabase } from './db';
import { logger } from './utils/logger';
import env from './config/env';

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📚 Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      server.close(() => {
        logger.info('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received');
      server.close(() => {
        logger.info('Process terminated');
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

