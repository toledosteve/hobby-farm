import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Plus,
  Bird,
  Egg,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Settings,
  Calendar,
  Activity,
} from "lucide-react";
import type { Flock, PoultryMetrics } from "./types";

interface PoultryDashboardV2Props {
  onAddFlock?: () => void;
  onLogActivity?: () => void;
  onViewFlock?: (flockId: string) => void;
}

export function PoultryDashboardV2({
  onAddFlock,
  onLogActivity,
  onViewFlock,
}: PoultryDashboardV2Props) {
  // Mock data - replace with real data
  const metrics: PoultryMetrics = {
    totalFlocks: 3,
    totalBirds: 42,
    eggsThisWeek: 156,
    healthAlerts: 1,
    activeWithdrawals: 0,
  };

  const flocks: Flock[] = [
    {
      id: 'flock-1',
      name: 'Layer Hens – Coop A',
      type: 'layers',
      breeds: ['rhode-island-red', 'plymouth-rock'],
      birdCount: 18,
      acquiredDate: '2024-04-15',
      housingLocation: 'Main Coop',
      status: 'active',
      createdAt: '2024-04-15T10:00:00Z',
      updatedAt: '2024-04-15T10:00:00Z',
    },
    {
      id: 'flock-2',
      name: 'Heritage Layers',
      type: 'layers',
      breeds: ['orpington', 'wyandotte'],
      birdCount: 12,
      acquiredDate: '2024-03-01',
      housingLocation: 'North Coop',
      status: 'active',
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z',
    },
    {
      id: 'flock-3',
      name: 'Spring Broilers',
      type: 'meat-birds',
      breeds: ['cornish-cross'],
      birdCount: 12,
      hatchDate: '2025-02-01',
      acquiredDate: '2025-02-01',
      housingLocation: 'Broiler Pen',
      status: 'growing',
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-02-01T10:00:00Z',
    },
  ];

  const getFlockStatusBadge = (status: Flock['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'growing':
        return <Badge variant="default">Growing</Badge>;
      case 'processing-planned':
        return <Badge variant="warning">Processing Planned</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
    }
  };

  const getFlockAge = (flock: Flock) => {
    if (!flock.hatchDate && !flock.acquiredDate) return null;
    const date = new Date(flock.hatchDate || flock.acquiredDate);
    const now = new Date();
    const weeks = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    if (weeks < 4) return `${weeks} weeks`;
    if (weeks < 52) return `${Math.floor(weeks / 4)} months`;
    return `${Math.floor(weeks / 52)} years`;
  };

  const getBreedDisplay = (breeds: string[]) => {
    const breedNames: Record<string, string> = {
      'rhode-island-red': 'Rhode Island Red',
      'plymouth-rock': 'Plymouth Rock',
      'leghorn': 'Leghorn',
      'orpington': 'Orpington',
      'wyandotte': 'Wyandotte',
      'brahma': 'Brahma',
      'sussex': 'Sussex',
      'cornish-cross': 'Cornish Cross',
      'freedom-ranger': 'Freedom Ranger',
      'jersey-giant': 'Jersey Giant',
      'other': 'Mixed',
    };
    
    if (breeds.length === 1) return breedNames[breeds[0]] || 'Mixed';
    if (breeds.length === 2) return `${breedNames[breeds[0]]}, ${breedNames[breeds[1]]}`;
    return `${breedNames[breeds[0]]} + ${breeds.length - 1} more`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1>Poultry</h1>
              </div>
              <p className="text-muted-foreground">
                Track your flock's health, productivity, and care
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button onClick={onLogActivity} variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
              <Button onClick={onAddFlock}>
                <Plus className="w-4 h-4 mr-2" />
                Add Flock
              </Button>
            </div>
          </div>
        </div>

        {/* Flock Overview Summary - Isomorphic Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Flocks */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Bird className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm text-muted-foreground">Active Flocks</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.totalFlocks}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Managing {metrics.totalBirds} birds</span>
              </div>
            </div>
          </div>

          {/* Total Birds */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                <Bird className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-sm text-muted-foreground">Total Birds</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.totalBirds}</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>All healthy</span>
              </div>
            </div>
          </div>

          {/* Eggs This Week */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <Egg className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-sm text-muted-foreground">Eggs This Week</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.eggsThisWeek}</div>
              <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12% from last week</span>
              </div>
            </div>
          </div>

          {/* Health Alerts */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${
                metrics.healthAlerts > 0 
                  ? 'bg-orange-50 dark:bg-orange-950' 
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  metrics.healthAlerts > 0 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-gray-400'
                }`} />
              </div>
              <div className="text-sm text-muted-foreground">Health Alerts</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold">{metrics.healthAlerts}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{metrics.activeWithdrawals} active withdrawal{metrics.activeWithdrawals !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flock List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Your Flocks</h2>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flocks.map((flock) => (
              <div
                key={flock.id}
                onClick={() => onViewFlock?.(flock.id)}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Flock Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl group-hover:text-primary transition-colors">
                        {flock.name}
                      </h3>
                      {getFlockStatusBadge(flock.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getBreedDisplay(flock.breeds)}</span>
                      {getFlockAge(flock) && (
                        <>
                          <span>•</span>
                          <span>{getFlockAge(flock)} old</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {flock.type === 'layers' ? (
                      <Egg className="w-6 h-6 text-primary" />
                    ) : (
                      <Bird className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>

                {/* Flock Details */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Bird Count</div>
                    <div className="text-lg font-semibold">{flock.birdCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Type</div>
                    <div className="text-lg font-semibold capitalize">
                      {flock.type === 'layers' ? 'Layers' : 'Meat Birds'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Location</div>
                    <div className="text-lg font-semibold truncate">
                      {flock.housingLocation || 'Not set'}
                    </div>
                  </div>
                </div>

                {/* Flock Type Specific Info */}
                {flock.type === 'layers' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">This Week:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">52 eggs</span>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs">+8%</span>
                      </div>
                    </div>
                  </div>
                )}

                {flock.type === 'meat-birds' && flock.hatchDate && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-semibold">
                        {Math.floor((new Date().getTime() - new Date(flock.hatchDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Est. Processing:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {8 - Math.floor((new Date().getTime() - new Date(flock.hatchDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
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
                      onViewFlock?.(flock.id);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {flocks.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bird className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl mb-2">No Flocks Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first flock. Track layers, meat birds, or both!
                </p>
                <Button onClick={onAddFlock}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Flock
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
