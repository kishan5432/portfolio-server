"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TimelineItem_1 = require("../models/TimelineItem");
const ApiResponse_1 = require("../utils/ApiResponse");
const error_middleware_1 = require("../middleware/error.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/timeline - Public route
router.get('/', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const [timelineItems, total] = await Promise.all([
        TimelineItem_1.TimelineItem.find()
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        TimelineItem_1.TimelineItem.countDocuments()
    ]);
    const totalPages = Math.ceil(total / limitNum);
    return ApiResponse_1.ApiResponse.successWithMeta(res, timelineItems, { page: pageNum, limit: limitNum, total, totalPages }, 'Timeline items retrieved successfully');
}));
// GET /api/v1/timeline/:id - Public route
router.get('/:id', (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const timelineItem = await TimelineItem_1.TimelineItem.findById(req.params['id']).lean();
    if (!timelineItem) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Timeline item not found');
    }
    return ApiResponse_1.ApiResponse.success(res, timelineItem, 'Timeline item retrieved successfully');
}));
// POST /api/v1/timeline - Admin only
router.post('/', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Clean up the request body to handle empty strings for dates
    const createData = { ...req.body };
    // Convert empty string endDate to undefined
    if (createData.endDate === '' || createData.endDate === null || createData.endDate === 'undefined') {
        delete createData.endDate; // Remove the field entirely instead of setting to undefined
    }
    // Convert empty string startDate to undefined (though this should be required)
    if (createData.startDate === '' || createData.startDate === null || createData.startDate === 'undefined') {
        delete createData.startDate; // Remove the field entirely instead of setting to undefined
    }
    const timelineItem = new TimelineItem_1.TimelineItem(createData);
    await timelineItem.save();
    return ApiResponse_1.ApiResponse.success(res, timelineItem, 'Timeline item created successfully', 201);
}));
// PUT /api/v1/timeline/:id - Admin only
router.put('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    console.log('=== TIMELINE UPDATE DEBUG ===');
    console.log('Original request body:', JSON.stringify(req.body, null, 2));
    // Clean up the request body to handle empty strings for dates
    const updateData = { ...req.body };
    // Get the current item first to see what dates it has
    const currentItem = await TimelineItem_1.TimelineItem.findById(req.params['id']);
    if (currentItem) {
        console.log('Current item dates:', {
            startDate: currentItem.startDate,
            endDate: currentItem.endDate
        });
    }
    // Convert empty string endDate to undefined
    if (updateData.endDate === '' || updateData.endDate === null || updateData.endDate === 'undefined') {
        console.log('Removing empty endDate');
        delete updateData.endDate; // Remove the field entirely instead of setting to undefined
    }
    // Convert empty string startDate to undefined (though this should be required)
    if (updateData.startDate === '' || updateData.startDate === null || updateData.startDate === 'undefined') {
        console.log('Removing empty startDate');
        delete updateData.startDate; // Remove the field entirely instead of setting to undefined
    }
    console.log('Cleaned update data:', JSON.stringify(updateData, null, 2));
    // Manual date validation before update
    if (updateData.endDate && (updateData.startDate || currentItem?.startDate)) {
        const startDate = updateData.startDate ? new Date(updateData.startDate) : currentItem?.startDate;
        const endDate = new Date(updateData.endDate);
        if (startDate && endDate < startDate) {
            console.log('Date validation failed:', { startDate, endDate });
            return ApiResponse_1.ApiResponse.error(res, 'End date must be after or equal to start date', 400);
        }
    }
    const timelineItem = await TimelineItem_1.TimelineItem.findByIdAndUpdate(req.params['id'], updateData, { new: true, runValidators: true });
    if (!timelineItem) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Timeline item not found');
    }
    console.log('=== UPDATE SUCCESSFUL ===');
    return ApiResponse_1.ApiResponse.success(res, timelineItem, 'Timeline item updated successfully');
}));
// DELETE /api/v1/timeline/:id - Admin only
router.delete('/:id', auth_middleware_1.adminOnly, (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const timelineItem = await TimelineItem_1.TimelineItem.findByIdAndDelete(req.params['id']);
    if (!timelineItem) {
        return ApiResponse_1.ApiResponse.notFound(res, 'Timeline item not found');
    }
    return ApiResponse_1.ApiResponse.success(res, null, 'Timeline item deleted successfully');
}));
exports.default = router;
//# sourceMappingURL=timeline.routes.js.map