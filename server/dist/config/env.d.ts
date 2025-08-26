import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    MONGODB_URI: z.ZodString;
    PORT: z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    CLIENT_ORIGIN: z.ZodString;
    CLOUDINARY_CLOUD_NAME: z.ZodString;
    CLOUDINARY_API_KEY: z.ZodString;
    CLOUDINARY_API_SECRET: z.ZodString;
    ADMIN_EMAIL: z.ZodOptional<z.ZodString>;
    ADMIN_PASSWORD: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    MONGODB_URI: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CLIENT_ORIGIN: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    ADMIN_EMAIL?: string | undefined;
    ADMIN_PASSWORD?: string | undefined;
}, {
    MONGODB_URI: string;
    JWT_SECRET: string;
    CLIENT_ORIGIN: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: string | undefined;
    JWT_EXPIRES_IN?: string | undefined;
    ADMIN_EMAIL?: string | undefined;
    ADMIN_PASSWORD?: string | undefined;
}>;
type Env = z.infer<typeof envSchema>;
declare let env: Env;
export default env;
//# sourceMappingURL=env.d.ts.map