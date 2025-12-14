import { useState, useEffect } from "react";
import {
  Home,
  Map,
  Calendar,
  Package,
  Settings,
  Cloud,
  CloudRain,
  Sun,
  Snowflake,
  CloudSun,
  Loader2
} from "lucide-react";
import { cn } from "../ui/utils";
import { UserDropdown } from "./UserDropdown";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";
import { ROUTES } from "@/routes/routes";
import { useAuth } from "@/contexts/AuthContext";
import { weatherService, WeatherResponse } from "@/services/weather.service";

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  'partly-cloudy': CloudSun,
};

export function MainAppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProjects();
  const { user, logout } = useAuth();

  // Weather state
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Fetch weather based on current project location
  useEffect(() => {
    async function fetchWeather() {
      const weatherLocation = currentProject
        ? [currentProject.city, currentProject.state].filter(Boolean).join(', ')
        : null;

      // Only fetch if we have a valid location
      if (!weatherLocation) {
        setWeatherLoading(false);
        return;
      }

      try {
        setWeatherLoading(true);
        const data = await weatherService.getWeatherByLocation(weatherLocation);
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchWeather();
  }, [currentProject?.id, currentProject?.city, currentProject?.state]);

  const WeatherIcon = weather?.current?.condition
    ? weatherIcons[weather.current.condition] || Cloud
    : Cloud;

  // Compute user display values from auth context
  const userName = user ? `${user.firstName} ${user.lastName}` : undefined;
  const userEmail = user?.email;
  const userInitials = user && user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : undefined;
  const profilePhotoUrl = (user as any)?.profilePhotoUrl;

  // Determine active tab from current route
  const getActiveTab = () => {
    if (location.pathname.includes('/map')) return 'map';
    if (location.pathname.includes('/calendar')) return 'calendar';
    if (location.pathname.includes('/modules')) return 'modules';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home, route: ROUTES.APP.DASHBOARD },
    { id: 'map' as const, label: 'Map', icon: Map, route: ROUTES.APP.MAP },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar, route: ROUTES.APP.CALENDAR },
    { id: 'modules' as const, label: 'Modules', icon: Package, route: ROUTES.APP.MODULES },
    { id: 'settings' as const, label: 'Settings', icon: Settings, route: ROUTES.APP.SETTINGS },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="6" fill="#2D5F3F" />
              <path d="M14 8L19 14H16V20H12V14H9L14 8Z" fill="#84A98C" />
              <path
                d="M8 20H20"
                stroke="#E8F0E5"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h1 className="text-lg text-foreground hidden sm:block">Hobby Farm Planner</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Weather Summary */}
          {weatherLoading ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span>--°F</span>
            </div>
          ) : weather ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
              <WeatherIcon className="w-4 h-4 text-muted-foreground" />
              <span>{weather.current.temp}°F</span>
            </div>
          ) : null}

          {/* User Menu */}
          <UserDropdown
            userName={userName}
            userEmail={userEmail}
            userInitials={userInitials}
            profilePhotoUrl={profilePhotoUrl}
            farms={projects}
            currentFarmId={currentProject?.id}
            onManageAccount={() => navigate(ROUTES.APP.SETTINGS)}
            onSwitchFarm={(farmId) => {
              const project = projects.find(p => p.id === farmId);
              if (project) {
                setCurrentProject(project);
                navigate(ROUTES.APP.DASHBOARD);
              }
            }}
            onAddNewFarm={() => navigate(ROUTES.PROJECTS)}
            onViewAllFarms={() => navigate(ROUTES.PROJECTS)}
            onLogout={logout}
            onHelpCenter={() => {
              window.open('https://help.hobbyfarmplanner.com', '_blank');
            }}
            onContactSupport={() => {
              window.open('mailto:support@hobbyfarmplanner.com', '_blank');
            }}
            onSubmitFeedback={() => {
              console.log('Submit feedback');
            }}
          />
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-card hidden lg:block">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Bottom Nav (shown on small screens) */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-card z-50">
          <nav className="flex justify-around p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative pb-20 lg:pb-0">
          <div className="absolute inset-0 lg:pb-0 pb-20 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}