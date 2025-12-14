import L from 'leaflet';
import { GeoJSONPolygon } from '@/types';

/**
 * Calculate polygon area in acres using geodesic calculation
 * Uses the Shoelace formula adapted for geographic coordinates
 */
export function calculateAcres(latlngs: L.LatLng[] | { lat: number; lng: number }[]): number {
  if (latlngs.length < 3) return 0;

  // Convert to L.LatLng if needed
  const points = latlngs.map(p => {
    if (p instanceof L.LatLng) return p;
    return L.latLng(p.lat, p.lng);
  });

  // Calculate area in square meters using Leaflet's geodesic area
  // We need to ensure the polygon is closed for calculation
  const closedLatLngs = [...points];
  if (
    closedLatLngs[0].lat !== closedLatLngs[closedLatLngs.length - 1].lat ||
    closedLatLngs[0].lng !== closedLatLngs[closedLatLngs.length - 1].lng
  ) {
    closedLatLngs.push(closedLatLngs[0]);
  }

  // Use spherical geometry for accurate area calculation
  let area = 0;
  const R = 6371000; // Earth's radius in meters

  for (let i = 0; i < closedLatLngs.length - 1; i++) {
    const p1 = closedLatLngs[i];
    const p2 = closedLatLngs[i + 1];

    // Convert to radians
    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const lng1 = (p1.lng * Math.PI) / 180;
    const lng2 = (p2.lng * Math.PI) / 180;

    // Spherical excess formula
    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs((area * R * R) / 2);

  // Convert square meters to acres (1 acre = 4046.86 sq meters)
  const acres = area / 4046.86;
  return Math.round(acres * 100) / 100;
}

/**
 * Calculate polygon perimeter in feet
 */
export function calculatePerimeterFeet(latlngs: L.LatLng[]): number {
  if (latlngs.length < 2) return 0;

  let perimeterMeters = 0;
  for (let i = 0; i < latlngs.length; i++) {
    const next = (i + 1) % latlngs.length;
    perimeterMeters += latlngs[i].distanceTo(latlngs[next]);
  }

  // Convert meters to feet
  const feet = perimeterMeters * 3.28084;
  return Math.round(feet);
}

/**
 * Calculate path length in feet
 * Unlike perimeter, this is an open line (doesn't close back to start)
 */
export function calculatePathLength(latlngs: L.LatLng[] | { lat: number; lng: number }[]): number {
  if (latlngs.length < 2) return 0;

  // Convert to L.LatLng if needed
  const points = latlngs.map(p => {
    if (p instanceof L.LatLng) return p;
    return L.latLng(p.lat, p.lng);
  });

  let lengthMeters = 0;
  for (let i = 0; i < points.length - 1; i++) {
    lengthMeters += points[i].distanceTo(points[i + 1]);
  }

  // Convert meters to feet
  return lengthMeters * 3.28084;
}

/**
 * Convert Leaflet LatLng array to GeoJSON Polygon
 * GeoJSON uses [longitude, latitude] order (opposite of Leaflet)
 */
export function polygonToGeoJSON(latlngs: L.LatLng[]): GeoJSONPolygon {
  // Convert to [lng, lat] coordinates
  const coordinates = latlngs.map((ll) => [ll.lng, ll.lat]);

  // Close the polygon by adding first point at the end
  if (
    coordinates.length > 0 &&
    (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1])
  ) {
    coordinates.push([...coordinates[0]]);
  }

  return {
    type: 'Polygon',
    coordinates: [coordinates],
  };
}

/**
 * Convert GeoJSON Polygon to Leaflet LatLng array
 */
export function geoJSONToLatLngs(geojson: GeoJSONPolygon): L.LatLng[] {
  const coords = geojson.coordinates[0];
  // Remove closing point and convert [lng, lat] to LatLng
  const points = coords.slice(0, -1);
  return points.map((coord) => L.latLng(coord[1], coord[0]));
}

/**
 * Parse KML file to GeoJSON polygon
 */
export async function parseKML(file: File): Promise<GeoJSONPolygon | null> {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    // Find coordinates element
    const coordinatesEl = doc.querySelector('coordinates');
    if (!coordinatesEl) return null;

    const coordText = coordinatesEl.textContent?.trim() || '';

    // Parse KML coordinates (lng,lat,altitude format)
    const coords = coordText
      .split(/\s+/)
      .map((point) => {
        const parts = point.split(',');
        if (parts.length < 2) return null;
        const lng = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        return [lng, lat] as [number, number];
      })
      .filter((c): c is [number, number] => c !== null && !isNaN(c[0]) && !isNaN(c[1]));

    if (coords.length < 3) return null;

    // Ensure polygon is closed
    if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
      coords.push([...coords[0]]);
    }

    return { type: 'Polygon', coordinates: [coords] };
  } catch (err) {
    console.error('Error parsing KML:', err);
    return null;
  }
}

/**
 * Parse GeoJSON file to polygon
 */
export async function parseGeoJSON(file: File): Promise<GeoJSONPolygon | null> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Handle FeatureCollection
    if (data.type === 'FeatureCollection' && data.features?.length > 0) {
      const feature = data.features.find(
        (f: { geometry?: { type?: string } }) => f.geometry?.type === 'Polygon'
      );
      if (feature?.geometry) {
        return feature.geometry as GeoJSONPolygon;
      }
    }

    // Handle Feature
    if (data.type === 'Feature' && data.geometry?.type === 'Polygon') {
      return data.geometry as GeoJSONPolygon;
    }

    // Handle direct Polygon
    if (data.type === 'Polygon' && data.coordinates) {
      return data as GeoJSONPolygon;
    }

    return null;
  } catch (err) {
    console.error('Error parsing GeoJSON:', err);
    return null;
  }
}

/**
 * Get center point of a polygon
 */
export function getPolygonCenter(latlngs: L.LatLng[]): L.LatLng {
  if (latlngs.length === 0) {
    return L.latLng(0, 0);
  }

  let latSum = 0;
  let lngSum = 0;

  for (const point of latlngs) {
    latSum += point.lat;
    lngSum += point.lng;
  }

  return L.latLng(latSum / latlngs.length, lngSum / latlngs.length);
}
