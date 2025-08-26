import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables with absolute path
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // Server
  PORT: z.string().default('5000').transform(val => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CLIENT_ORIGIN: z.string().url('CLIENT_ORIGIN must be a valid URL'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  // Admin (for seeding)
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email').optional(),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters').optional(),
});

type Env = z.infer<typeof envSchema>;

// Validate environment variables
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    console.error('❌ Invalid environment variables:');
    missingVars.forEach(variable => console.error(`  • ${variable}`));
    process.exit(1);
  }
  throw error;
}

export default env;
