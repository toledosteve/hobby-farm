import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, Eye, ChevronRight } from "lucide-react";
import type { Alert } from "./types";

interface AlertCardProps {
  alert: Alert;
  onView?: (alert: Alert) => void;
  onDismiss?: (alertId: string) => void;
  onAction?: (alert: Alert) => void;
}

export function AlertCard({
  alert,
  onView,
  onDismiss,
  onAction,
}: AlertCardProps) {
  const getCategoryColor = (category: Alert["category"]) => {
    switch (category) {
      case "weather":
        return "bg-sky-50 border-sky-200";
      case "task":
        return "bg-amber-50 border-amber-200";
      case "health":
        return "bg-rose-50 border-rose-200";
      case "opportunity":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-muted border-border";
    }
  };

  const getSeverityBadge = (severity: Alert["severity"]) => {
    switch (severity) {
      case "important":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Important</Badge>;
      case "heads-up":
        return <Badge variant="secondary">Heads-up</Badge>;
      case "notice":
        return <Badge variant="outline">Notice</Badge>;
    }
  };

  const getTimeDisplay = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const isNew = alert.status === "new";
  const isSnoozed = alert.status === "snoozed";

  return (
    <div
      className={`relative rounded-lg border-2 transition-all ${
        getCategoryColor(alert.category)
      } ${isNew ? "border-l-4 border-l-primary" : ""} ${
        isSnoozed ? "opacity-60" : ""
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl" role="img" aria-label={alert.category}>
              {alert.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">
                  {alert.title}
                </h3>
                {isNew && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.shortDescription}
              </p>
            </div>
          </div>
          {getSeverityBadge(alert.severity)}
        </div>

        {/* Module Tags */}
        {alert.affectedModules.length > 0 && (
          <div className="flex items-center gap-2 mb-3 ml-11">
            {alert.affectedModules.map((module) => (
              <Badge key={module} variant="outline" className="text-xs">
                {module}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 ml-11">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {isSnoozed && alert.snoozedUntil ? (
              <span>
                Snoozed until{" "}
                {new Date(alert.snoozedUntil).toLocaleDateString()}
              </span>
            ) : (
              <span>{getTimeDisplay(alert.timestamp)}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {alert.actionLabel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction?.(alert)}
              >
                {alert.actionLabel}
              </Button>
            )}
            {onView && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView(alert)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Details
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(alert.id)}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
