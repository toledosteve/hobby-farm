# Hobby Farm Backend API

NestJS backend API for the Hobby Farm Planner application.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: User registration, login, and profile management
- **MongoDB Integration**: Mongoose ODM for database operations
- **Validation**: Class-validator for request validation
- **CORS**: Configured for frontend integration

## Tech Stack

- NestJS
- MongoDB + Mongoose
- Passport JWT
- bcrypt
- class-validator

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or via Docker)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hobby-farm
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

### Running the App

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication

**Register a new user**
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "password": "securepassword"
}
```

**Login user**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "sarah@example.com",
  "password": "securepassword"
}
```

**Get current user profile**
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Response Format

Success response:
```json
{
  "user": {
    "id": "...",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah@example.com",
    "isActive": true,
    "createdAt": "2025-12-10T...",
    "updatedAt": "2025-12-10T..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── dto/            # User DTOs
│   ├── schemas/        # Mongoose schemas
│   ├── users.service.ts
│   └── users.module.ts
├── app.module.ts
└── main.ts
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Setup

Use Docker Compose to run the entire stack:

```bash
# From the project root
docker-compose up
```

This will start:
- MongoDB on port 27017
- Backend API on port 3001
- Frontend on port 5173
