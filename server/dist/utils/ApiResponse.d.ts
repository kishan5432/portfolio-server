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
export declare class ApiResponse {
    static success<T>(res: Response, data?: T, message?: string, statusCode?: number): Response;
    static successWithMeta<T>(res: Response, data: T, meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, message?: string, statusCode?: number): Response;
    static error(res: Response, message: string, statusCode?: number, errors?: string[]): Response;
    static badRequest(res: Response, message?: string, errors?: string[]): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static notFound(res: Response, message?: string): Response;
    static conflict(res: Response, message?: string): Response;
    static validationError(res: Response, errors: string[]): Response;
    static internalError(res: Response, message?: string): Response;
}
//# sourceMappingURL=ApiResponse.d.ts.map