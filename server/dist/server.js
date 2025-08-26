"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./db");
const logger_1 = require("./utils/logger");
const env_1 = __importDefault(require("./config/env"));
async function startServer() {
    try {
        // Connect to database
        await (0, db_1.connectDatabase)();
        // Start server
        const server = app_1.app.listen(env_1.default.PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${env_1.default.PORT}`);
            logger_1.logger.info(`📚 Environment: ${env_1.default.NODE_ENV}`);
        });
        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger_1.logger.info('SIGTERM received');
            server.close(() => {
                logger_1.logger.info('Process terminated');
            });
        });
        process.on('SIGINT', () => {
            logger_1.logger.info('SIGINT received');
            server.close(() => {
                logger_1.logger.info('Process terminated');
            });
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map