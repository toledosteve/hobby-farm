import { Warehouse, Trees, Droplet, Sprout, Flower2, Home, Mountain, LucideIcon } from "lucide-react";
import { RecommendationItem } from "../ui/RecommendationItem";
import { RecommendedZone } from "@/types";

// Map zone types to icons and colors
const zoneConfig: Record<string, { icon: LucideIcon; color: string }> = {
  building: { icon: Warehouse, color: "#92400E" },
  orchard: { icon: Trees, color: "#2D5F3F" },
  woodland: { icon: Trees, color: "#166534" },
  drainage: { icon: Droplet, color: "#52796F" },
  garden: { icon: Sprout, color: "#84A98C" },
  pasture: { icon: Mountain, color: "#65A30D" },
  crops: { icon: Flower2, color: "#CA8A04" },
  residential: { icon: Home, color: "#7C3AED" },
};

interface RecommendedZonesPanelProps {
  recommendations: RecommendedZone[];
  hasBoundary: boolean;
}

export function RecommendedZonesPanel({ recommendations, hasBoundary }: RecommendedZonesPanelProps) {
  if (!hasBoundary) {
    return (
      <div className="space-y-3">
        <h3>Recommended Zones</h3>
        <p className="text-sm text-muted-foreground py-4 text-center">
          Draw a land boundary to see zone recommendations
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-3">
        <h3>Recommended Zones</h3>
        <p className="text-sm text-muted-foreground py-4 text-center">
          Recommendations will appear after analyzing your land
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3>Recommended Zones</h3>
      <div className="space-y-2">
        {recommendations.map((zone, index) => {
          const config = zoneConfig[zone.type] || { icon: Sprout, color: "#84A98C" };
          return (
            <RecommendationItem
              key={index}
              icon={config.icon}
              title={zone.title}
              description={zone.description}
              iconColor={config.color}
            />
          );
        })}
      </div>
    </div>
  );
}
