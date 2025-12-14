import { Activity } from '@/types';
import { isMockMode } from '@/config/api.config';
import { activitiesApi } from './api/activities';
import { simulateDelay } from './mock-data';

// Mock activities for development
const mockActivities: Activity[] = [
  {
    id: 'mock-1',
    projectId: 'mock-project',
    action: 'Created task: Check sap lines',
    category: 'task',
    entityType: 'task',
    entityId: 'task-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    projectId: 'mock-project',
    action: 'Completed task: Order new taps',
    category: 'task',
    entityType: 'task',
    entityId: 'task-2',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    projectId: 'mock-project',
    action: 'Enabled Maple Sugaring module',
    category: 'module',
    entityType: 'module',
    entityId: 'maple',
    metadata: { module: 'maple' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4',
    projectId: 'mock-project',
    action: 'Updated farm address',
    category: 'settings',
    entityType: 'project',
    entityId: 'mock-project',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class ActivityService {
  /**
   * Get activities for a specific project
   */
  async getActivities(projectId: string, limit = 20): Promise<Activity[]> {
    if (isMockMode) {
      await simulateDelay();
      return mockActivities
        .filter((a) => a.projectId === projectId || a.projectId === 'mock-project')
        .slice(0, limit);
    }

    return activitiesApi.getByProject(projectId, limit);
  }

  /**
   * Get recent activities across all projects
   */
  async getRecentActivities(limit = 10): Promise<Activity[]> {
    if (isMockMode) {
      await simulateDelay();
      return mockActivities.slice(0, limit);
    }

    return activitiesApi.getRecent(limit);
  }
}

export const activityService = new ActivityService();
