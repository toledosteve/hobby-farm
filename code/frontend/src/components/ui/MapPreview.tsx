import { useState, useEffect, useRef } from "react";
import { MapPin as MapPinIcon, Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in webpack/vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapPreviewProps {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  className?: string;
  zoom?: number;
  interactive?: boolean;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export function MapPreview({
  address,
  city,
  state,
  zipCode,
  latitude,
  longitude,
  className = "",
  zoom = 13,
  interactive = false
}: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build full address for geocoding - more specific = more accurate
  const location = [address, city, state, zipCode].filter(Boolean).join(', ');

  // Use saved coordinates or geocode the location
  useEffect(() => {
    // If we have saved coordinates, use them directly
    if (latitude && longitude) {
      setCoordinates({ lat: latitude, lon: longitude });
      setIsLoading(false);
      setError(null);
      return;
    }

    // Otherwise, try to geocode the address
    async function geocodeLocation() {
      if (!location) {
        setIsLoading(false);
        setError('No location set');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use Nominatim (OpenStreetMap's geocoding service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
          {
            headers: {
              'User-Agent': 'HobbyFarmPlanner/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Geocoding failed');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          });
        } else {
          setError('Location not found');
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setError('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    }

    geocodeLocation();
  }, [latitude, longitude, location]);

  // Initialize and update the map
  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    // If map already exists, just update the view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([coordinates.lat, coordinates.lon], zoom);
      if (markerRef.current) {
        markerRef.current.setLatLng([coordinates.lat, coordinates.lon]);
      }
      return;
    }

    // Create new map instance
    const map = L.map(mapRef.current, {
      center: [coordinates.lat, coordinates.lon],
      zoom: zoom,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      zoomControl: interactive,
      attributionControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add marker
    const marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [coordinates, zoom, interactive]);

  if (isLoading) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <MapPinIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{error || 'Map unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
