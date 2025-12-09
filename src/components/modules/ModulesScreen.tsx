import { Droplets, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { DashboardCard } from "../ui/DashboardCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  stats?: Array<{ label: string; value: string }>;
}

export function ModulesScreen() {
  const navigate = useNavigate();

  const handleOpenModule = (moduleId: string) => {
    console.log('Opening module:', moduleId);
    if (moduleId === 'maple-sugaring') {
      navigate(ROUTES.MAPLE.DASHBOARD);
    } else if (moduleId === 'poultry') {
      navigate(ROUTES.POULTRY.DASHBOARD);
    }
  };

  const handleModuleSettings = (moduleId: string) => {
    console.log('Opening settings for module:', moduleId);
    // TODO: Implement module-specific settings
  };
  const modules: Module[] = [
    {
      id: 'maple-sugaring',
      name: 'Maple Sugaring',
      icon: '🍁',
      description: 'Track your maple syrup production from tap to bottle',
      enabled: true,
      stats: [
        { label: 'Taps', value: '0' },
        { label: 'Sap Collected', value: '0 gal' },
        { label: 'Syrup Produced', value: '0 gal' },
      ],
    },
    {
      id: 'poultry',
      name: 'Poultry',
      icon: '🐔',
      description: 'Track egg production, manage flocks, and monitor flock health',
      enabled: true,
      stats: [
        { label: 'Total Birds', value: '0' },
        { label: 'Eggs Today', value: '0' },
        { label: 'Month Total', value: '0' },
      ],
    },
    {
      id: 'beekeeping',
      name: 'Beekeeping',
      icon: '🐝',
      description: 'Manage hives, track honey production, and monitor colony health',
      enabled: false,
    },
    {
      id: 'orchard',
      name: 'Orchard Management',
      icon: '🍎',
      description: 'Track fruit trees, harvests, and pruning schedules',
      enabled: false,
    },
    {
      id: 'livestock',
      name: 'Livestock',
      icon: '🐄',
      description: 'Monitor animal health, breeding, and production',
      enabled: false,
    },
    {
      id: 'garden',
      name: 'Garden Planner',
      icon: '🥕',
      description: 'Plan crop rotations, track plantings, and manage harvests',
      enabled: false,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Farm Modules</h1>
        <p className="text-muted-foreground">
          Specialized tools for different aspects of your hobby farm
        </p>
      </div>

      {/* Active Modules */}
      <div>
        <h2 className="mb-4">Active Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules
            .filter((m) => m.enabled)
            .map((module) => (
              <div
                key={module.id}
                className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{module.icon}</span>
                    <div>
                      <h3>{module.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>

                {module.stats && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted rounded-lg">
                    {module.stats.map((stat, index) => (
                      <div key={index}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {stat.label}
                        </p>
                        <p className="font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleOpenModule(module.id)}
                  >
                    Open Module
                  </Button>
                  <Button variant="outline" onClick={() => handleModuleSettings(module.id)}>
                    Settings
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Available Modules */}
      <div>
        <h2 className="mb-4">Available Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules
            .filter((m) => !m.enabled)
            .map((module) => (
              <div
                key={module.id}
                className="p-6 rounded-lg border border-dashed border-border bg-card opacity-60"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3>{module.name}</h3>
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="mb-3">
                  Coming Soon
                </Badge>

                <Button variant="outline" className="w-full" disabled>
                  Enable Module
                </Button>
              </div>
            ))}
        </div>
      </div>

      {/* Info Card */}
      <DashboardCard title="About Modules" icon={Droplets}>
        <p className="text-sm text-muted-foreground">
          Farm modules are specialized tools designed for specific farming activities.
          Each module provides targeted features, tracking, and insights for that
          particular aspect of your hobby farm. Enable the modules you need and
          customize them to match your farming goals.
        </p>
      </DashboardCard>
    </div>
  );
}