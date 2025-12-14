import { httpClient } from '../http-client';
import { Activity } from '@/types';

export const activitiesApi = {
  /**
   * Get activities for a specific project
   */
  getByProject: (projectId: string, limit = 20): Promise<Activity[]> =>
    httpClient.get<Activity[]>(`activities?projectId=${projectId}&limit=${limit}`),

  /**
   * Get recent activities across all projects
   */
  getRecent: (limit = 10): Promise<Activity[]> =>
    httpClient.get<Activity[]>(`activities/recent?limit=${limit}`),
};
