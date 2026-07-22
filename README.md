# Webify Solutions - Backend API

Complete backend implementation for Webify Solutions, an enterprise software company website with courses, services, blog, and admin dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js (Credentials + Google OAuth), JWT sessions
- **Validation**: Zod
- **Rate limiting**: Upstash Redis
- **CAPTCHA**: Cloudflare Turnstile
- **Media**: Cloudinary
- **Email**: Resend

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Secret for NextAuth session encryption
   - `NEXTAUTH_URL` - Your application URL
   - `RESEND_API_KEY` - Resend API key for emails
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis credentials
   - `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile credentials

3. **Set up the database**
   ```bash
   # Push schema to database (for development)
   npm run prisma:push
   
   # Or create a migration (for production)
   npm run prisma:migrate
   ```

4. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

5. **Seed the database**
   ```bash
   npm run prisma:seed
   ```
   This creates a Super Admin user (email: `admin@webify-solutions.com`, password: `Admin123!`) and sample data.

6. **Start the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:migrate` - Create and run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data

## API Routes

### Authentication
- `POST /api/auth/register` - User registration with email verification
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET/POST /api/auth/[...nextauth]` - NextAuth session management

### Courses
- `GET /api/courses` - List courses (public)
- `POST /api/courses` - Create course (admin only)
- `GET /api/courses/[slug]` - Get course by slug
- `PATCH /api/courses/[slug]` - Update course (admin only)
- `DELETE /api/courses/[slug]` - Delete course (admin only)

### Modules & Lessons
- `GET/POST /api/modules` - List/create modules
- `GET/PATCH/DELETE /api/modules/[id]` - Module operations
- `GET/POST /api/lessons` - List/create lessons
- `GET/PATCH/DELETE /api/lessons/[id]` - Lesson operations

### Enrollments
- `GET /api/enrollments` - List enrollments
- `POST /api/enrollments` - Enroll in course (with Turnstile verification)
- `GET/PATCH/DELETE /api/enrollments/[id]` - Enrollment operations

### Services
- `GET /api/services` - List services (public)
- `POST /api/services` - Create service (admin only)
- `GET/PATCH/DELETE /api/services/[slug]` - Service operations

### Portfolio
- `GET /api/portfolio` - List portfolio items (public)
- `POST /api/portfolio` - Create portfolio item (editor+)
- `GET/PATCH/DELETE /api/portfolio/[slug]` - Portfolio operations

### Blog
- `GET /api/blog` - List blog posts (public)
- `POST /api/blog` - Create blog post (editor+)
- `GET/PATCH/DELETE /api/blog/[slug]` - Blog operations

### Other Content
- `GET/POST /api/testimonials` - Testimonials
- `GET/POST /api/faq` - FAQ
- `GET/POST /api/pricing` - Pricing plans
- `GET/POST /api/careers` - Career listings

### Contact & Newsletter
- `POST /api/inquiries` - Submit inquiry (with Turnstile + rate limiting)
- `GET/PATCH/DELETE /api/inquiries/[id]` - Inquiry management (admin)
- `POST /api/newsletter` - Subscribe to newsletter
- `DELETE /api/newsletter` - Unsubscribe

### Media & Search
- `POST /api/media/upload` - Upload media to Cloudinary (editor+)
- `GET /api/search` - Global search across all content (with rate limiting)

## Role-Based Access Control (RBAC)

- **SUPER_ADMIN** - Full access to all resources
- **ADMIN** - Can manage courses, services, pricing, careers, inquiries
- **EDITOR** - Can manage blog, portfolio, testimonials, FAQ, media
- **USER** - Can enroll in courses, submit inquiries, subscribe to newsletter

## Security Features

- **Turnstile CAPTCHA** - Server-side verification on protected forms
- **Rate Limiting** - Upstash Redis-based rate limiting on auth and public endpoints
- **Input Validation** - Zod schemas on all API inputs
- **RBAC** - Role-based access control on all protected routes
- **Password Hashing** - bcryptjs with 12 rounds
- **Email Verification** - Required for new user accounts

## Notes

- TypeScript errors related to Prisma types will resolve after running `npm run prisma:generate`
- The Prisma client uses a singleton pattern for serverless compatibility
- All error responses follow a consistent format with error codes and messages
