# Backend Integration Guide

This guide explains how the UserDropdown and Projects are now connected to your backend API.

## Overview

The integration is complete! Your UserDropdown component now displays real user data from the backend, and farm/project data is persisted to MongoDB.

## What Was Implemented

### 1. Backend Projects Module

**Location:** `code/backend/src/projects/`

#### Files Created:
- **schemas/project.schema.ts** - MongoDB schema for projects
- **dto/create-project.dto.ts** - Validation for creating projects
- **dto/update-project.dto.ts** - Validation for updating projects
- **projects.service.ts** - Business logic for CRUD operations
- **projects.controller.ts** - REST API endpoints
- **projects.module.ts** - NestJS module definition

#### API Endpoints:
```
GET    /api/projects       - Get all projects for authenticated user
GET    /api/projects/:id   - Get a specific project
POST   /api/projects       - Create a new project
PATCH  /api/projects/:id   - Update a project
DELETE /api/projects/:id   - Delete a project
```

All endpoints require JWT authentication (via `JwtAuthGuard`).

### 2. Frontend Integration

#### Type Updates
**File:** `code/frontend/src/types/index.ts`

Updated `User` interface to match backend schema:
```typescript
export interface User {
  id: string;
  firstName: string;  // Changed from 'name'
  lastName: string;   // Added
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### New API Service
**File:** `code/frontend/src/services/api/projects.ts`

Created `projectsApi` with methods:
- `getAll()` - Fetch all projects
- `getById(id)` - Fetch single project
- `create(data)` - Create new project
- `update(id, data)` - Update project
- `delete(id)` - Delete project

#### Updated Services
**File:** `code/frontend/src/services/project.service.ts`

Updated to use the new `projectsApi` for all backend calls (while maintaining mock mode support).

#### Component Updates

**File:** `code/frontend/src/components/layouts/MainAppLayout.tsx`
- Now fetches user from `useAuth()` hook
- Computes `userName`, `userEmail`, and `userInitials` from real user data
- Passes these values to `UserDropdown`

**File:** `code/frontend/src/components/ui/AppHeader.tsx`
- Same updates as MainAppLayout

## How It Works

### Data Flow

```
1. User Authentication:
   User logs in → JWT token stored → Token sent with all API requests

2. User Data Display:
   AuthContext fetches user → GET /api/auth/me
   ↓
   MainAppLayout/AppHeader read from AuthContext
   ↓
   Compute display values (userName, userInitials)
   ↓
   Pass to UserDropdown component

3. Project/Farm Data:
   ProjectContext fetches projects → GET /api/projects
   ↓
   Projects stored in context state
   ↓
   Pass to UserDropdown as "farms" prop
   ↓
   User can switch between farms in dropdown
```

### Authentication Flow

1. **Login:** `POST /api/auth/login` → Returns `{ user, accessToken }`
2. **Token Storage:** JWT stored in localStorage via `tokenManager`
3. **Automatic Headers:** `httpClient` adds `Authorization: Bearer <token>` to all requests
4. **Protected Routes:** Backend validates JWT via `JwtAuthGuard`

## How to Test

### 1. Start the Backend

```bash
cd code/backend
npm install
npm run start:dev
```

Backend runs on: `http://localhost:3001`

### 2. Start the Frontend

```bash
cd code/frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Test User Registration

1. Navigate to signup screen
2. Register with: firstName, lastName, email, password
3. User data is stored in MongoDB
4. Automatic login after registration

### 4. Test UserDropdown

1. After login, check the UserDropdown in the top-right
2. You should see your actual name (not "Sarah Johnson")
3. Your initials should appear in the avatar
4. Your email should be displayed

### 5. Test Projects/Farms

1. Create a new project/farm
2. Data is saved to MongoDB via `POST /api/projects`
3. Projects appear in UserDropdown "Switch Farm" menu
4. Data persists across page refreshes

## API Configuration

**File:** `code/frontend/src/config/api.config.ts`

Set your backend URL:
```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  // ...
};
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/hobby-farm
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
PORT=3001
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string (unique),
  password: string (hashed),
  isActive: boolean,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: string,
  location: string,
  acres: number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Password Hashing:** Bcrypt with salt rounds
2. **JWT Authentication:** Stateless token-based auth
3. **User Ownership:** Projects filtered by authenticated user
4. **Input Validation:** class-validator DTOs
5. **Authorization Checks:** Services verify user owns resources

## Mock Mode Support

The frontend still supports mock mode for development:

**File:** `code/frontend/src/config/api.config.ts`
```typescript
export const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true';
```

Set `VITE_MOCK_MODE=true` in `.env` to use mock data without backend.

## Troubleshooting

### UserDropdown shows default values
- Check that `AuthContext` is providing user data
- Verify JWT token is being sent with requests
- Check browser console for API errors

### Projects not loading
- Ensure backend is running
- Check MongoDB connection
- Verify JWT token is valid
- Check Network tab for failed requests

### Type errors after changes
```bash
# Frontend
cd code/frontend
npm run type-check

# Backend
cd code/backend
npm run build
```

## Next Steps

Consider implementing:

1. **User Profile Updates:** PATCH `/api/users/me` endpoint
2. **Password Reset Flow:** Complete the forgot password feature
3. **Project Sharing:** Multi-user access to projects
4. **File Uploads:** Avatar images for users
5. **Real-time Updates:** WebSocket for collaborative features

## File Reference

### Backend Files
```
code/backend/src/
├── projects/
│   ├── schemas/project.schema.ts
│   ├── dto/create-project.dto.ts
│   ├── dto/update-project.dto.ts
│   ├── projects.service.ts
│   ├── projects.controller.ts
│   └── projects.module.ts
└── app.module.ts (updated)
```

### Frontend Files
```
code/frontend/src/
├── types/index.ts (updated)
├── services/
│   ├── api/projects.ts (new)
│   └── project.service.ts (updated)
├── contexts/
│   ├── AuthContext.tsx (existing)
│   └── ProjectContext.tsx (existing)
└── components/
    ├── layouts/
    │   ├── UserDropdown.tsx (existing)
    │   └── MainAppLayout.tsx (updated)
    └── ui/
        └── AppHeader.tsx (updated)
```

## Summary

Your UserDropdown is now fully integrated with the backend! User data comes from MongoDB via the auth API, and farm/project data is persisted with full CRUD operations. The component automatically displays the logged-in user's information and their associated farms.
