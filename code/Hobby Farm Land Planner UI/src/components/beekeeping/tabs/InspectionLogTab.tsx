import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  Eye,
  Calendar,
  CloudRain,
  Thermometer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import type { Hive, Inspection } from "../types";

interface InspectionLogTabProps {
  hive: Hive;
  onLogInspection?: () => void;
}

export function InspectionLogTab({ hive, onLogInspection }: InspectionLogTabProps) {
  // Mock inspection data - replace with real data
  const inspections: Inspection[] = [
    {
      id: "insp-1",
      hiveId: hive.id,
      date: "2025-02-07",
      weatherConditions: "Sunny, light breeze",
      temperatureF: 58,
      hiveTemperament: "calm",
      broodPattern: "excellent",
      queenSighted: true,
      queenNotes: "Queen actively laying, blue marking visible",
      broodFrames: 6,
      honeyFrames: 3,
      pollenStores: "adequate",
      honeyStores: "adequate",
      actionsTaken: "Added pollen patty, checked for signs of swarming",
      notes: "Colony looks strong, preparing for spring buildup. No signs of disease.",
      createdAt: "2025-02-07T14:30:00Z",
    },
    {
      id: "insp-2",
      hiveId: hive.id,
      date: "2025-01-24",
      weatherConditions: "Partly cloudy",
      temperatureF: 52,
      hiveTemperament: "active",
      broodPattern: "good",
      queenSighted: true,
      broodFrames: 5,
      honeyFrames: 4,
      pollenStores: "low",
      honeyStores: "adequate",
      actionsTaken: "Quick check only due to cool weather",
      notes: "Cluster visible, bees active on warm afternoon",
      createdAt: "2025-01-24T13:00:00Z",
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTemperamentBadge = (temperament: Inspection["hiveTemperament"]) => {
    switch (temperament) {
      case "calm":
        return <Badge variant="success">Calm</Badge>;
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "defensive":
        return <Badge variant="warning">Defensive</Badge>;
      case "aggressive":
        return <Badge variant="destructive">Aggressive</Badge>;
    }
  };

  const getBroodPatternBadge = (pattern?: Inspection["broodPattern"]) => {
    if (!pattern) return null;
    switch (pattern) {
      case "excellent":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Excellent
          </Badge>
        );
      case "good":
        return <Badge variant="default">Good</Badge>;
      case "spotty":
        return <Badge variant="warning">Spotty</Badge>;
      case "poor":
        return <Badge variant="destructive">Poor</Badge>;
      case "none":
        return <Badge variant="outline">None</Badge>;
    }
  };

  const getStoresBadge = (stores?: string) => {
    if (!stores) return null;
    switch (stores) {
      case "abundant":
        return <Badge variant="success">Abundant</Badge>;
      case "adequate":
        return <Badge variant="default">Adequate</Badge>;
      case "low":
        return <Badge variant="warning">Low</Badge>;
      case "none":
        return <Badge variant="destructive">None</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Inspection History</h3>
          <p className="text-sm text-muted-foreground">
            Track hive health, queen activity, and observations
          </p>
        </div>
        <Button onClick={onLogInspection}>
          <Plus className="w-4 h-4 mr-2" />
          Log Inspection
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">
            Last Inspection
          </div>
          <div className="text-lg font-semibold">
            {inspections.length > 0
              ? new Date(inspections[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Never"}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">
            Total Inspections
          </div>
          <div className="text-lg font-semibold">{inspections.length}</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">
            Queen Sightings
          </div>
          <div className="text-lg font-semibold">
            {inspections.filter((i) => i.queenSighted).length} of{" "}
            {inspections.length}
          </div>
        </div>
      </div>

      {/* Inspection Timeline */}
      <div className="bg-card rounded-xl border border-border">
        {inspections.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Eye className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Inspections Yet</h4>
            <p className="text-muted-foreground mb-6">
              Start tracking your hive inspections to monitor health and
              productivity over time.
            </p>
            <Button onClick={onLogInspection}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Inspection
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {inspections.map((inspection, index) => (
              <div
                key={inspection.id}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                {/* Inspection Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
                        <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      {index < inspections.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">
                          {formatDate(inspection.date)}
                        </h4>
                        {getTemperamentBadge(inspection.hiveTemperament)}
                      </div>

                      {/* Weather Info */}
                      {(inspection.weatherConditions ||
                        inspection.temperatureF) && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {inspection.weatherConditions && (
                            <div className="flex items-center gap-1">
                              <CloudRain className="w-3.5 h-3.5" />
                              <span>{inspection.weatherConditions}</span>
                            </div>
                          )}
                          {inspection.temperatureF && (
                            <div className="flex items-center gap-1">
                              <Thermometer className="w-3.5 h-3.5" />
                              <span>{inspection.temperatureF}°F</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inspection Details Grid */}
                <div className="ml-14 space-y-4">
                  {/* Queen Status */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Queen Status:</span>
                      {inspection.queenSighted ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Sighted
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Not Sighted
                        </Badge>
                      )}
                    </div>
                    {inspection.queenNotes && (
                      <p className="text-sm text-muted-foreground">
                        {inspection.queenNotes}
                      </p>
                    )}
                  </div>

                  {/* Brood & Stores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Brood Pattern
                        </div>
                        {getBroodPatternBadge(inspection.broodPattern)}
                      </div>
                      {inspection.broodFrames !== undefined && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Brood Frames
                          </div>
                          <div className="font-medium">
                            {inspection.broodFrames}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Honey Stores
                        </div>
                        {getStoresBadge(inspection.honeyStores)}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Pollen Stores
                        </div>
                        {getStoresBadge(inspection.pollenStores)}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Notes */}
                  {inspection.actionsTaken && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Actions Taken
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {inspection.actionsTaken}
                        </p>
                      </div>
                    </div>
                  )}

                  {inspection.notes && (
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Notes
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {inspection.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Disease/Pest Observations */}
                  {(inspection.diseaseObservations ||
                    inspection.pestObservations) && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
                          Health Observations
                        </div>
                        {inspection.diseaseObservations && (
                          <p className="text-sm text-amber-800 dark:text-amber-200 mb-1">
                            Disease: {inspection.diseaseObservations}
                          </p>
                        )}
                        {inspection.pestObservations && (
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            Pests: {inspection.pestObservations}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspection Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Inspection Best Practices
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Inspect during warm, calm days (above 60°F) for best results</li>
              <li>• Work calmly and deliberately to avoid stressing the colony</li>
              <li>• Look for eggs and larvae to confirm queen presence</li>
              <li>• Check for adequate stores and add feed if needed</li>
              <li>• Watch for signs of disease, pests, or swarming behavior</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
