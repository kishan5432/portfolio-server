import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: any;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const adminOnly: (((req: Request, res: Response, next: NextFunction) => Promise<any>) | ((req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>))[];
//# sourceMappingURL=auth.middleware.d.ts.map