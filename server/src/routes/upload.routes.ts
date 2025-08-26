import { Router, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ApiResponse } from '../utils/ApiResponse';
import { adminOnly, AuthRequest } from '../middleware/auth.middleware';
import env from '../config/env';

const router: Router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Allow images and some document types
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, options: any = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // Try using the upload_stream method first
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'portfolio',
          ...options,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    } catch (error) {
      console.error('Error setting up upload stream:', error);
      reject(error);
    }
  });
};

// POST /api/v1/upload/single - Admin only
router.post('/single', adminOnly, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'No file uploaded');
    }

    const { folder = 'general' } = req.body;

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `portfolio/${folder}`,
      public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`,
    });

    return ApiResponse.success(res, {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    }, 'File uploaded successfully');

  } catch (error: any) {
    console.error('Upload error:', error);
    return ApiResponse.internalError(res, error.message || 'Upload failed');
  }
});

// POST /api/v1/upload/multiple - Admin only
router.post('/multiple', adminOnly, upload.array('files', 10), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return ApiResponse.badRequest(res, 'No files uploaded');
    }

    const { folder = 'general' } = req.body;

    const uploadPromises = req.files.map((file: Express.Multer.File) =>
      uploadToCloudinary(file.buffer, {
        folder: `portfolio/${folder}`,
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      })
    );

    const results = await Promise.all(uploadPromises);

    const uploadedFiles = results.map(result => ({
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    }));

    return ApiResponse.success(res, {
      files: uploadedFiles,
      count: uploadedFiles.length,
    }, 'Files uploaded successfully');

  } catch (error: any) {
    console.error('Upload error:', error);
    return ApiResponse.internalError(res, error.message || 'Upload failed');
  }
});

// DELETE /api/v1/upload/:publicId - Admin only
router.delete('/:publicId', adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { publicId } = req.params;

    // Decode the public_id (it may be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok') {
      return ApiResponse.success(res, null, 'File deleted successfully');
    } else {
      return ApiResponse.notFound(res, 'File not found or already deleted');
    }

  } catch (error: any) {
    console.error('Delete error:', error);
    return ApiResponse.internalError(res, error.message || 'Delete failed');
  }
});

export default router;

