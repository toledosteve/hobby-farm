import { httpClient } from './http-client';
import type { Task } from '@/lib/calendar-utils';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byModule: {
    maple: number;
    poultry: number;
    garden: number;
    greenhouse: number;
    livestock: number;
    general: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export const taskService = {
  async getTasks(projectId?: string): Promise<Task[]> {
    const params = projectId ? { projectId } : {};
    return await httpClient.get<Task[]>('tasks', { params });
  },

  async getTask(id: string): Promise<Task> {
    return await httpClient.get<Task>(`tasks/${id}`);
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    return await httpClient.post<Task>('tasks', task);
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    return await httpClient.patch<Task>(`tasks/${id}`, task);
  },

  async toggleComplete(id: string): Promise<Task> {
    return await httpClient.patch<Task>(`tasks/${id}/toggle-complete`);
  },

  async deleteTask(id: string): Promise<void> {
    await httpClient.delete(`tasks/${id}`);
  },

  async getTaskStats(projectId?: string): Promise<TaskStats> {
    const params = projectId ? { projectId } : {};
    return await httpClient.get<TaskStats>('tasks/stats', { params });
  },
};
