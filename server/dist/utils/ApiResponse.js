"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static successWithMeta(res, data, meta, message, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            meta,
        });
    }
    static error(res, message, statusCode = 500, errors) {
        return res.status(statusCode).json({
            success: false,
            error: message,
            errors,
        });
    }
    static badRequest(res, message = 'Bad Request', errors) {
        return this.error(res, message, 400, errors);
    }
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }
    static conflict(res, message = 'Conflict') {
        return this.error(res, message, 409);
    }
    static validationError(res, errors) {
        return this.error(res, 'Validation failed', 400, errors);
    }
    static internalError(res, message = 'Internal Server Error') {
        return this.error(res, message, 500);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map