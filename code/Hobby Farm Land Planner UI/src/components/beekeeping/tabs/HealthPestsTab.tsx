import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  AlertTriangle,
  Bug,
  Shield,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react";
import type { Hive, HealthCheck } from "../types";

interface HealthPestsTabProps {
  hive: Hive;
  onLogHealth?: () => void;
}

export function HealthPestsTab({ hive, onLogHealth }: HealthPestsTabProps) {
  // Mock health check data - replace with real data
  const healthChecks: HealthCheck[] = [
    {
      id: "health-1",
      hiveId: hive.id,
      date: "2025-02-01",
      issueType: "varroa-mite",
      severity: "minor",
      varroaCount: 2,
      observations: "Alcohol wash showed 2 mites per 300 bees (0.67%)",
      actionTaken: "Monitoring, will treat if count increases",
      createdAt: "2025-02-01T10:00:00Z",
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIssueTypeLabel = (type: HealthCheck["issueType"]) => {
    const labels: Record<HealthCheck["issueType"], string> = {
      "varroa-mite": "Varroa Mite",
      "small-hive-beetle": "Small Hive Beetle",
      "wax-moth": "Wax Moth",
      chalkbrood: "Chalkbrood",
      foulbrood: "Foulbrood",
      nosema: "Nosema",
      other: "Other",
    };
    return labels[type];
  };

  const getSeverityBadge = (severity?: HealthCheck["severity"]) => {
    if (!severity) return null;
    switch (severity) {
      case "minor":
        return <Badge variant="default">Minor</Badge>;
      case "moderate":
        return <Badge variant="warning">Moderate</Badge>;
      case "severe":
        return <Badge variant="destructive">Severe</Badge>;
    }
  };

  const getIssueIcon = (type: HealthCheck["issueType"]) => {
    switch (type) {
      case "varroa-mite":
      case "small-hive-beetle":
      case "wax-moth":
        return <Bug className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Health & Pest Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Track disease signs, pest levels, and health observations
          </p>
        </div>
        <Button onClick={onLogHealth}>
          <Plus className="w-4 h-4 mr-2" />
          Log Health Check
        </Button>
      </div>

      {/* Current Status Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
              Hive Health Status
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
              No major health concerns detected. Continue regular monitoring for
              varroa mites and common diseases.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Varroa Level
                </div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Low
                </div>
              </div>
              <div className="bg-white dark:bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Last Check
                </div>
                <div className="font-semibold">Feb 1</div>
              </div>
              <div className="bg-white dark:bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  SHB Signs
                </div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  None
                </div>
              </div>
              <div className="bg-white dark:bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Disease
                </div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  None
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Check Timeline */}
      <div className="bg-card rounded-xl border border-border">
        {healthChecks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">
              No Health Checks Yet
            </h4>
            <p className="text-muted-foreground mb-6">
              Start monitoring for varroa mites, pests, and disease signs.
            </p>
            <Button onClick={onLogHealth}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Health Check
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {healthChecks.map((check, index) => (
              <div
                key={check.id}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div
                      className={`p-2 rounded-lg ${
                        check.severity === "severe"
                          ? "bg-red-100 dark:bg-red-900"
                          : check.severity === "moderate"
                          ? "bg-amber-100 dark:bg-amber-900"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      {getIssueIcon(check.issueType)}
                    </div>
                    {index < healthChecks.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {getIssueTypeLabel(check.issueType)}
                          </span>
                          {getSeverityBadge(check.severity)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(check.date)}
                        </div>
                      </div>
                    </div>

                    {/* Varroa Count */}
                    {check.varroaCount !== undefined && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Varroa Count:
                          </span>
                          <span className="text-sm">
                            {check.varroaCount} mites per 300 bees (
                            {((check.varroaCount / 300) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Observations */}
                    {check.observations && (
                      <div className="flex items-start gap-2 mb-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Observations
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {check.observations}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions Taken */}
                    {check.actionTaken && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Action Taken
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {check.actionTaken}
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

      {/* Common Pests Reference */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h4 className="font-semibold mb-4">Common Pests & Diseases to Monitor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bug className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Varroa Mites</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor monthly. Treatment threshold: 3% (9 mites per 300 bees)
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bug className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Small Hive Beetle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Check for adults in corners and larvae in comb
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">American Foulbrood</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sunken, punctured cappings; ropey larvae; foul odor
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">Nosema</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Dysentery, spotting on combs, reduced spring buildup
            </p>
          </div>
        </div>
      </div>

      {/* Health Monitoring Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Monitoring & Prevention
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Perform alcohol wash or sugar roll monthly during active season</li>
              <li>• Maintain strong colonies through proper nutrition and queen health</li>
              <li>• Use screened bottom boards to reduce mite populations</li>
              <li>
                • Contact your local beekeeping association if you suspect disease
              </li>
              <li>• Early detection is key—regular inspections save colonies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
