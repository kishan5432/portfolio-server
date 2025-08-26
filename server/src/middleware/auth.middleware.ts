import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { verifyToken } from '../utils/jwt';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from './error.middleware';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid token. User not found.');
    }

    req.user = user;
    return next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Invalid token.');
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Access denied. Please authenticate.');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Access denied. Insufficient permissions.');
    }

    return next();
  };
};

export const adminOnly = [authenticate, authorize('admin')];
