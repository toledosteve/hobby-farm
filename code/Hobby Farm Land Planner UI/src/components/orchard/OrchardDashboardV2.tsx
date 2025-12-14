import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Plus,
  AlertCircle,
  Calendar,
  TrendingUp,
  Settings,
  Scissors,
  Apple,
  TreeDeciduous,
} from "lucide-react";
import type { FruitTree, OrchardMetrics } from "./types";

interface OrchardDashboardV2Props {
  onAddTree?: () => void;
  onLogActivity?: () => void;
  onViewTree?: (treeId: string) => void;
}

export function OrchardDashboardV2({
  onAddTree,
  onLogActivity,
  onViewTree,
}: OrchardDashboardV2Props) {
  // Mock data - replace with real data
  const metrics: OrchardMetrics = {
    totalTrees: 24,
    varieties: 12,
    treesNeedingPruning: 3,
    estimatedHarvestPounds: 850,
    upcomingHarvests: 4,
    healthIssues: 1,
  };

  const trees: FruitTree[] = [
    {
      id: "tree-1",
      name: "Honeycrisp #1",
      species: "apple",
      variety: "Honeycrisp",
      rootstock: "M.7",
      plantingDate: "2020-04-15",
      treeAge: 5,
      location: "North Row 1",
      rowNumber: 1,
      position: 1,
      healthStatus: "excellent",
      trainingSystem: "central-leader",
      lastPruneDate: "2025-02-01",
      expectedHarvestStart: "2025-09-15",
      expectedHarvestEnd: "2025-10-05",
      notes: "Excellent producer, very vigorous",
      createdAt: "2020-04-15T10:00:00Z",
      updatedAt: "2025-02-01T14:00:00Z",
    },
    {
      id: "tree-2",
      name: "Bartlett Pear",
      species: "pear",
      variety: "Bartlett",
      rootstock: "OHxF 87",
      plantingDate: "2019-03-20",
      treeAge: 6,
      location: "South Row 2",
      rowNumber: 2,
      position: 3,
      healthStatus: "good",
      trainingSystem: "central-leader",
      lastPruneDate: "2024-12-10",
      expectedHarvestStart: "2025-08-20",
      expectedHarvestEnd: "2025-09-10",
      createdAt: "2019-03-20T10:00:00Z",
      updatedAt: "2024-12-10T14:00:00Z",
    },
    {
      id: "tree-3",
      name: "Elberta Peach",
      species: "peach",
      variety: "Elberta",
      plantingDate: "2021-04-01",
      treeAge: 4,
      location: "East Section",
      healthStatus: "fair",
      trainingSystem: "open-center",
      lastPruneDate: "2024-11-15",
      expectedHarvestStart: "2025-07-25",
      expectedHarvestEnd: "2025-08-10",
      notes: "Needs closer monitoring for peach leaf curl",
      createdAt: "2021-04-01T10:00:00Z",
      updatedAt: "2024-11-15T14:00:00Z",
    },
  ];

  const getHealthStatusBadge = (status: FruitTree["healthStatus"]) => {
    switch (status) {
      case "excellent":
        return (
          <Badge variant="success" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            Excellent
          </Badge>
        );
      case "good":
        return <Badge variant="default">Good</Badge>;
      case "fair":
        return <Badge variant="warning">Fair</Badge>;
      case "poor":
        return <Badge variant="destructive">Poor</Badge>;
      case "declining":
        return <Badge variant="destructive">Declining</Badge>;
    }
  };

  const getSpeciesLabel = (species: FruitTree["species"]) => {
    const labels: Record<FruitTree["species"], string> = {
      apple: "Apple",
      pear: "Pear",
      peach: "Peach",
      cherry: "Cherry",
      plum: "Plum",
      apricot: "Apricot",
      nectarine: "Nectarine",
      fig: "Fig",
      quince: "Quince",
      persimmon: "Persimmon",
      other: "Other",
    };
    return labels[species];
  };

  const getSpeciesIcon = (species: FruitTree["species"]) => {
    // Simple apple icon for all fruit species
    return <Apple className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const needsPruning = (lastPruneDate?: string) => {
    if (!lastPruneDate) return true;
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastPruneDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    // Suggest pruning if it's been more than 365 days (annual pruning)
    return daysSince > 365;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1>Orchard</h1>
              </div>
              <p className="text-muted-foreground">
                Track fruit trees, pruning, and harvests
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button onClick={onLogActivity} variant="outline">
                <Scissors className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
              <Button onClick={onAddTree}>
                <Plus className="w-4 h-4 mr-2" />
                Add Tree
              </Button>
            </div>
          </div>
        </div>

        {/* Orchard Overview Summary - Isomorphic Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Fruit Trees */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950 rounded-lg">
                <TreeDeciduous className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-sm text-muted-foreground">
                Total Fruit Trees
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.totalTrees}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{metrics.varieties} varieties</span>
              </div>
            </div>
          </div>

          {/* Trees Needing Pruning */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-lg ${
                  metrics.treesNeedingPruning > 0
                    ? "bg-purple-50 dark:bg-purple-950"
                    : "bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <Scissors
                  className={`w-6 h-6 ${
                    metrics.treesNeedingPruning > 0
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-sm text-muted-foreground">Need Pruning</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">
                {metrics.treesNeedingPruning}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>
                  {metrics.treesNeedingPruning === 0
                    ? "All caught up"
                    : "Dormant season ideal"}
                </span>
              </div>
            </div>
          </div>

          {/* Estimated Harvest */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <Apple className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm text-muted-foreground">
                Est. Harvest
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">
                {metrics.estimatedHarvestPounds}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>pounds this season</span>
              </div>
            </div>
          </div>

          {/* Upcoming Harvests */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-sm text-muted-foreground">Coming Up</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.upcomingHarvests}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>harvest windows soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Reminder Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Late Winter / Early Spring
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Dormant pruning season is here. Prune on dry days when temperatures
                are above freezing. Focus on structural pruning for young trees and
                maintenance pruning for mature trees.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white dark:bg-gray-950"
                >
                  View Pruning Guide
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Fruit Tree Inventory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Your Fruit Trees</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <TreeDeciduous className="w-4 h-4 mr-2" />
                Orchard Map
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Harvest Calendar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trees.map((tree) => (
              <div
                key={tree.id}
                onClick={() => onViewTree?.(tree.id)}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Tree Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl group-hover:text-primary transition-colors">
                        {tree.name}
                      </h3>
                      {getHealthStatusBadge(tree.healthStatus)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {getSpeciesLabel(tree.species)}
                        {tree.variety && ` - ${tree.variety}`}
                      </span>
                      {tree.location && (
                        <>
                          <span>•</span>
                          <span>{tree.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950 rounded-lg">
                    {getSpeciesIcon(tree.species)}
                  </div>
                </div>

                {/* Tree Details Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Age</div>
                    <div className="text-sm font-semibold">
                      {tree.treeAge} years
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Last Pruned
                    </div>
                    <div className="text-sm font-semibold">
                      {formatDate(tree.lastPruneDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Harvest
                    </div>
                    <div className="text-sm font-semibold">
                      {formatDate(tree.expectedHarvestStart)}
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="space-y-2 mb-4">
                  {tree.trainingSystem && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TreeDeciduous className="w-3 h-3" />
                      <span>
                        {tree.trainingSystem
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </span>
                    </div>
                  )}
                  {needsPruning(tree.lastPruneDate) && (
                    <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <Scissors className="w-3 h-3" />
                      <span>Pruning recommended</span>
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
                      onLogActivity?.();
                    }}
                  >
                    Log Activity
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTree?.(tree.id);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {trees.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-rose-50 dark:bg-rose-950 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TreeDeciduous className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl mb-2">No Trees Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking your orchard by adding your first fruit tree.
                  Monitor pruning, blooms, and harvests!
                </p>
                <Button onClick={onAddTree}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Tree
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
