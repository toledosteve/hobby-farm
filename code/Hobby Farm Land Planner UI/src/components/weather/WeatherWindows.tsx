import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import type { WeatherWindow } from "./types";

interface WeatherWindowsProps {
  windows: WeatherWindow[];
}

export function WeatherWindows({ windows }: WeatherWindowsProps) {
  const getConfidenceConfig = (confidence: string) => {
    switch (confidence) {
      case "high":
        return {
          label: "High Confidence",
          className: "bg-primary/10 text-primary border-primary/20",
          gradient: "from-primary/20 to-primary/5",
        };
      case "medium":
        return {
          label: "Medium Confidence",
          className:
            "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
          gradient: "from-orange-500/20 to-orange-500/5",
        };
      case "low":
        return {
          label: "Low Confidence",
          className: "bg-muted text-muted-foreground border-border",
          gradient: "from-muted/40 to-muted/10",
        };
      default:
        return {
          label: "Unknown",
          className: "bg-muted text-muted-foreground border-border",
          gradient: "from-muted/40 to-muted/10",
        };
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
    const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}–${endDay}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="mb-2">Recommended Windows</h2>
        <p className="text-muted-foreground">
          Optimal timing for key farm activities based on upcoming weather patterns
        </p>
      </div>

      {windows.length > 0 ? (
        <div className="space-y-4">
          {windows.map((window) => {
            const confidenceConfig = getConfidenceConfig(window.confidence);

            return (
              <Card key={window.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-medium mb-1">{window.activity}</h3>
                        <p className="text-sm text-muted-foreground">
                          {window.reason}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${confidenceConfig.className} flex-shrink-0`}
                      >
                        {confidenceConfig.label}
                      </Badge>
                    </div>

                    {/* Date Range */}
                    <div
                      className={`p-4 rounded-lg bg-gradient-to-r ${confidenceConfig.gradient} border border-border`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Recommended Window
                          </p>
                          <p className="font-medium">
                            {formatDateRange(window.startDate, window.endDate)}
                          </p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No optimal windows identified in the current forecast. Check back as
              conditions change.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
