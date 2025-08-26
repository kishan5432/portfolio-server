"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactMessage_1 = require("../models/ContactMessage");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/contact/test - Test database connection
router.get('/test', (0, error_middleware_1.asyncHandler)(async (_req, res) => {
    console.log('🧪 CONTACT TEST ENDPOINT HIT!');
    try {
        // Test database connection by trying to create a ContactMessage instance
        console.log('📝 Testing ContactMessage model...');
        new ContactMessage_1.ContactMessage({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message'
        });
        console.log('📝 ContactMessage instance created successfully');
        res.status(200).json({
            success: true,
            message: 'Database connection and model working!',
            databaseState: 'Connected',
            modelState: 'Working',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Test endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Database test failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
}));
// POST /api/v1/contact - Public route
router.post('/', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    console.log('🚀 CONTACT ROUTE HIT!');
    console.log('📝 Request method:', req.method);
    console.log('📝 Request path:', req.path);
    console.log('📝 Request body:', req.body);
    console.log('📝 Request headers:', req.headers);
    console.log('📝 Request IP:', req.ip);
    console.log('📝 Request timestamp:', new Date().toISOString());
    const { name, email, subject, message } = req.body;
    console.log('📝 Extracted data:', { name, email, subject, message });
    if (!name || !email || !message) {
        console.log('❌ Validation failed - missing required fields:', { name: !!name, email: !!email, message: !!message });
        return ApiResponse_1.ApiResponse.badRequest(res, 'Name, email, and message are required');
    }
    try {
        console.log('📝 Creating ContactMessage instance...');
        const contactMessage = new ContactMessage_1.ContactMessage({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject ? subject.trim() : undefined,
            message: message.trim()
        });
        console.log('📝 ContactMessage instance created:', contactMessage);
        console.log('📝 Saving to database...');
        await contactMessage.save();
        console.log('✅ Contact message saved successfully with ID:', contactMessage._id);
        console.log('✅ Full saved document:', contactMessage.toObject());
        // TODO: Send email notification to admin
        // TODO: Send confirmation email to user (optional)
        const response = ApiResponse_1.ApiResponse.success(res, { id: contactMessage._id }, 'Message sent successfully. Thank you for reaching out!', 201);
        console.log('✅ Sending response:', response);
        return response;
    }
    catch (error) {
        console.error('❌ Error saving contact message:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        // Check if it's a database connection error
        if (error instanceof Error && error.message.includes('MongoNetworkError')) {
            console.error('❌ Database connection error detected');
        }
        throw error;
    }
}));
// GET /api/v1/contact - Admin only
router.get('/', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 20, read } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build filter
    const filter = {};
    if (read !== undefined) {
        filter.read = read === 'true';
    }
    const [messages, total, unreadCount] = await Promise.all([
        ContactMessage_1.ContactMessage.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        ContactMessage_1.ContactMessage.countDocuments(filter),
        ContactMessage_1.ContactMessage.countDocuments({ read: false })
    ]);
    const totalPages = Math.ceil(total / limitNum);
    return ApiResponse_1.ApiResponse.successWithMeta(res, {
        messages,
        unreadCount
    }, { page: pageNum, limit: limitNum, total, totalPages }, 'Contact messages retrieved successfully');
}));
// PUT /api/v1/contact/:id/read - Admin only
router.put('/:id/read', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const message = await ContactMessage_1.ContactMessage.findByIdAndUpdate(req.params['id'], { read: true }, { new: true });
    if (!message) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Contact message not found');
    }
    return ApiResponse_1.ApiResponse.success(res, message, 'Message marked as read');
}));
// DELETE /api/v1/contact/:id - Admin only
router.delete('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const message = await ContactMessage_1.ContactMessage.findByIdAndDelete(req.params['id']);
    if (!message) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Contact message not found');
    }
    return ApiResponse_1.ApiResponse.success(res, null, 'Contact message deleted successfully');
}));
exports.default = router;
//# sourceMappingURL=contact.routes.js.map