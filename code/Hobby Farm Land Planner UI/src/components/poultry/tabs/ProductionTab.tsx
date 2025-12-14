import { useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  Egg,
  TrendingUp,
  TrendingDown,
  Calendar,
  Scale,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Flock, EggLog, GrowthLog } from "../types";

interface ProductionTabProps {
  flock: Flock;
  onLogProduction?: () => void;
}

export function ProductionTab({ flock, onLogProduction }: ProductionTabProps) {
  const isLayers = flock.type === "layers";

  // Mock egg production data for layers
  const eggLogs: EggLog[] = isLayers
    ? [
        {
          id: "egg-1",
          flockId: flock.id,
          date: "2025-02-14",
          count: 16,
          createdAt: "2025-02-14T18:00:00Z",
        },
        {
          id: "egg-2",
          flockId: flock.id,
          date: "2025-02-13",
          count: 15,
          createdAt: "2025-02-13T18:00:00Z",
        },
        {
          id: "egg-3",
          flockId: flock.id,
          date: "2025-02-12",
          count: 17,
          createdAt: "2025-02-12T18:00:00Z",
        },
        {
          id: "egg-4",
          flockId: flock.id,
          date: "2025-02-11",
          count: 14,
          createdAt: "2025-02-11T18:00:00Z",
        },
        {
          id: "egg-5",
          flockId: flock.id,
          date: "2025-02-10",
          count: 16,
          createdAt: "2025-02-10T18:00:00Z",
        },
      ]
    : [];

  // Mock growth data for meat birds
  const growthLogs: GrowthLog[] = !isLayers
    ? [
        {
          id: "growth-1",
          flockId: flock.id,
          date: "2025-02-14",
          ageInWeeks: 2,
          averageWeight: 0.8,
          notes: "Good growth, all birds active",
          createdAt: "2025-02-14T10:00:00Z",
        },
        {
          id: "growth-2",
          flockId: flock.id,
          date: "2025-02-07",
          ageInWeeks: 1,
          averageWeight: 0.3,
          notes: "All birds healthy",
          createdAt: "2025-02-07T10:00:00Z",
        },
      ]
    : [];

  // Chart data for egg production
  const eggChartData = eggLogs
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      eggs: log.count,
      avgPerBird: (log.count / flock.birdCount).toFixed(1),
    }))
    .reverse();

  // Chart data for growth
  const growthChartData = growthLogs
    .map((log) => ({
      week: `Week ${log.ageInWeeks}`,
      weight: log.averageWeight,
    }))
    .reverse();

  const calculateEggMetrics = () => {
    if (eggLogs.length === 0) return null;

    const totalEggs = eggLogs.reduce((sum, log) => sum + log.count, 0);
    const avgPerDay = totalEggs / eggLogs.length;
    const avgPerBird = avgPerDay / flock.birdCount;
    const productionRate = (avgPerBird * 100).toFixed(0);

    // Compare with previous period
    const currentWeekEggs = eggLogs.slice(0, 7).reduce((sum, log) => sum + log.count, 0);
    const previousWeekEggs = eggLogs.slice(7, 14).reduce((sum, log) => sum + log.count, 0);
    const trend = previousWeekEggs > 0 
      ? ((currentWeekEggs - previousWeekEggs) / previousWeekEggs) * 100 
      : 0;

    return {
      totalEggs,
      avgPerDay: avgPerDay.toFixed(1),
      avgPerBird: avgPerBird.toFixed(2),
      productionRate,
      trend: trend.toFixed(0),
    };
  };

  const calculateGrowthMetrics = () => {
    if (growthLogs.length === 0) return null;

    const latestLog = growthLogs[0];
    const currentWeight = latestLog.averageWeight || 0;
    const currentAge = latestLog.ageInWeeks;

    // Estimate processing readiness (typical: 8-10 weeks for Cornish Cross)
    const targetWeeks = 8;
    const weeksRemaining = Math.max(0, targetWeeks - currentAge);
    const expectedWeight = 5.5; // lbs
    const weightProgress = (currentWeight / expectedWeight) * 100;

    return {
      currentWeight: currentWeight.toFixed(1),
      currentAge,
      weeksRemaining,
      weightProgress: weightProgress.toFixed(0),
    };
  };

  const eggMetrics = isLayers ? calculateEggMetrics() : null;
  const growthMetrics = !isLayers ? calculateGrowthMetrics() : null;

  if (isLayers) {
    return (
      <div className="space-y-6">
        {/* Egg Production Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <Egg className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {eggMetrics?.totalEggs || 0}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{eggMetrics?.avgPerDay || 0} per day</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-sm text-muted-foreground">Avg per Bird</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {eggMetrics?.avgPerBird || 0}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>eggs per day</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm text-muted-foreground">Production Rate</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {eggMetrics?.productionRate || 0}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>of flock laying</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm text-muted-foreground">Weekly Trend</div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {eggMetrics && Number(eggMetrics.trend) >= 0 ? "+" : ""}
              {eggMetrics?.trend || 0}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {eggMetrics && Number(eggMetrics.trend) >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span>vs last week</span>
            </div>
          </div>
        </div>

        {/* Egg Production Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Egg Production</h3>
              <p className="text-sm text-muted-foreground">
                Daily egg collection over time
              </p>
            </div>
            <Button onClick={onLogProduction}>
              <Plus className="w-4 h-4 mr-2" />
              Log Eggs
            </Button>
          </div>

          {eggChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eggChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="eggs"
                  fill="#f59e0b"
                  name="Total Eggs"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No production data yet. Start logging eggs!
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Logs</h3>
          <div className="space-y-3">
            {eggLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <Egg className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {log.count} eggs collected
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">
                  {(log.count / flock.birdCount).toFixed(1)} per bird
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Egg className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Maximizing Egg Production
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Consistent daylight (14-16 hours) helps maintain production</li>
                <li>• High-quality layer feed ensures proper nutrition</li>
                <li>• Clean nesting boxes encourage laying in designated areas</li>
                <li>• Stress reduction keeps birds healthy and productive</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Meat Birds Growth Tracking
  return (
    <div className="space-y-6">
      {/* Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-sm text-muted-foreground">Current Weight</div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {growthMetrics?.currentWeight || 0} lbs
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>average per bird</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm text-muted-foreground">Current Age</div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {growthMetrics?.currentAge || 0}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>weeks old</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm text-muted-foreground">Processing In</div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {growthMetrics?.weeksRemaining || 0}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>weeks remaining</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-sm text-muted-foreground">Weight Progress</div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {growthMetrics?.weightProgress || 0}%
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>to target weight</span>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Growth Progression</h3>
            <p className="text-sm text-muted-foreground">
              Average weight over time
            </p>
          </div>
          <Button onClick={onLogProduction}>
            <Plus className="w-4 h-4 mr-2" />
            Log Weight
          </Button>
        </div>

        {growthChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#10b981"
                strokeWidth={3}
                name="Average Weight (lbs)"
                dot={{ fill: "#10b981", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No growth data yet. Start logging weights!
          </div>
        )}
      </div>

      {/* Recent Logs */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Weight Logs</h3>
        <div className="space-y-3">
          {growthLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium">
                    Week {log.ageInWeeks} - {log.averageWeight} lbs avg
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.notes || "No notes"}
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                {new Date(log.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Healthy Growth Guidelines
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Regular weighing helps track development and catch issues early</li>
              <li>• Consistent feed quality supports steady growth</li>
              <li>• Adequate space and ventilation reduce stress and disease</li>
              <li>• Processing window is typically 8-10 weeks for Cornish Cross</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
