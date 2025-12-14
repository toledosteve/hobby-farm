import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Plus, Target, AlertCircle } from "lucide-react";
import type { Tap, MapleTree } from "./types";

interface TapsManagementProps {
  taps: Tap[];
  trees: MapleTree[];
  onAddTap: () => void;
  onBulkAdd: () => void;
  onBack: () => void;
}

export function TapsManagement({
  taps,
  trees,
  onAddTap,
  onBulkAdd,
  onBack,
}: TapsManagementProps) {
  const getTreeName = (treeId: string) => {
    const tree = trees.find((t) => t.id === treeId);
    if (!tree) return 'Unknown Tree';
    return tree.nickname || `${tree.species} - ${tree.id.slice(0, 8)}`;
  };

  const getTapTypeLabel = (type: string) => {
    switch (type) {
      case 'bucket':
        return 'Bucket';
      case 'spile':
        return 'Spile';
      case 'tubing':
        return 'Tubing';
      default:
        return type;
    }
  };

  const activeTaps = taps.filter((t) => t.isActive);
  const inactiveTaps = taps.filter((t) => !t.isActive);
  const tapsWithIssues = taps.filter((t) => t.hasIssue);

  // Group taps by tree
  const tapsByTree = taps.reduce((acc, tap) => {
    if (!acc[tap.treeId]) {
      acc[tap.treeId] = [];
    }
    acc[tap.treeId].push(tap);
    return acc;
  }, {} as Record<string, Tap[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2>Tap Management</h2>
            <p className="text-sm text-muted-foreground">
              {activeTaps.length} active tap{activeTaps.length !== 1 ? 's' : ''}
              {tapsWithIssues.length > 0 &&
                ` • ${tapsWithIssues.length} with issues`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onAddTap}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tap
          </Button>
          <Button onClick={onBulkAdd}>
            <Target className="w-4 h-4 mr-2" />
            Bulk Add Taps
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Active Taps</p>
          <p className="text-3xl font-semibold">{activeTaps.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Removed Taps</p>
          <p className="text-3xl font-semibold">{inactiveTaps.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Taps with Issues</p>
          <p className="text-3xl font-semibold text-orange-600 dark:text-orange-400">
            {tapsWithIssues.length}
          </p>
        </Card>
      </div>

      {/* Taps by Tree */}
      {taps.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Taps Installed</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Install taps on your trees to start collecting sap. Use bulk add to
              tap multiple trees at once.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onAddTap}>
                Add Single Tap
              </Button>
              <Button onClick={onBulkAdd}>Bulk Add Taps</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Taps by Tree</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(tapsByTree).map(([treeId, treeTaps]) => {
              const tree = trees.find((t) => t.id === treeId);
              const activeTapsCount = treeTaps.filter((t) => t.isActive).length;

              return (
                <Card key={treeId} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium mb-1">{getTreeName(treeId)}</h4>
                      {tree && (
                        <p className="text-xs text-muted-foreground">
                          {tree.diameter}" DBH
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {activeTapsCount} active
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {treeTaps.map((tap) => (
                      <div
                        key={tap.id}
                        className={`p-3 rounded-lg border ${
                          tap.hasIssue
                            ? 'border-orange-500/20 bg-orange-500/5'
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {getTapTypeLabel(tap.tapType)}
                              </span>
                              {!tap.isActive && (
                                <Badge
                                  variant="outline"
                                  className="bg-muted text-muted-foreground"
                                >
                                  Removed
                                </Badge>
                              )}
                              {tap.hasIssue && (
                                <Badge
                                  variant="outline"
                                  className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {tap.issueType || 'Issue'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Installed{' '}
                              {new Date(tap.installDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            {tap.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {tap.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
