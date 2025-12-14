import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { WeatherService, WeatherResponse } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('location') location?: string,
  ): Promise<WeatherResponse> {
    // If coordinates are provided, use them
    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new HttpException('Invalid coordinates', HttpStatus.BAD_REQUEST);
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        throw new HttpException('Coordinates out of range', HttpStatus.BAD_REQUEST);
      }

      return this.weatherService.getWeatherByCoordinates(latitude, longitude);
    }

    // If location string is provided, geocode and get weather
    if (location) {
      return this.weatherService.getWeatherByLocation(location);
    }

    throw new HttpException(
      'Either coordinates (lat, lon) or location must be provided',
      HttpStatus.BAD_REQUEST,
    );
  }
}
