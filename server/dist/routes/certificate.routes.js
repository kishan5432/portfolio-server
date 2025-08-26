"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Certificate_1 = require("../models/Certificate");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/certificates - Public route
router.get('/', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, organization, tag } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build filter
    const filter = {};
    if (organization) {
        filter.organization = { $regex: organization, $options: 'i' };
    }
    if (tag) {
        filter.tags = { $in: [tag] };
    }
    const [certificates, total] = await Promise.all([
        Certificate_1.Certificate.find(filter)
            .sort({ issueDate: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Certificate_1.Certificate.countDocuments(filter)
    ]);
    const totalPages = Math.ceil(total / limitNum);
    return ApiResponse_1.ApiResponse.successWithMeta(res, certificates, { page: pageNum, limit: limitNum, total, totalPages }, 'Certificates retrieved successfully');
}));
// GET /api/v1/certificates/:id - Public route
router.get('/:id', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const certificate = await Certificate_1.Certificate.findById(req.params['id']).lean();
    if (!certificate) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Certificate not found');
    }
    return ApiResponse_1.ApiResponse.success(res, certificate, 'Certificate retrieved successfully');
}));
// POST /api/v1/certificates - Admin only
router.post('/', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const certificate = new Certificate_1.Certificate(req.body);
    await certificate.save();
    return ApiResponse_1.ApiResponse.success(res, certificate, 'Certificate created successfully', 201);
}));
// PUT /api/v1/certificates/:id - Admin only
router.put('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const certificate = await Certificate_1.Certificate.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
    if (!certificate) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Certificate not found');
    }
    return ApiResponse_1.ApiResponse.success(res, certificate, 'Certificate updated successfully');
}));
// DELETE /api/v1/certificates/:id - Admin only
router.delete('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const certificate = await Certificate_1.Certificate.findByIdAndDelete(req.params['id']);
    if (!certificate) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Certificate not found');
    }
    return ApiResponse_1.ApiResponse.success(res, null, 'Certificate deleted successfully');
}));
exports.default = router;
//# sourceMappingURL=certificate.routes.js.map