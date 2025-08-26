"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Login route
router.post('/login', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return ApiResponse_1.ApiResponse.badRequest(res, 'Email and password are required');
    }
    // Find user by email
    const user = await User_1.User.findOne({ email }).select('+passwordHash');
    if (!user) {
        return ApiResponse_1.ApiResponse.unauthorized(res, 'Invalid credentials');
    }
    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        return ApiResponse_1.ApiResponse.unauthorized(res, 'Invalid credentials');
    }
    // Generate JWT token
    const token = (0, jwt_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    // Set cookie (optional)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return ApiResponse_1.ApiResponse.success(res, {
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
        },
    }, 'Login successful');
}));
// Logout route
router.post('/logout', (_req, res) => {
    res.clearCookie('token');
    return ApiResponse_1.ApiResponse.success(res, null, 'Logout successful');
});
// Get current user
router.get('/me', auth_middleware_1.authenticate, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    return ApiResponse_1.ApiResponse.success(res, {
        id: user._id,
        email: user.email,
        role: user.role,
    });
}));
// Refresh token - allow expired tokens for refresh
router.post('/refresh', (0, error_middleware_1.asyncHandler)(async (req, res) => {
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
        return ApiResponse_1.ApiResponse.unauthorized(res, 'No token provided for refresh');
    }
    try {
        // Decode token without verification to get user info
        const decoded = (0, jwt_1.decodeToken)(token);
        if (!decoded || !decoded.userId) {
            return ApiResponse_1.ApiResponse.unauthorized(res, 'Invalid token format');
        }
        // Find user
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return ApiResponse_1.ApiResponse.unauthorized(res, 'User not found');
        }
        // Generate new token
        const newToken = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return ApiResponse_1.ApiResponse.success(res, { token: newToken }, 'Token refreshed');
    }
    catch (error) {
        return ApiResponse_1.ApiResponse.unauthorized(res, 'Token refresh failed');
    }
}));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map