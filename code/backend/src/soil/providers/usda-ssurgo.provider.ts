/**
 * USDA SSURGO Soil Data Provider
 *
 * Integrates with USDA/NRCS Soil Data Access (SDA) services:
 * - WMS: https://SDMDataAccess.sc.egov.usda.gov/Spatial/SDM.wms
 * - REST: https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest
 *
 * SSURGO (Soil Survey Geographic Database) is the authoritative source
 * for detailed soil survey information in the United States.
 */

import { Logger } from '@nestjs/common';
import {
  SoilProvider,
  SoilSummary,
  SoilMapUnit,
  SoilComponent,
  SoilHorizon,
  SoilInsight,
  GeoJSONPolygon,
} from '../interfaces/soil-provider.interface';

export class UsdaSsurgoProvider implements SoilProvider {
  readonly name = 'usda-ssurgo';
  private readonly logger = new Logger(UsdaSsurgoProvider.name);

  // USDA SDA endpoints
  private readonly SDA_REST_URL = 'https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest';
  private readonly SDA_WMS_URL = 'https://SDMDataAccess.sc.egov.usda.gov/Spatial/SDM.wms';

  // US bounding box (continental US + Alaska + Hawaii)
  private readonly US_BOUNDS = {
    north: 71.5,  // Alaska
    south: 18.9,  // Hawaii
    east: -66.9,  // Maine
    west: -179.2, // Alaska (crosses date line)
  };

  supportsBounds(bounds: { north: number; south: number; east: number; west: number }): boolean {
    // Check if bounds intersect with US
    return !(
      bounds.south > this.US_BOUNDS.north ||
      bounds.north < this.US_BOUNDS.south ||
      bounds.west > this.US_BOUNDS.east ||
      bounds.east < this.US_BOUNDS.west
    );
  }

  getWmsConfig() {
    return {
      url: this.SDA_WMS_URL,
      layers: 'mapunitpoly',  // Soil map unit polygons
      format: 'image/png',
      transparent: true,
      attribution: 'Soil Data: USDA-NRCS',
      version: '1.1.1',
      crs: 'EPSG:4326',
    };
  }

  async getSoilSummary(polygon: GeoJSONPolygon): Promise<SoilSummary> {
    const bounds = this.getBoundsFromPolygon(polygon);
    const wktPolygon = this.polygonToWKT(polygon);

    // Fetch map units that intersect with the polygon
    const mapUnits = await this.fetchMapUnits(wktPolygon);

    if (mapUnits.length === 0) {
      return this.createEmptySummary(bounds);
    }

    // Fetch component data for all map units
    const mukeys = mapUnits.map(mu => mu.mukey);
    const components = await this.fetchComponents(mukeys);

    // Calculate dominant soils
    const dominantSoils = this.calculateDominantSoils(mapUnits, components);

    // Generate insights
    const insights = this.generateInsights(mapUnits, components);

    // Calculate suitability ratings
    const suitability = this.calculateSuitability(components);

    // Generate recommended zones
    const recommendedZones = this.generateRecommendedZones(dominantSoils, components);

    // Calculate total acres
    const totalAcres = mapUnits.reduce((sum, mu) => sum + (mu.muacres || 0), 0);

    return {
      provider: this.name,
      queryBounds: bounds,
      totalAcres,
      mapUnits,
      dominantSoils,
      insights,
      suitability,
      recommendedZones,
    };
  }

  async getMapUnitDetails(mukey: string): Promise<{
    mapUnit: SoilMapUnit;
    components: SoilComponent[];
    horizons: Map<string, SoilHorizon[]>;
  }> {
    const mapUnit = await this.fetchSingleMapUnit(mukey);
    const components = await this.fetchComponents([mukey]);
    const horizons = await this.fetchHorizons(components.map(c => c.cokey));

    return { mapUnit, components, horizons };
  }

  /**
   * Get geometries for map units that intersect with the given polygon
   * Returns GeoJSON features for each soil type
   */
  async getSoilGeometries(polygon: GeoJSONPolygon): Promise<{
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      properties: { mukey: string; musym: string; muname: string };
      geometry: GeoJSONPolygon;
    }>;
  }> {
    const wktPolygon = this.polygonToWKT(polygon);

    // Query to get map unit polygons that intersect with the boundary
    // The SDA_Get_Mupolygonkey_from_intersection_with_WktWgs84 returns polygon keys
    // We then get the geometry and map unit info for each
    const query = `
      SELECT
        M.mukey,
        M.musym,
        M.muname,
        geometry::STGeomFromText(mupolygongeo.STAsText(), 4326).STIntersection(
          geometry::STGeomFromText('${wktPolygon}', 4326)
        ).STAsText() as geom_wkt
      FROM mupolygon MP
      INNER JOIN mapunit M ON MP.mukey = M.mukey
      WHERE MP.mupolygonkey IN (
        SELECT mupolygonkey
        FROM SDA_Get_Mupolygonkey_from_intersection_with_WktWgs84('${wktPolygon}')
      )
    `;

    try {
      const result = await this.executeSdaQuery(query);
      return this.parseGeometriesResult(result);
    } catch (error) {
      this.logger.error(`Failed to fetch soil geometries: ${error.message}`);
      // Return empty feature collection on error
      return { type: 'FeatureCollection', features: [] };
    }
  }

  private parseGeometriesResult(result: any): {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      properties: { mukey: string; musym: string; muname: string };
      geometry: GeoJSONPolygon;
    }>;
  } {
    const features: Array<{
      type: 'Feature';
      properties: { mukey: string; musym: string; muname: string };
      geometry: GeoJSONPolygon;
    }> = [];

    if (!result?.Table || !Array.isArray(result.Table)) {
      return { type: 'FeatureCollection', features };
    }

    for (const row of result.Table) {
      const wkt = row.geom_wkt || row[3];
      if (!wkt) continue;

      const geometry = this.wktToGeoJSON(wkt);
      if (!geometry) continue;

      features.push({
        type: 'Feature',
        properties: {
          mukey: row.mukey || row[0],
          musym: row.musym || row[1],
          muname: row.muname || row[2],
        },
        geometry,
      });
    }

    return { type: 'FeatureCollection', features };
  }

  private wktToGeoJSON(wkt: string): GeoJSONPolygon | null {
    try {
      // Handle POLYGON and MULTIPOLYGON
      const isMulti = wkt.toUpperCase().startsWith('MULTIPOLYGON');

      if (isMulti) {
        // For multipolygon, just take the first polygon for simplicity
        // Format: MULTIPOLYGON (((x1 y1, x2 y2, ...)), ((x3 y3, ...)))
        const match = wkt.match(/\(\(\(([^)]+)\)\)/);
        if (!match) return null;

        const coords = this.parseWktCoords(match[1]);
        return { type: 'Polygon', coordinates: [coords] };
      } else {
        // Format: POLYGON ((x1 y1, x2 y2, ...))
        const match = wkt.match(/\(\(([^)]+)\)\)/);
        if (!match) return null;

        const coords = this.parseWktCoords(match[1]);
        return { type: 'Polygon', coordinates: [coords] };
      }
    } catch (error) {
      this.logger.warn(`Failed to parse WKT: ${error.message}`);
      return null;
    }
  }

  private parseWktCoords(coordString: string): number[][] {
    return coordString.split(',').map(pair => {
      const [lng, lat] = pair.trim().split(/\s+/).map(Number);
      return [lng, lat];
    });
  }

  // ==================== Private Methods ====================

  private async fetchMapUnits(wktPolygon: string): Promise<SoilMapUnit[]> {
    const query = `
      SELECT
        M.mukey,
        M.musym,
        M.muname,
        M.mukind,
        M.farmlndcl
      FROM mapunit M
      INNER JOIN SDA_Get_Mukey_from_intersection_with_WktWgs84('${wktPolygon}') AS MK
        ON M.mukey = MK.mukey
      ORDER BY M.muname
    `;

    try {
      const result = await this.executeSdaQuery(query);
      return this.parseMapUnitsResult(result);
    } catch (error) {
      this.logger.error(`Failed to fetch map units: ${error.message}`);
      return [];
    }
  }

  private async fetchSingleMapUnit(mukey: string): Promise<SoilMapUnit> {
    const query = `
      SELECT mukey, musym, muname, mukind, farmlndcl
      FROM mapunit
      WHERE mukey = '${mukey}'
    `;

    const result = await this.executeSdaQuery(query);
    const mapUnits = this.parseMapUnitsResult(result);

    if (mapUnits.length === 0) {
      throw new Error(`Map unit ${mukey} not found`);
    }

    return mapUnits[0];
  }

  private async fetchComponents(mukeys: string[]): Promise<SoilComponent[]> {
    if (mukeys.length === 0) return [];

    const mukeyList = mukeys.map(k => `'${k}'`).join(',');
    const query = `
      SELECT
        C.cokey,
        C.mukey,
        C.compname,
        C.compkind,
        C.comppct_r,
        C.slope_r,
        C.drainagecl,
        C.hydgrp,
        C.taxorder,
        C.taxsubgrp,
        C.nirrcapcl,
        C.nirrcapscl
      FROM component C
      WHERE C.mukey IN (${mukeyList})
        AND C.comppct_r > 0
      ORDER BY C.comppct_r DESC
    `;

    try {
      const result = await this.executeSdaQuery(query);
      return this.parseComponentsResult(result);
    } catch (error) {
      this.logger.error(`Failed to fetch components: ${error.message}`);
      return [];
    }
  }

  private async fetchHorizons(cokeys: string[]): Promise<Map<string, SoilHorizon[]>> {
    if (cokeys.length === 0) return new Map();

    const cokeyList = cokeys.map(k => `'${k}'`).join(',');
    const query = `
      SELECT
        H.cokey,
        H.hzname,
        H.hzdept_r,
        H.hzdepb_r,
        H.sandtotal_r,
        H.silttotal_r,
        H.claytotal_r,
        H.om_r,
        H.ph1to1h2o_r,
        H.ksat_r,
        H.awc_r,
        H.cec7_r
      FROM chorizon H
      WHERE H.cokey IN (${cokeyList})
      ORDER BY H.cokey, H.hzdept_r
    `;

    try {
      const result = await this.executeSdaQuery(query);
      return this.parseHorizonsResult(result);
    } catch (error) {
      this.logger.error(`Failed to fetch horizons: ${error.message}`);
      return new Map();
    }
  }

  private async executeSdaQuery(query: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(this.SDA_REST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: `query=${encodeURIComponent(query)}&format=JSON`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`SDA API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('SDA API request timed out');
      }
      throw error;
    }
  }

  private parseMapUnitsResult(result: any): SoilMapUnit[] {
    if (!result?.Table || !Array.isArray(result.Table)) {
      return [];
    }

    return result.Table.map((row: any) => ({
      mukey: row.mukey || row[0],
      musym: row.musym || row[1],
      muname: row.muname || row[2],
      mukind: row.mukind || row[3],
      farmlndcl: row.farmlndcl || row[4],
    }));
  }

  private parseComponentsResult(result: any): SoilComponent[] {
    if (!result?.Table || !Array.isArray(result.Table)) {
      return [];
    }

    return result.Table.map((row: any) => ({
      cokey: row.cokey || row[0],
      mukey: row.mukey || row[1],
      compname: row.compname || row[2],
      compkind: row.compkind || row[3],
      comppct_r: parseFloat(row.comppct_r || row[4]) || 0,
      slope_r: row.slope_r ? parseFloat(row.slope_r || row[5]) : undefined,
      drainagecl: row.drainagecl || row[6],
      hydgrp: row.hydgrp || row[7],
      taxorder: row.taxorder || row[8],
      taxsubgrp: row.taxsubgrp || row[9],
      nirrcapcl: row.nirrcapcl || row[10],
      nirrcapscl: row.nirrcapscl || row[11],
    }));
  }

  private parseHorizonsResult(result: any): Map<string, SoilHorizon[]> {
    const horizonMap = new Map<string, SoilHorizon[]>();

    if (!result?.Table || !Array.isArray(result.Table)) {
      return horizonMap;
    }

    for (const row of result.Table) {
      const cokey = row.cokey || row[0];
      const horizon: SoilHorizon = {
        hzname: row.hzname || row[1],
        hzdept_r: parseFloat(row.hzdept_r || row[2]) || 0,
        hzdepb_r: parseFloat(row.hzdepb_r || row[3]) || 0,
        sandtotal_r: row.sandtotal_r ? parseFloat(row.sandtotal_r || row[4]) : undefined,
        silttotal_r: row.silttotal_r ? parseFloat(row.silttotal_r || row[5]) : undefined,
        claytotal_r: row.claytotal_r ? parseFloat(row.claytotal_r || row[6]) : undefined,
        om_r: row.om_r ? parseFloat(row.om_r || row[7]) : undefined,
        ph1to1h2o_r: row.ph1to1h2o_r ? parseFloat(row.ph1to1h2o_r || row[8]) : undefined,
        ksat_r: row.ksat_r ? parseFloat(row.ksat_r || row[9]) : undefined,
        awc_r: row.awc_r ? parseFloat(row.awc_r || row[10]) : undefined,
        cec7_r: row.cec7_r ? parseFloat(row.cec7_r || row[11]) : undefined,
      };

      if (!horizonMap.has(cokey)) {
        horizonMap.set(cokey, []);
      }
      horizonMap.get(cokey)!.push(horizon);
    }

    return horizonMap;
  }

  private calculateDominantSoils(
    mapUnits: SoilMapUnit[],
    components: SoilComponent[],
  ): SoilSummary['dominantSoils'] {
    // Group components by soil name and calculate weighted percentages
    const soilGroups = new Map<string, {
      name: string;
      totalPct: number;
      drainage: string[];
      hydgrp: string[];
      slopes: number[];
      farmland: string[];
    }>();

    for (const comp of components) {
      const name = comp.compname;
      if (!soilGroups.has(name)) {
        soilGroups.set(name, {
          name,
          totalPct: 0,
          drainage: [],
          hydgrp: [],
          slopes: [],
          farmland: [],
        });
      }

      const group = soilGroups.get(name)!;
      group.totalPct += comp.comppct_r;
      if (comp.drainagecl) group.drainage.push(comp.drainagecl);
      if (comp.hydgrp) group.hydgrp.push(comp.hydgrp);
      if (comp.slope_r) group.slopes.push(comp.slope_r);
    }

    // Add farmland class from map units
    for (const mu of mapUnits) {
      if (mu.farmlndcl) {
        const muComponents = components.filter(c => c.compname);
        for (const comp of muComponents) {
          const group = soilGroups.get(comp.compname);
          if (group) {
            group.farmland.push(mu.farmlndcl);
          }
        }
      }
    }

    // Convert to array and sort by percentage
    const totalPct = Array.from(soilGroups.values()).reduce((sum, g) => sum + g.totalPct, 0);

    return Array.from(soilGroups.values())
      .sort((a, b) => b.totalPct - a.totalPct)
      .slice(0, 5) // Top 5 soils
      .map(group => ({
        name: group.name,
        percentage: Math.round((group.totalPct / totalPct) * 100),
        description: this.generateSoilDescription(group),
        drainageClass: this.getMostCommon(group.drainage),
        hydrologicGroup: this.getMostCommon(group.hydgrp),
        slopeRange: group.slopes.length > 0
          ? `${Math.min(...group.slopes)}-${Math.max(...group.slopes)}%`
          : undefined,
        farmlandClass: this.getMostCommon(group.farmland),
      }));
  }

  private generateSoilDescription(group: {
    name: string;
    drainage: string[];
    hydgrp: string[];
    slopes: number[];
  }): string {
    const parts: string[] = [];

    const drainage = this.getMostCommon(group.drainage);
    if (drainage) {
      parts.push(drainage.toLowerCase());
    }

    if (group.slopes.length > 0) {
      const avgSlope = group.slopes.reduce((a, b) => a + b, 0) / group.slopes.length;
      if (avgSlope < 3) parts.push('nearly level');
      else if (avgSlope < 8) parts.push('gently sloping');
      else if (avgSlope < 15) parts.push('moderately sloping');
      else parts.push('steep');
    }

    const hydgrp = this.getMostCommon(group.hydgrp);
    if (hydgrp) {
      const hydDesc: Record<string, string> = {
        'A': 'high infiltration',
        'B': 'moderate infiltration',
        'C': 'slow infiltration',
        'D': 'very slow infiltration',
      };
      if (hydDesc[hydgrp]) parts.push(hydDesc[hydgrp]);
    }

    return parts.length > 0
      ? parts.join(', ').replace(/^./, c => c.toUpperCase()) + ' soil.'
      : 'Soil characteristics vary.';
  }

  private generateInsights(mapUnits: SoilMapUnit[], components: SoilComponent[]): SoilInsight[] {
    const insights: SoilInsight[] = [];

    // Analyze drainage
    const drainageClasses = components.map(c => c.drainagecl).filter(Boolean);
    const poorDrainage = drainageClasses.filter(d =>
      d?.toLowerCase().includes('poor') || d?.toLowerCase().includes('somewhat poor')
    );
    if (poorDrainage.length > drainageClasses.length * 0.3) {
      insights.push({
        type: 'limitation',
        category: 'drainage',
        title: 'Drainage Concerns',
        description: 'A significant portion of this area has poor to somewhat poorly drained soils. Consider drainage improvements or selecting water-tolerant crops.',
        severity: 'medium',
      });
    }

    // Analyze capability class
    const capClasses = components.map(c => c.nirrcapcl).filter(Boolean);
    const primeAg = capClasses.filter(c => c === '1' || c === '2' || c === '2e' || c === '2s' || c === '2w');
    if (primeAg.length > capClasses.length * 0.5) {
      insights.push({
        type: 'strength',
        category: 'productivity',
        title: 'Prime Agricultural Land',
        description: 'Over half of this area consists of prime farmland with excellent agricultural potential.',
        severity: 'low',
      });
    }

    // Analyze farmland classification
    const primeFarmland = mapUnits.filter(mu =>
      mu.farmlndcl?.toLowerCase().includes('prime') ||
      mu.farmlndcl?.toLowerCase().includes('farmland of statewide')
    );
    if (primeFarmland.length > 0) {
      insights.push({
        type: 'strength',
        category: 'classification',
        title: 'USDA Prime Farmland',
        description: `This area contains ${primeFarmland.length === mapUnits.length ? 'all' : 'some'} soils classified as prime farmland or farmland of statewide importance.`,
      });
    }

    // Analyze slope
    const slopes = components.map(c => c.slope_r).filter(Boolean) as number[];
    const avgSlope = slopes.length > 0 ? slopes.reduce((a, b) => a + b, 0) / slopes.length : 0;
    if (avgSlope > 8) {
      insights.push({
        type: 'limitation',
        category: 'erosion',
        title: 'Erosion Risk',
        description: 'Steeper slopes in this area may require erosion control measures such as contour farming, cover crops, or terracing.',
        severity: avgSlope > 15 ? 'high' : 'medium',
      });
    }

    // Analyze hydrologic group
    const hydGroups = components.map(c => c.hydgrp).filter(Boolean);
    const groupD = hydGroups.filter(g => g?.includes('D'));
    if (groupD.length > hydGroups.length * 0.3) {
      insights.push({
        type: 'recommendation',
        category: 'water',
        title: 'High Runoff Potential',
        description: 'Significant areas have Group D soils with high runoff potential. Consider water management practices and appropriate crop selection.',
      });
    }

    // Add general recommendations
    if (insights.length === 0) {
      insights.push({
        type: 'recommendation',
        category: 'general',
        title: 'Soil Testing Recommended',
        description: 'For best results, conduct detailed soil testing to determine specific nutrient levels and pH before planting.',
      });
    }

    return insights;
  }

  private calculateSuitability(components: SoilComponent[]): SoilSummary['suitability'] {
    // Calculate average capability class
    const capClasses = components
      .map(c => parseInt(c.nirrcapcl || '8'))
      .filter(n => !isNaN(n));
    const avgCap = capClasses.length > 0
      ? capClasses.reduce((a, b) => a + b, 0) / capClasses.length
      : 8;

    const getSuitability = (threshold: number[]): SoilSummary['suitability']['cropland'] => {
      if (avgCap <= threshold[0]) return 'excellent';
      if (avgCap <= threshold[1]) return 'good';
      if (avgCap <= threshold[2]) return 'fair';
      if (avgCap <= threshold[3]) return 'poor';
      return 'not_suited';
    };

    return {
      cropland: getSuitability([2, 3, 4, 6]),
      pasture: getSuitability([3, 4, 5, 7]),
      woodland: getSuitability([4, 5, 6, 7]),
      garden: getSuitability([2, 3, 4, 5]),
    };
  }

  private generateRecommendedZones(
    dominantSoils: SoilSummary['dominantSoils'],
    components: SoilComponent[],
  ): SoilSummary['recommendedZones'] {
    const zones: SoilSummary['recommendedZones'] = [];

    // Group soils by drainage for zone recommendations
    const wellDrained = dominantSoils.filter(s =>
      s.drainageClass?.toLowerCase().includes('well')
    );
    const poorlyDrained = dominantSoils.filter(s =>
      s.drainageClass?.toLowerCase().includes('poor')
    );

    if (wellDrained.length > 0) {
      zones.push({
        type: 'crops',
        title: 'Upland Crop Zone',
        name: 'Upland Crop Zone',
        description: 'Well-drained areas suitable for most crops and orchards.',
        soilTypes: wellDrained.map(s => s.name),
        suggestedUses: ['Row crops', 'Orchards', 'Vegetables', 'Berries'],
      });
    }

    if (poorlyDrained.length > 0) {
      zones.push({
        type: 'drainage',
        title: 'Wetland/Buffer Zone',
        name: 'Wetland/Buffer Zone',
        description: 'Areas with higher moisture - consider water-tolerant plants or conservation use.',
        soilTypes: poorlyDrained.map(s => s.name),
        suggestedUses: ['Wetland crops', 'Riparian buffer', 'Wildlife habitat', 'Rain garden'],
      });
    }

    // Check for prime farmland
    const primeFarmland = dominantSoils.filter(s =>
      s.farmlandClass?.toLowerCase().includes('prime')
    );
    if (primeFarmland.length > 0 && zones.length === 0) {
      zones.push({
        type: 'garden',
        title: 'Prime Agricultural Zone',
        name: 'Prime Agricultural Zone',
        description: 'USDA-classified prime farmland with excellent growing potential.',
        soilTypes: primeFarmland.map(s => s.name),
        suggestedUses: ['Cash crops', 'Market garden', 'Hay production'],
      });
    }

    return zones;
  }

  private createEmptySummary(bounds: SoilSummary['queryBounds']): SoilSummary {
    return {
      provider: this.name,
      queryBounds: bounds,
      totalAcres: 0,
      mapUnits: [],
      dominantSoils: [],
      insights: [{
        type: 'recommendation',
        category: 'data',
        title: 'No Soil Data Available',
        description: 'No soil survey data is available for this location. This may be outside the US or in an unsurveyed area.',
      }],
      suitability: {
        cropland: 'not_suited',
        pasture: 'not_suited',
        woodland: 'not_suited',
        garden: 'not_suited',
      },
      recommendedZones: [],
    };
  }

  private polygonToWKT(polygon: GeoJSONPolygon): string {
    const coords = polygon.coordinates[0]
      .map(([lng, lat]) => `${lng} ${lat}`)
      .join(', ');
    return `POLYGON((${coords}))`;
  }

  private getBoundsFromPolygon(polygon: GeoJSONPolygon): SoilSummary['queryBounds'] {
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

  private getMostCommon<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;

    const counts = new Map<T, number>();
    for (const item of arr) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }

    let maxCount = 0;
    let mostCommon: T | undefined;
    for (const [item, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    }

    return mostCommon;
  }
}
