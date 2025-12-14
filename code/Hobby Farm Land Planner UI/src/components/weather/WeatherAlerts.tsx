import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  AlertTriangle,
  Info,
  AlertOctagon,
  Calendar,
  X,
} from "lucide-react";
import type { WeatherAlert } from "./types";

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onDismiss?: (alertId: string) => void;
}

export function WeatherAlerts({ alerts, onDismiss }: WeatherAlertsProps) {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "info":
        return {
          icon: Info,
          className: "bg-blue-500/10 border-blue-500/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          titleColor: "text-blue-900 dark:text-blue-300",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          className: "bg-orange-500/10 border-orange-500/20",
          iconColor: "text-orange-600 dark:text-orange-400",
          titleColor: "text-orange-900 dark:text-orange-300",
        };
      case "severe":
        return {
          icon: AlertOctagon,
          className: "bg-destructive/10 border-destructive/20",
          iconColor: "text-destructive",
          titleColor: "text-destructive",
        };
      default:
        return {
          icon: Info,
          className: "bg-muted border-border",
          iconColor: "text-muted-foreground",
          titleColor: "text-foreground",
        };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = getSeverityConfig(alert.severity);
        const Icon = config.icon;

        return (
          <Card
            key={alert.id}
            className={`p-5 ${config.className}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${config.className} flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className={`font-medium ${config.titleColor}`}>
                    {alert.title}
                  </h3>
                  {onDismiss && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 -mt-1 -mr-1"
                      onClick={() => onDismiss(alert.id)}
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {alert.message}
                </p>

                {/* Timeframe */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{alert.timeframe}</span>
                </div>

                {/* Suggested Actions */}
                {alert.actions && alert.actions.length > 0 && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs font-medium mb-2 text-muted-foreground">
                      Suggested Actions:
                    </p>
                    <ul className="space-y-1.5">
                      {alert.actions.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className={`mt-0.5 ${config.iconColor}`}>•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
