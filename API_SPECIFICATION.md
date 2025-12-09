# Backend API Specification

This document defines the REST API endpoints expected by the frontend application.

## Base URL

```
Production: https://api.hobbyfarm.com/api
Development: http://localhost:3000/api
```

## Authentication

All authenticated requests require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "data": { /* result data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400,
  "errors": {
    "field": ["Validation error message"]
  }
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-12-08T10:00:00Z",
      "updatedAt": "2025-12-08T10:00:00Z"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

### POST /auth/login
Authenticate a user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-12-08T10:00:00Z",
      "updatedAt": "2025-12-08T10:00:00Z"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

### POST /auth/logout
Logout current user (invalidate tokens).

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Response (200):**
```json
{
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### POST /auth/reset-password
Request password reset email.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

## Project Endpoints

### GET /projects
Get all projects for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "data": [
    {
      "id": "project-uuid",
      "userId": "user-uuid",
      "name": "Livingston Farm",
      "location": "Vermont",
      "acres": 25,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### GET /projects/:id
Get a single project by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "data": {
    "id": "project-uuid",
    "userId": "user-uuid",
    "name": "Livingston Farm",
    "location": "Vermont",
    "acres": 25,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

### POST /projects
Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "New Farm",
  "location": "Maine",
  "acres": 30
}
```

**Response (201):**
```json
{
  "data": {
    "id": "project-uuid",
    "userId": "user-uuid",
    "name": "New Farm",
    "location": "Maine",
    "acres": 30,
    "createdAt": "2025-12-08T10:00:00Z",
    "updatedAt": "2025-12-08T10:00:00Z"
  }
}
```

### PUT /projects/:id
Update a project.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Updated Farm Name",
  "acres": 35
}
```

**Response (200):**
```json
{
  "data": {
    "id": "project-uuid",
    "userId": "user-uuid",
    "name": "Updated Farm Name",
    "location": "Maine",
    "acres": 35,
    "createdAt": "2025-12-08T10:00:00Z",
    "updatedAt": "2025-12-08T10:05:00Z"
  }
}
```

### DELETE /projects/:id
Delete a project.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

## Poultry Endpoints

### GET /poultry/flocks
Get all flocks for a project.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `projectId` (required): Project ID

**Response (200):**
```json
{
  "data": [
    {
      "id": "flock-uuid",
      "projectId": "project-uuid",
      "name": "Main Coop",
      "breed": "Rhode Island Red",
      "birdCount": 12,
      "startDate": "2025-01-01",
      "purpose": "eggs",
      "housingType": "coop",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### POST /poultry/flocks
Create a new flock.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "name": "New Flock",
  "breed": "Plymouth Rock",
  "birdCount": 8,
  "startDate": "2025-12-08",
  "purpose": "dual-purpose",
  "housingType": "free-range"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "flock-uuid",
    "projectId": "project-uuid",
    "name": "New Flock",
    "breed": "Plymouth Rock",
    "birdCount": 8,
    "startDate": "2025-12-08",
    "purpose": "dual-purpose",
    "housingType": "free-range",
    "createdAt": "2025-12-08T10:00:00Z",
    "updatedAt": "2025-12-08T10:00:00Z"
  }
}
```

### GET /poultry/eggs
Get egg production logs.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `projectId` (required): Project ID
- `flockId` (optional): Filter by flock
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

**Response (200):**
```json
{
  "data": [
    {
      "id": "egg-log-uuid",
      "projectId": "project-uuid",
      "flockId": "flock-uuid",
      "date": "2025-12-08",
      "count": 10,
      "notes": "Good production day",
      "createdAt": "2025-12-08T10:00:00Z",
      "updatedAt": "2025-12-08T10:00:00Z"
    }
  ]
}
```

### POST /poultry/eggs
Log egg production.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "flockId": "flock-uuid",
  "date": "2025-12-08",
  "count": 10,
  "notes": "Good production day"
}
```

**Response (201):** Similar to GET response

### POST /poultry/feed
Log feed usage.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "flockId": "flock-uuid",
  "date": "2025-12-08",
  "feedType": "Layer pellets",
  "amount": 50,
  "unit": "lbs",
  "cost": 25.00,
  "notes": "Weekly feed"
}
```

### POST /poultry/health
Log health event.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "flockId": "flock-uuid",
  "date": "2025-12-08",
  "eventType": "vaccination",
  "description": "Annual vaccination",
  "treatment": "Newcastle vaccine",
  "outcome": "Successful"
}
```

---

## Maple Sugaring Endpoints

### GET /maple/trees
Get all maple trees for a project.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `projectId` (required): Project ID

**Response (200):**
```json
{
  "data": [
    {
      "id": "tree-uuid",
      "projectId": "project-uuid",
      "treeNumber": "001",
      "species": "sugar-maple",
      "diameter": 18,
      "tapCount": 2,
      "latitude": 44.2587,
      "longitude": -72.5754,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### POST /maple/trees
Add a new maple tree.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "treeNumber": "002",
  "species": "sugar-maple",
  "diameter": 20,
  "tapCount": 2,
  "latitude": 44.2588,
  "longitude": -72.5755
}
```

### GET /maple/collections
Get sap collection logs.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `projectId` (required): Project ID
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

**Response (200):**
```json
{
  "data": [
    {
      "id": "collection-uuid",
      "projectId": "project-uuid",
      "treeId": "tree-uuid",
      "date": "2025-03-15",
      "gallons": 5.5,
      "sugarContent": 2.5,
      "notes": "Good flow today",
      "createdAt": "2025-03-15T10:00:00Z",
      "updatedAt": "2025-03-15T10:00:00Z"
    }
  ]
}
```

### POST /maple/collections
Log sap collection.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "treeId": "tree-uuid",
  "date": "2025-03-15",
  "gallons": 5.5,
  "sugarContent": 2.5,
  "notes": "Good flow today"
}
```

### GET /maple/boil-sessions
Get boiling session logs.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `projectId` (required): Project ID

**Response (200):**
```json
{
  "data": [
    {
      "id": "boil-uuid",
      "projectId": "project-uuid",
      "date": "2025-03-20",
      "startTime": "08:00:00",
      "endTime": "16:00:00",
      "sapInput": 40,
      "syrupOutput": 1,
      "grade": "Grade A Amber",
      "notes": "Perfect day for boiling",
      "createdAt": "2025-03-20T10:00:00Z",
      "updatedAt": "2025-03-20T10:00:00Z"
    }
  ]
}
```

### POST /maple/boil-sessions
Log boiling session.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "date": "2025-03-20",
  "startTime": "08:00:00",
  "endTime": "16:00:00",
  "sapInput": 40,
  "syrupOutput": 1,
  "grade": "Grade A Amber",
  "notes": "Perfect day for boiling"
}
```

---

## Task Endpoints

### GET /tasks
Get all tasks for a project.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `projectId` (required): Project ID
- `moduleType` (optional): Filter by module (maple, poultry, general)
- `completed` (optional): Filter by completion status

**Response (200):**
```json
{
  "data": [
    {
      "id": "task-uuid",
      "projectId": "project-uuid",
      "moduleType": "poultry",
      "title": "Clean coops",
      "description": "Weekly coop cleaning",
      "dueDate": "2025-12-10",
      "completed": false,
      "priority": "high",
      "createdAt": "2025-12-08T10:00:00Z",
      "updatedAt": "2025-12-08T10:00:00Z"
    }
  ]
}
```

### POST /tasks
Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "projectId": "project-uuid",
  "moduleType": "poultry",
  "title": "Clean coops",
  "description": "Weekly coop cleaning",
  "dueDate": "2025-12-10",
  "priority": "high"
}
```

### PUT /tasks/:id
Update a task.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "completed": true
}
```

### DELETE /tasks/:id
Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 204  | No Content |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 422  | Validation Error |
| 500  | Internal Server Error |

---

## Notes for Backend Developers

1. **Authentication**: Use JWT tokens with 1-hour expiry
2. **Refresh Tokens**: Issue refresh tokens with 30-day expiry
3. **Validation**: Return detailed validation errors in the `errors` field
4. **Pagination**: Support `page` and `limit` query parameters
5. **CORS**: Enable CORS for frontend domain
6. **Rate Limiting**: Implement rate limiting for API endpoints
7. **Database**: Use UUID for all IDs
8. **Timestamps**: Always include `createdAt` and `updatedAt`
9. **Soft Deletes**: Consider implementing soft deletes for important data
10. **Relations**: Ensure proper foreign key relationships and cascading deletes

---

## Testing the API

Use the mock mode in the frontend to develop without a backend:

```bash
# .env
VITE_USE_MOCK_DATA=true
```

When backend is ready, switch to real mode:

```bash
# .env
VITE_API_BASE_URL=https://api.hobbyfarm.com/api
VITE_USE_MOCK_DATA=false
```

The frontend will automatically start using the real API!
