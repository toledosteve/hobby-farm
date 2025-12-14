import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import {
  ChevronLeft,
  Ruler,
  MapPin,
  Square,
  Eye,
  EyeOff,
  Map as MapIcon,
  Satellite,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { cn } from "../ui/utils";
import type { MapLayer, MapTool, MapMode } from "./types";

interface LayersDrawerProps {
  mapMode: MapMode;
  layers: MapLayer[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange?: (layerId: string, opacity: number) => void;
  activeTool?: MapTool['id'] | null;
  onToolChange?: (toolId: MapTool['id'] | null) => void;
  viewType?: '2d' | 'satellite';
  onViewTypeChange?: (view: '2d' | 'satellite') => void;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFullscreen?: () => void;
}

export function LayersDrawer({
  mapMode,
  layers,
  onLayerToggle,
  onLayerOpacityChange,
  activeTool,
  onToolChange,
  viewType = '2d',
  onViewTypeChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onFullscreen,
}: LayersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showingOpacity, setShowingOpacity] = useState<string | null>(null);

  const tools: Array<{ id: MapTool['id']; name: string; icon: any }> = [
    { id: 'select', name: 'Select', icon: Square },
    { id: 'draw-area', name: 'Draw', icon: Square },
    { id: 'measure', name: 'Measure', icon: Ruler },
    { id: 'add-marker', name: 'Marker', icon: MapPin },
  ];

  const relevantLayers = layers.filter(
    (layer) => !layer.mapMode || layer.mapMode === mapMode
  );

  const dataLayers = relevantLayers.filter((l) => l.category === 'data');
  const moduleLayers = relevantLayers.filter((l) => l.category === 'module');
  const planningLayers = relevantLayers.filter((l) => l.category === 'planning');

  const LayerGroup = ({
    title,
    layers,
  }: {
    title: string;
    layers: MapLayer[];
  }) => {
    if (layers.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </h4>
        <div className="space-y-2">
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Switch
                    id={layer.id}
                    checked={layer.enabled}
                    onCheckedChange={() => onLayerToggle(layer.id)}
                  />
                  <Label
                    htmlFor={layer.id}
                    className="text-sm cursor-pointer flex-1 truncate"
                  >
                    {layer.name}
                  </Label>
                </div>
                {layer.enabled && onLayerOpacityChange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowingOpacity(
                        showingOpacity === layer.id ? null : layer.id
                      )
                    }
                  >
                    {showingOpacity === layer.id ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
              {layer.enabled &&
                showingOpacity === layer.id &&
                onLayerOpacityChange && (
                  <div className="pl-9 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Opacity
                      </span>
                      <Slider
                        value={[layer.opacity || 100]}
                        onValueChange={(value) =>
                          onLayerOpacityChange(layer.id, value[0])
                        }
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-xs font-medium w-8">
                        {layer.opacity || 100}%
                      </span>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border-2 border-r-0 border-border rounded-l-lg px-2 py-6 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex flex-col items-center gap-2">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <div className="writing-mode-vertical text-xs font-semibold">
              Layers & Tools
            </div>
          </div>
        </button>
      )}

      {/* Drawer */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl border-l-2 border-border flex flex-col z-30 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between shrink-0">
          <h2 className="font-semibold">Layers & Tools</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Map Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">
              Map Tools
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onToolChange?.(
                        activeTool === tool.id ? null : tool.id
                      )
                    }
                    className="justify-start"
                  >
                    <Icon className="w-3 h-3 mr-2" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* View Type */}
          {onViewTypeChange && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                Map View
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={viewType === '2d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewTypeChange('2d')}
                >
                  <MapIcon className="w-3 h-3 mr-2" />
                  <span className="text-xs">2D Map</span>
                </Button>
                <Button
                  variant={viewType === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewTypeChange('satellite')}
                >
                  <Satellite className="w-3 h-3 mr-2" />
                  <span className="text-xs">Satellite</span>
                </Button>
              </div>
            </div>
          )}

          {/* Zoom Controls */}
          {onZoomIn && onZoomOut && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                Zoom
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onZoomOut}
                >
                  <ZoomOut className="w-3 h-3 mr-2" />
                  <span className="text-xs">Out</span>
                </Button>
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {zoom !== undefined ? `${Math.round(zoom * 100)}%` : '100%'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onZoomIn}
                >
                  <ZoomIn className="w-3 h-3 mr-2" />
                  <span className="text-xs">In</span>
                </Button>
              </div>
            </div>
          )}

          {/* Fullscreen Control */}
          {onFullscreen && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                Fullscreen
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFullscreen}
                >
                  <Maximize2 className="w-3 h-3 mr-2" />
                  <span className="text-xs">Fullscreen</span>
                </Button>
              </div>
            </div>
          )}

          {/* Layers */}
          <div className="space-y-4">
            <LayerGroup title="Data Layers" layers={dataLayers} />
            <LayerGroup title="Module Layers" layers={moduleLayers} />
            <LayerGroup title="Planning Layers" layers={planningLayers} />
          </div>

          {relevantLayers.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No layers available for this map mode
            </div>
          )}
        </div>
      </div>
    </>
  );
}