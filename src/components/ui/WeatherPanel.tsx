import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface WeatherDay {
  day: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  windy: Wind,
};

interface WeatherPanelProps {
  current: {
    temp: number;
    condition: keyof typeof weatherIcons;
    description: string;
  };
  forecast: WeatherDay[];
}

export function WeatherPanel({ current, forecast }: WeatherPanelProps) {
  const CurrentIcon = weatherIcons[current.condition];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Weather */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="p-3 rounded-xl bg-primary/10">
            <CurrentIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-semibold">{current.temp}°F</p>
            <p className="text-sm text-muted-foreground">{current.description}</p>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="space-y-3">
          {forecast.map((day, index) => {
            const Icon = weatherIcons[day.condition];
            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground w-12">{day.day}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-2 text-sm">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
