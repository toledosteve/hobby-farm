import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Snowflake, CloudSun, Loader2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { weatherService, WeatherResponse } from "@/services/weather.service";

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly-cloudy';

const weatherIcons: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  'partly-cloudy': CloudSun,
};

interface WeatherPanelProps {
  location?: string; // City, state or address to fetch weather for
}

export function WeatherPanel({ location }: WeatherPanelProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      // Only fetch if location is provided
      if (!location) {
        setIsLoading(false);
        setError('No location set');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await weatherService.getWeatherByLocation(location);
        setWeather(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError('Unable to load weather');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {error || 'Weather data unavailable'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const CurrentIcon = weatherIcons[weather.current.condition] || Cloud;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Weather</span>
          <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {weather.location.split(',')[0]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Weather */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="p-3 rounded-xl bg-primary/10">
            <CurrentIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-semibold">{weather.current.temp}°F</p>
            <p className="text-sm text-muted-foreground">{weather.current.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Feels like {weather.current.feelsLike}° • {weather.current.humidity}% humidity
            </p>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="space-y-3">
          {weather.forecast.map((day, index) => {
            const Icon = weatherIcons[day.condition] || Cloud;
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
