import { Card } from "../ui/card";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import type { SeasonMetrics as SeasonMetricsType } from "./types";

interface SeasonMetricsProps {
  metrics: SeasonMetricsType;
  onCardClick?: (metric: 'taps' | 'sap' | 'boils' | 'syrup') => void;
}

export function SeasonMetrics({ metrics, onCardClick }: SeasonMetricsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-primary" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-muted-foreground" />;
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const metricCards = [
    {
      id: 'taps' as const,
      label: 'Taps Installed',
      value: metrics.tapsInstalled,
      suffix: 'taps',
      trend: metrics.trends.taps,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'sap' as const,
      label: 'Sap Collected',
      value: metrics.sapCollected.toFixed(1),
      suffix: 'gal',
      trend: metrics.trends.sap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'boils' as const,
      label: 'Boils Completed',
      value: metrics.boilsCompleted,
      suffix: 'sessions',
      trend: metrics.trends.boils,
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      id: 'syrup' as const,
      label: 'Syrup Produced',
      value: metrics.syrupProduced.toFixed(2),
      suffix: 'gal',
      trend: metrics.trends.syrup,
      color: 'text-amber-600 dark:text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card) => (
        <Card
          key={card.id}
          className={`p-5 ${
            onCardClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
          }`}
          onClick={() => onCardClick?.(card.id)}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground leading-tight">{card.label}</p>
            {onCardClick && (
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-2xl font-semibold">{card.value}</h3>
            <span className="text-xs text-muted-foreground">{card.suffix}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {getTrendIcon(card.trend)}
            <span>vs. last week</span>
          </div>
        </Card>
      ))}
    </div>
  );
}