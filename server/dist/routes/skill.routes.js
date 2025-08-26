"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Skill_1 = require("../models/Skill");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/skills - Public route
router.get('/', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { category, sortBy = 'level' } = req.query;
    // Build filter
    const filter = {};
    if (category) {
        filter.category = category;
    }
    // Build sort
    let sort = {};
    if (sortBy === 'level') {
        sort = { level: -1, name: 1 };
    }
    else if (sortBy === 'name') {
        sort = { name: 1 };
    }
    else if (sortBy === 'category') {
        sort = { category: 1, level: -1 };
    }
    const skills = await Skill_1.Skill.find(filter)
        .sort(sort)
        .lean();
    // Group by category for easier frontend consumption
    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});
    return ApiResponse_1.ApiResponse.success(res, {
        skills,
        skillsByCategory,
        categories: Object.keys(skillsByCategory)
    }, 'Skills retrieved successfully');
}));
// GET /api/v1/skills/:id - Public route
router.get('/:id', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const skill = await Skill_1.Skill.findById(req.params['id']).lean();
    if (!skill) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Skill not found');
    }
    return ApiResponse_1.ApiResponse.success(res, skill, 'Skill retrieved successfully');
}));
// POST /api/v1/skills - Admin only
router.post('/', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const skill = new Skill_1.Skill(req.body);
    await skill.save();
    return ApiResponse_1.ApiResponse.success(res, skill, 'Skill created successfully', 201);
}));
// PUT /api/v1/skills/:id - Admin only
router.put('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const skill = await Skill_1.Skill.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
    if (!skill) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Skill not found');
    }
    return ApiResponse_1.ApiResponse.success(res, skill, 'Skill updated successfully');
}));
// DELETE /api/v1/skills/:id - Admin only
router.delete('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const skill = await Skill_1.Skill.findByIdAndDelete(req.params['id']);
    if (!skill) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Skill not found');
    }
    return ApiResponse_1.ApiResponse.success(res, null, 'Skill deleted successfully');
}));
exports.default = router;
//# sourceMappingURL=skill.routes.js.map