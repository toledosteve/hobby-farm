# Migration Guide: From Old to New Architecture

## Overview

This guide helps you transition from the monolithic `App.tsx` to the new modular architecture.

## What Changed?

### Before (Old Architecture)
- ❌ All state management in `App.tsx` (500+ lines)
- ❌ Hardcoded mock data scattered throughout components
- ❌ No clear separation between UI and business logic
- ❌ Difficult to replace mock data with real backend
- ❌ Props drilling through multiple component levels

### After (New Architecture)
- ✅ Modular service layer with mock/real API toggle
- ✅ Context providers for clean state management
- ✅ Custom hooks for reusable business logic
- ✅ React Router for proper routing
- ✅ Type-safe TypeScript throughout
- ✅ Easy to extend with new features

## Migration Steps

### Option 1: Fresh Start (Recommended)

1. **Install new dependencies**:
```bash
npm install
```

2. **Update main.tsx** to use the new App:
```tsx
// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.new.tsx";  // Change from "./App.tsx"
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

3. **Start development server**:
```bash
npm run dev
```

4. **Components need updates** - See "Component Updates" section below

### Option 2: Gradual Migration

Keep the old `App.tsx` and migrate features one by one:

1. Start using services for new features
2. Gradually move state to contexts
3. Convert components to use hooks
4. Finally switch to new App

## Component Updates Needed

The new architecture requires updating components to work with contexts and routing. Here's what needs to change:

### Auth Components

**Before**:
```tsx
<SignInScreen
  onSignIn={handleSignIn}
  onCreateAccountClick={() => setAuthView('signup')}
  onForgotPasswordClick={() => setAuthView('forgot-password')}
/>
```

**After** - Components should use hooks and routing:
```tsx
// In SignInScreen.tsx
import { useAuth } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export function SignInScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await login(data.email, data.password);
    navigate(ROUTES.PROJECTS);
  };

  return (
    // ... form UI
  );
}
```

### Project Components

**Before**:
```tsx
<ProjectsDashboard
  projects={projects}
  onCreateNew={handleCreateNew}
  onOpenProject={handleOpenProject}
/>
```

**After**:
```tsx
// In ProjectsDashboard.tsx
import { useProjects } from '@/contexts';
import { useNavigate } from 'react-router-dom';

export function ProjectsDashboard() {
  const { projects, setCurrentProject } = useProjects();
  const navigate = useNavigate();

  const handleOpenProject = (project) => {
    setCurrentProject(project);
    navigate(ROUTES.APP.DASHBOARD);
  };

  return (
    // ... UI
  );
}
```

### Layout Components

**Before**:
```tsx
<MainAppLayout
  activeTab={activeTab}
  onTabChange={setActiveTab}
  currentProject={currentProject}
>
  {children}
</MainAppLayout>
```

**After** - Layout as route wrapper:
```tsx
// In App.new.tsx
<Route path="/app" element={<MainAppLayout />}>
  <Route path="dashboard" element={<FarmDashboard />} />
  <Route path="map" element={<MapScreen />} />
</Route>

// In MainAppLayout.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts';

export function MainAppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProject } = useProjects();

  const activeTab = location.pathname.split('/')[2] || 'dashboard';

  return (
    <div>
      {/* Navigation tabs */}
      <nav>
        <button onClick={() => navigate('/app/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/app/map')}>Map</button>
      </nav>
      
      {/* Render child routes */}
      <Outlet />
    </div>
  );
}
```

## File-by-File Component Updates

### 1. Update Auth Components

Each auth component should:
- Remove `onXxx` props
- Use `useAuth()` hook
- Use `useNavigate()` for routing
- Handle form submission internally

**Example**: `src/components/auth/SignInScreen.tsx`
```tsx
import { useAuth } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';

export function SignInScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      toast.success('Signed in successfully!');
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    // ... existing UI with form
    // Call handleSignIn on submit
  );
}
```

### 2. Update ProjectsDashboard

```tsx
import { useProjects } from '@/contexts';
import { useProjectOperations } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export function ProjectsDashboard() {
  const { projects, setCurrentProject } = useProjects();
  const { 
    handleDeleteProject,
    handleDuplicateProject,
    isProcessing 
  } = useProjectOperations();
  const navigate = useNavigate();

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    navigate(ROUTES.APP.DASHBOARD);
  };

  const handleCreateNew = () => {
    navigate(ROUTES.ONBOARDING);
  };

  return (
    // ... existing UI
    // Use projects from context, not props
  );
}
```

### 3. Update OnboardingFlow

```tsx
import { useProjectOperations } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export function OnboardingFlow() {
  const { handleCreateProject } = useProjectOperations();
  const navigate = useNavigate();

  const handleComplete = async (data) => {
    const project = await handleCreateProject(data);
    navigate(ROUTES.APP.DASHBOARD);
  };

  const handleCancel = () => {
    navigate(ROUTES.PROJECTS);
  };

  return (
    // ... existing UI
  );
}
```

### 4. Update MainAppLayout

```tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProjects, useAuth } from '@/contexts';
import { ROUTES } from '@/routes';

export function MainAppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProject, projects, setCurrentProject } = useProjects();
  const { logout } = useAuth();

  const activeTab = location.pathname.split('/')[2] || 'dashboard';

  const handleTabChange = (tab: string) => {
    navigate(`/app/${tab}`);
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  return (
    <div>
      {/* Header with project selector */}
      {/* Navigation tabs */}
      
      {/* Child routes render here */}
      <Outlet />
    </div>
  );
}
```

### 5. Update Dashboard Components

```tsx
// src/components/dashboard/FarmDashboard.tsx
import { useProjects } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export function FarmDashboard() {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  if (!currentProject) {
    return <div>No project selected</div>;
  }

  return (
    // ... existing UI
    // Use currentProject from context
  );
}
```

## New Features Available

### 1. Easy API Integration

```typescript
// Just change env variable!
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.hobbyfarm.com
```

### 2. Centralized Error Handling

```typescript
const { handleCreateProject } = useProjectOperations();

// Automatically shows toast on error!
await handleCreateProject(data);
```

### 3. Loading States

```typescript
const { isLoading, error } = useProjects();

if (isLoading) return <Spinner />;
if (error) return <Error message={error} />;
```

### 4. Type Safety

All API responses and data structures are typed!

## Testing the Migration

1. **Auth Flow**:
   - Go to `/welcome`
   - Sign up / Sign in
   - Should redirect to `/projects`

2. **Projects**:
   - Create a new project
   - View project list
   - Select a project
   - Should navigate to `/app/dashboard`

3. **Navigation**:
   - Switch between tabs
   - URL should update
   - Back button should work

4. **State Persistence**:
   - Refresh the page
   - Should remain logged in
   - Current project should persist

## Common Issues

### Issue: "Cannot find module '@/types'"

**Solution**: Make sure `tsconfig.json` has path mapping:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Components get props errors

**Solution**: Update components to use hooks instead of props:
```tsx
// Before
function Component({ data, onAction }) { }

// After
function Component() {
  const { data } = useContext();
  const navigate = useNavigate();
}
```

### Issue: "React Router not working"

**Solution**: Ensure `BrowserRouter` wraps the app in `App.new.tsx`

## Rollback Plan

If you need to rollback:

1. Restore `src/main.tsx`:
```tsx
import App from "./App.tsx";  // Back to old App
```

2. Keep old `App.tsx` intact until migration is complete

## Next Steps

1. Install dependencies: `npm install`
2. Update components one by one
3. Test each feature thoroughly
4. When ready, rename `App.new.tsx` to `App.tsx`
5. Delete old `App.tsx.old` (backup)

## Need Help?

Check `ARCHITECTURE.md` for detailed architectural documentation.
