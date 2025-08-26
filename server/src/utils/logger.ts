import pino from 'pino';

const isDevelopment = process.env['NODE_ENV'] === 'development';

const loggerOptions: any = {
  level: process.env['LOG_LEVEL'] || 'info',
};

if (isDevelopment) {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(loggerOptions);

