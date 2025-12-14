import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Plus, Flower2, Calendar, AlertTriangle } from "lucide-react";
import type { BloomRecord } from "../types";

interface BloomFruitSetTabProps {
  treeId: string;
  onLogBloom?: () => void;
}

export function BloomFruitSetTab({
  treeId,
  onLogBloom,
}: BloomFruitSetTabProps) {
  // Mock data - replace with real data fetched by treeId
  const bloomRecords: BloomRecord[] = [
    {
      id: "bloom-1",
      treeId,
      date: "2024-04-25",
      bloomStage: "petal-fall",
      bloomDensity: "heavy",
      frostDamageObserved: false,
      fruitSetQuality: "excellent",
      pollinationNotes: "Good bee activity observed during bloom period",
      notes: "Excellent bloom and fruit set this year. Weather was ideal.",
      createdAt: "2024-04-25T14:00:00Z",
    },
    {
      id: "bloom-2",
      treeId,
      date: "2024-04-18",
      bloomStage: "bloom",
      bloomDensity: "heavy",
      frostDamageObserved: false,
      pollinationNotes: "Peak bloom, many bees present",
      notes: "Full bloom reached. Tree covered in blossoms.",
      createdAt: "2024-04-18T14:00:00Z",
    },
    {
      id: "bloom-3",
      treeId,
      date: "2023-04-20",
      bloomStage: "petal-fall",
      bloomDensity: "moderate",
      frostDamageObserved: true,
      frostDamageNotes: "Late frost damaged about 30% of blossoms",
      fruitSetQuality: "fair",
      notes: "Frost event reduced potential crop",
      createdAt: "2023-04-20T14:00:00Z",
    },
  ];

  const getBloomStageBadge = (stage: BloomRecord["bloomStage"]) => {
    const variants: Record<
      BloomRecord["bloomStage"],
      { variant: any; label: string }
    > = {
      dormant: { variant: "outline", label: "Dormant" },
      "bud-swell": { variant: "default", label: "Bud Swell" },
      "pink-bud": { variant: "default", label: "Pink Bud" },
      bloom: { variant: "success", label: "Bloom" },
      "petal-fall": { variant: "warning", label: "Petal Fall" },
      "fruit-set": { variant: "success", label: "Fruit Set" },
    };
    const config = variants[stage];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getBloomDensityBadge = (density?: BloomRecord["bloomDensity"]) => {
    if (!density) return null;
    const variants: Record<
      NonNullable<BloomRecord["bloomDensity"]>,
      { variant: any; label: string }
    > = {
      sparse: { variant: "outline", label: "Sparse" },
      moderate: { variant: "default", label: "Moderate" },
      heavy: { variant: "success", label: "Heavy" },
    };
    const config = variants[density];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getFruitSetBadge = (quality?: BloomRecord["fruitSetQuality"]) => {
    if (!quality) return null;
    const variants: Record<
      NonNullable<BloomRecord["fruitSetQuality"]>,
      { variant: any; label: string }
    > = {
      poor: { variant: "destructive", label: "Poor" },
      fair: { variant: "warning", label: "Fair" },
      good: { variant: "default", label: "Good" },
      excellent: { variant: "success", label: "Excellent" },
    };
    const config = variants[quality];
    return <Badge variant={config.variant}>Fruit Set: {config.label}</Badge>;
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
          <h3 className="text-xl mb-1">Bloom & Fruit Set History</h3>
          <p className="text-sm text-muted-foreground">
            Track bloom stages, pollination, and fruit set quality
          </p>
        </div>
        <Button onClick={onLogBloom}>
          <Plus className="w-4 h-4 mr-2" />
          Log Bloom Observation
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 border border-pink-200 dark:border-pink-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
            <Flower2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
              Understanding Bloom & Pollination
            </h4>
            <p className="text-sm text-pink-800 dark:text-pink-200 mb-2">
              Tracking bloom stages helps predict harvest timing and identify
              frost damage risks. Good pollination is essential for fruit set.
            </p>
            <ul className="text-sm text-pink-800 dark:text-pink-200 space-y-1 list-disc list-inside">
              <li>Monitor for late frost risks during bloom period</li>
              <li>Observe bee and pollinator activity</li>
              <li>Note bloom density for yield predictions</li>
              <li>Track fruit set quality for thinning decisions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bloom Records */}
      {bloomRecords.length > 0 ? (
        <div className="space-y-4">
          {bloomRecords.map((record) => (
            <div
              key={record.id}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-50 dark:bg-pink-950 rounded-lg">
                    <Flower2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getBloomStageBadge(record.bloomStage)}
                      {record.bloomDensity &&
                        getBloomDensityBadge(record.bloomDensity)}
                      {record.fruitSetQuality &&
                        getFruitSetBadge(record.fruitSetQuality)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(record.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frost Damage Alert */}
              {record.frostDamageObserved && (
                <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-900 dark:text-orange-100 text-sm mb-1">
                        Frost Damage Observed
                      </div>
                      {record.frostDamageNotes && (
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          {record.frostDamageNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pollination Notes */}
              {record.pollinationNotes && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Pollination Observations
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {record.pollinationNotes}
                  </p>
                </div>
              )}

              {/* General Notes */}
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
            <div className="p-4 bg-pink-50 dark:bg-pink-950 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl mb-2">No Bloom Records</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking bloom stages and fruit set to predict harvests and
              identify pollination patterns.
            </p>
            <Button onClick={onLogBloom}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Bloom Observation
            </Button>
          </div>
        </div>
      )}

      {/* Bloom Summary */}
      {bloomRecords.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-xl mb-4">Bloom Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Observations
              </div>
              <div className="text-2xl font-bold">{bloomRecords.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Frost Events
              </div>
              <div className="text-2xl font-bold">
                {
                  bloomRecords.filter((r) => r.frostDamageObserved).length
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Last Bloom
              </div>
              <div className="text-2xl font-bold">
                {new Date(bloomRecords[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
