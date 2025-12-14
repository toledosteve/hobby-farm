import { httpClient } from '../http-client';
import { Project, Boundary } from '@/types';

export interface CreateProjectData {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  acres?: number;
  boundary?: Boundary;
  latitude?: number;
  longitude?: number;
}

export interface UpdateProjectData {
  name?: string;
  location?: string;
  acres?: number;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  enabledModules?: string[];
  boundary?: Boundary | null;
  latitude?: number;
  longitude?: number;
}

export const projectsApi = {
  /**
   * Get all projects for the current user
   */
  getAll: async (): Promise<Project[]> => {
    return httpClient.get<Project[]>('projects');
  },

  /**
   * Get a single project by ID
   */
  getById: async (id: string): Promise<Project> => {
    return httpClient.get<Project>(`projects/${id}`);
  },

  /**
   * Create a new project
   */
  create: async (data: CreateProjectData): Promise<Project> => {
    return httpClient.post<Project>('projects', data);
  },

  /**
   * Update an existing project
   */
  update: async (id: string, data: UpdateProjectData): Promise<Project> => {
    return httpClient.patch<Project>(`projects/${id}`, data);
  },

  /**
   * Delete a project
   */
  delete: async (id: string): Promise<void> => {
    return httpClient.delete(`projects/${id}`);
  },

  /**
   * Start a new season for a project
   */
  startNewSeason: async (id: string): Promise<Project> => {
    return httpClient.post<Project>(`projects/${id}/seasons`);
  },
};
