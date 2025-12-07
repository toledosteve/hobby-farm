import { MapPin, Plus, Droplets, CheckSquare } from "lucide-react";
import { DashboardCard } from "../ui/DashboardCard";
import { StatCard } from "../ui/StatCard";
import { WeatherPanel } from "../ui/WeatherPanel";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface FarmDashboardProps {
  farm: {
    name: string;
    location: string;
    acres: number;
  };
  onOpenMapleSugaring?: () => void;
  onOpenPoultry?: () => void;
  onAddTask?: () => void;
}

export function FarmDashboard({ farm, onOpenMapleSugaring, onOpenPoultry, onAddTask }: FarmDashboardProps) {
  const tasks = [
    { id: 1, title: "Tap maple trees this weekend", date: "Mar 8-10", completed: false },
    { id: 2, title: "Check sap lines", date: "Mar 12", completed: false },
    { id: 3, title: "Clean chicken coop", date: "Mar 14", completed: false },
  ];

  const recentActivity = [
    { id: 1, action: "Added 12 taps on East Ridge", date: "2 hours ago", module: "Maple" },
    { id: 2, action: "Collected 18 gallons of sap", date: "5 hours ago", module: "Maple" },
    { id: 3, action: "Updated boundary on North field", date: "Yesterday", module: "Map" },
  ];

  const weatherData = {
    current: {
      temp: 42,
      condition: 'cloudy' as const,
      description: 'Partly Cloudy',
    },
    forecast: [
      { day: 'Mon', high: 45, low: 28, condition: 'sunny' as const },
      { day: 'Tue', high: 38, low: 22, condition: 'cloudy' as const },
      { day: 'Wed', high: 42, low: 26, condition: 'sunny' as const },
      { day: 'Thu', high: 48, low: 30, condition: 'rainy' as const },
      { day: 'Fri', high: 52, low: 34, condition: 'sunny' as const },
    ],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="mb-2">Welcome back, Sarah</h1>
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
                  <p>{farm.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Acreage</p>
                  <p className="text-2xl font-semibold">{farm.acres} acres</p>
                </div>
              </div>
              
              {/* Boundary Preview */}
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Map Preview</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Weather Panel */}
        <WeatherPanel current={weatherData.current} forecast={weatherData.forecast} />
      </div>

      {/* Tasks & Modules Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks & Reminders */}
        <DashboardCard
          title="Tasks & Reminders"
          icon={CheckSquare}
          action={
            <Button size="sm" variant="outline" onClick={onAddTask}>
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          }
        >
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming tasks
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="mt-1"
                    onChange={() => {}}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Enabled Modules */}
        <DashboardCard title="Active Modules" icon={Droplets}>
          <div className="space-y-4">
            {/* Maple Sugaring Module */}
            <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                 onClick={onOpenMapleSugaring}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍁</span>
                  <h3>Maple Sugaring</h3>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Taps</p>
                  <p className="text-lg font-semibold">0</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sap Collected</p>
                  <p className="text-lg font-semibold">0 gal</p>
                </div>
              </div>

              <Button size="sm" className="w-full" onClick={onOpenMapleSugaring}>
                Open Module
              </Button>
            </div>

            {/* Poultry Module */}
            <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                 onClick={onOpenPoultry}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐓</span>
                  <h3>Poultry</h3>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Chickens</p>
                  <p className="text-lg font-semibold">0</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Eggs Collected</p>
                  <p className="text-lg font-semibold">0</p>
                </div>
              </div>

              <Button size="sm" className="w-full" onClick={onOpenPoultry}>
                Open Module
              </Button>
            </div>

            {/* Placeholder for future modules */}
            <div className="p-4 rounded-lg border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground">More modules coming soon</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity">
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <Droplets className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.module}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardCard>
    </div>
  );
}