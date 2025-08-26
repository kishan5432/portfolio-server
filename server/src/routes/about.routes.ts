import { Router, Request, Response } from 'express';
import { About } from '../models/About';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../middleware/error.middleware';
import { adminOnly } from '../middleware/auth.middleware';

const router: Router = Router();

// GET /api/v1/about - Public route (gets active about info)
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const about = await About.findOne({ isActive: true }).lean();

  if (!about) {
    return ApiResponse.notFound(res, 'About information not found');
  }

  return ApiResponse.success(res, about, 'About information retrieved successfully');
}));

// GET /api/v1/about/all - Admin only (gets all about entries)
router.get('/all', adminOnly, asyncHandler(async (_req: Request, res: Response) => {
  const aboutEntries = await About.find().sort({ createdAt: -1 }).lean();

  return ApiResponse.success(res, aboutEntries, 'All about entries retrieved successfully');
}));

// GET /api/v1/about/:id - Admin only
router.get('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const about = await About.findById(req.params['id']).lean();

  if (!about) {
    return ApiResponse.notFound(res, 'About entry not found');
  }

  return ApiResponse.success(res, about, 'About entry retrieved successfully');
}));

// POST /api/v1/about - Admin only
router.post('/', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  // If creating a new active about, deactivate all others
  if (req.body.isActive) {
    await About.updateMany({}, { isActive: false });
  }

  const about = new About(req.body);
  await about.save();

  return ApiResponse.success(res, about, 'About information created successfully', 201);
}));

// PUT /api/v1/about/:id - Admin only
router.put('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  // If setting this about as active, deactivate all others
  if (req.body.isActive) {
    await About.updateMany({ _id: { $ne: req.params['id'] } }, { isActive: false });
  }

  const about = await About.findByIdAndUpdate(
    req.params['id'],
    req.body,
    { new: true, runValidators: true }
  );

  if (!about) {
    return ApiResponse.notFound(res, 'About entry not found');
  }

  return ApiResponse.success(res, about, 'About information updated successfully');
}));

// DELETE /api/v1/about/:id - Admin only
router.delete('/:id', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  const about = await About.findByIdAndDelete(req.params['id']);

  if (!about) {
    return ApiResponse.notFound(res, 'About entry not found');
  }

  // If we deleted the active about, make the most recent one active
  if (about.isActive) {
    const latestAbout = await About.findOne().sort({ createdAt: -1 });
    if (latestAbout) {
      latestAbout.isActive = true;
      await latestAbout.save();
    }
  }

  return ApiResponse.success(res, null, 'About entry deleted successfully');
}));

// PUT /api/v1/about/:id/activate - Admin only (activate specific about entry)
router.put('/:id/activate', adminOnly, asyncHandler(async (req: Request, res: Response) => {
  // Deactivate all other entries
  await About.updateMany({ _id: { $ne: req.params['id'] } }, { isActive: false });

  // Activate the selected entry
  const about = await About.findByIdAndUpdate(
    req.params['id'],
    { isActive: true },
    { new: true }
  );

  if (!about) {
    return ApiResponse.notFound(res, 'About entry not found');
  }

  return ApiResponse.success(res, about, 'About entry activated successfully');
}));

export default router;
