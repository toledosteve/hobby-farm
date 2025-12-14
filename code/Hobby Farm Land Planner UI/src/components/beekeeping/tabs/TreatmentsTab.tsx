import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Plus,
  Pill,
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
} from "lucide-react";
import type { Hive, Treatment } from "../types";

interface TreatmentsTabProps {
  hive: Hive;
  onLogTreatment?: () => void;
}

export function TreatmentsTab({ hive, onLogTreatment }: TreatmentsTabProps) {
  // Mock treatment data - replace with real data
  const treatments: Treatment[] = [];

  const activeTreatments = treatments.filter((t) => {
    if (!t.endDate) return true;
    return new Date(t.endDate) > new Date();
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTreatmentTypeLabel = (type: Treatment["treatmentType"]) => {
    const labels: Record<Treatment["treatmentType"], string> = {
      "varroa-treatment": "Varroa Treatment",
      antibiotic: "Antibiotic",
      "organic-treatment": "Organic Treatment",
      "essential-oil": "Essential Oil",
      other: "Other",
    };
    return labels[type];
  };

  const getWithdrawalStatus = (treatment: Treatment) => {
    if (!treatment.withdrawalEndDate) {
      return treatment.honeySupersRemoved ? (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Supers removed
        </Badge>
      ) : (
        <Badge variant="default">No withdrawal</Badge>
      );
    }

    const endDate = new Date(treatment.withdrawalEndDate);
    const today = new Date();
    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) {
      return (
        <Badge variant="success" className="gap-1">
          <Calendar className="w-3 h-3" />
          Safe to harvest
        </Badge>
      );
    }

    return (
      <Badge variant="warning" className="gap-1">
        <Clock className="w-3 h-3" />
        Wait {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Withdrawal Warning */}
      {activeTreatments.some((t) => t.withdrawalEndDate) && (
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
                Do not harvest honey from this hive until the withdrawal period
                ends.
              </p>
              <div className="space-y-2">
                {activeTreatments
                  .filter((t) => t.withdrawalEndDate)
                  .map((treatment) => (
                    <div
                      key={treatment.id}
                      className="flex items-center justify-between text-sm bg-white dark:bg-gray-950 rounded-lg p-3"
                    >
                      <div>
                        <span className="font-medium">{treatment.productName}</span>
                        <span className="text-muted-foreground ml-2">
                          started {formatDate(treatment.startDate)}
                        </span>
                      </div>
                      {getWithdrawalStatus(treatment)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Treatment History</h3>
          <p className="text-sm text-muted-foreground">
            Track medications, varroa treatments, and interventions
          </p>
        </div>
        <Button onClick={onLogTreatment}>
          <Plus className="w-4 h-4 mr-2" />
          Log Treatment
        </Button>
      </div>

      {/* Treatment Timeline */}
      <div className="bg-card rounded-xl border border-border">
        {treatments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Pill className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Treatments Yet</h4>
            <p className="text-muted-foreground mb-6">
              Track varroa treatments, medications, and other interventions here.
            </p>
            <Button onClick={onLogTreatment}>
              <Plus className="w-4 h-4 mr-2" />
              Log First Treatment
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {treatments.map((treatment, index) => (
              <div
                key={treatment.id}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Pill className="w-4 h-4" />
                    </div>
                    {index < treatments.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {treatment.productName}
                          </span>
                          <Badge variant="outline">
                            {getTreatmentTypeLabel(treatment.treatmentType)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(treatment.startDate)}
                          {treatment.endDate &&
                            ` - ${formatDate(treatment.endDate)}`}
                        </div>
                      </div>
                      {getWithdrawalStatus(treatment)}
                    </div>

                    {treatment.dosage && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">
                          Dosage
                        </div>
                        <div className="text-sm font-medium">
                          {treatment.dosage}
                        </div>
                      </div>
                    )}

                    {treatment.notes && (
                      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Notes
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {treatment.notes}
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

      {/* Treatment Reference */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h4 className="font-semibold mb-4">Common Treatments</h4>
        <div className="space-y-3">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-medium mb-1">Varroa Treatments</div>
            <p className="text-sm text-muted-foreground">
              Apivar, Apiguard, Mite Away Quick Strips, Formic Pro, Oxalic Acid
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-medium mb-1">Organic Options</div>
            <p className="text-sm text-muted-foreground">
              Essential oils, powdered sugar dusting, screened bottom boards
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-medium mb-1">Important Notes</div>
            <p className="text-sm text-muted-foreground">
              Always follow label instructions and withdrawal periods. Remove
              honey supers before treating if required.
            </p>
          </div>
        </div>
      </div>

      {/* Treatment Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Treatment Best Practices
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Treat only when monitoring indicates it's necessary</li>
              <li>• Follow all product label instructions and safety precautions</li>
              <li>
                • Rotate treatment types to prevent mite resistance
              </li>
              <li>• Keep detailed records of all treatments and withdrawal periods</li>
              <li>
                • Consult experienced beekeepers or extension agents if unsure
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
