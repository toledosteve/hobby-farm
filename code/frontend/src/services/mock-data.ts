import { Project } from '@/types';

// Mock data storage (simulates a database)
export const mockDatabase = {
  projects: [
    {
      id: '1',
      userId: 'user-1',
      name: 'Livingston Farm',
      location: 'Vermont',
      acres: 25,
      createdAt: new Date('2025-01-15').toISOString(),
      updatedAt: new Date('2025-01-15').toISOString(),
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Maple Ridge',
      location: 'New Hampshire',
      acres: 18,
      createdAt: new Date('2025-02-10').toISOString(),
      updatedAt: new Date('2025-02-10').toISOString(),
    },
    {
      id: '3',
      userId: 'user-1',
      name: 'Green Valley Homestead',
      location: 'Maine',
      acres: 42,
      createdAt: new Date('2025-03-05').toISOString(),
      updatedAt: new Date('2025-03-05').toISOString(),
    },
  ] as Project[],

  user: {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@hobbyfarm.com',
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },

  flocks: [],
  eggLogs: [],
  feedLogs: [],
  healthEvents: [],
  mapleTrees: [],
  sapCollections: [],
  boilSessions: [],
  tasks: [],
};

// Helper to simulate API delay
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper to generate IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
