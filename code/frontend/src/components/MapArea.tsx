import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix Leaflet default icon paths
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// UI components
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Layers, MapPin, Loader2, PenTool, Focus } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Card } from './ui/card';

// Types and utilities
import { Boundary, SoilWmsConfig, SoilFeatureCollection, MapMarker, MapPath, MapZone, MarkerType } from '@/types';
import {
  calculateAcres,
  calculatePerimeterFeet,
  polygonToGeoJSON,
  geoJSONToLatLngs,
} from '@/lib/geo-utils';
import { soilService } from '@/services/soil.service';
import { toast } from 'sonner';

interface MapAreaProps {
  // Location for centering
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  // Existing boundary to display
  boundary?: Boundary;

  // Drawing mode
  isDrawing: boolean;
  onDrawBoundary: () => void;
  onDrawComplete: (boundary: Boundary) => void;
  onDrawCancel: () => void;

  // Soil layer toggle
  showSoilLayer: boolean;
  onToggleSoilLayer: (show: boolean) => void;

  // Soil polygon highlighting
  soilGeometries?: SoilFeatureCollection | null;
  selectedSoil?: string | null;
  onSelectSoil?: (soilName: string | null) => void;

  // Map annotations
  markers?: MapMarker[];
  paths?: MapPath[];
  zones?: MapZone[];
  drawingMode?: 'none' | 'boundary' | 'marker' | 'path' | 'zone';
  pendingMarkerType?: MarkerType | null;
  onMarkerPlaced?: (coordinates: [number, number]) => void;
  onPathComplete?: (coordinates: [number, number][]) => void;
  onZoneComplete?: (coordinates: [number, number][]) => void;
  onDeleteMarker?: (markerId: string) => void;
  onDeletePath?: (pathId: string) => void;
  onDeleteZone?: (zoneId: string) => void;
}

// ESRI World Imagery (free satellite tiles, no API key required)
const SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics';

// Primary color for boundary (yellow for visibility on satellite imagery)
const BOUNDARY_COLOR = '#FFD700';

// Color palette for soil types (distinct colors for visibility on satellite)
const SOIL_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
  '#F8B500', // Orange
  '#58D68D', // Green
  '#EC7063', // Coral
  '#5DADE2', // Blue
  '#F0B27A', // Peach
];

// Get consistent color for a soil name
function getSoilColor(soilName: string, allSoilNames: string[]): string {
  const index = allSoilNames.indexOf(soilName);
  return SOIL_COLORS[index % SOIL_COLORS.length];
}

// Marker colors by type (must match MapToolsPanel)
const MARKER_COLORS: Record<MarkerType, string> = {
  'tree': '#2D5F3F',
  'barn': '#92400E',
  'sugar-shack': '#D4A574',
  'water': '#0EA5E9',
  'gate': '#8B5CF6',
  'other': '#78716C',
};

// Zone colors - semi-transparent
const ZONE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

// Path color
const PATH_COLOR = '#F97316'; // Orange

// Create a custom marker icon
function createMarkerIcon(type: MarkerType): L.DivIcon {
  const color = MARKER_COLORS[type] || MARKER_COLORS.other;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

export function MapArea({
  address,
  city,
  state,
  zipCode,
  latitude,
  longitude,
  boundary,
  isDrawing,
  onDrawBoundary,
  onDrawComplete,
  onDrawCancel,
  showSoilLayer,
  onToggleSoilLayer,
  soilGeometries,
  selectedSoil,
  onSelectSoil,
  markers = [],
  paths = [],
  zones = [],
  drawingMode = 'none',
  pendingMarkerType: _pendingMarkerType,
  onMarkerPlaced,
  onPathComplete,
  onZoneComplete,
  onDeleteMarker,
  onDeletePath,
  onDeleteZone,
}: MapAreaProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const boundaryLayerRef = useRef<L.Polygon | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const soilLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const soilPolygonsRef = useRef<L.LayerGroup | null>(null);
  // Map annotation layers
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pathsLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  // Drawing state for paths/zones
  const drawingPointsRef = useRef<L.LatLng[]>([]);
  const tempLineRef = useRef<L.Polyline | null>(null);
  const tempPolygonRef = useRef<L.Polygon | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [isLoading, setIsLoading] = useState(!mapCenter);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [wmsConfig, setWmsConfig] = useState<SoilWmsConfig | null>(null);

  // Geocode address if no coordinates provided
  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
      setIsLoading(false);
      return;
    }

    const location = [address, city, state, zipCode].filter(Boolean).join(', ');
    if (!location) {
      setIsLoading(false);
      return;
    }

    async function geocode() {
      try {
        setIsLoading(true);
        setGeocodeError(null);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
          { headers: { 'User-Agent': 'HobbyFarmPlanner/1.0' } }
        );

        const data = await response.json();
        if (data?.[0]) {
          setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setGeocodeError('Location not found');
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setGeocodeError('Failed to load location');
      } finally {
        setIsLoading(false);
      }
    }

    geocode();
  }, [address, city, state, zipCode, latitude, longitude]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !mapCenter || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: 17,
      zoomControl: false,
    });

    // Add satellite tiles
    L.tileLayer(SATELLITE_TILE_URL, {
      attribution: SATELLITE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    // Create feature group for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    mapInstanceRef.current = map;
    setMapReady(true);

    // Global click handler for delete buttons using event delegation
    const handleContainerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const deleteBtn = target.closest('[class*="delete-"][class*="-btn"]') as HTMLButtonElement;
      if (!deleteBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const id = deleteBtn.dataset.id;
      if (!id) return;

      if (deleteBtn.classList.contains('delete-marker-btn')) {
        // Will be handled by the callback passed to component
        const event = new CustomEvent('delete-marker', { detail: { id } });
        mapContainerRef.current?.dispatchEvent(event);
      } else if (deleteBtn.classList.contains('delete-path-btn')) {
        const event = new CustomEvent('delete-path', { detail: { id } });
        mapContainerRef.current?.dispatchEvent(event);
      } else if (deleteBtn.classList.contains('delete-zone-btn')) {
        const event = new CustomEvent('delete-zone', { detail: { id } });
        mapContainerRef.current?.dispatchEvent(event);
      }
    };

    // Listen on the Leaflet pane container to catch popup clicks
    const paneContainer = map.getPane('popupPane');
    paneContainer?.addEventListener('click', handleContainerClick);

    return () => {
      paneContainer?.removeEventListener('click', handleContainerClick);
      map.remove();
      mapInstanceRef.current = null;
      drawnItemsRef.current = null;
      boundaryLayerRef.current = null;
      setMapReady(false);
    };
  }, [mapCenter]);

  // Listen for custom delete events from popup buttons
  useEffect(() => {
    const container = mapContainerRef.current;
    const map = mapInstanceRef.current;
    if (!container || !map) return;

    const handleDeleteMarker = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      if (id && onDeleteMarker) {
        onDeleteMarker(id);
        map.closePopup();
      }
    };

    const handleDeletePath = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      if (id && onDeletePath) {
        onDeletePath(id);
        map.closePopup();
      }
    };

    const handleDeleteZone = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      if (id && onDeleteZone) {
        onDeleteZone(id);
        map.closePopup();
      }
    };

    container.addEventListener('delete-marker', handleDeleteMarker);
    container.addEventListener('delete-path', handleDeletePath);
    container.addEventListener('delete-zone', handleDeleteZone);

    return () => {
      container.removeEventListener('delete-marker', handleDeleteMarker);
      container.removeEventListener('delete-path', handleDeletePath);
      container.removeEventListener('delete-zone', handleDeleteZone);
    };
  }, [onDeleteMarker, onDeletePath, onDeleteZone]);

  // Update map center when coordinates change (after map is already initialized)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !latitude || !longitude) return;

    // Only update if coordinates are different from current center
    const currentCenter = map.getCenter();
    if (
      Math.abs(currentCenter.lat - latitude) > 0.0001 ||
      Math.abs(currentCenter.lng - longitude) > 0.0001
    ) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude]);

  // Display existing boundary
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove old boundary layer
    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (!boundary || isDrawing) return;

    // Add new boundary
    const latlngs = geoJSONToLatLngs(boundary.geojson);
    const polygon = L.polygon(latlngs, {
      color: BOUNDARY_COLOR,
      weight: 3,
      fillColor: BOUNDARY_COLOR,
      fillOpacity: 0.15,
      dashArray: '8, 4',
    });

    polygon.addTo(map);
    boundaryLayerRef.current = polygon;

    // Only fit to boundary if no saved coordinates (let saved coords take priority)
    if (!latitude && !longitude) {
      map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
    }
  }, [boundary, isDrawing, latitude, longitude, mapReady]);

  // Handle drawing mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    const drawnItems = drawnItemsRef.current;
    if (!map || !drawnItems || !mapReady) return;

    if (isDrawing) {
      // Remove existing boundary while drawing
      if (boundaryLayerRef.current) {
        map.removeLayer(boundaryLayerRef.current);
        boundaryLayerRef.current = null;
      }

      // Add draw control
      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            shapeOptions: {
              color: BOUNDARY_COLOR,
              weight: 3,
              fillOpacity: 0.2,
            },
          },
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: false,
        },
      });

      map.addControl(drawControl);
      drawControlRef.current = drawControl;

      // Handle draw complete
      const handleDrawCreated = (e: L.LeafletEvent) => {
        const event = e as L.DrawEvents.Created;
        const layer = event.layer as L.Polygon;
        drawnItems.addLayer(layer);

        const latlngs = (layer.getLatLngs()[0] as L.LatLng[]).slice();
        const acres = calculateAcres(latlngs);
        const perimeterFeet = calculatePerimeterFeet(latlngs);
        const geojson = polygonToGeoJSON(latlngs);

        onDrawComplete({
          geojson,
          acres,
          perimeterFeet,
        });
      };

      map.on(L.Draw.Event.CREATED, handleDrawCreated);

      // Cleanup
      return () => {
        map.off(L.Draw.Event.CREATED, handleDrawCreated);
        if (drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null;
        }
        drawnItems.clearLayers();
      };
    } else {
      // Clear drawn items when not drawing
      drawnItems.clearLayers();
    }
  }, [isDrawing, onDrawComplete, mapReady]);

  // Fetch WMS config on mount
  useEffect(() => {
    async function fetchWmsConfig() {
      try {
        const config = await soilService.getWmsConfig();
        setWmsConfig(config);
      } catch (err) {
        console.error('Failed to fetch soil WMS config:', err);
      }
    }
    fetchWmsConfig();
  }, []);

  // Toggle soil layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing soil layer if present
    if (soilLayerRef.current) {
      map.removeLayer(soilLayerRef.current);
      soilLayerRef.current = null;
    }

    // Add soil layer if toggle is on and config is available
    if (showSoilLayer && wmsConfig) {
      const soilLayer = L.tileLayer.wms(wmsConfig.url, {
        layers: wmsConfig.layers,
        format: wmsConfig.format,
        transparent: wmsConfig.transparent,
        version: wmsConfig.version || '1.1.1',
        attribution: wmsConfig.attribution,
        opacity: 0.6,
      });

      soilLayer.addTo(map);
      soilLayerRef.current = soilLayer;
    }
  }, [showSoilLayer, wmsConfig, mapReady]);

  // Render soil polygon overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing soil polygons
    if (soilPolygonsRef.current) {
      map.removeLayer(soilPolygonsRef.current);
      soilPolygonsRef.current = null;
    }

    // Only render if we have soil geometries
    if (!soilGeometries?.features?.length) return;

    // Check if we're in any drawing mode
    const isDrawingActive = drawingMode !== 'none';

    // Get unique soil names for consistent color assignment
    const uniqueSoilNames = [...new Set(soilGeometries.features.map(f => f.properties.muname))];

    // Create layer group for soil polygons
    const layerGroup = L.layerGroup();

    soilGeometries.features.forEach((feature) => {
      const { muname, musym } = feature.properties;
      const color = getSoilColor(muname, uniqueSoilNames);
      // Match by exact name, or if either starts with the other (e.g., "Fox" matches "Fox sandy loam")
      const isSelected = selectedSoil === muname ||
        (selectedSoil && muname.toLowerCase().startsWith(selectedSoil.toLowerCase())) ||
        (selectedSoil && selectedSoil.toLowerCase().startsWith(muname.toLowerCase()));

      // Convert GeoJSON coordinates to Leaflet LatLngs
      const coords = feature.geometry.coordinates[0];
      const latlngs = coords.map(coord => L.latLng(coord[1], coord[0]));

      const polygon = L.polygon(latlngs, {
        color: isSelected ? '#FFFFFF' : color,
        weight: isSelected ? 3 : 2,
        fillColor: color,
        fillOpacity: isSelected ? 0.5 : 0.3,
        dashArray: isSelected ? undefined : '4, 4',
        // Disable interactions during drawing mode
        interactive: !isDrawingActive,
      });

      // Add click handler only when not drawing
      if (!isDrawingActive) {
        polygon.on('click', () => {
          if (onSelectSoil) {
            onSelectSoil(isSelected ? null : muname);
          }
        });

        // Add tooltip with soil info only when not drawing
        polygon.bindTooltip(`<strong>${musym}</strong><br/>${muname}`, {
          sticky: true,
          className: 'soil-tooltip',
        });
      }

      layerGroup.addLayer(polygon);
    });

    layerGroup.addTo(map);
    soilPolygonsRef.current = layerGroup;
  }, [soilGeometries, selectedSoil, onSelectSoil, mapReady, drawingMode]);

  // Render saved markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing markers layer
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
      markersLayerRef.current = null;
    }

    if (!markers.length) return;

    const layerGroup = L.layerGroup();

    markers.forEach((marker) => {
      const icon = createMarkerIcon(marker.type);
      const leafletMarker = L.marker(marker.coordinates, { icon });

      // Add popup with delete option
      const popupContent = `
        <div style="text-align: center;">
          <strong>${marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}</strong>
          ${marker.label ? `<br/>${marker.label}` : ''}
          ${marker.notes ? `<br/><small>${marker.notes}</small>` : ''}
          <br/><button class="delete-marker-btn" data-id="${marker.id}" style="
            margin-top: 8px;
            padding: 4px 8px;
            background: #EF4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Delete</button>
        </div>
      `;
      leafletMarker.bindPopup(popupContent);

      layerGroup.addLayer(leafletMarker);
    });

    layerGroup.addTo(map);
    markersLayerRef.current = layerGroup;
  }, [markers, mapReady]);

  // Render saved paths
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing paths layer
    if (pathsLayerRef.current) {
      map.removeLayer(pathsLayerRef.current);
      pathsLayerRef.current = null;
    }

    if (!paths.length) return;

    const layerGroup = L.layerGroup();

    paths.forEach((path) => {
      const color = path.color || PATH_COLOR;
      const polyline = L.polyline(path.coordinates, {
        color,
        weight: 3,
        opacity: 0.8,
      });

      const lengthStr = path.lengthFeet
        ? `${Math.round(path.lengthFeet).toLocaleString()} ft`
        : '';

      polyline.bindPopup(`
        <div style="text-align: center;">
          <strong>${path.name || 'Path'}</strong>
          ${lengthStr ? `<br/>${lengthStr}` : ''}
          <br/><button class="delete-path-btn" data-id="${path.id}" style="
            margin-top: 8px;
            padding: 4px 8px;
            background: #EF4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Delete</button>
        </div>
      `);

      layerGroup.addLayer(polyline);
    });

    layerGroup.addTo(map);
    pathsLayerRef.current = layerGroup;
  }, [paths, mapReady]);

  // Render saved zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing zones layer
    if (zonesLayerRef.current) {
      map.removeLayer(zonesLayerRef.current);
      zonesLayerRef.current = null;
    }

    if (!zones.length) return;

    const layerGroup = L.layerGroup();

    zones.forEach((zone, index) => {
      const color = zone.color || ZONE_COLORS[index % ZONE_COLORS.length];
      const coords = zone.geojson.coordinates[0];
      const latlngs = coords.map(coord => L.latLng(coord[1], coord[0]));

      const polygon = L.polygon(latlngs, {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.25,
      });

      const acresStr = zone.acres ? `${zone.acres.toFixed(2)} acres` : '';

      polygon.bindPopup(`
        <div style="text-align: center;">
          <strong>${zone.name || zone.zoneType || 'Zone'}</strong>
          ${acresStr ? `<br/>${acresStr}` : ''}
          <br/><button class="delete-zone-btn" data-id="${zone.id}" style="
            margin-top: 8px;
            padding: 4px 8px;
            background: #EF4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Delete</button>
        </div>
      `);

      layerGroup.addLayer(polygon);
    });

    layerGroup.addTo(map);
    zonesLayerRef.current = layerGroup;
  }, [zones, mapReady]);

  // Handle marker placement mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (drawingMode !== 'marker') return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (onMarkerPlaced) {
        onMarkerPlaced([e.latlng.lat, e.latlng.lng]);
      }
    };

    map.on('click', handleMapClick);
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleMapClick);
      map.getContainer().style.cursor = '';
    };
  }, [drawingMode, mapReady, onMarkerPlaced]);

  // Handle path drawing mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (drawingMode !== 'path') {
      // Clean up when exiting path mode
      if (tempLineRef.current) {
        map.removeLayer(tempLineRef.current);
        tempLineRef.current = null;
      }
      drawingPointsRef.current = [];
      return;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      drawingPointsRef.current.push(e.latlng);

      // Update or create temp line
      if (tempLineRef.current) {
        tempLineRef.current.setLatLngs(drawingPointsRef.current);
      } else {
        tempLineRef.current = L.polyline(drawingPointsRef.current, {
          color: PATH_COLOR,
          weight: 3,
          dashArray: '5, 10',
        }).addTo(map);
      }
    };

    const handleDoubleClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      if (drawingPointsRef.current.length >= 2 && onPathComplete) {
        const coords: [number, number][] = drawingPointsRef.current.map(ll => [ll.lat, ll.lng]);
        onPathComplete(coords);
      }

      // Clean up
      if (tempLineRef.current) {
        map.removeLayer(tempLineRef.current);
        tempLineRef.current = null;
      }
      drawingPointsRef.current = [];
    };

    map.on('click', handleMapClick);
    map.on('dblclick', handleDoubleClick);
    map.doubleClickZoom.disable();
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleMapClick);
      map.off('dblclick', handleDoubleClick);
      map.doubleClickZoom.enable();
      map.getContainer().style.cursor = '';
    };
  }, [drawingMode, mapReady, onPathComplete]);

  // Handle zone drawing mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (drawingMode !== 'zone') {
      // Clean up when exiting zone mode
      if (tempPolygonRef.current) {
        map.removeLayer(tempPolygonRef.current);
        tempPolygonRef.current = null;
      }
      drawingPointsRef.current = [];
      return;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      // Check if clicking near first point to close polygon
      if (drawingPointsRef.current.length >= 3) {
        const first = drawingPointsRef.current[0];
        const distance = e.latlng.distanceTo(first);
        if (distance < 20) {
          // Close the polygon
          if (onZoneComplete) {
            const coords: [number, number][] = drawingPointsRef.current.map(ll => [ll.lat, ll.lng]);
            onZoneComplete(coords);
          }

          // Clean up
          if (tempPolygonRef.current) {
            map.removeLayer(tempPolygonRef.current);
            tempPolygonRef.current = null;
          }
          drawingPointsRef.current = [];
          return;
        }
      }

      drawingPointsRef.current.push(e.latlng);

      // Update or create temp polygon
      if (drawingPointsRef.current.length >= 3) {
        if (tempPolygonRef.current) {
          tempPolygonRef.current.setLatLngs(drawingPointsRef.current);
        } else {
          tempPolygonRef.current = L.polygon(drawingPointsRef.current, {
            color: ZONE_COLORS[0],
            weight: 2,
            fillOpacity: 0.2,
            dashArray: '5, 10',
          }).addTo(map);
        }
      }
    };

    const handleDoubleClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      if (drawingPointsRef.current.length >= 3 && onZoneComplete) {
        const coords: [number, number][] = drawingPointsRef.current.map(ll => [ll.lat, ll.lng]);
        onZoneComplete(coords);
      }

      // Clean up
      if (tempPolygonRef.current) {
        map.removeLayer(tempPolygonRef.current);
        tempPolygonRef.current = null;
      }
      drawingPointsRef.current = [];
    };

    map.on('click', handleMapClick);
    map.on('dblclick', handleDoubleClick);
    map.doubleClickZoom.disable();
    map.getContainer().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleMapClick);
      map.off('dblclick', handleDoubleClick);
      map.doubleClickZoom.enable();
      map.getContainer().style.cursor = '';
    };
  }, [drawingMode, mapReady, onZoneComplete]);

  // Custom zoom controls
  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut();
  }, []);

  const handleFitBounds = useCallback(() => {
    if (boundaryLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(boundaryLayerRef.current.getBounds(), {
        padding: [50, 50],
      });
      toast.info('Fitted to boundary');
    } else if (mapCenter && mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapCenter, 17);
      toast.info('Centered on location');
    } else {
      toast.info('No boundary or location to fit');
    }
  }, [mapCenter]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const newValue = !prev;
      // Invalidate map size after state change to ensure proper rendering
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      if (newValue) {
        toast.info('Fullscreen mode enabled');
      }
      return newValue;
    });
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // No location state
  if (!mapCenter) {
    return (
      <div className="flex-1 min-h-0 bg-muted/30 flex items-center justify-center">
        <div className="text-center max-w-md space-y-3 px-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="mb-2">No Location Set</h3>
            <p className="text-sm text-muted-foreground">
              {geocodeError || 'Add an address in Farm Settings to view the satellite map.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[1050] bg-background'
          : 'flex-1 min-h-0 relative'
      }
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Card className="p-2 flex flex-col gap-1 shadow-lg">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleFitBounds}
            title="Fit to boundary"
          >
            <Focus className="w-4 h-4" />
          </Button>
          <div className="border-t border-border my-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {!isDrawing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDrawBoundary}
              title="Draw boundary"
            >
              <PenTool className="w-4 h-4" />
            </Button>
          )}
        </Card>

        <Card className="p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Switch id="soil-layer" checked={showSoilLayer} onCheckedChange={onToggleSoilLayer} />
            <Label htmlFor="soil-layer" className="cursor-pointer flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-xs">Soil Layer</span>
            </Label>
          </div>
        </Card>
      </div>

      {/* Soil Legend */}
      {soilGeometries?.features?.length ? (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <Card className="p-3 shadow-lg max-w-[200px]">
            <p className="text-xs font-medium mb-2">Soil Types</p>
            <div className="space-y-1.5">
              {[...new Set(soilGeometries.features.map(f => f.properties.muname))].map((soilName) => {
                const uniqueSoilNames = [...new Set(soilGeometries.features.map(f => f.properties.muname))];
                const color = getSoilColor(soilName, uniqueSoilNames);
                // Match by exact name, or if either starts with the other
                const isSelected = selectedSoil === soilName ||
                  (selectedSoil && soilName.toLowerCase().startsWith(selectedSoil.toLowerCase())) ||
                  (selectedSoil && selectedSoil.toLowerCase().startsWith(soilName.toLowerCase()));
                const feature = soilGeometries.features.find(f => f.properties.muname === soilName);
                const musym = feature?.properties.musym || '';

                return (
                  <button
                    key={soilName}
                    onClick={() => onSelectSoil?.(isSelected ? null : soilName)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-colors ${
                      isSelected ? 'bg-accent ring-1 ring-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium block truncate">{musym}</span>
                      <span className="text-[10px] text-muted-foreground block truncate">{soilName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      ) : null}

      {/* Drawing Mode Indicator */}
      {(isDrawing || drawingMode !== 'none') && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <Card className="px-4 py-2 shadow-lg border-primary bg-card">
            <p className="text-sm">
              {drawingMode === 'marker' ? (
                <>
                  <strong className="text-primary">Add Marker:</strong> Click on the map to place your marker.
                </>
              ) : drawingMode === 'path' ? (
                <>
                  <strong className="text-primary">Draw Path:</strong> Click to add points. Double-click to complete.
                </>
              ) : drawingMode === 'zone' ? (
                <>
                  <strong className="text-primary">Draw Zone:</strong> Click to add points. Double-click or click first point to complete.
                </>
              ) : (
                <>
                  <strong className="text-primary">Draw Boundary:</strong> Click to add points. Double-click or click first point to complete.
                </>
              )}
            </p>
          </Card>
        </div>
      )}

      {/* Cancel Drawing Button */}
      {(isDrawing || drawingMode !== 'none') && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
          <Button variant="outline" onClick={onDrawCancel}>
            Cancel {drawingMode === 'marker' ? 'Marker' : drawingMode === 'path' ? 'Path' : drawingMode === 'zone' ? 'Zone' : 'Drawing'}
          </Button>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
