"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Project_1 = require("../models/Project");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/projects - Public route
router.get('/', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, featured, tag } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build filter
    const filter = {};
    if (featured !== undefined) {
        filter.featured = featured === 'true';
    }
    if (tag) {
        filter.tags = { $in: [tag] };
    }
    const [projects, total] = await Promise.all([
        Project_1.Project.find(filter)
            .sort({ featured: -1, order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Project_1.Project.countDocuments(filter)
    ]);
    const totalPages = Math.ceil(total / limitNum);
    return ApiResponse_1.ApiResponse.successWithMeta(res, projects, { page: pageNum, limit: limitNum, total, totalPages }, 'Projects retrieved successfully');
}));
// GET /api/v1/projects/:slugOrId - Public route
router.get('/:slugOrId', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { slugOrId } = req.params;
    // Try to find by slug first, then by ID
    let project = await Project_1.Project.findOne({ slug: slugOrId }).lean();
    if (!project && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        project = await Project_1.Project.findById(slugOrId).lean();
    }
    if (!project) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Project not found');
    }
    return ApiResponse_1.ApiResponse.success(res, project, 'Project retrieved successfully');
}));
// POST /api/v1/projects - Admin only
router.post('/', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    try {
        const project = new Project_1.Project(req.body);
        await project.save();
        return ApiResponse_1.ApiResponse.success(res, project, 'Project created successfully', 201);
    }
    catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            return ApiResponse_1.ApiResponse.badRequest(res, `A project with this ${field} (${value}) already exists`);
        }
        throw error;
    }
}));
// PUT /api/v1/projects/:id - Admin only
router.put('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    try {
        // Check if slug is being updated and if it conflicts with other projects
        if (req.body.slug) {
            const existingProject = await Project_1.Project.findOne({
                slug: req.body.slug,
                _id: { $ne: req.params['id'] } // Exclude current project
            });
            if (existingProject) {
                return ApiResponse_1.ApiResponse.badRequest(res, `A project with this slug (${req.body.slug}) already exists`);
            }
        }
        const project = await Project_1.Project.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
        if (!project) {
            return ApiResponse_1.ApiResponse.notFound(res, 'Project not found');
        }
        return ApiResponse_1.ApiResponse.success(res, project, 'Project updated successfully');
    }
    catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (fallback)
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            return ApiResponse_1.ApiResponse.badRequest(res, `A project with this ${field} (${value}) already exists`);
        }
        throw error;
    }
}));
// DELETE /api/v1/projects/:id - Admin only
router.delete('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.findByIdAndDelete(req.params['id']);
    if (!project) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Project not found');
    }
    return ApiResponse_1.ApiResponse.success(res, null, 'Project deleted successfully');
}));
exports.default = router;
//# sourceMappingURL=project.routes.js.map