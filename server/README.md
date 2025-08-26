# Portfolio Server

A robust Express.js TypeScript server for the portfolio application with MongoDB, JWT authentication, and Cloudinary integration.

## Features

- 🔐 **JWT Authentication** - Secure admin authentication system
- 🗄️ **MongoDB Integration** - Mongoose ODM with schema validation
- ☁️ **Cloudinary Upload** - File upload with automatic cloud storage
- 🛡️ **Security Middlewares** - Helmet, CORS, rate limiting, and more
- 📝 **API Response Pattern** - Consistent response structure
- 🔍 **Environment Validation** - Zod-based environment variable validation
- 📊 **Logging** - Structured logging with Pino
- 🌱 **Database Seeding** - Sample data generation for development

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Projects (Public GET, Admin CUD)

- `GET /api/v1/projects` - List projects with pagination and filters
- `GET /api/v1/projects/:slugOrId` - Get project by slug or ID
- `POST /api/v1/projects` - Create project (Admin)
- `PUT /api/v1/projects/:id` - Update project (Admin)
- `DELETE /api/v1/projects/:id` - Delete project (Admin)

### Certificates (Public GET, Admin CUD)

- `GET /api/v1/certificates` - List certificates with pagination
- `GET /api/v1/certificates/:id` - Get certificate by ID
- `POST /api/v1/certificates` - Create certificate (Admin)
- `PUT /api/v1/certificates/:id` - Update certificate (Admin)
- `DELETE /api/v1/certificates/:id` - Delete certificate (Admin)

### Timeline (Public GET, Admin CUD)

- `GET /api/v1/timeline` - List timeline items
- `GET /api/v1/timeline/:id` - Get timeline item by ID
- `POST /api/v1/timeline` - Create timeline item (Admin)
- `PUT /api/v1/timeline/:id` - Update timeline item (Admin)
- `DELETE /api/v1/timeline/:id` - Delete timeline item (Admin)

### Skills (Public GET, Admin CUD)

- `GET /api/v1/skills` - List skills with grouping by category
- `GET /api/v1/skills/:id` - Get skill by ID
- `POST /api/v1/skills` - Create skill (Admin)
- `PUT /api/v1/skills/:id` - Update skill (Admin)
- `DELETE /api/v1/skills/:id` - Delete skill (Admin)

### Contact

- `POST /api/v1/contact` - Send contact message (Public)
- `GET /api/v1/contact` - List contact messages (Admin)
- `PUT /api/v1/contact/:id/read` - Mark message as read (Admin)
- `DELETE /api/v1/contact/:id` - Delete message (Admin)

### Upload (Admin only)

- `POST /api/v1/upload/single` - Upload single file
- `POST /api/v1/upload/multiple` - Upload multiple files
- `DELETE /api/v1/upload/:publicId` - Delete file from Cloudinary

### Health

- `GET /api/health` - Health check endpoint

## Environment Variables

Copy `env.example` to `.env` and update the values:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-must-be-at-least-32-characters
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_ORIGIN=http://localhost:3000

# Admin (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment:**

   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

3. **Start MongoDB:**

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or start your local MongoDB service
   ```

4. **Seed the database:**

   ```bash
   pnpm run seed:dev
   ```

5. **Start the server:**

   ```bash
   # Development
   pnpm run dev

   # Production
   pnpm run build
   pnpm start
   ```

## Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm run seed` - Seed database with sample data
- `pnpm run seed:dev` - Seed database in development mode
- `pnpm run typecheck` - Type check without building
- `pnpm run lint` - Lint code
- `pnpm run lint:fix` - Fix linting issues
- `pnpm run clean` - Clean build directory

## Database Schema

### User

- Email, password hash, role (admin only)

### Project

- Title, slug, description, tags, links (GitHub/live), images, featured flag, order

### Certificate

- Title, organization, issue date, credential ID, URL, image, tags

### TimelineItem

- Title, start/end dates, description, bullet points, icon, location

### Skill

- Name, level (0-100), category

### ContactMessage

- Name, email, message, read status, timestamp

## Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Mongoose schema validation
- **File Upload Security** - Type and size restrictions

## Error Handling

Comprehensive error handling with:

- Custom error classes
- Mongoose error handling
- JWT error handling
- Validation error formatting
- Structured error responses

## API Response Format

All API responses follow a consistent format:

```typescript
// Success Response
{
  success: true,
  message?: string,
  data?: any,
  meta?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error Response
{
  success: false,
  error: string,
  errors?: string[]
}
```

## Development

The server uses:

- **TypeScript** for type safety
- **Mongoose** for MongoDB ODM
- **Express.js** for web framework
- **Pino** for logging
- **Zod** for environment validation
- **JWT** for authentication
- **Multer + Cloudinary** for file uploads

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Update API documentation
5. Test your changes
