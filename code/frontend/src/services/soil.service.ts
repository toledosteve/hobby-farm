import {
  SoilProvider,
  SoilWmsConfig,
  SoilSummary,
  SoilFeatureCollection,
  GeoJSONPolygon,
  SuitabilityRating,
} from '@/types';
import { soilApi } from './api/soil';

class SoilService {
  private wmsConfigCache: SoilWmsConfig | null = null;
  private providersCache: SoilProvider[] | null = null;

  /**
   * Get available soil data providers
   */
  async getProviders(): Promise<SoilProvider[]> {
    if (this.providersCache) {
      return this.providersCache;
    }
    this.providersCache = await soilApi.getProviders();
    return this.providersCache;
  }

  /**
   * Get WMS configuration for soil map overlay
   */
  async getWmsConfig(provider?: string): Promise<SoilWmsConfig> {
    if (!provider && this.wmsConfigCache) {
      return this.wmsConfigCache;
    }
    const config = await soilApi.getWmsConfig(provider);
    if (!provider) {
      this.wmsConfigCache = config;
    }
    return config;
  }

  /**
   * Get soil summary for a polygon boundary
   */
  async getSoilSummary(
    polygon: GeoJSONPolygon,
    provider?: string
  ): Promise<SoilSummary> {
    return soilApi.getSoilSummary(polygon, provider);
  }

  /**
   * Get detailed information for a specific map unit
   */
  async getMapUnitDetails(mukey: string, provider?: string): Promise<any> {
    return soilApi.getMapUnitDetails(mukey, provider);
  }

  /**
   * Get soil geometries for map highlighting
   */
  async getSoilGeometries(
    polygon: GeoJSONPolygon,
    provider?: string
  ): Promise<SoilFeatureCollection> {
    return soilApi.getSoilGeometries(polygon, provider);
  }

  /**
   * Clear cached soil data and force refresh
   */
  async refreshSoilData(
    polygon: GeoJSONPolygon,
    provider?: string
  ): Promise<SoilSummary> {
    await soilApi.clearCache(polygon, provider);
    return this.getSoilSummary(polygon, provider);
  }

  /**
   * Format suitability rating for display
   */
  formatSuitability(rating: SuitabilityRating): {
    label: string;
    color: string;
    bgColor: string;
  } {
    const formats: Record<SuitabilityRating, { label: string; color: string; bgColor: string }> = {
      excellent: { label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-100' },
      good: { label: 'Good', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
      fair: { label: 'Fair', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      poor: { label: 'Poor', color: 'text-orange-700', bgColor: 'bg-orange-100' },
      not_suited: { label: 'Not Suited', color: 'text-red-700', bgColor: 'bg-red-100' },
    };
    return formats[rating] || formats.not_suited;
  }

  /**
   * Get insight icon based on type
   */
  getInsightIcon(type: 'strength' | 'limitation' | 'recommendation'): string {
    const icons: Record<string, string> = {
      strength: 'check-circle',
      limitation: 'alert-triangle',
      recommendation: 'lightbulb',
    };
    return icons[type] || 'info';
  }

  /**
   * Get insight color based on type and severity
   */
  getInsightColor(
    type: 'strength' | 'limitation' | 'recommendation',
    severity?: 'low' | 'medium' | 'high'
  ): { text: string; bg: string; border: string } {
    if (type === 'strength') {
      return {
        text: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
      };
    }
    if (type === 'limitation') {
      const colors: Record<string, { text: string; bg: string; border: string }> = {
        low: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        medium: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
        high: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
      };
      return colors[severity || 'medium'];
    }
    // recommendation
    return {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    };
  }

  /**
   * Get drainage class badge color
   */
  getDrainageColor(drainageClass?: string): string {
    if (!drainageClass) return 'bg-gray-100 text-gray-700';

    const lc = drainageClass.toLowerCase();
    if (lc.includes('well') && !lc.includes('poor')) {
      return 'bg-green-100 text-green-700';
    }
    if (lc.includes('moderate')) {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (lc.includes('poor')) {
      return 'bg-orange-100 text-orange-700';
    }
    return 'bg-gray-100 text-gray-700';
  }

  /**
   * Get hydrologic group description
   */
  getHydrologicGroupDescription(group?: string): string {
    const descriptions: Record<string, string> = {
      'A': 'High infiltration, low runoff',
      'B': 'Moderate infiltration',
      'C': 'Slow infiltration, moderate runoff',
      'D': 'Very slow infiltration, high runoff',
    };
    return descriptions[group || ''] || 'Unknown';
  }

  /**
   * Clear local caches
   */
  clearCache(): void {
    this.wmsConfigCache = null;
    this.providersCache = null;
  }
}

export const soilService = new SoilService();
