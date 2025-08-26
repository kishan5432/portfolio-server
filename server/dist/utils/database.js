"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
async function connectDatabase() {
    try {
        const mongoUri = process.env['MONGODB_URI'];
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose_1.default.connect(mongoUri);
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
process.on('SIGINT', async () => {
    try {
        await disconnectDatabase();
    }
    catch (error) {
        logger_1.logger.error('Error during MongoDB disconnection on SIGINT:', error);
    }
});
//# sourceMappingURL=database.js.map