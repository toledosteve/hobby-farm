import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ProjectCard } from "./ui/ProjectCard";
import { AppHeader } from "./ui/AppHeader";

interface Project {
  id: string;
  name: string;
  location: string;
  acres?: number;
}

interface ProjectsDashboardProps {
  projects: Project[];
  onCreateNew: () => void;
  onOpenProject: (id: string) => void;
  onDeleteProject?: (id: string) => void;
  onRenameProject?: (id: string) => void;
  onDuplicateProject?: (id: string) => void;
  onLogout?: () => void;
}

export function ProjectsDashboard({ 
  projects, 
  onCreateNew, 
  onOpenProject, 
  onDeleteProject,
  onRenameProject,
  onDuplicateProject,
  onLogout 
}: ProjectsDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">My Farms</h1>
            <p className="text-muted-foreground">
              Manage your land planning projects
            </p>
          </div>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 8L19 14H16V20H12V14H9L14 8Z"
                  fill="#2D5F3F"
                />
                <path
                  d="M8 20H20"
                  stroke="#2D5F3F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first farm project to start planning your land, viewing soil data, and marking important features.
            </p>
            <Button onClick={onCreateNew} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                location={project.location}
                acres={project.acres}
                onClick={() => onOpenProject(project.id)}
                onDelete={onDeleteProject ? () => onDeleteProject(project.id) : undefined}
                onRename={onRenameProject ? () => onRenameProject(project.id) : undefined}
                onDuplicate={onDuplicateProject ? () => onDuplicateProject(project.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}