import { useState } from "react";
import { Droplets, TreePine, Flame, Plus, TrendingUp, Calendar } from "lucide-react";
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
} from "recharts";

interface MapleDashboardProps {
  onAddTree?: () => void;
  onAddTap?: () => void;
  onLogCollection?: () => void;
  onLogBoil?: () => void;
  onManageTrees?: () => void;
}

export function MapleDashboard({
  onAddTree,
  onAddTap,
  onLogCollection,
  onLogBoil,
  onManageTrees,
}: MapleDashboardProps) {
  const [currentSeason] = useState('2025');

  // Mock data
  const stats = {
    tapsInstalled: 0,
    sapCollected: 0,
    boilsCompleted: 0,
    syrupProduced: 0,
  };

  const sapCollectionData = [
    { date: 'Mar 1', gallons: 0 },
    { date: 'Mar 2', gallons: 0 },
    { date: 'Mar 3', gallons: 0 },
    { date: 'Mar 4', gallons: 0 },
    { date: 'Mar 5', gallons: 0 },
    { date: 'Mar 6', gallons: 0 },
    { date: 'Mar 7', gallons: 0 },
  ];

  const flowForecast = [
    { day: 'Mon', date: 'Mar 10', high: 45, low: 28, flow: 'High Flow Expected', flowLevel: 'high' },
    { day: 'Tue', date: 'Mar 11', high: 48, low: 30, flow: 'High Flow Expected', flowLevel: 'high' },
    { day: 'Wed', date: 'Mar 12', high: 38, low: 22, flow: 'Moderate Flow', flowLevel: 'moderate' },
    { day: 'Thu', date: 'Mar 13', high: 42, low: 26, flow: 'Moderate Flow', flowLevel: 'moderate' },
    { day: 'Fri', date: 'Mar 14', high: 52, low: 38, flow: 'Low Flow', flowLevel: 'low' },
  ];

  const recentActivity = [
    { id: 1, action: 'Season started', date: '2 hours ago', icon: Calendar },
    { id: 2, action: 'Ready to add trees and taps', date: 'Just now', icon: TreePine },
  ];

  const getFlowColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Season Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🍁</span>
            <h1>Maple Sugaring – {currentSeason} Season</h1>
          </div>
          <p className="text-muted-foreground">
            Track your maple syrup production and manage your sugar bush
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Change Season</Button>
          <Button variant="outline">Close Season</Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Taps Installed"
          value={stats.tapsInstalled}
          icon={Droplets}
        />
        <StatCard
          label="Sap Collected"
          value={`${stats.sapCollected} gal`}
          icon={TreePine}
        />
        <StatCard
          label="Boils Completed"
          value={stats.boilsCompleted}
          icon={Flame}
        />
        <StatCard
          label="Syrup Produced"
          value={`${stats.syrupProduced} gal`}
          icon={TrendingUp}
        />
      </div>

      {/* Quick Actions */}
      <DashboardCard title="Quick Actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onAddTree}>
            <TreePine className="w-5 h-5" />
            <span>Add Tree</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onAddTap}>
            <Droplets className="w-5 h-5" />
            <span>Add Tap(s)</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onLogCollection}>
            <Plus className="w-5 h-5" />
            <span>Log Collection</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={onLogBoil}>
            <Flame className="w-5 h-5" />
            <span>Log Boil</span>
          </Button>
        </div>
      </DashboardCard>

      {/* Flowcast & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flowcast Panel */}
        <DashboardCard title="Sap Flow Forecast" description="Ideal freeze/thaw cycles ahead">
          <div className="space-y-3">
            {flowForecast.map((day, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getFlowColor(day.flowLevel)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-sm text-muted-foreground">{day.date}</span>
                  </div>
                  <div className="text-sm">
                    {day.high}° / {day.low}°
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {day.flow}
                </Badge>
              </div>
            ))}
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
              <Button variant="outline" className="w-full" onClick={onManageTrees}>
                <TreePine className="w-4 h-4 mr-2" />
                Manage Trees & Taps
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Sap Collection Chart */}
      <DashboardCard title="Sap Collection This Week" description="Daily collection totals">
        <div className="h-[300px]">
          {stats.sapCollected === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No sap collected yet. Start logging your collections!
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sapCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="date" stroke="#78716C" />
                <YAxis stroke="#78716C" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gallons"
                  stroke="#2D5F3F"
                  strokeWidth={2}
                  dot={{ fill: '#2D5F3F' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
