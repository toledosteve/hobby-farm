import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';

import { SoilCache, SoilCacheDocument } from './schemas/soil-cache.schema';
import {
  SoilProvider,
  SoilSummary,
  SoilFeatureCollection,
  GeoJSONPolygon,
} from './interfaces/soil-provider.interface';
import { UsdaSsurgoProvider } from './providers/usda-ssurgo.provider';
import { QuerySoilDto, GetMapUnitDto } from './dto/query-soil.dto';

@Injectable()
export class SoilService {
  private readonly logger = new Logger(SoilService.name);
  private readonly providers: Map<string, SoilProvider> = new Map();
  private readonly CACHE_TTL_HOURS = 24 * 7; // 1 week cache

  constructor(
    @InjectModel(SoilCache.name) private soilCacheModel: Model<SoilCacheDocument>,
  ) {
    // Register providers
    this.registerProvider(new UsdaSsurgoProvider());
    // Future: this.registerProvider(new SoilGridsProvider());

    this.logger.log(`Registered ${this.providers.size} soil data provider(s)`);
  }

  private registerProvider(provider: SoilProvider): void {
    this.providers.set(provider.name, provider);
  }

  /**
   * Get available providers and their WMS configurations
   */
  getProviders(): Array<{
    name: string;
    wms: ReturnType<SoilProvider['getWmsConfig']>;
  }> {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      wms: provider.getWmsConfig(),
    }));
  }

  /**
   * Get WMS configuration for a specific provider
   */
  getWmsConfig(providerName?: string): ReturnType<SoilProvider['getWmsConfig']> {
    const provider = providerName
      ? this.providers.get(providerName)
      : this.providers.get('usda-ssurgo'); // Default to USDA

    if (!provider) {
      throw new NotFoundException(`Soil provider '${providerName}' not found`);
    }

    return provider.getWmsConfig();
  }

  /**
   * Get soil summary for a polygon boundary
   * Uses caching to avoid repeated API calls
   */
  async getSoilSummary(dto: QuerySoilDto): Promise<SoilSummary> {
    const polygon = dto.polygon as GeoJSONPolygon;

    // Find appropriate provider
    const provider = this.findProviderForPolygon(polygon, dto.provider);
    if (!provider) {
      throw new NotFoundException('No soil data provider available for this location');
    }

    // Check cache
    const cacheKey = this.generateCacheKey(polygon, provider.name);
    const cached = await this.getCachedSummary(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for soil summary: ${cacheKey.substring(0, 16)}...`);
      return cached;
    }

    // Fetch from provider
    this.logger.log(`Fetching soil data from ${provider.name} for polygon`);
    const summary = await provider.getSoilSummary(polygon);

    // Cache the result
    await this.cacheSummary(cacheKey, provider.name, polygon, summary);

    return summary;
  }

  /**
   * Get detailed info for a specific map unit
   */
  async getMapUnitDetails(dto: GetMapUnitDto) {
    const provider = dto.provider
      ? this.providers.get(dto.provider)
      : this.providers.get('usda-ssurgo');

    if (!provider) {
      throw new NotFoundException(`Soil provider '${dto.provider}' not found`);
    }

    return provider.getMapUnitDetails(dto.mukey);
  }

  /**
   * Clear cached soil data for a polygon
   */
  async clearCache(polygon: GeoJSONPolygon, providerName?: string): Promise<void> {
    const provider = providerName || 'usda-ssurgo';
    const cacheKey = this.generateCacheKey(polygon, provider);
    await this.soilCacheModel.deleteOne({ cacheKey });
    this.logger.log(`Cleared cache for key: ${cacheKey.substring(0, 16)}...`);
  }

  /**
   * Get soil geometries for highlighting on the map
   */
  async getSoilGeometries(dto: QuerySoilDto): Promise<SoilFeatureCollection> {
    const polygon = dto.polygon as GeoJSONPolygon;

    // Find appropriate provider
    const provider = this.findProviderForPolygon(polygon, dto.provider);
    if (!provider) {
      throw new NotFoundException('No soil data provider available for this location');
    }

    // Check if provider supports geometries
    if (!provider.getSoilGeometries) {
      return { type: 'FeatureCollection', features: [] };
    }

    // Fetch geometries from provider
    this.logger.log(`Fetching soil geometries from ${provider.name}`);
    return provider.getSoilGeometries(polygon);
  }

  // ==================== Private Methods ====================

  private findProviderForPolygon(polygon: GeoJSONPolygon, preferredProvider?: string): SoilProvider | null {
    const bounds = this.getBoundsFromPolygon(polygon);

    // If preferred provider specified and supports bounds, use it
    if (preferredProvider) {
      const provider = this.providers.get(preferredProvider);
      if (provider?.supportsBounds(bounds)) {
        return provider;
      }
    }

    // Find first provider that supports these bounds
    for (const provider of this.providers.values()) {
      if (provider.supportsBounds(bounds)) {
        return provider;
      }
    }

    return null;
  }

  private generateCacheKey(polygon: GeoJSONPolygon, provider: string): string {
    // Create deterministic hash from polygon coordinates
    const coordString = JSON.stringify(polygon.coordinates);
    const hash = createHash('sha256')
      .update(`${provider}:${coordString}`)
      .digest('hex');
    return hash;
  }

  private async getCachedSummary(cacheKey: string): Promise<SoilSummary | null> {
    const cached = await this.soilCacheModel.findOne({
      cacheKey,
      expiresAt: { $gt: new Date() },
    });

    if (cached) {
      return cached.summary as SoilSummary;
    }

    return null;
  }

  private async cacheSummary(
    cacheKey: string,
    provider: string,
    polygon: GeoJSONPolygon,
    summary: SoilSummary,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.CACHE_TTL_HOURS);

    await this.soilCacheModel.findOneAndUpdate(
      { cacheKey },
      {
        cacheKey,
        provider,
        polygon,
        summary,
        expiresAt,
      },
      { upsert: true, new: true },
    );

    this.logger.debug(`Cached soil summary: ${cacheKey.substring(0, 16)}... (expires: ${expiresAt.toISOString()})`);
  }

  private getBoundsFromPolygon(polygon: GeoJSONPolygon): {
    north: number;
    south: number;
    east: number;
    west: number;
  } {
    const coords = polygon.coordinates[0];
    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };
  }
}
