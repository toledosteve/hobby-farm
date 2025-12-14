import { API_CONFIG } from '@/config/api.config';

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly-cloudy';
  description: string;
  windSpeed: number;
  windDirection: number;
}

export interface DayForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly-cloudy';
  precipProbability: number;
}

export interface WeatherResponse {
  location: string;
  current: CurrentWeather;
  forecast: DayForecast[];
  lastUpdated: string;
}

// Use direct fetch for weather since it's a public endpoint (no auth needed)
const weatherApiUrl = `${API_CONFIG.baseUrl}/weather`;

export const weatherService = {
  async getWeatherByLocation(location: string): Promise<WeatherResponse> {
    const url = new URL(weatherApiUrl);
    url.searchParams.set('location', location);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return response.json();
  },

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherResponse> {
    const url = new URL(weatherApiUrl);
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    return response.json();
  },
};
