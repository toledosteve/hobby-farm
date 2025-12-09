import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useProjects } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';

/**
 * Hook for managing project operations
 */
export function useProjectOperations() {
  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    setCurrentProject,
  } = useProjects();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateProject = useCallback(
    async (data: { name: string; location: string; acres?: number }) => {
      setIsProcessing(true);
      try {
        const project = await createProject(data);
        setCurrentProject(project);
        toast.success(`${data.name} created successfully!`);
        navigate(ROUTES.APP.DASHBOARD);
        return project;
      } catch (error) {
        toast.error('Failed to create project');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [createProject, setCurrentProject, navigate]
  );

  const handleUpdateProject = useCallback(
    async (id: string, data: { name?: string; location?: string; acres?: number }) => {
      setIsProcessing(true);
      try {
        const project = await updateProject(id, data);
        toast.success('Project updated successfully');
        return project;
      } catch (error) {
        toast.error('Failed to update project');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [updateProject]
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      const project = projects.find(p => p.id === id);
      const projectName = project?.name || 'Project';
      
      setIsProcessing(true);
      try {
        await deleteProject(id);
        toast.success(`${projectName} deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete project');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [deleteProject, projects]
  );

  const handleDuplicateProject = useCallback(
    async (id: string) => {
      const project = projects.find(p => p.id === id);
      const projectName = project?.name || 'Project';
      
      setIsProcessing(true);
      try {
        const newProject = await duplicateProject(id);
        toast.success(`${projectName} duplicated successfully`);
        return newProject;
      } catch (error) {
        toast.error('Failed to duplicate project');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [duplicateProject, projects]
  );

  const handleSelectProject = useCallback(
    (id: string) => {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
        toast.success(`Switched to ${project.name}`);
        navigate(ROUTES.APP.DASHBOARD);
      } else {
        toast.error('Project not found');
      }
    },
    [projects, setCurrentProject, navigate]
  );

  return {
    isProcessing,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleDuplicateProject,
    handleSelectProject,
  };
}
