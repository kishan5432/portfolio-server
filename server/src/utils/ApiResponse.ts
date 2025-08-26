import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: string;
  errors?: string[];
}

export class ApiResponse {
  static success<T>(res: Response, data?: T, message?: string, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    } as ApiResponseData<T>);
  }

  static successWithMeta<T>(
    res: Response,
    data: T,
    meta: { page: number; limit: number; total: number; totalPages: number },
    message?: string,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    } as ApiResponseData<T>);
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: string[]): Response {
    return res.status(statusCode).json({
      success: false,
      error: message,
      errors,
    } as ApiResponseData);
  }

  static badRequest(res: Response, message: string = 'Bad Request', errors?: string[]): Response {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static conflict(res: Response, message: string = 'Conflict'): Response {
    return this.error(res, message, 409);
  }

  static validationError(res: Response, errors: string[]): Response {
    return this.error(res, 'Validation failed', 400, errors);
  }

  static internalError(res: Response, message: string = 'Internal Server Error'): Response {
    return this.error(res, message, 500);
  }
}
