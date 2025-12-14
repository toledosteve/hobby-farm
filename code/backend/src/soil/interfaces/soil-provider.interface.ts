/**
 * Soil Provider Interface
 *
 * Abstraction layer for different soil data sources.
 * Currently supports USDA SSURGO, designed to later support SoilGrids for global coverage.
 */

export interface SoilMapUnit {
  mukey: string;           // Map Unit Key (unique identifier)
  musym: string;           // Map Unit Symbol
  muname: string;          // Map Unit Name
  mukind: string;          // Map Unit Kind (e.g., "Consociation", "Complex")
  muacres?: number;        // Acres in this map unit (within query area)
  farmlndcl?: string;      // Farmland classification
}

export interface SoilComponent {
  cokey: string;           // Component Key
  compname: string;        // Component Name (e.g., "Drummer", "Harpster")
  compkind: string;        // Component Kind (e.g., "Series", "Taxadjunct")
  comppct_r: number;       // Percent of map unit (representative)
  slope_r?: number;        // Slope percent (representative)
  drainagecl?: string;     // Drainage class
  hydgrp?: string;         // Hydrologic group (A, B, C, D)
  taxorder?: string;       // Taxonomic order
  taxsubgrp?: string;      // Taxonomic subgroup
  nirrcapcl?: string;      // Non-irrigated capability class
  nirrcapscl?: string;     // Non-irrigated capability subclass
}

export interface SoilHorizon {
  hzname: string;          // Horizon name (e.g., "Ap", "Bt1")
  hzdept_r: number;        // Depth to top (cm)
  hzdepb_r: number;        // Depth to bottom (cm)
  sandtotal_r?: number;    // Sand % (representative)
  silttotal_r?: number;    // Silt % (representative)
  claytotal_r?: number;    // Clay % (representative)
  om_r?: number;           // Organic matter % (representative)
  ph1to1h2o_r?: number;    // pH in water (representative)
  ksat_r?: number;         // Saturated hydraulic conductivity
  awc_r?: number;          // Available water capacity
  cec7_r?: number;         // Cation exchange capacity
}

export interface SoilInsight {
  type: 'strength' | 'limitation' | 'recommendation';
  category: string;        // e.g., "drainage", "fertility", "structure"
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface SoilSummary {
  provider: string;        // e.g., "usda-ssurgo", "soilgrids"
  queryBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  totalAcres: number;
  mapUnits: SoilMapUnit[];
  dominantSoils: Array<{
    name: string;
    percentage: number;
    description: string;
    drainageClass?: string;
    hydrologicGroup?: string;
    slopeRange?: string;
    farmlandClass?: string;
  }>;
  insights: SoilInsight[];
  suitability: {
    cropland: 'excellent' | 'good' | 'fair' | 'poor' | 'not_suited';
    pasture: 'excellent' | 'good' | 'fair' | 'poor' | 'not_suited';
    woodland: 'excellent' | 'good' | 'fair' | 'poor' | 'not_suited';
    garden: 'excellent' | 'good' | 'fair' | 'poor' | 'not_suited';
  };
  recommendedZones: Array<{
    type: string;
    title: string;
    name?: string;
    description: string;
    soilTypes: string[];
    suggestedUses: string[];
  }>;
}

export interface SoilProviderConfig {
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
  maxRetries: number;
  timeoutMs: number;
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface SoilProvider {
  /**
   * Provider identifier
   */
  readonly name: string;

  /**
   * Check if provider covers the given location
   */
  supportsBounds(bounds: { north: number; south: number; east: number; west: number }): boolean;

  /**
   * Get WMS layer configuration for map overlay
   */
  getWmsConfig(): {
    url: string;
    layers: string;
    format: string;
    transparent: boolean;
    attribution: string;
    version?: string;
    crs?: string;
  };

  /**
   * Get soil summary for a polygon boundary
   */
  getSoilSummary(polygon: GeoJSONPolygon): Promise<SoilSummary>;

  /**
   * Get detailed soil data for a specific map unit
   */
  getMapUnitDetails(mukey: string): Promise<{
    mapUnit: SoilMapUnit;
    components: SoilComponent[];
    horizons: Map<string, SoilHorizon[]>;
  }>;

  /**
   * Get geometries for map units within a polygon (for highlighting)
   */
  getSoilGeometries?(polygon: GeoJSONPolygon): Promise<SoilFeatureCollection>;
}

export interface SoilFeature {
  type: 'Feature';
  properties: {
    mukey: string;
    musym: string;
    muname: string;
  };
  geometry: GeoJSONPolygon;
}

export interface SoilFeatureCollection {
  type: 'FeatureCollection';
  features: SoilFeature[];
}
