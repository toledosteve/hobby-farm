# Quick Reference: Adding New Features

## Adding a New Module (e.g., Beekeeping)

### 1. Define Types (`src/types/index.ts`)

```typescript
export interface Hive {
  id: string;
  projectId: string;
  name: string;
  location: string;
  beeCount: number;
  established: string;
  createdAt: string;
  updatedAt: string;
}

export interface HoneyHarvest {
  id: string;
  projectId: string;
  hiveId: string;
  date: string;
  pounds: number;
  type: 'wildflower' | 'clover' | 'buckwheat';
  createdAt: string;
  updatedAt: string;
}

export interface CreateHiveDto {
  name: string;
  location: string;
  beeCount: number;
}
```

### 2. Create Service (`src/services/beekeeping.service.ts`)

```typescript
import { Hive, CreateHiveDto, ApiResponse } from '@/types';
import { API_CONFIG, isMockMode } from '@/config/api.config';
import { httpClient } from './http-client';
import { mockDatabase, simulateDelay, generateId } from './mock-data';

class BeekeepingService {
  async getHives(): Promise<Hive[]> {
    if (isMockMode) {
      await simulateDelay();
      return [...mockDatabase.hives];
    }

    const response = await httpClient.get<ApiResponse<Hive[]>>(
      '/beekeeping/hives'
    );
    return response.data;
  }

  async createHive(data: CreateHiveDto): Promise<Hive> {
    if (isMockMode) {
      await simulateDelay();
      
      const newHive: Hive = {
        id: generateId(),
        projectId: mockDatabase.user.id,
        ...data,
        established: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDatabase.hives.push(newHive);
      return { ...newHive };
    }

    const response = await httpClient.post<ApiResponse<Hive>>(
      '/beekeeping/hives',
      data
    );
    return response.data;
  }
}

export const beekeepingService = new BeekeepingService();
```

Don't forget to add to mock database (`src/services/mock-data.ts`):
```typescript
export const mockDatabase = {
  // ... existing data
  hives: [] as Hive[],
  honeyHarvests: [] as HoneyHarvest[],
};
```

### 3. Create Context (if needed) (`src/contexts/BeekeepingContext.tsx`)

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Hive } from '@/types';
import { beekeepingService } from '@/services/beekeeping.service';

interface BeekeepingContextType {
  hives: Hive[];
  isLoading: boolean;
  createHive: (data: CreateHiveDto) => Promise<Hive>;
  refreshHives: () => Promise<void>;
}

const BeekeepingContext = createContext<BeekeepingContextType | undefined>(undefined);

export function BeekeepingProvider({ children }: { children: ReactNode }) {
  const [hives, setHives] = useState<Hive[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshHives = async () => {
    setIsLoading(true);
    try {
      const data = await beekeepingService.getHives();
      setHives(data);
    } finally {
      setIsLoading(false);
    }
  };

  const createHive = async (data: CreateHiveDto) => {
    const hive = await beekeepingService.createHive(data);
    setHives(prev => [...prev, hive]);
    return hive;
  };

  return (
    <BeekeepingContext.Provider value={{ hives, isLoading, createHive, refreshHives }}>
      {children}
    </BeekeepingContext.Provider>
  );
}

export function useBeekeeping() {
  const context = useContext(BeekeepingContext);
  if (!context) throw new Error('useBeekeeping must be used within BeekeepingProvider');
  return context;
}
```

### 4. Create Components (`src/components/beekeeping/`)

```typescript
// src/components/beekeeping/BeekeepingDashboard.tsx
import { useBeekeeping } from '@/contexts/BeekeepingContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function BeekeepingDashboard() {
  const { hives, isLoading } = useBeekeeping();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🐝 Beekeeping</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Hive
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {hives.map(hive => (
          <div key={hive.id} className="p-4 border rounded">
            <h3>{hive.name}</h3>
            <p>{hive.beeCount} bees</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Add Routes (`src/routes/routes.ts`)

```typescript
export const ROUTES = {
  // ... existing routes
  BEEKEEPING: {
    DASHBOARD: '/app/modules/beekeeping',
    HIVES: '/app/modules/beekeeping/hives',
    HARVEST: '/app/modules/beekeeping/harvest',
  },
} as const;
```

### 6. Update App Routes (`src/App.new.tsx`)

```typescript
import { BeekeepingDashboard } from '@/components/beekeeping/BeekeepingDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <BeekeepingProvider>  {/* Add new provider */}
            <Routes>
              {/* ... existing routes */}
              
              {/* Beekeeping routes */}
              <Route path="modules/beekeeping" element={<BeekeepingDashboard />} />
            </Routes>
          </BeekeepingProvider>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 7. Add to Modules Screen (`src/components/modules/ModulesScreen.tsx`)

```typescript
const modules = [
  // ... existing modules
  {
    id: 'beekeeping',
    name: 'Beekeeping',
    icon: '🐝',
    description: 'Track hives and honey production',
    route: ROUTES.BEEKEEPING.DASHBOARD,
  },
];
```

## Adding a Simple Feature (no module needed)

### Example: Add Task Priority Filter

#### 1. Update Type
```typescript
// src/types/index.ts
export interface TaskFilter {
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  moduleType?: string;
}
```

#### 2. Create Hook
```typescript
// src/hooks/useTaskFilter.ts
import { useState } from 'react';
import { TaskFilter } from '@/types';

export function useTaskFilter() {
  const [filter, setFilter] = useState<TaskFilter>({});

  const setFilterPriority = (priority?: 'low' | 'medium' | 'high') => {
    setFilter(prev => ({ ...prev, priority }));
  };

  return { filter, setFilter, setFilterPriority };
}
```

#### 3. Use in Component
```typescript
import { useTaskFilter } from '@/hooks/useTaskFilter';

export function TaskList() {
  const { filter, setFilterPriority } = useTaskFilter();

  return (
    <div>
      <select onChange={(e) => setFilterPriority(e.target.value)}>
        <option value="">All</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}
```

## Common Patterns

### Pattern: Form with API Call

```typescript
import { useAsync } from '@/hooks/useAsync';
import { projectService } from '@/services';
import { toast } from 'sonner';

export function CreateProjectForm() {
  const { execute, isLoading } = useAsync(projectService.createProject);

  const handleSubmit = async (data) => {
    const result = await execute(data);
    if (result) {
      toast.success('Project created!');
    } else {
      toast.error('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Pattern: Modal Management

```typescript
import { useDialog } from '@/hooks/useDialog';

export function Dashboard() {
  const addDialog = useDialog();

  return (
    <>
      <button onClick={addDialog.open}>Add Item</button>
      
      <Dialog open={addDialog.isOpen} onOpenChange={addDialog.setIsOpen}>
        {/* dialog content */}
      </Dialog>
    </>
  );
}
```

### Pattern: Protected Component

```typescript
import { useAuth } from '@/contexts';

export function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `FarmDashboard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useProjects.ts`)
- Services: `camelCase.service.ts` (e.g., `project.service.ts`)
- Types: `index.ts` in types folder
- Contexts: `PascalCaseContext.tsx` (e.g., `AuthContext.tsx`)

## Import Organization

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal modules (using @ alias)
import { useAuth, useProjects } from '@/contexts';
import { projectService } from '@/services';
import { Project } from '@/types';

// 3. Components
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/ui/DashboardCard';

// 4. Relative imports (avoid if possible, use @ alias)
import { helper } from './utils';
```

## Testing Checklist

When adding a new feature:

- [ ] Types defined in `src/types/`
- [ ] Service created with mock mode support
- [ ] Mock data added to `mock-data.ts`
- [ ] Context created (if needed)
- [ ] Hooks created for business logic
- [ ] Components created
- [ ] Routes added
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Toast notifications added
- [ ] TypeScript compiles without errors
- [ ] Feature works in mock mode
- [ ] Feature ready for real backend (just env change)
