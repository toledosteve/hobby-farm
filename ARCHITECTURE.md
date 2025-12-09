# Hobby Farm Planner - Refactored Architecture

## 🎯 Overview

This application has been restructured to follow **enterprise-grade architectural best practices**, making it:
- **Modular**: Clear separation of concerns with distinct layers
- **Scalable**: Easy to add new features and modules
- **Maintainable**: Clean code organization and consistent patterns
- **Backend-Ready**: Service layer abstraction allows seamless transition from mock data to real API

## 📁 Project Structure

```
src/
├── components/          # React components (UI layer)
│   ├── auth/           # Authentication screens
│   ├── dashboard/      # Dashboard components
│   ├── layouts/        # Layout components
│   ├── maple/          # Maple sugaring module
│   ├── modules/        # Module management
│   ├── onboarding/     # Onboarding flow
│   ├── poultry/        # Poultry management module
│   ├── settings/       # Settings screens
│   ├── sidebar/        # Sidebar components
│   └── ui/             # Reusable UI components (shadcn/ui)
│
├── config/             # Application configuration
│   ├── api.config.ts   # API endpoints and configuration
│   └── env.d.ts        # Environment variable types
│
├── contexts/           # React Context providers (state management)
│   ├── AuthContext.tsx      # Authentication state
│   ├── ProjectContext.tsx   # Project management state
│   └── index.ts
│
├── hooks/              # Custom React hooks (business logic)
│   ├── useAsync.ts              # Async operation handling
│   ├── useDialog.ts             # Modal/dialog management
│   ├── useNavigation.ts         # Navigation state
│   ├── useProjectOperations.ts  # Project CRUD operations
│   └── index.ts
│
├── routes/             # Routing configuration
│   ├── RouteGuards.tsx  # Protected/Public route guards
│   ├── routes.ts        # Route definitions
│   └── index.ts
│
├── services/           # Service layer (API abstraction)
│   ├── auth.service.ts      # Authentication API
│   ├── project.service.ts   # Project API
│   ├── http-client.ts       # HTTP client configuration
│   ├── mock-data.ts         # Mock data for development
│   └── index.ts
│
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
│
├── App.tsx             # Main application component (OLD)
├── App.new.tsx         # Refactored application with routing (NEW)
└── main.tsx            # Application entry point
```

## 🏗️ Architecture Layers

### 1. **Service Layer** (`src/services/`)
- **Purpose**: Abstracts all backend communication
- **Key Feature**: Mock mode toggle - switch between mock data and real API
- **Files**:
  - `http-client.ts`: Centralized HTTP client with auth token management
  - `auth.service.ts`: Authentication operations (login, register, logout)
  - `project.service.ts`: Project CRUD operations
  - `mock-data.ts`: In-memory mock database for development

**Example**:
```typescript
// Switch between mock and real backend by changing env variable
// No code changes needed in components!
const projects = await projectService.getProjects();
```

### 2. **Context Layer** (`src/contexts/`)
- **Purpose**: Global state management using React Context
- **Key Providers**:
  - `AuthContext`: User authentication state
  - `ProjectContext`: Project data and operations

**Example**:
```typescript
const { user, login, logout } = useAuth();
const { projects, createProject, currentProject } = useProjects();
```

### 3. **Hooks Layer** (`src/hooks/`)
- **Purpose**: Reusable business logic and state management
- **Key Hooks**:
  - `useAsync`: Handle async operations with loading/error states
  - `useDialog`: Manage modal visibility
  - `useNavigation`: Navigation state management
  - `useProjectOperations`: Project CRUD with toast notifications

### 4. **Routes Layer** (`src/routes/`)
- **Purpose**: Application routing and navigation guards
- **Features**:
  - Protected routes (require authentication)
  - Public routes (redirect if authenticated)
  - Centralized route definitions

### 5. **Component Layer** (`src/components/`)
- **Purpose**: UI presentation and user interaction
- **Organization**: Feature-based folders (auth, dashboard, maple, poultry, etc.)

## 🔄 Replacing Mock Data with Real Backend

The architecture is designed to make backend integration seamless:

### Step 1: Set up your backend
Create a REST API with these endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/reset-password

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/poultry/flocks
POST   /api/poultry/flocks
GET    /api/poultry/eggs
POST   /api/poultry/eggs

GET    /api/maple/trees
POST   /api/maple/trees
GET    /api/maple/collections
POST   /api/maple/collections

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Step 2: Configure environment variables

Update `.env`:
```bash
VITE_API_BASE_URL=https://your-api.com/api
VITE_USE_MOCK_DATA=false
```

### Step 3: That's it!

No code changes needed. The service layer automatically switches from mock mode to real API calls.

### Step 4: Add more services as needed

Create new service files following the same pattern:

```typescript
// src/services/poultry.service.ts
import { httpClient } from './http-client';
import { isMockMode } from '@/config/api.config';
import { Flock, EggLog } from '@/types';

class PoultryService {
  async getFlocks(): Promise<Flock[]> {
    if (isMockMode) {
      return [...mockDatabase.flocks];
    }
    return httpClient.get('/poultry/flocks');
  }
  
  async logEggs(data: CreateEggLogDto): Promise<EggLog> {
    if (isMockMode) {
      // Mock implementation
    }
    return httpClient.post('/poultry/eggs', data);
  }
}

export const poultryService = new PoultryService();
```

## 🔐 Authentication Flow

1. User submits login form → Component calls `useAuth().login()`
2. `AuthContext` calls `authService.login()`
3. `authService` checks `isMockMode`:
   - **Mock**: Returns mock user data
   - **Real**: Makes API call to `/api/auth/login`
4. Auth token stored in localStorage
5. `AuthContext` updates state with user data
6. Protected routes now accessible

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run lint
```

## 🎨 Key Features

### ✅ Separation of Concerns
- UI components focus on presentation
- Business logic in custom hooks
- API calls in service layer
- Global state in context providers

### ✅ Type Safety
- Full TypeScript support
- Shared type definitions in `src/types/`
- Compile-time error detection

### ✅ Modular Design
- Easy to add new modules (e.g., beekeeping, gardening)
- Feature-based organization
- Minimal coupling between modules

### ✅ Developer Experience
- Hot module replacement
- Clear error messages
- Consistent patterns
- Easy to test

### ✅ Production Ready
- Environment-based configuration
- Error handling
- Loading states
- Toast notifications
- Route protection

## 📝 Adding a New Feature Module

Example: Adding a "Beekeeping" module

1. **Create types** (`src/types/index.ts`):
```typescript
export interface Hive {
  id: string;
  projectId: string;
  name: string;
  beeCount: number;
  // ...
}
```

2. **Create service** (`src/services/beekeeping.service.ts`):
```typescript
class BeekeepingService {
  async getHives(): Promise<Hive[]> { /* ... */ }
  async createHive(data: CreateHiveDto): Promise<Hive> { /* ... */ }
}
export const beekeepingService = new BeekeepingService();
```

3. **Create components** (`src/components/beekeeping/`):
```typescript
export function BeekeepingDashboard() { /* ... */ }
```

4. **Add routes** (`src/routes/routes.ts` and `App.new.tsx`):
```typescript
BEEKEEPING: {
  DASHBOARD: '/app/modules/beekeeping',
}
```

5. **Done!** The module is now fully integrated.

## 🔧 Configuration Files

- `.env`: Environment variables
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `package.json`: Dependencies and scripts

## 📚 Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **React Router**: Routing
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Shadcn/UI**: Component library
- **Sonner**: Toast notifications
- **React Hook Form**: Form management

## 🤝 Contributing

When adding new features:
1. Follow the existing folder structure
2. Create types in `src/types/`
3. Create services in `src/services/`
4. Create contexts if needed for state management
5. Create custom hooks for business logic
6. Create components for UI
7. Update routes if needed

## 📄 License

Private project
