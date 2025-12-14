import { Loader2, CheckCircle, AlertTriangle, Lightbulb, Info } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { SoilSummary, SoilInsight, DominantSoil } from "@/types";
import { soilService } from "@/services/soil.service";
import { toast } from "sonner";

// Color palette for soil types (must match MapArea.tsx)
const SOIL_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
  '#F8B500', // Orange
  '#58D68D', // Green
  '#EC7063', // Coral
  '#5DADE2', // Blue
  '#F0B27A', // Peach
];

function getSoilColor(soilName: string, allSoilNames: string[]): string {
  const index = allSoilNames.indexOf(soilName);
  return SOIL_COLORS[index % SOIL_COLORS.length];
}

interface SoilInsightsPanelProps {
  soilData: SoilSummary | null;
  isLoading: boolean;
  hasBoundary: boolean;
  selectedSoil?: string | null;
  onSelectSoil?: (soilName: string | null) => void;
}

function InsightIcon({ type }: { type: SoilInsight['type'] }) {
  switch (type) {
    case 'strength':
      return <CheckCircle className="w-4 h-4" />;
    case 'limitation':
      return <AlertTriangle className="w-4 h-4" />;
    case 'recommendation':
      return <Lightbulb className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
}

function DominantSoilCard({
  soil,
  isSelected,
  onClick,
  color,
}: {
  soil: DominantSoil;
  isSelected?: boolean;
  onClick?: () => void;
  color: string;
}) {
  const drainageColor = soilService.getDrainageColor(soil.drainageClass);

  return (
    <Card
      className={`p-4 transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-primary shadow-md bg-primary/5'
          : 'hover:shadow-md hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-3 h-3 rounded-sm mt-1 flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium">{soil.name}</h4>
            <Badge variant="secondary" className="text-xs">
              {soil.percentage}%
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {soil.drainageClass && (
              <Badge variant="outline" className={`text-xs ${drainageColor}`}>
                {soil.drainageClass}
              </Badge>
            )}
            {soil.farmlandClass && (
              <Badge variant="outline" className="text-xs">
                {soil.farmlandClass}
              </Badge>
            )}
            {soil.capabilityClass && (
              <Badge variant="outline" className="text-xs">
                Class {soil.capabilityClass}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function InsightCard({ insight }: { insight: SoilInsight }) {
  const colors = soilService.getInsightColor(insight.type, insight.severity);

  return (
    <div className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-2">
        <div className={`mt-0.5 ${colors.text}`}>
          <InsightIcon type={insight.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${colors.text}`}>{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}

function SuitabilitySection({ suitability }: { suitability: SoilSummary['suitability'] }) {
  const items = [
    { key: 'cropland', label: 'Cropland' },
    { key: 'pasture', label: 'Pasture' },
    { key: 'woodland', label: 'Woodland' },
    { key: 'garden', label: 'Garden' },
  ] as const;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Suitability</h4>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ key, label }) => {
          const rating = suitability[key];
          const format = soilService.formatSuitability(rating);
          return (
            <div
              key={key}
              className={`px-3 py-2 rounded-lg ${format.bgColor} ${format.color}`}
            >
              <p className="text-xs font-medium">{label}</p>
              <p className="text-xs opacity-80">{format.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SoilInsightsPanel({
  soilData,
  isLoading,
  hasBoundary,
  selectedSoil,
  onSelectSoil,
}: SoilInsightsPanelProps) {
  if (!hasBoundary) {
    return (
      <div className="space-y-3">
        <h3>Soil Insights</h3>
        <p className="text-sm text-muted-foreground py-4 text-center">
          Draw a land boundary to see soil information
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3>Soil Insights</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading soil data...</span>
        </div>
      </div>
    );
  }

  if (!soilData) {
    return (
      <div className="space-y-3">
        <h3>Soil Insights</h3>
        <p className="text-sm text-muted-foreground py-4 text-center">
          No soil data available for this area
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3>Soil Insights</h3>

      {/* Dominant Soils */}
      {soilData.dominantSoils.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Dominant Soils
            {selectedSoil && (
              <button
                className="ml-2 text-xs text-primary hover:underline"
                onClick={() => onSelectSoil?.(null)}
              >
                Clear selection
              </button>
            )}
          </h4>
          <div className="space-y-2">
            {soilData.dominantSoils.slice(0, 3).map((soil, index) => {
              const allSoilNames = soilData.dominantSoils.map(s => s.name);
              const color = getSoilColor(soil.name, allSoilNames);
              // Match by exact name, or if selectedSoil (from map click) starts with soil.name
              const isSelected = selectedSoil === soil.name ||
                (selectedSoil?.toLowerCase().startsWith(soil.name.toLowerCase()) ?? false);
              return (
                <DominantSoilCard
                  key={index}
                  soil={soil}
                  isSelected={isSelected}
                  color={color}
                  onClick={() => {
                    const newSelection = isSelected ? null : soil.name;
                    onSelectSoil?.(newSelection);
                    if (newSelection) {
                      toast.info(`Selected: ${soil.name}`, {
                        description: soil.description || `${soil.percentage}% of your land`,
                      });
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Suitability Ratings */}
      <SuitabilitySection suitability={soilData.suitability} />

      {/* Key Insights */}
      {soilData.insights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Key Insights</h4>
          <div className="space-y-2">
            {soilData.insights.slice(0, 4).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
