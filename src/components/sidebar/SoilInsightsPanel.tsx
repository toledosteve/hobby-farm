import { SoilCard } from "../ui/SoilCard";

interface SoilType {
  name: string;
  description: string;
  tags: string[];
  color: string;
}

interface SoilInsightsPanelProps {
  soils: SoilType[];
}

export function SoilInsightsPanel({ soils }: SoilInsightsPanelProps) {
  return (
    <div className="space-y-3">
      <h3>Soil Insights</h3>
      
      {soils.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Draw a land boundary to see soil information
        </p>
      ) : (
        <div className="space-y-2">
          {soils.map((soil, index) => (
            <SoilCard
              key={index}
              name={soil.name}
              description={soil.description}
              tags={soil.tags}
              color={soil.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
