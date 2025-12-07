import { Warehouse, Trees, Droplet, Sprout, LucideIcon } from "lucide-react";
import { RecommendationItem } from "../ui/RecommendationItem";

interface Recommendation {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}

interface RecommendedZonesPanelProps {
  recommendations: Recommendation[];
}

export function RecommendedZonesPanel({ recommendations }: RecommendedZonesPanelProps) {
  return (
    <div className="space-y-3">
      <h3>Recommended Zones</h3>
      
      {recommendations.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Recommendations will appear after analyzing your land
        </p>
      ) : (
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <RecommendationItem
              key={index}
              icon={rec.icon}
              title={rec.title}
              description={rec.description}
              iconColor={rec.iconColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}