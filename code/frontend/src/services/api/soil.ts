import { httpClient } from '../http-client';
import {
  SoilProvider,
  SoilWmsConfig,
  SoilSummary,
  SoilFeatureCollection,
  GeoJSONPolygon,
} from '@/types';

export const soilApi = {
  /**
   * Get available soil data providers and their WMS configurations
   */
  getProviders: async (): Promise<SoilProvider[]> => {
    return httpClient.get<SoilProvider[]>('soil/providers');
  },

  /**
   * Get WMS configuration for soil map overlay
   */
  getWmsConfig: async (provider?: string): Promise<SoilWmsConfig> => {
    const params = provider ? { params: { provider } } : undefined;
    return httpClient.get<SoilWmsConfig>('soil/wms-config', params);
  },

  /**
   * Get soil summary for a polygon boundary
   */
  getSoilSummary: async (
    polygon: GeoJSONPolygon,
    provider?: string
  ): Promise<SoilSummary> => {
    return httpClient.post<SoilSummary>('soil/summary', {
      polygon,
      provider,
    });
  },

  /**
   * Get detailed information for a specific map unit
   */
  getMapUnitDetails: async (
    mukey: string,
    provider?: string
  ): Promise<any> => {
    const params = provider ? { params: { provider } } : undefined;
    return httpClient.get<any>(`soil/map-unit/${mukey}`, params);
  },

  /**
   * Get soil geometries for map highlighting
   */
  getSoilGeometries: async (
    polygon: GeoJSONPolygon,
    provider?: string
  ): Promise<SoilFeatureCollection> => {
    return httpClient.post<SoilFeatureCollection>('soil/geometries', {
      polygon,
      provider,
    });
  },

  /**
   * Clear cached soil data for a polygon (force refresh)
   */
  clearCache: async (
    polygon: GeoJSONPolygon,
    provider?: string
  ): Promise<{ success: boolean; message: string }> => {
    return httpClient.post<{ success: boolean; message: string }>(
      'soil/clear-cache',
      { polygon, provider }
    );
  },
};
