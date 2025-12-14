import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

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

// Weather code mapping from Open-Meteo
// https://open-meteo.com/en/docs
const WEATHER_CODE_MAP: Record<number, { condition: CurrentWeather['condition']; description: string }> = {
  0: { condition: 'sunny', description: 'Clear sky' },
  1: { condition: 'sunny', description: 'Mainly clear' },
  2: { condition: 'partly-cloudy', description: 'Partly cloudy' },
  3: { condition: 'cloudy', description: 'Overcast' },
  45: { condition: 'cloudy', description: 'Fog' },
  48: { condition: 'cloudy', description: 'Depositing rime fog' },
  51: { condition: 'rainy', description: 'Light drizzle' },
  53: { condition: 'rainy', description: 'Moderate drizzle' },
  55: { condition: 'rainy', description: 'Dense drizzle' },
  56: { condition: 'rainy', description: 'Light freezing drizzle' },
  57: { condition: 'rainy', description: 'Dense freezing drizzle' },
  61: { condition: 'rainy', description: 'Slight rain' },
  63: { condition: 'rainy', description: 'Moderate rain' },
  65: { condition: 'rainy', description: 'Heavy rain' },
  66: { condition: 'rainy', description: 'Light freezing rain' },
  67: { condition: 'rainy', description: 'Heavy freezing rain' },
  71: { condition: 'snowy', description: 'Slight snow fall' },
  73: { condition: 'snowy', description: 'Moderate snow fall' },
  75: { condition: 'snowy', description: 'Heavy snow fall' },
  77: { condition: 'snowy', description: 'Snow grains' },
  80: { condition: 'rainy', description: 'Slight rain showers' },
  81: { condition: 'rainy', description: 'Moderate rain showers' },
  82: { condition: 'rainy', description: 'Violent rain showers' },
  85: { condition: 'snowy', description: 'Slight snow showers' },
  86: { condition: 'snowy', description: 'Heavy snow showers' },
  95: { condition: 'rainy', description: 'Thunderstorm' },
  96: { condition: 'rainy', description: 'Thunderstorm with slight hail' },
  99: { condition: 'rainy', description: 'Thunderstorm with heavy hail' },
};

@Injectable()
export class WeatherService {
  private readonly OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
  private readonly GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherResponse> {
    try {
      // Fetch current weather and 7-day forecast
      const url = `${this.OPEN_METEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new HttpException('Failed to fetch weather data', HttpStatus.BAD_GATEWAY);
      }

      const data = await response.json();

      return this.transformWeatherData(data, `${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Weather service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getWeatherByLocation(location: string): Promise<WeatherResponse> {
    try {
      // Parse location - might be "City, State" or just "City"
      const parts = location.split(',').map(p => p.trim());
      const cityName = parts[0];
      const stateCode = parts[1]?.toUpperCase();

      // Map state codes to full names for better geocoding matches
      const stateNames: Record<string, string> = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
        'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
        'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
        'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
        'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
        'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
        'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
        'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
        'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
        'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
        'WI': 'Wisconsin', 'WY': 'Wyoming'
      };

      const stateName = stateCode ? stateNames[stateCode] || stateCode : undefined;

      // Search for the city name, get multiple results to filter by state
      const geocodeUrl = `${this.GEOCODING_BASE_URL}/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;

      const geocodeResponse = await fetch(geocodeUrl);

      if (!geocodeResponse.ok) {
        throw new HttpException('Failed to geocode location', HttpStatus.BAD_GATEWAY);
      }

      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      // If state is provided, try to find a matching result
      let result = geocodeData.results[0];
      if (stateName) {
        const stateMatch = geocodeData.results.find(
          (r: any) => r.admin1?.toLowerCase() === stateName.toLowerCase() && r.country_code === 'US'
        );
        if (stateMatch) {
          result = stateMatch;
        }
      }

      const { latitude, longitude, name, admin1, country } = result;
      const locationName = [name, admin1, country].filter(Boolean).join(', ');

      // Now fetch weather for these coordinates
      const weatherUrl = `${this.OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7`;

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new HttpException('Failed to fetch weather data', HttpStatus.BAD_GATEWAY);
      }

      const weatherData = await weatherResponse.json();

      return this.transformWeatherData(weatherData, locationName);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Weather service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private transformWeatherData(data: any, location: string): WeatherResponse {
    const current = data.current;
    const daily = data.daily;

    const weatherInfo = WEATHER_CODE_MAP[current.weather_code] || { condition: 'cloudy' as const, description: 'Unknown' };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const forecast: DayForecast[] = daily.time.slice(0, 5).map((dateStr: string, index: number) => {
      const date = new Date(dateStr + 'T12:00:00');
      const dayWeather = WEATHER_CODE_MAP[daily.weather_code[index]] || { condition: 'cloudy' as const };

      return {
        day: dayNames[date.getDay()],
        date: dateStr,
        high: Math.round(daily.temperature_2m_max[index]),
        low: Math.round(daily.temperature_2m_min[index]),
        condition: dayWeather.condition,
        precipProbability: daily.precipitation_probability_max[index] || 0,
      };
    });

    return {
      location,
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        condition: weatherInfo.condition,
        description: weatherInfo.description,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
      },
      forecast,
      lastUpdated: new Date().toISOString(),
    };
  }
}
