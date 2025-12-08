import { useState } from "react";
import { ProjectsDashboard } from "./components/ProjectsDashboard";
import { MapScreen } from "./components/MapScreen";
import { Toaster } from "./components/ui/sonner";
import { WelcomeScreen } from "./components/auth/WelcomeScreen";
import { SignUpScreen } from "./components/auth/SignUpScreen";
import { SignInScreen } from "./components/auth/SignInScreen";
import { ForgotPasswordScreen } from "./components/auth/ForgotPasswordScreen";
import { PasswordResetConfirmation } from "./components/auth/PasswordResetConfirmation";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { ConfirmDialog } from "./components/ui/ConfirmDialog";
import { RenameProjectDialog } from "./components/ui/RenameProjectDialog";
import { MainAppLayout } from "./components/layouts/MainAppLayout";
import { FarmDashboard } from "./components/dashboard/FarmDashboard";
import { CalendarScreen } from "./components/calendar/CalendarScreen";
import { ModulesScreen } from "./components/modules/ModulesScreen";
import { MapleDashboard } from "./components/maple/MapleDashboard";
import { MapleTreesScreen } from "./components/maple/MapleTreesScreen";
import { SapCollectionLog } from "./components/maple/SapCollectionLog";
import { BoilSessionLog } from "./components/maple/BoilSessionLog";
import { PoultryDashboard } from "./components/poultry/PoultryDashboard";
import { FlockManagement } from "./components/poultry/FlockManagement";
import { FlockDetails } from "./components/poultry/FlockDetails";
import { EggLogModal } from "./components/poultry/EggLogModal";
import { EggLogTable } from "./components/poultry/EggLogTable";
import { AddFlockModal } from "./components/poultry/AddFlockModal";
import { FeedLogModal } from "./components/poultry/FeedLogModal";
import { HealthEventModal } from "./components/poultry/HealthEventModal";
import { SettingsScreen } from "./components/settings/SettingsScreen";
import { toast } from "sonner@2.0.3";

interface Project {
  id: string;
  name: string;
  location: string;
  acres?: number;
}

type AuthView = 'welcome' | 'signup' | 'signin' | 'forgot-password' | 'reset-confirmation';
type MainView = 'project-list' | 'onboarding' | 'app';
type AppTab = 'dashboard' | 'map' | 'calendar' | 'modules' | 'settings';
type MapleView = 'dashboard' | 'trees' | 'collection-log' | 'boil-log';
type PoultryView = 'dashboard' | 'flocks' | 'egg-log';

function App() {
  // Auth state
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Main app state
  const [mainView, setMainView] = useState<MainView>('project-list');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  
  // Module state
  const [showMapleModule, setShowMapleModule] = useState(false);
  const [mapleView, setMapleView] = useState<MapleView>('dashboard');
  const [showPoultryModule, setShowPoultryModule] = useState(false);
  const [poultryView, setPoultryView] = useState<PoultryView>('dashboard');

  // Modal states
  const [showEggLogModal, setShowEggLogModal] = useState(false);
  const [showAddFlockModal, setShowAddFlockModal] = useState(false);
  const [showFeedLogModal, setShowFeedLogModal] = useState(false);
  const [showHealthEventModal, setShowHealthEventModal] = useState(false);
  const [selectedFlock, setSelectedFlock] = useState<any>(null);
  const [showFlockDetails, setShowFlockDetails] = useState(false);

  // Project state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Livingston Farm',
      location: 'Vermont',
      acres: 25,
    },
    {
      id: '2',
      name: 'Maple Ridge',
      location: 'New Hampshire',
      acres: 18,
    },
    {
      id: '3',
      name: 'Green Valley Homestead',
      location: 'Maine',
      acres: 42,
    },
  ]);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToRename, setProjectToRename] = useState<string | null>(null);

  // Auth handlers
  const handleSignUp = (data: { name: string; email: string; password: string }) => {
    toast.success(`Welcome, ${data.name}! Account created successfully.`);
    setIsAuthenticated(true);
    setMainView('project-list');
  };

  const handleSignIn = (data: { email: string; password: string }) => {
    toast.success('Signed in successfully!');
    setIsAuthenticated(true);
    setMainView('project-list');
  };

  const handleSendResetLink = (email: string) => {
    toast.success(`Password reset link sent to ${email}`);
    setTimeout(() => setAuthView('reset-confirmation'), 500);
  };

  const handleLogout = () => {
    toast.info('Logged out successfully');
    setIsAuthenticated(false);
    setAuthView('welcome');
    setMainView('project-list');
    setCurrentProject(null);
  };

  // Project handlers
  const handleCreateNew = () => {
    setMainView('onboarding');
  };

  const handleOnboardingComplete = (projectData: {
    name: string;
    location: string;
    acreage: number;
    goals: string[];
  }) => {
    const newProject = {
      id: Date.now().toString(),
      name: projectData.name,
      location: projectData.location,
      acres: projectData.acreage,
    };
    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    toast.success(`${projectData.name} created successfully!`);
    setMainView('app');
    setActiveTab('dashboard');
  };

  const handleOnboardingCancel = () => {
    setMainView('project-list');
  };

  const handleOpenProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
      setMainView('app');
      setActiveTab('dashboard');
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      toast.success(`Switched to ${project.name}`);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      const project = projects.find(p => p.id === projectToDelete);
      setProjects(projects.filter(p => p.id !== projectToDelete));
      toast.success(`${project?.name || 'Project'} deleted successfully`);
      setProjectToDelete(null);
    }
  };

  const handleRenameProject = (id: string) => {
    setProjectToRename(id);
    setRenameDialogOpen(true);
  };

  const confirmRename = (newName: string) => {
    if (projectToRename) {
      setProjects(projects.map(p => 
        p.id === projectToRename ? { ...p, name: newName } : p
      ));
      toast.success('Project renamed successfully');
      setProjectToRename(null);
    }
  };

  const handleDuplicateProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      const newProject = {
        ...project,
        id: Date.now().toString(),
        name: `${project.name} (Copy)`,
      };
      setProjects([...projects, newProject]);
      toast.success(`${project.name} duplicated successfully`);
    }
  };

  // Module handlers
  const handleOpenMapleSugaring = () => {
    setShowMapleModule(true);
    setMapleView('dashboard');
    setActiveTab('modules');
  };

  const handleCloseMapleSugaring = () => {
    setShowMapleModule(false);
  };

  const handleOpenPoultryManagement = () => {
    setShowPoultryModule(true);
    setPoultryView('dashboard');
    setActiveTab('modules');
  };

  const handleClosePoultryManagement = () => {
    setShowPoultryModule(false);
  };

  const handleOpenModule = (moduleId: string) => {
    if (moduleId === 'maple-sugaring') {
      handleOpenMapleSugaring();
    } else if (moduleId === 'poultry') {
      handleOpenPoultryManagement();
    }
  };

  // Render functions
  const renderAuthScreen = () => {
    switch (authView) {
      case 'welcome':
        return (
          <WelcomeScreen
            onSignIn={() => setAuthView('signin')}
            onCreateAccount={() => setAuthView('signup')}
          />
        );
      case 'signup':
        return (
          <SignUpScreen
            onSignUp={handleSignUp}
            onSignInClick={() => setAuthView('signin')}
          />
        );
      case 'signin':
        return (
          <SignInScreen
            onSignIn={handleSignIn}
            onCreateAccountClick={() => setAuthView('signup')}
            onForgotPasswordClick={() => setAuthView('forgot-password')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onSendResetLink={handleSendResetLink}
            onBackToSignIn={() => setAuthView('signin')}
          />
        );
      case 'reset-confirmation':
        return (
          <PasswordResetConfirmation
            onReturnToSignIn={() => setAuthView('signin')}
          />
        );
    }
  };

  const renderMapleModule = () => {
    switch (mapleView) {
      case 'dashboard':
        return (
          <MapleDashboard
            onAddTree={() => setMapleView('trees')}
            onAddTap={() => setMapleView('trees')}
            onLogCollection={() => setMapleView('collection-log')}
            onLogBoil={() => setMapleView('boil-log')}
            onManageTrees={() => setMapleView('trees')}
          />
        );
      case 'trees':
        return (
          <MapleTreesScreen
            onAddTree={() => toast.info('Add tree dialog would open')}
            onAddTap={() => toast.info('Add tap dialog would open')}
          />
        );
      case 'collection-log':
        return <SapCollectionLog onBack={() => setMapleView('dashboard')} />;
      case 'boil-log':
        return <BoilSessionLog onBack={() => setMapleView('dashboard')} />;
    }
  };

  const renderPoultryModule = () => {
    switch (poultryView) {
      case 'dashboard':
        return (
          <PoultryDashboard
            onAddFlock={() => setShowAddFlockModal(true)}
            onLogEggs={() => setShowEggLogModal(true)}
            onAddFeedLog={() => setShowFeedLogModal(true)}
            onAddHealthEvent={() => setShowHealthEventModal(true)}
            onManageFlocks={() => setPoultryView('flocks')}
          />
        );
      case 'flocks':
        return (
          <FlockManagement
            onAddFlock={() => setShowAddFlockModal(true)}
            onViewFlock={(flockId) => {
              // Mock flock for demo
              setSelectedFlock({
                id: flockId,
                name: 'Main Coop',
                birdCount: 12,
                breed: 'Rhode Island Red',
                startDate: '2025-01-01',
              });
              setShowFlockDetails(true);
            }}
          />
        );
      case 'egg-log':
        return (
          <EggLogTable
            onLogEggs={() => setShowEggLogModal(true)}
            onBack={() => setPoultryView('dashboard')}
          />
        );
    }
  };

  const renderAppContent = () => {
    // If Maple module is open, show it regardless of active tab
    if (showMapleModule) {
      return renderMapleModule();
    }

    // If Poultry module is open, show it regardless of active tab
    if (showPoultryModule) {
      return renderPoultryModule();
    }

    // Otherwise show the active tab
    switch (activeTab) {
      case 'dashboard':
        return currentProject ? (
          <FarmDashboard
            farm={{
              name: currentProject.name,
              location: currentProject.location,
              acres: currentProject.acres || 0,
            }}
            onOpenMapleSugaring={handleOpenMapleSugaring}
            onOpenPoultry={handleOpenPoultryManagement}
            onAddTask={() => toast.info('Add task dialog would open')}
          />
        ) : null;
      case 'map':
        return (
          <MapScreen
            currentProject={currentProject ? {
              name: currentProject.name,
              acres: currentProject.acres || 0,
            } : undefined}
            onBackToDashboard={() => setMainView('project-list')}
            onLogout={handleLogout}
          />
        );
      case 'calendar':
        return (
          <CalendarScreen
            onAddTask={() => toast.info('Add task dialog would open')}
          />
        );
      case 'modules':
        return <ModulesScreen onOpenModule={handleOpenModule} />;
      case 'settings':
        return <SettingsScreen />;
    }
  };

  const renderMainView = () => {
    switch (mainView) {
      case 'project-list':
        return (
          <ProjectsDashboard
            projects={projects}
            onCreateNew={handleCreateNew}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
            onDuplicateProject={handleDuplicateProject}
            onLogout={handleLogout}
          />
        );
      case 'onboarding':
        return (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onCancel={handleOnboardingCancel}
            onLogout={handleLogout}
          />
        );
      case 'app':
        return (
          <MainAppLayout
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setShowMapleModule(false);
              setShowPoultryModule(false);
            }}
            currentProject={currentProject || undefined}
            projects={projects}
            onProjectChange={handleProjectChange}
            onLogout={handleLogout}
          >
            {renderAppContent()}
          </MainAppLayout>
        );
    }
  };

  return (
    <>
      {!isAuthenticated ? renderAuthScreen() : renderMainView()}
      
      <Toaster />
      
      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${projects.find(p => p.id === projectToDelete)?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        destructive
      />

      <RenameProjectDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={projects.find(p => p.id === projectToRename)?.name || ''}
        onRename={confirmRename}
      />

      {/* Poultry Modals */}
      <AddFlockModal
        open={showAddFlockModal}
        onOpenChange={setShowAddFlockModal}
        onSave={(flock) => {
          toast.success(`Flock ${flock.name} added successfully`);
          setShowAddFlockModal(false);
        }}
      />

      <EggLogModal
        open={showEggLogModal}
        onOpenChange={setShowEggLogModal}
        onSave={(log) => {
          toast.success(`Egg log added successfully`);
          setShowEggLogModal(false);
        }}
      />

      <FeedLogModal
        open={showFeedLogModal}
        onOpenChange={setShowFeedLogModal}
        onSave={(log) => {
          toast.success(`Feed log added successfully`);
          setShowFeedLogModal(false);
        }}
      />

      <HealthEventModal
        open={showHealthEventModal}
        onOpenChange={setShowHealthEventModal}
        onSave={(event) => {
          toast.success(`Health event added successfully`);
          setShowHealthEventModal(false);
        }}
      />

      {/* Poultry Details */}
      <FlockDetails
        open={showFlockDetails}
        onOpenChange={setShowFlockDetails}
        flock={selectedFlock}
      />
    </>
  );
}

export default App;