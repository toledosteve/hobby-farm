import { MapMode } from "./types";
import { cn } from "../ui/utils";

interface MapModeBarProps {
  selectedMode: MapMode;
  onModeChange: (mode: MapMode) => void;
}

export function MapModeBar({
  selectedMode,
  onModeChange,
}: MapModeBarProps) {
  const modes: Array<{ id: MapMode; icon: string; label: string; shortLabel: string }> = [
    {
      id: 'land-suitability',
      icon: '🌱',
      label: 'Land Suitability',
      shortLabel: 'Land',
    },
    {
      id: 'trees-orchard',
      icon: '🌳',
      label: 'Trees & Orchard',
      shortLabel: 'Trees',
    },
    {
      id: 'poultry-livestock',
      icon: '🐔',
      label: 'Poultry & Livestock',
      shortLabel: 'Poultry',
    },
    {
      id: 'pollination-bees',
      icon: '🐝',
      label: 'Pollination & Bees',
      shortLabel: 'Bees',
    },
    {
      id: 'weather-water',
      icon: '🌦',
      label: 'Weather & Water',
      shortLabel: 'Weather',
    },
    {
      id: 'planning',
      icon: '🗓',
      label: 'Planning',
      shortLabel: 'Planning',
    },
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-muted-foreground mr-2 whitespace-nowrap">
          Map Mode:
        </span>
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all border whitespace-nowrap",
              selectedMode === mode.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-white border-border hover:bg-muted/50'
            )}
          >
            <span className="text-base">{mode.icon}</span>
            <span className="text-sm font-medium">{mode.shortLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
