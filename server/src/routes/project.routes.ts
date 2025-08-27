import { Router } from 'express';
import type { Request, Response } from 'express';
import { Project } from '../models/Project';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../middleware/error.middleware';
import { adminOnly } from '../middleware/auth.middleware';

const router: Router = Router();

// GET /api/v1/projects - Public route
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, featured, tag } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const filter: any = {};
  if (featured !== undefined) {
    filter.featured = featured === 'true';
  }
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Project.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return ApiResponse.successWithMeta(
    res,
    projects,
    { page: pageNum, limit: limitNum, total, totalPages },
    'Projects retrieved successfully'
  );
}));

// GET /api/v1/projects/:slugOrId - Public route
router.get('/:slugOrId', asyncHandler(async (req: Request, res: Response) => {
  const { slugOrId } = req.params;

  // Try to find by slug first, then by ID
  let project = await Project.findOne({ slug: slugOrId }).lean();

  if (!project && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
    project = await Project.findById(slugOrId).lean();
  }

  if (!project) {
    return ApiResponse.notFound(res, 'Project not found');
  }

  return ApiResponse.success(res, project, 'Project retrieved successfully');
}));

// POST /api/v1/projects - Admin only
router.post('/', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    await project.save();

    return ApiResponse.success(res, project, 'Project created successfully', 201);
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return ApiResponse.badRequest(res, `A project with this ${field} (${value}) already exists`);
    }
    throw error;
  }
}));

// PUT /api/v1/projects/:id - Admin only
router.put('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if slug is being updated and if it conflicts with other projects
    if (req.body.slug) {
      const existingProject = await Project.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params['id'] } // Exclude current project
      });

      if (existingProject) {
        return ApiResponse.badRequest(res, `A project with this slug (${req.body.slug}) already exists`);
      }
    }

    const project = await Project.findByIdAndUpdate(
      req.params['id'],
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return ApiResponse.notFound(res, 'Project not found');
    }

    return ApiResponse.success(res, project, 'Project updated successfully');
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error (fallback)
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return ApiResponse.badRequest(res, `A project with this ${field} (${value}) already exists`);
    }
    throw error;
  }
}));

// DELETE /api/v1/projects/:id - Admin only
router.delete('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findByIdAndDelete(req.params['id']);

  if (!project) {
    return ApiResponse.notFound(res, 'Project not found');
  }

  return ApiResponse.success(res, null, 'Project deleted successfully');
}));

export default router;

