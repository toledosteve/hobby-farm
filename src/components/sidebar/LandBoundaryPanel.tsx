import { Upload, Edit3 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface LandBoundaryPanelProps {
  hasBoundary: boolean;
  acres?: number;
  perimeter?: number;
  onDrawBoundary: () => void;
  onImportBoundary: () => void;
  onRedraw?: () => void;
}

export function LandBoundaryPanel({
  hasBoundary,
  acres,
  perimeter,
  onDrawBoundary,
  onImportBoundary,
  onRedraw,
}: LandBoundaryPanelProps) {
  return (
    <div className="space-y-3">
      <h3>Land Boundary</h3>
      
      {!hasBoundary ? (
        <div className="space-y-2">
          <Button 
            onClick={onDrawBoundary} 
            className="w-full justify-start gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Draw Boundary on Map
          </Button>
          <Button 
            onClick={onImportBoundary} 
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Boundary (KML / GeoJSON)
          </Button>
        </div>
      ) : (
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Area</p>
              <p className="text-lg">{acres} acres</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Perimeter</p>
              <p className="text-lg">{perimeter} ft</p>
            </div>
          </div>
          <Button 
            onClick={onRedraw} 
            variant="ghost" 
            size="sm" 
            className="w-full gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Redraw Boundary
          </Button>
        </Card>
      )}
    </div>
  );
}
