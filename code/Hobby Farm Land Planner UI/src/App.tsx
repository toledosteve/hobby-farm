import React, { useState } from "react";
import { ProjectsDashboard } from "./components/ProjectsDashboard";
import { MapScreen } from "./components/MapScreen";
import { Toaster } from "./components/ui/sonner";
import { WelcomeScreen } from "./components/auth/WelcomeScreen";
import { SignUpScreen } from "./components/auth/SignUpScreen";
import { SignInScreen } from "./components/auth/SignInScreen";
import { ForgotPasswordScreen } from "./components/auth/ForgotPasswordScreen";
import { PasswordResetConfirmation } from "./components/auth/PasswordResetConfirmation";
import { PlanSelectionScreen } from "./components/auth/PlanSelectionScreen";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { ConfirmDialog } from "./components/ui/ConfirmDialog";
import { RenameProjectDialog } from "./components/ui/RenameProjectDialog";
import { CollapsibleMainAppLayout } from "./components/layouts/CollapsibleMainAppLayout";
import { FarmDashboard } from "./components/dashboard/FarmDashboard";
import { CalendarScreen } from "./components/calendar/CalendarScreen";
import { ModulesScreen } from "./components/modules/ModulesScreen";
import { SeasonDashboard } from "./components/maple-v2/SeasonDashboard";
import { PoultryDashboardV2 } from "./components/poultry/PoultryDashboardV2";
import { FlockDetailV2 } from "./components/poultry/FlockDetailV2";
import { AddFlockModalV2 } from "./components/poultry/AddFlockModalV2";
import { LogActivityModalV2 } from "./components/poultry/LogActivityModalV2";
// Legacy poultry imports (keep for reference)
import { PoultryDashboard } from "./components/poultry/PoultryDashboard";
import { FlockManagement } from "./components/poultry/FlockManagement";
import { FlockDetails } from "./components/poultry/FlockDetails";
import { EggLogModal } from "./components/poultry/EggLogModal";
import { EggLogTable } from "./components/poultry/EggLogTable";
import { AddFlockModal } from "./components/poultry/AddFlockModal";
import { FeedLogModal } from "./components/poultry/FeedLogModal";
import { HealthEventModal } from "./components/poultry/HealthEventModal";
import { SettingsScreen } from "./components/settings/SettingsScreen";
import { SubscriptionShowcase } from "./components/subscription/SubscriptionShowcase";
import { WeatherDashboard } from "./components/weather/WeatherDashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { toast } from "sonner@2.0.3";

import { TreesDashboard } from "./components/trees/TreesDashboard";

// Beekeeping V2 imports
import { BeekeepingDashboardV2 } from "./components/beekeeping/BeekeepingDashboardV2";
import { HiveDetailV2 } from "./components/beekeeping/HiveDetailV2";
import { AddHiveModalV2 } from "./components/beekeeping/AddHiveModalV2";
import { LogInspectionModalV2 } from "./components/beekeeping/LogInspectionModalV2";

// Orchard V2 imports
import { OrchardDashboardV2 } from "./components/orchard/OrchardDashboardV2";
import { TreeDetailV2 } from "./components/orchard/TreeDetailV2";
import { AddTreeModalV2 } from "./components/orchard/AddTreeModalV2";
import { LogActivityModalV2 } from "./components/orchard/LogActivityModalV2";

// Alerts imports
import { AlertsTable } from "./components/alerts/AlertsTable";
import { AlertDetailView } from "./components/alerts/AlertDetailView";
import { NotificationSettings } from "./components/alerts/NotificationSettings";
import { mockAlerts, defaultNotificationPreferences } from "./components/alerts/mockAlerts";
import type { Alert, NotificationPreferences } from "./components/alerts/types";

interface Project {
  id: string;
  name: string;
  location: string;
  acres?: number;
}

type AuthView = 'welcome' | 'signup' | 'signin' | 'forgot-password' | 'reset-confirmation' | 'plan-selection';
type MainView = 'project-list' | 'onboarding' | 'app';
type AppTab = 'dashboard' | 'map' | 'calendar' | 'modules' | 'weather' | 'settings';
type MapleView = 'dashboard' | 'trees' | 'collection-log' | 'boil-log';
type PoultryView = 'dashboard' | 'flocks' | 'egg-log';

function App() {
  // Auth state
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Demo mode - set to true to view Subscription Showcase
  const [showSubscriptionDemo, setShowSubscriptionDemo] = useState(false);

  // Main app state
  const [mainView, setMainView] = useState<MainView>('project-list');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  
  // Module state
  const [showMapleModule, setShowMapleModule] = useState(false);
  const [mapleView, setMapleView] = useState<MapleView>('dashboard');
  const [showPoultryModule, setShowPoultryModule] = useState(false);
  const [poultryView, setPoultryView] = useState<PoultryView>('dashboard');
  const [showTreesModule, setShowTreesModule] = useState(false);
  const [showBeekeepingModule, setShowBeekeepingModule] = useState(false);
  const [showOrchardModule, setShowOrchardModule] = useState(false);

  // Poultry V2 state
  const [selectedFlockIdV2, setSelectedFlockIdV2] = useState<string | null>(null);
  const [showAddFlockModalV2, setShowAddFlockModalV2] = useState(false);
  const [showLogActivityModalV2, setShowLogActivityModalV2] = useState(false);
  
  // Mock flocks data - replace with real data from backend
  const [flocksV2, setFlocksV2] = useState<any[]>([]);

  // Beekeeping V2 state
  const [selectedHiveIdV2, setSelectedHiveIdV2] = useState<string | null>(null);
  const [showAddHiveModalV2, setShowAddHiveModalV2] = useState(false);
  const [showLogInspectionModalV2, setShowLogInspectionModalV2] = useState(false);
  
  // Mock hives data - replace with real data from backend
  const [hivesV2, setHivesV2] = useState<any[]>([]);

  // Orchard V2 state
  const [selectedTreeIdV2, setSelectedTreeIdV2] = useState<string | null>(null);
  const [showAddTreeModalV2, setShowAddTreeModalV2] = useState(false);
  const [showLogActivityModalV2Orchard, setShowLogActivityModalV2Orchard] = useState(false);
  
  // Mock trees data - replace with real data from backend
  const [treesV2, setTreesV2] = useState<any[]>([]);

  // Alerts state
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showAlertDetail, setShowAlertDetail] = useState(false);
  const [showAlertsCenter, setShowAlertsCenter] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences
  );

  // Modal states (legacy)
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

  // Signup state
  const [signupData, setSignupData] = useState<{ name: string; email: string; password: string } | null>(null);

  // Auth handlers
  const handleSignUp = (data: { name: string; email: string; password: string }) => {
    // Store signup data and proceed to plan selection
    setSignupData(data);
    setAuthView('plan-selection');
  };

  const handlePlanSelection = (plan: "basic" | "premium") => {
    if (signupData) {
      toast.success(`Welcome, ${signupData.name}! Starting your 3-day free trial with ${plan === 'basic' ? 'Basic' : 'Premium'} plan.`);
      setIsAuthenticated(true);
      setMainView('project-list');
      setSignupData(null);
    }
  };

  const handleSignIn = (data: { email: string; password: string }) => {
    toast.success('Signed in successfully!');
    setIsAuthenticated(true);
    setMainView('project-list');
  };

  const handlePasswordReset = (email: string) => {
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

  const handleOpenTreesManagement = () => {
    setShowTreesModule(true);
    setActiveTab('modules');
  };

  const handleCloseTreesManagement = () => {
    setShowTreesModule(false);
  };

  const handleOpenBeekeepingManagement = () => {
    setShowBeekeepingModule(true);
    setActiveTab('modules');
  };

  const handleCloseBeekeepingManagement = () => {
    setShowBeekeepingModule(false);
  };

  const handleOpenOrchardManagement = () => {
    setShowOrchardModule(true);
    setActiveTab('modules');
  };

  const handleCloseOrchardManagement = () => {
    setShowOrchardModule(false);
  };

  const handleOpenModule = (moduleId: string) => {
    if (moduleId === 'maple-sugaring') {
      handleOpenMapleSugaring();
    } else if (moduleId === 'poultry') {
      handleOpenPoultryManagement();
    } else if (moduleId === 'orchard') {
      handleOpenOrchardManagement();
    } else if (moduleId === 'trees') {
      handleOpenTreesManagement();
    } else if (moduleId === 'beekeeping') {
      handleOpenBeekeepingManagement();
    }
  };

  // Alert handlers
  const handleOpenAlerts = () => {
    setShowAlertsCenter(true);
    setShowNotificationSettings(false);
  };

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowAlertDetail(true);
    // Mark as read
    setAlerts(alerts.map(a => 
      a.id === alert.id ? { ...a, status: 'read' as const } : a
    ));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, status: 'dismissed' as const } : a
    ));
    toast.success('Alert dismissed');
  };

  const handleSnoozeAlert = (alertId: string, duration: string) => {
    let snoozedUntil = new Date();
    switch (duration) {
      case '1-day':
        snoozedUntil.setDate(snoozedUntil.getDate() + 1);
        break;
      case '3-days':
        snoozedUntil.setDate(snoozedUntil.getDate() + 3);
        break;
      case 'next-season':
        snoozedUntil.setMonth(snoozedUntil.getMonth() + 3);
        break;
    }
    setAlerts(alerts.map(a =>
      a.id === alertId
        ? { ...a, status: 'snoozed' as const, snoozedUntil: snoozedUntil.toISOString() }
        : a
    ));
    toast.success('Alert snoozed');
  };

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => 
      a.status === 'new' ? { ...a, status: 'read' as const } : a
    ));
    toast.success('All alerts marked as read');
  };

  const handleOpenNotificationSettings = () => {
    setShowNotificationSettings(true);
    setShowAlertsCenter(false);
  };

  const handleSaveNotificationPreferences = (prefs: NotificationPreferences) => {
    setNotificationPreferences(prefs);
    toast.success('Notification preferences saved');
    setShowNotificationSettings(false);
    setShowAlertsCenter(true);
  };

  const handleAlertAction = (alert: Alert) => {
    // Navigate to the module or take action based on alert
    if (alert.actionLink === 'orchard') {
      handleOpenOrchardManagement();
    } else if (alert.actionLink === 'maple') {
      handleOpenMapleSugaring();
    } else if (alert.actionLink === 'beekeeping') {
      handleOpenBeekeepingManagement();
    } else if (alert.actionLink === 'poultry') {
      handleOpenPoultryManagement();
    } else if (alert.actionLink === 'trees') {
      handleOpenTreesManagement();
    }
    setShowAlertsCenter(false);
    setShowAlertDetail(false);
  };

  // Calculate unread alert count
  const unreadAlertCount = alerts.filter(a => a.status === 'new' && a.status !== 'dismissed').length;

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
            onBack={() => setAuthView('welcome')}
          />
        );
      case 'signin':
        return (
          <SignInScreen
            onSignIn={handleSignIn}
            onCreateAccountClick={() => setAuthView('signup')}
            onForgotPasswordClick={() => setAuthView('forgot-password')}
            onBack={() => setAuthView('welcome')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onSendResetLink={handlePasswordReset}
            onBackToSignIn={() => setAuthView('signin')}
          />
        );
      case 'reset-confirmation':
        return (
          <PasswordResetConfirmation
            onBackToSignIn={() => setAuthView('signin')}
          />
        );
      case 'plan-selection':
        return (
          <PlanSelectionScreen
            onSelectPlan={handlePlanSelection}
            onBack={() => setAuthView('signup')}
            userEmail={signupData?.email}
          />
        );
      default:
        return null;
    }
  };

  const renderMapleModule = () => {
    return <SeasonDashboard />;
  };

  const renderPoultryModule = () => {
    // If a flock is selected, show detail view
    if (selectedFlockIdV2) {
      const selectedFlock = flocksV2.find(f => f.id === selectedFlockIdV2);
      if (selectedFlock) {
        return (
          <FlockDetailV2
            flock={selectedFlock}
            onBack={() => setSelectedFlockIdV2(null)}
            onEdit={() => toast.info('Edit flock functionality coming soon')}
            onLogActivity={() => setShowLogActivityModalV2(true)}
            onLogHealth={() => setShowLogActivityModalV2(true)}
            onLogCare={() => setShowLogActivityModalV2(true)}
            onLogProduction={() => setShowLogActivityModalV2(true)}
          />
        );
      }
    }

    // Otherwise show dashboard
    return (
      <PoultryDashboardV2
        onAddFlock={() => setShowAddFlockModalV2(true)}
        onLogActivity={() => setShowLogActivityModalV2(true)}
        onViewFlock={(flockId) => setSelectedFlockIdV2(flockId)}
      />
    );
  };

  const renderTreesModule = () => {
    return <TreesDashboard />;
  };

  const renderBeekeepingModule = () => {
    // If a hive is selected, show detail view
    if (selectedHiveIdV2) {
      const selectedHive = hivesV2.find(h => h.id === selectedHiveIdV2);
      if (selectedHive) {
        return (
          <HiveDetailV2
            hive={selectedHive}
            onBack={() => setSelectedHiveIdV2(null)}
            onEdit={() => toast.info('Edit hive functionality coming soon')}
            onLogInspection={() => setShowLogInspectionModalV2(true)}
          />
        );
      }
    }

    // Otherwise show dashboard
    return (
      <BeekeepingDashboardV2
        onAddHive={() => setShowAddHiveModalV2(true)}
        onLogInspection={() => setShowLogInspectionModalV2(true)}
        onViewHive={(hiveId) => setSelectedHiveIdV2(hiveId)}
      />
    );
  };

  const renderOrchardModule = () => {
    // If a tree is selected, show detail view
    if (selectedTreeIdV2) {
      const selectedTree = treesV2.find(t => t.id === selectedTreeIdV2);
      if (selectedTree) {
        return (
          <TreeDetailV2
            tree={selectedTree}
            onBack={() => setSelectedTreeIdV2(null)}
            onEdit={() => toast.info('Edit tree functionality coming soon')}
            onLogActivity={() => setShowLogActivityModalV2Orchard(true)}
          />
        );
      }
    }

    // Otherwise show dashboard
    return (
      <OrchardDashboardV2
        onAddTree={() => setShowAddTreeModalV2(true)}
        onLogActivity={() => setShowLogActivityModalV2Orchard(true)}
        onViewTree={(treeId) => setSelectedTreeIdV2(treeId)}
      />
    );
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

    // If Trees module is open, show it regardless of active tab
    if (showTreesModule) {
      return renderTreesModule();
    }

    // If Beekeeping module is open, show it regardless of active tab
    if (showBeekeepingModule) {
      return renderBeekeepingModule();
    }

    // If Orchard module is open, show it regardless of active tab
    if (showOrchardModule) {
      return renderOrchardModule();
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
      case 'weather':
        return <WeatherDashboard />;
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
          <CollapsibleMainAppLayout
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setShowMapleModule(false);
              setShowPoultryModule(false);
              setShowTreesModule(false);
              setShowBeekeepingModule(false);
              setShowOrchardModule(false);
              setShowAlertsCenter(false);
              setShowNotificationSettings(false);
            }}
            currentProject={currentProject || undefined}
            projects={projects}
            onProjectChange={handleProjectChange}
            onLogout={handleLogout}
            unreadAlertCount={unreadAlertCount}
            onOpenAlerts={handleOpenAlerts}
          >
            {/* Show Alerts Center if open */}
            {showAlertsCenter ? (
              <AlertsTable
                alerts={alerts}
                onViewAlert={handleViewAlert}
                onDismissAlert={handleDismissAlert}
                onMarkAllRead={handleMarkAllRead}
                onOpenSettings={handleOpenNotificationSettings}
                onAlertAction={handleAlertAction}
              />
            ) : showNotificationSettings ? (
              <NotificationSettings
                preferences={notificationPreferences}
                onSave={handleSaveNotificationPreferences}
                onBack={() => {
                  setShowNotificationSettings(false);
                  setShowAlertsCenter(true);
                }}
              />
            ) : (
              renderAppContent()
            )}
          </CollapsibleMainAppLayout>
        );
    }
  };

  return (
    <ThemeProvider>
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

      {/* Poultry V2 Modals */}
      <AddFlockModalV2
        open={showAddFlockModalV2}
        onOpenChange={setShowAddFlockModalV2}
        onSave={(flockData) => {
          const newFlock = {
            ...flockData,
            id: `flock-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setFlocksV2([...flocksV2, newFlock]);
          toast.success(`${flockData.name} added successfully!`);
        }}
      />

      <LogActivityModalV2
        open={showLogActivityModalV2}
        onOpenChange={setShowLogActivityModalV2}
        flocks={flocksV2}
        selectedFlockId={selectedFlockIdV2 || undefined}
        onSaveEgg={(log) => {
          toast.success(`Egg log added successfully`);
        }}
        onSaveHealth={(log) => {
          toast.success(`Health activity logged successfully`);
        }}
        onSaveCare={(log) => {
          toast.success(`Care activity logged successfully`);
        }}
        onSaveGrowth={(log) => {
          toast.success(`Growth log added successfully`);
        }}
      />

      {/* Beekeeping V2 Modals */}
      <AddHiveModalV2
        open={showAddHiveModalV2}
        onOpenChange={setShowAddHiveModalV2}
        onSave={(hiveData) => {
          const newHive = {
            ...hiveData,
            id: `hive-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setHivesV2([...hivesV2, newHive]);
          toast.success(`${hiveData.name} added successfully!`);
        }}
      />

      <LogInspectionModalV2
        open={showLogInspectionModalV2}
        onOpenChange={setShowLogInspectionModalV2}
        hives={hivesV2}
        selectedHiveId={selectedHiveIdV2 || undefined}
        onSave={(log) => {
          toast.success(`Inspection log added successfully`);
        }}
      />

      {/* Orchard V2 Modals */}
      <AddTreeModalV2
        open={showAddTreeModalV2}
        onOpenChange={setShowAddTreeModalV2}
        onSave={(treeData) => {
          const newTree = {
            ...treeData,
            id: `tree-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setTreesV2([...treesV2, newTree]);
          toast.success(`${treeData.name} added successfully!`);
        }}
      />

      <LogActivityModalV2
        open={showLogActivityModalV2Orchard}
        onOpenChange={setShowLogActivityModalV2Orchard}
        trees={treesV2}
        selectedTreeId={selectedTreeIdV2 || undefined}
        onSave={(log) => {
          toast.success(`Activity log added successfully`);
        }}
      />

      {/* Alert Detail Modal */}
      <AlertDetailView
        alert={selectedAlert}
        open={showAlertDetail}
        onOpenChange={setShowAlertDetail}
        onDismiss={handleDismissAlert}
        onSnooze={handleSnoozeAlert}
        onAction={handleAlertAction}
      />
    </ThemeProvider>
  );
}

export default App;