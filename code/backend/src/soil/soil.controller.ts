import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { SoilService } from './soil.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuerySoilDto, GetMapUnitDto } from './dto/query-soil.dto';

@Controller('soil')
export class SoilController {
  constructor(private readonly soilService: SoilService) {}

  /**
   * Get available soil data providers and their WMS configurations
   * Public endpoint - needed for map layer setup
   */
  @Get('providers')
  getProviders() {
    return this.soilService.getProviders();
  }

  /**
   * Get WMS configuration for soil map overlay
   * Public endpoint - needed for map layer setup
   */
  @Get('wms-config')
  getWmsConfig(@Query('provider') provider?: string) {
    return this.soilService.getWmsConfig(provider);
  }

  /**
   * Get soil summary for a polygon boundary
   * Protected - requires authentication
   */
  @Post('summary')
  @UseGuards(JwtAuthGuard)
  async getSoilSummary(@Body() dto: QuerySoilDto) {
    return this.soilService.getSoilSummary(dto);
  }

  /**
   * Get detailed information for a specific map unit
   * Protected - requires authentication
   */
  @Get('map-unit/:mukey')
  @UseGuards(JwtAuthGuard)
  async getMapUnitDetails(
    @Param('mukey') mukey: string,
    @Query('provider') provider?: string,
  ) {
    return this.soilService.getMapUnitDetails({ mukey, provider });
  }

  /**
   * Get soil geometries for map highlighting
   * Protected - requires authentication
   */
  @Post('geometries')
  @UseGuards(JwtAuthGuard)
  async getSoilGeometries(@Body() dto: QuerySoilDto) {
    return this.soilService.getSoilGeometries(dto);
  }

  /**
   * Clear cached soil data for a polygon (force refresh)
   * Protected - requires authentication
   */
  @Post('clear-cache')
  @UseGuards(JwtAuthGuard)
  async clearCache(@Body() dto: QuerySoilDto) {
    await this.soilService.clearCache(dto.polygon as any, dto.provider);
    return { success: true, message: 'Cache cleared' };
  }
}
