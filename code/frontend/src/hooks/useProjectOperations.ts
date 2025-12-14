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
    async (data: {
      name: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      acres?: number;
    }) => {
      setIsProcessing(true);
      try {
        const project = await createProject(data);
        setCurrentProject(project);
        toast.success(`${data.name} created successfully!`);
        navigate(ROUTES.APP.DASHBOARD);
        return project;
      } catch (error) {
        toast.error('Failed to create farm');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [createProject, setCurrentProject, navigate]
  );

  const handleUpdateProject = useCallback(
    async (id: string, data: { name?: string; acres?: number; city?: string; state?: string }) => {
      setIsProcessing(true);
      try {
        const project = await updateProject(id, data);
        toast.success('Farm updated successfully');
        return project;
      } catch (error) {
        toast.error('Failed to update farm');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [updateProject]
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      const project = projects.find((p) => p.id === id);
      const farmName = project?.name || 'Farm';

      setIsProcessing(true);
      try {
        await deleteProject(id);
        toast.success(`${farmName} deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete farm');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [deleteProject, projects]
  );

  const handleDuplicateProject = useCallback(
    async (id: string) => {
      const project = projects.find((p) => p.id === id);
      const farmName = project?.name || 'Farm';

      setIsProcessing(true);
      try {
        const newProject = await duplicateProject(id);
        toast.success(`${farmName} duplicated successfully`);
        return newProject;
      } catch (error) {
        toast.error('Failed to duplicate farm');
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [duplicateProject, projects]
  );

  const handleSelectProject = useCallback(
    (id: string) => {
      const project = projects.find((p) => p.id === id);
      if (project) {
        setCurrentProject(project);
        toast.success(`Switched to ${project.name}`);
        navigate(ROUTES.APP.DASHBOARD);
      } else {
        toast.error('Farm not found');
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
