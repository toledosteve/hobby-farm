import { ZoomIn, ZoomOut, Maximize2, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { useState } from "react";

interface Marker {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
}

interface MapAreaProps {
  hasBoundary: boolean;
  markers?: Marker[];
  showSoilLayer: boolean;
  onToggleSoilLayer: (show: boolean) => void;
}

export function MapArea({ 
  hasBoundary, 
  markers = [],
  showSoilLayer,
  onToggleSoilLayer 
}: MapAreaProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex-1 bg-muted/30 relative">
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Card className="p-2 flex flex-col gap-1 shadow-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </Card>

        <Card className="p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Switch 
              id="soil-layer" 
              checked={showSoilLayer}
              onCheckedChange={onToggleSoilLayer}
            />
            <Label htmlFor="soil-layer" className="cursor-pointer flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-xs">Soil Layer</span>
            </Label>
          </div>
        </Card>
      </div>

      {/* Map Canvas */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div 
          className="relative bg-white rounded-lg shadow-inner border-2 border-border w-full h-full"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
        >
          {!hasBoundary ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2D5F3F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2">Draw Your Land Boundary</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the sidebar to draw or import your land boundary to get started
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Background grid */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                <defs>
                  <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
              </svg>

              {/* Sample land boundary */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polygon
                  points="150,100 450,120 480,350 280,380 120,300"
                  fill="#2D5F3F"
                  fillOpacity="0.05"
                  stroke="#2D5F3F"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
              </svg>

              {/* Soil layers (when enabled) */}
              {showSoilLayer && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <polygon
                    points="150,100 300,110 280,200 150,220"
                    fill="#84A98C"
                    fillOpacity="0.2"
                    stroke="#84A98C"
                    strokeWidth="1"
                  />
                  <polygon
                    points="300,110 450,120 480,250 350,240"
                    fill="#D4A574"
                    fillOpacity="0.2"
                    stroke="#D4A574"
                    strokeWidth="1"
                  />
                  <polygon
                    points="150,220 280,200 280,380 120,300"
                    fill="#52796F"
                    fillOpacity="0.2"
                    stroke="#52796F"
                    strokeWidth="1"
                  />
                </svg>
              )}

              {/* Sample markers */}
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-full cursor-pointer group"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="#2D5F3F"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                      {marker.label}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
