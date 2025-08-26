import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=error.middleware.d.ts.map