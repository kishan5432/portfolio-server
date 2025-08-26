"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    logger_1.logger.error(err);
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { ...error, statusCode: 404, message };
    }
    // Mongoose duplicate key
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { ...error, statusCode: 400, message };
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = { ...error, statusCode: 400, message: message.join(', ') };
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { ...error, statusCode: 401, message };
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { ...error, statusCode: 401, message };
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.middleware.js.map