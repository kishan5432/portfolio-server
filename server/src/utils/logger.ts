import pino from 'pino';

// Simple logger configuration that works in both development and production
const loggerOptions: any = {
  level: process.env['LOG_LEVEL'] || 'info',
};

// Only use transport in development, not in production
if (process.env['NODE_ENV'] === 'development') {
  // In development, we can use pretty printing
  // But we'll skip this in production/serverless environments
} else {
  // For production and serverless environments, use basic configuration
  // No transport configuration to avoid the pino-pretty error
}

export const logger = pino(loggerOptions);

