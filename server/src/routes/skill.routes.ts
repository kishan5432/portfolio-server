import { Router, Request, Response } from 'express';
import { Skill } from '../models/Skill';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../middleware/error.middleware';
import { adminOnly } from '../middleware/auth.middleware';

const router: Router = Router();

// GET /api/v1/skills - Public route
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { category, sortBy = 'level' } = req.query;

  // Build filter
  const filter: any = {};
  if (category) {
    filter.category = category;
  }

  // Build sort
  let sort: any = {};
  if (sortBy === 'level') {
    sort = { level: -1, name: 1 };
  } else if (sortBy === 'name') {
    sort = { name: 1 };
  } else if (sortBy === 'category') {
    sort = { category: 1, level: -1 };
  }

  const skills = await Skill.find(filter)
    .sort(sort)
    .lean();

  // Group by category for easier frontend consumption
  const skillsByCategory = skills.reduce((acc: any, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return ApiResponse.success(res, {
    skills,
    skillsByCategory,
    categories: Object.keys(skillsByCategory)
  }, 'Skills retrieved successfully');
}));

// GET /api/v1/skills/:id - Public route
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findById(req.params['id']).lean();

  if (!skill) {
    return ApiResponse.notFound(res, 'Skill not found');
  }

  return ApiResponse.success(res, skill, 'Skill retrieved successfully');
}));

// POST /api/v1/skills - Admin only
router.post('/', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const skill = new Skill(req.body);
  await skill.save();

  return ApiResponse.success(res, skill, 'Skill created successfully', 201);
}));

// PUT /api/v1/skills/:id - Admin only
router.put('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findByIdAndUpdate(
    req.params['id'],
    req.body,
    { new: true, runValidators: true }
  );

  if (!skill) {
    return ApiResponse.notFound(res, 'Skill not found');
  }

  return ApiResponse.success(res, skill, 'Skill updated successfully');
}));

// DELETE /api/v1/skills/:id - Admin only
router.delete('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const skill = await Skill.findByIdAndDelete(req.params['id']);

  if (!skill) {
    return ApiResponse.notFound(res, 'Skill not found');
  }

  return ApiResponse.success(res, null, 'Skill deleted successfully');
}));

export default router;

