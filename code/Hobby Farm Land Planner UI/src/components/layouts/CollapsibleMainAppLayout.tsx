import { ReactNode, useState, useEffect } from "react";
import { 
  Home, 
  Map, 
  Calendar, 
  Package, 
  Settings, 
  CloudSun,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../ui/utils";
import { UserDropdown } from "./UserDropdown";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CollapsibleMainAppLayoutProps {
  children: ReactNode;
  activeTab: 'dashboard' | 'map' | 'calendar' | 'modules' | 'weather' | 'settings';
  onTabChange: (tab: 'dashboard' | 'map' | 'calendar' | 'modules' | 'weather' | 'settings') => void;
  currentProject?: {
    name: string;
  };
  projects?: Array<{ id: string; name: string }>;
  onProjectChange?: (projectId: string) => void;
  onLogout?: () => void;
  fullWidth?: boolean;
  unreadAlertCount?: number;
  onOpenAlerts?: () => void;
}

export function CollapsibleMainAppLayout({
  children,
  activeTab,
  onTabChange,
  currentProject,
  projects = [],
  onProjectChange,
  onLogout,
  fullWidth,
  unreadAlertCount,
  onOpenAlerts,
}: CollapsibleMainAppLayoutProps) {
  // Load pinned state from localStorage
  const [isPinned, setIsPinned] = useState(() => {
    const stored = localStorage.getItem('sidebar-pinned');
    return stored ? JSON.parse(stored) : true;
  });
  
  const [isHovered, setIsHovered] = useState(false);
  
  // Save pinned state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-pinned', JSON.stringify(isPinned));
  }, [isPinned]);
  
  const isExpanded = isPinned || isHovered;

  const weatherData = {
    temp: 42,
    condition: 'partly-cloudy',
    icon: CloudSun,
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'map' as const, label: 'Map', icon: Map },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'modules' as const, label: 'Modules', icon: Package },
    { id: 'weather' as const, label: 'Weather', icon: CloudSun },
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
          {/* Alerts Bell */}
          {onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="View alerts"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadAlertCount && unreadAlertCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                  {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                </Badge>
              )}
            </button>
          )}

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
        {!fullWidth && (
          <aside
            className={cn(
              "border-r border-border bg-card hidden lg:block transition-all duration-300 relative",
              isExpanded ? "w-64" : "w-16"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Collapse/Expand Button - Positioned on the border */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPinned(!isPinned);
              }}
              onMouseEnter={(e) => e.stopPropagation()}
              onMouseLeave={(e) => e.stopPropagation()}
              className={cn(
                "absolute top-16 -right-3 z-10 h-6 w-6 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-all flex items-center justify-center",
                "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                isExpanded ? "opacity-100" : "opacity-0"
              )}
              aria-label={isPinned ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isPinned ? (
                <ChevronLeft className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            <nav className={cn("space-y-1 pt-16", isExpanded ? "p-4" : "px-2 py-4")}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center py-2.5 rounded-lg transition-colors relative group",
                      isExpanded ? "px-3 gap-3" : "px-2 justify-center",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className={cn(
                      "transition-all duration-300 whitespace-nowrap",
                      isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Tooltip for collapsed state */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

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