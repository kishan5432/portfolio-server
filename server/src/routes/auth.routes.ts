import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, decodeToken } from '../utils/jwt';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../middleware/error.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = Router();

// Login route
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.badRequest(res, 'Email and password are required');
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    return ApiResponse.unauthorized(res, 'Invalid credentials');
  }

  // Check password
  const isValidPassword = await (user as any).comparePassword(password);

  if (!isValidPassword) {
    return ApiResponse.unauthorized(res, 'Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken({
    userId: (user as any)._id.toString(),
    email: (user as any).email,
    role: (user as any).role,
  });

  // Set cookie (optional)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return ApiResponse.success(res, {
    token,
    user: {
      id: (user as any)._id,
      email: (user as any).email,
      role: (user as any).role,
    },
  }, 'Login successful');
}));

// Logout route
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  return ApiResponse.success(res, null, 'Logout successful');
});

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: any, res: Response) => {
  const user = req.user as any;
  return ApiResponse.success(res, {
    id: user._id,
    email: user.email,
    role: user.role,
  });
}));

// Refresh token - allow expired tokens for refresh
router.post('/refresh', asyncHandler(async (req: any, res: Response) => {
  let token: string | undefined;

  // Check for token in header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies['token']) {
    token = req.cookies['token'];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'No token provided for refresh');
  }

  try {
    // Decode token without verification to get user info
    const decoded = decodeToken(token);
    if (!decoded || !decoded.userId) {
      return ApiResponse.unauthorized(res, 'Invalid token format');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    // Generate new token
    const newToken = generateToken({
      userId: (user as any)._id.toString(),
      email: (user as any).email,
      role: (user as any).role,
    });

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return ApiResponse.success(res, { token: newToken }, 'Token refreshed');
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Token refresh failed');
  }
}));

export default router;

