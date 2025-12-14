import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  Droplet,
  TrendingUp,
  Calendar,
  Scale,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Hive, HoneyHarvest } from "../types";

interface HoneyProductionTabProps {
  hive: Hive;
  onLogHarvest?: () => void;
}

export function HoneyProductionTab({
  hive,
  onLogHarvest,
}: HoneyProductionTabProps) {
  // Mock harvest data - replace with real data
  const harvests: HoneyHarvest[] = [
    {
      id: "harvest-1",
      hiveId: hive.id,
      harvestDate: "2024-08-15",
      supersInstalled: "2024-05-01",
      yieldPounds: 45,
      frameCount: 18,
      moistureContent: 17.5,
      extractionNotes: "Late summer harvest, light amber color",
      qualityNotes: "Excellent quality, likely wildflower mix",
      createdAt: "2024-08-15T14:00:00Z",
    },
    {
      id: "harvest-2",
      hiveId: hive.id,
      harvestDate: "2024-06-20",
      supersInstalled: "2024-04-15",
      yieldPounds: 32,
      frameCount: 14,
      moistureContent: 18.2,
      extractionNotes: "Spring honey, light color",
      qualityNotes: "Mild flavor, likely spring blooms",
      createdAt: "2024-06-20T14:00:00Z",
    },
  ];

  const totalHarvested = harvests.reduce(
    (sum, h) => sum + (h.yieldPounds || 0),
    0
  );
  const averageYield =
    harvests.length > 0 ? totalHarvested / harvests.length : 0;

  // Chart data
  const chartData = harvests
    .map((h) => ({
      date: new Date(h.harvestDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      yield: h.yieldPounds || 0,
    }))
    .reverse();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Production Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <Droplet className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-sm text-muted-foreground">Total Harvested</div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalHarvested}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>pounds this year</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-sm text-muted-foreground">Avg per Harvest</div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {averageYield.toFixed(0)}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>pounds</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-sm text-muted-foreground">Harvests</div>
          </div>
          <div className="text-3xl font-bold mb-1">{harvests.length}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>this year</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Droplet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm text-muted-foreground">Moisture Avg</div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {harvests.length > 0
              ? (
                  harvests.reduce(
                    (sum, h) => sum + (h.moistureContent || 0),
                    0
                  ) / harvests.length
                ).toFixed(1)
              : "—"}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>percent</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Honey Production</h3>
          <p className="text-sm text-muted-foreground">
            Track harvests and honey yield over time
          </p>
        </div>
        <Button onClick={onLogHarvest}>
          <Plus className="w-4 h-4 mr-2" />
          Log Harvest
        </Button>
      </div>

      {/* Production Chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h4 className="font-semibold mb-6">Harvest History</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
                dataKey="yield"
                fill="#f59e0b"
                name="Honey (lbs)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Harvest Log */}
      <div className="bg-card rounded-xl border border-border">
        {harvests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Droplet className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Harvests Yet</h4>
            <p className="text-muted-foreground mb-6">
              Track honey harvests to monitor hive productivity and quality.
            </p>
            <Button onClick={onLogHarvest}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Harvest
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {harvests.map((harvest, index) => (
              <div
                key={harvest.id}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                      <Droplet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    {index < harvests.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {formatDate(harvest.harvestDate)}
                          </h4>
                          <Badge variant="default">
                            {harvest.yieldPounds} lbs
                          </Badge>
                        </div>
                        {harvest.supersInstalled && (
                          <div className="text-sm text-muted-foreground">
                            Supers installed {formatDate(harvest.supersInstalled)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Harvest Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Yield
                        </div>
                        <div className="font-medium flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5" />
                          {harvest.yieldPounds} lbs
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Frames
                        </div>
                        <div className="font-medium">{harvest.frameCount}</div>
                      </div>
                      {harvest.moistureContent && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Moisture
                          </div>
                          <div className="font-medium">
                            {harvest.moistureContent}%
                          </div>
                        </div>
                      )}
                      {harvest.yieldPounds && harvest.frameCount && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Lbs/Frame
                          </div>
                          <div className="font-medium">
                            {(harvest.yieldPounds / harvest.frameCount).toFixed(
                              1
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Extraction Notes */}
                    {harvest.extractionNotes && (
                      <div className="flex items-start gap-2 mb-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Extraction Notes
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {harvest.extractionNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Quality Notes */}
                    {harvest.qualityNotes && (
                      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Quality Notes
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {harvest.qualityNotes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Production Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Honey Harvest Guidelines
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>
                • Only harvest capped frames (at least 80% capped for proper
                moisture)
              </li>
              <li>• Target moisture content below 18.6% to prevent fermentation</li>
              <li>
                • Leave adequate stores for the bees (40-60 lbs for winter)
              </li>
              <li>• Harvest on warm days when field bees are out foraging</li>
              <li>• Use a refractometer to check moisture before extracting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
