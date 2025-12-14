import { useState, useEffect } from "react";
import { MapPin, Plus, CheckSquare, Package, Loader2 } from "lucide-react";
import { DashboardCard } from "../ui/DashboardCard";
import { WeatherPanel } from "../ui/WeatherPanel";
import { MapPreview } from "../ui/MapPreview";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { taskService } from "@/services/task.service";
import { activityService } from "@/services/activity.service";
import { Task, formatDate, getUpcomingTasks, getOverdueTasks, MODULE_COLORS } from "@/lib/calendar-utils";
import { Activity } from "@/types";
import {
  formatActivityTime,
  getActivityEmoji,
  getActivityCategoryLabel,
  getActivityCategoryColors,
} from "@/lib/activity-utils";

// Module definitions for dashboard display
const MODULE_CONFIG: Record<
  string,
  {
    name: string;
    icon: string;
    route: string;
    stats: Array<{ label: string; value: string }>;
  }
> = {
  maple: {
    name: 'Maple Sugaring',
    icon: '🍁',
    route: ROUTES.MAPLE.DASHBOARD,
    stats: [
      { label: 'Taps', value: '0' },
      { label: 'Sap Collected', value: '0 gal' },
    ],
  },
  poultry: {
    name: 'Poultry',
    icon: '🐓',
    route: ROUTES.POULTRY.DASHBOARD,
    stats: [
      { label: 'Chickens', value: '0' },
      { label: 'Eggs Collected', value: '0' },
    ],
  },
  garden: {
    name: 'Gardening',
    icon: '🥕',
    route: ROUTES.APP.MODULES,
    stats: [
      { label: 'Beds', value: '0' },
      { label: 'Plants', value: '0' },
    ],
  },
  orchard: {
    name: 'Orchard',
    icon: '🍎',
    route: ROUTES.APP.MODULES,
    stats: [
      { label: 'Trees', value: '0' },
      { label: 'Harvest', value: '0 lbs' },
    ],
  },
  'christmas-trees': {
    name: 'Christmas Trees',
    icon: '🎄',
    route: ROUTES.APP.MODULES,
    stats: [
      { label: 'Trees', value: '0' },
      { label: 'Sold', value: '0' },
    ],
  },
  wildlife: {
    name: 'Wildlife Habitat',
    icon: '🦌',
    route: ROUTES.APP.MODULES,
    stats: [
      { label: 'Sightings', value: '0' },
      { label: 'Species', value: '0' },
    ],
  },
};

export function FarmDashboard() {
  const { currentProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Task state
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  // Activity state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Fetch activities on mount and when project changes
  useEffect(() => {
    async function fetchActivities() {
      if (!currentProject?.id) {
        setActivities([]);
        setIsLoadingActivities(false);
        return;
      }

      try {
        setIsLoadingActivities(true);
        const recentActivities = await activityService.getActivities(currentProject.id, 5);
        setActivities(recentActivities);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setActivities([]);
      } finally {
        setIsLoadingActivities(false);
      }
    }

    fetchActivities();
  }, [currentProject?.id]);

  // Fetch tasks on mount and when project changes
  useEffect(() => {
    async function fetchTasks() {
      if (!currentProject?.id) {
        setOverdueTasks([]);
        setUpcomingTasks([]);
        setIsLoadingTasks(false);
        return;
      }

      try {
        setIsLoadingTasks(true);
        const allTasks = await taskService.getTasks(currentProject.id);
        // Get overdue incomplete tasks
        const overdue = getOverdueTasks(allTasks);
        setOverdueTasks(overdue);
        // Get upcoming incomplete tasks (limit to 5 for dashboard)
        const upcoming = getUpcomingTasks(allTasks, 5);
        setUpcomingTasks(upcoming);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setOverdueTasks([]);
        setUpcomingTasks([]);
      } finally {
        setIsLoadingTasks(false);
      }
    }

    fetchTasks();
  }, [currentProject?.id]);

  // Default farm data if no project selected
  const farm = currentProject || {
    name: "My Farm",
    city: "",
    state: "",
    acres: 0,
  };

  // Format location for display
  const farmDisplayLocation = [farm.city, farm.state].filter(Boolean).join(', ') || 'No location set';

  // Get enabled modules from current project
  const enabledModules = currentProject?.enabledModules || [];

  // Navigation handlers
  const handleOpenModule = (route: string) => {
    navigate(route);
  };

  const handleGoToModules = () => {
    navigate(ROUTES.APP.MODULES);
  };

  const handleAddTask = () => {
    // Navigate to calendar to add a task
    navigate(ROUTES.APP.CALENDAR);
  };

  const handleToggleTask = async (taskId: string, isOverdue: boolean) => {
    try {
      setTogglingTaskId(taskId);
      const updatedTask = await taskService.toggleComplete(taskId);
      // Remove completed tasks from the appropriate list
      if (updatedTask.completed) {
        if (isOverdue) {
          setOverdueTasks(prev => prev.filter(t => t.id !== taskId));
        } else {
          setUpcomingTasks(prev => prev.filter(t => t.id !== taskId));
        }
      } else {
        if (isOverdue) {
          setOverdueTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        } else {
          setUpcomingTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        }
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    } finally {
      setTogglingTaskId(null);
    }
  };

  // Build weather location from project address components
  const weatherLocation = currentProject
    ? [currentProject.city, currentProject.state].filter(Boolean).join(', ')
    : undefined;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="mb-2">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening on your farm today.</p>
      </div>

      {/* Top Row: Farm Summary + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Summary Card */}
        <div className="lg:col-span-2">
          <DashboardCard title={farm.name} icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p>{farmDisplayLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Acreage</p>
                  <p className="text-2xl font-semibold">{farm.acres} acres</p>
                </div>
              </div>
              
              {/* Map Preview */}
              <MapPreview
                address={currentProject?.address}
                city={currentProject?.city}
                state={currentProject?.state}
                zipCode={currentProject?.zipCode}
                latitude={currentProject?.latitude}
                longitude={currentProject?.longitude}
                className="h-40 min-h-[160px]"
              />
            </div>
          </DashboardCard>
        </div>

        {/* Weather Panel */}
        <WeatherPanel location={weatherLocation} />
      </div>

      {/* Tasks & Modules Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks & Reminders */}
        <DashboardCard
          title="Tasks & Reminders"
          icon={CheckSquare}
          action={
            <Button size="sm" variant="outline" onClick={handleAddTask}>
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          }
        >
          <div className="space-y-4">
            {isLoadingTasks ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : overdueTasks.length === 0 && upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming tasks
              </p>
            ) : (
              <>
                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">Overdue</span>
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">
                        {overdueTasks.length}
                      </Badge>
                    </div>
                    {overdueTasks.map((task) => {
                      const moduleColor = MODULE_COLORS[task.module] || MODULE_COLORS.general;
                      return (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task.id, true)}
                            disabled={togglingTaskId === task.id}
                            className="mt-0.5 w-5 h-5 rounded border border-red-300 dark:border-red-700 flex items-center justify-center hover:border-red-500 transition-colors disabled:opacity-50"
                          >
                            {togglingTaskId === task.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : null}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${moduleColor.bg} ${moduleColor.text}`}>
                                {moduleColor.icon} {task.module}
                              </span>
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {formatDate(task.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upcoming Tasks */}
                {upcomingTasks.length > 0 && (
                  <div className="space-y-2">
                    {overdueTasks.length > 0 && (
                      <span className="text-xs font-medium text-muted-foreground">Upcoming</span>
                    )}
                    {upcomingTasks.map((task) => {
                      const moduleColor = MODULE_COLORS[task.module] || MODULE_COLORS.general;
                      return (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task.id, false)}
                            disabled={togglingTaskId === task.id}
                            className="mt-0.5 w-5 h-5 rounded border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50"
                          >
                            {togglingTaskId === task.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : task.completed ? (
                              <CheckSquare className="w-4 h-4 text-primary" />
                            ) : null}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${moduleColor.bg} ${moduleColor.text}`}>
                                {moduleColor.icon} {task.module}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(task.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </DashboardCard>

        {/* Enabled Modules */}
        <DashboardCard title="Active Modules" icon={Package}>
          <div className="space-y-4">
            {enabledModules.length > 0 ? (
              enabledModules
                .filter((moduleId) => MODULE_CONFIG[moduleId])
                .map((moduleId) => {
                  const module = MODULE_CONFIG[moduleId];
                  return (
                    <div
                      key={moduleId}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card cursor-pointer"
                      onClick={() => handleOpenModule(module.route)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{module.icon}</span>
                          <h3>{module.name}</h3>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        {module.stats.map((stat, idx) => (
                          <div key={idx}>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                            <p className="text-lg font-semibold">{stat.value}</p>
                          </div>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModule(module.route);
                        }}
                      >
                        Open Module
                      </Button>
                    </div>
                  );
                })
            ) : (
              <div className="p-6 rounded-lg border border-dashed border-border text-center">
                <Package className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-3">
                  No modules enabled yet
                </p>
                <Button variant="outline" size="sm" onClick={handleGoToModules}>
                  Enable Modules
                </Button>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity">
        <div className="space-y-3">
          {isLoadingActivities ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => {
              const colors = getActivityCategoryColors(activity.category);
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-1.5 rounded-md ${colors.bg} mt-0.5`}>
                    <span className="text-sm">{getActivityEmoji(activity.category)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getActivityCategoryLabel(activity.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatActivityTime(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DashboardCard>
    </div>
  );
}