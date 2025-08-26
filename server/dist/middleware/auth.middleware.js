"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authorize = exports.authenticate = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("./error.middleware");
exports.authenticate = (0, error_middleware_1.asyncHandler)(async (req, res, next) => {
    let token;
    // Check for token in header
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies['token']) {
        token = req.cookies['token'];
    }
    if (!token) {
        return ApiResponse_1.ApiResponse.unauthorized(res, 'Access denied. No token provided.');
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return ApiResponse_1.ApiResponse.unauthorized(res, 'Invalid token. User not found.');
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return ApiResponse_1.ApiResponse.unauthorized(res, 'Invalid token.');
    }
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ApiResponse_1.ApiResponse.unauthorized(res, 'Access denied. Please authenticate.');
        }
        if (!roles.includes(req.user.role)) {
            return ApiResponse_1.ApiResponse.forbidden(res, 'Access denied. Insufficient permissions.');
        }
        return next();
    };
};
exports.authorize = authorize;
exports.adminOnly = [exports.authenticate, (0, exports.authorize)('admin')];
//# sourceMappingURL=auth.middleware.js.map