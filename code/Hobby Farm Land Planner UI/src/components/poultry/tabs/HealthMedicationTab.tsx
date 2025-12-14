import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  Heart,
  Pill,
  Syringe,
  AlertCircle,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import type { Flock, HealthLog } from "../types";

interface HealthMedicationTabProps {
  flock: Flock;
  onLogHealth?: () => void;
}

export function HealthMedicationTab({
  flock,
  onLogHealth,
}: HealthMedicationTabProps) {
  // Mock health logs - replace with real data
  const healthLogs: HealthLog[] = [
    {
      id: "health-1",
      flockId: flock.id,
      date: "2025-02-10",
      activityType: "medication",
      productName: "Corid",
      dosage: "1 tsp per gallon",
      duration: "5 days",
      withdrawalPeriodDays: 0,
      notes: "Preventive treatment for coccidiosis",
      createdAt: "2025-02-10T10:00:00Z",
    },
    {
      id: "health-2",
      flockId: flock.id,
      date: "2025-01-15",
      activityType: "vaccination",
      productName: "Marek's Disease Vaccine",
      notes: "Day-old vaccination",
      createdAt: "2025-01-15T10:00:00Z",
    },
  ];

  const activeWithdrawals = healthLogs.filter((log) => {
    if (!log.withdrawalEndDate) return false;
    return new Date(log.withdrawalEndDate) > new Date();
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActivityIcon = (type: HealthLog["activityType"]) => {
    switch (type) {
      case "medication":
        return <Pill className="w-4 h-4" />;
      case "vaccination":
        return <Syringe className="w-4 h-4" />;
      case "supplement":
        return <Heart className="w-4 h-4" />;
      case "illness-observation":
      case "injury":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityLabel = (type: HealthLog["activityType"]) => {
    const labels: Record<HealthLog["activityType"], string> = {
      medication: "Medication",
      supplement: "Supplement",
      vaccination: "Vaccination",
      "illness-observation": "Illness Observation",
      injury: "Injury",
    };
    return labels[type];
  };

  const getWithdrawalStatus = (log: HealthLog) => {
    if (!log.withdrawalEndDate) return null;

    const endDate = new Date(log.withdrawalEndDate);
    const today = new Date();
    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) {
      return (
        <Badge variant="success" className="gap-1">
          <Calendar className="w-3 h-3" />
          Safe to collect
        </Badge>
      );
    }

    return (
      <Badge variant="warning" className="gap-1">
        <Clock className="w-3 h-3" />
        Hold {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Withdrawal Warnings */}
      {activeWithdrawals.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Active Withdrawal Period
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Do not consume eggs or meat from this flock until the withdrawal
                period ends.
              </p>
              <div className="space-y-2">
                {activeWithdrawals.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-sm bg-white dark:bg-gray-950 rounded-lg p-3"
                  >
                    <div>
                      <span className="font-medium">{log.productName}</span>
                      <span className="text-muted-foreground ml-2">
                        administered {formatDate(log.date)}
                      </span>
                    </div>
                    {getWithdrawalStatus(log)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Health Records</h3>
          <p className="text-sm text-muted-foreground">
            Track medications, vaccinations, and health observations
          </p>
        </div>
        <Button onClick={onLogHealth}>
          <Plus className="w-4 h-4 mr-2" />
          Log Health Activity
        </Button>
      </div>

      {/* Health Log Timeline */}
      <div className="bg-card rounded-xl border border-border">
        {healthLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Health Records Yet</h4>
            <p className="text-muted-foreground mb-6">
              Start tracking health activities, medications, and observations.
            </p>
            <Button onClick={onLogHealth}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Health Activity
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {healthLogs.map((log, index) => (
              <div key={log.id} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getActivityIcon(log.activityType)}
                    </div>
                    {index < healthLogs.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {getActivityLabel(log.activityType)}
                          </span>
                          {log.productName && (
                            <Badge variant="outline">{log.productName}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(log.date)}
                        </div>
                      </div>
                      {log.withdrawalEndDate && getWithdrawalStatus(log)}
                    </div>

                    {(log.dosage || log.duration) && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        {log.dosage && <span>Dosage: {log.dosage}</span>}
                        {log.duration && <span>Duration: {log.duration}</span>}
                      </div>
                    )}

                    {log.notes && (
                      <div className="flex items-start gap-2 mt-2 p-3 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground flex-1">
                          {log.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Health Best Practices
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Regular health checks help catch issues early</li>
              <li>• Keep detailed records of all medications and withdrawals</li>
              <li>• Consult a veterinarian for serious health concerns</li>
              <li>• Maintain clean housing and fresh water at all times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
