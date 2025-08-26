import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import env from './config/env';

// Import routes
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import certificateRoutes from './routes/certificate.routes';
import timelineRoutes from './routes/timeline.routes';
import skillRoutes from './routes/skill.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';
import aboutRoutes from './routes/about.routes';

export const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`General rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60), // 15 minutes in seconds
    });
  },
});

// More specific rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60), // 15 minutes in seconds
    });
  },
});

app.use('/api/', limiter);
app.use('/api/v1/auth', authLimiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use((req, _res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📝 Request body:', req.body);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// Simple test endpoint for debugging
app.post('/api/test', (req: Request, res: Response) => {
  console.log('🧪 TEST ENDPOINT HIT!');
  console.log('📝 Request body:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working!',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/timeline', timelineRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/about', aboutRoutes);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${_req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

