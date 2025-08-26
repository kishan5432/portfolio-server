"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables with absolute path
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const envSchema = zod_1.z.object({
    // Database
    MONGODB_URI: zod_1.z.string().min(1, 'MONGODB_URI is required'),
    // Server
    PORT: zod_1.z.string().default('5000').transform(val => parseInt(val, 10)),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // JWT
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    // CORS
    CLIENT_ORIGIN: zod_1.z.string().url('CLIENT_ORIGIN must be a valid URL'),
    // Cloudinary
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
    // Admin (for seeding)
    ADMIN_EMAIL: zod_1.z.string().email('ADMIN_EMAIL must be a valid email').optional(),
    ADMIN_PASSWORD: zod_1.z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters').optional(),
});
// Validate environment variables
let env;
try {
    env = envSchema.parse(process.env);
}
catch (error) {
    if (error instanceof zod_1.z.ZodError) {
        const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        console.error('❌ Invalid environment variables:');
        missingVars.forEach(variable => console.error(`  • ${variable}`));
        process.exit(1);
    }
    throw error;
}
exports.default = env;
//# sourceMappingURL=env.js.map