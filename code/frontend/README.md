
  # 🚜 Hobby Farm Planner

A professional, enterprise-grade farm management application built with React, TypeScript, and modern architectural best practices.

> **Original Design**: https://www.figma.com/design/wN3sEc898tEgMOFkuWKtGY/Hobby-Farm-Land-Planner-UI

## ✨ Features

- 🔐 **Authentication** - Complete auth system with login, registration, password reset
- 📊 **Project Management** - Create and manage multiple farm projects
- 🗺️ **Land Mapping** - Interactive map for land planning and boundary management
- 📅 **Calendar** - Task scheduling and farm activity planning
- 🐔 **Poultry Management** - Track flocks, egg production, feed logs, and health events
- 🍁 **Maple Sugaring** - Manage maple trees, sap collection, and boiling sessions
- ⚙️ **Settings** - Comprehensive settings for farm, modules, and user preferences
- 🎯 **Modular Design** - Easy to add new modules (beekeeping, gardening, etc.)

## 🏗️ Architecture Highlights

This application follows **enterprise-grade architectural patterns**:

- **Service Layer** - Complete API abstraction with mock/real backend toggle
- **Context Providers** - Clean state management without prop drilling
- **Custom Hooks** - Reusable business logic
- **React Router** - Proper routing with protected routes
- **TypeScript** - Full type safety throughout
- **Modular Structure** - Clear separation of concerns

### Toggle Between Mock Data and Real Backend

```bash
# Development with mock data
VITE_USE_MOCK_DATA=true

# Production with real API
VITE_USE_MOCK_DATA=false
```

**That's it!** No code changes needed.

## 🚀 Quick Start

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

## 📁 Project Structure

```
src/
├── components/     # React components (UI layer)
├── config/         # Configuration files
├── contexts/       # React Context providers (state management)
├── hooks/          # Custom React hooks (business logic)
├── routes/         # Routing configuration
├── services/       # Service layer (API abstraction)
├── types/          # TypeScript type definitions
└── App.tsx         # Main application component
```

## 📚 Documentation

- **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** - Overview of the refactoring
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architectural guide
- **[ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md)** - Visual architecture diagrams
- **[MIGRATION.md](./MIGRATION.md)** - Migration guide for updating components
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference for adding features
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Implementation checklist

## 🔧 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - High-quality component library
- **Sonner** - Toast notifications
- **React Hook Form** - Form management
- **Recharts** - Data visualization

## 🎯 Key Features for Developers

### 1. Easy Backend Integration

The service layer is designed to make backend integration seamless:

```typescript
// src/services/project.service.ts
async getProjects(): Promise<Project[]> {
  if (isMockMode) {
    return [...mockDatabase.projects];  // Mock data
  }
  
  return httpClient.get('/projects');  // Real API
}
```

Just change the environment variable to switch!

### 2. Type-Safe Throughout

All data models, API requests, and responses are fully typed:

```typescript
interface Project {
  id: string;
  userId: string;
  name: string;
  location: string;
  acres?: number;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Clean State Management

Use contexts and hooks instead of prop drilling:

```typescript
// In any component
const { user, login, logout } = useAuth();
const { projects, createProject } = useProjects();
```

### 4. Modular and Extensible

Adding a new module (e.g., Beekeeping) is straightforward:

1. Define types
2. Create service
3. Create context
4. Create components
5. Add routes

See `QUICK_REFERENCE.md` for step-by-step guide.

## 🔐 Authentication

The app includes a complete authentication system:

- Login / Sign up
- Password reset
- JWT token management
- Protected routes
- Auto-redirect based on auth state

## 🗺️ Routing

Clean, URL-based routing with protection:

```
/welcome              → Welcome screen (public)
/signin              → Sign in (public)
/signup              → Sign up (public)
/projects            → Project list (protected)
/app/dashboard       → Farm dashboard (protected)
/app/map             → Land mapping (protected)
/app/modules/poultry → Poultry module (protected)
/app/modules/maple   → Maple sugaring (protected)
```

## 🎨 Current Status

**Core Architecture**: ✅ Complete
- Service layer with mock/real API toggle
- Context providers for state management
- Custom hooks for business logic
- React Router integration
- Full TypeScript types
- Configuration management

**Components**: 🔄 In Progress
- Existing components need updating to use new architecture
- See `NEXT_STEPS.md` for migration checklist

## 🚀 Next Steps

1. Review the architecture documentation
2. Install dependencies: `npm install`
3. Update components to use contexts and routing (see `MIGRATION.md`)
4. Test thoroughly
5. Deploy!

For detailed next steps, see `NEXT_STEPS.md`.

## 🤝 Contributing

When adding new features:

1. Follow the existing folder structure
2. Create types in `src/types/`
3. Create services in `src/services/`
4. Create contexts for state management
5. Create custom hooks for business logic
6. Create components for UI
7. Update routes

See `QUICK_REFERENCE.md` for detailed patterns and examples.

## 📄 License

Private project

## 🎓 Learning Resource

This codebase demonstrates:
- Clean Architecture / Layered Architecture
- Service Layer Pattern
- Context API best practices
- Custom hooks patterns
- React Router v6
- TypeScript best practices
- Modular component design

Perfect for learning modern React application architecture!

---

**Built with ❤️ for hobby farmers everywhere** 🌾🚜

  