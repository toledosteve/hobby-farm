import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Snowflake,
  CloudDrizzle,
} from "lucide-react";
import type { WeatherCondition, DailyForecast, FarmIndicator } from "./types";

interface FarmWeatherSummaryProps {
  current: WeatherCondition;
  forecast: DailyForecast[];
  indicators: FarmIndicator[];
  summary: string;
}

export function FarmWeatherSummary({
  current,
  forecast,
  indicators,
  summary,
}: FarmWeatherSummaryProps) {
  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("rain")) return CloudRain;
    if (lower.includes("drizzle")) return CloudDrizzle;
    if (lower.includes("snow")) return Snowflake;
    if (lower.includes("cloud")) return Cloud;
    return Sun;
  };

  const getIndicatorColor = (status: string) => {
    switch (status) {
      case "warning":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case "alert":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const CurrentIcon = getWeatherIcon(current.condition);

  return (
    <div className="space-y-6">
      {/* Current Conditions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left: Current Weather */}
          <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <CurrentIcon className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Conditions</p>
              <h2 className="text-4xl font-semibold mb-1">{current.temperature}°F</h2>
              <p className="text-muted-foreground mb-3">{current.condition}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Feels like {current.feelsLike}°F
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {current.humidity}% humidity
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {current.wind} mph wind
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Farm Indicators */}
          <div className="lg:max-w-md">
            <p className="text-sm font-medium mb-3">Key Indicators</p>
            <div className="flex flex-wrap gap-2">
              {indicators.map((indicator) => (
                <Badge
                  key={indicator.id}
                  variant="outline"
                  className={getIndicatorColor(indicator.status)}
                >
                  {indicator.status === "warning" && (
                    <AlertTriangle className="w-3 h-3 mr-1.5" />
                  )}
                  {indicator.label}: {indicator.value}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Plain Language Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground italic">{summary}</p>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Next 7 Days</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day) => {
            const DayIcon = getWeatherIcon(day.condition);
            return (
              <div
                key={day.date}
                className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {day.dayOfWeek}
                </p>
                <DayIcon className="w-8 h-8 text-primary mb-2" />
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-semibold">{day.high}°</span>
                  <span className="text-xs text-muted-foreground">{day.low}°</span>
                </div>
                {day.precipitation > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Droplets className="w-3 h-3" />
                    <span>{day.precipitation}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
