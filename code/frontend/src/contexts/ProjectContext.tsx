import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, CreateProjectDto, UpdateProjectDto } from '@/types';
import { projectService } from '@/services';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (data: CreateProjectDto) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectDto) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project>;
  startNewSeason: (id: string) => Promise<Project>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

const CURRENT_PROJECT_KEY = 'hobby-farm-current-project-id';

export function ProjectProvider({ children }: ProjectProviderProps) {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wrapper to persist current project ID to localStorage
  const setCurrentProject = (project: Project | null) => {
    setCurrentProjectState(project);
    if (project) {
      localStorage.setItem(CURRENT_PROJECT_KEY, project.id);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  };

  // Load projects when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshProjects();
    } else {
      setProjects([]);
      setCurrentProjectState(null);
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  }, [isAuthenticated]);

  const refreshProjects = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedProjects = await projectService.getProjects();
      setProjects(fetchedProjects);

      // Restore current project from localStorage or default to first project
      const savedProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);
      if (savedProjectId) {
        const savedProject = fetchedProjects.find((p) => p.id === savedProjectId);
        if (savedProject) {
          setCurrentProjectState(savedProject);
        } else if (fetchedProjects.length > 0) {
          // Saved project no longer exists, default to first
          setCurrentProject(fetchedProjects[0]);
        }
      } else if (fetchedProjects.length > 0 && !currentProject) {
        // No saved project, default to first if we don't have one
        setCurrentProject(fetchedProjects[0]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects';
      setError(message);
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: CreateProjectDto): Promise<Project> => {
    setError(null);

    try {
      const newProject = await projectService.createProject(data);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create farm';
      setError(message);
      throw err;
    }
  };

  const updateProject = async (
    id: string,
    data: UpdateProjectDto
  ): Promise<Project> => {
    setError(null);

    try {
      const updatedProject = await projectService.updateProject(id, data);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );

      if (currentProject?.id === id) {
        setCurrentProject(updatedProject);
      }

      return updatedProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      setError(message);
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    setError(null);

    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));

      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      throw err;
    }
  };

  const duplicateProject = async (id: string): Promise<Project> => {
    setError(null);

    try {
      const duplicated = await projectService.duplicateProject(id);
      setProjects((prev) => [...prev, duplicated]);
      return duplicated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to duplicate project';
      setError(message);
      throw err;
    }
  };

  const startNewSeason = async (id: string): Promise<Project> => {
    setError(null);

    try {
      const updatedProject = await projectService.startNewSeason(id);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );

      if (currentProject?.id === id) {
        setCurrentProject(updatedProject);
      }

      return updatedProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start new season';
      setError(message);
      throw err;
    }
  };

  const value: ProjectContextType = {
    projects,
    currentProject,
    isLoading,
    error,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    startNewSeason,
    refreshProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
