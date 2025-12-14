import { useState } from "react";
import { MapModeBar } from "./MapModeBar";
import { InsightsDrawer } from "./InsightsDrawer";
import { LayersDrawer } from "./LayersDrawer";
import { MapArea } from "../MapArea";
import { toast } from "sonner@2.0.3";
import type { MapMode, MapLayer, MapTool, MapInsight } from "./types";
import { getMockInsights, getMockLayers } from "./mockMapData";

interface FarmIntelligenceMapProps {
  currentProject?: {
    name: string;
    acres: number;
  };
}

export function FarmIntelligenceMap({ currentProject }: FarmIntelligenceMapProps) {
  const [mapMode, setMapMode] = useState<MapMode>('land-suitability');
  const [layers, setLayers] = useState<MapLayer[]>(getMockLayers('land-suitability'));
  const [insights, setInsights] = useState<MapInsight[]>(getMockInsights('land-suitability'));
  const [selectedArea, setSelectedArea] = useState<string | undefined>();
  const [activeTool, setActiveTool] = useState<MapTool['id'] | null>(null);
  const [viewType, setViewType] = useState<'2d' | 'satellite'>('2d');
  const [zoom, setZoom] = useState(1.0);
  const [hasBoundary] = useState(true); // Assuming boundary is drawn
  const [markers] = useState<any[]>([]);

  const handleModeChange = (newMode: MapMode) => {
    setMapMode(newMode);
    setLayers(getMockLayers(newMode));
    setInsights(getMockInsights(newMode));
    setSelectedArea(undefined);
    toast.info(`Switched to ${getModeLabel(newMode)} mode`);
  };

  const getModeLabel = (mode: MapMode) => {
    switch (mode) {
      case 'land-suitability':
        return 'Land Suitability';
      case 'trees-orchard':
        return 'Trees & Orchard';
      case 'poultry-livestock':
        return 'Poultry & Livestock';
      case 'pollination-bees':
        return 'Pollination & Bees';
      case 'weather-water':
        return 'Weather & Water';
      case 'planning':
        return 'Planning';
    }
  };

  const handleLayerToggle = (layerId: string) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
    
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      toast.success(`${layer.name} ${layer.enabled ? 'hidden' : 'shown'}`);
    }
  };

  const handleLayerOpacityChange = (layerId: string, opacity: number) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  };

  const handleToolChange = (toolId: MapTool['id'] | null) => {
    setActiveTool(toolId);
    if (toolId) {
      toast.info(`${getToolLabel(toolId)} tool activated`);
    }
  };

  const getToolLabel = (toolId: MapTool['id']) => {
    switch (toolId) {
      case 'draw-area':
        return 'Draw area';
      case 'measure':
        return 'Measure';
      case 'add-marker':
        return 'Add marker';
      case 'select':
        return 'Select area';
    }
  };

  const handleInsightClick = (insight: MapInsight) => {
    toast.info(`Viewing: ${insight.title}`);
    // Could open a detailed modal or zoom to location
  };

  const handleViewTypeChange = (view: '2d' | 'satellite') => {
    setViewType(view);
    toast.info(`Switched to ${view === '2d' ? '2D map' : 'satellite'} view`);
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.1, 3));
    toast.success('Zoomed in');
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.1, 0.5));
    toast.success('Zoomed out');
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-muted/20 flex flex-col">
      {/* Map Mode Bar - Top */}
      <MapModeBar selectedMode={mapMode} onModeChange={handleModeChange} />

      {/* Map Container */}
      <div className="relative flex-1 overflow-hidden">
        {/* Insights Drawer */}
        <InsightsDrawer
          mapMode={mapMode}
          insights={insights}
          selectedArea={selectedArea}
          onInsightClick={handleInsightClick}
        />

        {/* Layers & Tools Drawer */}
        <LayersDrawer
          mapMode={mapMode}
          layers={layers}
          onLayerToggle={handleLayerToggle}
          onLayerOpacityChange={handleLayerOpacityChange}
          activeTool={activeTool}
          onToolChange={handleToolChange}
          viewType={viewType}
          onViewTypeChange={handleViewTypeChange}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFullscreen={handleFullscreen}
        />

        {/* Map Canvas */}
        <div className="w-full h-full">
          <MapArea
            hasBoundary={hasBoundary}
            markers={markers}
            showSoilLayer={layers.find((l) => l.id === 'soil-types')?.enabled ?? false}
            onToggleSoilLayer={() => {}}
          />
        </div>

        {/* Mode Indicator (bottom left) */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg border px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">{getModeLabel(mapMode)}</span>
          </div>
        </div>

        {/* Measurement Display (if measure tool active) */}
        {activeTool === 'measure' && (
          <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg border px-4 py-2">
            <div className="text-sm">
              <div className="font-medium">Measurement</div>
              <div className="text-muted-foreground">Click to measure distance</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}