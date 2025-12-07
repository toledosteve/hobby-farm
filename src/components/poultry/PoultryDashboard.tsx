import { useState } from "react";
import { Egg, Bird, Plus, TrendingUp, Calendar, Droplet } from "lucide-react";
import { DashboardCard } from "../ui/DashboardCard";
import { StatCard } from "../ui/StatCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PoultryDashboardProps {
  onAddFlock?: () => void;
  onLogEggs?: () => void;
  onAddFeedLog?: () => void;
  onAddHealthEvent?: () => void;
  onManageFlocks?: () => void;
}

export function PoultryDashboard({
  onAddFlock,
  onLogEggs,
  onAddFeedLog,
  onAddHealthEvent,
  onManageFlocks,
}: PoultryDashboardProps) {
  const [currentSeason] = useState('2025');
  const [chartView, setChartView] = useState<'all' | 'per-flock'>('all');

  // Mock data
  const stats = {
    totalBirds: 0,
    eggsToday: 0,
    sevenDayAverage: 0,
    monthTotal: 0,
  };

  const eggProductionData = Array.from({ length: 30 }, (_, i) => ({
    date: `Mar ${i + 1}`,
    eggs: 0,
  }));

  const recentActivity = [
    { id: 1, action: 'Season started', date: '2 hours ago', icon: Calendar },
    { id: 2, action: 'Ready to add your first flock', date: 'Just now', icon: Bird },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Season Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🐔</span>
            <h1>Poultry – {currentSeason} Season</h1>
          </div>
          <p className="text-muted-foreground">
            Track egg production and manage your flocks
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddFlock}>
            <Plus className="w-4 h-4 mr-2" />
            Add Flock
          </Button>
          <Button variant="outline" onClick={onLogEggs}>
            <Egg className="w-4 h-4 mr-2" />
            Log Eggs
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Birds"
          value={stats.totalBirds}
          icon={Bird}
        />
        <StatCard
          label="Eggs Today"
          value={stats.eggsToday}
          icon={Egg}
        />
        <StatCard
          label="7-Day Average"
          value={`${stats.sevenDayAverage}/day`}
          icon={TrendingUp}
        />
        <StatCard
          label="Month Total"
          value={stats.monthTotal}
          icon={Calendar}
        />
      </div>

      {/* Quick Actions */}
      <DashboardCard title="Quick Actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onAddFlock}>
            <Bird className="w-5 h-5" />
            <span>Add Flock</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onLogEggs}>
            <Egg className="w-5 h-5" />
            <span>Log Eggs</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onAddFeedLog}>
            <Droplet className="w-5 h-5" />
            <span>Add Feed Log</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onAddHealthEvent}>
            <Plus className="w-5 h-5" />
            <span>Health Event</span>
          </Button>
        </div>
      </DashboardCard>

      {/* Production Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Egg Production Chart */}
        <DashboardCard 
          title="Egg Production (30 Days)" 
          description="Daily collection totals"
          action={
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={chartView === 'all' ? 'default' : 'outline'}
                onClick={() => setChartView('all')}
              >
                All Flocks
              </Button>
              <Button
                size="sm"
                variant={chartView === 'per-flock' ? 'default' : 'outline'}
                onClick={() => setChartView('per-flock')}
              >
                Per Flock
              </Button>
            </div>
          }
        >
          <div className="h-[300px]">
            {stats.eggsToday === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Egg className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    No egg production logged yet. Start by adding a flock!
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eggProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis dataKey="date" stroke="#78716C" />
                  <YAxis stroke="#78716C" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="eggs"
                    stroke="#2D5F3F"
                    strokeWidth={2}
                    dot={{ fill: '#2D5F3F' }}
                    name="Eggs Collected"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Activity">
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activity yet this season
              </p>
            ) : (
              recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full" onClick={onManageFlocks}>
                <Bird className="w-4 h-4 mr-2" />
                Manage Flocks
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
