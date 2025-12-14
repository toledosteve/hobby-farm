import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

// ESRI World Imagery tiles
const SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics';

interface LocationPickerProps {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({
  address,
  city,
  state,
  zipCode,
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [localLat, setLocalLat] = useState<string>(latitude?.toString() || '');
  const [localLng, setLocalLng] = useState<string>(longitude?.toString() || '');

  // Default center (US center) if no coordinates
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 4;

  // Update local state when props change
  useEffect(() => {
    if (latitude !== undefined) {
      setLocalLat(latitude.toString());
    }
    if (longitude !== undefined) {
      setLocalLng(longitude.toString());
    }
  }, [latitude, longitude]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] =
      latitude && longitude ? [latitude, longitude] : defaultCenter;
    const initialZoom = latitude && longitude ? 17 : defaultZoom;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
    });

    L.tileLayer(SATELLITE_TILE_URL, {
      attribution: SATELLITE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add marker if we have coordinates
    if (latitude && longitude) {
      const marker = L.marker([latitude, longitude], {
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setLocalLat(pos.lat.toFixed(6));
        setLocalLng(pos.lng.toFixed(6));
        onLocationChange(pos.lat, pos.lng);
        toast.success('Location updated');
      });

      markerRef.current = marker;
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // Only run once on mount

  // Update marker position when coordinates change from outside
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (latitude && longitude) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude], {
          draggable: true,
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setLocalLat(pos.lat.toFixed(6));
          setLocalLng(pos.lng.toFixed(6));
          onLocationChange(pos.lat, pos.lng);
          toast.success('Location updated');
        });

        markerRef.current = marker;
      }
      map.setView([latitude, longitude], 17);
    }
  }, [latitude, longitude, onLocationChange]);

  // Geocode address and place marker
  const handleLookupAddress = useCallback(async () => {
    const location = [address, city, state, zipCode].filter(Boolean).join(', ');

    if (!location) {
      toast.error('Please enter an address first');
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
        { headers: { 'User-Agent': 'HobbyFarmPlanner/1.0' } }
      );

      const data = await response.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setLocalLat(lat.toFixed(6));
        setLocalLng(lng.toFixed(6));
        onLocationChange(lat, lng);

        const map = mapInstanceRef.current;
        if (map) {
          // Add or update marker
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const marker = L.marker([lat, lng], {
              draggable: true,
            }).addTo(map);

            marker.on('dragend', () => {
              const pos = marker.getLatLng();
              setLocalLat(pos.lat.toFixed(6));
              setLocalLng(pos.lng.toFixed(6));
              onLocationChange(pos.lat, pos.lng);
              toast.success('Location updated');
            });

            markerRef.current = marker;
          }

          map.setView([lat, lng], 17);
        }

        toast.success('Address found! Drag the pin to adjust if needed.');
      } else {
        toast.error('Could not find that address. Try being more specific.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      toast.error('Failed to look up address');
    } finally {
      setIsGeocoding(false);
    }
  }, [address, city, state, zipCode, onLocationChange]);

  // Handle manual coordinate input
  const handleLatChange = (value: string) => {
    setLocalLat(value);
    const lat = parseFloat(value);
    const lng = parseFloat(localLng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90) {
      onLocationChange(lat, lng);
      updateMarkerPosition(lat, lng);
    }
  };

  const handleLngChange = (value: string) => {
    setLocalLng(value);
    const lat = parseFloat(localLat);
    const lng = parseFloat(value);
    if (!isNaN(lat) && !isNaN(lng) && lng >= -180 && lng <= 180) {
      onLocationChange(lat, lng);
      updateMarkerPosition(lat, lng);
    }
  };

  const updateMarkerPosition = (lat: number, lng: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], {
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setLocalLat(pos.lat.toFixed(6));
        setLocalLng(pos.lng.toFixed(6));
        onLocationChange(pos.lat, pos.lng);
        toast.success('Location updated');
      });

      markerRef.current = marker;
    }

    map.setView([lat, lng], map.getZoom() < 10 ? 17 : map.getZoom());
  };

  return (
    <div className="space-y-4">
      {/* Lookup button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleLookupAddress}
          disabled={isGeocoding}
          className="flex-1"
        >
          {isGeocoding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Lookup Address
            </>
          )}
        </Button>
      </div>

      {/* Mini map */}
      <div className="relative rounded-lg overflow-hidden border border-border">
        <div ref={mapContainerRef} className="w-full h-[200px]" />
        {!latitude && !longitude && (
          <div className="absolute inset-0 bg-muted/80 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click "Lookup Address" to find your location
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Coordinate inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="text"
            value={localLat}
            onChange={(e) => handleLatChange(e.target.value)}
            placeholder="e.g. 42.3601"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="text"
            value={localLng}
            onChange={(e) => handleLngChange(e.target.value)}
            placeholder="e.g. -71.0589"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Drag the pin on the map to fine-tune your location, or enter coordinates directly.
      </p>
    </div>
  );
}
