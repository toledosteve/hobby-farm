import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Plus,
  AlertCircle,
  Calendar,
  Droplet,
  Settings,
  TrendingUp,
  Eye,
} from "lucide-react";
import type { Hive, BeekeepingMetrics } from "./types";

interface BeekeepingDashboardV2Props {
  onAddHive?: () => void;
  onLogInspection?: () => void;
  onViewHive?: (hiveId: string) => void;
}

export function BeekeepingDashboardV2({
  onAddHive,
  onLogInspection,
  onViewHive,
}: BeekeepingDashboardV2Props) {
  // Mock data - replace with real data
  const metrics: BeekeepingMetrics = {
    totalHives: 6,
    activeHives: 6,
    hivesNeedingAttention: 1,
    honeyHarvestedThisSeason: 142,
    overduneInspections: 2,
    activeWithdrawals: 0,
  };

  const hives: Hive[] = [
    {
      id: "hive-1",
      name: "Hive 1A",
      type: "langstroth",
      location: "South Apiary",
      apiaryName: "Main Yard",
      installDate: "2024-04-15",
      colonyStatus: "strong",
      queenStatus: "sighted",
      queenMarked: true,
      queenColor: "Blue",
      lastInspectionDate: "2025-02-07",
      notes: "Excellent brood pattern, preparing for spring buildup",
      createdAt: "2024-04-15T10:00:00Z",
      updatedAt: "2025-02-07T14:00:00Z",
    },
    {
      id: "hive-2",
      name: "Hive 1B",
      type: "langstroth",
      location: "South Apiary",
      apiaryName: "Main Yard",
      installDate: "2024-05-01",
      colonyStatus: "strong",
      queenStatus: "sighted",
      queenMarked: true,
      queenColor: "Blue",
      lastInspectionDate: "2025-02-07",
      createdAt: "2024-05-01T10:00:00Z",
      updatedAt: "2025-02-07T14:00:00Z",
    },
    {
      id: "hive-3",
      name: "Top Bar 01",
      type: "top-bar",
      location: "North Garden",
      installDate: "2024-06-10",
      colonyStatus: "moderate",
      queenStatus: "not-sighted",
      lastInspectionDate: "2025-01-28",
      notes: "Need to check queen status on next inspection",
      createdAt: "2024-06-10T10:00:00Z",
      updatedAt: "2025-01-28T14:00:00Z",
    },
  ];

  const getColonyStatusBadge = (status: Hive["colonyStatus"]) => {
    switch (status) {
      case "strong":
        return (
          <Badge variant="success" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            Strong
          </Badge>
        );
      case "moderate":
        return <Badge variant="default">Moderate</Badge>;
      case "weak":
        return <Badge variant="warning">Weak</Badge>;
      case "unknown":
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getQueenStatusIcon = (status?: Hive["queenStatus"]) => {
    if (!status || status === "unknown") return null;
    if (status === "sighted") {
      return (
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <Eye className="w-3 h-3" />
          <span>Queen sighted</span>
        </div>
      );
    }
    if (status === "missing") {
      return (
        <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-3 h-3" />
          <span>Queen missing</span>
        </div>
      );
    }
    return null;
  };

  const getHiveTypeLabel = (type: Hive["type"]) => {
    const labels: Record<Hive["type"], string> = {
      langstroth: "Langstroth",
      "top-bar": "Top Bar",
      warre: "Warré",
      other: "Other",
    };
    return labels[type];
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const today = new Date();
    const daysAgo = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 7) return `${daysAgo} days ago`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const needsInspection = (lastInspectionDate?: string) => {
    if (!lastInspectionDate) return true;
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastInspectionDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysSince > 14; // Recommend inspection every 7-14 days during active season
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1>Beekeeping</h1>
              </div>
              <p className="text-muted-foreground">
                Manage hives, inspections, and honey production
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button onClick={onLogInspection} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Log Inspection
              </Button>
              <Button onClick={onAddHive}>
                <Plus className="w-4 h-4 mr-2" />
                Add Hive
              </Button>
            </div>
          </div>
        </div>

        {/* Apiary Overview Summary - Isomorphic Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Hives */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <svg
                  className="w-6 h-6 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="text-sm text-muted-foreground">Active Hives</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.activeHives}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>of {metrics.totalHives} total</span>
              </div>
            </div>
          </div>

          {/* Hives Needing Attention */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-lg ${
                  metrics.hivesNeedingAttention > 0
                    ? "bg-orange-50 dark:bg-orange-950"
                    : "bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <AlertCircle
                  className={`w-6 h-6 ${
                    metrics.hivesNeedingAttention > 0
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-sm text-muted-foreground">Need Attention</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">
                {metrics.hivesNeedingAttention}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>
                  {metrics.overduneInspections} overdue inspection
                  {metrics.overduneInspections !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Honey This Season */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <Droplet className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-sm text-muted-foreground">
                Honey This Season
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">
                {metrics.honeyHarvestedThisSeason}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>pounds harvested</span>
              </div>
            </div>
          </div>

          {/* Next Action */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm text-muted-foreground">Next Action</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">Spring Inspection</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Recommended this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Reminder Card */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Late Winter / Early Spring
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Check hives on the first warm day above 50°F. Look for signs of
                life, check food stores, and remove dead bees from entrances.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white dark:bg-gray-950"
                >
                  View Seasonal Checklist
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hive List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Your Hives</h2>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Inspection Schedule
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hives.map((hive) => (
              <div
                key={hive.id}
                onClick={() => onViewHive?.(hive.id)}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Hive Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl group-hover:text-primary transition-colors">
                        {hive.name}
                      </h3>
                      {getColonyStatusBadge(hive.colonyStatus)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getHiveTypeLabel(hive.type)}</span>
                      {hive.apiaryName && (
                        <>
                          <span>•</span>
                          <span>{hive.apiaryName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <svg
                      className="w-6 h-6 text-amber-600 dark:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hive Details Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Last Inspection
                    </div>
                    <div className="text-sm font-semibold">
                      {formatDate(hive.lastInspectionDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Queen</div>
                    <div className="text-sm font-semibold">
                      {hive.queenMarked && hive.queenColor
                        ? hive.queenColor
                        : hive.queenStatus === "sighted"
                        ? "Sighted"
                        : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Location
                    </div>
                    <div className="text-sm font-semibold truncate">
                      {hive.location || "Not set"}
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="space-y-2 mb-4">
                  {getQueenStatusIcon(hive.queenStatus)}
                  {needsInspection(hive.lastInspectionDate) && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>Inspection recommended</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogInspection?.();
                    }}
                  >
                    Log Inspection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewHive?.(hive.id);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {hives.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-amber-600 dark:text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-xl mb-2">No Hives Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first hive. Track inspections,
                  health, and honey production!
                </p>
                <Button onClick={onAddHive}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Hive
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
