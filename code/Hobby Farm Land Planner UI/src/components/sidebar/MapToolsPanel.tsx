import { MapPin, Route, Square, Trees, Warehouse, Home } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { useState } from "react";

interface MapToolsPanelProps {
  onAddMarker: (type: string) => void;
  onDrawPath: () => void;
  onDrawZone: () => void;
}

export function MapToolsPanel({ onAddMarker, onDrawPath, onDrawZone }: MapToolsPanelProps) {
  const [markerPopoverOpen, setMarkerPopoverOpen] = useState(false);

  const markerTypes = [
    { type: 'tree', label: 'Tree', icon: Trees, color: '#2D5F3F' },
    { type: 'barn', label: 'Barn', icon: Warehouse, color: '#92400E' },
    { type: 'sugar-shack', label: 'Sugar Shack', icon: Home, color: '#D4A574' },
    { type: 'other', label: 'Other', icon: MapPin, color: '#78716C' },
  ];

  const handleMarkerSelect = (type: string) => {
    onAddMarker(type);
    setMarkerPopoverOpen(false);
  };

  return (
    <div className="space-y-3">
      <h3>Map Tools</h3>
      
      <div className="space-y-2">
        <Popover open={markerPopoverOpen} onOpenChange={setMarkerPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <MapPin className="w-4 h-4" />
              Add Marker
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1">
              {markerTypes.map((marker) => (
                <Button
                  key={marker.type}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10"
                  onClick={() => handleMarkerSelect(marker.type)}
                >
                  <div 
                    className="p-1.5 rounded"
                    style={{ backgroundColor: `${marker.color}15` }}
                  >
                    <marker.icon 
                      className="w-4 h-4" 
                      style={{ color: marker.color }} 
                    />
                  </div>
                  <span>{marker.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          onClick={onDrawPath} 
          variant="outline" 
          className="w-full justify-start gap-2"
        >
          <Route className="w-4 h-4" />
          Draw Path / Trail
        </Button>

        <Button 
          onClick={onDrawZone} 
          variant="outline" 
          className="w-full justify-start gap-2"
        >
          <Square className="w-4 h-4" />
          Draw Zone
        </Button>
      </div>
    </div>
  );
}