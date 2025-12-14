import { useState, useEffect } from "react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { LandBoundaryPanel } from "./sidebar/LandBoundaryPanel";
import { SoilInsightsPanel } from "./sidebar/SoilInsightsPanel";
import { RecommendedZonesPanel } from "./sidebar/RecommendedZonesPanel";
import { MapToolsPanel } from "./sidebar/MapToolsPanel";
import { Boundary, SoilSummary, SoilFeatureCollection } from "@/types";
import { soilService } from "@/services/soil.service";
import { toast } from "sonner";

interface SidebarProps {
  hasBoundary: boolean;
  boundary?: Boundary;
  acres?: number;
  perimeter?: number;
  onDrawBoundary: () => void;
  onImportBoundary: () => void;
  onRedraw?: () => void;
  onAddMarker: (type: string) => void;
  onDrawPath: () => void;
  onDrawZone: () => void;
  selectedSoil: string | null;
  onSelectSoil: (soilName: string | null) => void;
  onSoilGeometriesLoaded?: (geometries: SoilFeatureCollection | null) => void;
}

export function Sidebar({
  hasBoundary,
  boundary,
  acres,
  perimeter,
  onDrawBoundary,
  onImportBoundary,
  onRedraw,
  onAddMarker,
  onDrawPath,
  onDrawZone,
  selectedSoil,
  onSelectSoil,
  onSoilGeometriesLoaded,
}: SidebarProps) {
  const [soilData, setSoilData] = useState<SoilSummary | null>(null);
  const [isLoadingSoil, setIsLoadingSoil] = useState(false);

  // Fetch soil data and geometries when boundary changes
  useEffect(() => {
    if (!boundary?.geojson) {
      setSoilData(null);
      onSoilGeometriesLoaded?.(null);
      return;
    }

    async function fetchSoilData() {
      setIsLoadingSoil(true);
      try {
        // Fetch summary and geometries in parallel
        const [data, geometries] = await Promise.all([
          soilService.getSoilSummary(boundary!.geojson),
          soilService.getSoilGeometries(boundary!.geojson).catch(() => null),
        ]);
        setSoilData(data);
        onSoilGeometriesLoaded?.(geometries);
      } catch (err) {
        console.error('Failed to fetch soil data:', err);
        toast.error('Failed to load soil data');
        setSoilData(null);
        onSoilGeometriesLoaded?.(null);
      } finally {
        setIsLoadingSoil(false);
      }
    }

    fetchSoilData();
  }, [boundary?.geojson, onSoilGeometriesLoaded]);

  return (
    <div className="w-80 min-w-80 border-r border-border bg-card flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 h-0">
        <div className="p-6 space-y-6">
          <LandBoundaryPanel
            hasBoundary={hasBoundary}
            acres={acres}
            perimeter={perimeter}
            onDrawBoundary={onDrawBoundary}
            onImportBoundary={onImportBoundary}
            onRedraw={onRedraw}
          />

          <Separator />

          <SoilInsightsPanel
            soilData={soilData}
            isLoading={isLoadingSoil}
            hasBoundary={hasBoundary}
            selectedSoil={selectedSoil}
            onSelectSoil={onSelectSoil}
          />

          <Separator />

          <RecommendedZonesPanel
            recommendations={soilData?.recommendedZones || []}
            hasBoundary={hasBoundary}
          />

          <Separator />

          <MapToolsPanel
            onAddMarker={onAddMarker}
            onDrawPath={onDrawPath}
            onDrawZone={onDrawZone}
          />
        </div>
      </ScrollArea>
    </div>
  );
}