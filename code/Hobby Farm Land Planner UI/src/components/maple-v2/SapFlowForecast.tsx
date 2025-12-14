import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Droplets,
  Info,
  Snowflake,
  Sun,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import type { SapFlowForecast as SapFlowForecastType } from "./types";

interface SapFlowForecastProps {
  forecast: SapFlowForecastType[];
}

export function SapFlowForecast({ forecast }: SapFlowForecastProps) {
  const getFlowBadge = (level: SapFlowForecast['flowLevel']) => {
    switch (level) {
      case 'high':
        return <Badge variant="success">High Flow</Badge>;
      case 'moderate':
        return <Badge variant="warning">Moderate</Badge>;
      case 'low':
        return <Badge variant="outline">Low Flow</Badge>;
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium mb-1">Sap Flow Forecast</h3>
          <p className="text-sm text-muted-foreground">
            Next 5 days based on freeze-thaw patterns
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Sap flows best when nights freeze (below 32°F) and days warm
                above 40°F. This creates pressure changes that drive sap flow.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {forecast.map((day, index) => {
          const flowBadge = getFlowBadge(day.flowLevel);

          return (
            <div
              key={day.date}
              className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Date */}
                <div className="min-w-0 flex-shrink-0">
                  <p className="text-sm font-medium">{day.dayOfWeek}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Temperature */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {day.freezeThaw && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Snowflake className="w-3 h-3 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Freeze-thaw pattern</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium">{day.highTemp}°</span>
                      <span className="text-xs text-muted-foreground">
                        / {day.lowTemp}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flow Level */}
                {flowBadge}
              </div>

              {/* Recommendation */}
              {day.recommendation && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Droplets className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                    <span>{day.recommendation}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}