"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const ApiResponse_1 = require("../utils/ApiResponse");
const auth_middleware_1 = require("../middleware/auth.middleware");
const env_1 = __importDefault(require("../config/env"));
const router = (0, express_1.Router)();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.default.CLOUDINARY_API_KEY,
    api_secret: env_1.default.CLOUDINARY_API_SECRET,
});
// Configure Multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
        }
        else {
            cb(new Error('Invalid file type. Only images and documents are allowed.'));
        }
    },
});
// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        try {
            // Try using the upload_stream method first
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'portfolio',
                ...options,
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            // Convert buffer to stream and pipe to Cloudinary
            const stream = stream_1.Readable.from(buffer);
            stream.pipe(uploadStream);
        }
        catch (error) {
            console.error('Error setting up upload stream:', error);
            reject(error);
        }
    });
};
// POST /api/v1/upload/single - Admin only
router.post('/single', auth_middleware_1.adminOnly, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return ApiResponse_1.ApiResponse.badRequest(res, 'No file uploaded');
        }
        const { folder = 'general' } = req.body;
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: `portfolio/${folder}`,
            public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`,
        });
        return ApiResponse_1.ApiResponse.success(res, {
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
        }, 'File uploaded successfully');
    }
    catch (error) {
        console.error('Upload error:', error);
        return ApiResponse_1.ApiResponse.internalError(res, error.message || 'Upload failed');
    }
});
// POST /api/v1/upload/multiple - Admin only
router.post('/multiple', auth_middleware_1.adminOnly, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return ApiResponse_1.ApiResponse.badRequest(res, 'No files uploaded');
        }
        const { folder = 'general' } = req.body;
        const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, {
            folder: `portfolio/${folder}`,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        }));
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
        return ApiResponse_1.ApiResponse.success(res, {
            files: uploadedFiles,
            count: uploadedFiles.length,
        }, 'Files uploaded successfully');
    }
    catch (error) {
        console.error('Upload error:', error);
        return ApiResponse_1.ApiResponse.internalError(res, error.message || 'Upload failed');
    }
});
// DELETE /api/v1/upload/:publicId - Admin only
router.delete('/:publicId', auth_middleware_1.adminOnly, async (req, res) => {
    try {
        const { publicId } = req.params;
        // Decode the public_id (it may be URL encoded)
        const decodedPublicId = decodeURIComponent(publicId);
        const result = await cloudinary_1.v2.uploader.destroy(decodedPublicId);
        if (result.result === 'ok') {
            return ApiResponse_1.ApiResponse.success(res, null, 'File deleted successfully');
        }
        else {
            return ApiResponse_1.ApiResponse.notFound(res, 'File not found or already deleted');
        }
    }
    catch (error) {
        console.error('Delete error:', error);
        return ApiResponse_1.ApiResponse.internalError(res, error.message || 'Delete failed');
    }
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map