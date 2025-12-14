import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { LandBoundaryPanel } from "./sidebar/LandBoundaryPanel";
import { SoilInsightsPanel } from "./sidebar/SoilInsightsPanel";
import { RecommendedZonesPanel } from "./sidebar/RecommendedZonesPanel";
import { MapToolsPanel } from "./sidebar/MapToolsPanel";
import { Warehouse, Trees, Droplet, Sprout, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface SidebarProps {
  hasBoundary: boolean;
  acres?: number;
  perimeter?: number;
  onDrawBoundary: () => void;
  onImportBoundary: () => void;
  onRedraw?: () => void;
  onAddMarker: (type: string) => void;
  onDrawPath: () => void;
  onDrawZone: () => void;
}

export function Sidebar({
  hasBoundary,
  acres,
  perimeter,
  onDrawBoundary,
  onImportBoundary,
  onRedraw,
  onAddMarker,
  onDrawPath,
  onDrawZone,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mockSoils = hasBoundary ? [
    {
      name: "Urban Land-Udorthents",
      description: "Well-drained soils formed in human-modified materials. Moderate suitability for most uses.",
      tags: ["Well-drained", "Moderate depth"],
      color: "#84A98C",
    },
    {
      name: "Windsor Loamy Sand",
      description: "Excessively drained sandy soils. Good for drought-tolerant crops and orchards.",
      tags: ["Well-drained", "Good for orchards", "Sandy"],
      color: "#D4A574",
    },
    {
      name: "Canton Fine Sandy Loam",
      description: "Well-drained soils with moderate limitations. Not ideal for building foundations.",
      tags: ["Well-drained", "Poor for buildings"],
      color: "#52796F",
    },
  ] : [];

  const mockRecommendations = hasBoundary ? [
    {
      icon: Warehouse,
      title: "Best area for barn or sugar shack",
      description: "Northwest corner has well-drained soil and good access",
      iconColor: "#92400E",
    },
    {
      icon: Trees,
      title: "Maple grove potential",
      description: "Eastern section has ideal slope and soil for sugar maples",
      iconColor: "#2D5F3F",
    },
    {
      icon: Droplet,
      title: "Water drainage concern",
      description: "Southern area may need drainage improvement",
      iconColor: "#52796F",
    },
    {
      icon: Sprout,
      title: "Garden zone",
      description: "Central area has best soil for vegetable gardens",
      iconColor: "#84A98C",
    },
  ] : [];

  return (
    <div 
      className={`border-r border-border bg-card flex flex-col h-full relative transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-96'
      }`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-10 h-8 w-6 rounded-md border bg-card shadow-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            <LandBoundaryPanel
              hasBoundary={hasBoundary}
              acres={acres}
              perimeter={perimeter}
              onDrawBoundary={onDrawBoundary}
              onImportBoundary={onImportBoundary}
              onRedraw={onRedraw}
            />

            <Separator />

            <SoilInsightsPanel soils={mockSoils} />

            <Separator />

            <RecommendedZonesPanel recommendations={mockRecommendations} />

            <Separator />

            <MapToolsPanel
              onAddMarker={onAddMarker}
              onDrawPath={onDrawPath}
              onDrawZone={onDrawZone}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}