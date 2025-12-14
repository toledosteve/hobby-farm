import {
  User,
  Shield,
  Settings,
  Home,
  Droplets,
  Bird,
  CreditCard,
  ChevronRight,
  Sprout,
  Apple,
  Trees,
  PawPrint,
} from "lucide-react";
import { cn } from "../ui/utils";
import { useProjects } from "@/contexts/ProjectContext";

interface SettingsSidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

// Module settings mapping
const MODULE_SETTINGS: Record<string, { id: string; label: string; icon: React.ElementType }> = {
  maple: { id: 'maple-settings', label: 'Maple Sugaring', icon: Droplets },
  poultry: { id: 'poultry-settings', label: 'Poultry', icon: Bird },
  garden: { id: 'garden-settings', label: 'Gardening', icon: Sprout },
  orchard: { id: 'orchard-settings', label: 'Orchard', icon: Apple },
  'christmas-trees': { id: 'christmas-trees-settings', label: 'Christmas Trees', icon: Trees },
  wildlife: { id: 'wildlife-settings', label: 'Wildlife Habitat', icon: PawPrint },
};

export function SettingsSidebar({ activePage, onPageChange }: SettingsSidebarProps) {
  const { currentProject } = useProjects();
  const enabledModules = currentProject?.enabledModules || [];

  // Build module nav items from enabled modules
  const moduleNavItems: NavItem[] = enabledModules
    .filter((moduleId) => MODULE_SETTINGS[moduleId])
    .map((moduleId) => MODULE_SETTINGS[moduleId]);

  const sections: NavSection[] = [
    {
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'account', label: 'Account', icon: Shield },
        { id: 'preferences', label: 'App Preferences', icon: Settings },
      ],
    },
    {
      title: 'Farm',
      items: [
        { id: 'farm-settings', label: 'Farm Settings', icon: Home },
      ],
    },
    // Only show Modules section if there are enabled modules
    ...(moduleNavItems.length > 0
      ? [
          {
            title: 'Modules',
            items: moduleNavItems,
          },
        ]
      : []),
    {
      title: 'Billing',
      items: [
        { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
      ],
    },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="mb-6">Settings</h2>
        
        <nav className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <p className="text-xs font-medium text-muted-foreground mb-2 px-3">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => !item.disabled && onPageChange(item.id)}
                      disabled={item.disabled}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                        item.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}