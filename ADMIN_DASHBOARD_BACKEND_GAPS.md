# Admin Dashboard - Backend Gaps and Missing Endpoints

This document summarizes the backend API gaps identified during the admin dashboard frontend development.

## Missing Endpoints

### 1. Newsletter Subscribers - GET Endpoint
- **Location**: `app/api/newsletter/route.ts`
- **Issue**: Only POST (subscribe) and DELETE (unsubscribe) endpoints exist. No GET endpoint to retrieve all subscribers.
- **Impact**: The Newsletter admin page cannot fetch subscriber data from the backend.
- **Workaround**: Frontend shows empty state with message about missing endpoint.

### 2. Media Library - GET and DELETE Endpoints
- **Location**: `app/api/media/upload/route.ts`
- **Issue**: Only POST endpoint for upload exists. No GET endpoint to list media and no DELETE endpoint to remove media.
- **Impact**: The Media library page cannot display existing media or delete files.
- **Workaround**: Frontend shows empty state and upload functionality works, but listing/deleting requires backend endpoints.

### 3. Users Management - GET and PATCH Endpoints
- **Location**: No `app/api/users/` directory exists
- **Issue**: No endpoints to list users or update user roles.
- **Impact**: The Users management page cannot fetch users or change roles.
- **Workaround**: Frontend shows disabled UI with message about missing endpoints.

### 4. Settings - GET and PATCH Endpoints
- **Location**: No `app/api/settings/` directory exists
- **Issue**: No endpoints to retrieve or update platform settings.
- **Impact**: The Settings page is non-functional.
- **Workaround**: Frontend shows disabled UI with message about missing endpoints.

### 5. User Profile - PATCH Endpoint
- **Location**: No `app/api/user/profile/` directory exists
- **Issue**: No endpoint to update user profile (name, etc.).
- **Impact**: The Profile page cannot save changes.
- **Workaround**: Frontend shows form but save functionality is disabled with message.

### 6. Course Curriculum - Module/Lesson Management
- **Location**: `app/api/courses/[slug]/route.ts`
- **Issue**: The PATCH endpoint only updates basic course fields (title, slug, description, price, etc.). It does not handle nested module/lesson updates.
- **Impact**: The Course edit page cannot modify curriculum (modules and lessons).
- **Workaround**: Frontend shows a note that curriculum editing requires dedicated endpoints. New course creation with curriculum works via POST.

### 7. Media - DELETE Endpoint
- **Location**: No `app/api/media/[id]/route.ts`
- **Issue**: No endpoint to delete individual media files.
- **Impact**: Cannot remove uploaded media from the library.
- **Workaround**: Delete button exists but will fail without backend support.

## Recommendations

### Priority 1 (Critical for Admin Functionality)
1. **Add GET endpoint for newsletter subscribers** (`GET /api/newsletter`)
2. **Add GET endpoint for media library** (`GET /api/media`)
3. **Add DELETE endpoint for media** (`DELETE /api/media/[id]`)
4. **Add GET endpoint for users** (`GET /api/users`)
5. **Add PATCH endpoint for user roles** (`PATCH /api/users/[id]`)

### Priority 2 (Important for Complete Experience)
1. **Add PATCH endpoint for course curriculum** to support module/lesson updates
2. **Add GET/PATCH endpoints for settings** (`GET /api/settings`, `PATCH /api/settings`)
3. **Add PATCH endpoint for user profile** (`PATCH /api/user/profile`)

### Priority 3 (Nice to Have)
1. **Add pagination support** to all GET endpoints
2. **Add filtering and sorting** options for better UX
3. **Add bulk operations** (e.g., bulk delete media, bulk update inquiries)

## RBAC Considerations

All new endpoints should include proper RBAC checks:
- **Newsletter**: EDITOR role or above
- **Media**: EDITOR role or above
- **Users**: SUPER_ADMIN only for role changes
- **Settings**: ADMIN role or above
- **Profile**: User can update their own profile

## Existing Working Endpoints

The following endpoints are fully functional and used by the admin dashboard:

- `GET/POST /api/courses` - Course listing and creation
- `GET/PATCH/DELETE /api/courses/[slug]` - Single course operations
- `GET/POST /api/blog` - Blog listing and creation
- `GET/PATCH/DELETE /api/blog/[slug]` - Single blog operations
- `GET/POST /api/services` - Services listing and creation
- `GET/PATCH/DELETE /api/services/[slug]` - Single service operations
- `GET/POST /api/portfolio` - Portfolio listing and creation
- `GET/PATCH/DELETE /api/portfolio/[slug]` - Single portfolio operations
- `GET/POST /api/testimonials` - Testimonials listing and creation
- `GET/PATCH/DELETE /api/testimonials/[id]` - Single testimonial operations
- `GET/POST /api/faq` - FAQ listing and creation
- `GET/PATCH/DELETE /api/faq/[id]` - Single FAQ operations
- `GET/POST /api/pricing` - Pricing plans listing and creation
- `GET/PATCH/DELETE /api/pricing/[id]` - Single pricing plan operations
- `GET/POST /api/careers` - Career listings and creation
- `GET/PATCH/DELETE /api/careers/[id]` - Single career operations
- `GET/PATCH/DELETE /api/inquiries` - Inquiries management
- `POST /api/media/upload` - Media upload
- `GET/POST /api/modules` - Course modules
- `GET/POST /api/lessons` - Course lessons
- `GET/POST /api/enrollments` - Enrollments management
