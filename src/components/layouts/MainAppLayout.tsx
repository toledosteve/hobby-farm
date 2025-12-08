import { ReactNode } from "react";
import { 
  Home, 
  Map, 
  Calendar, 
  Package, 
  Settings, 
  Cloud
} from "lucide-react";
import { cn } from "../ui/utils";
import { UserDropdown } from "./UserDropdown";

interface MainAppLayoutProps {
  children: ReactNode;
  activeTab: 'dashboard' | 'map' | 'calendar' | 'modules' | 'settings';
  onTabChange: (tab: 'dashboard' | 'map' | 'calendar' | 'modules' | 'settings') => void;
  currentProject?: {
    name: string;
  };
  projects?: Array<{ id: string; name: string }>;
  onProjectChange?: (projectId: string) => void;
  onLogout?: () => void;
}

export function MainAppLayout({
  children,
  activeTab,
  onTabChange,
  currentProject,
  projects = [],
  onProjectChange,
  onLogout,
}: MainAppLayoutProps) {
  const weatherData = {
    temp: 42,
    condition: 'partly-cloudy',
    icon: Cloud,
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'map' as const, label: 'Map', icon: Map },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'modules' as const, label: 'Modules', icon: Package },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
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
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
            <weatherData.icon className="w-4 h-4 text-muted-foreground" />
            <span>{weatherData.temp}°F</span>
          </div>

          {/* User Menu */}
          <UserDropdown
            farms={projects}
            currentFarmId={projects.find(p => p.name === currentProject?.name)?.id}
            onManageAccount={() => onTabChange('settings')}
            onSwitchFarm={(farmId) => onProjectChange?.(farmId)}
            onAddNewFarm={() => {
              console.log('Add new farm - navigate to onboarding');
            }}
            onLogout={onLogout}
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
                  onClick={() => onTabChange(item.id)}
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
                  onClick={() => onTabChange(item.id)}
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
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}