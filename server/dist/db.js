"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./utils/logger");
const env_1 = __importDefault(require("./config/env"));
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(env_1.default.MONGODB_URI);
        logger_1.logger.info('📦 Connected to MongoDB');
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
async function disconnectDatabase() {
    try {
        await mongoose_1.default.disconnect();
        logger_1.logger.info('📦 Disconnected from MongoDB');
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB disconnection error:', error);
        throw error;
    }
}
// Handle connection events
mongoose_1.default.connection.on('error', (error) => {
    logger_1.logger.error('MongoDB connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    logger_1.logger.warn('MongoDB disconnected');
});
mongoose_1.default.connection.on('connected', () => {
    logger_1.logger.info('MongoDB connected');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await disconnectDatabase();
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Error during MongoDB disconnection on SIGINT:', error);
        process.exit(1);
    }
});
process.on('SIGTERM', async () => {
    try {
        await disconnectDatabase();
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Error during MongoDB disconnection on SIGTERM:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=db.js.map