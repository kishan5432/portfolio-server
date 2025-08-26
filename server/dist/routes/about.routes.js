"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const About_1 = require("../models/About");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/about - Public route (gets active about info)
router.get('/', (0, error_middleware_1.asyncHandler)(async (_req, res) => {
    const about = await About_1.About.findOne({ isActive: true }).lean();
    if (!about) {
        return ApiResponse_1.ApiResponse.notFound(res, 'About information not found');
    }
    return ApiResponse_1.ApiResponse.success(res, about, 'About information retrieved successfully');
}));
// GET /api/v1/about/all - Admin only (gets all about entries)
router.get('/all', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (_req, res) => {
    const aboutEntries = await About_1.About.find().sort({ createdAt: -1 }).lean();
    return ApiResponse_1.ApiResponse.success(res, aboutEntries, 'All about entries retrieved successfully');
}));
// GET /api/v1/about/:id - Admin only
router.get('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const about = await About_1.About.findById(req.params['id']).lean();
    if (!about) {
        return ApiResponse_1.ApiResponse.notFound(res, 'About entry not found');
    }
    return ApiResponse_1.ApiResponse.success(res, about, 'About entry retrieved successfully');
}));
// POST /api/v1/about - Admin only
router.post('/', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // If creating a new active about, deactivate all others
    if (req.body.isActive) {
        await About_1.About.updateMany({}, { isActive: false });
    }
    const about = new About_1.About(req.body);
    await about.save();
    return ApiResponse_1.ApiResponse.success(res, about, 'About information created successfully', 201);
}));
// PUT /api/v1/about/:id - Admin only
router.put('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // If setting this about as active, deactivate all others
    if (req.body.isActive) {
        await About_1.About.updateMany({ _id: { $ne: req.params['id'] } }, { isActive: false });
    }
    const about = await About_1.About.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
    if (!about) {
        return ApiResponse_1.ApiResponse.notFound(res, 'About entry not found');
    }
    return ApiResponse_1.ApiResponse.success(res, about, 'About information updated successfully');
}));
// DELETE /api/v1/about/:id - Admin only
router.delete('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const about = await About_1.About.findByIdAndDelete(req.params['id']);
    if (!about) {
        return ApiResponse_1.ApiResponse.notFound(res, 'About entry not found');
    }
    // If we deleted the active about, make the most recent one active
    if (about.isActive) {
        const latestAbout = await About_1.About.findOne().sort({ createdAt: -1 });
        if (latestAbout) {
            latestAbout.isActive = true;
            await latestAbout.save();
        }
    }
    return ApiResponse_1.ApiResponse.success(res, null, 'About entry deleted successfully');
}));
// PUT /api/v1/about/:id/activate - Admin only (activate specific about entry)
router.put('/:id/activate', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Deactivate all other entries
    await About_1.About.updateMany({ _id: { $ne: req.params['id'] } }, { isActive: false });
    // Activate the selected entry
    const about = await About_1.About.findByIdAndUpdate(req.params['id'], { isActive: true }, { new: true });
    if (!about) {
        return ApiResponse_1.ApiResponse.notFound(res, 'About entry not found');
    }
    return ApiResponse_1.ApiResponse.success(res, about, 'About entry activated successfully');
}));
exports.default = router;
//# sourceMappingURL=about.routes.js.map