import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, MapPin, TrendingUp } from "lucide-react";
import type { Alert } from "./types";

interface AlertDetailViewProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss?: (alertId: string) => void;
  onSnooze?: (alertId: string, duration: string) => void;
  onAction?: (alert: Alert) => void;
}

export function AlertDetailView({
  alert,
  open,
  onOpenChange,
  onDismiss,
  onSnooze,
  onAction,
}: AlertDetailViewProps) {
  if (!alert) return null;

  const getCategoryLabel = (category: Alert["category"]) => {
    switch (category) {
      case "weather":
        return "Weather Alert";
      case "task":
        return "Task Reminder";
      case "health":
        return "Health Notice";
      case "opportunity":
        return "Opportunity";
    }
  };

  const handleSnooze = (duration: string) => {
    onSnooze?.(alert.id, duration);
    onOpenChange(false);
  };

  const handleDismiss = () => {
    onDismiss?.(alert.id);
    onOpenChange(false);
  };

  const handleAction = () => {
    onAction?.(alert);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className="text-3xl" role="img" aria-label={alert.category}>
              {alert.icon}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DialogTitle>{alert.title}</DialogTitle>
                <Badge variant="outline">{getCategoryLabel(alert.category)}</Badge>
              </div>
              <DialogDescription>
                {alert.shortDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Full Description */}
          {alert.fullDescription && (
            <div className="space-y-2">
              <h4 className="font-semibold">Details</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {alert.fullDescription}
              </p>
            </div>
          )}

          {/* Metadata */}
          {alert.metadata && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-sm">Additional Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {alert.metadata.weatherCondition && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-medium">
                      {alert.metadata.weatherCondition}
                    </span>
                  </div>
                )}
                {alert.metadata.temperatureF && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span className="font-medium">
                      {alert.metadata.temperatureF}°F
                    </span>
                  </div>
                )}
                {alert.metadata.taskType && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Task Type:</span>
                    <span className="font-medium">{alert.metadata.taskType}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Affected Modules */}
          {alert.affectedModules.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Affected Areas</h4>
              <div className="flex flex-wrap gap-2">
                {alert.affectedModules.map((module) => (
                  <Badge key={module} variant="secondary">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Clock className="w-3 h-3" />
            <span>
              Created {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          {alert.actionLabel && (
            <Button className="w-full" onClick={handleAction}>
              {alert.actionLabel}
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Snooze for:</p>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSnooze("1-day")}
                >
                  1 Day
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSnooze("3-days")}
                >
                  3 Days
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSnooze("next-season")}
                >
                  Until Next Season
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">&nbsp;</p>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-destructive hover:text-destructive"
                >
                  Dismiss Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
