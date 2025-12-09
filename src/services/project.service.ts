import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ApiResponse,
} from '@/types';
import { API_CONFIG, isMockMode } from '@/config/api.config';
import { httpClient } from './http-client';
import { mockDatabase, simulateDelay, generateId } from './mock-data';

class ProjectService {
  /**
   * Get all projects for the current user
   */
  async getProjects(): Promise<Project[]> {
    if (isMockMode) {
      await simulateDelay();
      return [...mockDatabase.projects];
    }

    const response = await httpClient.get<ApiResponse<Project[]>>(
      API_CONFIG.endpoints.projects.list
    );
    return response.data;
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: string): Promise<Project> {
    if (isMockMode) {
      await simulateDelay();
      const project = mockDatabase.projects.find((p) => p.id === id);
      if (!project) {
        throw new Error('Project not found');
      }
      return { ...project };
    }

    const response = await httpClient.get<ApiResponse<Project>>(
      API_CONFIG.endpoints.projects.get(id)
    );
    return response.data;
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectDto): Promise<Project> {
    if (isMockMode) {
      await simulateDelay();
      
      const newProject: Project = {
        id: generateId(),
        userId: mockDatabase.user.id,
        name: data.name,
        location: data.location,
        acres: data.acres,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDatabase.projects.push(newProject);
      return { ...newProject };
    }

    const response = await httpClient.post<ApiResponse<Project>>(
      API_CONFIG.endpoints.projects.create,
      data
    );
    return response.data;
  }

  /**
   * Update a project
   */
  async updateProject(id: string, data: UpdateProjectDto): Promise<Project> {
    if (isMockMode) {
      await simulateDelay();
      
      const index = mockDatabase.projects.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Project not found');
      }

      const updatedProject = {
        ...mockDatabase.projects[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockDatabase.projects[index] = updatedProject;
      return { ...updatedProject };
    }

    const response = await httpClient.put<ApiResponse<Project>>(
      API_CONFIG.endpoints.projects.update(id),
      data
    );
    return response.data;
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    if (isMockMode) {
      await simulateDelay();
      
      const index = mockDatabase.projects.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Project not found');
      }

      mockDatabase.projects.splice(index, 1);
      return;
    }

    await httpClient.delete(API_CONFIG.endpoints.projects.delete(id));
  }

  /**
   * Duplicate a project
   */
  async duplicateProject(id: string): Promise<Project> {
    const original = await this.getProject(id);
    
    return this.createProject({
      name: `${original.name} (Copy)`,
      location: original.location,
      acres: original.acres,
    });
  }
}

export const projectService = new ProjectService();
