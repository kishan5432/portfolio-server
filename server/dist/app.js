"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
const env_1 = __importDefault(require("./config/env"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const certificate_routes_1 = __importDefault(require("./routes/certificate.routes"));
const timeline_routes_1 = __importDefault(require("./routes/timeline.routes"));
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const about_routes_1 = __importDefault(require("./routes/about.routes"));
exports.app = (0, express_1.default)();
// Security middleware
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({
    origin: true, // Allow all origins temporarily for debugging
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        logger_1.logger.warn(`General rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil(15 * 60), // 15 minutes in seconds
        });
    },
});
// More specific rate limiting for auth routes
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 auth requests per windowMs
    message: 'Too many authentication attempts from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts from this IP, please try again later.',
            retryAfter: Math.ceil(15 * 60), // 15 minutes in seconds
        });
    },
});
exports.app.use('/api/', limiter);
exports.app.use('/api/v1/auth', authLimiter);
// Body parsing middleware
exports.app.use((0, compression_1.default)());
exports.app.use(express_1.default.json({ limit: '10mb' }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
exports.app.use((0, cookie_parser_1.default)());
// Logging middleware
exports.app.use((req, _res, next) => {
    console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📝 Request body:', req.body);
    }
    next();
});
// Health check endpoint
exports.app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env_1.default.NODE_ENV,
        version: '1.0.0',
    });
});
// Simple test endpoint for debugging
exports.app.post('/api/test', (req, res) => {
    console.log('🧪 TEST ENDPOINT HIT!');
    console.log('📝 Request body:', req.body);
    res.status(200).json({
        success: true,
        message: 'Test endpoint working!',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});
// API routes
exports.app.use('/api/v1/auth', auth_routes_1.default);
exports.app.use('/api/v1/projects', project_routes_1.default);
exports.app.use('/api/v1/certificates', certificate_routes_1.default);
exports.app.use('/api/v1/timeline', timeline_routes_1.default);
exports.app.use('/api/v1/skills', skill_routes_1.default);
exports.app.use('/api/v1/contact', contact_routes_1.default);
exports.app.use('/api/v1/upload', upload_routes_1.default);
exports.app.use('/api/v1/about', about_routes_1.default);
// 404 handler
exports.app.use('*', (_req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${_req.originalUrl} not found`,
    });
});
// Error handling middleware
exports.app.use(error_middleware_1.errorHandler);
//# sourceMappingURL=app.js.map