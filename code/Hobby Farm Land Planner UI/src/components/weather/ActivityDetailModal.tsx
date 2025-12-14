import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Lightbulb,
  TrendingDown,
  Calendar,
  Plus,
} from "lucide-react";
import type { ActivityRecommendation } from "./types";

interface ActivityDetailModalProps {
  activity: ActivityRecommendation | null;
  open: boolean;
  onClose: () => void;
}

export function ActivityDetailModal({
  activity,
  open,
  onClose,
}: ActivityDetailModalProps) {
  if (!activity) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "good":
        return {
          icon: CheckCircle2,
          label: "Good Conditions",
          className: "bg-primary/10 text-primary border-primary/20",
        };
      case "caution":
        return {
          icon: AlertTriangle,
          label: "Use Caution",
          className:
            "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
        };
      case "not-recommended":
        return {
          icon: XCircle,
          label: "Not Recommended",
          className: "bg-destructive/10 text-destructive border-destructive/20",
        };
      default:
        return {
          icon: AlertTriangle,
          label: "Unknown",
          className: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const statusConfig = getStatusConfig(activity.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{activity.activityName}</DialogTitle>
            <Badge variant="outline" className={statusConfig.className}>
              <StatusIcon className="w-3 h-3 mr-1.5" />
              {statusConfig.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Summary */}
          <div>
            <p className="text-muted-foreground">{activity.explanation}</p>
          </div>

          {/* What Conditions We're Watching */}
          <Card className="p-5 bg-muted/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">What We're Watching</h3>
                <p className="text-sm text-muted-foreground">
                  Key weather conditions affecting this activity
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activity.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm p-3 rounded-lg bg-background"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{condition}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Thresholds */}
          {activity.thresholds.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Current vs. Ideal Conditions</h3>
              <div className="space-y-3">
                {activity.thresholds.map((threshold, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-card"
                  >
                    <p className="text-sm font-medium mb-2">{threshold.label}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Current
                        </p>
                        <p className="font-medium">{threshold.current}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Ideal</p>
                        <p className="font-medium text-primary">
                          {threshold.ideal}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Risks */}
          {activity.risks && activity.risks.length > 0 && (
            <Card className="p-5 bg-orange-500/5 border-orange-500/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">What Could Change</h3>
                  <p className="text-sm text-muted-foreground">
                    Potential risks in the forecast
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {activity.risks.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm p-3 rounded-lg bg-background"
                  >
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tips */}
          {activity.tips && activity.tips.length > 0 && (
            <Card className="p-5 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Tips & Considerations</h3>
                  <p className="text-sm text-muted-foreground">
                    Helpful guidance for this activity
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {activity.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm p-3 rounded-lg bg-background"
                  >
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Forecast Confidence */}
          {activity.confidence === "low" && (
            <Card className="p-4 bg-muted/30 border-muted">
              <p className="text-sm text-muted-foreground italic">
                <strong>Note:</strong> Forecast confidence is lower for this
                timeframe. Conditions may change. Check back closer to your planned
                activity date.
              </p>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Button variant="outline" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
