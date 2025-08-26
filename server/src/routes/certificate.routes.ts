import { Router, Request, Response } from 'express';
import { Certificate } from '../models/Certificate';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../middleware/error.middleware';
import { adminOnly } from '../middleware/auth.middleware';

const router: Router = Router();

// GET /api/v1/certificates - Public route
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, organization, tag } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const filter: any = {};
  if (organization) {
    filter.organization = { $regex: organization, $options: 'i' };
  }
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  const [certificates, total] = await Promise.all([
    Certificate.find(filter)
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Certificate.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return ApiResponse.successWithMeta(
    res,
    certificates,
    { page: pageNum, limit: limitNum, total, totalPages },
    'Certificates retrieved successfully'
  );
}));

// GET /api/v1/certificates/:id - Public route
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const certificate = await Certificate.findById(req.params['id']).lean();

  if (!certificate) {
    return ApiResponse.notFound(res, 'Certificate not found');
  }

  return ApiResponse.success(res, certificate, 'Certificate retrieved successfully');
}));

// POST /api/v1/certificates - Admin only
router.post('/', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const certificate = new Certificate(req.body);
  await certificate.save();

  return ApiResponse.success(res, certificate, 'Certificate created successfully', 201);
}));

// PUT /api/v1/certificates/:id - Admin only
router.put('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const certificate = await Certificate.findByIdAndUpdate(
    req.params['id'],
    req.body,
    { new: true, runValidators: true }
  );

  if (!certificate) {
    return ApiResponse.notFound(res, 'Certificate not found');
  }

  return ApiResponse.success(res, certificate, 'Certificate updated successfully');
}));

// DELETE /api/v1/certificates/:id - Admin only
router.delete('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const certificate = await Certificate.findByIdAndDelete(req.params['id']);

  if (!certificate) {
    return ApiResponse.notFound(res, 'Certificate not found');
  }

  return ApiResponse.success(res, null, 'Certificate deleted successfully');
}));

export default router;

