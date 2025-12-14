// Weather-related types for Farm Intelligence

export type ActivityStatus = 'good' | 'caution' | 'not-recommended';
export type AlertSeverity = 'info' | 'warning' | 'severe';
export type ForecastConfidence = 'high' | 'medium' | 'low';

export interface WeatherCondition {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  wind: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  high: number;
  low: number;
  precipitation: number;
  condition: string;
  icon: string;
}

export interface FarmIndicator {
  id: string;
  label: string;
  value: string;
  status: 'normal' | 'warning' | 'alert';
  description?: string;
}

export interface ActivityRecommendation {
  id: string;
  activityName: string;
  category: 'maple' | 'poultry' | 'garden' | 'general';
  status: ActivityStatus;
  summary: string;
  explanation: string;
  conditions: string[];
  thresholds: {
    label: string;
    current: string;
    ideal: string;
  }[];
  risks?: string[];
  tips?: string[];
  confidence: ForecastConfidence;
}

export interface WeatherWindow {
  id: string;
  activity: string;
  startDate: string;
  endDate: string;
  confidence: ForecastConfidence;
  reason: string;
}

export interface WeatherAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timeframe: string;
  actions?: string[];
}
