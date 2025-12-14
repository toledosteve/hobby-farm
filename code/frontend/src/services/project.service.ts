import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ApiResponse,
} from '@/types';
import { API_CONFIG, isMockMode } from '@/config/api.config';
import { httpClient } from './http-client';
import { mockDatabase, simulateDelay, generateId } from './mock-data';
import { projectsApi } from './api/projects';

class ProjectService {
  /**
   * Get all projects for the current user
   */
  async getProjects(): Promise<Project[]> {
    if (isMockMode) {
      await simulateDelay();
      return [...mockDatabase.projects];
    }

    return projectsApi.getAll();
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

    return projectsApi.getById(id);
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
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        acres: data.acres,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockDatabase.projects.push(newProject);
      return { ...newProject };
    }

    return projectsApi.create(data);
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

      const existing = mockDatabase.projects[index];

      const updatedProject = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockDatabase.projects[index] = updatedProject;
      return { ...updatedProject };
    }

    return projectsApi.update(id, data);
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

    return projectsApi.delete(id);
  }

  /**
   * Duplicate a project
   */
  async duplicateProject(id: string): Promise<Project> {
    const original = await this.getProject(id);

    return this.createProject({
      name: `${original.name} (Copy)`,
      address: original.address,
      city: original.city,
      state: original.state,
      zipCode: original.zipCode,
      acres: original.acres,
    });
  }

  /**
   * Start a new season for a project
   */
  async startNewSeason(id: string): Promise<Project> {
    if (isMockMode) {
      await simulateDelay();

      const index = mockDatabase.projects.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Project not found');
      }

      const project = mockDatabase.projects[index];
      const now = new Date();
      const year = now.getFullYear();

      // Mark existing active season as inactive
      const updatedSeasons = (project.seasons || []).map((s) =>
        s.isActive ? { ...s, isActive: false, endDate: now.toISOString() } : s
      );

      // Create new season
      const newSeason = {
        id: generateId(),
        name: `${year} growing season`,
        year,
        startDate: now.toISOString(),
        isActive: true,
      };

      updatedSeasons.push(newSeason);

      const updatedProject = {
        ...project,
        seasons: updatedSeasons,
        currentSeasonId: newSeason.id,
        updatedAt: now.toISOString(),
      };

      mockDatabase.projects[index] = updatedProject;
      return { ...updatedProject };
    }

    return projectsApi.startNewSeason(id);
  }
}

export const projectService = new ProjectService();
