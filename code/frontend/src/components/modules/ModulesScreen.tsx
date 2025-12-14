import { Droplets, Bird, Sprout, Apple, Trees, PawPrint, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { DashboardCard } from "../ui/DashboardCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useProjects } from "@/contexts/ProjectContext";

interface ModuleDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  stats?: Array<{ label: string; value: string }>;
  route?: string;
  settingsId?: string;
}

// All available modules - IDs match FarmSettings
const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 'maple',
    name: 'Maple Sugaring',
    icon: '🍁',
    description: 'Track your maple syrup production from tap to bottle',
    stats: [
      { label: 'Taps', value: '0' },
      { label: 'Sap Collected', value: '0 gal' },
      { label: 'Syrup Produced', value: '0 gal' },
    ],
    route: ROUTES.MAPLE.DASHBOARD,
    settingsId: 'maple-settings',
  },
  {
    id: 'poultry',
    name: 'Poultry',
    icon: '🐔',
    description: 'Track egg production, manage flocks, and monitor flock health',
    stats: [
      { label: 'Total Birds', value: '0' },
      { label: 'Eggs Today', value: '0' },
      { label: 'Month Total', value: '0' },
    ],
    route: ROUTES.POULTRY.DASHBOARD,
    settingsId: 'poultry-settings',
  },
  {
    id: 'garden',
    name: 'Gardening',
    icon: '🥕',
    description: 'Plan crop rotations, track plantings, and manage harvests',
    settingsId: 'garden-settings',
  },
  {
    id: 'orchard',
    name: 'Orchard',
    icon: '🍎',
    description: 'Track fruit trees, harvests, and pruning schedules',
    settingsId: 'orchard-settings',
  },
  {
    id: 'christmas-trees',
    name: 'Christmas Trees',
    icon: '🎄',
    description: 'Manage your Christmas tree farm from planting to harvest',
    settingsId: 'christmas-trees-settings',
  },
  {
    id: 'wildlife',
    name: 'Wildlife Habitat',
    icon: '🦌',
    description: 'Track wildlife sightings and manage habitat improvements',
    settingsId: 'wildlife-settings',
  },
];

export function ModulesScreen() {
  const navigate = useNavigate();
  const { currentProject } = useProjects();
  const enabledModules = currentProject?.enabledModules || [];

  const handleOpenModule = (module: ModuleDefinition) => {
    if (module.route) {
      navigate(module.route);
    }
  };

  const handleModuleSettings = (module: ModuleDefinition) => {
    if (module.settingsId) {
      navigate(`${ROUTES.APP.SETTINGS}?page=${module.settingsId}`);
    }
  };

  const handleEnableModule = () => {
    // Navigate to farm settings to enable modules
    navigate(`${ROUTES.APP.SETTINGS}?page=farm-settings`);
  };

  // Split modules into enabled and available
  const activeModules = MODULE_DEFINITIONS.filter((m) =>
    enabledModules.includes(m.id)
  );
  const availableModules = MODULE_DEFINITIONS.filter(
    (m) => !enabledModules.includes(m.id)
  );

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
        {activeModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeModules.map((module) => (
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
                  {module.route && (
                    <Button
                      className="flex-1"
                      onClick={() => handleOpenModule(module)}
                    >
                      Open Module
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleModuleSettings(module)}
                  >
                    Settings
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-lg border border-dashed border-border bg-muted/30 text-center">
            <p className="text-muted-foreground mb-4">
              No modules enabled yet. Enable modules in Farm Settings to get started.
            </p>
            <Button variant="outline" onClick={handleEnableModule}>
              Go to Farm Settings
            </Button>
          </div>
        )}
      </div>

      {/* Available Modules */}
      {availableModules.length > 0 && (
        <div>
          <h2 className="mb-4">Available Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => (
              <div
                key={module.id}
                className="p-6 rounded-lg border border-dashed border-border bg-card"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl opacity-60">{module.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-muted-foreground">{module.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEnableModule}
                >
                  Enable Module
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <DashboardCard title="About Modules" icon={Info}>
        <p className="text-sm text-muted-foreground">
          Farm modules are specialized tools designed for specific farming activities.
          Each module provides targeted features, tracking, and insights for that
          particular aspect of your hobby farm. Enable the modules you need in
          Farm Settings and customize them to match your farming goals.
        </p>
      </DashboardCard>
    </div>
  );
}
