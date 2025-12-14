import {
  User,
  Shield,
  Settings,
  Home,
  Layers,
  Droplets,
  Bird,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn } from "../ui/utils";

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

export function SettingsSidebar({ activePage, onPageChange }: SettingsSidebarProps) {
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
    {
      title: 'Modules',
      items: [
        { id: 'maple-settings', label: 'Maple Sugaring', icon: Droplets },
        { id: 'poultry-settings', label: 'Poultry', icon: Bird },
      ],
    },
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