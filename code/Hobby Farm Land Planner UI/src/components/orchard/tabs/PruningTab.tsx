import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Plus, Scissors, Calendar } from "lucide-react";
import type { PruningRecord } from "../types";

interface PruningTabProps {
  treeId: string;
  onLogPruning?: () => void;
}

export function PruningTab({ treeId, onLogPruning }: PruningTabProps) {
  // Mock data - replace with real data fetched by treeId
  const pruningRecords: PruningRecord[] = [
    {
      id: "prune-1",
      treeId,
      date: "2025-02-01",
      pruningType: "maintenance",
      trainingSystem: "central-leader",
      weatherConditions: "Clear, 45°F",
      amountRemoved: "moderate",
      notes:
        "Removed crossing branches and water sprouts. Maintained central leader structure. Tree responded well.",
      createdAt: "2025-02-01T14:00:00Z",
    },
    {
      id: "prune-2",
      treeId,
      date: "2024-02-15",
      pruningType: "structural",
      trainingSystem: "central-leader",
      weatherConditions: "Partly cloudy, 50°F",
      amountRemoved: "heavy",
      notes:
        "Major structural pruning to establish central leader. Removed competing leaders and wide-angle branches.",
      createdAt: "2024-02-15T14:00:00Z",
    },
  ];

  const getPruningTypeBadge = (type: PruningRecord["pruningType"]) => {
    const variants: Record<
      PruningRecord["pruningType"],
      { variant: any; label: string }
    > = {
      structural: { variant: "default", label: "Structural" },
      maintenance: { variant: "outline", label: "Maintenance" },
      renewal: { variant: "warning", label: "Renewal" },
      corrective: { variant: "destructive", label: "Corrective" },
    };
    const config = variants[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAmountRemovedBadge = (
    amount?: PruningRecord["amountRemoved"]
  ) => {
    if (!amount) return null;
    const variants: Record<
      NonNullable<PruningRecord["amountRemoved"]>,
      { variant: any; label: string }
    > = {
      light: { variant: "outline", label: "Light" },
      moderate: { variant: "default", label: "Moderate" },
      heavy: { variant: "warning", label: "Heavy" },
    };
    const config = variants[amount];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl mb-1">Pruning & Training History</h3>
          <p className="text-sm text-muted-foreground">
            Track pruning activities and tree training progress
          </p>
        </div>
        <Button onClick={onLogPruning}>
          <Plus className="w-4 h-4 mr-2" />
          Log Pruning
        </Button>
      </div>

      {/* Pruning Guide Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Scissors className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Dormant Pruning Best Practices
            </h4>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
              <li>Prune during dormancy (late winter to early spring)</li>
              <li>Remove dead, diseased, or damaged wood first</li>
              <li>Eliminate crossing or rubbing branches</li>
              <li>Maintain your chosen training system structure</li>
              <li>Make clean cuts just above outward-facing buds</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pruning Records */}
      {pruningRecords.length > 0 ? (
        <div className="space-y-4">
          {pruningRecords.map((record) => (
            <div
              key={record.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Scissors className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getPruningTypeBadge(record.pruningType)}
                      {record.amountRemoved &&
                        getAmountRemovedBadge(record.amountRemoved)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(record.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {record.weatherConditions && (
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">
                    Weather: {record.weatherConditions}
                  </span>
                </div>
              )}

              {record.trainingSystem && (
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">
                    Training System:{" "}
                    {record.trainingSystem
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </span>
                </div>
              )}

              {record.notes && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Scissors className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl mb-2">No Pruning Records</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking pruning activities to maintain tree health and
              structure over time.
            </p>
            <Button onClick={onLogPruning}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Pruning
            </Button>
          </div>
        </div>
      )}

      {/* Pruning Timeline Summary */}
      {pruningRecords.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-xl mb-4">Pruning Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Total Prunings
              </div>
              <div className="text-2xl font-bold">{pruningRecords.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Last Pruned
              </div>
              <div className="text-2xl font-bold">
                {new Date(pruningRecords[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Most Common Type
              </div>
              <div className="text-2xl font-bold capitalize">
                {pruningRecords[0].pruningType}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
